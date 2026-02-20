"use client";

import { CheckCircle, Clock } from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: "success" | "pending";
  type: "send" | "receive" | "payment" | "deposit";
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "18 Feb",
    description: "Transfer to Raj",
    amount: "+₹500",
    status: "success",
    type: "send",
  },
  {
    id: "2",
    date: "17 Feb",
    description: "Grocery Store",
    amount: "-₹2,500",
    status: "success",
    type: "payment",
  },
  {
    id: "3",
    date: "16 Feb",
    description: "Salary Deposit",
    amount: "+₹50,000",
    status: "success",
    type: "deposit",
  },
  {
    id: "4",
    date: "15 Feb",
    description: "Online Shopping",
    amount: "-₹1,200",
    status: "success",
    type: "payment",
  },
];

export function RecentTransactions() {
  return (
    <div className="card">
      <div className="border-b border-dark-700 p-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          Recent Transactions
        </h2>
        <a href="#" className="text-xs text-primary hover:text-primary-light">
          View All
        </a>
      </div>

      <div className="divide-y divide-dark-700">
        {mockTransactions.map((txn) => (
          <div
            key={txn.id}
            className="p-5 hover:bg-dark-700/30 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between sm:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <p className="text-sm font-medium text-white">
                    {txn.description}
                  </p>
                  {txn.status === "success" ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <Clock className="h-4 w-4 text-warning" />
                  )}
                </div>
                <p className="text-xs text-gray-400">{txn.date}</p>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-semibold ${
                    txn.amount.startsWith("+")
                      ? "text-success"
                      : "text-gray-300"
                  }`}
                >
                  {txn.amount}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {txn.status}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
