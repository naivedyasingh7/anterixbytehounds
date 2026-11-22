# DharaAI - Dataset Engineering Pipeline Documentation

This document describes the complete production dataset inspection, cleaning, quality analysis, leakage detection, and report generation pipeline for DharaAI's PlantVillage dataset.

---

## 📌 Expected Directory Structure

### 1. Source Dataset Directory (`Dataset/Plant Village Dataset`)
```
Dataset/
└── Plant Village Dataset/
    ├── Train/
    │   ├── Apple - Apple Scab/
    │   ├── Apple - Black Rot/
    │   └── ... (29 plant disease & healthy classes)
    ├── Val/
    └── Test/
```

### 2. Cleaned & Review Directory (`dataset/`)
```
dataset/
├── raw/            # Preserved original data (unmodified)
├── cleaned/        # Cleaned dataset (train/val/test splits ready for ConvNeXt)
└── review/         # Non-destructively relocated flagged images
    ├── corrupted/
    ├── duplicates/
    ├── wrong_extension/
    ├── extremely_small/
    ├── unusual_aspect_ratio/
    ├── suspicious_quality/
    └── logs/       # Audit trail of all relocations
```

### 3. Generated Reports Directory (`dataset_report/`)
```
dataset_report/
├── dataset_summary.json
├── dataset_summary.md
├── class_distribution.csv
├── duplicate_report.csv
├── quality_report.csv
├── corrupted_files.csv
├── dataset_statistics.txt
├── class_distribution.png
├── image_resolution_distribution.png
├── brightness_histogram.png
└── blur_histogram.png
```

---

## 🛠️ Step-by-Step Operations Guide

### Step 1: Scan Dataset for Integrity & Defective Files
Run the comprehensive dataset scanner to check every image for file corruption, zero-byte status, magic byte mismatch, duplicate hashes/filenames, grayscale mode, alpha transparency, and resolution anomalies.

```bash
python -m dataset_tools.scan_dataset --data-dir "Dataset/Plant Village Dataset" --output dataset_scan_results.json
```

### Step 2: Perform Image Quality Analysis
Evaluate image blur (Laplacian variance), brightness, contrast, sharpness, and noise estimation.

```bash
python -m dataset_tools.image_quality --data-dir "Dataset/Plant Village Dataset" --output quality_analysis.json
```

### Step 3: Detect & Manage Duplicate Images
Detect exact MD5 content duplicates and perceptual near-duplicates (pHash/dHash).

```bash
python -m dataset_tools.remove_duplicates --data-dir "Dataset/Plant Village Dataset" --output duplicate_report.json
```

### Step 4: Verify Class Consistency & Detect Cross-Split Leakage
Verify class folder matching across `train/`, `val/`, and `test/` splits and detect any image duplicates appearing across different splits.

```bash
python -m dataset_tools.verify_dataset --data-dir "Dataset/Plant Village Dataset" --output verification_report.json
```

### Step 5: Generate All Production Reports & Visualization Plots
Compile all inspection results into structured CSV, JSON, MD, TXT reports and publication-grade Matplotlib plots inside `dataset_report/`.

```bash
python -m dataset_tools.dataset_report \
    --scan-file dataset_scan_results.json \
    --quality-file quality_analysis.json \
    --verify-file verification_report.json \
    --output-dir dataset_report
```

### Step 6: Perform Non-Destructive Dataset Cleaning
Move flagged images (corrupted, duplicates, low quality) into `dataset/review/` with audit logging.

```bash
# Dry run (Preview moves without touching files)
python -m dataset_tools.clean_dataset --scan-file dataset_scan_results.json --quality-file quality_analysis.json --review-dir dataset/review

# Execute actual moves
python -m dataset_tools.clean_dataset --scan-file dataset_scan_results.json --quality-file quality_analysis.json --review-dir dataset/review --execute
```

---

## 🎯 Unified Single-Command Execution

To run the complete pipeline (Scanning -> Quality -> Leakage -> Reports -> Review Relocation) in one step:

```bash
python -m dataset_tools.run_pipeline --data-dir "Dataset/Plant Village Dataset" --report-dir "dataset_report" --review-dir "dataset/review"
```

To enable file relocation during pipeline execution:
```bash
python -m dataset_tools.run_pipeline --data-dir "Dataset/Plant Village Dataset" --report-dir "dataset_report" --review-dir "dataset/review" --execute-clean
```

---

## 🔒 Safety & Platform Optimization
1. **Non-Destructive Assurance**: Original files are never deleted or overwritten, and pixel contents are never modified.
2. **Apple Silicon & MPS Compatibility**: Uses multi-threaded CPU worker pools (`ThreadPoolExecutor`) tailored for Apple Silicon (M1/M2/M3/M4) without requiring CUDA.
