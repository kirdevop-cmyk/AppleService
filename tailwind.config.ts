import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0c0c0b',
        graphite: '#1f2228',
        charcoal: '#141619',
        smoke: '#474747',
        ash: '#7d8187',
        bone: '#71717a',
        accent: '#8b5cf6',
        'accent-2': '#7c3aed',
        'accent-3': '#a78bfa',
        'accent-4': '#8b5cf6',
        'accent-5': '#a78bfa',
      },
      maxWidth: { container: '1200px' },
      backgroundImage: {
        grad: 'linear-gradient(120deg,#a78bfa,#8b5cf6 50%,#7c3aed)',
      },
    },
  },
  plugins: [],
};

export default config;
