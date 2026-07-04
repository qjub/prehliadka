// EDIT panel — vidíš ho len ty (cez ?edit=1). Slúži na zostavenie prehliadky:
//  - pridať miestnosť (názov + súbor panorámy),
//  - umiestniť "flag" klikom do 360° scény (prepojí miestnosti),
//  - zmazať flag,
//  - nastaviť štartovaciu miestnosť,
//  - exportovať tour.json.

import { useState } from 'react';

export default function Editor({
  tour,
  currentNodeId,
  placingTarget,
  onAddNode,
  onStartPlacing,
  onCancelPlacing,
  onRemoveLink,
  onRemoveNode,
  onSetStart,
  onSetComment,
  onSetVariants,
  activeVariant,
  onSwitchVariant,
  onExport,
}) {
  const [newName, setNewName] = useState('');
  const [newFile, setNewFile] = useState('');
  const [linkTarget, setLinkTarget] = useState('');

  const currentNode = tour.nodes.find((n) => n.id === currentNodeId);
  const otherNodes = tour.nodes.filter((n) => n.id !== currentNodeId);

  // --- komentár aktuálneho záberu ---
  const comment = currentNode?.comment || { enabled: false, mode: 'text', audio: '', text: '' };
  const updateComment = (patch) => onSetComment(currentNodeId, { ...comment, ...patch });
  const showAudio = comment.mode === 'audio' || comment.mode === 'both';
  const showText = comment.mode === 'text' || comment.mode === 'both';

  // --- svetelné režimy ---
  const variants = tour.variants || [];
  const updateVariant = (i, patch) =>
    onSetVariants(variants.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));
  const removeVariant = (i) => onSetVariants(variants.filter((_, idx) => idx !== i));
  const addVariant = () =>
    onSetVariants([...variants, { id: `rezim-${Date.now()}`, label: 'Nový režim', suffix: '' }]);
  const addDefaultVariants = () =>
    onSetVariants([
      { id: 'den', label: 'Deň', suffix: '' },
      { id: 'svetla', label: 'Deň + svetlá', suffix: '_svetla' },
      { id: 'noc', label: 'Noc', suffix: '_noc' },
    ]);

  function addNode() {
    const name = newName.trim();
    const file = newFile.trim();
    if (!name || !file) return;
    onAddNode(name, file);
    setNewName('');
    setNewFile('');
  }

  return (
    <div className="ilumi-editor">
      <div className="ilumi-editor__title">EDIT režim</div>

      {/* --- Pridať miestnosť --- */}
      <section className="ilumi-editor__sec">
        <h4>1 · Miestnosti</h4>
        <div className="ilumi-editor__row">
          <input
            placeholder="Názov (napr. Obývačka)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            placeholder="Súbor (napr. obyvacka.jpg)"
            value={newFile}
            onChange={(e) => setNewFile(e.target.value)}
          />
          <button type="button" onClick={addNode}>+ Pridať</button>
        </div>
        <ul className="ilumi-editor__nodes">
          {tour.nodes.map((n) => (
            <li key={n.id} className={n.id === currentNodeId ? 'is-current' : ''}>
              <span className="ilumi-editor__nodename">{n.name}</span>
              <span className="ilumi-editor__nodeactions">
                {tour.startNodeId === n.id ? (
                  <em>štart</em>
                ) : (
                  <button type="button" className="ilumi-editor__link" onClick={() => onSetStart(n.id)}>
                    štart
                  </button>
                )}
                <button
                  type="button"
                  className="ilumi-editor__del"
                  title="Zmazať miestnosť"
                  disabled={tour.nodes.length <= 1}
                  onClick={() => {
                    if (window.confirm(`Zmazať miestnosť „${n.name}"? Zmažú sa aj flagy, ktoré naň vedú.`)) {
                      onRemoveNode(n.id);
                    }
                  }}
                >
                  ✕
                </button>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* --- Flagy z aktuálnej miestnosti --- */}
      <section className="ilumi-editor__sec">
        <h4>2 · Flagy z „{currentNode?.name || '—'}"</h4>

        {placingTarget ? (
          <div className="ilumi-editor__placing">
            Klikni do 360° scény na miesto, kam umiestniť flag → cieľ:{' '}
            <strong>{tour.nodes.find((n) => n.id === placingTarget)?.name}</strong>
            <button type="button" onClick={onCancelPlacing}>Zrušiť</button>
          </div>
        ) : (
          <div className="ilumi-editor__row">
            <select value={linkTarget} onChange={(e) => setLinkTarget(e.target.value)}>
              <option value="">— vyber cieľovú miestnosť —</option>
              {otherNodes.map((n) => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </select>
            <button
              type="button"
              disabled={!linkTarget}
              onClick={() => onStartPlacing(linkTarget)}
            >
              Umiestniť flag
            </button>
          </div>
        )}

        <ul className="ilumi-editor__links">
          {(currentNode?.links || []).map((l) => (
            <li key={l.nodeId}>
              → {tour.nodes.find((n) => n.id === l.nodeId)?.name || l.nodeId}
              <button type="button" onClick={() => onRemoveLink(currentNodeId, l.nodeId)}>✕</button>
            </li>
          ))}
          {currentNode?.links?.length === 0 && <li className="ilumi-editor__empty">žiadne flagy</li>}
        </ul>
      </section>

      {/* --- Komentár k aktuálnemu záberu --- */}
      <section className="ilumi-editor__sec">
        <h4>3 · Komentár k „{currentNode?.name || '—'}"</h4>
        <label className="ilumi-editor__check">
          <input
            type="checkbox"
            checked={comment.enabled}
            onChange={(e) => updateComment({ enabled: e.target.checked })}
          />
          Zapnúť komentár
        </label>

        {comment.enabled && (
          <>
            <div className="ilumi-editor__row">
              <select value={comment.mode} onChange={(e) => updateComment({ mode: e.target.value })}>
                <option value="text">Iba text</option>
                <option value="audio">Iba audio</option>
                <option value="both">Audio + text</option>
              </select>
            </div>
            {showAudio && (
              <div className="ilumi-editor__row">
                <input
                  placeholder="Audio súbor (napr. predsien.mp3)"
                  value={comment.audio}
                  onChange={(e) => updateComment({ audio: e.target.value })}
                />
              </div>
            )}
            {showText && (
              <textarea
                className="ilumi-editor__textarea"
                placeholder="Text komentára k tomuto záberu…"
                rows={3}
                value={comment.text}
                onChange={(e) => updateComment({ text: e.target.value })}
              />
            )}
            <p className="ilumi-editor__note">Audio (mp3) daj do rovnakého priečinka ako panorámy.</p>
          </>
        )}
      </section>

      {/* --- Svetelné režimy (Deň / Svetlá / Noc) --- */}
      <section className="ilumi-editor__sec">
        <h4>4 · Svetelné režimy</h4>
        {variants.length === 0 ? (
          <>
            <p className="ilumi-editor__note">
              Žiadne režimy — prehliadka má jediné osvetlenie.
            </p>
            <button type="button" onClick={addDefaultVariants}>
              + Pridať Deň / Svetlá / Noc
            </button>
          </>
        ) : (
          <>
            {variants.length > 1 && (
              <div className="ilumi-editor__variant-preview">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    className={v.id === activeVariant ? 'is-active' : ''}
                    onClick={() => onSwitchVariant(v.id)}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            )}
            <ul className="ilumi-editor__variants">
              {variants.map((v, i) => (
                <li key={v.id}>
                  <input
                    className="ilumi-editor__vlabel"
                    placeholder="Názov"
                    value={v.label}
                    onChange={(e) => updateVariant(i, { label: e.target.value })}
                  />
                  <input
                    className="ilumi-editor__vsuffix"
                    placeholder="suffix (napr. _noc)"
                    value={v.suffix}
                    onChange={(e) => updateVariant(i, { suffix: e.target.value })}
                  />
                  <button type="button" className="ilumi-editor__del" onClick={() => removeVariant(i)}>✕</button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={addVariant}>+ Pridať režim</button>
            <p className="ilumi-editor__note">
              Súbor režimu = názov panorámy + suffix. Napr. „predsien.jpg" + „_noc" → „predsien_noc.jpg".
              Prázdny suffix = pôvodný súbor.
            </p>
          </>
        )}
      </section>

      {/* --- Pôdorys --- */}
      <section className="ilumi-editor__sec">
        <h4>5 · Pôdorys</h4>
        <p className="ilumi-editor__note">
          Klikni do pôdorysu vpravo dole — umiestni sem aktuálnu miestnosť.
        </p>
      </section>

      {/* --- Export --- */}
      <section className="ilumi-editor__sec">
        <h4>6 · Export</h4>
        <button type="button" className="ilumi-editor__export" onClick={onExport}>
          ⬇ Stiahnuť tour.json
        </button>
        <p className="ilumi-editor__note">
          Súbor ulož do toho istého priečinka ako obrázky a urob <code>git push</code>.
        </p>
      </section>
    </div>
  );
}
