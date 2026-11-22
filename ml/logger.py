import os
import csv
import json
import yaml
import logging
import time
from typing import Dict, List, Any

try:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    import seaborn as sns
    MATPLOTLIB_AVAILABLE = True
except ImportError:
    MATPLOTLIB_AVAILABLE = False

try:
    from torch.utils.tensorboard import SummaryWriter
    TENSORBOARD_AVAILABLE = True
except ImportError:
    TENSORBOARD_AVAILABLE = False

class ExperimentLogger:
    """
    Research-grade experiment logger.
    Manages train.log logging handlers, history CSVs, per-class metrics CSVs,
    Matplotlib visualization plots (loss, accuracy, precision, recall, learning rate, confusion matrix),
    and markdown summaries (training_summary.md).
    """
    def __init__(self, base_exp_dir: str, config_dict: dict):
        os.makedirs(base_exp_dir, exist_ok=True)
        
        # Find next available exp_XXX folder
        exp_id = 1
        while True:
            self.exp_dir = os.path.join(base_exp_dir, f"exp_{exp_id:03d}")
            if not os.path.exists(self.exp_dir):
                break
            exp_id += 1
            
        os.makedirs(self.exp_dir, exist_ok=True)
        
        # Save experiment config.yaml
        with open(os.path.join(self.exp_dir, 'config.yaml'), 'w') as f:
            yaml.dump(config_dict, f, default_flow_style=False)
            
        # File & Console Logger setup for train.log
        self.logger = logging.getLogger(f"exp_{exp_id:03d}")
        self.logger.setLevel(logging.INFO)
        self.logger.handlers = [] # clear existing handlers
        
        file_handler = logging.FileHandler(os.path.join(self.exp_dir, 'train.log'))
        console_handler = logging.StreamHandler()
        formatter = logging.Formatter('[%(asctime)s] %(levelname)s: %(message)s', '%Y-%m-%d %H:%M:%S')
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)
        
        self.logger.addHandler(file_handler)
        self.logger.addHandler(console_handler)
        
        self.history_file = os.path.join(self.exp_dir, 'history.csv')
        self.history = {
            'epoch': [], 'train_loss': [], 'train_acc': [], 'train_f1': [],
            'val_loss': [], 'val_acc': [], 'val_f1': [], 'val_precision': [], 'val_recall': [],
            'val_mcc': [], 'val_kappa': [], 'grad_norm': [], 'epoch_seconds': [], 'throughput': [],
            'lr_groups': []
        }

        # Initialize TensorBoard SummaryWriter if enabled
        enable_tb = config_dict.get('ENABLE_TENSORBOARD', True)
        if enable_tb and TENSORBOARD_AVAILABLE:
            tb_log_dir = os.path.join(self.exp_dir, 'tensorboard')
            self.tb_writer = SummaryWriter(log_dir=tb_log_dir)
        else:
            self.tb_writer = None
            
    def info(self, msg: str):
        """Log info message to both train.log and stdout."""
        self.logger.info(msg)

    def log_epoch(
        self,
        epoch: int,
        train_metrics: dict,
        val_metrics: dict,
        lr_groups: List[float],
        grad_norm: float = 0.0,
        epoch_seconds: float = 0.0,
        throughput: float = 0.0
    ):
        self.history['epoch'].append(epoch)
        self.history['train_loss'].append(train_metrics.get('loss', 0.0))
        self.history['train_acc'].append(train_metrics.get('accuracy', 0.0))
        self.history['train_f1'].append(train_metrics.get('f1', 0.0))
        self.history['val_loss'].append(val_metrics.get('loss', 0.0))
        self.history['val_acc'].append(val_metrics.get('accuracy', 0.0))
        self.history['val_f1'].append(val_metrics.get('f1', 0.0))
        self.history['val_precision'].append(val_metrics.get('precision', 0.0))
        self.history['val_recall'].append(val_metrics.get('recall', 0.0))
        self.history['val_mcc'].append(val_metrics.get('mcc', 0.0))
        self.history['val_kappa'].append(val_metrics.get('cohen_kappa', 0.0))
        self.history['grad_norm'].append(grad_norm)
        self.history['epoch_seconds'].append(round(epoch_seconds, 2))
        self.history['throughput'].append(round(throughput, 2))
        self.history['lr_groups'].append(lr_groups)
        
        # Append to history.csv
        file_exists = os.path.isfile(self.history_file)
        with open(self.history_file, 'a', newline='') as f:
            writer = csv.writer(f)
            if not file_exists:
                header = ['epoch', 'train_loss', 'train_acc', 'train_f1', 'val_loss', 'val_acc', 'val_f1', 'val_precision', 'val_recall', 'val_mcc', 'val_kappa', 'grad_norm', 'epoch_seconds', 'throughput']
                for idx in range(len(lr_groups)):
                    header.append(f'lr_group_{idx}')
                writer.writerow(header)
                
            row = [
                epoch,
                train_metrics.get('loss', 0.0), train_metrics.get('accuracy', 0.0), train_metrics.get('f1', 0.0),
                val_metrics.get('loss', 0.0), val_metrics.get('accuracy', 0.0), val_metrics.get('f1', 0.0),
                val_metrics.get('precision', 0.0), val_metrics.get('recall', 0.0),
                val_metrics.get('mcc', 0.0), val_metrics.get('cohen_kappa', 0.0),
                grad_norm, round(epoch_seconds, 2), round(throughput, 2)
            ] + lr_groups
            writer.writerow(row)
            
        if self.tb_writer:
            self.tb_writer.add_scalar('Loss/train', train_metrics.get('loss', 0.0), epoch)
            self.tb_writer.add_scalar('Loss/val', val_metrics.get('loss', 0.0), epoch)
            self.tb_writer.add_scalar('Accuracy/train', train_metrics.get('accuracy', 0.0), epoch)
            self.tb_writer.add_scalar('Accuracy/val', val_metrics.get('accuracy', 0.0), epoch)
            self.tb_writer.add_scalar('F1_Macro/val', val_metrics.get('f1', 0.0), epoch)
            self.tb_writer.add_scalar('MCC/val', val_metrics.get('mcc', 0.0), epoch)

        if MATPLOTLIB_AVAILABLE:
            self._generate_plots()
            if 'confusion_matrix' in val_metrics:
                self._plot_confusion_matrix(val_metrics['confusion_matrix'])

    def log_best_summary(self, best_metrics: dict, class_names: List[str]):
        """Generates best_metrics.json, class_metrics.csv, and training_summary.md."""
        # 1. Save best_metrics.json
        with open(os.path.join(self.exp_dir, 'best_metrics.json'), 'w') as f:
            json.dump(best_metrics, f, indent=4)
            
        # 2. Save class_metrics.csv
        pc_acc = best_metrics.get('per_class_accuracy', [])
        pc_prec = best_metrics.get('per_class_precision', [])
        pc_rec = best_metrics.get('per_class_recall', [])
        pc_f1 = best_metrics.get('per_class_f1', [])
        
        with open(os.path.join(self.exp_dir, 'class_metrics.csv'), 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['class_name', 'accuracy', 'precision', 'recall', 'f1_score'])
            for i, c_name in enumerate(class_names):
                acc_val = pc_acc[i] if i < len(pc_acc) else 0.0
                prec_val = pc_prec[i] if i < len(pc_prec) else 0.0
                rec_val = pc_rec[i] if i < len(pc_rec) else 0.0
                f1_val = pc_f1[i] if i < len(pc_f1) else 0.0
                writer.writerow([c_name, acc_val, prec_val, rec_val, f1_val])

        # 3. Save training_summary.md
        md_content = f"""# Training Run Summary - {os.path.basename(self.exp_dir)}

## Best Validation Performance
- **Validation Accuracy**: {best_metrics.get('accuracy', 0.0)*100:.2f}%
- **Macro F1 Score**: {best_metrics.get('f1', 0.0):.4f}
- **Weighted F1 Score**: {best_metrics.get('weighted_f1', 0.0):.4f}
- **Macro Precision**: {best_metrics.get('precision', 0.0):.4f}
- **Macro Recall**: {best_metrics.get('recall', 0.0):.4f}
- **Matthews Correlation (MCC)**: {best_metrics.get('mcc', 0.0):.4f}
- **Cohen's Kappa ($\\kappa$)**: {best_metrics.get('cohen_kappa', 0.0):.4f}
- **Best Validation Loss**: {best_metrics.get('loss', 0.0):.4f}

---
*Generated automatically by DharaAI ConvNeXt-Tiny ML Pipeline.*
"""
        with open(os.path.join(self.exp_dir, 'training_summary.md'), 'w') as f:
            f.write(md_content)

    def save_summary(self, summary_str: str):
        with open(os.path.join(self.exp_dir, 'summary.txt'), 'w') as f:
            f.write(summary_str)

    def close(self):
        if self.tb_writer:
            self.tb_writer.close()
            
    def _generate_plots(self):
        epochs = self.history['epoch']
        
        # Loss Curve
        plt.figure(figsize=(9, 5))
        plt.plot(epochs, self.history['train_loss'], label='Train Loss', color='#e74c3c', linewidth=2)
        plt.plot(epochs, self.history['val_loss'], label='Val Loss', color='#2980b9', linewidth=2, linestyle='--')
        plt.xlabel('Epochs', fontweight='bold')
        plt.ylabel('Loss', fontweight='bold')
        plt.title('Loss Curve', fontweight='bold')
        plt.grid(True, linestyle=':', alpha=0.6)
        plt.legend()
        plt.tight_layout()
        plt.savefig(os.path.join(self.exp_dir, 'loss_curve.png'), dpi=200)
        plt.close()
        
        # Accuracy Curve
        plt.figure(figsize=(9, 5))
        plt.plot(epochs, self.history['train_acc'], label='Train Acc', color='#27ae60', linewidth=2)
        plt.plot(epochs, self.history['val_acc'], label='Val Acc', color='#f39c12', linewidth=2, linestyle='--')
        plt.xlabel('Epochs', fontweight='bold')
        plt.ylabel('Accuracy', fontweight='bold')
        plt.title('Accuracy Curve', fontweight='bold')
        plt.grid(True, linestyle=':', alpha=0.6)
        plt.legend()
        plt.tight_layout()
        plt.savefig(os.path.join(self.exp_dir, 'accuracy_curve.png'), dpi=200)
        plt.close()

        # Precision & Recall Curves
        plt.figure(figsize=(9, 5))
        plt.plot(epochs, self.history['val_precision'], label='Val Precision', color='#8e44ad', linewidth=2)
        plt.xlabel('Epochs', fontweight='bold')
        plt.ylabel('Precision', fontweight='bold')
        plt.title('Validation Precision Curve', fontweight='bold')
        plt.grid(True, linestyle=':', alpha=0.6)
        plt.legend()
        plt.tight_layout()
        plt.savefig(os.path.join(self.exp_dir, 'precision_curve.png'), dpi=200)
        plt.close()

        plt.figure(figsize=(9, 5))
        plt.plot(epochs, self.history['val_recall'], label='Val Recall', color='#d35400', linewidth=2)
        plt.xlabel('Epochs', fontweight='bold')
        plt.ylabel('Recall', fontweight='bold')
        plt.title('Validation Recall Curve', fontweight='bold')
        plt.grid(True, linestyle=':', alpha=0.6)
        plt.legend()
        plt.tight_layout()
        plt.savefig(os.path.join(self.exp_dir, 'recall_curve.png'), dpi=200)
        plt.close()

        # Learning Rate Curve
        if self.history['lr_groups']:
            plt.figure(figsize=(9, 5))
            num_groups = len(self.history['lr_groups'][0])
            for g in range(num_groups):
                lrs = [step[g] for step in self.history['lr_groups']]
                plt.plot(epochs, lrs, label=f'Group {g} LR', linewidth=2)
            plt.xlabel('Epochs', fontweight='bold')
            plt.ylabel('Learning Rate', fontweight='bold')
            plt.yscale('log')
            plt.title('Learning Rate Schedule per Parameter Group', fontweight='bold')
            plt.grid(True, linestyle=':', alpha=0.6)
            plt.legend()
            plt.tight_layout()
            plt.savefig(os.path.join(self.exp_dir, 'learning_rate_curve.png'), dpi=200)
            plt.close()

    def _plot_confusion_matrix(self, cm_matrix: list):
        if not MATPLOTLIB_AVAILABLE:
            return
        plt.figure(figsize=(12, 10))
        sns.heatmap(cm_matrix, annot=False, cmap='Blues', fmt='d')
        plt.title('Validation Confusion Matrix', fontweight='bold')
        plt.xlabel('Predicted Label', fontweight='bold')
        plt.ylabel('True Label', fontweight='bold')
        plt.tight_layout()
        plt.savefig(os.path.join(self.exp_dir, 'confusion_matrix.png'), dpi=200)
        plt.close()
