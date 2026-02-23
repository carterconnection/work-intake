import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brandBlack: '#080808',
        brandRed: '#DA0001',
        brandWhite: '#FFFFFF'
      }
    }
  },
  plugins: []
};

export default config;
