export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0a',
          card: '#111111',
          border: '#1f1f1f',
          hover: '#1a1a1a'
        },
        glow: {
          red: '#ef4444',
          pink: '#ec4899',
          purple: '#a855f7',
          blue: '#3b82f6'
        },
        accent: {
          primary: '#ef4444',
          secondary: '#ec4899'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(239, 68, 68, 0.3)',
        'glow-md': '0 0 20px rgba(239, 68, 68, 0.4)',
        'glow-lg': '0 0 30px rgba(239, 68, 68, 0.5)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.4)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.4)'
      }
    }
  },
  plugins: []
}