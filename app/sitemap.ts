import type { MetadataRoute } from "next";

// Vyžaduje `output: "export"` – sitemapa se vygeneruje při buildu.
export const dynamic = "force-static";

const BASE_URL = "https://www.proplan-klima.cz";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${BASE_URL}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/sluzby/`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/reference/`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/o-nas/`, lastModified, changeFrequency: "yearly", priority: 0.7 },
    { url: `${BASE_URL}/kontakt/`, lastModified, changeFrequency: "yearly", priority: 0.7 },
  ];
}
