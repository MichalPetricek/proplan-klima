"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { asset } from "@/lib/paths";

const links = [
  { href: "/", label: "Úvod" },
  { href: "/sluzby", label: "Služby" },
  { href: "/o-nas", label: "O nás" },
  { href: "/reference", label: "Reference" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`nav-shell fixed top-0 inset-x-0 z-50 border-b border-transparent ${
        scrolled ? "nav-shell--scrolled" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center group -ml-1" aria-label="Proplan Klima">
          <Image
            src={asset("/logo.png")}
            alt="Proplan Klima"
            width={1500}
            height={1000}
            priority
            unoptimized
            className="h-16 w-auto"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm transition-colors relative py-2 ${
                  active ? "text-brand-900 font-medium" : "text-brand-900/70 hover:text-brand-900"
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-brand-800" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a href="tel:+420737830599" className="text-sm text-brand-800 font-medium">
            +420 737 830 599
          </a>
          <Link href="/kontakt" className="btn btn-primary text-sm py-2.5 px-5">
            Nezávazná poptávka
          </Link>
        </div>

        <button
          aria-label="Otevřít menu"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden w-11 h-11 grid place-items-center rounded-full border border-brand-300 text-brand-900"
        >
          <span className="sr-only">Menu</span>
          <div className="space-y-1.5">
            <span
              className={`block h-px w-5 bg-current transition ${
                open ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-5 bg-current transition ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px w-5 bg-current transition ${
                open ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height] duration-500 ease-out ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-6 pb-6 pt-2 bg-[var(--brand-50)] border-t border-[var(--border)]">
          <nav className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 text-brand-900 border-b border-[var(--border)] last:border-0"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/kontakt"
            onClick={() => setOpen(false)}
            className="btn btn-primary w-full mt-4"
          >
            Nezávazná poptávka
          </Link>
        </div>
      </div>
    </header>
  );
}
