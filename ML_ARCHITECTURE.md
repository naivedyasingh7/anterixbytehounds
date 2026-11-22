# DharaAI: ML Framework Architecture

## Overview
The machine learning module is a production-grade, research-ready PyTorch framework designed specifically for fine-tuning ConvNeXt-Tiny on agricultural disease datasets. It seamlessly interfaces with the existing FastAPI backend while remaining isolated and heavily configurable.

## Project Structure
```text
ml/
├── config.py         # Central configuration schema and defaults
├── dataset.py        # PyTorch dataset, dataloaders, and validation
├── factories.py      # Extensible initializers for optimizers/schedulers/losses
├── inference.py      # FastAPI-compatible singleton inference engine
├── logger.py         # Experiment tracking, CSV logging, and plotting
├── model.py          # Architecture definitions and progressive unfreezing
├── train.py          # Main training loop and execution script
├── transforms.py     # Data augmentations (Train/Val/Test)
└── utils.py          # Checkpointing, metrics, and model summaries

configs/              # YAML override files for different experiment setups
experiments/          # Automatically generated experiment tracking folders
```

## Training Flow
1. **Configuration**: `ml/train.py` loads `Config()` and optionally overrides it with a `--config` YAML file.
2. **Validation**: The dataset directory is scanned to ensure classes match, images exist, and structures are sound.
3. **Experiment Setup**: A new isolated folder `experiments/exp_00X` is generated. The exact config is saved here.
4. **Data Loading**: DataLoaders are built. Class imbalance is handled either via `WeightedRandomSampler` or by passing inverse frequency weights to the `CrossEntropyLoss`.
5. **Model Initialization**: ConvNeXt-Tiny is instantiated. The unfreezing strategy (`head_only`, `partial`, or `full`) is applied.
6. **Execution**: The training loop runs. Mixed Precision (AMP) is enabled. Checkpoints are logged to the experiment folder.
7. **Deployment**: When training finishes, the "best" model weights and class mappings are copied to `models/` for inference.

## Fine-Tuning Modes
Set `FINE_TUNE_STAGE` in your YAML config:
- **`head_only`**: Freezes the entire ConvNeXt backbone. Only the newly initialized linear classifier trains. Fast, prevents catastrophic forgetting.
- **`partial`**: Unfreezes the final *N* blocks of the ConvNeXt backbone (configured by `UNFREEZE_BLOCKS`). Best for adapting to slightly different domains (like microscopic leaf textures).
- **`full`**: Unfreezes all layers. Computationally expensive, requires a very low learning rate.

## Configuration Options
All configurations can be set via YAML files in the `configs/` directory.

### Key Hyperparameters
- `OPTIMIZER`: `'adamw'` or `'sgd'`
- `SCHEDULER`: `'plateau'` or `'cosine'`
- `CLASS_IMBALANCE_STRATEGY`: `'weighted_loss'`, `'weighted_sampler'`, or `None`
- `LEARNING_RATE_BACKBONE`: Applies to ConvNeXt feature layers.
- `LEARNING_RATE_HEAD`: Applies to the classifier head (usually 10x higher).

### Example YAML
```yaml
FINE_TUNE_STAGE: 'partial'
UNFREEZE_BLOCKS: 2
EPOCHS: 30
BATCH_SIZE: 32
LEARNING_RATE_BACKBONE: 0.00001
LEARNING_RATE_HEAD: 0.0001
OPTIMIZER: 'adamw'
CLASS_IMBALANCE_STRATEGY: 'weighted_loss'
```

## Inference Flow
The `ConvNeXtInference` class in `ml/inference.py` uses a Singleton pattern to ensure the model is loaded into VRAM exactly once.
- **Initialization**: Validates that `models/convnext_best.pth` and `class_mapping.json` exist. If not, it fails gracefully.
- **Execution**: Converts OpenCV BGR images to RGB, applies `get_test_transforms`, and runs inference using `torch.no_grad()`.
- **Extensibility**: The pipeline is decoupled to allow easy transitions to TorchScript or ONNX in the future.

## Adding New Features
- **New Optimizers/Losses**: Add them to `ml/factories.py`.
- **New Augmentations**: Add them to `ml/transforms.py`. (e.g., MixUp or Test Time Augmentation).
- **New Datasets**: Point `ml.train --data_dir /path/` to any ImageFolder-compliant directory. The model automatically adjusts output classes.
