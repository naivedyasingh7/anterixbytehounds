import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CollectionsCTA from './components/CollectionsCTA';
import CompanyHighlight from './components/CompanyHighlight';
import LeadershipHighlight from './components/LeadershipHighlight';
import WorkflowOverview from './components/WorkflowOverview';
import Footer from './components/Footer';

// Views
import DciRegistry from './components/DciRegistry';
import ClaimSimulator from './components/ClaimSimulator';
import AuditDashboard from './components/AuditDashboard';
import SettingsView from './components/SettingsView';
import TechStackView from './components/TechStackView';
import SentinelExplorer from './components/SentinelExplorer';
import CropDetailModal from './components/CropDetailModal';
import ScrollIntro from './components/ScrollIntro';
import DharaBrandShowcase from './components/DharaBrandShowcase';
import IndianLanguagesWelcome from './components/IndianLanguagesWelcome';

export default function App() {
  // ── 5-Second Apple Mac Style Indian Languages Welcome Screen ────────────
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);

  // ── Intro state ────────────────────────────────────────────────────────
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = () => {
    setCurtainState('covering');
    setTimeout(() => {
      setIntroComplete(true);
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      }
      window.scrollTo(0, 0);
      setCurtainState('uncovering');
      setTimeout(() => {
        if (window.lenis) {
          window.lenis.scrollTo(0, { immediate: true });
        }
        window.scrollTo(0, 0);
        setCurtainState('idle');
      }, 500);
    }, 400);
  };

  // ── Main app state ─────────────────────────────────────────────────────
  const [activeView, setActiveView] = useState('home');
  const [selectedCropModal, setSelectedCropModal] = useState(null);

  // Site-Wide Dark Theme State
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('dharaai_theme') === 'dark';
  });

  // Sync Dark Theme to Document Body
  useEffect(() => {
    localStorage.setItem('dharaai_theme', darkMode ? 'dark' : 'light');
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const [curtainState, setCurtainState] = useState('idle');

  // Global claims state
  const [claimsCount, setClaimsCount] = useState(3);

  // Fetch initial stats from backend
  useEffect(() => {
    fetch('http://localhost:8000/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.claimsPending === 'number') {
          setClaimsCount(data.claimsPending);
        }
      })
      .catch(err => console.log('Backend offline, using local simulation state:', err));
  }, []);

  // Initialize Lenis Smooth Scroll (Global heavy luxury scroll across intro & main site)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 3.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -12 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.38,
      touchMultiplier: 0.9,
      infinite: false,
      lerp: 0.06,
    });

    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      delete window.lenis;
      lenis.destroy();
    };
  }, []);

  // Scroll Reveal Animations
  useEffect(() => {
    if (!introComplete) return;
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const elements = document.querySelectorAll('.image-reveal, .animate-on-scroll');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeView, introComplete]);

  // ── Browser History Integration (Back / Forward Button Support) ─────────
  useEffect(() => {
    const handlePopState = (e) => {
      const viewFromState = e.state?.view;
      const hashView = window.location.hash.replace('#', '');
      let targetView = viewFromState || hashView || 'home';
      if (targetView === 'demo') targetView = 'claim-simulator';
      if (targetView === 'tech') targetView = 'tech-stack';

      if (!introComplete) {
        setIntroComplete(true);
      }
      setActiveView(targetView);
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [introComplete]);

  // Animated Page Curtain Navigation
  const changeView = (newView, skipHistory = false) => {
    let targetView = newView;
    if (newView === 'demo') targetView = 'claim-simulator';
    if (newView === 'tech') targetView = 'tech-stack';

    if (!skipHistory) {
      try {
        window.history.pushState({ view: targetView }, '', `#${targetView}`);
      } catch (e) {
        console.log('History pushState error:', e);
      }
    }

    if (targetView === activeView) {
      if (targetView === 'home' && !introComplete) {
        handleIntroComplete();
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    setCurtainState('covering');
    setTimeout(() => {
      if (!introComplete) setIntroComplete(true);
      setActiveView(targetView);
      window.scrollTo(0, 0);
      setCurtainState('uncovering');
      setTimeout(() => setCurtainState('idle'), 500);
    }, 400);
  };

  const handleResetClaims  = () => setClaimsCount(3);
  const handleOpenCropModal = (crop) => setSelectedCropModal(crop || 'rice');

  // ── Phase 0: 5-Second Mac Style Welcome Animation ───────────────────────
  if (showWelcomeScreen) {
    return <IndianLanguagesWelcome onFinish={() => setShowWelcomeScreen(false)} />;
  }

  // ── Phase 1: Scroll Intro ───────────────────────────────────────────────
  if (!introComplete) {
    return (
      <div style={{ position: 'relative' }}>
        <div className={`transition-curtain ${curtainState}`} />
        <ScrollIntro onComplete={handleIntroComplete} />
      </div>
    );
  }

  // ── Phase 2: Main App ───────────────────────────────────────────────────
  return (
    <div
      className="app-container"
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}
    >
      {/* Page Wipe Curtain */}
      <div className={`transition-curtain ${curtainState}`} />

      {/* Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={changeView}
        claimsCount={claimsCount}
        onOpenClaims={handleResetClaims}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main content */}
      <main style={{ flexGrow: 1 }}>
        {activeView === 'home' && (
          <>
            <Hero setActiveView={changeView} onCropClick={handleOpenCropModal} />
            <CollectionsCTA setActiveView={changeView} onCropClick={handleOpenCropModal} />
            <CompanyHighlight setActiveView={changeView} onCropClick={handleOpenCropModal} />
            <AuditDashboard onCropClick={handleOpenCropModal} />
            <LeadershipHighlight setActiveView={changeView} onCropClick={handleOpenCropModal} />
            <WorkflowOverview setActiveView={changeView} />
          </>
        )}

        {activeView === 'registry' && <DciRegistry setActiveView={changeView} onCropClick={handleOpenCropModal} />}

        {activeView === 'claim-simulator' && (
          <ClaimSimulator 
            setActiveView={changeView} 
            onApproveClaim={(newCount) => {
              setClaimsCount(prev => typeof newCount === 'number' ? newCount : Math.max(0, prev - 1));
            }}
            setClaimsCount={setClaimsCount} 
          />
        )}

        {activeView === 'audit' && <AuditDashboard setActiveView={changeView} onCropClick={handleOpenCropModal} />}
        {activeView === 'sentinel' && <SentinelExplorer setActiveView={changeView} />}
        {activeView === 'settings' && (
          <SettingsView setActiveView={changeView} darkMode={darkMode} setDarkMode={setDarkMode} />
        )}
        {activeView === 'tech-stack' && <TechStackView setActiveView={changeView} />}
        {activeView === 'dhara-brand' && <DharaBrandShowcase setActiveView={changeView} />}
      </main>

      <Footer setActiveView={changeView} />

      {selectedCropModal && (
        <CropDetailModal
          cropKey={selectedCropModal}
          onClose={() => setSelectedCropModal(null)}
        />
      )}
    </div>
  );
}
