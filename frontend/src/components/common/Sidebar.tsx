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
  History
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role } = useAuth();
  const isOfficer = role === 'insurance_officer' || role === 'admin';

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        
        {/* Navigation Group */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            {isOfficer ? 'Insurance Underwriting' : 'Farmer Self-Service'}
          </div>

          <div className="space-y-1">
            {isOfficer ? (
              <>
                <NavLink
                  to="/insurance/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                    }`
                  }
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Overview Dashboard
                </NavLink>

                <NavLink
                  to="/insurance/claims"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                    }`
                  }
                >
                  <FileCheck className="w-4 h-4" />
                  Claims Management
                </NavLink>

                <NavLink
                  to="/insurance/farmers-and-farms"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                    }`
                  }
                >
                  <MapPin className="w-4 h-4" />
                  Farmers & Farms
                </NavLink>

                <NavLink
                  to="/insurance/workspace/CLM001"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                    }`
                  }
                >
                  <ShieldAlert className="w-4 h-4 text-emerald-600" />
                  Unified Workspace
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/farmer/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                    }`
                  }
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Farmer Dashboard
                </NavLink>

                <NavLink
                  to="/farmer/farms"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                    }`
                  }
                >
                  <MapPin className="w-4 h-4" />
                  My Farms
                </NavLink>

                <NavLink
                  to="/farmer/register-farm"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                    }`
                  }
                >
                  <Layers className="w-4 h-4" />
                  Register New Farm
                </NavLink>

                <NavLink
                  to="/farmer/submit-claim"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                    }`
                  }
                >
                  <FileCheck className="w-4 h-4" />
                  Submit Claim
                </NavLink>

                <NavLink
                  to="/farmer/track-claim"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                    }`
                  }
                >
                  <Clock className="w-4 h-4" />
                  Track Claim
                </NavLink>
              </>
            )}
          </div>
        </div>

        {/* Verification Engines Section (Available to Officers) */}
        {isOfficer && (
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Verification Engines
            </div>
            <div className="space-y-1">
              <NavLink
                to="/insurance/engines/farm"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <Layers className="w-4 h-4 text-blue-500" />
                1. Farm Verification
              </NavLink>

              <NavLink
                to="/insurance/engines/yield"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <Activity className="w-4 h-4 text-emerald-500" />
                2. Yield Verification
              </NavLink>

              <NavLink
                to="/insurance/engines/audit"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <History className="w-4 h-4 text-amber-500" />
                3. Process Audit
              </NavLink>

              <NavLink
                to="/insurance/reports"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <FileText className="w-4 h-4 text-purple-500" />
                Assessment Reports
              </NavLink>
            </div>
          </div>
        )}

      </div>

      {/* System Status Footnote */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
        <div className="flex items-center justify-between text-slate-500">
          <span>Sentinel-2 L2A</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="text-[11px] text-slate-400">PostGIS Geometry: Connected</div>
      </div>
    </aside>
  );
};
