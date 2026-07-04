// Komentár k aktuálnemu záberu: text a/alebo audio (mnou nahovorený mp3).
// Komponent je kľúčovaný podľa id záberu (v Tour.jsx) — pri zmene scény sa
// primontuje odznova. Audio sa automaticky prehrá LEN RAZ (pri prvom vstupe do
// daného záberu); pri návrate si ho divák pustí tlačidlom v prehrávači.

import { useEffect, useRef } from 'react';

export default function CommentPanel({ comment, baseUrl, autoPlay, onPlayed, onDisable }) {
  const audioRef = useRef(null);

  const hasAudio = (comment.mode === 'audio' || comment.mode === 'both') && comment.audio;
  const hasText = (comment.mode === 'text' || comment.mode === 'both') && comment.text;

  const audioSrc = hasAudio
    ? (/^(https?:)?\/\//.test(comment.audio) || comment.audio.startsWith('/')
        ? comment.audio
        : baseUrl + comment.audio)
    : null;

  // automatické prehranie iba pri prvom vstupe do záberu (autoPlay === true)
  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [autoPlay]);

  if (!hasAudio && !hasText) return null;

  return (
    <div className="ilumi-comment">
      <button type="button" className="ilumi-comment__close" title="Vypnúť komentáre" onClick={onDisable}>
        ✕
      </button>
      {hasText && <p className="ilumi-comment__text">{comment.text}</p>}
      {hasAudio && (
        <audio
          ref={audioRef}
          className="ilumi-comment__audio"
          src={audioSrc}
          controls
          preload="auto"
          onPlay={onPlayed}
        />
      )}
    </div>
  );
}
