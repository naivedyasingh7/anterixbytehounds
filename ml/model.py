import ssl
import torch
import torch.nn as nn
from torchvision.models import convnext_tiny, ConvNeXt_Tiny_Weights
from typing import List, Dict, Any, Tuple

# Handle SSL certificate verification on macOS for downloading torchvision weights
try:
    ssl._create_default_https_context = ssl._create_unverified_context
except AttributeError:
    pass

def get_model(num_classes: int, pretrained: bool = True, dropout: float = 0.2) -> nn.Module:
    """
    Constructs ConvNeXt-Tiny model with custom classification head for PlantVillage (29 classes).
    """
    if pretrained:
        weights = ConvNeXt_Tiny_Weights.IMAGENET1K_V1
        model = convnext_tiny(weights=weights)
    else:
        model = convnext_tiny(weights=None)
        
    in_features = model.classifier[2].in_features
    
    # Custom classifier head with Dropout and Linear layer
    model.classifier[2] = nn.Sequential(
        nn.Dropout(p=dropout),
        nn.Linear(in_features, num_classes)
    )
    
    # Truncated Normal initialization for linear weights, zeros for bias
    nn.init.trunc_normal_(model.classifier[2][1].weight, std=0.02)
    nn.init.zeros_(model.classifier[2][1].bias)
    
    return model

def unfreeze_strategy(model: nn.Module, stage: str = 'partial', num_blocks: int = 2) -> nn.Module:
    """
    Applies configurable progressive unfreezing strategy to ConvNeXt-Tiny.
    
    Stages:
      - 'head_only': Freeze 100% of backbone (model.features), unfreeze ONLY classifier head (model.classifier[2]).
      - 'partial'  : Unfreeze classifier head, final feature normalization (model.features[8]),
                     and the last `num_blocks` inside Stage 4 (model.features[7]).
      - 'full'     : Unfreeze 100% of backbone and head.
    """
    # 1. Freeze 100% of model parameters first
    for param in model.parameters():
        param.requires_grad = False

    if stage == 'head_only':
        for param in model.classifier[2].parameters():
            param.requires_grad = True
        return model

    if stage == 'full':
        for param in model.parameters():
            param.requires_grad = True
        return model

    if stage == 'partial':
        # Unfreeze classifier head
        for param in model.classifier.parameters():
            param.requires_grad = True
            
        # Unfreeze final LayerNorm before classifier (features[8])
        if hasattr(model, 'features') and len(model.features) > 8:
            for param in model.features[8].parameters():
                param.requires_grad = True
                
        # Unfreeze last `num_blocks` inside Stage 4 (features[7])
        if hasattr(model, 'features') and len(model.features) > 7:
            stage4_blocks = model.features[7]
            total_blocks = len(stage4_blocks)
            unfreeze_start = max(0, total_blocks - num_blocks)
            
            for i in range(unfreeze_start, total_blocks):
                for param in stage4_blocks[i].parameters():
                    param.requires_grad = True
                    
        return model

    raise ValueError(f"Unknown unfreeze stage: '{stage}'. Expected 'head_only', 'partial', or 'full'.")

def get_parameter_groups(model: nn.Module, config) -> List[Dict[str, Any]]:
    """
    Constructs parameter groups with differential learning rates for Stage 2 training:
      - Classifier Head: highest learning rate (LEARNING_RATE_HEAD)
      - Stage 4 Unfrozen ConvNeXt Blocks: medium learning rate (LEARNING_RATE_STAGE4)
      - Earlier Backbone Layers: small learning rate (LEARNING_RATE_BACKBONE)
    Excludes frozen parameters (requires_grad = False).
    """
    head_params = []
    stage4_params = []
    earlier_backbone_params = []
    
    head_ids = set(id(p) for p in model.classifier.parameters())
    stage4_ids = set()
    if hasattr(model, 'features') and len(model.features) > 7:
        for p in model.features[7].parameters():
            stage4_ids.add(id(p))
        if len(model.features) > 8:
            for p in model.features[8].parameters():
                stage4_ids.add(id(p))

    for p in model.parameters():
        if not p.requires_grad:
            continue
        p_id = id(p)
        if p_id in head_ids:
            head_params.append(p)
        elif p_id in stage4_ids:
            stage4_params.append(p)
        else:
            earlier_backbone_params.append(p)

    param_groups = []
    if earlier_backbone_params:
        param_groups.append({
            'name': 'earlier_backbone',
            'params': earlier_backbone_params,
            'lr': config.LEARNING_RATE_BACKBONE
        })
    if stage4_params:
        param_groups.append({
            'name': 'stage4_blocks',
            'params': stage4_params,
            'lr': config.LEARNING_RATE_STAGE4
        })
    if head_params:
        param_groups.append({
            'name': 'classifier_head',
            'params': head_params,
            'lr': config.LEARNING_RATE_HEAD
        })

    return param_groups
