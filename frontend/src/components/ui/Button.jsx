import React from 'react'

const variants = {
  primary:   'bg-grad text-[#0b0c12] border-transparent shadow-btn-primary hover:shadow-btn-primary-hover hover:-translate-y-px hover:scale-[1.01]',
  secondary: 'bg-transparent text-text-0 border border-violet/50 hover:bg-violet/10 hover:border-violet',
  ghost:     'bg-transparent text-text-1 border-transparent hover:bg-white/5 hover:text-text-0',
  danger:    'bg-danger/10 text-danger border border-danger/40 hover:bg-danger/20',
}

const sizes = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-10 px-[18px] text-sm',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-btn font-semibold',
        'transition-all duration-200 ease-out active:scale-[0.985] whitespace-nowrap',
        'disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none',
        variants[variant],
        sizes[size],
        block ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
