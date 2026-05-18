export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  darkMode: 'selector',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        'surface-navy': 'var(--color-surface-navy)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'text-disabled': 'var(--color-text-disabled)',
        'border-subtle': 'var(--color-border-subtle)',
        'border-default': 'var(--color-border-default)',
        'border-strong': 'var(--color-border-strong)',
        success: 'var(--color-success)',
        'success-surface': 'var(--color-success-surface)',
        'success-text': 'var(--color-success-text)',
        warning: 'var(--color-warning)',
        'warning-surface': 'var(--color-warning-surface)',
        'warning-text': 'var(--color-warning-text)',
        danger: 'var(--color-danger)',
        'danger-surface': 'var(--color-danger-surface)',
        'danger-text': 'var(--color-danger-text)',
        info: 'var(--color-info)',
        'info-surface': 'var(--color-info-surface)',
        'info-text': 'var(--color-info-text)',
        'navy-50': 'var(--color-navy-50)',
        'navy-100': 'var(--color-navy-100)',
        'navy-200': 'var(--color-navy-200)',
        'orange-50': 'var(--color-orange-50)',
        'orange-100': 'var(--color-orange-100)',
        'orange-600': 'var(--color-orange-600)',
        // Keep shadcn defaults for compatibility
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        card: 'var(--radius-card)',
        modal: 'var(--radius-modal)',
        button: 'var(--radius-button)',
        input: 'var(--radius-input)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      }
    }
  }
}