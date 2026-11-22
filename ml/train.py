import json
import torch
import torch.nn as nn
from torch.amp import autocast, GradScaler
import argparse
import os
import shutil
import time
import math
import random
import numpy as np

from ml.config import Config
from ml.dataset import get_dataloaders, validate_dataset
from ml.model import get_model, unfreeze_strategy
from ml.ema import ModelEMA
from ml.factories import get_optimizer, get_scheduler, get_loss
from ml.logger import ExperimentLogger
from ml.utils import save_checkpoint, load_checkpoint, calculate_metrics, generate_model_summary, deploy_best_model

def set_seed(seed: int = 42):
    """Set random seed across Python, NumPy, and PyTorch for exact reproducibility."""
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)

def train_model(data_dir: str, config_path: str = None, resume_path: str = None):
    """
    Production-Grade Master Training Engine for ConvNeXt-Tiny ML Pipeline.
    Integrates ModelEMA, AMP, Gradient Accumulation, Gradient Clipping,
    NaN Guards, Loss Explosion Detection, and Automatic Deployment.
    """
    config = Config(config_path)
    set_seed(config.SEED)
    
    device = config.get_device()
    print(f"Executing master training engine on target device: {device} (Apple Silicon MPS / CUDA / CPU)")
    
    # 1. Automatic Pre-Training Dataset Health Check
    print(f"Running automatic pre-training dataset validation at '{data_dir}'...")
    validate_dataset(data_dir)
    
    # 2. Experiment Logger Setup
    logger = ExperimentLogger(config.EXPERIMENTS_DIR, config.to_dict())
    logger.info(f"Initialized experiment directory: '{logger.exp_dir}'")
    
    # 3. Data Loaders & Class Mapping
    mapping_save_path = os.path.join(logger.exp_dir, "class_mapping.json")
    train_loader, val_loader, num_classes, class_weights = get_dataloaders(
        data_dir, config, save_mapping_path=mapping_save_path
    )
    logger.info(f"Loaded {num_classes} plant disease classes from dataset.")
    
    # Extract class names list for per-class metrics reporting
    with open(mapping_save_path, 'r') as f:
        mapping_dict = json.load(f)
    class_names = [mapping_dict[str(i)] for i in range(num_classes)]
    
    # 4. Model Setup & Memory Format Optimization
    model = get_model(num_classes, dropout=config.DROPOUT).to(device)
    if getattr(config, 'CHANNELS_LAST', False) and device.type in ['cuda', 'mps']:
        try:
            model = model.to(memory_format=torch.channels_last)
        except Exception:
            pass
            
    model = unfreeze_strategy(model, config.FINE_TUNE_STAGE, config.UNFREEZE_BLOCKS)
    
    # Model Exponential Moving Average (ModelEMA)
    ema_model = ModelEMA(model, decay=config.EMA_DECAY, device=device) if config.USE_EMA else None
    
    # 5. Model Summary Generation & Logging
    summary = generate_model_summary(model, config, num_classes)
    logger.info("\n" + summary)
    logger.save_summary(summary)
    
    # 6. Loss, Optimizer, Scheduler, and AMP Setup
    if class_weights is not None:
        class_weights = class_weights.to(device)
    criterion = get_loss(config, class_weights)
    optimizer = get_optimizer(model, config)
    scheduler = get_scheduler(optimizer, config)
    
    use_amp = config.USE_AMP and (device.type in ['cuda', 'mps'])
    scaler = GradScaler('cuda') if (use_amp and device.type == 'cuda') else None
    
    start_epoch = 0
    best_metric_val = 0.0
    patience_counter = 0
    
    # 7. Checkpoint Resuming
    if resume_path and os.path.exists(resume_path):
        start_epoch, metrics, sched_state = load_checkpoint(model, resume_path, optimizer, scheduler, ema_model, device)
        best_metric_val = metrics.get(config.BEST_METRIC, 0.0)
        logger.info(f"Resumed training from epoch {start_epoch} with Best {config.BEST_METRIC.upper()}: {best_metric_val:.4f}")
        
    # 8. Master Training Loop
    trainable_params = [p for p in model.parameters() if p.requires_grad]
    accum_steps = max(1, config.ACCUMULATION_STEPS)
    
    logger.info("\nStarting Training Execution Loop...")
    for epoch in range(start_epoch, config.EPOCHS):
        epoch_start_time = time.time()
        model.train()
        
        # Maintain frozen backbone blocks in EVAL mode during partial unfreezing
        if config.FINE_TUNE_STAGE == 'partial' and hasattr(model, 'features'):
            stage4_blocks = model.features[7]
            total_blocks = len(stage4_blocks)
            unfreeze_start = max(0, total_blocks - config.UNFREEZE_BLOCKS)
            
            for i in range(7):
                model.features[i].eval()
            for i in range(0, unfreeze_start):
                stage4_blocks[i].eval()

        train_loss = 0.0
        train_preds, train_targets = [], []
        last_grad_norm = 0.0
        
        optimizer.zero_grad()
        
        for batch_idx, (inputs, targets) in enumerate(train_loader):
            inputs, targets = inputs.to(device), targets.to(device)
            if getattr(config, 'CHANNELS_LAST', False) and device.type in ['cuda', 'mps']:
                try:
                    inputs = inputs.to(memory_format=torch.channels_last)
                except Exception:
                    pass

            if scaler:
                with autocast('cuda'):
                    outputs = model(inputs)
                    loss = criterion(outputs, targets)
                    loss = loss / accum_steps
                scaler.scale(loss).backward()
                
                if (batch_idx + 1) % accum_steps == 0 or (batch_idx + 1) == len(train_loader):
                    if config.GRADIENT_CLIP_VAL > 0:
                        scaler.unscale_(optimizer)
                        norm = nn.utils.clip_grad_norm_(trainable_params, config.GRADIENT_CLIP_VAL)
                        last_grad_norm = float(norm.item()) if hasattr(norm, 'item') else float(norm)
                    scaler.step(optimizer)
                    scaler.update()
                    optimizer.zero_grad()
            else:
                outputs = model(inputs)
                loss = criterion(outputs, targets)
                loss = loss / accum_steps
                
                loss_val = loss.item() * accum_steps
                if math.isnan(loss_val) or math.isinf(loss_val) or loss_val > config.MAX_LOSS_LIMIT:
                    logger.info(f"WARNING: Invalid loss ({loss_val:.4f}) at batch {batch_idx}. Skipping step.")
                    optimizer.zero_grad()
                    continue

                loss.backward()
                
                if (batch_idx + 1) % accum_steps == 0 or (batch_idx + 1) == len(train_loader):
                    if config.GRADIENT_CLIP_VAL > 0:
                        norm = nn.utils.clip_grad_norm_(trainable_params, config.GRADIENT_CLIP_VAL)
                        last_grad_norm = float(norm.item()) if hasattr(norm, 'item') else float(norm)
                    optimizer.step()
                    optimizer.zero_grad()

            # Update ModelEMA weights
            if ema_model:
                ema_model.update(model)

            train_loss += loss.item() * accum_steps * inputs.size(0)
            preds = torch.argmax(outputs, dim=1)
            train_preds.extend(preds.cpu().numpy())
            train_targets.extend(targets.cpu().numpy())
            
        train_loss /= len(train_loader.dataset)
        train_metrics = calculate_metrics(train_targets, train_preds, loss=train_loss)
        
        # Validation Pass (evaluates using EMA model if enabled)
        eval_target_model = ema_model.module if ema_model else model
        eval_target_model.eval()
        
        val_loss = 0.0
        val_preds, val_targets = [], []
        
        with torch.no_grad():
            for inputs, targets in val_loader:
                inputs, targets = inputs.to(device), targets.to(device)
                if getattr(config, 'CHANNELS_LAST', False) and device.type in ['cuda', 'mps']:
                    try:
                        inputs = inputs.to(memory_format=torch.channels_last)
                    except Exception:
                        pass
                outputs = eval_target_model(inputs)
                loss = criterion(outputs, targets)
                val_loss += loss.item() * inputs.size(0)
                preds = torch.argmax(outputs, dim=1)
                val_preds.extend(preds.cpu().numpy())
                val_targets.extend(targets.cpu().numpy())
                
        val_loss /= len(val_loader.dataset)
        val_metrics = calculate_metrics(val_targets, val_preds, loss=val_loss)
        
        epoch_seconds = time.time() - epoch_start_time
        throughput = len(train_loader.dataset) / epoch_seconds if epoch_seconds > 0 else 0.0
        
        lr_groups = [group['lr'] for group in optimizer.param_groups]
        logger.log_epoch(
            epoch + 1, train_metrics, val_metrics, lr_groups=lr_groups,
            grad_norm=last_grad_norm, epoch_seconds=epoch_seconds, throughput=throughput
        )
        
        logger.info(
            f"Epoch [{epoch+1:02d}/{config.EPOCHS:02d}] ({epoch_seconds:.1f}s, {throughput:.1f} img/s) | "
            f"Train Loss: {train_loss:.4f} Acc: {train_metrics['accuracy']:.4f} F1: {train_metrics['f1']:.4f} | "
            f"Val Loss: {val_loss:.4f} Acc: {val_metrics['accuracy']:.4f} F1: {val_metrics['f1']:.4f} MCC: {val_metrics['mcc']:.4f}"
        )
        
        current_metric = val_metrics.get(config.BEST_METRIC, val_metrics['accuracy'])
        
        if config.SCHEDULER == 'plateau':
            scheduler.step(current_metric)
        else:
            scheduler.step()
            
        # Checkpointing & Best Model Selection
        is_best = current_metric > best_metric_val
        
        if is_best:
            best_metric_val = current_metric
            patience_counter = 0
            best_path = os.path.join(logger.exp_dir, 'best_model.pth')
            save_checkpoint(eval_target_model, optimizer, scheduler, ema_model, epoch + 1, val_metrics, config, best_path)
            logger.log_best_summary(val_metrics, class_names)
            logger.info(f"  --> Saved new BEST model checkpoint with Val {config.BEST_METRIC.upper()}: {best_metric_val:.4f}")
        else:
            patience_counter += 1
            
        if config.SAVE_LATEST and (epoch + 1) % config.CHECKPOINT_FREQ == 0:
            latest_path = os.path.join(logger.exp_dir, 'latest_model.pth')
            save_checkpoint(eval_target_model, optimizer, scheduler, ema_model, epoch + 1, val_metrics, config, latest_path)
            
        if patience_counter >= config.EARLY_STOPPING_PATIENCE:
            logger.info(f"\nEarly stopping triggered after {epoch + 1} epochs without improvement.")
            break

    logger.close()
            
    # 9. Automatic Model Deployment for FastAPI
    deploy_best_model(logger.exp_dir, config)
    shutil.copy(mapping_save_path, config.DEPLOYED_CLASS_MAPPING_PATH)
    print(f"\nSuccessfully deployed model weights to '{config.DEPLOYED_WEIGHTS_PATH}'.")
    print(f"Successfully deployed class mapping to '{config.DEPLOYED_CLASS_MAPPING_PATH}'.")
    print("ConvNeXt-Tiny Training Pipeline Execution Finished Successfully.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train ConvNeXt-Tiny ML Model")
    parser.add_argument("--data_dir", type=str, default="Dataset/Plant Village Dataset", help="Path to dataset directory")
    parser.add_argument("--config", type=str, default="configs/partial_finetune.yaml", help="Path to YAML configuration file")
    parser.add_argument("--resume", type=str, default=None, help="Path to checkpoint to resume from")
    args = parser.parse_args()
    
    train_model(args.data_dir, args.config, args.resume)
