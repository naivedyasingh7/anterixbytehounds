import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sprout, ShieldCheck, UserCheck, LogOut, ArrowRightLeft } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, loginAs, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-700 via-green-700 to-teal-800 bg-clip-text text-transparent">
              AgriVerify AI
            </span>
            <span className="block text-[10px] font-medium tracking-wider text-slate-400 uppercase -mt-1">
              Agricultural Insurance Verification
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-emerald-600 transition-colors">Overview</Link>
          <Link to="/farmer/dashboard" className="hover:text-emerald-600 transition-colors">Farmer Portal</Link>
          <Link to="/insurance/dashboard" className="hover:text-emerald-600 transition-colors">Insurance Portal</Link>
          <Link to="/insurance/workspace/CLM001" className="text-emerald-600 font-semibold flex items-center gap-1 hover:underline">
            <ShieldCheck className="w-4 h-4" /> Unified Workspace
          </Link>
        </nav>

        {/* User Identity & Demo Switcher */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-full text-xs">
              <span className={`w-2 h-2 rounded-full ${role === 'insurance_officer' ? 'bg-blue-600' : 'bg-emerald-600'}`} />
              <span className="font-semibold text-slate-800">{user.full_name}</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500 capitalize">{role.replace('_', ' ')}</span>

              {/* One-click demo role switcher */}
              <button 
                onClick={() => {
                  const nextRole = role === 'insurance_officer' ? 'farmer' : 'insurance_officer';
                  loginAs(nextRole);
                  navigate(nextRole === 'insurance_officer' ? '/insurance/dashboard' : '/farmer/dashboard');
                }}
                title="Switch demo role"
                className="ml-1 p-1 hover:bg-slate-200 rounded-full text-slate-600 transition-colors flex items-center gap-1"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-xs font-semibold px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition">
                Sign In
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
