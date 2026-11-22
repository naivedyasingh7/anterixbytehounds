import torch
import torch.nn as nn
import torch.optim as optim
from ml.model import get_parameter_groups

def get_optimizer(model: nn.Module, config) -> optim.Optimizer:
    """
    Constructs optimizer with research-grade differential learning rates.
    Ensures zero frozen parameters are passed to optimizer groups.
    """
    param_groups = get_parameter_groups(model, config)
    
    if not param_groups:
        raise ValueError("No trainable parameters found in model for optimizer initialization.")
        
    opt_name = config.OPTIMIZER.lower()
    if opt_name == 'adamw':
        return optim.AdamW(param_groups, weight_decay=config.WEIGHT_DECAY)
    elif opt_name == 'sgd':
        return optim.SGD(param_groups, momentum=0.9, weight_decay=config.WEIGHT_DECAY)
    else:
        raise ValueError(f"Unknown optimizer: '{config.OPTIMIZER}'. Expected 'adamw' or 'sgd'.")

def get_scheduler(optimizer: optim.Optimizer, config):
    """
    Constructs learning rate schedulers supporting CosineAnnealingLR,
    CosineAnnealingWarmRestarts, ReduceLROnPlateau, StepLR, and Linear Warmup.
    """
    sched_name = config.SCHEDULER.lower()
    
    if sched_name == 'cosine':
        main_scheduler = optim.lr_scheduler.CosineAnnealingLR(
            optimizer, T_max=config.EPOCHS, eta_min=1e-7
        )
    elif sched_name == 'cosine_restarts':
        t_0 = getattr(config, 'COSINE_T_ZERO', 10)
        t_mult = getattr(config, 'COSINE_T_MULT', 2)
        main_scheduler = optim.lr_scheduler.CosineAnnealingWarmRestarts(
            optimizer, T_0=t_0, T_mult=t_mult, eta_min=1e-7
        )
    elif sched_name == 'plateau':
        main_scheduler = optim.lr_scheduler.ReduceLROnPlateau(
            optimizer, mode='max', factor=0.2, patience=3, verbose=False
        )
    elif sched_name == 'step':
        main_scheduler = optim.lr_scheduler.StepLR(
            optimizer, step_size=10, gamma=0.1
        )
    else:
        raise ValueError(f"Unknown scheduler: '{config.SCHEDULER}'. Expected 'cosine', 'cosine_restarts', 'plateau', or 'step'.")

    # Linear Warmup Integration
    if getattr(config, 'ENABLE_WARMUP', False) and getattr(config, 'WARMUP_EPOCHS', 0) > 0:
        warmup_scheduler = optim.lr_scheduler.LinearLR(
            optimizer, start_factor=0.1, total_iters=config.WARMUP_EPOCHS
        )
        return optim.lr_scheduler.SequentialLR(
            optimizer, schedulers=[warmup_scheduler, main_scheduler], milestones=[config.WARMUP_EPOCHS]
        )

    return main_scheduler

def get_loss(config, class_weights: torch.Tensor = None) -> nn.Module:
    """Constructs Loss function supporting inverse-frequency class weights and label smoothing."""
    if config.LOSS_FUNCTION.lower() == 'cross_entropy':
        return nn.CrossEntropyLoss(
            weight=class_weights,
            label_smoothing=config.LABEL_SMOOTHING
        )
    else:
        raise ValueError(f"Unknown loss function: '{config.LOSS_FUNCTION}'.")
