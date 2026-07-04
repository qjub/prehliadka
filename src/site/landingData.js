// Načítanie, normalizácia a export konfigurácie úvodnej stránky (landing).
//
// Zdroj pravdy pri nasadení = `public/landing.json`. Ak neexistuje, použijú sa
// vstavané predvolené hodnoty zo `siteConfig.js`. V EDIT režime sa landing.json
// vyrobí tlačidlom Export (rovnaký princíp ako tour.json).

import { siteConfig } from './siteConfig.js';

/** Načíta landing.json; ak nie je, vráti predvolené hodnoty zo siteConfig. */
export async function loadLanding(src = 'landing.json') {
  try {
    const res = await fetch(src, { cache: 'no-cache' });
    if (res.ok) return normalizeLanding(await res.json());
  } catch {
    /* ignoruj — použijú sa predvolené hodnoty */
  }
  return normalizeLanding(siteConfig);
}

export function normalizeLanding(raw = {}) {
  return {
    landingEnabled: raw.landingEnabled !== false,
    defaultTourSrc: raw.defaultTourSrc || 'tours/demo/tour.json',
    mainSiteUrl: raw.mainSiteUrl || '',
    brand: {
      name: raw.brand?.name || 'Prehliadka',
      logo: raw.brand?.logo || '',
    },
    background: {
      type: raw.background?.type === 'image' ? 'image' : 'color',
      color: raw.background?.color || '#f5f3ee',
      image: raw.background?.image || '',
    },
    // farby jednotlivých častí + veľkosť loga
    theme: {
      headerBg: raw.theme?.headerBg || '#173a5e',
      accent: raw.theme?.accent || '#d8a566',
      cardBg: raw.theme?.cardBg || '#ffffff',
      cardText: raw.theme?.cardText || '#173a5e',
      textColor: raw.theme?.textColor || '#1d2733',
    },
    logoHeight: Number(raw.logoHeight) || 46,
    // font pre nadpisy a úvodné texty
    font: raw.font || "'Cormorant Garamond', Georgia, serif",
    // hero: text nad sliderom, text pod sliderom, tlačidlo na prehliadku
    hero: {
      textAbove: raw.hero?.textAbove || '',
      textBelow: raw.hero?.textBelow || '',
      buttonLabel: raw.hero?.buttonLabel || '',
      buttonTourSrc: raw.hero?.buttonTourSrc || '',
    },
    sectionTitle: raw.sectionTitle || 'Prehliadka bytov',
    carousel: (raw.carousel || []).map((c, i) => ({
      id: c.id || `slide-${i + 1}`,
      image: c.image || '',
      caption: c.caption || '',
      tourSrc: c.tourSrc || null,
    })),
    apartments: (raw.apartments || []).map((a, i) => ({
      id: a.id || `byt-${i + 1}`,
      title: a.title || `Byt ${i + 1}`,
      meta: a.meta || '',
      image: a.image || '',
      tourSrc: a.tourSrc || null,
    })),
  };
}

/** Čistý landing.json na stiahnutie (Export). */
export function toLandingJson(cfg) {
  const out = {
    landingEnabled: cfg.landingEnabled,
    defaultTourSrc: cfg.defaultTourSrc,
    mainSiteUrl: cfg.mainSiteUrl,
    brand: { name: cfg.brand.name, logo: cfg.brand.logo },
    background: cfg.background,
    theme: cfg.theme,
    logoHeight: cfg.logoHeight,
    font: cfg.font,
    hero: cfg.hero,
    sectionTitle: cfg.sectionTitle,
    carousel: cfg.carousel.map((c) => ({
      image: c.image,
      ...(c.caption ? { caption: c.caption } : {}),
      ...(c.tourSrc ? { tourSrc: c.tourSrc } : {}),
    })),
    apartments: cfg.apartments.map((a) => ({
      id: a.id,
      title: a.title,
      meta: a.meta,
      ...(a.image ? { image: a.image } : {}),
      tourSrc: a.tourSrc || null,
    })),
  };
  return JSON.stringify(out, null, 2);
}
