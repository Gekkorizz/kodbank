import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/lib/auth";

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

  const profile = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <section className="w-full max-w-xl rounded-2xl bg-slate-900 p-8 shadow-xl shadow-slate-950/60 ring-1 ring-slate-800">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">KodBank</h1>
            <p className="text-xs text-slate-400">Secure user & token demo</p>
          </div>
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="inline-flex h-9 items-center rounded-xl border border-slate-600 px-3 text-xs font-medium text-slate-100 transition hover:border-rose-400 hover:text-rose-200"
            >
              Logout
            </button>
          </form>
        </header>

        <div className="rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-emerald-600 p-[1px]">
          <div className="rounded-[0.7rem] bg-slate-950/90 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-300">
              KodBank User Dashboard
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              Welcome, {profile.fullName || profile.email}
            </p>
            <p className="mt-1 text-xs text-slate-300">
              Email: <span className="font-mono">{profile.email}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-5">
          <h2 className="text-sm font-semibold text-slate-100">
            KodBank balance simulation
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            In this demo, we only manage users and tokens, but the flow mirrors
            a banking-style dashboard.
          </p>
          <p className="mt-4 text-3xl font-bold text-emerald-400">
            ₹100,000.00
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Default simulated balance for every new KodBank customer.
          </p>
        </div>
      </section>
    </main>
  );
}


