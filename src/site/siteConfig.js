// ──────────────────────────────────────────────────────────────────────────
//  KONFIGURÁCIA ÚVODNEJ STRÁNKY (landing) — celý projekt sa nastavuje TU.
//
//  • landingEnabled: false  → úvodná stránka sa VYPNE a appka pôjde rovno
//    do prehliadky `defaultTourSrc` (ideálne pre iný projekt bez landingu).
//  • Pre nový projekt stačí prepísať hodnoty nižšie (logo, názov, byty…).
//  • Obrázky kariet sú voliteľné — kým ich nedoplníš, zobrazí sa farebná výplň.
//    Cesty sú relatívne k priečinku `public/`.
// ──────────────────────────────────────────────────────────────────────────

// Toto sú PREDVOLENÉ hodnoty. Pri nasadení ich prebije `public/landing.json`
// (vyrobený v EDIT režime cez Export). Cesty k obrázkom sú relatívne k `public/`.

export const siteConfig = {
  // Hlavný prepínač modulu úvodnej stránky:
  landingEnabled: true,

  // Keď je landing vypnutý, appka otvorí rovno túto prehliadku:
  defaultTourSrc: 'tours/demo/tour.json',

  // Odkaz „späť na hlavnú stránku" (prázdne/null = tlačidlo sa nezobrazí):
  mainSiteUrl: 'https://google.sk/',

  brand: {
    name: '360° Prehliadka',
    logo: 'landing/logo.svg', // negatív (biele) logo do tmavej hlavičky
  },

  // Pozadie stránky: 'color' alebo 'image'.
  background: {
    type: 'color',
    color: '#f5f3ee',
    image: '', // napr. 'landing/pozadie.jpg'
  },

  // Farby jednotlivých častí + veľkosť loga (px).
  theme: {
    headerBg: '#173a5e', // hlavička
    accent: '#d8a566', // tlačidlá / akcenty
    cardBg: '#ffffff', // pozadie kariet
    cardText: '#173a5e', // text v kartách
    textColor: '#1d2733', // bežný text
  },
  logoHeight: 46,

  // Font pre nadpisy a úvodné texty:
  font: "'Cormorant Garamond', Georgia, serif",

  // Hero: text nad sliderom, pod sliderom a tlačidlo na spustenie prehliadky.
  hero: {
    textAbove: '',
    textBelow: '',
    buttonLabel: '360° Prehliadka',
    buttonTourSrc: 'tours/demo/tour.json',
  },

  // Carusel vizualizácií (voliteľné). Každý slide: obrázok + popis + prehliadka.
  carousel: [],

  // Nadpis sekcie s kartami:
  sectionTitle: '',

  // Karty bytov. `tourSrc` = prehliadka, ktorá sa otvorí po kliknutí.
  // Ak je `tourSrc: null`, karta sa zobrazí ako „Pripravujeme" (neklikateľná).
  apartments: [
    {
      id: 'byt-1',
      title: 'Byt 2.3',
      meta: '2+1 · 51,09 m²',
      image: 'landing/byt-1.jpg', // doplň neskôr (voliteľné)
      tourSrc: 'tours/demo/tour.json',
    },
    {
      id: 'byt-2',
      title: 'Byt 2',
      meta: '2-izbový · 56 m²',
      image: 'landing/byt-2.jpg',
      tourSrc: null, // ešte nemá prehliadku
    },
    {
      id: 'byt-3',
      title: 'Byt 3',
      meta: '4-izbový · 102 m²',
      image: 'landing/byt-3.jpg',
      tourSrc: null,
    },
  ],
};
