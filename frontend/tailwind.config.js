/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Serein Wealth Luxury Editorial Palette
        serein: {
          bg: '#FBF9F5',      // Primary warm linen cream background
          cream: '#F5EFE6',   // Soft card cream
          taupe: '#CAB4AA',   // Signature warm cashmere taupe
          border: '#EAE3D9',  // Subtle divider line
          text: '#1B1D1C',    // Deep espresso / charcoal
          muted: '#68625B',   // Muted body text
          dark: '#141716',    // Deep charcoal for dark cards
          sage: '#4A5D4E',    // Refined agricultural sage
          sand: '#EFE9DF',
        },
        // Brand & Theme Compatibility
        midnight: '#050B12',
        deepNavy: '#0B1725',
        forestGreen: '#123D2B',
        electricBlue: '#83CFFF',
        lime: '#C5E86C',
        warmIvory: '#FBF9F5',
        agri: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        navy: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
