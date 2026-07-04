// EDIT panel úvodnej stránky (vidíš len ty). Mení pozadie, logo, carusel,
// karty bytov a exportuje landing.json. Znovu používa štýly editora prehliadky
// (.ilumi-editor*) — pridané špecifiká sú v Landing.css.

// Ponuka fontov pre nadpisy a úvodné texty.
const FONTS = [
  { label: 'Elegantný serif (Cormorant)', value: "'Cormorant Garamond', Georgia, serif" },
  { label: 'Klasický serif (Georgia)', value: "Georgia, 'Times New Roman', serif" },
  { label: 'Moderný sans-serif', value: "system-ui, 'Segoe UI', Roboto, sans-serif" },
  { label: 'Trebuchet', value: "'Trebuchet MS', 'Segoe UI', sans-serif" },
];

// Riadok s výberom farby (color picker + hex pole). Definovaný mimo komponentu,
// nech sa pri každom prepísaní nereštartuje a input nestráca fokus.
function ColorRow({ label, value, onChange }) {
  return (
    <div className="ilumi-editor__colorrow">
      <span>{label}</span>
      <input type="color" className="ilumi-editor__color" value={value} onChange={(e) => onChange(e.target.value)} />
      <input className="ilumi-editor__hex" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export default function LandingEditor({ cfg, onChange, onExport }) {
  const set = (patch) => onChange({ ...cfg, ...patch });
  const setBrand = (patch) => onChange({ ...cfg, brand: { ...cfg.brand, ...patch } });
  const setBg = (patch) => onChange({ ...cfg, background: { ...cfg.background, ...patch } });
  const setTheme = (patch) => onChange({ ...cfg, theme: { ...cfg.theme, ...patch } });
  const setHero = (patch) => onChange({ ...cfg, hero: { ...cfg.hero, ...patch } });

  // carusel
  const updateSlide = (i, patch) =>
    set({ carousel: cfg.carousel.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });
  const removeSlide = (i) => set({ carousel: cfg.carousel.filter((_, idx) => idx !== i) });
  const addSlide = () =>
    set({ carousel: [...cfg.carousel, { id: `slide-${Date.now()}`, image: '', caption: '', tourSrc: null }] });

  // byty
  const updateApt = (i, patch) =>
    set({ apartments: cfg.apartments.map((a, idx) => (idx === i ? { ...a, ...patch } : a)) });
  const removeApt = (i) => set({ apartments: cfg.apartments.filter((_, idx) => idx !== i) });
  const addApt = () =>
    set({
      apartments: [
        ...cfg.apartments,
        { id: `byt-${Date.now()}`, title: 'Nový byt', meta: '', image: '', tourSrc: null },
      ],
    });

  return (
    <div className="ilumi-editor ilumi-editor--landing">
      <div className="ilumi-editor__title">EDIT · úvodná stránka</div>

      {/* Všeobecné */}
      <section className="ilumi-editor__sec">
        <h4>1 · Všeobecné</h4>
        <label className="ilumi-editor__lbl">Názov projektu</label>
        <input value={cfg.brand.name} onChange={(e) => setBrand({ name: e.target.value })} />
        <label className="ilumi-editor__lbl">Logo (cesta v public/)</label>
        <input placeholder="landing/logo.svg" value={cfg.brand.logo} onChange={(e) => setBrand({ logo: e.target.value })} />
        <label className="ilumi-editor__lbl">Odkaz z loga (voliteľné)</label>
        <input placeholder="https://hodzova.sk/" value={cfg.mainSiteUrl} onChange={(e) => set({ mainSiteUrl: e.target.value })} />
        <label className="ilumi-editor__lbl">Nadpis sekcie bytov</label>
        <input value={cfg.sectionTitle} onChange={(e) => set({ sectionTitle: e.target.value })} />
      </section>

      {/* Pozadie */}
      <section className="ilumi-editor__sec">
        <h4>2 · Pozadie</h4>
        <div className="ilumi-editor__row">
          <label className="ilumi-editor__radio">
            <input type="radio" checked={cfg.background.type === 'color'} onChange={() => setBg({ type: 'color' })} /> Farba
          </label>
          <label className="ilumi-editor__radio">
            <input type="radio" checked={cfg.background.type === 'image'} onChange={() => setBg({ type: 'image' })} /> Obrázok
          </label>
        </div>
        {cfg.background.type === 'color' ? (
          <div className="ilumi-editor__row">
            <input type="color" className="ilumi-editor__color" value={cfg.background.color} onChange={(e) => setBg({ color: e.target.value })} />
            <input value={cfg.background.color} onChange={(e) => setBg({ color: e.target.value })} />
          </div>
        ) : (
          <input placeholder="landing/pozadie.jpg" value={cfg.background.image} onChange={(e) => setBg({ image: e.target.value })} />
        )}
      </section>

      {/* Farby & logo */}
      <section className="ilumi-editor__sec">
        <h4>3 · Farby &amp; logo</h4>
        <div className="ilumi-editor__logosize">
          <label className="ilumi-editor__lbl">Veľkosť loga: {cfg.logoHeight}px</label>
          <input
            type="range"
            min="24"
            max="120"
            value={cfg.logoHeight}
            onChange={(e) => set({ logoHeight: Number(e.target.value) })}
          />
        </div>
        <ColorRow label="Hlavička" value={cfg.theme.headerBg} onChange={(v) => setTheme({ headerBg: v })} />
        <ColorRow label="Akcent / tlačidlá" value={cfg.theme.accent} onChange={(v) => setTheme({ accent: v })} />
        <ColorRow label="Karta – pozadie" value={cfg.theme.cardBg} onChange={(v) => setTheme({ cardBg: v })} />
        <ColorRow label="Karta – text" value={cfg.theme.cardText} onChange={(v) => setTheme({ cardText: v })} />
        <ColorRow label="Text stránky" value={cfg.theme.textColor} onChange={(v) => setTheme({ textColor: v })} />
        <label className="ilumi-editor__lbl">Font nadpisov a textov</label>
        <select value={cfg.font} onChange={(e) => set({ font: e.target.value })}>
          {FONTS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
        <p className="ilumi-editor__note">Pozadie stránky nastavíš vyššie v sekcii „Pozadie".</p>
      </section>

      {/* Úvodné texty & tlačidlo */}
      <section className="ilumi-editor__sec">
        <h4>4 · Úvodné texty &amp; tlačidlo</h4>
        <label className="ilumi-editor__lbl">Text nad sliderom</label>
        <textarea
          className="ilumi-editor__textarea"
          rows={2}
          value={cfg.hero.textAbove}
          onChange={(e) => setHero({ textAbove: e.target.value })}
        />
        <label className="ilumi-editor__lbl">Text pod sliderom</label>
        <textarea
          className="ilumi-editor__textarea"
          rows={2}
          value={cfg.hero.textBelow}
          onChange={(e) => setHero({ textBelow: e.target.value })}
        />
        <label className="ilumi-editor__lbl">Text na tlačidle (prázdne = skryté)</label>
        <input
          placeholder="360° Prehliadka"
          value={cfg.hero.buttonLabel}
          onChange={(e) => setHero({ buttonLabel: e.target.value })}
        />
        <label className="ilumi-editor__lbl">Prehliadka po kliknutí</label>
        <input
          placeholder="tours/demo/tour.json"
          value={cfg.hero.buttonTourSrc}
          onChange={(e) => setHero({ buttonTourSrc: e.target.value })}
        />
      </section>

      {/* Carusel */}
      <section className="ilumi-editor__sec">
        <h4>5 · Carusel vizualizácií</h4>
        {cfg.carousel.map((s, i) => (
          <div className="ilumi-editor__card" key={s.id}>
            <div className="ilumi-editor__card-head">
              Slide {i + 1}
              <button type="button" className="ilumi-editor__del" onClick={() => removeSlide(i)}>✕</button>
            </div>
            <input placeholder="Obrázok (landing/vizual-1.jpg)" value={s.image} onChange={(e) => updateSlide(i, { image: e.target.value })} />
            <input placeholder="Popis (voliteľné)" value={s.caption} onChange={(e) => updateSlide(i, { caption: e.target.value })} />
            <input placeholder="Prehliadka (tours/…/tour.json) – voliteľné" value={s.tourSrc || ''} onChange={(e) => updateSlide(i, { tourSrc: e.target.value || null })} />
          </div>
        ))}
        <button type="button" onClick={addSlide}>+ Pridať slide</button>
      </section>

      {/* Byty */}
      <section className="ilumi-editor__sec">
        <h4>6 · Karty bytov</h4>
        {cfg.apartments.map((a, i) => (
          <div className="ilumi-editor__card" key={a.id}>
            <div className="ilumi-editor__card-head">
              {a.title || `Byt ${i + 1}`}
              <button type="button" className="ilumi-editor__del" onClick={() => removeApt(i)}>✕</button>
            </div>
            <input placeholder="Názov (Byt 1)" value={a.title} onChange={(e) => updateApt(i, { title: e.target.value })} />
            <input placeholder="Popis (3-izbový · 78 m²)" value={a.meta} onChange={(e) => updateApt(i, { meta: e.target.value })} />
            <input placeholder="Obrázok (landing/byt-1.jpg)" value={a.image} onChange={(e) => updateApt(i, { image: e.target.value })} />
            <input placeholder="Prehliadka (tours/…/tour.json) – prázdne = Pripravujeme" value={a.tourSrc || ''} onChange={(e) => updateApt(i, { tourSrc: e.target.value || null })} />
          </div>
        ))}
        <button type="button" onClick={addApt}>+ Pridať byt</button>
      </section>

      {/* Export */}
      <section className="ilumi-editor__sec">
        <h4>7 · Export</h4>
        <button type="button" className="ilumi-editor__export" onClick={onExport}>⬇ Stiahnuť landing.json</button>
        <p className="ilumi-editor__note">
          Súbor ulož do priečinka <code>public/</code> (vedľa index.html) a urob <code>git push</code>.
          Obrázky patria do <code>public/landing/</code>.
        </p>
      </section>
    </div>
  );
}
