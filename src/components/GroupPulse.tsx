import React, { useEffect, useState } from 'react';
import { PEOPLE, DIMENSIONS } from '../data/mbti';
import type { Person, Dimension } from '../data/mbti';

// ─── Types & helpers ──────────────────────────────────────────────────────────

interface DivRow {
  dim: Dimension;
  sorted: Person[];   // active people, ascending by dimension value
  spread: number;     // max − min (0–100)
}

const buildRows = (activePeople: Person[]): DivRow[] =>
  DIMENSIONS.map(dim => {
    const sorted = [...activePeople].sort(
      (a, b) => a.dimensions[dim.key] - b.dimensions[dim.key]
    );
    const spread =
      sorted.length < 2
        ? 0
        : sorted[sorted.length - 1].dimensions[dim.key] - sorted[0].dimensions[dim.key];
    return { dim, sorted, spread };
  }).sort((a, b) => b.spread - a.spread); // most divergent first

const spreadColor = (spread: number) => {
  if (spread >= 40) return '#F87171'; // red
  if (spread >= 20) return '#FBBF24'; // amber
  return '#34D399';                   // green
};

const spreadLabel = (spread: number) => {
  if (spread >= 40) return { text: '高度分歧', color: '#EF4444', bg: '#FEF2F2' };
  if (spread >= 20) return { text: '中度差異', color: '#D97706', bg: '#FFFBEB' };
  return { text: '高度共識', color: '#059669', bg: '#ECFDF5' };
};

// ─── Component ───────────────────────────────────────────────────────────────

interface GroupPulseProps {
  activePeopleIds: string[];
}

export const GroupPulse: React.FC<GroupPulseProps> = ({ activePeopleIds }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(t);
  }, []);

  const activePeople = PEOPLE.filter(p => activePeopleIds.includes(p.id));

  return (
    <div>
      {/* Header */}
      <div className="flex items-baseline gap-2 mb-1">
        <h2 className="text-base font-semibold text-gray-900">Group Pulse</h2>
        <span className="text-xs text-gray-400">/ 共識地圖</span>
      </div>
      <p className="text-xs text-gray-400 mb-5">
        依分歧程度排列 — 從最不一致到最一致
      </p>

      {activePeople.length < 2 ? (
        <div
          className="rounded-2xl px-6 py-10 text-center text-sm text-gray-400"
          style={{ backgroundColor: '#ffffff', border: '1px solid #EEECEA' }}
        >
          選擇至少兩位人物以查看共識地圖
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #EEECEA',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.03)',
          }}
        >
          {buildRows(activePeople).map((row, rowIdx, allRows) => {
            const { dim, sorted, spread } = row;
            const isFirst = rowIdx === 0;
            const isLast = rowIdx === allRows.length - 1;
            const minPerson = sorted[0];
            const maxPerson = sorted[sorted.length - 1];
            const minVal = minPerson.dimensions[dim.key];
            const maxVal = maxPerson.dimensions[dim.key];
            const tag = spreadLabel(spread);

            return (
              <div
                key={dim.key}
                className="px-5 sm:px-7 py-5 group"
                style={{ borderTop: rowIdx === 0 ? 'none' : '1px solid #F5F4F1' }}
              >
                {/* Row header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
                      {dim.name}
                    </span>
                    <span className="text-[10px] text-gray-300 font-medium">/ {dim.chineseName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(isFirst || isLast) && (
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ color: tag.color, backgroundColor: tag.bg }}
                      >
                        {isFirst ? '最分歧' : '最一致'}
                      </span>
                    )}
                    <span
                      className="text-[11px] font-semibold tabular-nums"
                      style={{ color: spreadColor(spread) }}
                    >
                      差距 {spread}
                    </span>
                  </div>
                </div>

                {/* Left / right trait labels */}
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-medium text-gray-400">{dim.leftLabel}</span>
                  <span className="text-xs font-medium text-gray-400">{dim.rightLabel}</span>
                </div>

                {/* Track zone */}
                <div className="relative" style={{ height: '26px' }}>
                  {/* Base track */}
                  <div
                    className="absolute left-0 right-0 rounded-full"
                    style={{ top: '50%', height: '2px', transform: 'translateY(-50%)', backgroundColor: '#EEECEA' }}
                  />

                  {/* Range zone — gradient span between min and max person */}
                  <div
                    className="absolute rounded-full"
                    style={{
                      top: '50%',
                      height: '8px',
                      transform: 'translateY(-50%)',
                      left: `${minVal}%`,
                      width: mounted ? `${Math.max(maxVal - minVal, 0)}%` : '0%',
                      background: `linear-gradient(to right, ${minPerson.color}30, ${maxPerson.color}30)`,
                      transition: 'width 0.7s cubic-bezier(0.4,0,0.2,1)',
                      borderRadius: '99px',
                    }}
                  />

                  {/* Min / max endpoint ticks */}
                  {mounted && [minVal, maxVal].map((v, vi) => (
                    <div
                      key={vi}
                      className="absolute rounded-full"
                      style={{
                        left: `${v}%`,
                        top: '50%',
                        width: '1px',
                        height: '12px',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: vi === 0 ? `${minPerson.color}70` : `${maxPerson.color}70`,
                      }}
                    />
                  ))}

                  {/* Markers — all PEOPLE in DOM for smooth toggle */}
                  {PEOPLE.map((person, pIdx) => {
                    const isActive = activePeopleIds.includes(person.id);
                    const value = person.dimensions[dim.key];
                    return (
                      <div
                        key={person.id}
                        className="absolute"
                        style={{
                          left: `${value}%`,
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          opacity: isActive && mounted ? 1 : 0,
                          scale: isActive && mounted ? '1' : '0.3',
                          transition: `opacity 0.28s ease ${rowIdx * 60 + pIdx * 45}ms, scale 0.32s cubic-bezier(0.34,1.56,0.64,1) ${rowIdx * 60 + pIdx * 45}ms`,
                          zIndex: isActive ? 10 : 0,
                          pointerEvents: isActive ? 'auto' : 'none',
                        }}
                      >
                        <div className="relative group/marker">
                          <div
                            className="w-3 h-3 rounded-full border-2 border-white shadow-sm transition-transform duration-150 group-hover/marker:scale-125 cursor-default"
                            style={{ backgroundColor: person.color }}
                          />
                          {/* Tooltip */}
                          <div
                            className="absolute z-20 pointer-events-none opacity-0 group-hover/marker:opacity-100 transition-opacity duration-150 whitespace-nowrap"
                            style={{
                              bottom: '20px',
                              left: value < 15 ? '0' : value > 85 ? 'auto' : '50%',
                              right: value > 85 ? '0' : 'auto',
                              transform: value < 15 || value > 85 ? 'none' : 'translateX(-50%)',
                            }}
                          >
                            <span
                              className="text-white text-xs font-medium px-2 py-1 rounded-lg shadow-lg block"
                              style={{ backgroundColor: person.color }}
                            >
                              {person.name} · {value}%
                            </span>
                            <span className="block w-2 h-2 rotate-45 mx-auto -mt-1" style={{ backgroundColor: person.color }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Person chips — sorted ascending */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {sorted.map(person => (
                    <span
                      key={person.id}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ color: person.color, backgroundColor: person.colorLight }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: person.color }} />
                      {person.name} · {person.dimensions[dim.key]}%
                    </span>
                  ))}
                </div>

                {/* Divergence index bar */}
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[10px] text-gray-400 w-12 flex-shrink-0">分歧指數</span>
                  <div className="flex-1 h-[3px] rounded-full" style={{ backgroundColor: '#F0EEEB' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: mounted ? `${spread}%` : '0%',
                        backgroundColor: spreadColor(spread),
                        transitionDelay: `${rowIdx * 80}ms`,
                      }}
                    />
                  </div>
                  <span
                    className="text-[10px] font-semibold tabular-nums w-6 text-right flex-shrink-0"
                    style={{ color: spreadColor(spread) }}
                  >
                    {spread}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
