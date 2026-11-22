import os
import shutil
import random
import argparse
import json
from collections import defaultdict
from typing import Dict, List, Tuple

def split_dataset(
    source_dir: str,
    output_dir: str = 'dataset/cleaned',
    train_ratio: float = 0.70,
    val_ratio: float = 0.15,
    test_ratio: float = 0.15,
    seed: int = 42,
    copy_files: bool = True
) -> Dict[str, Any]:
    """
    Perform stratified split of dataset into train/val/test folders preserving class balance.
    """
    if abs((train_ratio + val_ratio + test_ratio) - 1.0) > 1e-4:
        raise ValueError("Ratios train + val + test must sum to 1.0")

    random.seed(seed)

    # Gather images per class
    class_images = defaultdict(list)

    # Check if source_dir already has sub-folders or is flat class folders
    for root, _, files in os.walk(source_dir):
        rel = os.path.relpath(root, source_dir)
        parts = rel.split(os.sep)
        # Ignore hidden files and system dirs
        valid_files = [f for f in files if not f.startswith('.')]
        if not valid_files:
            continue
        
        # Extract class name from path
        class_name = parts[-1] if rel != '.' else 'unclassified'
        for f in valid_files:
            class_images[class_name].append(os.path.join(root, f))

    stats = defaultdict(lambda: {'train': 0, 'val': 0, 'test': 0})
    total_moved = 0

    for cls, files in class_images.items():
        random.shuffle(files)
        n = len(files)
        n_train = int(n * train_ratio)
        n_val = int(n * val_ratio)
        
        train_files = files[:n_train]
        val_files = files[n_train:n_train + n_val]
        test_files = files[n_train + n_val:]

        splits = {
            'train': train_files,
            'val': val_files,
            'test': test_files
        }

        for split_name, file_list in splits.items():
            split_cls_dir = os.path.join(output_dir, split_name, cls)
            if copy_files:
                os.makedirs(split_cls_dir, exist_ok=True)

            for src in file_list:
                fname = os.path.basename(src)
                dst = os.path.join(split_cls_dir, fname)
                if copy_files:
                    shutil.copy2(src, dst)
                stats[cls][split_name] += 1
                total_moved += 1

    summary = {
        'source_dir': source_dir,
        'output_dir': output_dir,
        'ratios': {'train': train_ratio, 'val': val_ratio, 'test': test_ratio},
        'total_images_processed': total_moved,
        'class_stats': dict(stats)
    }

    print(f"Dataset split complete: {total_moved} images partitioned into '{output_dir}'.")
    return summary

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Stratified dataset splitter.")
    parser.add_argument('--source-dir', type=str, default='Dataset/Plant Village Dataset/Train', help='Source directory containing class folders')
    parser.add_argument('--output-dir', type=str, default='dataset/cleaned', help='Output split directory')
    parser.add_argument('--train-ratio', type=float, default=0.70, help='Train split ratio')
    parser.add_argument('--val-ratio', type=float, default=0.15, help='Validation split ratio')
    parser.add_argument('--test-ratio', type=float, default=0.15, help='Test split ratio')
    parser.add_argument('--seed', type=int, default=42, help='Random seed')
    args = parser.parse_args()

    split_dataset(
        source_dir=args.source_dir,
        output_dir=args.output_dir,
        train_ratio=args.train_ratio,
        val_ratio=args.val_ratio,
        test_ratio=args.test_ratio,
        seed=args.seed
    )
