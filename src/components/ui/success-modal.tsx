"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface SuccessModalProps {
  title: string;
  message: string;
  autoRedirectTo?: string;
  autoRedirectDelay?: number;
  actionText?: string;
  onAction?: () => void;
}

export function SuccessModal({
  title,
  message,
  autoRedirectTo,
  autoRedirectDelay = 2000,
  actionText = "Continue",
  onAction,
}: SuccessModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (autoRedirectTo && autoRedirectDelay > 0) {
      const timer = setTimeout(() => {
        router.push(autoRedirectTo);
      }, autoRedirectDelay);
      return () => clearTimeout(timer);
    }
  }, [autoRedirectTo, autoRedirectDelay, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-dark-800 p-8 shadow-lg ring-1 ring-dark-700">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
            <Check className="h-8 w-8 text-success" />
          </div>
        </div>

        <h2 className="text-center text-xl font-semibold text-white">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">{message}</p>

        <div className="mt-6 flex gap-3">
          {onAction && (
            <button
              onClick={() => {
                setIsOpen(false);
                onAction();
              }}
              className="btn-primary w-full"
            >
              {actionText}
            </button>
          )}
          {autoRedirectTo && (
            <p className="mt-4 text-center text-xs text-gray-500">
              Redirecting in {Math.ceil(autoRedirectDelay / 1000)} seconds...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
