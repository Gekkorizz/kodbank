"use client";

import { getPasswordStrength } from "@/lib/validation";

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) return null;

  const { level, percentage, message } = getPasswordStrength(password);

  const strengthColor =
    level === "strong"
      ? "bg-success"
      : level === "fair"
        ? "bg-warning"
        : "bg-error";

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">Password strength</span>
        <span
          className={`text-xs font-medium ${
            level === "strong"
              ? "text-success"
              : level === "fair"
                ? "text-warning"
                : "text-error"
          }`}
        >
          {message}
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-dark-700">
        <div
          className={`h-full ${strengthColor} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
