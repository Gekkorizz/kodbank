"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      theme="dark"
      toastOptions={{
        classNames: {
          toast:
            "!bg-dark-800 !border-dark-700 !text-white !min-h-12 !px-4 !py-3 !rounded-xl",
          title: "!text-sm !font-medium",
          description: "!text-xs !text-gray-400 !mt-1",
          closeButton: "!top-2 !right-2",
        },
      }}
    />
  );
}
