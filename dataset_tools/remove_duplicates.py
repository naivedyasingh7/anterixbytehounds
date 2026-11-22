import os
import shutil
import argparse
import json
import csv
from collections import defaultdict
from typing import Dict, List, Any, Tuple
from PIL import Image

from dataset_tools.utils import (
    get_all_image_paths,
    compute_md5,
    compute_phash,
    compute_dhash,
    hamming_distance,
    run_parallel
)

def process_image_hashes(item: Tuple[str, str, str]) -> Dict[str, Any]:
    filepath, class_name, split = item
    res = {
        'filepath': filepath,
        'filename': os.path.basename(filepath),
        'class_name': class_name,
        'split': split,
        'md5': None,
        'phash': None,
        'dhash': None,
        'error': None
    }
    try:
        res['md5'] = compute_md5(filepath)
        with Image.open(filepath) as img:
            res['phash'] = compute_phash(img)
            res['dhash'] = compute_dhash(img)
    except Exception as e:
        res['error'] = str(e)
    return res

class DuplicateDetector:
    def __init__(self, data_dir: str, workers: int = 8, phash_threshold: int = 4):
        self.data_dir = data_dir
        self.workers = workers
        self.phash_threshold = phash_threshold

    def find_duplicates(self) -> Dict[str, Any]:
        print(f"Scanning for duplicates in '{self.data_dir}' using {self.workers} workers...")
        image_items = get_all_image_paths(self.data_dir)
        total = len(image_items)

        hash_results = run_parallel(image_items, process_image_hashes, max_workers=self.workers)

        # 1. Exact MD5 Duplicates
        md5_groups = defaultdict(list)
        for item in hash_results:
            if item['md5']:
                md5_groups[item['md5']].append(item)

        exact_duplicate_clusters = []
        for md5, items in md5_groups.items():
            if len(items) > 1:
                # Keep first as master, rest as duplicates
                master = items[0]
                duplicates = items[1:]
                exact_duplicate_clusters.append({
                    'md5': md5,
                    'master': master,
                    'duplicates': duplicates,
                    'count': len(items)
                })

        # 2. Near Duplicates via pHash
        valid_items = [item for item in hash_results if item['phash']]
        near_duplicate_pairs = []
        
        # Group by phash prefix bucket to speed up pairwise comparisons
        bucket_map = defaultdict(list)
        for item in valid_items:
            bucket_map[item['phash'][:2]].append(item)

        for bucket, items in bucket_map.items():
            if len(items) <= 1:
                continue
            for i in range(len(items)):
                for j in range(i + 1, len(items)):
                    item1 = items[i]
                    item2 = items[j]
                    if item1['md5'] == item2['md5']:
                        continue # Skip exact matches already caught
                    dist = hamming_distance(item1['phash'], item2['phash'])
                    if dist <= self.phash_threshold:
                        near_duplicate_pairs.append({
                            'master': item1,
                            'duplicate': item2,
                            'hamming_distance': dist
                        })

        summary = {
            'total_images': total,
            'exact_duplicate_clusters_count': len(exact_duplicate_clusters),
            'exact_duplicate_extra_images_count': sum(c['count'] - 1 for c in exact_duplicate_clusters),
            'near_duplicate_pairs_count': len(near_duplicate_pairs)
        }

        return {
            'summary': summary,
            'exact_duplicates': exact_duplicate_clusters,
            'near_duplicates': near_duplicate_pairs
        }

def relocate_duplicates(dup_report: Dict[str, Any], review_dir: str, dry_run: bool = True) -> List[Dict[str, Any]]:
    """
    Safely relocate redundant duplicate copies to review_dir/duplicates.
    Never permanently deletes any file.
    """
    relocations = []
    target_dir = os.path.join(review_dir, "duplicates")
    
    if not dry_run:
        os.makedirs(target_dir, exist_ok=True)

    # Process exact duplicates
    for cluster in dup_report['exact_duplicates']:
        master = cluster['master']
        for dup in cluster['duplicates']:
            src_path = dup['filepath']
            filename = os.path.basename(src_path)
            # Create subfolder in review based on class
            class_review_dir = os.path.join(target_dir, dup['class_name'])
            dst_path = os.path.join(class_review_dir, f"dup_{dup['md5'][:8]}_{filename}")
            
            action = {
                'source': src_path,
                'destination': dst_path,
                'master': master['filepath'],
                'reason': 'Exact MD5 Duplicate',
                'md5': dup['md5'],
                'dry_run': dry_run
            }
            relocations.append(action)

            if not dry_run:
                os.makedirs(class_review_dir, exist_ok=True)
                shutil.move(src_path, dst_path)

    print(f"{'[DRY RUN] Would relocate' if dry_run else 'Relocated'} {len(relocations)} duplicate image(s) to '{target_dir}'.")
    return relocations

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Find and manage duplicate images.")
    parser.add_argument('--data-dir', type=str, default='Dataset/Plant Village Dataset', help='Path to dataset directory')
    parser.add_argument('--workers', type=int, default=8, help='Number of workers')
    parser.add_argument('--phash-threshold', type=int, default=4, help='Hamming distance threshold for near-duplicates')
    parser.add_argument('--output', type=str, default='duplicate_report.json', help='Output JSON report')
    args = parser.parse_args()

    detector = DuplicateDetector(data_dir=args.data_dir, workers=args.workers, phash_threshold=args.phash_threshold)
    report = detector.find_duplicates()

    with open(args.output, 'w') as f:
        json.dump(report['summary'], f, indent=4)

    print(f"Duplicate scan complete. Summary saved to '{args.output}'.")
