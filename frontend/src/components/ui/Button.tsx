import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: '#6366f1',
    color: '#ffffff',
    border: '1px solid transparent',
    boxShadow: '0 4px 20px rgba(99,102,241,.35)',
  },
  secondary: {
    background: '#161923',
    color: '#eef0ff',
    border: '1px solid #252839',
    boxShadow: '0 2px 10px rgba(0,0,0,.2)',
  },
  ghost: {
    background: 'transparent',
    color: '#8b8fa8',
    border: '1px solid transparent',
  },
  danger: {
    background: 'rgba(239,68,68,.12)',
    color: '#f87171',
    border: '1px solid rgba(239,68,68,.3)',
  },
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { padding: '6px 14px', fontSize: '0.8125rem', borderRadius: 10 },
  md: { padding: '10px 20px', fontSize: '0.875rem', borderRadius: 12 },
  lg: { padding: '14px 28px', fontSize: '1rem', borderRadius: 14, fontWeight: 600 },
  icon: { padding: 10, borderRadius: 10, width: 40, height: 40 },
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  style,
  children,
  ...props
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontFamily: 'inherit',
    fontWeight: 600,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'all 0.15s ease',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...style,
  };

  return (
    <button
      disabled={disabled || loading}
      className={className}
      style={baseStyle}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          if (variant === 'primary') e.currentTarget.style.background = '#4f46e5';
          if (variant === 'secondary') e.currentTarget.style.background = '#1e2235';
          if (variant === 'ghost') {
            e.currentTarget.style.background = '#161923';
            e.currentTarget.style.color = '#eef0ff';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          if (variant === 'primary') e.currentTarget.style.background = '#6366f1';
          if (variant === 'secondary') e.currentTarget.style.background = '#161923';
          if (variant === 'ghost') {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#8b8fa8';
          }
        }
      }}
      {...props}
    >
      {loading ? (
        <span
          style={{
            width: 16,
            height: 16,
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin .7s linear infinite',
          }}
        />
      ) : (
        children
      )}
    </button>
  );
}
