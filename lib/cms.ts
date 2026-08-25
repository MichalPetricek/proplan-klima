export type SiteContact = {
  id: "main";
  company_name: string;
  email: string;
  phone_display: string;
  phone_href: string;
  office_address: string;
  registered_address: string;
  opening_hours_weekdays: string;
  opening_hours_weekend: string;
  map_embed_url: string;
  updated_at?: string;
};

export type ReferenceItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  image_path: string | null;
  alt: string;
  size: "wide" | "standard";
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export const defaultContact: SiteContact = {
  id: "main",
  company_name: "PROPLAN Klima s.r.o.",
  email: "info@proplan-klima.cz",
  phone_display: "+420 737 830 599",
  phone_href: "+420737830599",
  office_address: "Hranická 107\n753 61 Hranice IV-Drahotuše",
  registered_address: "Trávnická 787\n753 01 Hranice",
  opening_hours_weekdays: "7:00–15:30",
  opening_hours_weekend: "zavřeno",
  map_embed_url:
    "https://www.google.com/maps?q=Hranick%C3%A1+107,+753+61+Hranice+IV-Drahotu%C5%A1e&output=embed",
};

export const defaultReferences: ReferenceItem[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    title: "Venkovní VZT jednotka",
    category: "Vzduchotechnika",
    description:
      "Rozsáhlé venkovní řešení vzduchotechniky pro průmyslový objekt. Důraz na funkční vedení tras, servisní přístup a čisté napojení technologie.",
    image_url: "/projects/industrial-air-handling.jpg",
    image_path: null,
    alt: "Venkovní vzduchotechnická jednotka u průmyslového objektu",
    size: "wide",
    featured: true,
    published: true,
    sort_order: 10,
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    title: "Kaskádová kotelna Buderus",
    category: "Vytápění",
    description:
      "Kaskádové zapojení kotlů s navazujícími rozvody a regulací. Technické řešení připravené s ohledem na spolehlivost i budoucí servis.",
    image_url: "/projects/boiler-room-detail.jpg",
    image_path: null,
    alt: "Detail technologické kotelny se třemi kotli Buderus",
    size: "standard",
    featured: true,
    published: true,
    sort_order: 20,
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    title: "Technická místnost",
    category: "Zdroj tepla",
    description:
      "Kompletní technologie zdroje tepla včetně akumulace, čerpadlových skupin a přehledně vedených rozvodů.",
    image_url: "/projects/boiler-room.jpg",
    image_path: null,
    alt: "Technická místnost s kotli Buderus, zásobníkem a rozvody",
    size: "standard",
    featured: false,
    published: true,
    sort_order: 30,
  },
];

export function publicImageUrl(url: string) {
  if (/^https?:\/\//.test(url)) return url;
  const basePath = process.env.NODE_ENV === "production" ? "/proplan-klima" : "";
  return `${basePath}${url.startsWith("/") ? url : `/${url}`}`;
}
