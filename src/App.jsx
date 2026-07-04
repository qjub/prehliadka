// Koreň appky = prepínač medzi úvodnou stránkou a prehliadkou.
//
//   • landing zapnutý + žiadny ?tour  → Landing (úvodná stránka)
//   • klik na kartu / ?tour=<cesta>    → Tour (prehliadka)
//   • landing vypnutý                  → rovno Tour (defaultTourSrc)
//
// Konfigurácia landingu sa načíta z public/landing.json (fallback = siteConfig).
// Stav (?tour, ?edit) držíme v URL — funguje refresh, späť aj zdieľanie.
import { useEffect, useState } from 'react';
import Tour from './tour/Tour.jsx';
import Landing from './site/Landing.jsx';
import { loadLanding, toLandingJson } from './site/landingData.js';
import './App.css';

function readParams() {
  const p = new URLSearchParams(window.location.search);
  return { edit: p.get('edit') === '1', tour: p.get('tour') };
}

function download(filename, text) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [{ edit, tour }, setNav] = useState(readParams());
  const [landing, setLanding] = useState(null);

  useEffect(() => {
    loadLanding().then(setLanding);
  }, []);

  useEffect(() => {
    const onPop = () => setNav(readParams());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  function openTour(src) {
    const u = new URL(window.location.href);
    u.searchParams.set('tour', src);
    window.history.pushState(null, '', u);
    setNav(readParams());
    window.scrollTo(0, 0);
  }

  function backToLanding() {
    const u = new URL(window.location.href);
    u.searchParams.delete('tour');
    u.searchParams.delete('edit');
    window.history.pushState(null, '', u);
    setNav(readParams());
  }

  function toggleEdit() {
    const u = new URL(window.location.href);
    if (edit) u.searchParams.delete('edit');
    else u.searchParams.set('edit', '1');
    window.history.replaceState(null, '', u);
    setNav(readParams());
  }

  if (!landing) return null; // krátke načítanie configu

  const activeTour = tour || (!landing.landingEnabled ? landing.defaultTourSrc : null);

  if (activeTour) {
    return (
      <div className="app-tour">
        <Tour src={activeTour} edit={edit} />
        <div className="app-topbar">
          {landing.landingEnabled && (
            <button type="button" className="app-pill" onClick={backToLanding}>← Späť na byty</button>
          )}
          {(import.meta.env.DEV || edit) && (
            <button type="button" className="app-pill" onClick={toggleEdit}>
              {edit ? 'Zavrieť editor' : 'EDIT'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Landing
        cfg={landing}
        edit={edit}
        onOpenTour={openTour}
        onChange={setLanding}
        onExport={() => download('landing.json', toLandingJson(landing))}
      />
      {(import.meta.env.DEV || edit) && (
        <button type="button" className="app-fab" onClick={toggleEdit}>
          {edit ? 'Zavrieť editor' : 'EDIT stránky'}
        </button>
      )}
    </>
  );
}
