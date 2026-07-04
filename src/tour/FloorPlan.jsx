// Pôdorys ako overlay s tromi režimami:
//   normal    – malý panel vpravo dole,
//   expanded  – zväčšený, vystredený, s tmavým pozadím,
//   hidden    – schovaný, ostane len malé tlačidlo na znovuotvorenie.
//
// VIEW: klik na bod = prechod do miestnosti (zo zväčšeného sa po prechode zmenší).
// EDIT: klik kamkoľvek do pôdorysu = nastaví pozíciu aktuálnej miestnosti.

import { useRef, useState } from 'react';

export default function FloorPlan({
  floorplan,
  baseUrl,
  currentNodeId,
  edit = false,
  onNavigate,
  onSetRoom,
}) {
  const imgWrapRef = useRef(null);
  const [view, setView] = useState('normal'); // 'normal' | 'expanded' | 'hidden'

  if (!floorplan?.image) return null;

  const resolved =
    /^(https?:)?\/\//.test(floorplan.image) || floorplan.image.startsWith('/')
      ? floorplan.image
      : baseUrl + floorplan.image;

  function handlePlanClick(e) {
    if (!edit || !onSetRoom) return;
    if (e.target.closest('[data-room-dot]')) return; // klik na bod neignorujeme ako "set"
    const rect = imgWrapRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    onSetRoom(currentNodeId, x, y);
  }

  function handleRoomClick(nodeId) {
    onNavigate?.(nodeId);
    if (view === 'expanded') setView('normal'); // po prechode ukáž 360°
  }

  // Skrytý stav: len tlačidlo na znovuotvorenie
  if (view === 'hidden') {
    return (
      <button type="button" className="ilumi-plan__reopen" onClick={() => setView('normal')}>
        <span className="ilumi-plan__reopen-ico" aria-hidden>⊞</span> Pôdorys
      </button>
    );
  }

  return (
    <div className={`ilumi-plan is-${view} ${edit ? 'is-edit' : ''}`}>
      {view === 'expanded' && (
        <div className="ilumi-plan__backdrop" onClick={() => setView('normal')} />
      )}

      <div className="ilumi-plan__panel">
        <div className="ilumi-plan__bar">
          <span className="ilumi-plan__bar-title">Pôdorys</span>
          <span className="ilumi-plan__bar-btns">
            {view === 'normal' ? (
              <button type="button" title="Zväčšiť" onClick={() => setView('expanded')}>⤢</button>
            ) : (
              <button type="button" title="Zmenšiť" onClick={() => setView('normal')}>⤡</button>
            )}
            {!edit && (
              <button type="button" title="Skryť" onClick={() => setView('hidden')}>✕</button>
            )}
          </span>
        </div>

        <div className="ilumi-plan__img" ref={imgWrapRef} onClick={handlePlanClick}>
          <img src={resolved} alt="Pôdorys" draggable={false} />
          {floorplan.rooms.map((room) => (
            <button
              key={room.nodeId}
              type="button"
              data-room-dot
              className={`ilumi-plan__dot ${room.nodeId === currentNodeId ? 'is-active' : ''}`}
              style={{ left: `${room.x * 100}%`, top: `${room.y * 100}%` }}
              title={room.label || room.nodeId}
              onClick={(e) => {
                e.stopPropagation();
                handleRoomClick(room.nodeId);
              }}
            >
              <span className="ilumi-plan__dot-label">{room.label || room.nodeId}</span>
            </button>
          ))}
        </div>

        {edit && (
          <p className="ilumi-plan__hint">
            Klikni do pôdorysu = umiestniš sem aktuálnu miestnosť ({currentNodeId})
          </p>
        )}
      </div>
    </div>
  );
}
