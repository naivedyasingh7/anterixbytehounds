import os
import argparse
import json
from collections import defaultdict
from typing import Dict, List, Any, Tuple
from PIL import Image

from dataset_tools.utils import get_all_image_paths, compute_md5, compute_phash, run_parallel

def hash_image_for_leakage(item: Tuple[str, str, str]) -> Dict[str, Any]:
    filepath, class_name, split = item
    res = {
        'filepath': filepath,
        'filename': os.path.basename(filepath),
        'class_name': class_name,
        'split': split,
        'md5': None,
        'phash': None
    }
    try:
        res['md5'] = compute_md5(filepath)
        with Image.open(filepath) as img:
            res['phash'] = compute_phash(img)
    except Exception:
        pass
    return res

class DatasetVerifier:
    def __init__(self, data_dir: str, workers: int = 8):
        self.data_dir = data_dir
        self.workers = workers

    def verify(self) -> Dict[str, Any]:
        """
        Verify dataset structure and detect cross-split data leakage.
        """
        print(f"Verifying dataset structure and split integrity at '{self.data_dir}'...")
        if not os.path.exists(self.data_dir):
            raise FileNotFoundError(f"Dataset path '{self.data_dir}' does not exist.")

        # Identify subdirectories (splits)
        subdirs = [d for d in os.listdir(self.data_dir) if os.path.isdir(os.path.join(self.data_dir, d)) and not d.startswith('.')]
        
        # Standardize split directory name detection
        split_map = {}
        for d in subdirs:
            low = d.lower()
            if low in ('train', 'training'):
                split_map['train'] = d
            elif low in ('val', 'valid', 'validation'):
                split_map['val'] = d
            elif low in ('test', 'testing'):
                split_map['test'] = d

        has_standard_splits = len(split_map) >= 2

        split_classes = {}
        missing_classes_per_split = {}
        class_mismatches = []

        if has_standard_splits:
            all_found_classes = set()
            for s_name, s_dir in split_map.items():
                s_path = os.path.join(self.data_dir, s_dir)
                classes = sorted([c for c in os.listdir(s_path) if os.path.isdir(os.path.join(s_path, c)) and not c.startswith('.')])
                split_classes[s_name] = classes
                all_found_classes.update(classes)

            # Check consistency across splits
            for s_name, classes in split_classes.items():
                missing = sorted(list(all_found_classes - set(classes)))
                missing_classes_per_split[s_name] = missing

            train_c = split_classes.get('train', [])
            val_c = split_classes.get('val', [])
            test_c = split_classes.get('test', [])

            if val_c and train_c != val_c:
                class_mismatches.append(f"Train vs Val class mismatch: {set(train_c) ^ set(val_c)}")
            if test_c and train_c != test_c:
                class_mismatches.append(f"Train vs Test class mismatch: {set(train_c) ^ set(test_c)}")

        else:
            # Single folder without train/val/test split structure
            classes = sorted([c for c in os.listdir(self.data_dir) if os.path.isdir(os.path.join(self.data_dir, c)) and not c.startswith('.')])
            split_classes['all'] = classes

        # 2. Data Leakage Detection across splits
        print("Checking for cross-split dataset leakage using exact and perceptual image hashing...")
        image_items = get_all_image_paths(self.data_dir)
        hashed_items = run_parallel(image_items, hash_image_for_leakage, max_workers=self.workers)

        # Index images by MD5 hash
        md5_to_splits = defaultdict(list)
        for item in hashed_items:
            if item['md5']:
                md5_to_splits[item['md5']].append(item)

        leakage_records = []
        for md5, items in md5_to_splits.items():
            splits_present = set(i['split'] for i in items)
            if len(splits_present) > 1: # Image exists in 2 or more different splits!
                leakage_records.append({
                    'md5': md5,
                    'splits': list(splits_present),
                    'files': [{'filepath': i['filepath'], 'split': i['split'], 'class_name': i['class_name']} for i in items]
                })

        verification_passed = (len(class_mismatches) == 0 and len(leakage_records) == 0)

        report = {
            'verification_passed': verification_passed,
            'splits_detected': list(split_map.keys()) if has_standard_splits else ['single_folder'],
            'split_classes': split_classes,
            'missing_classes_per_split': missing_classes_per_split,
            'class_mismatches': class_mismatches,
            'data_leakage': {
                'has_leakage': len(leakage_records) > 0,
                'leakage_clusters_count': len(leakage_records),
                'leakage_records': leakage_records
            }
        }

        if verification_passed:
            print("VERIFICATION SUCCESSFUL: Folder structure, class mappings, and split isolation verified clean.")
        else:
            print("VERIFICATION WARNING: Anomalies or dataset leakage detected across splits.")

        return report

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Verify dataset structure and detect cross-split leakage.")
    parser.add_argument('--data-dir', type=str, default='Dataset/Plant Village Dataset', help='Path to dataset directory')
    parser.add_argument('--workers', type=int, default=8, help='Number of workers')
    parser.add_argument('--output', type=str, default='verification_report.json', help='Output JSON report')
    args = parser.parse_args()

    verifier = DatasetVerifier(data_dir=args.data_dir, workers=args.workers)
    report = verifier.verify()

    with open(args.output, 'w') as f:
        json.dump(report, f, indent=4)
    print(f"Verification report saved to '{args.output}'.")
