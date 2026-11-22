import os
import shutil
import json
import csv
import argparse
from datetime import datetime
from typing import Dict, List, Any

class DatasetCleaner:
    def __init__(self, base_dataset_dir: str = 'Dataset', review_dir: str = 'dataset/review', dry_run: bool = True):
        self.base_dataset_dir = base_dataset_dir
        self.review_dir = review_dir
        self.dry_run = dry_run
        self.logs = []

    def clean(self, scan_report: Dict[str, Any], quality_report: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Non-destructive cleaning routine.
        Moves problematic files into structured subfolders under review_dir without modifying or deleting original files.
        """
        print(f"Starting dataset cleaning routine ({'[DRY RUN]' if self.dry_run else 'EXECUTING MOVES'})...")
        
        issues = scan_report.get('issues', {})
        suspicious_quality = quality_report.get('suspicious_images', [])

        # Categories to process
        categories = {
            'corrupted': issues.get('corrupted', []) + issues.get('unreadable', []) + issues.get('zero_byte', []),
            'wrong_extension': issues.get('wrong_extension', []) + issues.get('unsupported', []),
            'extremely_small': issues.get('extremely_small', []),
            'unusual_aspect_ratio': issues.get('unusual_aspect_ratio', []),
            'suspicious_quality': suspicious_quality
        }

        # Process each category
        for category_name, items in categories.items():
            cat_target_dir = os.path.join(self.review_dir, category_name)

            for item in items:
                src_path = item.get('filepath')
                if not src_path or not os.path.exists(src_path):
                    continue

                filename = os.path.basename(src_path)
                cls_name = item.get('class_name', 'unclassified')
                dst_subfolder = os.path.join(cat_target_dir, cls_name)
                dst_path = os.path.join(dst_subfolder, filename)

                log_entry = {
                    'timestamp': datetime.now().isoformat(),
                    'source_path': src_path,
                    'destination_path': dst_path,
                    'category': category_name,
                    'class_name': cls_name,
                    'reasons': item.get('error_msg') or item.get('suspicious_reasons') or category_name,
                    'dry_run': self.dry_run
                }

                self.logs.append(log_entry)

                if not self.dry_run:
                    os.makedirs(dst_subfolder, exist_ok=True)
                    shutil.move(src_path, dst_path)

        # Save execution audit log
        log_dir = os.path.join(self.review_dir, 'logs')
        if not self.dry_run:
            os.makedirs(log_dir, exist_ok=True)
            log_file = os.path.join(log_dir, f"cleaning_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
            with open(log_file, 'w') as f:
                json.dump(self.logs, f, indent=4)
            print(f"Cleaning audit log saved to '{log_file}'.")

        print(f"Processed {len(self.logs)} flagged items. Cleaned directory ready.")
        return self.logs

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Non-destructive dataset cleaner.")
    parser.add_argument('--scan-file', type=str, default='dataset_scan_results.json', help='Scan results JSON')
    parser.add_argument('--quality-file', type=str, default='quality_analysis.json', help='Quality results JSON')
    parser.add_argument('--review-dir', type=str, default='dataset/review', help='Directory to move flagged images for review')
    parser.add_argument('--execute', action='store_true', help='Execute actual moves (default is dry-run)')
    args = parser.parse_args()

    with open(args.scan_file, 'r') as f:
        scan_data = json.load(f)
    with open(args.quality_file, 'r') as f:
        qual_data = json.load(f)

    cleaner = DatasetCleaner(review_dir=args.review_dir, dry_run=(not args.execute))
    logs = cleaner.clean(scan_data, qual_data)
