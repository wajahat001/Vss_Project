import React from 'react'

export default function Input({ label, error, className = '', textarea = false, ...props }) {
  const base = [
    'w-full bg-bg-2 border border-[#3a3d52] text-text-0 placeholder-text-2 rounded-input',
    'text-sm outline-none transition-all duration-200',
    'focus:border-violet focus:shadow-focus-violet focus:bg-[#212640]',
    textarea ? 'px-3.5 py-3 resize-y min-h-[96px] leading-[1.55]' : 'h-11 px-3.5',
    className,
  ].join(' ')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] font-semibold uppercase tracking-[0.09em] text-text-1">
          {label}
        </label>
      )}
      {textarea
        ? <textarea className={base} {...props} />
        : <input className={base} {...props} />
      }
      {error && <p className="text-[12px] text-danger">{error}</p>}
    </div>
  )
}
