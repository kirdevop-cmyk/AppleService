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
        'accent-2': '#8b5cf6',
        'accent-3': '#22d3ee',
        'accent-4': '#fb7185',
        'accent-5': '#fbbf24',
      },
      maxWidth: { container: '1200px' },
      backgroundImage: {
        grad: 'linear-gradient(120deg,#22d3ee,#3b82f6 35%,#8b5cf6 70%,#fb7185)',
      },
    },
  },
  plugins: [],
};

export default config;
