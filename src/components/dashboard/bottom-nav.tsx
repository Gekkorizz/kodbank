"use client";

import Link from "next/link";
import {
  Home,
  Send,
  CreditCard,
  BarChart3,
  Settings,
} from "lucide-react";

interface BottomNavProps {
  active?: "dashboard" | "transfers" | "accounts" | "analytics" | "settings";
}

export function BottomNav({ active = "dashboard" }: BottomNavProps) {
  const items = [
    { id: "dashboard", label: "Home", icon: Home, href: "/dashboard" },
    { id: "transfers", label: "Transfers", icon: Send, href: "#" },
    { id: "accounts", label: "Accounts", icon: CreditCard, href: "#" },
    { id: "analytics", label: "Analytics", icon: BarChart3, href: "#" },
    { id: "settings", label: "Settings", icon: Settings, href: "#" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-dark-700 bg-dark-800/50 backdrop-blur-md">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-3 text-xs font-medium transition-colors ${
                isActive
                  ? "text-primary border-t-2 border-primary"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
