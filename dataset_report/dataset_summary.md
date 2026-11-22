# DharaAI - Dataset Inspection & Quality Report

## 1. Executive Summary
- **Total Images Scanned**: 67118
- **Number of Classes**: 29
- **Verification Status**: WARNING (Anomalies Found)
- **Data Leakage Detected**: YES

---

## 2. Dataset Health & Defect Summary
| Metric | Count |
| :--- | :--- |
| Corrupted / Unreadable Images | 0 |
| Zero-Byte Files | 0 |
| Unsupported Formats / Extensions | 0 |
| Exact Duplicate Images (MD5) | 33 |
| Near-Duplicate Images (pHash) | 831 |
| Extremely Small Images (<64px) | 0 |
| Grayscale / Single-Channel | 0 |
| Alpha Channel Presence | 0 |
| Unusual Aspect Ratios | 0 |
| Suspicious Quality Images | 5662 |

---

## 3. Class Distribution & Imbalance
- **Largest Class**: `Apple - Apple Scab` (2520 images)
- **Smallest Class**: `Corn (Maize) - Cercospora Leaf Spot` (2056 images)
- **Average Images / Class**: 2314.41
- **Class Imbalance Ratio**: 1.23x
- **Empty Classes**: None

---

## 4. Image Quality Metrics Summary
- **Blur Score (Laplacian Var)**: Mean = 4033.18 (Min = 4.66, Max = 32269.42)
- **Brightness**: Mean = 122.19
- **Contrast**: Mean = 42.82
- **Sharpness**: Mean = 70.18
- **Noise Index**: Mean = 7.78
