import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DharaNav } from './components/common/DharaNav';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Public & Cinematic Experience
import { LandingPage } from './pages/LandingPage';
import { VisionPage } from './pages/VisionPage';
import { TechnologyPage } from './pages/TechnologyPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// DHARA Farmer Portal Experiences
import { FarmerPortalHome } from './pages/farmer/FarmerPortalHome';
import { DiseaseDetectionPage } from './pages/farmer/DiseaseDetectionPage';
import { SatelliteMonitoringPage } from './pages/farmer/SatelliteMonitoringPage';
import { HealthReportsPage } from './pages/farmer/HealthReportsPage';
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { MyFarms } from './pages/farmer/MyFarms';
import { RegisterFarm } from './pages/farmer/RegisterFarm';
import { SubmitClaim } from './pages/farmer/SubmitClaim';
import { TrackClaim } from './pages/farmer/TrackClaim';

// DHARA Insure Portal Experiences
import { InsurePortalHome } from './pages/insurance/InsurePortalHome';
import { UnifiedVerificationPage } from './pages/insurance/UnifiedVerificationPage';
import { UnifiedAuditPage } from './pages/insurance/UnifiedAuditPage';
import { InsuranceDashboard } from './pages/insurance/InsuranceDashboard';
import { FarmersAndFarms } from './pages/insurance/FarmersAndFarms';
import { ClaimsManagement } from './pages/insurance/ClaimsManagement';
import { UnifiedClaimWorkspace } from './pages/insurance/UnifiedClaimWorkspace';
import { AssessmentReports } from './pages/insurance/AssessmentReports';

// Verification Engines Standalone Views
import { FarmVerificationView } from './pages/insurance/engines/FarmVerificationView';
import { YieldVerificationView } from './pages/insurance/engines/YieldVerificationView';
import { ProcessAuditView } from './pages/insurance/engines/ProcessAuditView';

// Universal Scroll to Top & Hash Handler
const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const scrollTarget = () => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      };
      // Try immediately and shortly after in case of dynamic render
      scrollTarget();
      const t = setTimeout(scrollTarget, 150);
      return () => clearTimeout(t);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
};

const PortalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1B1D1C] font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
      <DharaNav />
      <main className="max-w-7xl mx-auto px-6 sm:px-8 pt-44 sm:pt-48 pb-20">
        {children}
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* 1. Cinematic Landing & Editorial Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/vision" element={<VisionPage />} />
            <Route path="/technology" element={<TechnologyPage />} />
            <Route path="/login" element={<div className="pt-28"><DharaNav /><LoginPage /></div>} />
            <Route path="/register" element={<div className="pt-28"><DharaNav /><RegisterPage /></div>} />

            {/* 2. DHARA Farmer Portal Routes (All 7 Sub-links & Actions Supported) */}
            <Route path="/farmer" element={<FarmerPortalHome />} />
            <Route path="/farmer/dashboard" element={<PortalLayout><FarmerDashboard /></PortalLayout>} />
            <Route path="/farmer/disease" element={<DiseaseDetectionPage />} />
            <Route path="/farmer/farms" element={<PortalLayout><MyFarms /></PortalLayout>} />
            <Route path="/farmer/satellite" element={<SatelliteMonitoringPage />} />
            <Route path="/farmer/reports" element={<HealthReportsPage />} />
            <Route path="/farmer/submit-claim" element={<PortalLayout><SubmitClaim /></PortalLayout>} />
            <Route path="/farmer/claim/submit" element={<PortalLayout><SubmitClaim /></PortalLayout>} />
            <Route path="/farmer/track-claim" element={<PortalLayout><TrackClaim /></PortalLayout>} />
            <Route path="/farmer/claim/track" element={<PortalLayout><TrackClaim /></PortalLayout>} />
            <Route path="/farmer/register-farm" element={<PortalLayout><RegisterFarm /></PortalLayout>} />

            {/* 3. DHARA Insure Portal Routes (All 7 Sub-links & Actions Supported with both /insure and /insurance) */}
            <Route path="/insure" element={<InsurePortalHome />} />
            <Route path="/insurance" element={<InsurePortalHome />} />
            <Route path="/insure/dashboard" element={<InsurePortalHome />} />
            <Route path="/insurance/dashboard" element={<PortalLayout><InsuranceDashboard /></PortalLayout>} />

            {/* Claims */}
            <Route path="/insure/claims" element={<PortalLayout><ClaimsManagement /></PortalLayout>} />
            <Route path="/insurance/claims" element={<PortalLayout><ClaimsManagement /></PortalLayout>} />

            {/* Dual-Engine Verification */}
            <Route path="/insure/verification" element={<UnifiedVerificationPage />} />
            <Route path="/insurance/verification" element={<UnifiedVerificationPage />} />

            {/* Process & SLA Audit */}
            <Route path="/insure/audit" element={<UnifiedAuditPage />} />
            <Route path="/insurance/audit" element={<UnifiedAuditPage />} />

            {/* Claim Workspace */}
            <Route path="/insure/workspace" element={<Navigate to="/insure/workspace/CLM001" replace />} />
            <Route path="/insurance/workspace" element={<Navigate to="/insure/workspace/CLM001" replace />} />
            <Route path="/insure/workspace/:claimId" element={<PortalLayout><UnifiedClaimWorkspace /></PortalLayout>} />
            <Route path="/insurance/workspace/:claimId" element={<PortalLayout><UnifiedClaimWorkspace /></PortalLayout>} />

            {/* Farmers Directory */}
            <Route path="/insure/farmers" element={<PortalLayout><FarmersAndFarms /></PortalLayout>} />
            <Route path="/insurance/farmers" element={<PortalLayout><FarmersAndFarms /></PortalLayout>} />
            <Route path="/insure/farmers-and-farms" element={<PortalLayout><FarmersAndFarms /></PortalLayout>} />
            <Route path="/insurance/farmers-and-farms" element={<PortalLayout><FarmersAndFarms /></PortalLayout>} />

            {/* Assessment Reports */}
            <Route path="/insure/reports" element={<PortalLayout><AssessmentReports /></PortalLayout>} />
            <Route path="/insurance/reports" element={<PortalLayout><AssessmentReports /></PortalLayout>} />

            {/* Verification Engines Standalone Routes */}
            <Route path="/insurance/engines/farm" element={<PortalLayout><FarmVerificationView /></PortalLayout>} />
            <Route path="/insurance/engines/yield" element={<PortalLayout><YieldVerificationView /></PortalLayout>} />
            <Route path="/insurance/engines/audit" element={<PortalLayout><ProcessAuditView /></PortalLayout>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
