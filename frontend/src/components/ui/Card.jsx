import React from 'react'

export default function Card({ hoverable = false, className = '', children, ...props }) {
  return (
    <div
      className={[
        'rounded-card border border-white/[0.08]',
        'bg-gradient-to-b from-white/[0.045] to-white/[0.015]',
        'transition-all duration-200',
        hoverable
          ? 'hover:border-violet/45 hover:shadow-glow-violet-md cursor-pointer'
          : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}
