// Úvodná (landing) stránka projektu — dátovo riadená (landing.json / siteConfig).
// Modulárna: App ju zobrazí len ak je `landingEnabled`. V EDIT režime vpravo
// pribudne panel na úpravu (pozadie, logo, carusel, karty) + Export.

import Carousel from './Carousel.jsx';
import LandingEditor from './LandingEditor.jsx';
import './Landing.css';

export default function Landing({ cfg, edit = false, onOpenTour, onChange, onExport }) {
  const { brand, mainSiteUrl, sectionTitle, apartments, carousel, background, theme, logoHeight, font, hero, defaultTourSrc } = cfg;

  const bg = (img) => (img ? { backgroundImage: `url(${img})` } : undefined);

  // pozadie celej stránky
  const pageStyle =
    background.type === 'image' && background.image
      ? { backgroundImage: `url(${background.image})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }
      : { background: background.color };

  // farby ako CSS premenné (prebijú predvolené z Landing.css)
  const themeVars = {
    '--navy': theme.headerBg,
    '--gold': theme.accent,
    '--card-bg': theme.cardBg,
    '--card-text': theme.cardText,
    '--ink': theme.textColor,
    '--logo-h': `${logoHeight}px`,
    '--font': font,
  };

  const heroBtnTour = hero.buttonTourSrc || defaultTourSrc;
  const hasHero = hero.textAbove || carousel.length > 0 || hero.textBelow || hero.buttonLabel;

  return (
    <div className={`landing ${edit ? 'is-edit' : ''}`} style={{ ...pageStyle, ...themeVars }}>
      {/* Hlavička: len logo na strede */}
      <header className="landing__header">
        <div className="landing__bar">
          {mainSiteUrl ? (
            <a href={mainSiteUrl} className="landing__logo" title={brand.name}>
              {brand.logo ? <img src={brand.logo} alt={brand.name} /> : <span className="landing__logo-txt">{brand.name}</span>}
            </a>
          ) : (
            <span className="landing__logo">
              {brand.logo ? <img src={brand.logo} alt={brand.name} /> : <span className="landing__logo-txt">{brand.name}</span>}
            </span>
          )}
        </div>
      </header>

      {/* Hero: text nad sliderom → slider → text pod sliderom → tlačidlo */}
      {hasHero && (
        <section className="landing__hero">
          {hero.textAbove && <p className="landing__hero-text landing__hero-text--above">{hero.textAbove}</p>}
          {carousel.length > 0 && <Carousel slides={carousel} onOpenTour={onOpenTour} />}
          {hero.textBelow && <p className="landing__hero-text landing__hero-text--below">{hero.textBelow}</p>}
          {hero.buttonLabel && (
            <div className="landing__hero-cta-wrap">
              <button type="button" className="landing__hero-cta" onClick={() => onOpenTour(heroBtnTour)}>
                {hero.buttonLabel}
              </button>
            </div>
          )}
        </section>
      )}

      {/* Karty bytov */}
      <section className="landing__byty" id="byty">
        <h1 className="landing__byty-title">{sectionTitle}</h1>
        <div className="landing__cards">
          {apartments.map((a) => {
            const clickable = Boolean(a.tourSrc);
            return (
              <article
                key={a.id}
                className={`apt-card ${clickable ? 'is-clickable' : 'is-soon'}`}
                onClick={clickable ? () => onOpenTour(a.tourSrc) : undefined}
              >
                <div className="apt-card__img" style={bg(a.image)}>
                  {!a.image && <span className="apt-card__img-ph">{a.title}</span>}
                  {clickable && <span className="apt-card__badge">360°</span>}
                </div>
                <div className="apt-card__body">
                  <h3 className="apt-card__title">{a.title}</h3>
                  {a.meta && <p className="apt-card__meta">{a.meta}</p>}
                  {clickable ? (
                    <span className="apt-card__action">Spustiť prehliadku →</span>
                  ) : (
                    <span className="apt-card__soon">Pripravujeme</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* EDIT panel */}
      {edit && <LandingEditor cfg={cfg} onChange={onChange} onExport={onExport} />}
    </div>
  );
}
