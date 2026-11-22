import React, { useState, useEffect } from 'react';
import LiquidTextMorph from './LiquidTextMorph';

export default function IndianLanguagesWelcome({ onFinish }) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progressPercent, setProgressPercent] = useState(16.6);

  useEffect(() => {
    // 6 words * 1.2s = 7.2 seconds total presentation
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 6600);

    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 7200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  const handleStepChange = (idx, total) => {
    setProgressPercent(((idx + 1) / total) * 100);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: '#F0EBE3',
        backgroundImage: "url('/intro-frames/frame_001.jpg')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        color: 'var(--color-stoneBrown800)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.6s cubic-bezier(0.19, 1, 0.22, 1)',
        pointerEvents: isFadingOut ? 'none' : 'all',
        userSelect: 'none'
      }}
    >
      {/* Background Subtle Soft Glow */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          backgroundColor: 'rgba(4, 45, 43, 0.04)',
          filter: 'blur(100px)',
          pointerEvents: 'none'
        }}
      />

      {/* Main High-End Liquid Text Morphing Hero Box */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
          padding: '0 20px',
          width: '100%',
          maxWidth: '900px'
        }}
      >
        <LiquidTextMorph duration={1200} fontSize="clamp(60px, 9vw, 120px)" onStepChange={handleStepChange} />
      </div>

      {/* Footer Branding & Progress Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          zIndex: 2
        }}
      >
        <span style={{ fontSize: '11px', color: 'var(--color-stoneBrown600)', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '600' }}>
          DHARA AI • INDIA
        </span>

        {/* 5-second progress bar */}
        <div
          style={{
            width: '180px',
            height: '2px',
            backgroundColor: 'rgba(36, 31, 33, 0.15)',
            borderRadius: '1px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              height: '100%',
              backgroundColor: 'var(--color-stoneBrown800)',
              width: `${progressPercent}%`,
              transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
        </div>
      </div>

      {/* Skip Button */}
      <button
        onClick={() => {
          setIsFadingOut(true);
          setTimeout(() => {
            if (onFinish) onFinish();
          }, 400);
        }}
        style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          background: 'rgba(255,255,255,0.4)',
          border: '1px solid rgba(36, 31, 33, 0.18)',
          color: 'var(--color-stoneBrown800)',
          padding: '8px 18px',
          borderRadius: '20px',
          fontSize: '12px',
          cursor: 'pointer',
          zIndex: 3,
          letterSpacing: '0.05em',
          fontWeight: '600',
          transition: 'all 0.2s ease',
          backdropFilter: 'blur(10px)'
        }}
      >
        Skip →
      </button>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes appleHelloReveal {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.92);
            filter: blur(16px);
          }
          40% {
            opacity: 0.8;
            filter: blur(4px);
          }
          75% {
            opacity: 1;
            transform: translateY(-2px) scale(1.02);
            filter: blur(0px);
          }
          100% {
            opacity: 1;
            transform: translateY(0px) scale(1);
            filter: blur(0px);
          }
        }
        @keyframes appleSubReveal {
          0% {
            opacity: 0;
            transform: translateY(8px);
            filter: blur(4px);
          }
          100% {
            opacity: 0.75;
            transform: translateY(0);
            filter: blur(0px);
          }
        }
      `}</style>
    </div>
  );
}
