import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, CheckCircle2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6 bg-[#FBF9F5] font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
      <div className="max-w-lg w-full bg-[#F5EFE6] rounded-3xl border border-[#EAE3D9] shadow-[0_12px_40px_rgba(27,29,28,0.04)] p-8 sm:p-10 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#1B1D1C] text-[#FBF9F5] mx-auto flex items-center justify-center font-serif text-2xl font-bold shadow-sm">
            D
          </div>
          <h2 className="text-3xl font-serif font-normal text-[#1B1D1C]">DHARA Farmer Registration</h2>
          <p className="text-xs sm:text-sm text-[#68625B]">Create your cultivator account to register land parcels and file verified claims</p>
        </div>

        {submitted ? (
          <div className="p-8 bg-[#EBF2EA] border border-[#5B7553]/30 rounded-3xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#5B7553] mx-auto" />
            <h4 className="text-xl font-serif font-normal text-[#1B1D1C]">Registration Successful!</h4>
            <p className="text-xs sm:text-sm text-[#5B7553] font-sans">Redirecting to login with pre-configured demo access...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans font-medium text-[#68625B] mb-1.5 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Chandra"
                  required
                  className="w-full text-xs font-sans px-4 py-3 rounded-2xl border border-[#CAB4AA] bg-[#FBF9F5] text-[#1B1D1C] focus:outline-none focus:border-[#8B5F4D]"
                />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-[#68625B] mb-1.5 uppercase tracking-wider">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="+91 98260 00000"
                  required
                  className="w-full text-xs font-sans px-4 py-3 rounded-2xl border border-[#CAB4AA] bg-[#FBF9F5] text-[#1B1D1C] focus:outline-none focus:border-[#8B5F4D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans font-medium text-[#68625B] mb-1.5 uppercase tracking-wider">State</label>
                <input
                  type="text"
                  defaultValue="Madhya Pradesh"
                  disabled
                  className="w-full text-xs font-sans px-4 py-3 rounded-2xl border border-[#EAE3D9] bg-[#EAE3D9]/60 text-[#68625B]"
                />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-[#68625B] mb-1.5 uppercase tracking-wider">District</label>
                <select className="w-full text-xs font-sans px-4 py-3 rounded-2xl border border-[#CAB4AA] bg-[#FBF9F5] text-[#1B1D1C] focus:outline-none focus:border-[#8B5F4D]">
                  <option>Bhopal</option>
                  <option>Sehore</option>
                  <option>Raisen</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans font-medium text-[#68625B] mb-1.5 uppercase tracking-wider">Aadhaar / Farmer ID</label>
              <input
                type="text"
                placeholder="XXXX-XXXX-XXXX"
                required
                className="w-full text-xs font-sans px-4 py-3 rounded-2xl border border-[#CAB4AA] bg-[#FBF9F5] text-[#1B1D1C] focus:outline-none focus:border-[#8B5F4D]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#8B5F4D] hover:bg-[#74503F] text-[#FBF9F5] text-xs font-sans font-medium uppercase tracking-wider shadow-sm transition active:scale-95"
              >
                Create Cultivator Profile
              </button>
            </div>
          </form>
        )}

        <div className="text-center pt-2">
          <Link to="/login" className="text-xs font-sans text-[#68625B] hover:text-[#1B1D1C] transition-colors">
            Already have an account? <span className="text-[#8B5F4D] font-medium">Sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
