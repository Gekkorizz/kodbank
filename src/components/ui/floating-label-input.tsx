"use client";

import {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useId,
  useState,
} from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";

interface FloatingLabelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helper?: string;
  showPasswordToggle?: boolean;
  isValid?: boolean;
  icon?: ReactNode;
}

export const FloatingLabelInput = forwardRef<
  HTMLInputElement,
  FloatingLabelInputProps
>(
  (
    {
      label,
      error,
      helper,
      showPasswordToggle = false,
      isValid,
      icon,
      type = "text",
      className,
      ...props
    },
    ref
  ) => {
    const id = useId();
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(false);

    const hasValue = props.value && String(props.value).length > 0;
    const inputType =
      showPasswordToggle && showPassword ? "text" : type;

    return (
      <div className="relative">
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={inputType}
            placeholder=" "
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`input peer ${error ? "border-error focus:ring-error/20" : ""} ${isValid ? "border-success" : ""} ${className}`}
            {...props}
          />
          <label
            htmlFor={id}
            className={`absolute left-3 top-1/2 -translate-y-1/2 origin-left text-sm font-medium text-gray-400 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:bg-dark-900 peer-focus:px-1 peer-focus:text-xs peer-focus:text-primary ${
              hasValue && "top-0 bg-dark-900 px-1 text-xs text-primary"
            }`}
          >
            {label}
          </label>

          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-white"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}

          {error && !showPasswordToggle && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-error">
              <X className="h-4 w-4" />
            </div>
          )}

          {isValid && !error && !showPasswordToggle && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-success">
              <Check className="h-4 w-4" />
            </div>
          )}
        </div>

        {error && <p className="error-text mt-1">{error}</p>}
        {helper && !error && (
          <p className="helper-text mt-1">{helper}</p>
        )}
      </div>
    );
  }
);

FloatingLabelInput.displayName = "FloatingLabelInput";
