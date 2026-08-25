"use client";

import { useEffect, useRef } from "react";

/**
 * Modální okno postavené na nativním <dialog>. Prohlížeč tím řeší focus trap,
 * Escape i vrstvení nad zbytkem stránky za nás.
 */
export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "wide",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "wide" | "narrow";
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    // Zamkneme scroll pozadí, ať se pod otevřeným oknem nedá odrolovat.
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // Klik mimo panel (přímo na dialog = backdrop) okno zavře.
        if (e.target === dialogRef.current) onClose();
      }}
      className={`admin-modal ${size === "narrow" ? "admin-modal-narrow" : ""}`}
      aria-labelledby="admin-modal-title"
    >
      <div className="admin-modal-head">
        <div className="min-w-0">
          <h3 id="admin-modal-title" className="font-display text-2xl sm:text-3xl text-brand-900">
            {title}
          </h3>
          {subtitle && <p className="text-sm text-brand-900/60 mt-1.5">{subtitle}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Zavřít"
          className="admin-modal-close"
        >
          ×
        </button>
      </div>

      <div className="admin-modal-body">{children}</div>

      {footer && <div className="admin-modal-foot">{footer}</div>}
    </dialog>
  );
}
