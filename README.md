# DharaAI

DharaAI is an agricultural loss assessment and crop insurance verification platform. It combines 10m Sentinel-2 satellite imagery, deep learning foliage classification, and computer vision quality checks to evaluate crop damage claims in real time.

---

## Overview

Traditional crop insurance claims rely heavily on manual field inspections, leading to long settlement delays, high administrative costs, and subjective assessment errors.

DharaAI addresses these issues by introducing an automated verification pipeline:
1. **Satellite Remote Sensing**: Uses multi-spectral Sentinel-2 satellite imagery to measure vegetation index (NDVI) drops and track moisture stress over time.
2. **Computer Vision Quality Control**: Filters out blurred photos, invalid framing, and non-crop uploads before processing.
3. **Deep Learning Disease Classification**: Fine-tuned ConvNeXt-Tiny model classifies crop health and disease severity across plant categories.
4. **Automated Risk Scoring & Ledger**: Fuses satellite, weather, and image inputs into a risk score and generates a verifiable audit record for payouts.

---

## Key Modules

### Sentinel-2 Satellite Imagery Explorer
- Displays 10-meter spatial resolution satellite scenes for registered land coordinates.
- Supports multi-spectral views including Near-Infrared (NIR false color), NDVI vegetation vigor maps, and flood submergence overlays.
- Calculates average field NDVI scores to identify significant foliage loss (NDVI < 0.30).

### OpenCV Image Quality Filter
- **Blur Detection**: Calculates Laplacian variance to reject blurry photos.
- **Foliage Coverage**: Uses HSV color segmentation to confirm plant canopy coverage.
- **Face & Subject Inspection**: Uses Haar Cascades to detect human faces and reject invalid non-crop uploads.
- **GPS & Watermark Validation**: Cross-checks photo timestamps and location coordinates against registered field plot boundaries.

### Deep Learning & Risk Engine
- **Model**: ConvNeXt-Tiny architecture fine-tuned on crop disease datasets.
- **Risk Assessment**: Combines model confidence, NDVI drop delta, and precipitation anomalies into a unified risk score (0-100).
- **Payout Computation**: Calculates suggested claim payout based on verified damage percentage.

### Digital Crop Identity (DCI) & Audit Records
- Maintains 4-week historical telemetry logs (NDVI, weather alerts, field notes) for enrolled farm plots.
- Exports inspection reports and verifiable certificates with SHA-256 hashes.

---

## System Architecture

```
                       +-------------------------+
                       |   React 19 Frontend     |
                       +------------+------------+
                                    | REST API
                       +------------v------------+
                       |     FastAPI Backend     |
                       +----+-------+-------+----+
                            |       |       |
            +---------------+       |       +---------------+
            |                       |                       |
+-----------v-----------+ +---------v---------+ +-----------v-----------+
|    OpenCV Filter      | | PyTorch ConvNeXt  | |  Sentinel-2 Explorer  |
|  - Blur & Focus       | |  - Disease        | |  - 10m NIR Imagery    |
|  - Canopy Coverage    | |    Classification | |  - Spectral NDVI      |
|  - Face Anti-Spoof    | |  - Risk Scoring   | |  - Flood Detection    |
+-----------------------+ +-------------------+ +-----------------------+
```

---

## Tech Stack

| Component | Technologies |
|---|---|
| **Frontend** | React 19, Vite 8, Framer Motion, GSAP, Lenis, Three.js |
| **Backend** | Python 3.10+, FastAPI, Uvicorn |
| **Machine Learning & CV** | PyTorch (ConvNeXt-Tiny), OpenCV, NumPy, Pillow |
| **Database** | SQLite (Local default), PostgreSQL / Neon DB |
| **APIs** | Sentinel Hub API, OpenWeatherMap API |

---

## Quick Start

### Prerequisites
- Node.js >= 18
- Python >= 3.10

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/dhananjay-2700/ByteHounds-Dhananjay-Singh.git
cd ByteHounds-Dhananjay-Singh

# Configure environment variables
cp .env.example .env
```

### 2. Frontend Setup

```bash
npm install
npm run dev
```
The frontend will start at `http://localhost:5173`.

### 3. Backend Setup

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install -r requirements.txt
uvicorn backend:app --reload --port 8000
```
The API server will start at `http://localhost:8000` (API documentation available at `/docs`).

---

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/stats` | GET | Returns pending claim count, total approved payouts, and audit logs |
| `/api/farms` | GET | Lists registered farm plots and historical telemetry records |
| `/api/detect` | POST | Runs OpenCV image quality checks and ConvNeXt disease classification |
| `/api/assess` | POST | Evaluates claim scenario damage and risk score |
| `/api/verify` | POST | Generates verification hash and GPS boundary check |
| `/api/weather` | GET | Fetches real-time weather data for coordinates |

---

## License

This project is licensed under the MIT License.
