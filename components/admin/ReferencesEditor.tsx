"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/admin/Modal";
import { publicImageUrl, type ReferenceItem } from "@/lib/cms";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const emptyReference = (): ReferenceItem => ({
  id: "",
  title: "",
  category: "",
  description: "",
  image_url: "",
  image_path: null,
  alt: "",
  size: "standard",
  featured: false,
  published: true,
  sort_order: 100,
});

export function ReferencesEditor() {
  const [items, setItems] = useState<ReferenceItem[]>([]);
  const [draft, setDraft] = useState<ReferenceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void loadReferences();
  }, []);

  async function loadReferences() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const { data, error: loadError } = await supabase
      .from("references")
      .select("*")
      .order("sort_order", { ascending: true });

    if (loadError) setError(permissionMessage(loadError.message));
    else setItems((data ?? []) as ReferenceItem[]);
    setLoading(false);
  }

  function openNew() {
    setError("");
    setMessage("");
    setDraft(emptyReference());
  }

  function openEdit(item: ReferenceItem) {
    setError("");
    setMessage("");
    setDraft({ ...item });
  }

  function closeModal() {
    if (saving || uploading) return;
    setDraft(null);
    setError("");
  }

  function update<K extends keyof ReferenceItem>(key: K, value: ReferenceItem[K]) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  }

  async function uploadImage(file: File) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    if (!file.type.startsWith("image/")) {
      setError("Vyberte obrázek ve formátu JPEG, PNG, WebP nebo AVIF.");
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      setError("Obrázek je větší než povolených 6 MB.");
      return;
    }

    setUploading(true);
    setError("");
    const safeName = file.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const path = `references/${Date.now()}-${safeName || "foto.jpg"}`;
    const { error: uploadError } = await supabase.storage
      .from("reference-images")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setError(permissionMessage(uploadError.message));
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("reference-images").getPublicUrl(path);
    setDraft((current) =>
      current
        ? {
            ...current,
            image_url: data.publicUrl,
            image_path: path,
            alt: current.alt || current.title,
          }
        : current,
    );
    setUploading(false);
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!draft) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    if (!draft.image_url) {
      setError("Nahrajte fotografii nebo vložte její URL.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      title: draft.title,
      category: draft.category,
      description: draft.description,
      image_url: draft.image_url,
      image_path: draft.image_path,
      alt: draft.alt || draft.title,
      size: draft.size,
      featured: draft.featured,
      published: draft.published,
      sort_order: draft.sort_order,
    };

    const result = draft.id
      ? await supabase.from("references").update(payload).eq("id", draft.id).select().single()
      : await supabase.from("references").insert(payload).select().single();

    if (result.error) {
      setError(permissionMessage(result.error.message));
    } else {
      setMessage(draft.id ? "Reference byla upravena." : "Reference byla přidána.");
      setDraft(null);
      await loadReferences();
    }
    setSaving(false);
  }

  async function remove(item: ReferenceItem) {
    if (!window.confirm(`Opravdu smazat referenci „${item.title}“?`)) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setError("");
    const { error: deleteError } = await supabase
      .from("references")
      .delete()
      .eq("id", item.id);

    if (deleteError) {
      setError(permissionMessage(deleteError.message));
      return;
    }
    if (item.image_path) {
      await supabase.storage.from("reference-images").remove([item.image_path]);
    }
    setItems((current) => current.filter((record) => record.id !== item.id));
    setMessage("Reference byla smazána.");
  }

  return (
    <div className="admin-panel">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="admin-kicker">Portfolio</p>
          <h2 className="admin-title">Reference</h2>
          <p className="text-sm text-brand-900/60 mt-2">
            Pořadí, publikování a výběr pro úvodní stránku spravujete zde.
          </p>
        </div>
        <button type="button" onClick={openNew} className="btn btn-primary">
          Přidat referenci
        </button>
      </div>

      <div aria-live="polite" className="mt-4 min-h-6">
        {message && <p className="text-sm text-emerald-700">{message}</p>}
        {!draft && error && <p className="text-sm text-red-700">{error}</p>}
      </div>

      <div className="mt-3 space-y-3">
        {loading && <p className="text-brand-900/60">Načítám reference…</p>}
        {!loading && items.length === 0 && (
          <p className="rounded-xl bg-brand-50 border border-[var(--color-line)] p-5 text-brand-900/65">
            Zatím tu nejsou žádné záznamy. Přidejte první referenci tlačítkem nahoře.
          </p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="grid sm:grid-cols-[96px_1fr_auto] gap-4 items-center rounded-xl border border-[var(--color-line)] p-3"
          >
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-brand-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={publicImageUrl(item.image_url)}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2 items-center">
                <p className="font-medium text-brand-900 truncate">{item.title}</p>
                {!item.published && <Badge>Koncept</Badge>}
                {item.featured && <Badge>Na úvodu</Badge>}
              </div>
              <p className="text-xs text-brand-900/55 mt-1">
                {item.category} · pořadí {item.sort_order}
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => openEdit(item)} className="admin-small-button">
                Upravit
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
        ))}
      </div>

      <Modal
        open={draft !== null}
        onClose={closeModal}
        title={draft?.id ? "Úprava reference" : "Nová reference"}
        subtitle={
          draft?.id
            ? "Změny se na webu projeví po uložení a obnovení stránky."
            : "Vyplňte údaje a nahrajte fotografii realizace."
        }
        footer={
          <>
            <button
              type="submit"
              form="reference-form"
              disabled={saving || uploading}
              className="btn btn-primary disabled:opacity-60"
            >
              {saving ? "Ukládám…" : draft?.id ? "Uložit změny" : "Vytvořit referenci"}
            </button>
            <button
              type="button"
              onClick={closeModal}
              disabled={saving || uploading}
              className="btn btn-ghost disabled:opacity-60"
            >
              Zrušit
            </button>
            <p aria-live="polite" className="text-sm">
              {uploading && <span className="text-brand-900/60">Nahrávám fotografii…</span>}
              {error && <span className="text-red-700">{error}</span>}
            </p>
          </>
        }
      >
        {draft && (
          <form id="reference-form" onSubmit={save} className="grid md:grid-cols-2 gap-5">
            <EditorField label="Název" value={draft.title} onChange={(value) => update("title", value)} />
            <EditorField
              label="Kategorie"
              value={draft.category}
              onChange={(value) => update("category", value)}
              placeholder="Např. Vzduchotechnika"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-900">
                Popis
                <textarea
                  value={draft.description}
                  onChange={(e) => update("description", e.target.value)}
                  required
                  rows={5}
                  className="admin-input resize-y"
                />
              </label>
            </div>
            <EditorField
              label="Alternativní popis fotografie"
              value={draft.alt}
              onChange={(value) => update("alt", value)}
              placeholder="Co je na fotografii"
            />
            <EditorField
              label="Pořadí"
              type="number"
              value={String(draft.sort_order)}
              onChange={(value) => update("sort_order", Number(value))}
            />

            <label className="block text-sm font-medium text-brand-900 md:col-span-2">
              Fotografie
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void uploadImage(file);
                }}
                className="admin-input file:mr-4 file:rounded-full file:border-0 file:bg-brand-100 file:px-4 file:py-2 file:text-sm file:text-brand-900"
              />
              <span className="block text-xs text-brand-900/45 mt-1.5">
                JPEG, PNG, WebP nebo AVIF, maximálně 6 MB.
              </span>
            </label>

            <div className="md:col-span-2">
              <EditorField
                label="URL fotografie"
                value={draft.image_url}
                onChange={(value) => update("image_url", value)}
                placeholder="Vyplní se automaticky po nahrání"
                required={false}
              />
            </div>

            {draft.image_url && (
              <div className="md:col-span-2 relative aspect-[16/7] rounded-xl overflow-hidden bg-brand-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={publicImageUrl(draft.image_url)}
                  alt="Náhled"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            )}

            <label className="flex items-center gap-3 text-sm text-brand-900">
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(e) => update("published", e.target.checked)}
                className="accent-[var(--brand-700)]"
              />
              Publikovat na webu
            </label>
            <label className="flex items-center gap-3 text-sm text-brand-900">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => update("featured", e.target.checked)}
                className="accent-[var(--brand-700)]"
              />
              Zobrazit na úvodní stránce
            </label>
            <label className="block text-sm font-medium text-brand-900">
              Velikost karty
              <select
                value={draft.size}
                onChange={(e) => update("size", e.target.value as ReferenceItem["size"])}
                className="admin-input"
              >
                <option value="standard">Standardní</option>
                <option value="wide">Široká dominantní</option>
              </select>
            </label>
          </form>
        )}
      </Modal>
    </div>
  );
}

function EditorField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-brand-900">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="admin-input"
      />
    </label>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-brand-100 px-2.5 py-1 text-[0.6rem] uppercase tracking-wider text-brand-700">
      {children}
    </span>
  );
}

function permissionMessage(message: string) {
  if (/row-level security|permission|policy/i.test(message)) {
    return "Tento účet nemá oprávnění správce. Přidejte jej do tabulky admin_users v Supabase.";
  }
  return `Operace se nepodařila: ${message}`;
}
