import React, { useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils'; 

const inputVariants = cva(
  "w-full rounded-lg outline-none transition-all text-sm placeholder:text-gray-400 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden",
  {
    variants: {
      variant: {
        filled: "bg-[#F5F5F5] border border-transparent text-gray-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
        outline: "bg-white border border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
        error: "bg-red-50 border border-red-500 text-red-900 focus:ring-2 focus:ring-red-500/20",
      },
      inputSize: {
        sm: "h-8 px-3 text-xs",
        md: "h-[44px] px-4 text-sm",
        lg: "h-12 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "filled",
      inputSize: "md",
    },
  }
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      inputSize,
      type = 'text',
      label,
      error,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const currentVariant = error ? 'error' : variant;

    return (
      <div className="flex flex-col gap-1.5 w-full text-left" data-slot="input-wrapper">
        {label && (
          <label className="text-sm font-semibold text-gray-700">
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          <input
            ref={ref}
            type={currentType}
            className={cn(
              inputVariants({ variant: currentVariant, inputSize, className }),
              isPassword && "pr-11"
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>

        {error && (
          <span className="text-xs text-red-500 font-medium">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";