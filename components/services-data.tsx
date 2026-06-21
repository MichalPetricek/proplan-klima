import {
  IconAC,
  IconHeatPump,
  IconVent,
  IconDesign,
  IconWrench,
} from "./icons";

export const services = [
  {
    slug: "projekce",
    icon: IconDesign,
    title: "Projekce & poradenství",
    short: "Naše hlavní činnost - návrh na míru",
    featured: true,
    description:
      "Projekce TZB je srdcem toho, co děláme. Od první konzultace, přes výpočty tepelných ztrát a zisků, až po kompletní projektovou dokumentaci ve všech stupních. Navrhujeme systémy, které dávají smysl technicky, ekonomicky i architektonicky - a v ruce dostanete podklad, podle kterého se dílo dá skutečně postavit.",
    bullets: [
      "Studie, DUR, DSP i DPS v plném rozsahu",
      "Výpočet tepelných ztrát a zisků dle ČSN",
      "Návrh klimatizace, VZT, vytápění i chlazení",
      "Spolupráce s architekty a generálními projektanty",
      "Energetická optimalizace a integrace s FVE",
      "Nezávislé technické poradenství",
    ],
  },
  {
    slug: "klimatizace",
    icon: IconAC,
    title: "Klimatizace",
    short: "Tichý komfort po celý rok",
    description:
      "Návrh a instalace nástěnných, kazetových i kanálových klimatizací pro byty, rodinné domy i komerční prostory. Pracujeme s prvotřídními značkami a klademe důraz na estetiku, výkon a tichý chod.",
    bullets: [
      "Splitové i multisplitové systémy",
      "Kazetové a kanálové jednotky",
      "Chlazení i topení tepelným čerpadlem vzduch-vzduch",
    ],
  },
  {
    slug: "tepelna-cerpadla",
    icon: IconHeatPump,
    title: "Tepelná čerpadla",
    short: "Úsporné vytápění nové generace",
    description:
      "Tepelná čerpadla vzduch-voda i země-voda pro novostavby i rekonstrukce. Pomůžeme s návrhem zdroje, otopné soustavy a vyřízením dotací Nová zelená úsporám.",
    bullets: [
      "Vzduch-voda, země-voda",
      "Dotace Nová zelená úsporám",
      "Integrace s FVE a akumulací",
    ],
  },
  {
    slug: "vzduchotechnika",
    icon: IconVent,
    title: "Vzduchotechnika & rekuperace",
    short: "Čerstvý vzduch bez ztrát tepla",
    description:
      "Centrální i decentrální rekuperační jednotky pro zdravé vnitřní prostředí. Návrh, distribuce vzduchu, zaregulování i následný servis.",
    bullets: [
      "Centrální rekuperace s vysokou účinností",
      "Distribuce vzduchu skrytá v konstrukcích",
      "Tichý a energeticky úsporný provoz",
    ],
  },
  {
    slug: "realizace",
    icon: IconWrench,
    title: "Podpora při realizaci",
    short: "Projekt nezůstane jen na papíře",
    description:
      "Pomůžeme dotáhnout projekt do reality. Doporučíme prověřené montážní partnery, předáme jim kompletní dokumentaci a držíme nad realizací odborný dozor, aby provedení odpovídalo návrhu.",
    bullets: [
      "Doporučení prověřených montážních firem",
      "Předání kompletní dokumentace pro realizaci",
      "Odborný dozor nad souladem s projektem",
    ],
  },
];

export type Service = (typeof services)[number];
