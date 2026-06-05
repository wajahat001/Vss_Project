module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        bg: {
          0: '#0F1117',
          1: '#1A1D27',
          2: '#1E2235',
        },
        violet: {
          DEFAULT: '#6C63FF',
          2: '#8B83FF',
        },
        mint: '#00D9A3',
        danger: '#FF6B6B',
        warning: '#FFB347',
        text: {
          0: '#F0F0F5',
          1: '#8B8FA8',
          2: '#5D6178',
        },
        border: '#2A2D3E',
        glass: {
          bg: 'rgba(255,255,255,0.04)',
          br: 'rgba(255,255,255,0.08)',
        },
      },
      borderRadius: {
        card: '14px',
        btn: '8px',
        input: '6px',
      },
      height: {
        nav: '64px',
      },
      width: {
        sidebar: '240px',
      },
      boxShadow: {
        'glow-violet': '0 0 24px rgba(108,99,255,0.35)',
        'glow-violet-md': '0 0 0 1px rgba(108,99,255,0.15), 0 8px 30px rgba(0,0,0,0.35)',
        'focus-violet': '0 0 0 3px rgba(108,99,255,0.18)',
        'btn-primary': '0 6px 20px rgba(108,99,255,0.28)',
        'btn-primary-hover': '0 10px 30px rgba(108,99,255,0.4)',
        'menu': '0 18px 50px rgba(0,0,0,0.5)',
      },
      backgroundImage: {
        'grad': 'linear-gradient(120deg, #6C63FF 0%, #00D9A3 100%)',
      },
      backdropBlur: {
        nav: '14px',
        card: '12px',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
    },
  },
  plugins: [],
}
