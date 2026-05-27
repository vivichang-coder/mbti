import React, { useState } from 'react';
import { Person, PEOPLE } from '../data/mbti';
import type { DimensionKey } from '../data/mbti';

// ─── Geometry ─────────────────────────────────────────────────────────────────

const CX = 150, CY = 152, MAX_R = 108;
const N = 5;

const DIM_ORDER: { key: DimensionKey; label: string }[] = [
  { key: 'energy',   label: '能量' },
  { key: 'mind',     label: '心智' },
  { key: 'nature',   label: '本性' },
  { key: 'tactics',  label: '應對' },
  { key: 'identity', label: '身分' },
];

// Angles: start at top (−90°), go clockwise
const angles = DIM_ORDER.map((_, i) => -Math.PI / 2 + (2 * Math.PI * i) / N);

const polar = (r: number, angle: number) => ({
  x: CX + r * Math.cos(angle),
  y: CY + r * Math.sin(angle),
});

const toPoints = (pts: { x: number; y: number }[]) =>
  pts.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');

const personPolygon = (person: Person) =>
  toPoints(DIM_ORDER.map(({ key }, i) => polar((person.dimensions[key] / 100) * MAX_R, angles[i])));

const gridPolygon = (scale: number) =>
  toPoints(angles.map(a => polar(scale * MAX_R, a)));

// ─── Component ───────────────────────────────────────────────────────────────

interface RadarChartProps {
  activePeopleIds: string[];
}

export const RadarChart: React.FC<RadarChartProps> = ({ activePeopleIds }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const activePeople = PEOPLE.filter(p => activePeopleIds.includes(p.id));

  if (activePeople.length === 0) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-baseline gap-2 mb-5">
        <h2 className="text-base font-semibold text-gray-900">Shape of You</h2>
        <span className="text-xs text-gray-400">/ 人格輪廓圖</span>
      </div>

      <div
        className="rounded-2xl border"
        style={{
          backgroundColor: '#ffffff',
          borderColor: '#EEECEA',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.03)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 p-5 sm:p-7">

          {/* SVG Radar */}
          <div className="flex-shrink-0">
            <svg
              viewBox="0 0 300 304"
              width="260"
              height="264"
              className="overflow-visible"
            >
              {/* Background grid rings */}
              {[0.25, 0.5, 0.75, 1].map(s => (
                <polygon
                  key={s}
                  points={gridPolygon(s)}
                  fill="none"
                  stroke={s === 1 ? '#DDDBD8' : '#EEECEA'}
                  strokeWidth={s === 1 ? 1.5 : 1}
                />
              ))}

              {/* Axis lines */}
              {angles.map((angle, i) => {
                const tip = polar(MAX_R, angle);
                return (
                  <line
                    key={i}
                    x1={CX} y1={CY}
                    x2={tip.x.toFixed(2)} y2={tip.y.toFixed(2)}
                    stroke="#E5E3DF"
                    strokeWidth="1"
                  />
                );
              })}

              {/* 50% ring label */}
              {(() => {
                const p = polar(MAX_R * 0.5, -Math.PI / 2 - 0.18);
                return (
                  <text x={p.x} y={p.y} fontSize="8" fill="#C4C2BE" textAnchor="middle" fontFamily="Inter, sans-serif">
                    50
                  </text>
                );
              })()}

              {/* Person polygons — rendered back-to-front */}
              {activePeople.map(person => {
                const isHov = hoveredId === person.id;
                const otherHov = hoveredId !== null && !isHov;
                return (
                  <polygon
                    key={person.id}
                    points={personPolygon(person)}
                    fill={person.color}
                    fillOpacity={isHov ? 0.22 : otherHov ? 0.05 : 0.1}
                    stroke={person.color}
                    strokeWidth={isHov ? 2 : 1.5}
                    strokeOpacity={isHov ? 0.9 : otherHov ? 0.2 : 0.6}
                    strokeLinejoin="round"
                    style={{ transition: 'fill-opacity 0.18s ease, stroke-opacity 0.18s ease', cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredId(person.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onTouchStart={() => setHoveredId(hoveredId === person.id ? null : person.id)}
                  />
                );
              })}

              {/* Vertex dots for hovered person */}
              {hoveredId && (() => {
                const p = PEOPLE.find(p => p.id === hoveredId);
                if (!p) return null;
                return DIM_ORDER.map(({ key }, i) => {
                  const pt = polar((p.dimensions[key] / 100) * MAX_R, angles[i]);
                  return (
                    <circle
                      key={key}
                      cx={pt.x.toFixed(2)} cy={pt.y.toFixed(2)}
                      r="3.5"
                      fill={p.color}
                      stroke="white"
                      strokeWidth="1.5"
                      style={{ pointerEvents: 'none' }}
                    />
                  );
                });
              })()}

              {/* Axis labels */}
              {angles.map((angle, i) => {
                const labelR = MAX_R + 21;
                const pos = polar(labelR, angle);
                const anchor =
                  pos.x < CX - 8 ? 'end' : pos.x > CX + 8 ? 'start' : 'middle';
                const baseline =
                  pos.y < CY - 8 ? 'auto' : pos.y > CY + 8 ? 'hanging' : 'middle';
                return (
                  <text
                    key={i}
                    x={pos.x.toFixed(2)}
                    y={pos.y.toFixed(2)}
                    textAnchor={anchor}
                    dominantBaseline={baseline}
                    fontSize="10"
                    fill="#9CA3AF"
                    fontFamily="Inter, system-ui, sans-serif"
                    fontWeight="500"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {DIM_ORDER[i].label}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex-1 w-full sm:pt-2 pl-0 sm:pl-3 min-w-0">
            <p className="text-[11px] text-gray-400 mb-3 hidden sm:block">
              Hover 輪廓可聚焦單一人格
            </p>
            <div className="flex flex-row sm:flex-col flex-wrap gap-2 sm:gap-1.5">
              {activePeople.map(person => {
                const isHov = hoveredId === person.id;
                return (
                  <div
                    key={person.id}
                    className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl transition-colors duration-150 cursor-pointer"
                    style={{ backgroundColor: isHov ? person.colorLight : 'transparent' }}
                    onMouseEnter={() => setHoveredId(person.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onTouchStart={() => setHoveredId(hoveredId === person.id ? null : person.id)}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-[3px]"
                      style={{ backgroundColor: person.color }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-medium text-gray-900">{person.name}</span>
                        <span className="text-xs font-semibold" style={{ color: person.color }}>
                          {person.mbtiType}
                        </span>
                      </div>
                      {/* Expanded stats when hovered */}
                      <div
                        className="overflow-hidden transition-all duration-200"
                        style={{ maxHeight: isHov ? '120px' : '0', opacity: isHov ? 1 : 0 }}
                      >
                        <div className="mt-1.5 space-y-0.5">
                          {DIM_ORDER.map(({ key, label }) => (
                            <div key={key} className="flex items-center justify-between gap-3 text-xs">
                              <span className="text-gray-400">{label}</span>
                              <span className="font-semibold tabular-nums" style={{ color: person.color }}>
                                {person.dimensions[key]}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
