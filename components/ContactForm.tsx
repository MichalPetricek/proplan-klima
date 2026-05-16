"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    // Simulace odeslání (zde lze připojit API endpoint / e-mail službu)
    setTimeout(() => {
      setStatus("sent");
      (e.target as HTMLFormElement).reset();
    }, 800);
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Jméno a příjmení" name="name" required />
        <Field label="Telefon" name="phone" type="tel" />
      </div>
      <Field label="E-mail" name="email" type="email" required />
      <Field label="Lokalita / adresa stavby" name="location" />
      <div>
        <label className="text-sm text-brand-900 font-medium">O co máte zájem?</label>
        <select
          name="service"
          className="mt-2 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-brand-900 focus:outline-none focus:border-brand-600"
        >
          <option>Klimatizace</option>
          <option>Tepelné čerpadlo</option>
          <option>Vzduchotechnika / rekuperace</option>
          <option>Projekce a poradenství</option>
          <option>Servis</option>
          <option>Něco jiného</option>
        </select>
      </div>
      <div>
        <label className="text-sm text-brand-900 font-medium">Zpráva</label>
        <textarea
          name="message"
          rows={5}
          required
          placeholder="Popište prosím Váš záměr…"
          className="mt-2 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-brand-900 focus:outline-none focus:border-brand-600"
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-brand-900/80">
        <input type="checkbox" required className="mt-1 accent-[var(--brand-700)]" />
        <span>
          Souhlasím se zpracováním osobních údajů za účelem vyřízení mé
          poptávky.
        </span>
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn btn-primary justify-self-start disabled:opacity-60"
      >
        {status === "submitting" ? "Odesílám…" : "Odeslat poptávku"}
      </button>

      {status === "sent" && (
        <p className="text-brand-700 text-sm">
          Děkujeme — ozveme se Vám co nejdříve.
        </p>
      )}
      {status === "error" && (
        <p className="text-red-700 text-sm">
          Něco se nepovedlo. Zkuste to prosím znovu, nebo napište přímo na
          info@proplan-klima.cz.
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm text-brand-900 font-medium">
        {label}
        {required && <span className="text-brand-600"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-brand-900 focus:outline-none focus:border-brand-600"
      />
    </div>
  );
}
