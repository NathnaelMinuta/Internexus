/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a',
        secondary: '#404040',
        accent: '#666666',
        success: '#2d2d2d',
        warning: '#525252',
        danger: '#8B0000',
        background: {
          light: '#f5f5f5',
          dark: '#1a1a1a',
        },
        text: {
          primary: '#1a1a1a',
          secondary: '#4a4a4a',
          muted: '#717171',
        }
      },
    },
  },
  plugins: [],
} 