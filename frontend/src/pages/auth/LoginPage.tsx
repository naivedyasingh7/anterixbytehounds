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
      navigate('/insurance/dashboard');
    } else {
      navigate('/farmer/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-md">
            <Sprout className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Sign in to AgriVerify AI</h2>
          <p className="text-xs text-slate-500">Select your portal or use a one-click demo profile</p>
        </div>

        {/* Demo Account Switcher Card */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quick Demo Sign-In</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDemoLogin('insurance_officer')}
              className="p-4 rounded-xl border-2 border-blue-600/30 bg-blue-50/50 hover:bg-blue-50 text-left transition flex flex-col justify-between group"
            >
              <div>
                <ShieldCheck className="w-5 h-5 text-blue-600 mb-2" />
                <h4 className="font-bold text-xs text-slate-900">Insurance Officer</h4>
                <p className="text-[11px] text-slate-500">R. K. Sharma (Assessor)</p>
              </div>
              <span className="text-[10px] text-blue-600 font-semibold mt-3 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Sign In <ArrowRight className="w-3 h-3" />
              </span>
            </button>

            <button
              onClick={() => handleDemoLogin('farmer')}
              className="p-4 rounded-xl border-2 border-emerald-600/30 bg-emerald-50/50 hover:bg-emerald-50 text-left transition flex flex-col justify-between group"
            >
              <div>
                <Sprout className="w-5 h-5 text-emerald-600 mb-2" />
                <h4 className="font-bold text-xs text-slate-900">Farmer Portal</h4>
                <p className="text-[11px] text-slate-500">Rajesh Kumar (Bhopal)</p>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-3 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Sign In <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-medium">Or email sign-in</span>
        </div>

        {/* Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleDemoLogin(selectedRole); }} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="insurance_officer">Insurance Officer</option>
              <option value="farmer">Farmer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              defaultValue={selectedRole === 'insurance_officer' ? 'officer.sharma@agriverify.in' : 'farmer.rajesh@agriverify.in'}
              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <a href="#" className="text-[11px] text-emerald-600 hover:underline">Forgot password?</a>
            </div>
            <input
              type="password"
              defaultValue="Password123"
              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md transition"
          >
            Authenticate & Proceed
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          New farmer?{' '}
          <Link to="/register" className="text-emerald-600 font-semibold hover:underline">
            Register your farm here
          </Link>
        </div>

      </div>
    </div>
  );
};
