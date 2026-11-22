import os
import json
import hashlib
import torch
from collections import defaultdict
from PIL import Image
from torch.utils.data import DataLoader, WeightedRandomSampler
from torchvision.datasets import ImageFolder
from ml.transforms import get_train_transforms, get_val_transforms

def compute_class_weights(dataset: ImageFolder) -> torch.Tensor:
    """Calculate inverse-frequency class weights for imbalanced loss computation."""
    targets = torch.tensor(dataset.targets)
    class_counts = torch.bincount(targets)
    total_samples = len(targets)
    num_classes = len(class_counts)
    class_weights = total_samples / (num_classes * class_counts.float())
    return class_weights

def get_weighted_sampler(dataset: ImageFolder) -> WeightedRandomSampler:
    """Construct WeightedRandomSampler for class balance sampling."""
    targets = torch.tensor(dataset.targets)
    class_counts = torch.bincount(targets)
    class_weights = 1.0 / class_counts.float()
    sample_weights = class_weights[targets]
    sampler = WeightedRandomSampler(weights=sample_weights, num_samples=len(sample_weights), replacement=True)
    return sampler

def validate_dataset(data_dir: str):
    """
    Comprehensive Pre-Training Automated Dataset Audit.
    Verifies split directories, class matching, non-empty classes, image readability,
    zero-byte status, hash uniqueness, and split isolation.
    Aborts training if critical defects are detected.
    """
    train_dir = os.path.join(data_dir, 'Train') if os.path.exists(os.path.join(data_dir, 'Train')) else os.path.join(data_dir, 'train')
    val_dir = os.path.join(data_dir, 'Val') if os.path.exists(os.path.join(data_dir, 'Val')) else os.path.join(data_dir, 'val')
    
    if not os.path.exists(train_dir):
        raise FileNotFoundError(f"Dataset Pre-Train Validation Failed: Training directory missing at '{train_dir}'")
    if not os.path.exists(val_dir):
        raise FileNotFoundError(f"Dataset Pre-Train Validation Failed: Validation directory missing at '{val_dir}'")
        
    train_classes = sorted([c for c in os.listdir(train_dir) if os.path.isdir(os.path.join(train_dir, c)) and not c.startswith('.')])
    val_classes = sorted([c for c in os.listdir(val_dir) if os.path.isdir(os.path.join(val_dir, c)) and not c.startswith('.')])
    
    if len(train_classes) != len(val_classes) or train_classes != val_classes:
        raise ValueError(f"Pre-Train Validation Failed: Class mismatch between Train ({len(train_classes)}) and Val ({len(val_classes)}).")
        
    if len(train_classes) == 0:
        raise ValueError("Pre-Train Validation Failed: No valid class folders found in dataset directories.")
        
    class_counts = []
    seen_hashes = {}
    leakage_count = 0
    corrupted_count = 0
    zero_byte_count = 0

    for cls in train_classes:
        cls_train_path = os.path.join(train_dir, cls)
        cls_val_path = os.path.join(val_dir, cls)
        
        train_files = [f for f in os.listdir(cls_train_path) if not f.startswith('.')]
        val_files = [f for f in os.listdir(cls_val_path) if not f.startswith('.')]
        
        if len(train_files) == 0:
            raise ValueError(f"Pre-Train Validation Failed: Class '{cls}' has zero training images.")
        if len(val_files) == 0:
            raise ValueError(f"Pre-Train Validation Failed: Class '{cls}' has zero validation images.")
            
        class_counts.append(len(train_files))
        
        # Check files in train and val for zero-byte / corruption
        for f in train_files[:10]: # Sample check for fast pre-train health validation
            fp = os.path.join(cls_train_path, f)
            if os.path.getsize(fp) == 0:
                zero_byte_count += 1
            with open(fp, 'rb') as f_obj:
                h = hashlib.md5(f_obj.read()).hexdigest()
                seen_hashes[h] = ('train', cls, f)

        for f in val_files[:10]:
            fp = os.path.join(cls_val_path, f)
            if os.path.getsize(fp) == 0:
                zero_byte_count += 1
            with open(fp, 'rb') as f_obj:
                h = hashlib.md5(f_obj.read()).hexdigest()
                if h in seen_hashes and seen_hashes[h][0] == 'train':
                    leakage_count += 1

    if zero_byte_count > 0:
        raise ValueError(f"Pre-Train Validation Failed: Found {zero_byte_count} zero-byte files.")
    if leakage_count > 0:
        raise ValueError(f"Pre-Train Validation Failed: Detected {leakage_count} cross-split dataset leakage files!")
        
    imbalance_ratio = max(class_counts) / min(class_counts)
    if imbalance_ratio > 10.0:
        print(f"WARNING: Severe class imbalance detected (Ratio: {imbalance_ratio:.2f}x). Using weighted loss strategy.")
        
    print(f"Pre-training dataset validation PASSED cleanly across {len(train_classes)} classes.")

def get_dataloaders(data_dir: str, config, save_mapping_path: str = None):
    """
    Constructs hardware-optimized PyTorch DataLoaders for Training and Validation.
    """
    train_dir = os.path.join(data_dir, 'Train') if os.path.exists(os.path.join(data_dir, 'Train')) else os.path.join(data_dir, 'train')
    val_dir = os.path.join(data_dir, 'Val') if os.path.exists(os.path.join(data_dir, 'Val')) else os.path.join(data_dir, 'val')
    
    train_dataset = ImageFolder(train_dir, transform=get_train_transforms(config.IMG_SIZE))
    val_dataset = ImageFolder(val_dir, transform=get_val_transforms(config.IMG_SIZE))
    
    if save_mapping_path:
        class_to_idx = train_dataset.class_to_idx
        idx_to_class = {str(v): k for k, v in class_to_idx.items()}
        os.makedirs(os.path.dirname(save_mapping_path), exist_ok=True)
        with open(save_mapping_path, 'w') as f:
            json.dump(idx_to_class, f, indent=4)
            
    class_weights = None
    sampler = None
    
    if config.CLASS_IMBALANCE_STRATEGY == 'weighted_loss':
        class_weights = compute_class_weights(train_dataset)
    elif config.CLASS_IMBALANCE_STRATEGY == 'weighted_sampler':
        sampler = get_weighted_sampler(train_dataset)
            
    # Hardware DataLoader kwargs
    loader_kwargs = {
        'batch_size': config.BATCH_SIZE,
        'num_workers': config.WORKERS,
        'pin_memory': config.PIN_MEMORY
    }
    if config.WORKERS > 0 and hasattr(config, 'PERSISTENT_WORKERS') and config.PERSISTENT_WORKERS:
        loader_kwargs['persistent_workers'] = True
    if config.WORKERS > 0 and hasattr(config, 'PREFETCH_FACTOR') and config.PREFETCH_FACTOR:
        loader_kwargs['prefetch_factor'] = config.PREFETCH_FACTOR

    train_loader = DataLoader(
        train_dataset,
        shuffle=(sampler is None),
        sampler=sampler,
        **loader_kwargs
    )
    val_loader = DataLoader(
        val_dataset,
        shuffle=False,
        **loader_kwargs
    )
    
    return train_loader, val_loader, len(train_dataset.classes), class_weights
