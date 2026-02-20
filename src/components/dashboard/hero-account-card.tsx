"use client";

import { Send, ArrowDownLeft, MoreHorizontal } from "lucide-react";

interface heroAccountCardProps {
  accountName?: string;
  balance: number;
  lastActivity?: string;
}

export function HeroAccountCard({
  accountName = "Checking Account",
  balance,
  lastActivity,
}: heroAccountCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-dark to-primary-light p-6 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 h-24 w-24 rounded-full bg-white/20 blur-3xl"></div>
      </div>

      <div className="relative">
        <div className="flex items-start justify-between mb-12">
          <div>
            <p className="text-sm font-medium opacity-90">{accountName}</p>
            <p className="text-xs opacity-75 mt-1">Visa •••• 1234</p>
          </div>
          <div className="h-8 w-12 rounded-lg bg-white/20 flex items-center justify-center">
            💳
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm font-medium opacity-90 mb-2">Current Balance</p>
          <p className="text-4xl font-bold">
            ₹{balance.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-t border-white/20">
          {lastActivity && (
            <div className="pt-4">
              <p className="text-xs opacity-75">Last Activity</p>
              <p className="text-sm font-medium">{lastActivity}</p>
            </div>
          )}
          <div className="pt-4">
            <p className="text-xs opacity-75">Account Type</p>
            <p className="text-sm font-medium">Savings</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg py-2.5 px-3 text-sm font-medium transition-all">
            <Send className="h-4 w-4 inline mr-2" />Transfer
          </button>
          <button className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg py-2.5 px-3 text-sm font-medium transition-all">
            <ArrowDownLeft className="h-4 w-4 inline mr-2" />Receive
          </button>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg py-2.5 px-3 text-sm font-medium transition-all">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
