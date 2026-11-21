import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sprout, ShieldCheck, UserCheck, LogOut, ArrowRightLeft } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, loginAs, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#EAE3D9] sticky top-0 z-50 text-[#1B1D1C]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo in Serein Serif Style */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#1B1D1C] flex items-center justify-center text-[#FBF9F5] font-serif text-lg font-semibold shadow-sm group-hover:bg-[#8B5F4D] transition-colors">
            D
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-serif font-bold tracking-tight text-[#1B1D1C] group-hover:text-[#8B5F4D] transition-colors">
                DHARA
              </span>
              <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-[#F5EFE6] text-[#68625B] border border-[#CAB4AA] uppercase tracking-wider">
                PLATFORM
              </span>
            </div>
            <span className="block text-[9px] font-sans font-medium tracking-[0.2em] text-[#68625B] uppercase -mt-0.5">
              Earth & Agricultural Intelligence
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-sans uppercase tracking-wider text-[#68625B]">
          <Link to="/" className="hover:text-[#1B1D1C] transition-colors">Overview</Link>
          <Link to="/farmer" className="hover:text-[#1B1D1C] transition-colors flex items-center gap-1.5">
            <Sprout className="w-3.5 h-3.5 text-[#5B7553]" />
            <span>DHARA Farmer</span>
          </Link>
          <Link to="/insure" className="hover:text-[#1B1D1C] transition-colors flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8B5F4D]" />
            <span>DHARA Insure</span>
          </Link>
          <Link to="/insurance/workspace/CLM001" className="text-[#8B5F4D] font-semibold flex items-center gap-1 hover:underline">
            <span>Workspace</span>
          </Link>
        </nav>

        {/* User Identity & Demo Switcher */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2 bg-[#F5EFE6] border border-[#CAB4AA] py-1.5 px-3.5 rounded-full text-xs font-sans">
              <span className={`w-2 h-2 rounded-full ${role === 'insurance_officer' ? 'bg-[#8B5F4D]' : 'bg-[#5B7553]'}`} />
              <span className="font-semibold text-[#1B1D1C]">{user.full_name}</span>
              <span className="text-[#CAB4AA]">|</span>
              <span className="text-[#68625B] capitalize">{role.replace('_', ' ')}</span>

              {/* Demo role switcher */}
              <button 
                onClick={() => {
                  const nextRole = role === 'insurance_officer' ? 'farmer' : 'insurance_officer';
                  loginAs(nextRole);
                  navigate(nextRole === 'insurance_officer' ? '/insure' : '/farmer');
                }}
                title="Switch demo role"
                className="ml-1 p-1 hover:bg-[#EAE3D9] rounded-full text-[#68625B] hover:text-[#1B1D1C] transition-colors flex items-center gap-1"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-xs font-sans font-medium px-5 py-2 rounded-full bg-[#8B5F4D] text-[#FBF9F5] hover:bg-[#74503F] transition-all shadow-sm">
                Sign In
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
export default Navbar;
