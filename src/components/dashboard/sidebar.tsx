"use client";

import Link from "next/link";
import {
  Home,
  CreditCard,
  Send,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  active?: "dashboard" | "accounts" | "transfers" | "analytics" | "settings";
}

export function Sidebar({ active = "dashboard" }: SidebarProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const sections = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      subsections: [
        { label: "Overview", href: "#" },
        { label: "Quick Actions", href: "#" },
      ],
    },
    {
      id: "accounts",
      label: "Accounts",
      icon: CreditCard,
      href: "#",
      subsections: [
        { label: "My Accounts", href: "#" },
        { label: "Add New Account", href: "#" },
      ],
    },
    {
      id: "transfers",
      label: "Transfers",
      icon: Send,
      href: "#",
      subsections: [
        { label: "Send Money", href: "#" },
        { label: "Request Money", href: "#" },
        { label: "Favorite Recipients", href: "#" },
      ],
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      href: "#",
      subsections: [
        { label: "Spending Trends", href: "#" },
        { label: "Income/Expense", href: "#" },
        { label: "Reports", href: "#" },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "#",
      subsections: [
        { label: "Account Settings", href: "#" },
        { label: "Security", href: "#" },
        { label: "Notifications", href: "#" },
      ],
    },
  ];

  const supportSections = [
    {
      id: "help",
      label: "Help & Support",
      icon: HelpCircle,
      subsections: [
        { label: "FAQ", href: "#" },
        { label: "Contact Us", href: "#" },
        { label: "Documentation", href: "#" },
      ],
    },
  ];

  return (
    <aside className="hidden md:flex md:w-64 flex-col border-r border-dark-700 bg-dark-800/30">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = active === section.id;
            const isExpanded = expandedSection === section.id;

            return (
              <div key={section.id}>
                <button
                  onClick={() =>
                    setExpandedSection(
                      isExpanded ? null : section.id
                    )
                  }
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "text-gray-400 hover:text-white hover:bg-dark-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    {section.label}
                  </div>
                  {section.subsections.length > 0 && (
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Subsections */}
                {isExpanded && section.subsections.length > 0 && (
                  <div className="ml-4 mt-1 border-l border-dark-700 space-y-1 pl-3">
                    {section.subsections.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block text-xs text-gray-400 px-3 py-1.5 rounded transition-colors hover:text-white hover:bg-dark-700"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Support Section */}
      <div className="border-t border-dark-700 px-4 py-6">
        <div className="space-y-1">
          {supportSections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === section.id;

            return (
              <div key={section.id}>
                <button
                  onClick={() =>
                    setExpandedSection(
                      isExpanded ? null : section.id
                    )
                  }
                  className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-dark-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    {section.label}
                  </div>
                  {section.subsections.length > 0 && (
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Subsections */}
                {isExpanded && section.subsections.length > 0 && (
                  <div className="ml-4 mt-1 border-l border-dark-700 space-y-1 pl-3">
                    {section.subsections.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block text-xs text-gray-400 px-3 py-1.5 rounded transition-colors hover:text-white hover:bg-dark-700"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
