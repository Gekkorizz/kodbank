import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { HeroAccountCard } from "@/components/dashboard/hero-account-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("kodbank_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const user = await getUserFromToken(token);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* Header */}
      <DashboardHeader userEmail={user.email} userName={user.fullName || undefined} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar active="dashboard" />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
            {/* Hero Account Card */}
            <HeroAccountCard
              accountName="Checking Account"
              balance={100000}
              lastActivity="2 hours ago"
            />

            {/* Quick Actions */}
            <QuickActions />

            {/* Summary Cards */}
            <SummaryCards />

            {/* Recent Transactions */}
            <RecentTransactions />

            {/* Analytics Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card p-6 text-center">
                <p className="text-gray-400 mb-4">
                  📊 Balance Trend (Last 30 days)
                </p>
                <p className="text-sm text-gray-500">
                  Chart placeholder - Coming soon with Recharts integration
                </p>
              </div>
              <div className="card p-6 text-center">
                <p className="text-gray-400 mb-4">
                  📈 Spending by Category
                </p>
                <p className="text-sm text-gray-500">
                  Chart placeholder - Coming soon with Recharts integration
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav active="dashboard" />
    </div>
  );
}



