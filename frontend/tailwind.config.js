/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          950: '#050714', // Deepest space void
          900: '#0B0D1F', // Standard background
          800: '#161A35', // Lighter background
          glass: 'rgba(22, 26, 53, 0.4)', // Base for glass panels
          border: 'rgba(255, 255, 255, 0.08)', // Subtle glass border
        },
        neon: {
          cyan: '#00F0FF',
          magenta: '#FF0090',
          purple: '#BD00FF',
          blue: '#4D7DFF'
        },
        hazard: {
          safe: '#00F260',
          medium: '#FFB020',
          critical: '#FF3333'
        }
      },
      fontFamily: {
        rajdhani: ['Rajdhani', 'sans-serif'], // Headers, sci-fi feel
        inter: ['Inter', 'sans-serif'], // Body text, readability
      },
      boxShadow: {
        'glass-sm': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'glass-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'glow-cyan': '0 0 15px rgba(0, 240, 255, 0.4)',
        'glow-magenta': '0 0 15px rgba(255, 0, 144, 0.4)',
        'glow-critical': '0 0 20px rgba(255, 51, 51, 0.6)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cosmos-gradient': 'linear-gradient(to bottom right, #050714, #0B0D1F, #120D24)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}