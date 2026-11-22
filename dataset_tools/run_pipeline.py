import os
import sys
import argparse
import json
from datetime import datetime

from dataset_tools.scan_dataset import DatasetScanner
from dataset_tools.image_quality import QualityAnalyzer
from dataset_tools.remove_duplicates import DuplicateDetector, relocate_duplicates
from dataset_tools.verify_dataset import DatasetVerifier
from dataset_tools.dataset_report import ReportGenerator
from dataset_tools.clean_dataset import DatasetCleaner

def run_pipeline(
    data_dir: str,
    output_report_dir: str = 'dataset_report',
    review_dir: str = 'dataset/review',
    workers: int = 8,
    execute_clean: bool = False
):
    """
    Run end-to-end dataset engineering pipeline:
    1. Scan Dataset
    2. Analyze Image Quality
    3. Detect Duplicates
    4. Verify Splits & Leakage
    5. Generate Reports & Plots
    6. Non-Destructive Cleaning / Move Flagged to Review
    """
    print("=" * 70)
    print(" DHARA AI - DATASET ENGINEERING PIPELINE")
    print("=" * 70)
    print(f" Data Directory    : {data_dir}")
    print(f" Report Directory  : {output_report_dir}")
    print(f" Review Directory  : {review_dir}")
    print(f" Parallel Workers  : {workers}")
    print(f" Clean Execution   : {'ENABLED (Moves flagged files)' if execute_clean else 'DRY RUN (Inspection only)'}")
    print("=" * 70)

    start_time = datetime.now()

    # Step 1: Scan Dataset
    print("\n---> STEP 1/5: Dataset Scanning...")
    scanner = DatasetScanner(data_dir=data_dir, workers=workers)
    scan_report = scanner.scan()

    # Step 2: Quality Analysis
    print("\n---> STEP 2/5: Image Quality Analysis...")
    quality_analyzer = QualityAnalyzer(data_dir=data_dir, workers=workers)
    quality_report = quality_analyzer.analyze()

    # Step 3: Verification & Leakage Detection
    print("\n---> STEP 3/5: Verification & Data Leakage Detection...")
    verifier = DatasetVerifier(data_dir=data_dir, workers=workers)
    verify_report = verifier.verify()

    # Step 4: Report Generation & Plotting
    print("\n---> STEP 4/5: Report Generation & Plotting...")
    report_gen = ReportGenerator(
        scan_report=scan_report,
        quality_report=quality_report,
        verify_report=verify_report,
        output_dir=output_report_dir
    )
    report_gen.generate_all()

    # Step 5: Cleaning & Review Relocation
    print("\n---> STEP 5/5: Non-Destructive Dataset Cleaning...")
    cleaner = DatasetCleaner(review_dir=review_dir, dry_run=(not execute_clean))
    cleaning_logs = cleaner.clean(scan_report, quality_report)

    # Relocate duplicates if executing clean
    if execute_clean:
        dup_detector = DuplicateDetector(data_dir=data_dir, workers=workers)
        dup_report = dup_detector.find_duplicates()
        relocate_duplicates(dup_report, review_dir=review_dir, dry_run=False)

    duration = (datetime.now() - start_time).total_seconds()
    print("\n" + "=" * 70)
    print(f" PIPELINE COMPLETE in {duration:.2f} seconds")
    print(f" Summary Report : {os.path.abspath(output_report_dir)}/dataset_summary.md")
    print(f" Review Folder  : {os.path.abspath(review_dir)}")
    print("=" * 70)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Run complete DharaAI dataset engineering pipeline.")
    parser.add_argument('--data-dir', type=str, default='Dataset/Plant Village Dataset', help='Path to dataset directory')
    parser.add_argument('--report-dir', type=str, default='dataset_report', help='Path for output reports and plots')
    parser.add_argument('--review-dir', type=str, default='dataset/review', help='Path for review/relocated files')
    parser.add_argument('--workers', type=int, default=8, help='Number of parallel workers')
    parser.add_argument('--execute-clean', action='store_true', help='Perform actual file moves to review directory')
    args = parser.parse_args()

    run_pipeline(
        data_dir=args.data_dir,
        output_report_dir=args.report_dir,
        review_dir=args.review_dir,
        workers=args.workers,
        execute_clean=args.execute_clean
    )
