/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFCF7',
          100: '#FAF7EE',
          200: '#F4EFE0',
          300: '#EDE4CD',
          400: '#DECFA9',
          500: '#CBB782',
        },
        cream: {
          DEFAULT: '#F7F3E9',
          warm: '#F4ECE1',
          light: '#FAF7F0',
          dark: '#E8DDCB',
        },
        ghee: {
          50: '#FFFDF0',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#FACC15',
          500: '#EAB308',
          600: '#CA8A04',
          700: '#A16207',
          amber: '#D97706',
          gold: '#C59A3F',
          rich: '#E5A93C',
          dark: '#854D0E',
        },
        sage: {
          50: '#F4F7F4',
          100: '#E5EDE5',
          200: '#CBDBCB',
          300: '#A5C0A5',
          400: '#7E9F7E',
          500: '#5F825F',
          600: '#4A664A',
          700: '#394E39',
        },
        earth: {
          800: '#2B251F',
          900: '#1C1814',
          950: '#120F0D',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        display: ['"Cinzel"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(181, 137, 0, 0.12), 0 0 15px rgba(0,0,0,0.03)',
        'glow-gold': '0 0 35px rgba(229, 169, 60, 0.35)',
        'glass': '0 8px 32px 0 rgba(197, 154, 63, 0.1)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
