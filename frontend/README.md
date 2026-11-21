# AgriVerify AI – Frontend Single Page Application

Modern React 18 + TypeScript + Tailwind CSS application featuring the **Farmer Portal** and the **Insurance Officer Portal**, including the interactive **Unified Claim Workspace** and the three verification engines.

---

## 🚀 Setup & Launch

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run in development mode:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

3. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📂 Directory Structure

```
src/
├── types/                 # TypeScript interfaces (Claims, Farms, Engines, Assessments)
├── context/               # AuthContext for role-based state & demo account switcher
├── services/              # API caller & rich mock dataset fallback
├── components/
│   ├── common/            # Navbar, Sidebar, StatusBadge
│   ├── maps/              # Leaflet GIS farm viewer & polygon canvas
│   └── charts/            # NDVI temporal chart & Weather rainfall curves
└── pages/
    ├── LandingPage.tsx    # Public landing page with engine showcases
    ├── auth/              # Login with 1-click Demo credentials
    ├── farmer/            # Farmer Dashboard, My Farms, Register Farm, Submit Claim, Track Claim
    └── insurance/         # Insurance Dashboard, Claims Management, Unified Claim Workspace, 3 Engines
```
