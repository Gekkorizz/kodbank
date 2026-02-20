"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Settings, LogOut, Menu, X } from "lucide-react";

interface DashboardHeaderProps {
  userEmail: string;
  userName?: string;
}

export function DashboardHeader({ userEmail, userName }: DashboardHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-dark-700 bg-dark-800/50 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-dark-900 font-bold text-sm">
              K
            </div>
            <span className="text-lg font-bold text-white hidden sm:block">
              KodBank
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#"
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              Accounts
            </a>
            <a
              href="#"
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              Transfers
            </a>
            <a
              href="#"
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              Analytics
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications - Desktop only */}
            <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:text-white hover:bg-dark-700">
              <Bell className="h-5 w-5" />
              <span className="absolute h-2 w-2 rounded-full bg-warning"></span>
            </button>

            {/* Settings - Desktop only */}
            <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:text-white hover:bg-dark-700">
              <Settings className="h-5 w-5" />
            </button>

            {/* User Avatar */}
            <div className="flex items-center gap-2 pl-4 border-l border-dark-700">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                {userName
                  ? userName.charAt(0).toUpperCase()
                  : userEmail.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-gray-400 hidden sm:block">
                {userName || userEmail.split("@")[0]}
              </span>
            </div>

            {/* Logout */}
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="h-9 px-3 rounded-lg bg-dark-700 text-gray-400 text-sm transition-colors hover:text-white hover:bg-dark-600 flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-dark-700"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-dark-700 mt-3 pt-3 space-y-2">
            <a
              href="#"
              className="block text-sm text-gray-400 transition-colors hover:text-white px-2 py-2 rounded hover:bg-dark-700"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="block text-sm text-gray-400 transition-colors hover:text-white px-2 py-2 rounded hover:bg-dark-700"
            >
              Accounts
            </a>
            <a
              href="#"
              className="block text-sm text-gray-400 transition-colors hover:text-white px-2 py-2 rounded hover:bg-dark-700"
            >
              Transfers
            </a>
            <a
              href="#"
              className="block text-sm text-gray-400 transition-colors hover:text-white px-2 py-2 rounded hover:bg-dark-700"
            >
              Analytics
            </a>
            <a
              href="#"
              className="block text-sm text-gray-400 transition-colors hover:text-white px-2 py-2 rounded hover:bg-dark-700"
            >
              Settings
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
