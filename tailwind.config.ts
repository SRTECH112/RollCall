import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Dark theme colors (Nexrise inspired)
        dark: {
          950: '#050505', // Main background (almost black)
          900: '#0a0a0f', // Secondary background
          800: '#12121a', // Card background
          700: '#1a1a24', // Card hover / border
          600: '#252532', // Divider
          text: {
             primary: '#ffffff',
             secondary: '#94a3b8',
             muted: '#64748b'
          }
        },
        // Fresh green primary (attendance success)
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Soft gold accent (leaderboard/trophies)
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Blue accent from design
        nexblue: {
           400: '#38bdf8',
           500: '#0ea5e9',
           600: '#0284c7',
        },
        // Warm yellow warning (late)
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Neutral grays (not pure black)
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Background system
        background: {
          primary: '#050505', // Default to dark
          secondary: '#0a0a0f',
          card: '#12121a',
        }
      },
      backgroundImage: {
         'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
         'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
         'nex-dark': 'linear-gradient(to bottom, #050505, #0a0a0f)',
         'card-gradient': 'linear-gradient(145deg, #12121a, #0d0d12)',
         'podium-gradient': 'linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0))',
      },
      animation: {
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'flicker': 'flicker 1.5s ease-in-out infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'ripple': 'ripple 0.6s ease-out',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.02)', opacity: '0.9' },
        },
        flicker: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', filter: 'hue-rotate(0deg)' },
          '25%': { transform: 'scale(1.05) rotate(-1deg)', filter: 'hue-rotate(10deg)' },
          '50%': { transform: 'scale(0.98) rotate(1deg)', filter: 'hue-rotate(-5deg)' },
          '75%': { transform: 'scale(1.02) rotate(-0.5deg)', filter: 'hue-rotate(5deg)' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'glow-primary': '0 0 20px rgba(34, 197, 94, 0.3)',
        'glow-accent': '0 0 20px rgba(245, 158, 11, 0.3)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
};
export default config;
