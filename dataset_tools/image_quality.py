import os
import argparse
import json
from typing import Dict, List, Any, Tuple
import cv2
import numpy as np
from PIL import Image

from dataset_tools.utils import get_all_image_paths, run_parallel

def analyze_single_image_quality(item: Tuple[str, str, str]) -> Dict[str, Any]:
    """
    Compute quality metrics for a single image:
    - Blur (Laplacian Variance)
    - Brightness (Grayscale Mean)
    - Contrast (Grayscale Std Dev)
    - Sharpness (Sobel Gradient Mean)
    - Resolution (W x H, Total Pixels)
    - Noise Estimation (Difference between image and median filtered image)
    """
    filepath, class_name, split = item
    res = {
        'filepath': filepath,
        'filename': os.path.basename(filepath),
        'class_name': class_name,
        'split': split,
        'width': 0,
        'height': 0,
        'total_pixels': 0,
        'blur_score': 0.0,
        'brightness': 0.0,
        'contrast': 0.0,
        'sharpness': 0.0,
        'noise_score': 0.0,
        'is_suspicious': False,
        'suspicious_reasons': [],
        'error': None
    }

    try:
        # Load using OpenCV for efficient matrix operations
        img = cv2.imread(filepath)
        if img is None:
            res['is_suspicious'] = True
            res['suspicious_reasons'].append("Failed to load image with OpenCV")
            res['error'] = "OpenCV imread return None"
            return res

        h, w, c = img.shape
        res['width'] = w
        res['height'] = h
        res['total_pixels'] = w * h

        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # 1. Blur score: Laplacian Variance
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        res['blur_score'] = round(float(laplacian_var), 2)

        # 2. Brightness: Mean grayscale pixel intensity
        brightness = float(np.mean(gray))
        res['brightness'] = round(brightness, 2)

        # 3. Contrast: Standard deviation of pixel intensities
        contrast = float(np.std(gray))
        res['contrast'] = round(contrast, 2)

        # 4. Sharpness: Sobel gradient magnitude
        sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
        sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
        magnitude = np.sqrt(sobelx**2 + sobely**2)
        sharpness = float(np.mean(magnitude))
        res['sharpness'] = round(sharpness, 2)

        # 5. Noise estimation: Difference from median filter
        median_filtered = cv2.medianBlur(gray, 3)
        noise_residual = np.abs(gray.astype(np.float32) - median_filtered.astype(np.float32))
        noise_score = float(np.mean(noise_residual))
        res['noise_score'] = round(noise_score, 2)

        # Flag suspicious conditions based on threshold rules
        reasons = []
        if res['blur_score'] < 100.0:
            reasons.append("Severe blur (Laplacian variance < 100)")
        elif res['blur_score'] < 250.0:
            reasons.append("Moderate blur (Laplacian variance < 250)")

        if res['brightness'] < 40.0:
            reasons.append("Under-exposed / extremely dark (brightness < 40)")
        elif res['brightness'] > 220.0:
            reasons.append("Over-exposed / extremely bright (brightness > 220)")

        if res['contrast'] < 20.0:
            reasons.append("Low contrast (std dev < 20)")

        if res['noise_score'] > 25.0:
            reasons.append("High noise level (noise score > 25)")

        if res['total_pixels'] < 64 * 64:
            reasons.append("Low resolution (< 4096 pixels)")

        if reasons:
            res['is_suspicious'] = True
            res['suspicious_reasons'] = reasons

    except Exception as e:
        res['is_suspicious'] = True
        res['suspicious_reasons'].append(f"Quality computation exception: {str(e)}")
        res['error'] = str(e)

    return res

class QualityAnalyzer:
    def __init__(self, data_dir: str, workers: int = 8):
        self.data_dir = data_dir
        self.workers = workers

    def analyze(self) -> Dict[str, Any]:
        """Analyze image quality across dataset."""
        print(f"Analyzing image quality for '{self.data_dir}' using {self.workers} workers...")
        image_items = get_all_image_paths(self.data_dir)
        total = len(image_items)
        print(f"Found {total} images for quality inspection.")

        results = run_parallel(image_items, analyze_single_image_quality, max_workers=self.workers)

        suspicious_list = [r for r in results if r['is_suspicious']]
        
        # Summary statistics
        blur_scores = [r['blur_score'] for r in results if r['blur_score'] > 0]
        brightness_scores = [r['brightness'] for r in results if r['width'] > 0]
        contrast_scores = [r['contrast'] for r in results if r['width'] > 0]
        sharpness_scores = [r['sharpness'] for r in results if r['width'] > 0]
        noise_scores = [r['noise_score'] for r in results if r['width'] > 0]

        summary = {
            'total_images_analyzed': total,
            'suspicious_images_count': len(suspicious_list),
            'clean_images_count': total - len(suspicious_list),
            'metrics': {
                'blur': {
                    'mean': round(float(np.mean(blur_scores)), 2) if blur_scores else 0,
                    'min': round(float(np.min(blur_scores)), 2) if blur_scores else 0,
                    'max': round(float(np.max(blur_scores)), 2) if blur_scores else 0
                },
                'brightness': {
                    'mean': round(float(np.mean(brightness_scores)), 2) if brightness_scores else 0,
                    'min': round(float(np.min(brightness_scores)), 2) if brightness_scores else 0,
                    'max': round(float(np.max(brightness_scores)), 2) if brightness_scores else 0
                },
                'contrast': {
                    'mean': round(float(np.mean(contrast_scores)), 2) if contrast_scores else 0,
                    'min': round(float(np.min(contrast_scores)), 2) if contrast_scores else 0,
                    'max': round(float(np.max(contrast_scores)), 2) if contrast_scores else 0
                },
                'sharpness': {
                    'mean': round(float(np.mean(sharpness_scores)), 2) if sharpness_scores else 0,
                    'min': round(float(np.min(sharpness_scores)), 2) if sharpness_scores else 0,
                    'max': round(float(np.max(sharpness_scores)), 2) if sharpness_scores else 0
                },
                'noise': {
                    'mean': round(float(np.mean(noise_scores)), 2) if noise_scores else 0,
                    'min': round(float(np.min(noise_scores)), 2) if noise_scores else 0,
                    'max': round(float(np.max(noise_scores)), 2) if noise_scores else 0
                }
            }
        }

        return {
            'summary': summary,
            'suspicious_images': suspicious_list,
            'all_results': results
        }

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Image quality analysis tool.")
    parser.add_argument('--data-dir', type=str, default='Dataset/Plant Village Dataset', help='Path to dataset directory')
    parser.add_argument('--workers', type=int, default=8, help='Number of workers')
    parser.add_argument('--output', type=str, default='quality_analysis.json', help='Output JSON file')
    args = parser.parse_args()

    analyzer = QualityAnalyzer(data_dir=args.data_dir, workers=args.workers)
    report = analyzer.analyze()

    out_data = {
        'summary': report['summary'],
        'suspicious_images': report['suspicious_images']
    }
    with open(args.output, 'w') as f:
        json.dump(out_data, f, indent=4)
    print(f"Quality analysis summary saved to '{args.output}'. Found {report['summary']['suspicious_images_count']} suspicious images.")
