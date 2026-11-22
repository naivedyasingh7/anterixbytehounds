import os
import argparse
import json
from collections import defaultdict
from typing import Dict, List, Any, Tuple
from PIL import Image, ImageOps
import numpy as np

from dataset_tools.utils import (
    get_all_image_paths,
    get_magic_bytes_format,
    compute_md5,
    compute_dhash,
    compute_phash,
    hamming_distance,
    run_parallel,
    SUPPORTED_EXTENSIONS
)

def inspect_single_image(item: Tuple[str, str, str]) -> Dict[str, Any]:
    """
    Inspect a single image file for corruption, formatting, dimensions, color channel, etc.
    item: (abs_path, class_name, split)
    """
    filepath, class_name, split = item
    res = {
        'filepath': filepath,
        'filename': os.path.basename(filepath),
        'class_name': class_name,
        'split': split,
        'size_bytes': 0,
        'is_corrupted': False,
        'is_unreadable': False,
        'is_zero_byte': False,
        'is_unsupported_format': False,
        'has_wrong_extension': False,
        'is_extremely_small': False,
        'is_grayscale': False,
        'has_alpha_channel': False,
        'has_unusual_aspect_ratio': False,
        'width': 0,
        'height': 0,
        'aspect_ratio': 0.0,
        'channels': 0,
        'declared_ext': os.path.splitext(filepath)[1].lower(),
        'actual_format': None,
        'md5': None,
        'dhash': None,
        'phash': None,
        'error_msg': None
    }

    if not os.path.exists(filepath):
        res['is_unreadable'] = True
        res['error_msg'] = "File does not exist"
        return res

    try:
        size = os.path.getsize(filepath)
        res['size_bytes'] = size
        if size == 0:
            res['is_zero_byte'] = True
            res['error_msg'] = "Zero-byte file"
            return res
    except Exception as e:
        res['is_unreadable'] = True
        res['error_msg'] = f"Unreadable file stats: {str(e)}"
        return res

    ext = res['declared_ext']
    if ext not in SUPPORTED_EXTENSIONS:
        res['is_unsupported_format'] = True

    # Detect format via magic bytes
    actual_fmt = get_magic_bytes_format(filepath)
    res['actual_format'] = actual_fmt

    if ext in ('.jpg', '.jpeg') and actual_fmt and actual_fmt not in ('JPEG', 'JPG'):
        res['has_wrong_extension'] = True
    elif ext == '.png' and actual_fmt and actual_fmt != 'PNG':
        res['has_wrong_extension'] = True
    elif ext == '.bmp' and actual_fmt and actual_fmt != 'BMP':
        res['has_wrong_extension'] = True
    elif ext in ('.webp',) and actual_fmt and actual_fmt != 'WEBP':
        res['has_wrong_extension'] = True

    # Compute MD5
    try:
        res['md5'] = compute_md5(filepath)
    except Exception as e:
        res['is_unreadable'] = True
        res['error_msg'] = f"MD5 calculation failed: {str(e)}"
        return res

    # Decode image using PIL
    try:
        with Image.open(filepath) as img:
            img.verify() # Verify file integrity
        
        with Image.open(filepath) as img:
            w, h = img.size
            res['width'] = w
            res['height'] = h
            res['aspect_ratio'] = round(w / h, 4) if h > 0 else 0.0

            if w < 64 or h < 64:
                res['is_extremely_small'] = True

            if res['aspect_ratio'] < 0.5 or res['aspect_ratio'] > 2.0:
                res['has_unusual_aspect_ratio'] = True

            mode = img.mode
            if mode in ('RGBA', 'LA') or (mode == 'P' and 'transparency' in img.info):
                res['has_alpha_channel'] = True
                res['channels'] = 4 if 'A' in mode else 3
            elif mode in ('L', '1'):
                res['is_grayscale'] = True
                res['channels'] = 1
            else:
                res['channels'] = len(mode)
                # Check if RGB image has identical RGB values for all pixels
                if mode == 'RGB':
                    img_np = np.array(img)
                    if img_np.ndim == 3 and img_np.shape[2] == 3:
                        if np.array_equal(img_np[:, :, 0], img_np[:, :, 1]) and np.array_equal(img_np[:, :, 1], img_np[:, :, 2]):
                            res['is_grayscale'] = True

            # Compute perceptual hashes
            res['dhash'] = compute_dhash(img)
            res['phash'] = compute_phash(img)

    except Exception as e:
        res['is_corrupted'] = True
        res['error_msg'] = f"Image decode corrupted: {str(e)}"

    return res

class DatasetScanner:
    def __init__(self, data_dir: str, workers: int = 8, phash_threshold: int = 4):
        self.data_dir = data_dir
        self.workers = workers
        self.phash_threshold = phash_threshold

    def scan(self) -> Dict[str, Any]:
        """Perform comprehensive scan of the dataset."""
        print(f"Scanning dataset at '{self.data_dir}' using {self.workers} workers...")
        image_items = get_all_image_paths(self.data_dir)
        total_files = len(image_items)
        print(f"Found {total_files} total file paths to inspect.")

        # Inspect images in parallel
        inspections = run_parallel(image_items, inspect_single_image, max_workers=self.workers)

        # Aggregations
        corrupted = []
        unreadable = []
        zero_byte = []
        unsupported = []
        wrong_ext = []
        extremely_small = []
        grayscale = []
        alpha_channel = []
        unusual_aspect = []

        filename_map = defaultdict(list)
        md5_map = defaultdict(list)
        class_counts = defaultdict(int)
        split_class_counts = defaultdict(lambda: defaultdict(int))
        dimensions_map = defaultdict(int)

        for item in inspections:
            fp = item['filepath']
            cls = item['class_name']
            split = item['split']

            class_counts[cls] += 1
            split_class_counts[split][cls] += 1

            if item['width'] > 0 and item['height'] > 0:
                dimensions_map[(item['width'], item['height'])] += 1

            filename_map[item['filename']].append(fp)
            if item['md5']:
                md5_map[item['md5']].append((fp, cls, split))

            if item['is_corrupted']:
                corrupted.append(item)
            if item['is_unreadable']:
                unreadable.append(item)
            if item['is_zero_byte']:
                zero_byte.append(item)
            if item['is_unsupported_format']:
                unsupported.append(item)
            if item['has_wrong_extension']:
                wrong_ext.append(item)
            if item['is_extremely_small']:
                extremely_small.append(item)
            if item['is_grayscale']:
                grayscale.append(item)
            if item['has_alpha_channel']:
                alpha_channel.append(item)
            if item['has_unusual_aspect_ratio']:
                unusual_aspect.append(item)

        # Duplicate filename detection
        duplicate_filenames = {fn: paths for fn, paths in filename_map.items() if len(paths) > 1}

        # Exact duplicate content detection (MD5)
        exact_duplicates = {md5: items for md5, items in md5_map.items() if len(items) > 1}

        # Near-duplicate detection using pHash
        near_duplicates = []
        valid_phashes = [(item['filepath'], item['phash'], item['class_name'], item['split']) for item in inspections if item['phash']]
        
        # Compare perceptual hashes (sample or chunked comparison if large)
        print(f"Calculating perceptual hash similarities for {len(valid_phashes)} valid images...")
        num_valid = len(valid_phashes)
        # Limit quadratic comparisons for speed if dataset is huge by indexing bucket
        bucket_map = defaultdict(list)
        for fp, ph, cls, sp in valid_phashes:
            # Prefix bucket
            bucket_map[ph[:2]].append((fp, ph, cls, sp))

        for bucket, items_in_bucket in bucket_map.items():
            if len(items_in_bucket) <= 1:
                continue
            for i in range(len(items_in_bucket)):
                for j in range(i + 1, len(items_in_bucket)):
                    fp1, ph1, cls1, sp1 = items_in_bucket[i]
                    fp2, ph2, cls2, sp2 = items_in_bucket[j]
                    dist = hamming_distance(ph1, ph2)
                    if 0 < dist <= self.phash_threshold:
                        near_duplicates.append({
                            'img1': fp1, 'class1': cls1, 'split1': sp1,
                            'img2': fp2, 'class2': cls2, 'split2': sp2,
                            'hamming_distance': dist
                        })

        # Class inspection metrics
        num_classes = len(class_counts)
        class_list = sorted(class_counts.keys())
        counts_list = [class_counts[c] for c in class_list] if class_list else [0]
        
        largest_class = max(class_counts.items(), key=lambda x: x[1]) if class_counts else ("None", 0)
        smallest_class = min(class_counts.items(), key=lambda x: x[1]) if class_counts else ("None", 0)
        avg_images_per_class = float(np.mean(counts_list)) if counts_list else 0.0
        empty_classes = [cls for cls, count in class_counts.items() if count == 0]

        imbalance_ratio = (largest_class[1] / smallest_class[1]) if smallest_class[1] > 0 else float('inf')

        scan_report = {
            'total_files_scanned': total_files,
            'summary': {
                'corrupted_count': len(corrupted),
                'unreadable_count': len(unreadable),
                'zero_byte_count': len(zero_byte),
                'unsupported_format_count': len(unsupported),
                'wrong_extension_count': len(wrong_ext),
                'duplicate_filenames_count': len(duplicate_filenames),
                'exact_duplicates_count': len(exact_duplicates),
                'near_duplicates_count': len(near_duplicates),
                'extremely_small_count': len(extremely_small),
                'grayscale_count': len(grayscale),
                'alpha_channel_count': len(alpha_channel),
                'unusual_aspect_ratio_count': len(unusual_aspect),
                'unique_dimensions_count': len(dimensions_map)
            },
            'class_inspection': {
                'num_classes': num_classes,
                'class_counts': dict(class_counts),
                'split_class_counts': {sp: dict(cls_dict) for sp, cls_dict in split_class_counts.items()},
                'empty_classes': empty_classes,
                'largest_class': {'name': largest_class[0], 'count': largest_class[1]},
                'smallest_class': {'name': smallest_class[0], 'count': smallest_class[1]},
                'average_images_per_class': round(avg_images_per_class, 2),
                'imbalance_ratio': round(imbalance_ratio, 2)
            },
            'issues': {
                'corrupted': corrupted,
                'unreadable': unreadable,
                'zero_byte': zero_byte,
                'unsupported': unsupported,
                'wrong_extension': wrong_ext,
                'duplicate_filenames': duplicate_filenames,
                'exact_duplicates': exact_duplicates,
                'near_duplicates': near_duplicates[:200], # Cap near duplicate detail preview
                'extremely_small': extremely_small,
                'grayscale': grayscale,
                'alpha_channel': alpha_channel,
                'unusual_aspect_ratio': unusual_aspect
            },
            'inspections': inspections
        }

        print("Scan complete.")
        return scan_report

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Scan dataset for defects, duplicates, and class distribution.")
    parser.add_argument('--data-dir', type=str, default='Dataset/Plant Village Dataset', help='Path to dataset directory')
    parser.add_argument('--workers', type=int, default=8, help='Number of parallel workers')
    parser.add_argument('--output', type=str, default='dataset_scan_results.json', help='Save output JSON report')
    args = parser.parse_args()

    scanner = DatasetScanner(data_dir=args.data_dir, workers=args.workers)
    report = scanner.scan()

    # Save summary report
    output_summary = {k: v for k, v in report.items() if k != 'inspections'}
    with open(args.output, 'w') as f:
        json.dump(output_summary, f, indent=4)
    print(f"Scan summary saved to '{args.output}'.")
