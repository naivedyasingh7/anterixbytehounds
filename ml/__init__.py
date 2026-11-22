"""
DharaAI - Research & Production Grade ConvNeXt-Tiny ML Framework
"""

from ml.config import Config
from ml.model import get_model, unfreeze_strategy, get_parameter_groups
from ml.ema import ModelEMA
from ml.dataset import get_dataloaders, validate_dataset
from ml.factories import get_optimizer, get_scheduler, get_loss
from ml.logger import ExperimentLogger
from ml.utils import (
    save_checkpoint, load_checkpoint, calculate_metrics,
    generate_model_summary, deploy_best_model
)

__version__ = "2.0.0"
__all__ = [
    "Config",
    "get_model",
    "unfreeze_strategy",
    "get_parameter_groups",
    "ModelEMA",
    "get_dataloaders",
    "validate_dataset",
    "get_optimizer",
    "get_scheduler",
    "get_loss",
    "ExperimentLogger",
    "save_checkpoint",
    "load_checkpoint",
    "calculate_metrics",
    "generate_model_summary",
    "deploy_best_model",
]
