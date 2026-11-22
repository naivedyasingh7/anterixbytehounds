import os
import json
import shutil
import torch
import numpy as np
from sklearn.metrics import (
    accuracy_score, precision_recall_fscore_support,
    confusion_matrix, matthews_corrcoef, cohen_kappa_score
)

def save_checkpoint(model, optimizer, scheduler, ema_model, epoch, metrics, config, path):
    """
    Saves robust training checkpoint containing model weights, optimizer state,
    scheduler state, EMA weights, training state, and metrics.
    """
    os.makedirs(os.path.dirname(path), exist_ok=True)
    base_dir = os.path.dirname(path)
    
    trainable_layers = [name for name, p in model.named_parameters() if p.requires_grad]
    
    checkpoint = {
        'epoch': epoch,
        'model_state_dict': model.state_dict(),
        'optimizer_state_dict': optimizer.state_dict() if optimizer else None,
        'scheduler_state_dict': scheduler.state_dict() if scheduler else None,
        'ema_state_dict': ema_model.state_dict() if ema_model else None,
        'metrics': metrics,
        'config': config.to_dict() if hasattr(config, 'to_dict') else config,
        'trainable_layers': trainable_layers
    }
    torch.save(checkpoint, path)

    # Save auxiliary checkpoint files
    if optimizer:
        torch.save(optimizer.state_dict(), os.path.join(base_dir, 'optimizer.pth'))
    if scheduler:
        torch.save(scheduler.state_dict(), os.path.join(base_dir, 'scheduler.pth'))
    if ema_model:
        torch.save(ema_model.state_dict(), os.path.join(base_dir, 'ema_model.pth'))
        
    state_json = {
        'epoch': epoch,
        'metrics': metrics,
        'trainable_layers': trainable_layers
    }
    with open(os.path.join(base_dir, 'training_state.json'), 'w') as f:
        json.dump(state_json, f, indent=4)

def load_checkpoint(model, path, optimizer=None, scheduler=None, ema_model=None, device='cpu'):
    """
    Loads complete training state from checkpoint path onto target device.
    """
    if not os.path.exists(path):
        raise FileNotFoundError(f"No checkpoint found at '{path}'")
        
    checkpoint = torch.load(path, map_location=device, weights_only=False)
    model.load_state_dict(checkpoint['model_state_dict'])
    
    if optimizer and checkpoint.get('optimizer_state_dict'):
        optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
        
    sched_state = checkpoint.get('scheduler_state_dict', None)
    if scheduler and sched_state:
        try:
            scheduler.load_state_dict(sched_state)
        except Exception as e:
            print(f"Warning loading scheduler state: {e}")
            
    if ema_model and checkpoint.get('ema_state_dict'):
        ema_model.load_state_dict(checkpoint['ema_state_dict'])
        
    return checkpoint.get('epoch', 0), checkpoint.get('metrics', {}), sched_state

def calculate_topk_accuracy(outputs: torch.Tensor, targets: torch.Tensor, topk=(1, 3)) -> dict:
    """Computes Top-K accuracies (e.g. Top-1 and Top-3)."""
    with torch.no_grad():
        maxk = max(topk)
        batch_size = targets.size(0)
        _, pred = outputs.topk(maxk, 1, True, True)
        pred = pred.t()
        correct = pred.eq(targets.view(1, -1).expand_as(pred))

        res = {}
        for k in topk:
            correct_k = correct[:k].reshape(-1).float().sum(0, keepdim=True)
            res[f'top{k}'] = float((correct_k / batch_size).item())
        return res

def calculate_metrics(y_true, y_pred, loss=0.0, y_probs=None):
    """
    Computes comprehensive research-grade classification metrics:
    Macro/Weighted Precision, Recall, F1, Per-Class Metrics, MCC, Cohen Kappa, Confusion Matrix.
    """
    y_true_np = np.array(y_true)
    y_pred_np = np.array(y_pred)
    
    acc = float(accuracy_score(y_true_np, y_pred_np))
    
    # Macro metrics
    macro_prec, macro_rec, macro_f1, _ = precision_recall_fscore_support(
        y_true_np, y_pred_np, average='macro', zero_division=0
    )
    
    # Weighted metrics
    weighted_prec, weighted_rec, weighted_f1, _ = precision_recall_fscore_support(
        y_true_np, y_pred_np, average='weighted', zero_division=0
    )
    
    # Per-class metrics
    pc_prec, pc_rec, pc_f1, pc_support = precision_recall_fscore_support(
        y_true_np, y_pred_np, average=None, zero_division=0
    )
    
    # Confusion matrix
    cm = confusion_matrix(y_true_np, y_pred_np).tolist()
    cm_np = np.array(cm)
    
    per_class_acc = []
    for i in range(len(cm_np)):
        tot = np.sum(cm_np[i, :])
        cor = cm_np[i, i]
        per_class_acc.append(round(float(cor / tot), 4) if tot > 0 else 0.0)

    # Matthews Correlation Coefficient & Cohen's Kappa
    try:
        mcc = float(matthews_corrcoef(y_true_np, y_pred_np))
    except Exception:
        mcc = 0.0
        
    try:
        kappa = float(cohen_kappa_score(y_true_np, y_pred_np))
    except Exception:
        kappa = 0.0

    return {
        'loss': float(loss),
        'accuracy': float(acc),
        'precision': float(macro_prec),
        'recall': float(macro_rec),
        'f1': float(macro_f1),
        'weighted_precision': float(weighted_prec),
        'weighted_recall': float(weighted_rec),
        'weighted_f1': float(weighted_f1),
        'mcc': float(mcc),
        'cohen_kappa': float(kappa),
        'per_class_accuracy': per_class_acc,
        'per_class_precision': [round(float(x), 4) for x in pc_prec],
        'per_class_recall': [round(float(x), 4) for x in pc_rec],
        'per_class_f1': [round(float(x), 4) for x in pc_f1],
        'confusion_matrix': cm
    }

def generate_model_summary(model, config, num_classes):
    """Generates detailed model summary text."""
    total_params = sum(p.numel() for p in model.parameters())
    trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
    frozen_params = total_params - trainable_params
    
    summary = f"""==================================================
PRODUCTION MODEL ARCHITECTURE SUMMARY
==================================================
Model Architecture: {config.MODEL_NAME}
Total Parameters:   {total_params:,}
Trainable Params:   {trainable_params:,} ({(trainable_params/total_params)*100:.2f}%)
Frozen Parameters:  {frozen_params:,} ({(frozen_params/total_params)*100:.2f}%)
Input Resolution:   {config.IMG_SIZE}x{config.IMG_SIZE}
Channels Last:      {config.CHANNELS_LAST}
Output Classes:     {num_classes}

TRAINING ENGINE & HYPERPARAMETERS
--------------------------------------------------
Fine-Tune Stage:    {config.FINE_TUNE_STAGE}
Unfrozen Blocks:    {config.UNFREEZE_BLOCKS if config.FINE_TUNE_STAGE == 'partial' else ('All' if config.FINE_TUNE_STAGE == 'full' else 'None')}
Optimizer:          {config.OPTIMIZER}
Scheduler:          {config.SCHEDULER} (Warmup={config.ENABLE_WARMUP})
Loss Function:      {config.LOSS_FUNCTION}
Label Smoothing:    {config.LABEL_SMOOTHING}
EMA Decay:          {config.EMA_DECAY if config.USE_EMA else 'Disabled'}
LR Classifier Head: {config.LEARNING_RATE_HEAD}
LR Stage 4 Blocks:  {config.LEARNING_RATE_STAGE4}
LR Earlier Backbone:{config.LEARNING_RATE_BACKBONE}
Weight Decay:       {config.WEIGHT_DECAY}
Gradient Clip:      {config.GRADIENT_CLIP_VAL}
Accumulation Steps: {config.ACCUMULATION_STEPS}
Batch Size:         {config.BATCH_SIZE}
Epochs:             {config.EPOCHS}
Class Imbalance:    {config.CLASS_IMBALANCE_STRATEGY}
Target Device:      {config.DEVICE}
==================================================
"""
    return summary

def deploy_best_model(exp_dir, config):
    """Copies best trained model checkpoint to deployment weights directory."""
    best_model_path = os.path.join(exp_dir, "best_model.pth")
    if os.path.exists(best_model_path):
        os.makedirs(os.path.dirname(config.DEPLOYED_WEIGHTS_PATH), exist_ok=True)
        shutil.copy(best_model_path, config.DEPLOYED_WEIGHTS_PATH)
        print(f"Successfully deployed best model weights to '{config.DEPLOYED_WEIGHTS_PATH}'.")
