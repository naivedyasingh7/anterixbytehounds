import os
import yaml
import torch

class Config:
    """
    Centralized YAML-configurable parameters for ConvNeXt-Tiny ML pipeline.
    Provides research-grade defaults and automatic hardware optimization.
    """
    def __init__(self, yaml_path=None):
        # Global paths
        self.BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.MODEL_DIR = os.path.join(self.BASE_DIR, "models")
        self.DEPLOYED_WEIGHTS_PATH = os.path.join(self.MODEL_DIR, "convnext_best.pth")
        self.DEPLOYED_CLASS_MAPPING_PATH = os.path.join(self.MODEL_DIR, "class_mapping.json")
        self.EXPERIMENTS_DIR = os.path.join(self.BASE_DIR, "experiments")
        
        # Model & Unfreezing Strategy
        self.MODEL_NAME = "convnext_tiny"
        self.DROPOUT = 0.2
        self.FINE_TUNE_STAGE = 'partial' # Options: 'head_only', 'partial', 'full'
        self.UNFREEZE_BLOCKS = 2        # Unfreeze blocks inside Stage 4 (1, 2, 3)
        self.CHANNELS_LAST = True       # Optimize memory layout for Tensor Cores / Apple Silicon
        
        # Optimization & Differential Learning Rates
        self.BATCH_SIZE = 32
        self.EPOCHS = 30
        self.LEARNING_RATE_HEAD = 1e-4      # Highest learning rate for classifier head
        self.LEARNING_RATE_STAGE4 = 2e-5    # Medium learning rate for Stage 4 ConvNeXt blocks
        self.LEARNING_RATE_BACKBONE = 5e-6  # Small learning rate for earlier backbone layers
        self.WEIGHT_DECAY = 1e-4
        
        # Optimizer & Schedulers
        self.OPTIMIZER = 'adamw'            # Options: 'adamw', 'sgd'
        self.SCHEDULER = 'cosine'           # Options: 'cosine', 'cosine_restarts', 'plateau', 'step'
        self.ENABLE_WARMUP = True
        self.WARMUP_EPOCHS = 3
        self.COSINE_T_ZERO = 10
        self.COSINE_T_MULT = 2
        
        # Exponential Moving Average (EMA)
        self.USE_EMA = True
        self.EMA_DECAY = 0.9999
        
        # Training Stability & Accumulation
        self.ACCUMULATION_STEPS = 1
        self.GRADIENT_CLIP_VAL = 1.0
        self.MAX_LOSS_LIMIT = 100.0
        self.EARLY_STOPPING_PATIENCE = 10
        
        # Data Pipeline & DataLoader Hardware Settings
        self.WORKERS = 4
        self.PERSISTENT_WORKERS = False
        self.PREFETCH_FACTOR = 2
        self.PIN_MEMORY = False
        
        # Loss & Imbalance Strategy
        self.LOSS_FUNCTION = 'cross_entropy'
        self.LABEL_SMOOTHING = 0.1
        self.CLASS_IMBALANCE_STRATEGY = 'weighted_loss' # Options: 'weighted_loss', 'weighted_sampler', or None
        self.BEST_METRIC = 'f1'                         # Options: 'f1', 'accuracy', 'loss'
        
        # System & Reproducibility
        self.SEED = 42
        self.IMG_SIZE = 224
        self.CHECKPOINT_FREQ = 1
        self.SAVE_LATEST = True
        self.USE_AMP = True
        self.ENABLE_TENSORBOARD = True
        
        # Device auto-detection optimized for Apple Silicon (MPS)
        if torch.backends.mps.is_available():
            self.DEVICE = 'mps'
            self.PIN_MEMORY = False          # Pinned memory is not needed for unified memory
            self.PERSISTENT_WORKERS = False
        elif torch.cuda.is_available():
            self.DEVICE = 'cuda'
            self.PIN_MEMORY = True           # Enable pinned memory for CUDA DMA transfers
            self.PERSISTENT_WORKERS = True
        else:
            self.DEVICE = 'cpu'
            self.PIN_MEMORY = False
            self.PERSISTENT_WORKERS = False

        # Override with YAML if provided
        if yaml_path and os.path.exists(yaml_path):
            with open(yaml_path, 'r') as f:
                yaml_cfg = yaml.safe_load(f)
                if yaml_cfg:
                    for k, v in yaml_cfg.items():
                        if hasattr(self, k):
                            setattr(self, k, v)

    def get_device(self) -> torch.device:
        """Return torch.device object."""
        return torch.device(self.DEVICE)
                        
    def to_dict(self) -> dict:
        """Return serializable dictionary of configuration parameters."""
        return {k: v for k, v in self.__dict__.items() if not k.startswith('__') and not callable(v)}
        
    def save_yaml(self, path: str):
        """Save configuration dictionary to YAML file."""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w') as f:
            yaml.dump(self.to_dict(), f, default_flow_style=False)
