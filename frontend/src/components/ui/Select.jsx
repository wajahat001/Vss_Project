import React from 'react'

export default function Select({ label, className = '', children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] font-semibold uppercase tracking-[0.09em] text-text-1">
          {label}
        </label>
      )}
      <select
        className={[
          'w-full h-11 px-3.5 bg-bg-2 border border-border text-text-0 rounded-input',
          'text-sm outline-none transition-all duration-200 cursor-pointer appearance-none',
          'focus:border-violet focus:shadow-focus-violet focus:bg-[#212640]',
          'bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D\'http%3A//www.w3.org/2000/svg\'%20width%3D\'16\'%20height%3D\'16\'%20fill%3D\'none\'%20stroke%3D\'%238B8FA8\'%20stroke-width%3D\'2\'%20stroke-linecap%3D\'round\'%20stroke-linejoin%3D\'round\'%3E%3Cpath%20d%3D\'m4%206%204%204%204-4\'/%3E%3C/svg%3E")]',
          'bg-no-repeat bg-[right_12px_center] pr-9',
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}
