import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sprout, ShieldCheck, Lock, User, ArrowRight } from 'lucide-react';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { loginAs } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('insurance_officer');

  const handleDemoLogin = (role: UserRole) => {
    loginAs(role);
    if (role === 'insurance_officer') {
      navigate('/insure');
    } else {
      navigate('/farmer');
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6 bg-[#FBF9F5] font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
      <div className="max-w-md w-full bg-[#F5EFE6] rounded-3xl border border-[#EAE3D9] shadow-[0_12px_40px_rgba(27,29,28,0.04)] p-8 sm:p-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#1B1D1C] text-[#FBF9F5] mx-auto flex items-center justify-center font-serif text-2xl font-bold shadow-sm">
            D
          </div>
          <h2 className="text-3xl font-serif font-normal text-[#1B1D1C]">Sign in to DHARA</h2>
          <p className="text-xs sm:text-sm text-[#68625B]">Select your operating portal or access a demo persona</p>
        </div>

        {/* Demo Account Switcher Card */}
        <div className="space-y-3">
          <label className="text-[10px] font-sans font-medium text-[#8B5F4D] uppercase tracking-wider block">One-Click Demo Personas</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDemoLogin('insurance_officer')}
              className="p-4 rounded-2xl border border-[#CAB4AA] bg-[#FBF9F5] hover:bg-[#EAE3D9] text-left transition flex flex-col justify-between group active:scale-95"
            >
              <div>
                <ShieldCheck className="w-5 h-5 text-[#8B5F4D] mb-2" />
                <h4 className="font-serif font-semibold text-sm text-[#1B1D1C]">DHARA Insure</h4>
                <p className="text-[11px] text-[#68625B] font-sans">Officer Sharma (Assessor)</p>
              </div>
              <span className="text-xs text-[#8B5F4D] font-medium mt-3 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Sign In <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            <button
              onClick={() => handleDemoLogin('farmer')}
              className="p-4 rounded-2xl border border-[#CAB4AA] bg-[#FBF9F5] hover:bg-[#EAE3D9] text-left transition flex flex-col justify-between group active:scale-95"
            >
              <div>
                <Sprout className="w-5 h-5 text-[#5B7553] mb-2" />
                <h4 className="font-serif font-semibold text-sm text-[#1B1D1C]">DHARA Farmer</h4>
                <p className="text-[11px] text-[#68625B] font-sans">Rajesh Patel (Cultivator)</p>
              </div>
              <span className="text-xs text-[#5B7553] font-medium mt-3 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Sign In <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <span className="border-t border-[#EAE3D9] w-full" />
          <span className="bg-[#F5EFE6] px-3 text-[10px] font-sans uppercase tracking-widest text-[#68625B] absolute">Or with email</span>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleDemoLogin(selectedRole); }} className="space-y-4">
          <div>
            <label className="block text-xs font-sans font-medium text-[#68625B] mb-1.5 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#68625B] absolute left-3.5 top-3.5" />
              <input
                type="email"
                defaultValue="rajesh.patel@dhara.ai"
                required
                className="w-full text-xs font-sans pl-10 pr-4 py-3 rounded-2xl border border-[#CAB4AA] bg-[#FBF9F5] text-[#1B1D1C] focus:outline-none focus:border-[#8B5F4D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-[#68625B] mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#68625B] absolute left-3.5 top-3.5" />
              <input
                type="password"
                defaultValue="password123"
                required
                className="w-full text-xs font-sans pl-10 pr-4 py-3 rounded-2xl border border-[#CAB4AA] bg-[#FBF9F5] text-[#1B1D1C] focus:outline-none focus:border-[#8B5F4D]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#8B5F4D] hover:bg-[#74503F] text-[#FBF9F5] text-xs font-sans font-medium uppercase tracking-wider shadow-sm transition active:scale-95"
          >
            Authenticate Credentials
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/register" className="text-xs font-sans text-[#68625B] hover:text-[#1B1D1C] transition-colors">
            New cultivator? <span className="text-[#8B5F4D] font-medium">Create a DHARA Farmer Account</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
