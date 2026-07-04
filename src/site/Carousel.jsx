// Carusel vizualizácií na úvodnej stránke. Prepínanie šípkami + bodkami,
// automatické posúvanie, voliteľné tlačidlo „Spustiť 360° prehliadku" na slide.

import { useEffect, useState } from 'react';

export default function Carousel({ slides, onOpenTour }) {
  const [i, setI] = useState(0);
  const n = slides.length;

  useEffect(() => {
    if (n <= 1) return undefined;
    const t = setInterval(() => setI((p) => (p + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n]);

  if (n === 0) return null;
  const idx = Math.min(i, n - 1);
  const slide = slides[idx];
  const go = (d) => setI((p) => (p + d + n) % n);

  return (
    <div className="lc">
      <div className="lc__stage">
        {slides.map((s, k) => (
          <div
            key={s.id}
            className={`lc__slide ${k === idx ? 'is-active' : ''}`}
            style={s.image ? { backgroundImage: `url(${s.image})` } : undefined}
          >
            {!s.image && <span className="lc__ph">Vizualizácia</span>}
          </div>
        ))}

        {(slide.caption || slide.tourSrc) && (
          <div className="lc__overlay">
            {slide.caption && <p className="lc__caption">{slide.caption}</p>}
            {slide.tourSrc && (
              <button type="button" className="lc__cta" onClick={() => onOpenTour(slide.tourSrc)}>
                Spustiť 360° prehliadku →
              </button>
            )}
          </div>
        )}

        {n > 1 && (
          <>
            <button type="button" className="lc__arrow lc__arrow--prev" onClick={() => go(-1)} aria-label="Predchádzajúci">‹</button>
            <button type="button" className="lc__arrow lc__arrow--next" onClick={() => go(1)} aria-label="Ďalší">›</button>
          </>
        )}
      </div>

      {n > 1 && (
        <div className="lc__dots">
          {slides.map((s, k) => (
            <button
              key={s.id}
              type="button"
              className={`lc__dot ${k === idx ? 'is-active' : ''}`}
              onClick={() => setI(k)}
              aria-label={`Slide ${k + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
