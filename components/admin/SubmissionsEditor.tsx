"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Submission = {
  id: string;
  from_name: string;
  reply_to: string;
  phone: string;
  location: string;
  service: string;
  message: string;
  handled: boolean;
  created_at: string;
};

type Filter = "open" | "all";

export function SubmissionsEditor() {
  const [items, setItems] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<Filter>("open");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const { data, error: loadError } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (loadError) setError(permissionMessage(loadError.message));
    else setItems((data ?? []) as Submission[]);
    setLoading(false);
  }

  async function setHandled(item: Submission, handled: boolean) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    // Optimistická změna, ať seznam nebliká; při chybě ji vrátíme zpět.
    setItems((current) =>
      current.map((row) => (row.id === item.id ? { ...row, handled } : row)),
    );

    const { error: updateError } = await supabase
      .from("contact_submissions")
      .update({ handled })
      .eq("id", item.id);

    if (updateError) {
      setError(permissionMessage(updateError.message));
      setItems((current) =>
        current.map((row) =>
          row.id === item.id ? { ...row, handled: item.handled } : row,
        ),
      );
    }
  }

  async function remove(item: Submission) {
    if (
      !window.confirm(
        `Opravdu smazat poptávku od „${item.from_name}“? Tuto akci nelze vrátit.`,
      )
    ) {
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const { error: deleteError } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", item.id);

    if (deleteError) {
      setError(permissionMessage(deleteError.message));
      return;
    }
    setItems((current) => current.filter((row) => row.id !== item.id));
  }

  const openCount = items.filter((item) => !item.handled).length;
  const visible = filter === "open" ? items.filter((item) => !item.handled) : items;

  return (
    <div className="admin-panel">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="admin-kicker">Kontaktní formulář</p>
          <h2 className="admin-title">Poptávky</h2>
          <p className="text-sm text-brand-900/60 mt-2">
            {openCount > 0
              ? `Nevyřízených poptávek: ${openCount}`
              : "Všechny poptávky jsou vyřízené."}
          </p>
        </div>
        <div className="flex gap-2">
          <FilterButton active={filter === "open"} onClick={() => setFilter("open")}>
            Nevyřízené
          </FilterButton>
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
            Všechny
          </FilterButton>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-700 mt-5" role="alert">
          {error}
        </p>
      )}

      <div className="mt-7 space-y-3">
        {loading && <p className="text-brand-900/60">Načítám poptávky…</p>}

        {!loading && visible.length === 0 && (
          <p className="rounded-xl bg-brand-50 border border-[var(--color-line)] p-5 text-brand-900/65">
            {filter === "open" && items.length > 0
              ? "Žádná nevyřízená poptávka. Přepněte na „Všechny“ pro historii."
              : "Zatím nedorazila žádná poptávka."}
          </p>
        )}

        {visible.map((item) => (
          <article
            key={item.id}
            className={`rounded-xl border p-5 ${
              item.handled
                ? "border-[var(--color-line)] bg-brand-50/60"
                : "border-brand-300 bg-white"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-brand-900">{item.from_name}</p>
                  {item.handled ? <Badge>Vyřízeno</Badge> : <Badge highlight>Nové</Badge>}
                  {item.service && <Badge>{item.service}</Badge>}
                </div>
                <p className="text-xs text-brand-900/55 mt-1.5">
                  {formatDate(item.created_at)}
                  {item.location && ` · ${item.location}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`mailto:${item.reply_to}?subject=${encodeURIComponent(
                    `Re: Vaše poptávka z webu Proplan Klima`,
                  )}`}
                  className="admin-small-button"
                >
                  Odpovědět
                </a>
                <button
                  type="button"
                  onClick={() => void setHandled(item, !item.handled)}
                  className="admin-small-button"
                >
                  {item.handled ? "Vrátit mezi nové" : "Označit vyřízeno"}
                </button>
                <button
                  type="button"
                  onClick={() => void remove(item)}
                  className="admin-small-button text-red-700"
                >
                  Smazat
                </button>
              </div>
            </div>

            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-1 mt-4 text-sm">
              <Row label="E-mail">
                <a href={`mailto:${item.reply_to}`} className="text-brand-700 hover:underline">
                  {item.reply_to}
                </a>
              </Row>
              {item.phone && (
                <Row label="Telefon">
                  <a href={`tel:${item.phone}`} className="text-brand-700 hover:underline">
                    {item.phone}
                  </a>
                </Row>
              )}
            </dl>

            <p className="text-sm text-brand-900/80 mt-4 whitespace-pre-line leading-relaxed">
              {item.message}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <dt className="text-brand-900/50">{label}:</dt>
      <dd className="min-w-0 truncate">{children}</dd>
    </div>
  );
}

function FilterButton({
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
      className={`rounded-lg px-3.5 py-2 text-sm transition-colors ${
        active
          ? "bg-brand-900 text-white"
          : "text-brand-900/70 hover:bg-brand-100 hover:text-brand-900"
      }`}
    >
      {children}
    </button>
  );
}

function Badge({
  children,
  highlight,
}: {
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <span
      className={`text-[0.65rem] uppercase tracking-[0.12em] font-semibold rounded-full px-2.5 py-1 ${
        highlight ? "bg-brand-700 text-white" : "bg-brand-100 text-brand-900/70"
      }`}
    >
      {children}
    </span>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("cs-CZ", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function permissionMessage(message: string) {
  if (/row-level security|permission|policy/i.test(message)) {
    return "Tento účet nemá oprávnění správce. Přidejte jej do tabulky admin_users v Supabase.";
  }
  return `Operace se nepodařila: ${message}`;
}
