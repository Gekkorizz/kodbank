export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-4">
      <section className="w-full max-w-md rounded-2xl bg-slate-950/70 p-8 shadow-xl shadow-slate-900/60 ring-1 ring-slate-800">
        <h1 className="text-center text-3xl font-semibold text-white">
          KodBank
        </h1>
        <p className="mt-2 text-center text-sm text-slate-300">
          A minimal banking-style demo focused on secure users and tokens.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <a
            href="/register"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-500 text-sm font-medium text-emerald-950 transition hover:bg-emerald-400"
          >
            Create an account
          </a>
          <a
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-600 text-sm font-medium text-slate-100 transition hover:border-slate-400 hover:bg-slate-900"
          >
            Log in to KodBank
          </a>
        </div>
      </section>
    </main>
  );
}
