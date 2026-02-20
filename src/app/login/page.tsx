"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }

      // Optional: store token in memory/localStorage for client-side calls.
      if (typeof window !== "undefined") {
        window.localStorage.setItem("kodbank_token", data.token);
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Unexpected error, please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <section className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-xl shadow-slate-950/60 ring-1 ring-slate-800">
        <h1 className="text-center text-2xl font-semibold text-white">
          Log in to KodBank
        </h1>
        <p className="mt-2 text-center text-sm text-slate-300">
          Secure access with stateless tokens.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-0 focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-0 focus:border-emerald-400"
            />
          </div>

          {error && (
            <p className="text-sm text-rose-400" aria-live="polite">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-emerald-500 text-sm font-medium text-emerald-950 transition hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          New to KodBank?{" "}
          <a
            href="/register"
            className="text-emerald-400 hover:text-emerald-300"
          >
            Open an account
          </a>
        </p>
      </section>
    </main>
  );
}


