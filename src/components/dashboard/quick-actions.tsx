"use client";

import { Send, ArrowDownLeft, FileText, MoreHorizontal } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      icon: Send,
      label: "Send Money",
      description: "Transfer to recipients",
    },
    {
      icon: ArrowDownLeft,
      label: "Request Money",
      description: "Ask for payment",
    },
    {
      icon: FileText,
      label: "Pay Bills",
      description: "Utility & more",
    },
    {
      icon: MoreHorizontal,
      label: "View History",
      description: "All transactions",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            className="card-hover p-4 text-center group"
          >
            <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/30">
                <Icon className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">
              {action.label}
            </h3>
            <p className="text-xs text-gray-400">{action.description}</p>
          </button>
        );
      })}
    </div>
  );
}
