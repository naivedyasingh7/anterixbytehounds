import React, { useState, useEffect } from 'react';

const GREETINGS = [
  { word: "Hello", lang: "English", script: "Welcome" },
  { word: "नमस्ते", lang: "Hindi", script: "Namaste" },
  { word: "నమస్కారం", lang: "Telugu", script: "Namaskaram" },
  { word: "নমস্কার", lang: "Bengali", script: "Nomoshkar" },
  { word: "வணக்கம்", lang: "Tamil", script: "Vanakkam" },
  { word: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ", lang: "Punjabi", script: "Sat Sri Akal" },
  { word: "Hello", lang: "Dhara AI", script: "Precision Intelligence" }
];

export default function LiquidTextMorph({ fontSize = 'clamp(56px, 8.5vw, 120px)', onStepChange }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isExiting, setIsExiting] = useState(false);

  const current = GREETINGS[wordIndex];

  useEffect(() => {
    if (onStepChange) {
      onStepChange(wordIndex, GREETINGS.length);
    }
  }, [wordIndex, onStepChange]);

  useEffect(() => {
    setIsExiting(false);
    setDisplayedText('');

    // Segment graphemes for native script letter-by-letter typing
    let graphemes = [];
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter('und', { granularity: 'grapheme' });
      graphemes = Array.from(segmenter.segment(current.word), s => s.segment);
    } else {
      graphemes = Array.from(current.word);
    }

    let charCount = 0;
    const typeSpeed = Math.max(60, Math.min(110, Math.floor(650 / graphemes.length)));

    const typeInterval = setInterval(() => {
      charCount++;
      setDisplayedText(graphemes.slice(0, charCount).join(''));

      if (charCount >= graphemes.length) {
        clearInterval(typeInterval);

        // Hold visible for 700ms then trigger liquid exit
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            setWordIndex((prev) => (prev + 1) % GREETINGS.length);
          }, 350); // 350ms exit fade
        }, 700);
      }
    }, typeSpeed);

    return () => clearInterval(typeInterval);
  }, [wordIndex, current.word]);


  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        minHeight: '160px',
        width: '100%',
        userSelect: 'none'
      }}
    >
      {/* Text Container with Clean Bounds */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '130px',
          width: '100%'
        }}
      >
        <h1
          key={wordIndex}
          className={`handwritten-morph-text ${isExiting ? 'exit' : 'enter'}`}
          style={{
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontStyle: 'italic',
            fontSize: fontSize,
            fontWeight: '500',
            letterSpacing: '0.02em',
            margin: 0,
            color: 'var(--color-stoneBrown800)',
            lineHeight: 1.15,
            willChange: 'transform, opacity, filter',
            textAlign: 'center',
            WebkitFontSmoothing: 'antialiased',
            position: 'relative'
          }}
        >
          {displayedText}
          <span className="typing-cursor">|</span>
        </h1>
      </div>

      {/* Subtitle Language Tag */}
      <div
        key={`sub-${wordIndex}`}
        className={`handwritten-sub-text ${isExiting ? 'exit' : 'enter'}`}
        style={{
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontFamily: "'Manrope', sans-serif",
          color: 'var(--color-stoneBrown600)',
          fontWeight: '600'
        }}
      >
        <span style={{ width: '20px', height: '1px', backgroundColor: 'var(--color-stoneBrown600)' }} />
        <span>{current.lang} • {current.script}</span>
        <span style={{ width: '20px', height: '1px', backgroundColor: 'var(--color-stoneBrown600)' }} />
      </div>

      {/* Styles & Animation Keyframes */}
      <style>{`
        .typing-cursor {
          display: inline-block;
          font-style: normal;
          font-weight: 300;
          color: 'var(--color-stoneBrown600)';
          margin-left: 2px;
          animation: blinkCursor 0.6s infinite alternate;
        }

        .handwritten-morph-text.enter {
          animation: textEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .handwritten-morph-text.exit {
          animation: textExit 0.35s cubic-bezier(0.7, 0, 0.84, 0) forwards;
        }

        .handwritten-sub-text.enter {
          animation: subEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .handwritten-sub-text.exit {
          animation: subExit 0.25s ease-out forwards;
        }

        @keyframes blinkCursor {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes textEnter {
          0% {
            opacity: 0;
            transform: translateY(16px) scale(0.96);
            filter: blur(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0px) scale(1);
            filter: blur(0px);
          }
        }

        @keyframes textExit {
          0% {
            opacity: 1;
            transform: translateY(0px) scale(1);
            filter: blur(0px);
          }
          100% {
            opacity: 0;
            transform: translateY(-18px) scale(1.03);
            filter: blur(12px);
          }
        }

        @keyframes subEnter {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 0.75;
            transform: translateY(0);
          }
        }

        @keyframes subExit {
          0% {
            opacity: 0.75;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}
