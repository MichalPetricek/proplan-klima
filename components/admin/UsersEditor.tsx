"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Modal } from "@/components/admin/Modal";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type AdminUser = {
  user_id: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  last_sign_in_at: string | null;
};

export function UsersEditor({ currentUser }: { currentUser: User }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showNew, setShowNew] = useState(false);
  const [passwordTarget, setPasswordTarget] = useState<AdminUser | null>(null);
  const [showOwnPassword, setShowOwnPassword] = useState(false);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const { data, error: loadError } = await supabase.rpc("admin_list_users");
    if (loadError) setError(rpcMessage(loadError.message));
    else setUsers((data ?? []) as AdminUser[]);
    setLoading(false);
  }

  async function toggleAdmin(user: AdminUser) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setError("");
    setMessage("");
    const { error: roleError } = await supabase.rpc("admin_set_role", {
      target_user_id: user.user_id,
      make_admin: !user.is_admin,
    });

    if (roleError) {
      setError(rpcMessage(roleError.message));
      return;
    }
    setMessage(
      user.is_admin
        ? `${user.email} už není správce.`
        : `${user.email} je nově správce.`,
    );
    await load();
  }

  async function removeUser(user: AdminUser) {
    if (
      !window.confirm(
        `Opravdu smazat účet ${user.email}? Tuto akci nelze vrátit zpět.`,
      )
    ) {
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setError("");
    setMessage("");
    const { error: deleteError } = await supabase.rpc("admin_delete_user", {
      target_user_id: user.user_id,
    });

    if (deleteError) {
      setError(rpcMessage(deleteError.message));
      return;
    }
    setMessage(`Účet ${user.email} byl smazán.`);
    await load();
  }

  return (
    <div className="admin-panel">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="admin-kicker">Přístupy</p>
          <h2 className="admin-title">Uživatelé</h2>
          <p className="text-sm text-brand-900/60 mt-2">
            Správci se přihlašují do administrace na <code>/admin</code>.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowOwnPassword(true)}
            className="btn btn-ghost"
          >
            Změnit moje heslo
          </button>
          <button type="button" onClick={() => setShowNew(true)} className="btn btn-primary">
            Přidat uživatele
          </button>
        </div>
      </div>

      <div aria-live="polite" className="mt-4 min-h-6">
        {message && <p className="text-sm text-emerald-700">{message}</p>}
        {error && <p className="text-sm text-red-700">{error}</p>}
      </div>

      <div className="mt-3 space-y-3">
        {loading && <p className="text-brand-900/60">Načítám uživatele…</p>}

        {users.map((user) => {
          const isSelf = user.user_id === currentUser.id;
          return (
            <div
              key={user.user_id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--color-line)] p-4"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-brand-900 truncate">{user.email}</p>
                  {user.is_admin && <Badge highlight>Správce</Badge>}
                  {isSelf && <Badge>Vy</Badge>}
                </div>
                <p className="text-xs text-brand-900/55 mt-1">
                  {user.last_sign_in_at
                    ? `Naposledy přihlášen ${formatDate(user.last_sign_in_at)}`
                    : "Zatím se nepřihlásil"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => (isSelf ? setShowOwnPassword(true) : setPasswordTarget(user))}
                  className="admin-small-button"
                >
                  Změnit heslo
                </button>
                {!isSelf && (
                  <>
                    <button
                      type="button"
                      onClick={() => void toggleAdmin(user)}
                      className="admin-small-button"
                    >
                      {user.is_admin ? "Odebrat správce" : "Udělat správcem"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void removeUser(user)}
                      className="admin-small-button text-red-700"
                    >
                      Smazat
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <NewUserModal
        open={showNew}
        onClose={() => setShowNew(false)}
        onCreated={async (createdEmail) => {
          setShowNew(false);
          setMessage(`Uživatel ${createdEmail} byl vytvořen.`);
          await load();
        }}
      />

      <PasswordModal
        user={passwordTarget}
        onClose={() => setPasswordTarget(null)}
        onDone={(changedEmail) => {
          setPasswordTarget(null);
          setMessage(`Heslo uživatele ${changedEmail} bylo změněno.`);
        }}
      />

      <OwnPasswordModal
        open={showOwnPassword}
        onClose={() => setShowOwnPassword(false)}
        onDone={() => {
          setShowOwnPassword(false);
          setMessage("Vaše heslo bylo změněno.");
        }}
      />
    </div>
  );
}

function NewUserModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (email: string) => void | Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(() => generatePassword());
  const [makeAdmin, setMakeAdmin] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setEmail("");
      setPassword(generatePassword());
      setMakeAdmin(true);
      setError("");
    }
  }, [open]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setSaving(true);
    setError("");
    const { error: createError } = await supabase.rpc("admin_create_user", {
      new_email: email,
      new_password: password,
      make_admin: makeAdmin,
    });
    setSaving(false);

    if (createError) {
      setError(rpcMessage(createError.message));
      return;
    }
    void onCreated(email);
  }

  return (
    <Modal
      open={open}
      onClose={saving ? () => {} : onClose}
      size="narrow"
      title="Nový uživatel"
      subtitle="Účet je rovnou aktivní, žádné potvrzování e-mailem."
      footer={
        <>
          <button
            type="submit"
            form="new-user-form"
            disabled={saving}
            className="btn btn-primary disabled:opacity-60"
          >
            {saving ? "Zakládám…" : "Vytvořit uživatele"}
          </button>
          <button type="button" onClick={onClose} disabled={saving} className="btn btn-ghost">
            Zrušit
          </button>
          {error && <p className="text-sm text-red-700">{error}</p>}
        </>
      }
    >
      <form id="new-user-form" onSubmit={submit} className="grid gap-5">
        <label className="block text-sm font-medium text-brand-900">
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
            className="admin-input"
          />
        </label>

        <div>
          <label className="block text-sm font-medium text-brand-900">
            Heslo
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="admin-input font-mono"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <button
              type="button"
              onClick={() => setPassword(generatePassword())}
              className="admin-small-button"
            >
              Vygenerovat nové
            </button>
            <span className="text-xs text-brand-900/45">
              Heslo si opište, po zavření okna ho už nikde nenajdete.
            </span>
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm text-brand-900">
          <input
            type="checkbox"
            checked={makeAdmin}
            onChange={(e) => setMakeAdmin(e.target.checked)}
            className="accent-[var(--brand-700)]"
          />
          Udělit práva správce
        </label>
      </form>
    </Modal>
  );
}

function PasswordModal({
  user,
  onClose,
  onDone,
}: {
  user: AdminUser | null;
  onClose: () => void;
  onDone: (email: string) => void;
}) {
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setPassword(generatePassword());
      setError("");
    }
  }, [user]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !user) return;

    setSaving(true);
    setError("");
    const { error: passwordError } = await supabase.rpc("admin_set_password", {
      target_user_id: user.user_id,
      new_password: password,
    });
    setSaving(false);

    if (passwordError) {
      setError(rpcMessage(passwordError.message));
      return;
    }
    onDone(user.email);
  }

  return (
    <Modal
      open={user !== null}
      onClose={saving ? () => {} : onClose}
      size="narrow"
      title="Změna hesla"
      subtitle={user ? `Nastavujete heslo pro ${user.email}.` : undefined}
      footer={
        <>
          <button
            type="submit"
            form="password-form"
            disabled={saving}
            className="btn btn-primary disabled:opacity-60"
          >
            {saving ? "Ukládám…" : "Nastavit heslo"}
          </button>
          <button type="button" onClick={onClose} disabled={saving} className="btn btn-ghost">
            Zrušit
          </button>
          {error && <p className="text-sm text-red-700">{error}</p>}
        </>
      }
    >
      <form id="password-form" onSubmit={submit} className="grid gap-3">
        <label className="block text-sm font-medium text-brand-900">
          Nové heslo
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="admin-input font-mono"
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setPassword(generatePassword())}
            className="admin-small-button"
          >
            Vygenerovat nové
          </button>
          <span className="text-xs text-brand-900/45">Nejméně 8 znaků.</span>
        </div>
      </form>
    </Modal>
  );
}

function OwnPasswordModal({
  open,
  onClose,
  onDone,
}: {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
}) {
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setPassword("");
      setRepeat("");
      setError("");
    }
  }, [open]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    if (password !== repeat) {
      setError("Hesla se neshodují.");
      return;
    }

    setSaving(true);
    setError("");
    // Vlastní heslo měníme přes Auth API, ať se změna projeví i v session.
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (updateError) {
      setError(`Heslo se nepodařilo změnit: ${updateError.message}`);
      return;
    }
    onDone();
  }

  return (
    <Modal
      open={open}
      onClose={saving ? () => {} : onClose}
      size="narrow"
      title="Změna vlastního hesla"
      subtitle="Po změně zůstanete přihlášeni."
      footer={
        <>
          <button
            type="submit"
            form="own-password-form"
            disabled={saving}
            className="btn btn-primary disabled:opacity-60"
          >
            {saving ? "Ukládám…" : "Změnit heslo"}
          </button>
          <button type="button" onClick={onClose} disabled={saving} className="btn btn-ghost">
            Zrušit
          </button>
          {error && <p className="text-sm text-red-700">{error}</p>}
        </>
      }
    >
      <form id="own-password-form" onSubmit={submit} className="grid gap-5">
        <label className="block text-sm font-medium text-brand-900">
          Nové heslo
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="admin-input"
          />
        </label>
        <label className="block text-sm font-medium text-brand-900">
          Nové heslo pro kontrolu
          <input
            type="password"
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="admin-input"
          />
        </label>
      </form>
    </Modal>
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
      className={`text-[0.6rem] uppercase tracking-wider rounded-full px-2.5 py-1 ${
        highlight ? "bg-brand-700 text-white" : "bg-brand-100 text-brand-700"
      }`}
    >
      {children}
    </span>
  );
}

function generatePassword() {
  // Bez znaků, které se snadno pletou při diktování (0/O, 1/l/I).
  const alphabet = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("cs-CZ", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function rpcMessage(message: string) {
  if (/Could not find the function|schema cache/i.test(message)) {
    return "Chybí databázové funkce pro správu uživatelů. Spusťte migraci supabase/migrations/20260825120000_user_management.sql.";
  }
  return message;
}
