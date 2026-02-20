"use client";

import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react";

interface SummaryCard {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: number;
  isPositive: boolean;
}

const cards: SummaryCard[] = [
  {
    icon: <TrendingUp className="h-5 w-5" />,
    label: "Total Balance",
    value: "₹100,000.00",
    change: 2.5,
    isPositive: true,
  },
  {
    icon: <ArrowDown className="h-5 w-5" />,
    label: "Pending Transactions",
    value: "0",
    change: 0,
    isPositive: true,
  },
  {
    icon: <ArrowUp className="h-5 w-5" />,
    label: "Monthly Limit",
    value: "₹500,000.00",
    change: -0.1,
    isPositive: false,
  },
];

export function SummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, idx) => (
        <div key={idx} className="card p-5 hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              {card.icon}
            </div>
            <span
              className={`text-xs font-medium flex items-center gap-1 ${
                card.isPositive ? "text-success" : "text-error"
              }`}
            >
              {card.isPositive ? "↑" : "↓"} {Math.abs(card.change)}%
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-1">{card.label}</p>
          <p className="text-2xl font-bold text-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
