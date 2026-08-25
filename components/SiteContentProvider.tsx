"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { defaultContact, type SiteContact } from "@/lib/cms";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const SiteContentContext = createContext<{ contact: SiteContact }>({
  contact: defaultContact,
});

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [contact, setContact] = useState<SiteContact>(defaultContact);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    let active = true;
    supabase
      .from("site_contacts")
      .select("*")
      .eq("id", "main")
      .maybeSingle()
      .then(({ data }) => {
        if (active && data) setContact(data as SiteContact);
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => ({ contact }), [contact]);
  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
