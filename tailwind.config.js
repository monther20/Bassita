/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-family-display)'],
        body: ['var(--font-family-body)'],
        mono: ['var(--font-family-mono)'],
        handwritten: ['var(--font-family-handwritten)'],
      },
      colors: {
        background: {
          primary: 'var(--color-background-primary)',
          secondary: 'var(--color-background-secondary)',
          tertiary: 'var(--color-background-tertiary)',
          floating: 'var(--color-background-floating)',
        },
        spotlight: {
          purple: 'var(--color-spotlight-purple)',
          pink: 'var(--color-spotlight-pink)',
          blue: 'var(--color-spotlight-blue)',
          green: 'var(--color-spotlight-green)',
          yellow: 'var(--color-spotlight-yellow)',
          red: 'var(--color-spotlight-red)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
        },
      },
      boxShadow: {
        'glow-purple': 'var(--shadow-glow-purple)',
        'glow-pink': 'var(--shadow-glow-pink)',
      },
    },
  },
  plugins: [],
}