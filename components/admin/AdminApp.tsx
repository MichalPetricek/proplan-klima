"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { ContactEditor } from "@/components/admin/ContactEditor";
import { ReferencesEditor } from "@/components/admin/ReferencesEditor";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

type View = "contacts" | "references" | "future";

export function AdminApp() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [view, setView] = useState<View>("contacts");

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setChecking(false);
      return;
    }

    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active) {
        setUser(data.user);
        setChecking(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setChecking(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!isSupabaseConfigured()) return <MissingConfiguration />;

  if (checking) {
    return (
      <div className="min-h-[70vh] grid place-items-center px-6 bg-paper-soft">
        <p className="text-brand-900/65">Ověřuji přihlášení…</p>
      </div>
    );
  }

  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-[#f6f4ef] py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.22em] font-semibold text-brand-600">
              Proplan Klima
            </p>
            <h1 className="font-display text-4xl sm:text-5xl text-brand-900 mt-2">
              Správa webu
            </h1>
            <p className="text-sm text-brand-900/60 mt-2">Přihlášen: {user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => getSupabaseBrowserClient()?.auth.signOut()}
            className="btn btn-ghost self-start sm:self-auto"
          >
            Odhlásit se
          </button>
        </header>

        <div className="grid lg:grid-cols-[230px_1fr] gap-6 items-start">
          <aside className="bg-white border border-[var(--color-line)] rounded-2xl p-2 lg:sticky lg:top-28">
            <AdminNavButton active={view === "contacts"} onClick={() => setView("contacts")}>
              Kontakty
            </AdminNavButton>
            <AdminNavButton active={view === "references"} onClick={() => setView("references")}>
              Reference
            </AdminNavButton>
            <AdminNavButton active={view === "future"} onClick={() => setView("future")}>
              Další obsah
            </AdminNavButton>
          </aside>

          <section>
            {view === "contacts" && <ContactEditor />}
            {view === "references" && <ReferencesEditor />}
            {view === "future" && <FutureModules />}
          </section>
        </div>
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage("Přihlášení se nepodařilo. Zkontrolujte e-mail a heslo.");
    setLoading(false);
  }

  return (
    <div className="min-h-[78vh] grid place-items-center bg-paper-soft px-6 py-16">
      <form onSubmit={submit} className="w-full max-w-md bg-white border border-[var(--color-line)] rounded-[1.75rem] p-8 sm:p-10 shadow-[0_30px_70px_-42px_rgba(59,42,31,0.45)]">
        <p className="eyebrow">Administrace</p>
        <h1 className="font-display text-4xl text-brand-900 mt-4">Přihlášení</h1>
        <p className="text-sm text-brand-900/65 mt-2">
          Přístup je určen pouze pro správce webu.
        </p>

        <label className="block text-sm font-medium text-brand-900 mt-8">
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
            className="admin-input"
          />
        </label>
        <label className="block text-sm font-medium text-brand-900 mt-5">
          Heslo
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="admin-input"
          />
        </label>

        <button type="submit" disabled={loading} className="btn btn-primary w-full mt-7 disabled:opacity-60">
          {loading ? "Přihlašuji…" : "Přihlásit se"}
        </button>
        {message && <p className="text-sm text-red-700 mt-4" role="alert">{message}</p>}
      </form>
    </div>
  );
}

function MissingConfiguration() {
  return (
    <div className="min-h-[70vh] grid place-items-center bg-paper-soft px-6 py-16">
      <div className="max-w-xl card card-flat p-8 sm:p-10">
        <p className="eyebrow">Administrace</p>
        <h1 className="font-display text-4xl text-brand-900 mt-4">Čeká na propojení se Supabase</h1>
        <p className="text-brand-900/70 mt-4 leading-relaxed">
          Rozhraní je připravené. Pro jeho aktivaci doplňte projektovou URL a
          publishable key do proměnných prostředí podle souboru
          <code className="mx-1 text-sm">.env.example</code>.
        </p>
      </div>
    </div>
  );
}

function AdminNavButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-xl px-4 py-3 text-sm transition-colors ${
        active
          ? "bg-brand-900 text-white"
          : "text-brand-900/70 hover:bg-brand-100 hover:text-brand-900"
      }`}
    >
      {children}
    </button>
  );
}

function FutureModules() {
  return (
    <div className="admin-panel">
      <p className="admin-kicker">Připraveno k rozšíření</p>
      <h2 className="admin-title">Další obsah</h2>
      <p className="text-brand-900/65 mt-3 max-w-2xl">
        Datová vrstva i navigace administrace jsou připravené pro další moduly,
        například služby, partnery, dokumenty, realizované poptávky nebo články.
        Přidáme je podle dalších požadavků klienta.
      </p>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
        {['Služby', 'Partneři', 'Dokumenty', 'Poptávky', 'Aktuality', 'SEO'].map((item) => (
          <div key={item} className="rounded-xl border border-dashed border-brand-300 bg-brand-50 p-5 text-brand-900/55">
            <p className="font-medium text-brand-900/75">{item}</p>
            <p className="text-xs mt-1">Budoucí modul</p>
          </div>
        ))}
      </div>
    </div>
  );
}
