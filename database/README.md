# AgriVerify AI – Database Layer Setup

This directory contains the database migration scripts and seed data for AgriVerify AI.

## Database Engine
- **Engine:** PostgreSQL 15+
- **Extensions:** PostGIS (for spatial geometries and geospatial calculations)
- **Compatibility:** Native PostgreSQL or Supabase

---

## Running Migrations

### With Local Docker Compose (Automatic)
When running `docker-compose up`, the scripts in `migrations/` execute automatically in numerical sequence.

### Manual Setup on Existing PostgreSQL / Supabase
1. Enable PostGIS:
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```
2. Run Schema:
   ```bash
   psql -h localhost -U postgres -d agriverify -f migrations/001_initial_schema.sql
   ```
3. Run Seed Data:
   ```bash
   psql -h localhost -U postgres -d agriverify -f migrations/002_seed_demo_data.sql
   ```

---

## Pre-seeded Demo Data
The seed script creates:
- **Demo Users:**
  - `officer.sharma@agriverify.in` (Insurance Assessor)
  - `farmer.rajesh@agriverify.in` (Farmer from Bhopal)
- **Demo Claims:**
  - `CLM001`: Rajesh Kumar (Bhopal, Wheat, Status: `Pending`) - Ready for assessment in workspace
  - `CLM002`: Sunita Bai (Sehore, Soybean, Status: `Verified`) - Verified area and confirmed yield loss
  - `CLM003`: Mohan Lal (Raisen, Paddy, Status: `Flagged`) - High area mismatch (2.1 ha declared vs 1.2 ha mapped)
- **Time Series Data:**
  - Sentinel-2 NDVI 12-week curves
  - Meteorological weather observations for Madhya Pradesh
