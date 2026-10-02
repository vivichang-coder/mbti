import React from 'react';
import { PEOPLE, DIMENSIONS } from '../data/mbti';

const SHORT_LABELS: Record<string, [string, string]> = {
  energy:   ['最內向', '最外向'],
  mind:     ['最務實', '最直覺'],
  nature:   ['最理性', '最感性'],
  tactics:  ['最計劃', '最靈活'],
  identity: ['最波動', '最果斷'],
};

interface DimensionLeadersProps {
  activePeopleIds: string[];
}

export const DimensionLeaders: React.FC<DimensionLeadersProps> = ({ activePeopleIds }) => {
  const activePeople = PEOPLE.filter(p => activePeopleIds.includes(p.id));
  if (activePeople.length < 2) return null;

  const rows = DIMENSIONS.map(dim => {
    const sorted = [...activePeople].sort((a, b) => a.dimensions[dim.key] - b.dimensions[dim.key]);
    return {
      dim,
      leftPerson: sorted[0],
      leftVal: sorted[0].dimensions[dim.key],
      rightPerson: sorted[sorted.length - 1],
      rightVal: sorted[sorted.length - 1].dimensions[dim.key],
    };
  });

  const mostBalanced = activePeople.reduce((best, p) => {
    const score = DIMENSIONS.reduce((s, d) => s + Math.abs(p.dimensions[d.key] - 50), 0);
    const bestScore = DIMENSIONS.reduce((s, d) => s + Math.abs(best.dimensions[d.key] - 50), 0);
    return score < bestScore ? p : best;
  });

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-1">
        <h2 className="text-base font-semibold text-gray-900">人格排行榜</h2>
        <span className="text-xs text-gray-400">/ Dimension Leaders</span>
      </div>
      <p className="text-xs text-gray-400 mb-5">每個向度中，特質最突出的人</p>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #EEECEA',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.03)',
        }}
      >
        {rows.map(({ dim, leftPerson, leftVal, rightPerson, rightVal }, idx) => {
          const [leftLabel, rightLabel] = SHORT_LABELS[dim.key];
          return (
            <div
              key={dim.key}
              className="px-5 sm:px-7 py-4"
              style={{ borderTop: idx === 0 ? 'none' : '1px solid #F5F4F1' }}
            >
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-gray-400">
                  {dim.name}
                </span>
                <span className="text-[10px] text-gray-300">/ {dim.chineseName}</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Left extreme */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                    style={{ backgroundColor: leftPerson.colorLight, color: leftPerson.color }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: leftPerson.color }} />
                    {leftPerson.name} · {leftVal}%
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap hidden sm:inline">{leftLabel}</span>
                </div>

                <span className="text-gray-200 flex-shrink-0 text-xs">·</span>

                {/* Right extreme */}
                <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                  <span className="text-[10px] text-gray-400 whitespace-nowrap hidden sm:inline">{rightLabel}</span>
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                    style={{ backgroundColor: rightPerson.colorLight, color: rightPerson.color }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: rightPerson.color }} />
                    {rightPerson.name} · {rightVal}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Most balanced footer */}
        <div
          className="px-5 sm:px-7 py-3.5 flex items-center gap-2 flex-wrap"
          style={{ borderTop: '1px solid #F5F4F1', backgroundColor: '#FAFAF9' }}
        >
          <span className="text-xs text-gray-400">⚖️ 最均衡獎</span>
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: mostBalanced.colorLight, color: mostBalanced.color }}
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: mostBalanced.color }} />
            {mostBalanced.name}
          </div>
          <span className="text-[11px] text-gray-400">五個向度最接近中間值</span>
        </div>
      </div>
    </div>
  );
};
