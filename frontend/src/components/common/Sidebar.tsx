import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  MapPin, 
  FileCheck, 
  Clock, 
  UploadCloud, 
  FileText, 
  ShieldAlert, 
  Activity,
  Layers,
  History,
  Scan,
  Satellite,
  Sprout
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role } = useAuth();
  const isOfficer = role === 'insurance_officer' || role === 'admin';

  return (
    <aside className="w-64 bg-[#F5EFE6] border-r border-[#EAE3D9] min-h-[calc(100vh-5rem)] p-5 flex flex-col justify-between text-[#1B1D1C]">
      <div className="space-y-6">
        
        {/* Navigation Group */}
        <div>
          <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#8B5F4D] px-3 mb-3 font-semibold">
            {isOfficer ? 'DHARA INSURE • WORKSPACE' : 'DHARA FARMER • SELF-SERVICE'}
          </div>

          <div className="space-y-1">
            {isOfficer ? (
              <>
                <NavLink
                  to="/insure"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-sans transition-all ${
                      isActive ? 'bg-[#1B1D1C] text-[#FBF9F5] font-medium shadow-sm' : 'text-[#68625B] hover:bg-[#EAE3D9] hover:text-[#1B1D1C]'
                    }`
                  }
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Insure Cockpit
                </NavLink>

                <NavLink
                  to="/insure/claims"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-sans transition-all ${
                      isActive ? 'bg-[#1B1D1C] text-[#FBF9F5] font-medium shadow-sm' : 'text-[#68625B] hover:bg-[#EAE3D9] hover:text-[#1B1D1C]'
                    }`
                  }
                >
                  <FileCheck className="w-4 h-4" />
                  Claims Management
                </NavLink>

                <NavLink
                  to="/insure/verification"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-sans transition-all ${
                      isActive ? 'bg-[#1B1D1C] text-[#FBF9F5] font-medium shadow-sm' : 'text-[#68625B] hover:bg-[#EAE3D9] hover:text-[#1B1D1C]'
                    }`
                  }
                >
                  <Activity className="w-4 h-4" />
                  E1 & E2 Verification
                </NavLink>

                <NavLink
                  to="/insure/audit"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-sans transition-all ${
                      isActive ? 'bg-[#1B1D1C] text-[#FBF9F5] font-medium shadow-sm' : 'text-[#68625B] hover:bg-[#EAE3D9] hover:text-[#1B1D1C]'
                    }`
                  }
                >
                  <Clock className="w-4 h-4" />
                  E3 Process Audit
                </NavLink>

                <NavLink
                  to="/insurance/workspace/CLM001"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-sans transition-all ${
                      isActive ? 'bg-[#8B5F4D] text-[#FBF9F5] font-medium shadow-sm' : 'text-[#8B5F4D] hover:bg-[#EAE3D9]'
                    }`
                  }
                >
                  <ShieldAlert className="w-4 h-4" />
                  Claim Dossier CLM001
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/farmer"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-sans transition-all ${
                      isActive ? 'bg-[#1B1D1C] text-[#FBF9F5] font-medium shadow-sm' : 'text-[#68625B] hover:bg-[#EAE3D9] hover:text-[#1B1D1C]'
                    }`
                  }
                >
                  <Sprout className="w-4 h-4" />
                  Farmer Overview
                </NavLink>

                <NavLink
                  to="/farmer/disease"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-sans transition-all ${
                      isActive ? 'bg-[#1B1D1C] text-[#FBF9F5] font-medium shadow-sm' : 'text-[#68625B] hover:bg-[#EAE3D9] hover:text-[#1B1D1C]'
                    }`
                  }
                >
                  <Scan className="w-4 h-4" />
                  AI Disease Detection
                </NavLink>

                <NavLink
                  to="/farmer/farms"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-sans transition-all ${
                      isActive ? 'bg-[#1B1D1C] text-[#FBF9F5] font-medium shadow-sm' : 'text-[#68625B] hover:bg-[#EAE3D9] hover:text-[#1B1D1C]'
                    }`
                  }
                >
                  <MapPin className="w-4 h-4" />
                  My Farms & Boundaries
                </NavLink>

                <NavLink
                  to="/farmer/satellite"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-sans transition-all ${
                      isActive ? 'bg-[#1B1D1C] text-[#FBF9F5] font-medium shadow-sm' : 'text-[#68625B] hover:bg-[#EAE3D9] hover:text-[#1B1D1C]'
                    }`
                  }
                >
                  <Satellite className="w-4 h-4" />
                  Satellite Monitoring
                </NavLink>

                <NavLink
                  to="/farmer/reports"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-sans transition-all ${
                      isActive ? 'bg-[#1B1D1C] text-[#FBF9F5] font-medium shadow-sm' : 'text-[#68625B] hover:bg-[#EAE3D9] hover:text-[#1B1D1C]'
                    }`
                  }
                >
                  <FileText className="w-4 h-4" />
                  Health Reports
                </NavLink>
              </>
            )}
          </div>
        </div>

        {/* Quick System Badge */}
        <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#EAE3D9] text-[11px] font-sans text-[#68625B] space-y-1.5 shadow-sm">
          <div className="flex items-center gap-2 font-medium text-[#1B1D1C]">
            <span className="w-2 h-2 rounded-full bg-[#5B7553]"></span>
            <span>Sentinel-2 L2A Online</span>
          </div>
          <p>Revisit: 5 days • Resolution: 10m</p>
        </div>

      </div>
    </aside>
  );
};
