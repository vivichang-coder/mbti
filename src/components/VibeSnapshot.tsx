import React, { useEffect, useState } from 'react';
import { Person, PEOPLE } from '../data/mbti';
import type { DimensionKey } from '../data/mbti';

// ─── Config ──────────────────────────────────────────────────────────────────

const DIMS = [
  { key: 'energy'   as DimensionKey, name: '能量', left: '內向', right: '外向' },
  { key: 'mind'     as DimensionKey, name: '心智', left: '務實', right: '直覺' },
  { key: 'nature'   as DimensionKey, name: '本性', left: '理性', right: '感性' },
  { key: 'tactics'  as DimensionKey, name: '應對', left: '計劃', right: '靈活' },
  { key: 'identity' as DimensionKey, name: '身分', left: '波動', right: '果斷' },
];

// ─── Canvas download (light mode) ────────────────────────────────────────────

const canvasRoundRect = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) => {
  const s = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + s, y);
  ctx.lineTo(x + w - s, y);
  ctx.arc(x + w - s, y + s, s, -Math.PI / 2, 0);
  ctx.lineTo(x + w, y + h - s);
  ctx.arc(x + w - s, y + h - s, s, 0, Math.PI / 2);
  ctx.lineTo(x + s, y + h);
  ctx.arc(x + s, y + h - s, s, Math.PI / 2, Math.PI);
  ctx.lineTo(x, y + s);
  ctx.arc(x + s, y + s, s, Math.PI, -Math.PI / 2);
  ctx.closePath();
};

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

const downloadCard = async (person: Person) => {
  await document.fonts.ready;
  const DPR = 2;
  const W = 480, H = 600;
  const canvas = document.createElement('canvas');
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(DPR, DPR);

  // White background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, W, H);

  // Subtle radial glow
  const grd = ctx.createRadialGradient(W * 0.85, H * 0.12, 0, W * 0.85, H * 0.12, W * 0.7);
  grd.addColorStop(0, hexToRgba(person.color, 0.08));
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);

  // Top color bar
  ctx.fillStyle = person.color;
  ctx.fillRect(0, 0, W, 3);

  // Large faded MBTI type (decoration)
  ctx.font = `bold 96px Inter, -apple-system, sans-serif`;
  ctx.fillStyle = hexToRgba(person.color, 0.05);
  ctx.textAlign = 'right';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(person.mbtiType.split('-')[0], W - 28, 165);

  // Name
  ctx.font = `600 30px Inter, -apple-system, sans-serif`;
  ctx.fillStyle = '#111111';
  ctx.textAlign = 'left';
  ctx.fillText(person.name, 40, 200);

  // MBTI type
  ctx.font = `600 13px Inter, -apple-system, sans-serif`;
  ctx.fillStyle = person.color;
  ctx.fillText(person.mbtiType, 40, 224);

  // Role
  ctx.font = `400 12px Inter, -apple-system, sans-serif`;
  ctx.fillStyle = '#9CA3AF';
  ctx.fillText(`${person.mbtiRole} · ${person.mbtiRoleChinese}`, 40, 244);

  // Vibe
  ctx.font = `400 11px Inter, -apple-system, sans-serif`;
  ctx.fillStyle = '#C4C2BE';
  ctx.fillText(person.vibe, 40, 264);

  // Separator
  ctx.strokeStyle = 'rgba(0,0,0,0.07)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 282);
  ctx.lineTo(W - 40, 282);
  ctx.stroke();

  // Dimensions
  const BAR_X = 40, BAR_W = W - 80;
  DIMS.forEach((dim, i) => {
    const base = 298 + i * 50;
    const value = person.dimensions[dim.key];

    // Dim name · value% together
    ctx.font = `600 11px Inter, -apple-system, sans-serif`;
    ctx.fillStyle = person.color;
    ctx.textAlign = 'left';
    ctx.fillText(`${dim.name} · ${value}%`, BAR_X, base + 12);

    // Left/right trait labels
    ctx.font = `400 9px Inter, -apple-system, sans-serif`;
    ctx.fillStyle = '#C4C2BE';
    ctx.textAlign = 'left';
    ctx.fillText(dim.left, BAR_X, base + 28);
    ctx.textAlign = 'right';
    ctx.fillText(dim.right, W - BAR_X, base + 28);

    // Track
    ctx.fillStyle = 'rgba(0,0,0,0.07)';
    canvasRoundRect(ctx, BAR_X, base + 34, BAR_W, 3, 1.5);
    ctx.fill();

    // Fill
    const fillW = (value / 100) * BAR_W;
    ctx.fillStyle = person.color;
    canvasRoundRect(ctx, BAR_X, base + 34, fillW, 3, 1.5);
    ctx.fill();

    // Dot
    ctx.beginPath();
    ctx.arc(BAR_X + fillW, base + 35.5, 5, 0, Math.PI * 2);
    ctx.fillStyle = person.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // Footer
  ctx.font = `400 9px Inter, -apple-system, sans-serif`;
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.textAlign = 'center';
  ctx.fillText('MBTI Personality Dashboard', W / 2, H - 18);

  canvas.toBlob(blob => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${person.name.toLowerCase()}-vibe-snapshot.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
};

// ─── Modal ───────────────────────────────────────────────────────────────────

interface VibeSnapshotProps {
  person: Person;
  onClose: () => void;
}

export const VibeSnapshot: React.FC<VibeSnapshotProps> = ({ person, onClose }) => {
  const [revealed, setRevealed] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 180);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    await downloadCard(person);
    setTimeout(() => setDownloading(false), 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xs sm:max-w-sm"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'cardAppear 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-9 right-0 text-xs text-white opacity-60 hover:opacity-100 transition-opacity"
        >
          ✕ 關閉
        </button>

        {/* Card — light mode */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: '0 24px 64px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.08)',
            border: `1px solid ${person.color}22`,
          }}
        >
          {/* Color accent bar */}
          <div style={{ height: '3px', backgroundColor: person.color }} />

          <div className="px-7 pt-6 pb-7 relative overflow-hidden">
            {/* Background MBTI text (very faint on white) */}
            <div
              className="absolute top-2 right-4 font-bold select-none pointer-events-none leading-none"
              style={{ fontSize: '88px', color: person.color, opacity: 0.05, fontFamily: 'Inter, sans-serif' }}
            >
              {person.mbtiType.split('-')[0]}
            </div>

            {/* Name + type */}
            <div className="relative mb-5">
              <h2 className="text-[26px] font-semibold leading-tight text-gray-900">
                {person.name}
              </h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[13px] font-semibold" style={{ color: person.color }}>
                  {person.mbtiType}
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-[12px] text-gray-400">{person.mbtiRole}</span>
              </div>
              <p className="mt-2 text-[11px] text-gray-400 leading-relaxed">{person.vibe}</p>
            </div>

            {/* Separator */}
            <div className="mb-5 h-px bg-gray-100" />

            {/* Dimension bars */}
            <div className="space-y-[18px]">
              {DIMS.map((dim, i) => {
                const value = person.dimensions[dim.key];
                return (
                  <div key={dim.key}>
                    {/* Dim name · value% on the same line */}
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-[12px] font-semibold" style={{ color: person.color }}>
                        {dim.name}
                        <span className="font-normal opacity-50 mx-1">·</span>
                        {value}%
                      </span>
                    </div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[10px] text-gray-400">{dim.left}</span>
                      <span className="text-[10px] text-gray-400">{dim.right}</span>
                    </div>
                    {/* Track */}
                    <div className="relative h-[3px] rounded-full bg-gray-100">
                      {/* Fill */}
                      <div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                          backgroundColor: person.color,
                          width: revealed ? `${value}%` : '0%',
                          transition: `width 0.75s cubic-bezier(0.4,0,0.2,1) ${i * 110}ms`,
                        }}
                      />
                      {/* Dot */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm"
                        style={{
                          backgroundColor: person.color,
                          left: revealed ? `${value}%` : '0%',
                          transition: `left 0.75s cubic-bezier(0.4,0,0.2,1) ${i * 110}ms`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Card footer */}
            <p className="mt-6 text-center text-[10px] text-gray-300">
              MBTI Personality Dashboard
            </p>
          </div>
        </div>

        {/* Download */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full mt-3 py-3 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-[0.98]"
          style={{
            backgroundColor: downloading ? 'rgba(255,255,255,0.15)' : person.color,
            color: downloading ? 'rgba(255,255,255,0.5)' : 'white',
          }}
        >
          {downloading ? '生成中…' : '下載人格快照 ↓'}
        </button>
      </div>

      <style>{`
        @keyframes cardAppear {
          from { opacity: 0; transform: scale(0.93) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </div>
  );
};
