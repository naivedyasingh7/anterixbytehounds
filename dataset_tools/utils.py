import os
import hashlib
import os.path
from concurrent.futures import ThreadPoolExecutor
from typing import List, Dict, Any, Tuple, Optional, Callable
import numpy as np
from PIL import Image, ImageOps
import cv2

# Supported formats and their magic bytes signature
MAGIC_BYTES = {
    b'\xff\xd8\xff': 'JPEG',
    b'\x89PNG\r\n\x1a\n': 'PNG',
    b'BM': 'BMP',
    b'RIFF': 'WEBP',
    b'II*\x00': 'TIFF',
    b'MM\x00*': 'TIFF'
}

SUPPORTED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.bmp', '.webp', '.tiff', '.tif'}

def get_magic_bytes_format(filepath: str) -> Optional[str]:
    """Detect image format using file magic bytes."""
    try:
        if not os.path.exists(filepath) or os.path.getsize(filepath) == 0:
            return None
        with open(filepath, 'rb') as f:
            header = f.read(12)
            for magic, fmt in MAGIC_BYTES.items():
                if header.startswith(magic):
                    return fmt
                if magic == b'RIFF' and header.startswith(b'RIFF') and header[8:12] == b'WEBP':
                    return 'WEBP'
        return None
    except Exception:
        return None

def compute_md5(filepath: str, chunk_size: int = 65536) -> str:
    """Compute MD5 checksum of a file in chunks."""
    md5 = hashlib.md5()
    with open(filepath, 'rb') as f:
        for chunk in iter(lambda: f.read(chunk_size), b''):
            md5.update(chunk)
    return md5.hexdigest()

def compute_dhash(image: Image.Image, hash_size: int = 8) -> str:
    """
    Compute Difference Hash (dHash) of an image.
    Outputs a hex string of length hash_size * hash_size / 4.
    """
    # Convert to grayscale and resize to (hash_size + 1, hash_size)
    gray = image.convert('L').resize((hash_size + 1, hash_size), Image.Resampling.BILINEAR)
    pixels = np.array(gray, dtype=np.int32)
    # Compare adjacent pixels in each row
    diff = pixels[:, 1:] > pixels[:, :-1]
    # Convert boolean array to bit string then hex
    bits = diff.flatten()
    hex_str = ''
    for i in range(0, len(bits), 4):
        chunk = bits[i:i+4]
        val = sum([b * (2 ** (3 - j)) for j, b in enumerate(chunk)])
        hex_str += f'{val:x}'
    return hex_str

def compute_phash(image: Image.Image, hash_size: int = 8, highfreq_factor: int = 4) -> str:
    """
    Compute Perceptual Hash (pHash) using discrete cosine transform (DCT).
    """
    img_size = hash_size * highfreq_factor
    gray = image.convert('L').resize((img_size, img_size), Image.Resampling.BILINEAR)
    pixels = np.array(gray, dtype=np.float32)
    
    # Compute 2D DCT using OpenCV
    dct = cv2.dct(pixels)
    # Extract top-left low frequencies (excluding DC component at [0,0])
    dct_lowfreq = dct[0:hash_size, 0:hash_size]
    med = np.median(dct_lowfreq)
    diff = dct_lowfreq > med
    
    bits = diff.flatten()
    hex_str = ''
    for i in range(0, len(bits), 4):
        chunk = bits[i:i+4]
        val = sum([b * (2 ** (3 - j)) for j, b in enumerate(chunk)])
        hex_str += f'{val:x}'
    return hex_str

def hamming_distance(hex1: str, hex2: str) -> int:
    """Calculate Hamming distance between two hex-encoded hash strings of equal length."""
    if len(hex1) != len(hex2):
        return 999
    try:
        val1 = int(hex1, 16)
        val2 = int(hex2, 16)
        xor_val = val1 ^ val2
        return bin(xor_val).count('1')
    except ValueError:
        return 999

def get_all_image_paths(data_dir: str) -> List[Tuple[str, str, str]]:
    """
    Recursively retrieve all files from data_dir.
    Returns list of tuples: (abs_path, class_name, split_name)
    """
    results = []
    if not os.path.exists(data_dir):
        return results

    # Determine if data_dir is split structured (Train/Val/Test or train/val/test) or single class directory
    subdirs = [d for d in os.listdir(data_dir) if os.path.isdir(os.path.join(data_dir, d)) and not d.startswith('.')]
    split_names_lower = {'train', 'val', 'valid', 'validation', 'test'}
    
    has_splits = any(d.lower() in split_names_lower for d in subdirs)

    if has_splits:
        for split in subdirs:
            split_path = os.path.join(data_dir, split)
            if not os.path.isdir(split_path):
                continue
            for root, _, files in os.walk(split_path):
                rel_root = os.path.relpath(root, split_path)
                class_name = rel_root.split(os.sep)[0] if rel_root != '.' else 'unclassified'
                for f in files:
                    if f.startswith('.'):
                        continue
                    full_path = os.path.join(root, f)
                    results.append((full_path, class_name, split))
    else:
        for root, _, files in os.walk(data_dir):
            rel_root = os.path.relpath(root, data_dir)
            class_name = rel_root.split(os.sep)[0] if rel_root != '.' else 'unclassified'
            for f in files:
                if f.startswith('.'):
                    continue
                full_path = os.path.join(root, f)
                results.append((full_path, class_name, 'all'))
                
    return results

def run_parallel(items: List[Any], func: Callable[[Any], Any], max_workers: int = 8, batch_size: int = 100) -> List[Any]:
    """
    Execute a function across items using ThreadPoolExecutor for Apple Silicon MPS & CPU optimization.
    Returns list of results in matching order.
    """
    if not items:
        return []
        
    results = []
    # Use ThreadPoolExecutor to prevent process serialization overhead on macOS
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        for i in range(0, len(items), batch_size):
            batch = items[i:i + batch_size]
            batch_results = list(executor.map(func, batch))
            results.extend(batch_results)
    return results
