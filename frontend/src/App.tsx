import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

// Public & Auth
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Farmer Portal
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { MyFarms } from './pages/farmer/MyFarms';
import { RegisterFarm } from './pages/farmer/RegisterFarm';
import { SubmitClaim } from './pages/farmer/SubmitClaim';
import { TrackClaim } from './pages/farmer/TrackClaim';

// Insurance Portal
import { InsuranceDashboard } from './pages/insurance/InsuranceDashboard';
import { FarmersAndFarms } from './pages/insurance/FarmersAndFarms';
import { ClaimsManagement } from './pages/insurance/ClaimsManagement';
import { UnifiedClaimWorkspace } from './pages/insurance/UnifiedClaimWorkspace';
import { AssessmentReports } from './pages/insurance/AssessmentReports';

// Verification Engines
import { FarmVerificationView } from './pages/insurance/engines/FarmVerificationView';
import { YieldVerificationView } from './pages/insurance/engines/YieldVerificationView';
import { ProcessAuditView } from './pages/insurance/engines/ProcessAuditView';

const PortalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Auth */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<><Navbar /><LoginPage /></>} />
          <Route path="/register" element={<><Navbar /><RegisterPage /></>} />

          {/* Farmer Portal Routes */}
          <Route path="/farmer/dashboard" element={<PortalLayout><FarmerDashboard /></PortalLayout>} />
          <Route path="/farmer/farms" element={<PortalLayout><MyFarms /></PortalLayout>} />
          <Route path="/farmer/register-farm" element={<PortalLayout><RegisterFarm /></PortalLayout>} />
          <Route path="/farmer/submit-claim" element={<PortalLayout><SubmitClaim /></PortalLayout>} />
          <Route path="/farmer/track-claim" element={<PortalLayout><TrackClaim /></PortalLayout>} />

          {/* Insurance Portal Routes */}
          <Route path="/insurance/dashboard" element={<PortalLayout><InsuranceDashboard /></PortalLayout>} />
          <Route path="/insurance/claims" element={<PortalLayout><ClaimsManagement /></PortalLayout>} />
          <Route path="/insurance/farmers-and-farms" element={<PortalLayout><FarmersAndFarms /></PortalLayout>} />
          <Route path="/insurance/workspace/:claimId" element={<PortalLayout><UnifiedClaimWorkspace /></PortalLayout>} />
          <Route path="/insurance/reports" element={<PortalLayout><AssessmentReports /></PortalLayout>} />

          {/* Verification Engines Standalone Views */}
          <Route path="/insurance/engines/farm" element={<PortalLayout><FarmVerificationView /></PortalLayout>} />
          <Route path="/insurance/engines/yield" element={<PortalLayout><YieldVerificationView /></PortalLayout>} />
          <Route path="/insurance/engines/audit" element={<PortalLayout><ProcessAuditView /></PortalLayout>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
