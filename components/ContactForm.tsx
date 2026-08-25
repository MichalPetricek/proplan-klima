"use client";

import emailjs from "@emailjs/browser";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Status = "idle" | "submitting" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Jednoduchý honeypot pro automatizované roboty.
    if (formData.get("company")) {
      setStatus("sent");
      form.reset();
      return;
    }

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    setStatus("submitting");
    setErrorMessage("");

    const sentAt = form.elements.namedItem("sent_at");
    if (sentAt instanceof HTMLInputElement) {
      sentAt.value = new Date().toLocaleString("cs-CZ", {
        dateStyle: "long",
        timeStyle: "short",
      });
    }

    // Poptávka se ukládá jako první. Kdyby EmailJS selhal nebo vyčerpal limit,
    // zůstane zaznamenaná v administraci a nepřijdeme o ni.
    let stored = false;
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      const { error: storeError } = await supabase
        .from("contact_submissions")
        .insert({
          from_name: String(formData.get("from_name") ?? ""),
          reply_to: String(formData.get("reply_to") ?? ""),
          phone: String(formData.get("phone") ?? ""),
          location: String(formData.get("location") ?? ""),
          service: String(formData.get("service") ?? ""),
          message: String(formData.get("message") ?? ""),
        });
      stored = !storeError;
    }

    let emailed = false;
    if (serviceId && templateId && publicKey) {
      try {
        await emailjs.sendForm(serviceId, templateId, form, {
          publicKey,
          blockHeadless: true,
          limitRate: {
            id: "proplan-contact-form",
            throttle: 10_000,
          },
        });
        emailed = true;
      } catch {
        emailed = false;
      }
    }

    if (emailed || stored) {
      // Poptávku máme zachycenou aspoň jedním kanálem – pro odesílatele je to
      // úspěch, o interní doručení se postaráme my.
      setStatus("sent");
      form.reset();
      return;
    }

    setErrorMessage(
      "Zprávu se nepodařilo odeslat. Zkuste to prosím znovu, nebo nám napište přímo na info@proplan-klima.cz.",
    );
    setStatus("error");
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Jméno a příjmení" name="from_name" required />
        <Field label="Telefon" name="phone" type="tel" />
      </div>
      <Field label="E-mail" name="reply_to" type="email" required />
      <Field label="Lokalita / adresa stavby" name="location" />
      <div>
        <label htmlFor="service" className="text-sm text-brand-900 font-medium">
          O co máte zájem?
        </label>
        <select
          id="service"
          name="service"
          className="mt-2 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-brand-900 focus:outline-none focus:border-brand-600"
        >
          <option>Klimatizace</option>
          <option>Tepelné čerpadlo</option>
          <option>Vzduchotechnika / rekuperace</option>
          <option>Projekce a poradenství</option>
          <option>Něco jiného</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="text-sm text-brand-900 font-medium">
          Zpráva
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Popište prosím Váš záměr…"
          className="mt-2 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-brand-900 focus:outline-none focus:border-brand-600"
        />
      </div>

      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="company">Firma</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="sent_at" defaultValue="" />

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

      <p aria-live="polite" className="text-sm min-h-5">
        {status === "sent" && (
          <span className="text-brand-700">
            Děkujeme – zpráva byla odeslána. Ozveme se Vám co nejdříve.
          </span>
        )}
        {status === "error" && (
          <span className="text-red-700">{errorMessage}</span>
        )}
      </p>
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
