import os
import json
import csv
import argparse
from typing import Dict, List, Any
import numpy as np

import matplotlib
matplotlib.use('Agg') # Non-interactive backend
import matplotlib.pyplot as plt

class ReportGenerator:
    def __init__(self, scan_report: Dict[str, Any], quality_report: Dict[str, Any], verify_report: Dict[str, Any], output_dir: str = 'dataset_report'):
        self.scan_report = scan_report
        self.quality_report = quality_report
        self.verify_report = verify_report
        self.output_dir = output_dir

    def generate_all(self):
        os.makedirs(self.output_dir, exist_ok=True)
        print(f"Generating production dataset reports in '{self.output_dir}'...")

        self._export_summary_json()
        self._export_summary_md()
        self._export_class_distribution_csv()
        self._export_duplicate_report_csv()
        self._export_quality_report_csv()
        self._export_corrupted_files_csv()
        self._export_statistics_txt()
        self._generate_plots()

        print(f"All reports and plots generated successfully inside '{self.output_dir}/'.")

    def _export_summary_json(self):
        json_path = os.path.join(self.output_dir, 'dataset_summary.json')
        combined = {
            'scan': {k: v for k, v in self.scan_report.items() if k != 'inspections'},
            'quality_summary': self.quality_report.get('summary', {}),
            'verification': self.verify_report
        }
        with open(json_path, 'w') as f:
            json.dump(combined, f, indent=4)

    def _export_summary_md(self):
        md_path = os.path.join(self.output_dir, 'dataset_summary.md')
        scan_sum = self.scan_report.get('summary', {})
        cls_insp = self.scan_report.get('class_inspection', {})
        qual_sum = self.quality_report.get('summary', {})
        verif = self.verify_report

        content = f"""# DharaAI - Dataset Inspection & Quality Report

## 1. Executive Summary
- **Total Images Scanned**: {self.scan_report.get('total_files_scanned', 0)}
- **Number of Classes**: {cls_insp.get('num_classes', 0)}
- **Verification Status**: {"PASSED" if verif.get('verification_passed') else "WARNING (Anomalies Found)"}
- **Data Leakage Detected**: {"YES" if verif.get('data_leakage', {}).get('has_leakage') else "NO"}

---

## 2. Dataset Health & Defect Summary
| Metric | Count |
| :--- | :--- |
| Corrupted / Unreadable Images | {scan_sum.get('corrupted_count', 0) + scan_sum.get('unreadable_count', 0)} |
| Zero-Byte Files | {scan_sum.get('zero_byte_count', 0)} |
| Unsupported Formats / Extensions | {scan_sum.get('unsupported_format_count', 0) + scan_sum.get('wrong_extension_count', 0)} |
| Exact Duplicate Images (MD5) | {scan_sum.get('exact_duplicates_count', 0)} |
| Near-Duplicate Images (pHash) | {scan_sum.get('near_duplicates_count', 0)} |
| Extremely Small Images (<64px) | {scan_sum.get('extremely_small_count', 0)} |
| Grayscale / Single-Channel | {scan_sum.get('grayscale_count', 0)} |
| Alpha Channel Presence | {scan_sum.get('alpha_channel_count', 0)} |
| Unusual Aspect Ratios | {scan_sum.get('unusual_aspect_ratio_count', 0)} |
| Suspicious Quality Images | {qual_sum.get('suspicious_images_count', 0)} |

---

## 3. Class Distribution & Imbalance
- **Largest Class**: `{cls_insp.get('largest_class', {}).get('name')}` ({cls_insp.get('largest_class', {}).get('count')} images)
- **Smallest Class**: `{cls_insp.get('smallest_class', {}).get('name')}` ({cls_insp.get('smallest_class', {}).get('count')} images)
- **Average Images / Class**: {cls_insp.get('average_images_per_class', 0)}
- **Class Imbalance Ratio**: {cls_insp.get('imbalance_ratio', 0)}x
- **Empty Classes**: {cls_insp.get('empty_classes', []) if cls_insp.get('empty_classes') else "None"}

---

## 4. Image Quality Metrics Summary
- **Blur Score (Laplacian Var)**: Mean = {qual_sum.get('metrics', {}).get('blur', {}).get('mean', 0)} (Min = {qual_sum.get('metrics', {}).get('blur', {}).get('min', 0)}, Max = {qual_sum.get('metrics', {}).get('blur', {}).get('max', 0)})
- **Brightness**: Mean = {qual_sum.get('metrics', {}).get('brightness', {}).get('mean', 0)}
- **Contrast**: Mean = {qual_sum.get('metrics', {}).get('contrast', {}).get('mean', 0)}
- **Sharpness**: Mean = {qual_sum.get('metrics', {}).get('sharpness', {}).get('mean', 0)}
- **Noise Index**: Mean = {qual_sum.get('metrics', {}).get('noise', {}).get('mean', 0)}
"""
        with open(md_path, 'w') as f:
            f.write(content)

    def _export_class_distribution_csv(self):
        csv_path = os.path.join(self.output_dir, 'class_distribution.csv')
        cls_counts = self.scan_report.get('class_inspection', {}).get('class_counts', {})
        split_counts = self.scan_report.get('class_inspection', {}).get('split_class_counts', {})

        splits = sorted(list(split_counts.keys()))

        with open(csv_path, 'w', newline='') as f:
            writer = csv.writer(f)
            header = ['class_name', 'total_count'] + [f'count_{s}' for s in splits]
            writer.writerow(header)
            for cls, total in sorted(cls_counts.items()):
                row = [cls, total] + [split_counts[s].get(cls, 0) for s in splits]
                writer.writerow(row)

    def _export_duplicate_report_csv(self):
        csv_path = os.path.join(self.output_dir, 'duplicate_report.csv')
        exact_dups = self.scan_report.get('issues', {}).get('exact_duplicates', {})
        
        with open(csv_path, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['md5_hash', 'file_count', 'filepath', 'class_name', 'split'])
            for md5, items in exact_dups.items():
                for fp, cls, sp in items:
                    writer.writerow([md5, len(items), fp, cls, sp])

    def _export_quality_report_csv(self):
        csv_path = os.path.join(self.output_dir, 'quality_report.csv')
        results = self.quality_report.get('all_results', [])

        with open(csv_path, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['filepath', 'class_name', 'split', 'width', 'height', 'blur_score', 'brightness', 'contrast', 'sharpness', 'noise_score', 'is_suspicious', 'suspicious_reasons'])
            for r in results:
                reasons_str = "; ".join(r.get('suspicious_reasons', []))
                writer.writerow([
                    r.get('filepath'), r.get('class_name'), r.get('split'),
                    r.get('width'), r.get('height'), r.get('blur_score'),
                    r.get('brightness'), r.get('contrast'), r.get('sharpness'),
                    r.get('noise_score'), r.get('is_suspicious'), reasons_str
                ])

    def _export_corrupted_files_csv(self):
        csv_path = os.path.join(self.output_dir, 'corrupted_files.csv')
        issues = self.scan_report.get('issues', {})
        corrupted = issues.get('corrupted', []) + issues.get('unreadable', []) + issues.get('zero_byte', [])

        with open(csv_path, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['filepath', 'class_name', 'split', 'issue_type', 'error_detail'])
            for item in corrupted:
                issue_type = "corrupted" if item.get('is_corrupted') else ("zero_byte" if item.get('is_zero_byte') else "unreadable")
                writer.writerow([item.get('filepath'), item.get('class_name'), item.get('split'), issue_type, item.get('error_msg')])

    def _export_statistics_txt(self):
        txt_path = os.path.join(self.output_dir, 'dataset_statistics.txt')
        cls_insp = self.scan_report.get('class_inspection', {})
        qual_sum = self.quality_report.get('summary', {})
        
        lines = [
            "============================================================",
            "   DHARA AI - DATASET STATISTICAL REPORT   ",
            "============================================================",
            f"Total Scanned Files         : {self.scan_report.get('total_files_scanned')}",
            f"Total Classes               : {cls_insp.get('num_classes')}",
            f"Largest Class               : {cls_insp.get('largest_class', {}).get('name')} ({cls_insp.get('largest_class', {}).get('count')} images)",
            f"Smallest Class              : {cls_insp.get('smallest_class', {}).get('name')} ({cls_insp.get('smallest_class', {}).get('count')} images)",
            f"Average Images / Class      : {cls_insp.get('average_images_per_class')}",
            f"Class Imbalance Ratio       : {cls_insp.get('imbalance_ratio')}x",
            "------------------------------------------------------------",
            "QUALITY METRICS:",
            f"  Mean Blur Score           : {qual_sum.get('metrics', {}).get('blur', {}).get('mean')}",
            f"  Mean Brightness           : {qual_sum.get('metrics', {}).get('brightness', {}).get('mean')}",
            f"  Mean Contrast             : {qual_sum.get('metrics', {}).get('contrast', {}).get('mean')}",
            f"  Mean Sharpness            : {qual_sum.get('metrics', {}).get('sharpness', {}).get('mean')}",
            f"  Mean Noise Score          : {qual_sum.get('metrics', {}).get('noise', {}).get('mean')}",
            "============================================================"
        ]
        with open(txt_path, 'w') as f:
            f.write("\n".join(lines))

    def _generate_plots(self):
        print("Rendering publication-grade visualization plots...")

        # 1. Class Distribution Bar Plot
        cls_counts = self.scan_report.get('class_inspection', {}).get('class_counts', {})
        if cls_counts:
            sorted_classes = sorted(cls_counts.items(), key=lambda x: x[1], reverse=True)
            names = [x[0] for x in sorted_classes]
            counts = [x[1] for x in sorted_classes]

            plt.figure(figsize=(14, 8))
            bars = plt.barh(names[::-1], counts[::-1], color='#2b5c8f', edgecolor='black', alpha=0.85)
            plt.xlabel('Number of Images', fontsize=12, fontweight='bold')
            plt.title('PlantVillage Dataset Class Distribution', fontsize=14, fontweight='bold', pad=15)
            plt.grid(axis='x', linestyle='--', alpha=0.7)
            plt.tight_layout()
            plt.savefig(os.path.join(self.output_dir, 'class_distribution.png'), dpi=300)
            plt.close()

        # 2. Image Resolution Distribution
        qual_results = self.quality_report.get('all_results', [])
        widths = [r['width'] for r in qual_results if r['width'] > 0]
        heights = [r['height'] for r in qual_results if r['height'] > 0]
        if widths and heights:
            plt.figure(figsize=(8, 6))
            plt.scatter(widths, heights, color='#e74c3c', alpha=0.5, edgecolors='none', s=25)
            plt.xlabel('Width (pixels)', fontsize=12, fontweight='bold')
            plt.ylabel('Height (pixels)', fontsize=12, fontweight='bold')
            plt.title('Image Resolution Scatter Plot', fontsize=14, fontweight='bold')
            plt.grid(True, linestyle='--', alpha=0.5)
            plt.tight_layout()
            plt.savefig(os.path.join(self.output_dir, 'image_resolution_distribution.png'), dpi=300)
            plt.close()

        # 3. Brightness Histogram
        brightnesses = [r['brightness'] for r in qual_results if r['width'] > 0]
        if brightnesses:
            plt.figure(figsize=(8, 6))
            plt.hist(brightnesses, bins=40, color='#f39c12', edgecolor='black', alpha=0.75)
            plt.axvline(np.mean(brightnesses), color='red', linestyle='dashed', linewidth=2, label=f'Mean ({np.mean(brightnesses):.1f})')
            plt.xlabel('Brightness Level (0 - 255)', fontsize=12, fontweight='bold')
            plt.ylabel('Image Count', fontsize=12, fontweight='bold')
            plt.title('Brightness Distribution Histogram', fontsize=14, fontweight='bold')
            plt.legend()
            plt.grid(axis='y', linestyle='--', alpha=0.7)
            plt.tight_layout()
            plt.savefig(os.path.join(self.output_dir, 'brightness_histogram.png'), dpi=300)
            plt.close()

        # 4. Blur Histogram (Laplacian Variance)
        blurs = [r['blur_score'] for r in qual_results if r['blur_score'] > 0]
        if blurs:
            plt.figure(figsize=(8, 6))
            plt.hist(blurs, bins=40, color='#27ae60', edgecolor='black', alpha=0.75)
            plt.axvline(np.mean(blurs), color='red', linestyle='dashed', linewidth=2, label=f'Mean ({np.mean(blurs):.1f})')
            plt.xlabel('Laplacian Variance Blur Score', fontsize=12, fontweight='bold')
            plt.ylabel('Image Count', fontsize=12, fontweight='bold')
            plt.title('Image Blur Distribution Histogram', fontsize=14, fontweight='bold')
            plt.legend()
            plt.grid(axis='y', linestyle='--', alpha=0.7)
            plt.tight_layout()
            plt.savefig(os.path.join(self.output_dir, 'blur_histogram.png'), dpi=300)
            plt.close()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Generate dataset inspection reports and plots.")
    parser.add_argument('--scan-file', type=str, default='dataset_scan_results.json', help='Scan results JSON')
    parser.add_argument('--quality-file', type=str, default='quality_analysis.json', help='Quality results JSON')
    parser.add_argument('--verify-file', type=str, default='verification_report.json', help='Verification report JSON')
    parser.add_argument('--output-dir', type=str, default='dataset_report', help='Output directory for reports')
    args = parser.parse_args()

    with open(args.scan_file, 'r') as f:
        scan_data = json.load(f)
    with open(args.quality_file, 'r') as f:
        qual_data = json.load(f)
    with open(args.verify_file, 'r') as f:
        verify_data = json.load(f)

    rg = ReportGenerator(scan_data, qual_data, verify_data, output_dir=args.output_dir)
    rg.generate_all()
