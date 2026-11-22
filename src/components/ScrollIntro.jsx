import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * ScrollIntro — Apple-style scroll-driven frame animation
 * ─────────────────────────────────────────────────────────
 * • 94 JPG frames scrubbed by scroll position on canvas
 * • Smooth lerped playback (never jerky)
 * • Parallax: canvas zooms slightly as you scroll
 * • Text layers fade in/out at key scroll positions
 * • Progress bar at bottom
 * • onComplete fires when user scrolls to the end
 */

const TOTAL_FRAMES = 94;
const FRAME_PATH = (n) => `/intro-frames/frame_${String(n).padStart(3, '0')}.jpg`;
const SCROLL_HEIGHT = '1200vh'; // total scrollable length for heavy weighted feel

function preloadFrames(onProgress) {
  const imgs = new Array(TOTAL_FRAMES);
  let loaded = 0;
  return new Promise((resolve) => {
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i + 1);
      img.onload = img.onerror = () => {
        loaded++;
        onProgress?.(loaded / TOTAL_FRAMES);
        if (loaded === TOTAL_FRAMES) resolve(imgs);
      };
      imgs[i] = img;
    }
  });
}

export default function ScrollIntro({ onComplete }) {
  const wrapperRef     = useRef(null);
  const stickyRef      = useRef(null);
  const canvasRef      = useRef(null);
  const loaderWrapRef  = useRef(null);
  const loaderBarRef   = useRef(null);
  const progressRef    = useRef(null);

  // Text overlay refs
  const text1Ref = useRef(null); // "Every crop tells a story"
  const text2Ref = useRef(null); // "We read it with AI"
  const text3Ref = useRef(null); // Brand lock-up

  const framesRef       = useRef([]);
  const loadedRef       = useRef(false);
  const [loadPct, setLoadPct] = useState(0);

  // Smooth lerp state
  const currentFrameRef   = useRef(0);     // actual rendered float frame
  const targetFrameRef    = useRef(0);     // desired frame from scroll
  const rafIdRef          = useRef(null);
  const scrollPRef        = useRef(0);

  // Scale parallax
  const currentScaleRef   = useRef(1);
  const targetScaleRef    = useRef(1);

  // Completion
  const dwellTimerRef     = useRef(null);
  const completedRef      = useRef(false);

  // ── Draw one frame with scale (parallax zoom) ──────────────────────────
  const drawFrame = useCallback((frameFloat, scale) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const idx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.floor(frameFloat)));
    const img = framesRef.current[idx];
    if (!img?.complete || !img.naturalWidth) return;

    const ctx = canvas.getContext('2d');
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Cover-fit then apply zoom scale
    const fit = Math.max(cw / iw, ch / ih) * scale;
    const sw = iw * fit;
    const sh = ih * fit;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
  }, []);

  // ── Smooth rAF loop ─────────────────────────────────────────────────────
  const rafLoop = useCallback(() => {
    rafIdRef.current = requestAnimationFrame(rafLoop);

    const LERP_SPEED = 0.05; // lower = smoother/heavier/slower

    // Lerp frame
    const diff = targetFrameRef.current - currentFrameRef.current;
    if (Math.abs(diff) > 0.01) {
      currentFrameRef.current += diff * LERP_SPEED;
    } else {
      currentFrameRef.current = targetFrameRef.current;
    }

    // Lerp scale
    const sDiff = targetScaleRef.current - currentScaleRef.current;
    if (Math.abs(sDiff) > 0.0001) {
      currentScaleRef.current += sDiff * LERP_SPEED;
    } else {
      currentScaleRef.current = targetScaleRef.current;
    }

    drawFrame(currentFrameRef.current, currentScaleRef.current);
  }, [drawFrame]);

  // ── Resize canvas ───────────────────────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  // ── Text overlay helper ─────────────────────────────────────────────────
  const setTextState = (ref, opacity, translateY) => {
    if (!ref?.current) return;
    ref.current.style.opacity   = opacity;
    ref.current.style.transform = `translateY(${translateY}px)`;
  };

  // ── Scroll handler ──────────────────────────────────────────────────────
  const onScroll = useCallback(() => {
    if (!wrapperRef.current || !loadedRef.current) return;

    const wrap    = wrapperRef.current;
    const maxS    = wrap.offsetHeight - window.innerHeight;
    const scrolled = Math.max(0, -wrap.getBoundingClientRect().top);
    const p       = Math.min(1, maxS > 0 ? scrolled / maxS : 1);
    scrollPRef.current = p;

    // ── Frame scrubbing (full 94 frames across 0→0.85 of scroll) ─────────
    const framePct = Math.min(1, p / 0.85);
    targetFrameRef.current = framePct * (TOTAL_FRAMES - 1);

    // ── Parallax zoom: 1.0 → 1.12 over the first half, then back to 1.0 ─
    if (p < 0.5) {
      targetScaleRef.current = 1.0 + (p / 0.5) * 0.12;
    } else {
      targetScaleRef.current = 1.12 - ((p - 0.5) / 0.5) * 0.12;
    }

    // ── Text layer 1 — "Every crop tells a story." (0.05 → 0.25) ────────
    const t1In  = Math.min(1, Math.max(0, (p - 0.05) / 0.10));
    const t1Out = Math.min(1, Math.max(0, (p - 0.22) / 0.08));
    setTextState(text1Ref, t1In * (1 - t1Out), -30 + (1 - t1In) * 30 + t1Out * -20);

    // ── Text layer 2 — "We read it with AI." (0.35 → 0.55) ──────────────
    const t2In  = Math.min(1, Math.max(0, (p - 0.35) / 0.10));
    const t2Out = Math.min(1, Math.max(0, (p - 0.52) / 0.08));
    setTextState(text2Ref, t2In * (1 - t2Out), -30 + (1 - t2In) * 30 + t2Out * -20);

    // ── Text layer 3 — Brand lock-up (0.70 → 1.0) ────────────────────────
    const t3In  = Math.min(1, Math.max(0, (p - 0.70) / 0.12));
    const t3Out = Math.min(1, Math.max(0, (p - 0.90) / 0.08));
    setTextState(text3Ref, t3In * (1 - t3Out), -30 + (1 - t3In) * 30 + t3Out * -20);

    // ── Whole panel fade-out (0.90 → 1.0) ────────────────────────────────
    if (stickyRef.current) {
      const ep = Math.min(1, Math.max(0, (p - 0.90) / 0.10));
      stickyRef.current.style.opacity = 1 - ep;
    }

    // ── Scroll progress bar ───────────────────────────────────────────────
    if (progressRef.current) {
      progressRef.current.style.width = `${p * 100}%`;
    }

    // ── Completion ────────────────────────────────────────────────────────
    if (p >= 0.98 && !completedRef.current) {
      if (!dwellTimerRef.current) {
        dwellTimerRef.current = setTimeout(() => {
          if (scrollPRef.current >= 0.98) {
            completedRef.current = true;
            onComplete?.();
          }
          dwellTimerRef.current = null;
        }, 400);
      }
    } else if (p < 0.95) {
      completedRef.current = false;
      if (dwellTimerRef.current) {
        clearTimeout(dwellTimerRef.current);
        dwellTimerRef.current = null;
      }
    }
  }, [onComplete]);

  // ── Boot ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Start rAF so canvas is responsive immediately
    rafIdRef.current = requestAnimationFrame(rafLoop);

    preloadFrames((pct) => {
      setLoadPct(Math.round(pct * 100));
      if (loaderBarRef.current) {
        loaderBarRef.current.style.width = `${Math.round(pct * 100)}%`;
      }
    }).then((imgs) => {
      framesRef.current = imgs;
      loadedRef.current = true;

      // Hide loader with fade
      if (loaderWrapRef.current) {
        loaderWrapRef.current.style.opacity   = '0';
        loaderWrapRef.current.style.pointerEvents = 'none';
      }

      // Draw frame 0 immediately
      targetFrameRef.current  = 0;
      currentFrameRef.current = 0;

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    });

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', onScroll);
      if (dwellTimerRef.current) clearTimeout(dwellTimerRef.current);
    };
  }, [rafLoop, onScroll, resizeCanvas]);

  return (
    <div
      ref={wrapperRef}
      style={{ position: 'relative', height: SCROLL_HEIGHT, zIndex: 10 }}
    >
      {/* ── Sticky viewport (100vh window) ── */}
      <div
        ref={stickyRef}
        style={{
          position: 'sticky',
          top: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          background: '#f0ebe3',
          willChange: 'opacity',
        }}
      >
        {/* Canvas — full-screen frame scrubber */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
            willChange: 'transform',
          }}
        />

        {/* ── Text layer 1: "Every crop tells a story." ── */}
        <div
          ref={text1Ref}
          className="si-text-layer"
          style={{ opacity: 0, transform: 'translateY(30px)' }}
        >
          <p className="si-tagline">Every crop tells a story.</p>
        </div>

        {/* ── Text layer 2: "We read it with AI." ── */}
        <div
          ref={text2Ref}
          className="si-text-layer"
          style={{ opacity: 0, transform: 'translateY(30px)' }}
        >
          <p className="si-tagline">We read it with AI.</p>
        </div>

        {/* ── Text layer 3: Brand lock-up ── */}
        <div
          ref={text3Ref}
          className="si-text-layer si-brand-layer"
          style={{ opacity: 0, transform: 'translateY(30px)' }}
        >
          <p className="si-brand-sub">Introducing</p>
          <h1 className="si-brand-name">Dhara AI</h1>
          <p className="si-brand-desc">Scroll to begin →</p>
        </div>

        {/* ── Scroll progress bar (bottom) ── */}
        <div className="si-progress-track">
          <div ref={progressRef} className="si-progress-fill" />
        </div>

        {/* ── Scroll hint arrow (visible at start) ── */}
        <div className="si-scroll-hint">
          <div className="si-scroll-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </div>
          <span>Scroll to explore</span>
        </div>

        {/* ── Preloader overlay ── */}
        <div
          ref={loaderWrapRef}
          className="si-loader-overlay"
          style={{ transition: 'opacity 0.7s ease' }}
        >
          <div className="si-loader-content">
            <p className="si-loader-label">Loading experience</p>
            <div className="si-loader-track-outer">
              <div ref={loaderBarRef} className="si-loader-bar-fill" />
            </div>
            <p className="si-loader-pct">{loadPct}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
