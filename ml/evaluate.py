import torch
import json
import argparse
import os
from torch.utils.data import DataLoader
from torchvision.datasets import ImageFolder
from ml.config import Config
from ml.transforms import get_val_transforms
from ml.model import get_model
from ml.utils import load_checkpoint, calculate_metrics

def evaluate_model(data_dir: str, config_path: str = None, weights_path: str = None) -> dict:
    """
    Evaluates ConvNeXt-Tiny model on validation/test set using torch.no_grad() and eval mode.
    Returns dictionary with Macro F1, Precision, Recall, Accuracy, Per-Class Accuracy, and Confusion Matrix.
    """
    config = Config(config_path)
    device = config.get_device()
    
    weights = weights_path if weights_path else config.DEPLOYED_WEIGHTS_PATH
    mapping = config.DEPLOYED_CLASS_MAPPING_PATH
    
    if not os.path.exists(weights) or not os.path.exists(mapping):
        raise FileNotFoundError(f"Evaluation weights or class mapping not found at {weights}.")

    with open(mapping, 'r') as f:
        idx_to_class = json.load(f)
    num_classes = len(idx_to_class)
    
    # Load dataset split
    eval_dir = os.path.join(data_dir, 'val') if os.path.exists(os.path.join(data_dir, 'val')) else data_dir
    dataset = ImageFolder(eval_dir, transform=get_val_transforms(config.IMG_SIZE))
    loader = DataLoader(dataset, batch_size=config.BATCH_SIZE, shuffle=False, num_workers=config.WORKERS)
    
    model = get_model(num_classes, pretrained=False, dropout=config.DROPOUT).to(device)
    load_checkpoint(model, weights, device=device)
    model.eval()
    
    val_preds, val_targets = [], []
    print(f"Running evaluation on {len(dataset)} images across {num_classes} classes...")
    
    with torch.no_grad():
        for inputs, targets in loader:
            inputs, targets = inputs.to(device), targets.to(device)
            outputs = model(inputs)
            preds = torch.argmax(outputs, dim=1)
            val_preds.extend(preds.cpu().numpy())
            val_targets.extend(targets.cpu().numpy())
            
    metrics = calculate_metrics(val_targets, val_preds)
    print("\n==================================================")
    print(" EVALUATION METRICS SUMMARY")
    print("==================================================")
    print(f" Accuracy  : {metrics['accuracy']:.4f}")
    print(f" Precision : {metrics['precision']:.4f}")
    print(f" Recall    : {metrics['recall']:.4f}")
    print(f" Macro F1  : {metrics['f1']:.4f}")
    print("==================================================")
    
    return metrics

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate ConvNeXt-Tiny Model")
    parser.add_argument("--data_dir", type=str, default="Dataset/Plant Village Dataset", help="Path to dataset directory")
    parser.add_argument("--config", type=str, default=None, help="Path to YAML configuration file")
    parser.add_argument("--weights", type=str, default=None, help="Path to model weights checkpoint")
    args = parser.parse_args()
    
    evaluate_model(args.data_dir, args.config, args.weights)
