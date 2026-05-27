import React, { useEffect, useState } from 'react';
import { Dimension, Person, PEOPLE } from '../data/mbti';

interface DimensionBarProps {
  dimension: Dimension;
  activePeopleIds: string[];
  animationDelay?: number;
}

export const DimensionBar: React.FC<DimensionBarProps> = ({
  dimension,
  activePeopleIds,
  animationDelay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), animationDelay + 80);
    return () => clearTimeout(t);
  }, [animationDelay]);

  // Keep ALL people in the render tree so CSS transitions handle fade in/out
  const sortedActive = PEOPLE
    .filter(p => activePeopleIds.includes(p.id))
    .sort((a, b) => a.dimensions[dimension.key] - b.dimensions[dimension.key]);

  return (
    <div className="py-6 group">
      {/* Row header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
          {dimension.name}
        </span>
        <span className="text-[10px] text-gray-300 font-medium">/ {dimension.chineseName}</span>
      </div>

      {/* Track zone */}
      <div className="relative">
        {/* Left / right trait labels */}
        <div className="flex justify-between mb-3">
          <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
            <span
              className="inline-flex items-center justify-center w-4 h-4 rounded text-[9px] font-bold"
              style={{ backgroundColor: '#EBEBEB', color: '#999' }}
            >
              {dimension.leftCode}
            </span>
            {dimension.leftLabel}
          </span>
          <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
            {dimension.rightLabel}
            <span
              className="inline-flex items-center justify-center w-4 h-4 rounded text-[9px] font-bold"
              style={{ backgroundColor: '#EBEBEB', color: '#999' }}
            >
              {dimension.rightCode}
            </span>
          </span>
        </div>

        {/* Track + markers wrapper — needs extra vertical space for markers */}
        <div className="relative" style={{ height: '24px' }}>
          {/* Track line */}
          <div
            className="absolute left-0 right-0 rounded-full"
            style={{
              top: '50%',
              height: '2px',
              transform: 'translateY(-50%)',
              background: 'linear-gradient(to right, #E8E6E2 0%, #EBEBEB 50%, #E8E6E2 100%)',
            }}
          />

          {/* Subtle quarter-mark ticks */}
          {[25, 50, 75].map(pct => (
            <div
              key={pct}
              className="absolute rounded-full"
              style={{
                left: `${pct}%`,
                top: '50%',
                width: pct === 50 ? '1px' : '1px',
                height: pct === 50 ? '10px' : '6px',
                transform: 'translate(-50%, -50%)',
                backgroundColor: pct === 50 ? '#D5D3CF' : '#DEDCDA',
              }}
            />
          ))}

          {/* Markers — all PEOPLE rendered; inactive ones fade out */}
          {PEOPLE.map((person, personIdx) => {
            const isActive = activePeopleIds.includes(person.id);
            const value = person.dimensions[dimension.key];

            return (
              <div
                key={person.id}
                className="absolute"
                style={{
                  left: `${value}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  opacity: isActive && isVisible ? 1 : 0,
                  scale: isActive && isVisible ? '1' : '0.3',
                  transition: `opacity 0.3s ease ${personIdx * 60}ms, scale 0.35s cubic-bezier(0.34,1.56,0.64,1) ${personIdx * 60}ms`,
                  zIndex: isActive ? 10 : 0,
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                <div className="relative group/marker cursor-default">
                  {/* Hover ring */}
                  <div
                    className="absolute rounded-full opacity-0 group-hover/marker:opacity-100 transition-opacity duration-200 pointer-events-none"
                    style={{
                      inset: '-7px',
                      backgroundColor: person.color,
                      opacity: 0,
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.15'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0'; }}
                  />
                  {/* Dot */}
                  <div
                    className="w-3 h-3 rounded-full border-2 border-white shadow-sm transition-transform duration-150 group-hover/marker:scale-125"
                    style={{ backgroundColor: person.color }}
                  />
                  {/* Tooltip — flips side near edges */}
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
                    {/* Arrow */}
                    <span
                      className="block w-2 h-2 rotate-45 mx-auto -mt-1"
                      style={{ backgroundColor: person.color }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend chips — sorted by value, fade in with bar */}
        <div
          className="flex flex-wrap gap-1.5 mt-3 transition-opacity duration-500"
          style={{ opacity: isVisible ? 1 : 0 }}
        >
          {sortedActive.length === 0 ? (
            <span className="text-xs text-gray-300 italic">選擇上方卡片以顯示數據</span>
          ) : (
            sortedActive.map(person => (
              <span
                key={person.id}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium transition-all duration-200"
                style={{ color: person.color, backgroundColor: person.colorLight }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: person.color }}
                />
                {person.name}
                <span className="opacity-60">·</span>
                {person.dimensions[dimension.key]}%
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
