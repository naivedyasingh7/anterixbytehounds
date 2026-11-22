# DharaAI - Dataset Engineering Tools (`dataset_tools`)

A modular, production-grade dataset inspection, cleaning, quality analysis, leakage detection, and report generation framework designed for the PlantVillage crop disease dataset.

Optimized for **Apple Silicon (M1/M2/M3/M4 macOS)** utilizing multi-threaded CPU execution with zero CUDA dependencies.

---

## 📁 Module Architecture

```
dataset_tools/
│
├── __init__.py          # Package initialization
├── scan_dataset.py      # Full image scanner (corruption, zero-byte, formats, dimensions, channels)
├── image_quality.py     # Image quality evaluator (Laplacian blur, brightness, contrast, sharpness, noise)
├── remove_duplicates.py # MD5 exact & pHash/dHash near-duplicate detector
├── verify_dataset.py    # Cross-split validator (Train/Val/Test consistency, cross-split leakage detector)
├── dataset_report.py    # Report aggregator & Matplotlib plot renderer
├── clean_dataset.py     # Non-destructive file manager (relocates flagged files to dataset/review/)
├── split_dataset.py     # Stratified train/val/test dataset splitter
├── run_pipeline.py      # Master CLI entry point for end-to-end processing
├── utils.py             # Shared utilities (hashing, magic bytes, parallel worker pool)
└── README.md            # Module documentation
```

---

## ⚡ Key Features

### 1. **Dataset Scanner (`scan_dataset.py`)**
Inspects every image in the dataset to detect:
- Corrupted images & unreadable files
- Zero-byte files
- Extension vs. magic-byte format mismatches
- Duplicate filenames & duplicate hashes
- Extremely small images (<64px)
- Grayscale / 1-channel images & alpha channel (RGBA/Palette) issues
- Inconsistent dimensions & unusual aspect ratios (`< 0.5` or `> 2.0`)
- Class inspection metrics: Total classes, images per class, empty classes, largest/smallest classes, imbalance ratio.

### 2. **Quality Analyzer (`image_quality.py`)**
Evaluates every image using computer vision metrics:
- **Blur**: Variance of Laplacian (`cv2.Laplacian`)
- **Brightness**: Grayscale intensity mean
- **Contrast**: Intensity standard deviation
- **Sharpness**: Mean Sobel gradient magnitude
- **Noise Index**: Median filter residual difference
- Flags suspicious images without auto-deleting them.

### 3. **Duplicate Detection & Management (`remove_duplicates.py`)**
- Computes exact MD5 checksums and perceptual hashes (dHash / pHash).
- Identifies duplicate groups and calculates Hamming distance for near-duplicates.
- Relocates duplicate copies to `dataset/review/duplicates/` while retaining one master image per group.

### 4. **Split Verification & Leakage Detection (`verify_dataset.py`)**
- Verifies class name alignment and folder structure consistency across `train/`, `val/`, and `test/` splits.
- Detects dataset leakage (duplicate images present across multiple splits).

### 5. **Report & Visualization Generation (`dataset_report.py`)**
Generates `dataset_report/` directory containing:
- `dataset_summary.json`
- `dataset_summary.md`
- `class_distribution.csv`
- `duplicate_report.csv`
- `quality_report.csv`
- `corrupted_files.csv`
- `dataset_statistics.txt`
- Publication-quality PNG plots:
  - `class_distribution.png`
  - `image_resolution_distribution.png`
  - `brightness_histogram.png`
  - `blur_histogram.png`

### 6. **Non-Destructive Dataset Cleaner (`clean_dataset.py`)**
- **Safety Principle**: Never deletes files, never overwrites images, never alters pixels.
- Moves flagged problematic files into `dataset/review/{category}/{class_name}/`.
- Writes JSON/CSV audit logs detailing every moved file and rationale.

---

## 🚀 Quick Start Guide

### 1. Run End-to-End Pipeline
```bash
python -m dataset_tools.run_pipeline --data-dir "Dataset/Plant Village Dataset" --report-dir "dataset_report"
```

### 2. Run Individual Modules

#### Scan Dataset:
```bash
python -m dataset_tools.scan_dataset --data-dir "Dataset/Plant Village Dataset" --output scan_output.json
```

#### Analyze Image Quality:
```bash
python -m dataset_tools.image_quality --data-dir "Dataset/Plant Village Dataset" --output quality_output.json
```

#### Verify Splits & Leakage:
```bash
python -m dataset_tools.verify_dataset --data-dir "Dataset/Plant Village Dataset" --output verify_output.json
```

#### Generate Reports & Graphs:
```bash
python -m dataset_tools.dataset_report --scan-file scan_output.json --quality-file quality_output.json --verify-file verify_output.json --output-dir dataset_report
```

#### Execute Non-Destructive Cleaning:
```bash
python -m dataset_tools.clean_dataset --scan-file scan_output.json --quality-file quality_output.json --review-dir dataset/review --execute
```
