"use client";

import { useEffect, useMemo, useState } from "react";
import {
  defaultReferences,
  publicImageUrl,
  type ReferenceItem,
} from "@/lib/cms";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function usePublicReferences() {
  const [references, setReferences] =
    useState<ReferenceItem[]>(defaultReferences);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    let active = true;
    supabase
      .from("references")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (active && !error) setReferences((data ?? []) as ReferenceItem[]);
      });

    return () => {
      active = false;
    };
  }, []);

  return references;
}

export function ReferenceGallery() {
  const references = usePublicReferences();

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {references.length === 0 && (
        <div className="card card-flat lg:col-span-2 p-8 text-center text-brand-900/65">
          Nové reference právě připravujeme.
        </div>
      )}
      {references.map((project, i) => (
        <article
          key={project.id}
          className={`card overflow-hidden reveal ${project.size === "wide" ? "lg:col-span-2 lg:grid lg:grid-cols-[1.45fr_0.55fr]" : ""}`}
          data-delay={i * 80}
        >
          <div
            className={`relative overflow-hidden bg-brand-100 ${project.size === "wide" ? "aspect-[16/9] lg:aspect-auto lg:min-h-[480px]" : "aspect-[4/3]"}`}
          >
            {/* Dynamický hostname Supabase projektu nelze bezpečně zapsat do next/image při buildu. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={publicImageUrl(project.image_url)}
              alt={project.alt}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.025]"
            />
          </div>
          <div
            className={`p-7 sm:p-9 ${project.size === "wide" ? "lg:flex lg:flex-col lg:justify-end lg:bg-brand-900 lg:text-white" : ""}`}
          >
            <p
              className={`text-[0.65rem] uppercase tracking-[0.22em] font-semibold ${project.size === "wide" ? "lg:text-brand-300 text-brand-600" : "text-brand-600"}`}
            >
              {project.category}
            </p>
            <h3
              className={`font-display text-3xl mt-2 ${project.size === "wide" ? "lg:text-white text-brand-900" : "text-brand-900"}`}
            >
              {project.title}
            </h3>
            <p
              className={`mt-4 leading-relaxed ${project.size === "wide" ? "lg:text-white/72 text-brand-900/72" : "text-brand-900/72"}`}
            >
              {project.description}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ReferenceHighlights() {
  const references = usePublicReferences();
  const highlights = useMemo(() => {
    const featured = references.filter((item) => item.featured);
    const others = references.filter((item) => !item.featured);
    return [...featured, ...others].slice(0, 2);
  }, [references]);

  return (
    <div className="grid lg:grid-cols-12 gap-5">
      {highlights.map((project, index) => (
        <article
          key={project.id}
          className={`media group min-h-[420px] reveal ${index === 0 ? "lg:col-span-7" : "lg:col-span-5"}`}
          data-delay={index * 100}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={publicImageUrl(project.image_url)}
            alt={project.alt}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="project-scrim" />
          <div className="project-caption">
            <p>{project.category}</p>
            <h3>{project.title}</h3>
          </div>
        </article>
      ))}
    </div>
  );
}
