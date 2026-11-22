# DharaAI - Production ML Pipeline Training Guide

This guide provides complete documentation for training, fine-tuning, evaluating, and deploying the **ConvNeXt-Tiny** deep learning model for crop disease classification across 29 plant categories.

---

## 🏛️ Project & ML Framework Architecture

```
ml/
├── __init__.py          # Package exports
├── config.py            # Centralized YAML configuration & hardware auto-detection
├── dataset.py           # Pre-training automated dataset health audit & hardware DataLoaders
├── model.py             # ConvNeXt-Tiny architecture, progressive unfreezing, parameter groups
├── ema.py               # Exponential Moving Average (ModelEMA) for weight smoothing
├── factories.py         # Optimizers (AdamW, SGD), Schedulers (Cosine, Warmup), Loss functions
├── logger.py            # Experiment logger generating CSVs, curves, logs, metrics, markdown summaries
├── utils.py             # Advanced metrics (Macro/Weighted F1, MCC, Cohen Kappa, Top-K), Checkpointing
├── export.py            # Export architecture hooks (TorchScript, ONNX)
├── inference.py         # ConvNeXt inference service (backward-compatible with FastAPI backend)
├── evaluate.py          # Standalone evaluation & confusion matrix generator
├── train.py             # Master training engine (AMP, EMA, Accumulation, Clipping, Loss explosion guards)
└── transforms.py        # Input data augmentation and normalization transforms

configs/
├── baseline.yaml        # Standard baseline training setup
├── head_only.yaml       # Stage 1: Classifier head fine-tuning configuration
├── partial_finetune.yaml# Stage 2: Progressive unfreezing configuration
└── full_finetune.yaml   # Stage 3: End-to-end full network fine-tuning configuration
```

---

## 🚀 Two-Stage Training Workflow

### Stage 1: Head-Only Fine-Tuning
In Stage 1, the entire ConvNeXt-Tiny feature extractor backbone is **frozen** ($27.82\text{M}$ frozen parameters), and **only the classifier head** ($22,301$ trainable parameters) is trained to adapt ImageNet representations to plant disease classification.

```bash
python3 -m ml.train --data_dir "Dataset/Plant Village Dataset" --config configs/head_only.yaml
```

### Stage 2: Progressive Unfreezing
In Stage 2, the trained classifier head is kept while the last $N$ blocks ($N \in \{1, 2, 3\}$) of ConvNeXt Stage 4 are progressively unfrozen ($9.55\text{M}$ trainable parameters) with differential learning rates:
- **Classifier Head LR**: $1 \times 10^{-4}$
- **Stage 4 Blocks LR**: $2 \times 10^{-5}$
- **Backbone LR**: $5 \times 10^{-6}$

```bash
python3 -m ml.train --data_dir "Dataset/Plant Village Dataset" --config configs/partial_finetune.yaml
```

---

## 💻 Hardware-Specific Execution

### 🍎 Apple Silicon Training (MacBook Air M4 / M1 / M2 / M3 MPS)
The framework automatically detects Apple Silicon MPS hardware via `torch.backends.mps.is_available()`.
- Unified memory optimizations enabled automatically.
- Automatic Mixed Precision (`autocast`) and channels-last memory format active.

```bash
python3 -m ml.train --data_dir "Dataset/Plant Village Dataset" --config configs/partial_finetune.yaml
```

### ⚡ CUDA GPU Training
On CUDA-enabled Linux/Windows machines:
- Automatic DMA pinned memory (`PIN_MEMORY=True`), persistent DataLoader workers (`PERSISTENT_WORKERS=True`), and CUDA GradScaler are enabled automatically.

```bash
python3 -m ml.train --data_dir "Dataset/Plant Village Dataset" --config configs/full_finetune.yaml
```

---

## 🔁 Resuming Interruptions & Checkpointing

To resume training from an existing checkpoint without losing state:
```bash
python3 -m ml.train --data_dir "Dataset/Plant Village Dataset" --config configs/partial_finetune.yaml --resume experiments/exp_001/latest_model.pth
```

### Saved Checkpoint Artifacts per Experiment (`experiments/exp_xxx/`)
- `best_model.pth`: Weights of the highest Macro F1 model.
- `latest_model.pth`: Most recent epoch state checkpoint.
- `ema_model.pth`: Exponential Moving Average (ModelEMA) smoothed weights.
- `optimizer.pth`: Optimizer state dictionary.
- `scheduler.pth`: Learning rate scheduler state.
- `training_state.json`: Epoch and training metrics JSON.
- `class_mapping.json`: Index to class name mapping.
- `train.log`: Full execution log.
- `history.csv`: Per-epoch training and validation loss/accuracy/F1 metrics.
- `training_summary.md`: Summary report.
- Plots: `loss_curve.png`, `accuracy_curve.png`, `precision_curve.png`, `recall_curve.png`, `learning_rate_curve.png`, `confusion_matrix.png`.

---

## 📦 Deployment Workflow

After successful training, the master engine automatically deploys:
1. `models/convnext_best.pth` (Model weights)
2. `models/class_mapping.json` (Class mapping)

These files are consumed directly by `ml/inference.py` and `backend.py` for real-time web inference.

---

## ❓ Troubleshooting & FAQs

1. **How do I verify model weights before serving?**
   Run the evaluation script:
   ```bash
   python3 -m ml.evaluate --data_dir "Dataset/Plant Village Dataset"
   ```

2. **Is the FastAPI backend modified by training?**
   No. `backend.py`, React frontend, database layers, and REST endpoints are completely isolated from training.
