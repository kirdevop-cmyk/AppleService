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
        accent: '#3b82f6',
        'accent-2': '#1d4ed8',
        'accent-3': '#7cc2ff',
        'accent-4': '#3b82f6',
        'accent-5': '#7cc2ff',
      },
      maxWidth: { container: '1200px' },
      backgroundImage: {
        grad: 'linear-gradient(120deg,#e7f1ff,#7cc2ff 35%,#3b82f6 70%,#1d4ed8)',
      },
    },
  },
  plugins: [],
};

export default config;
