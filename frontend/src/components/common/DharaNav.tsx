import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Sprout, 
  ShieldCheck, 
  Scan, 
  Layers, 
  Satellite, 
  FileText, 
  FileCheck, 
  Activity, 
  Clock, 
  ShieldAlert, 
  MapPin, 
  Download,
  AlertCircle,
  ChevronDown
} from 'lucide-react';

export const DharaNav: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active portal mode from current URL
  const isFarmerRoute = location.pathname.startsWith('/farmer');
  const isInsureRoute = location.pathname.startsWith('/insure') || location.pathname.startsWith('/insurance');

  // Manual toggle state if user clicks from landing page
  const [openPortal, setOpenPortal] = useState<'farmer' | 'insure' | null>(null);

  useEffect(() => {
    if (isFarmerRoute) {
      setOpenPortal('farmer');
    } else if (isInsureRoute) {
      setOpenPortal('insure');
    } else {
      setOpenPortal(null);
    }
  }, [location.pathname, isFarmerRoute, isInsureRoute]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sub-navigation options for DHARA Farmer (Exactly 7 clean options)
  const farmerSubLinks = [
    { name: 'Dashboard', path: '/farmer', icon: Sprout },
    { name: 'Disease AI', path: '/farmer/disease', icon: Scan },
    { name: 'My Farms', path: '/farmer/farms', icon: Layers },
    { name: 'Satellite NDVI', path: '/farmer/satellite', icon: Satellite },
    { name: 'Health Reports', path: '/farmer/reports', icon: FileText },
    { name: 'File Claim', path: '/farmer/submit-claim', icon: AlertCircle },
    { name: 'Track Claim', path: '/farmer/track-claim', icon: Clock },
  ];

  // Sub-navigation options for DHARA Insure (Exactly 7 clean options)
  const insureSubLinks = [
    { name: 'Cockpit', path: '/insure', icon: ShieldCheck },
    { name: 'Claims', path: '/insure/claims', icon: FileCheck },
    { name: 'Verification', path: '/insure/verification', icon: Activity },
    { name: 'Process Audit', path: '/insure/audit', icon: Clock },
    { name: 'Workspace CLM001', path: '/insure/workspace/CLM001', icon: ShieldAlert },
    { name: 'Farmers Directory', path: '/insure/farmers', icon: MapPin },
    { name: 'Reports', path: '/insure/reports', icon: Download },
  ];

  const isItemActive = (path: string) => {
    if (path === '/farmer') {
      return location.pathname === '/farmer' || location.pathname === '/farmer/dashboard';
    }
    if (path === '/insure') {
      return (
        location.pathname === '/insure' ||
        location.pathname === '/insurance' ||
        location.pathname === '/insurance/dashboard' ||
        location.pathname === '/insure/dashboard'
      );
    }
    if (path === '/insure/workspace/CLM001') {
      return location.pathname.startsWith('/insure/workspace') || location.pathname.startsWith('/insurance/workspace');
    }
    if (path === '/insure/farmers') {
      return (
        location.pathname === '/insure/farmers' ||
        location.pathname === '/insure/farmers-and-farms' ||
        location.pathname === '/insurance/farmers' ||
        location.pathname === '/insurance/farmers-and-farms'
      );
    }
    if (path === '/insure/claims') {
      return location.pathname === '/insure/claims' || location.pathname === '/insurance/claims';
    }
    if (path === '/insure/verification') {
      return location.pathname === '/insure/verification' || location.pathname === '/insurance/verification';
    }
    if (path === '/insure/audit') {
      return location.pathname === '/insure/audit' || location.pathname === '/insurance/audit';
    }
    if (path === '/insure/reports') {
      return location.pathname === '/insure/reports' || location.pathname === '/insurance/reports';
    }
    if (path === '/farmer/submit-claim') {
      return location.pathname === '/farmer/submit-claim' || location.pathname === '/farmer/claim/submit';
    }
    if (path === '/farmer/track-claim') {
      return location.pathname === '/farmer/track-claim' || location.pathname === '/farmer/claim/track';
    }
    return location.pathname === path;
  };

  // Click Handlers ensuring navigation works no matter where you are on the site
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpenPortal(null);
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const handleHowWeHelpClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById('how-we-help-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#how-we-help-section');
    }
  };

  const handleVisionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    navigate('/vision');
  };

  const handleTechnologyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    navigate('/technology');
  };

  const handleFarmerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setOpenPortal('farmer');
    if (location.pathname === '/farmer') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/farmer');
    }
  };

  const handleInsureClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setOpenPortal('insure');
    if (location.pathname === '/insure') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/insure');
    }
  };

  const handleSubLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="fixed top-5 left-0 right-0 z-50 flex flex-col items-center px-4 sm:px-6 pointer-events-none transition-all">
      
      {/* 1. PRIMARY FLOATING PILL NAVBAR - EXACTLY SAME THROUGHOUT ALL PAGES */}
      <div 
        className="pointer-events-auto transition-all duration-300 max-w-5xl w-full flex items-center justify-between px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#FBF9F5]/95 backdrop-blur-xl border border-[#EAE3D9] shadow-[0_12px_40px_rgba(27,29,28,0.08)]"
      >
        
        {/* Brand Logo in Serein Serif Style */}
        <a 
          href="/" 
          onClick={handleLogoClick}
          className="flex items-center gap-2 group shrink-0 cursor-pointer"
        >
          <span className="text-2xl sm:text-3xl font-serif font-semibold tracking-wider text-[#1B1D1C] group-hover:text-[#8B5F4D] transition-colors">
            DHARA
          </span>
        </a>

        {/* Secondary Links - Comparatively Smaller */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <a
            href="/#how-we-help-section"
            onClick={handleHowWeHelpClick}
            className="text-xs sm:text-[13px] font-sans font-medium text-[#68625B] hover:text-[#1B1D1C] transition-colors cursor-pointer"
          >
            How We Help
          </a>

          <a
            href="/vision"
            onClick={handleVisionClick}
            className={`text-xs sm:text-[13px] font-sans font-medium transition-colors cursor-pointer ${
              location.pathname === '/vision' ? 'text-[#1B1D1C] font-semibold' : 'text-[#68625B] hover:text-[#1B1D1C]'
            }`}
          >
            Our Vision
          </a>

          <a
            href="/technology"
            onClick={handleTechnologyClick}
            className={`text-xs sm:text-[13px] font-sans font-medium transition-colors cursor-pointer ${
              location.pathname === '/technology' ? 'text-[#1B1D1C] font-semibold' : 'text-[#68625B] hover:text-[#1B1D1C]'
            }`}
          >
            Technology
          </a>
        </nav>

        {/* TWO PROMINENT MAIN BUTTONS: Farmer & Insure */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          
          {/* Main Option 1: Farmer */}
          <button
            onClick={handleFarmerClick}
            className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-sans font-medium transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer ${
              openPortal === 'farmer'
                ? 'bg-[#1B1D1C] text-[#FBF9F5] ring-2 ring-[#5B7553]/40'
                : 'bg-[#F5EFE6] text-[#1B1D1C] border border-[#CAB4AA] hover:bg-[#EAE3D9]'
            }`}
          >
            <Sprout className={`w-3.5 h-3.5 ${openPortal === 'farmer' ? 'text-[#C5E86C]' : 'text-[#5B7553]'}`} />
            <span>DHARA Farmer</span>
            {openPortal === 'farmer' && <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />}
          </button>

          {/* Main Option 2: Insure */}
          <button
            onClick={handleInsureClick}
            className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-sans font-medium transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer ${
              openPortal === 'insure'
                ? 'bg-[#74503F] text-[#FBF9F5] ring-2 ring-[#CAB4AA]'
                : 'bg-[#8B5F4D] text-[#FBF9F5] hover:bg-[#74503F]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-white/90" />
            <span>DHARA Insure</span>
            {openPortal === 'insure' && <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />}
          </button>

        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-full text-[#1B1D1C] hover:bg-[#F5EFE6] transition-colors cursor-pointer"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* 2. SECONDARY POP-DOWN SUB-PILL (APPEARS JUST DOWN RATHER THAN CHANGING HEADER) */}
      {openPortal === 'farmer' && (
        <div className="pointer-events-auto mt-2.5 transition-all duration-300 ease-out transform animate-fadeIn max-w-5xl w-full flex items-center justify-center">
          <nav className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#F5EFE6]/95 backdrop-blur-xl border border-[#CAB4AA] shadow-[0_8px_30px_rgba(27,29,28,0.08)] overflow-x-auto max-w-full">
            {farmerSubLinks.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.path);
              return (
                <button
                  key={item.name}
                  onClick={(e) => handleSubLinkClick(item.path, e)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-[13px] font-sans font-medium transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#1B1D1C] text-[#FBF9F5] shadow-sm'
                      : 'text-[#1B1D1C]/80 hover:text-[#1B1D1C] hover:bg-[#EAE3D9]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {openPortal === 'insure' && (
        <div className="pointer-events-auto mt-2.5 transition-all duration-300 ease-out transform animate-fadeIn max-w-5xl w-full flex items-center justify-center">
          <nav className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#F5EFE6]/95 backdrop-blur-xl border border-[#CAB4AA] shadow-[0_8px_30px_rgba(27,29,28,0.08)] overflow-x-auto max-w-full">
            {insureSubLinks.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.path);
              return (
                <button
                  key={item.name}
                  onClick={(e) => handleSubLinkClick(item.path, e)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-[13px] font-sans font-medium transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#8B5F4D] text-[#FBF9F5] shadow-sm'
                      : 'text-[#1B1D1C]/80 hover:text-[#1B1D1C] hover:bg-[#EAE3D9]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* 3. MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto absolute top-20 inset-x-4 bg-[#FBF9F5] border border-[#EAE3D9] rounded-3xl p-6 shadow-2xl space-y-5 animate-fadeIn max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D9]">
            <span className="text-2xl font-serif font-semibold text-[#1B1D1C]">DHARA</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 rounded-full text-[#68625B]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={handleHowWeHelpClick}
              className="block w-full text-left text-sm font-sans font-medium text-[#68625B] hover:text-[#1B1D1C] py-2"
            >
              How We Help
            </button>
            <button
              onClick={handleVisionClick}
              className="block w-full text-left text-sm font-sans font-medium text-[#68625B] hover:text-[#1B1D1C] py-2"
            >
              Our Vision
            </button>
            <button
              onClick={handleTechnologyClick}
              className="block w-full text-left text-sm font-sans font-medium text-[#68625B] hover:text-[#1B1D1C] py-2"
            >
              Technology
            </button>
          </div>

          {/* Mobile Farmer Portal Options */}
          <div className="pt-3 border-t border-[#EAE3D9] space-y-2">
            <button
              onClick={handleFarmerClick}
              className="w-full text-center py-2.5 rounded-full bg-[#F5EFE6] text-[#1B1D1C] border border-[#CAB4AA] text-sm font-medium flex items-center justify-center gap-2"
            >
              <Sprout className="w-4 h-4 text-[#5B7553]" />
              <span>DHARA Farmer</span>
            </button>
            <div className="grid grid-cols-2 gap-1.5 pl-2">
              {farmerSubLinks.map((sub) => (
                <button
                  key={sub.name}
                  onClick={(e) => handleSubLinkClick(sub.path, e)}
                  className="text-left text-xs font-sans text-[#68625B] hover:text-[#1B1D1C] py-1.5 px-2 rounded-lg hover:bg-[#F5EFE6] truncate"
                >
                  • {sub.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Insure Portal Options */}
          <div className="pt-3 border-t border-[#EAE3D9] space-y-2">
            <button
              onClick={handleInsureClick}
              className="w-full text-center py-2.5 rounded-full bg-[#8B5F4D] text-[#FBF9F5] text-sm font-medium shadow-sm flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>DHARA Insure</span>
            </button>
            <div className="grid grid-cols-2 gap-1.5 pl-2">
              {insureSubLinks.map((sub) => (
                <button
                  key={sub.name}
                  onClick={(e) => handleSubLinkClick(sub.path, e)}
                  className="text-left text-xs font-sans text-[#68625B] hover:text-[#1B1D1C] py-1.5 px-2 rounded-lg hover:bg-[#F5EFE6] truncate"
                >
                  • {sub.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
