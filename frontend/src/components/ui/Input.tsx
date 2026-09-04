import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export function Input({ label, error, leftIcon, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-[#8b8fa8] uppercase tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 text-[#4b4f6a] pointer-events-none z-10 flex items-center">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={[
            'w-full bg-[#0f1118] border border-[#252839] rounded-xl py-2.5 text-sm text-[#eef0ff]',
            'placeholder:text-[#4b4f6a] outline-none transition-all duration-150',
            'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
            error ? 'border-red-500/60' : '',
            leftIcon ? 'pl-9 pr-4' : 'px-4',
            className,
          ].filter(Boolean).join(' ')}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}
