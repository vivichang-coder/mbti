import React, { useState, useEffect } from 'react';
import { PEOPLE, DIMENSIONS } from './data/mbti';
import { PersonCard } from './components/PersonCard';
import { DimensionBar } from './components/DimensionBar';
import { FeatureProposals } from './components/FeatureProposals';

export default function App() {
  const [activePeopleIds, setActivePeopleIds] = useState<string[]>(
    PEOPLE.map(p => p.id)
  );
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const togglePerson = (id: string) => {
    setActivePeopleIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const allActive = activePeopleIds.length === PEOPLE.length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F6F3' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <header
          className="mb-12 transition-all duration-700"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(12px)',
          }}
        >
          {/* Colour dot row */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1.5">
              {PEOPLE.map(p => (
                <div
                  key={p.id}
                  className="w-2 h-2 rounded-full transition-opacity duration-200"
                  style={{
                    backgroundColor: p.color,
                    opacity: activePeopleIds.includes(p.id) ? 1 : 0.25,
                  }}
                />
              ))}
            </div>
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-gray-400">
              MBTI
            </span>
          </div>

          <h1 className="text-[2rem] sm:text-[2.4rem] font-semibold tracking-tight text-gray-900 leading-tight">
            Personality<br />
            <span className="text-gray-400 font-light">Dashboard</span>
          </h1>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            探索人格向度 · 比較特質差異 · 理解彼此
          </p>
        </header>

        {/* ── Person Cards ────────────────────────────────────────────── */}
        <section className="mb-10">
          {/* Mobile: horizontal scroll; Tablet+: 4-col grid */}
          <div className="cards-scroll overflow-x-auto pb-2 -mx-1">
            <div
              className="grid gap-2.5 px-1"
              style={{
                gridTemplateColumns: `repeat(${PEOPLE.length}, minmax(130px, 1fr))`,
                minWidth: `${PEOPLE.length * 142}px`,
              }}
            >
              {PEOPLE.map((person, i) => (
                <div
                  key={person.id}
                  className="transition-all duration-500"
                  style={{
                    opacity: headerVisible ? 1 : 0,
                    transform: headerVisible ? 'translateY(0)' : 'translateY(10px)',
                    transitionDelay: `${i * 60 + 100}ms`,
                  }}
                >
                  <PersonCard
                    person={person}
                    isActive={activePeopleIds.includes(person.id)}
                    onClick={() => togglePerson(person.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Toggle-all hint */}
          <div className="flex items-center justify-between mt-3 px-1">
            <p className="text-xs text-gray-400">
              點擊卡片切換顯示
              {activePeopleIds.length < PEOPLE.length && (
                <span className="ml-1 text-gray-400">
                  · 顯示 {activePeopleIds.length}/{PEOPLE.length} 人
                </span>
              )}
            </p>
            {!allActive && (
              <button
                onClick={() => setActivePeopleIds(PEOPLE.map(p => p.id))}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-150 underline underline-offset-2"
              >
                全部顯示
              </button>
            )}
          </div>
        </section>

        {/* ── Dimension Bars ──────────────────────────────────────────── */}
        <section className="mb-16">
          <div
            className="rounded-2xl divide-y overflow-hidden"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #EEECEA',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.03)',
            }}
          >
            {/* Divider lines between bars */}
            {DIMENSIONS.map((dim, idx) => (
              <div
                key={dim.key}
                className="px-5 sm:px-7"
                style={{
                  borderTop: idx === 0 ? 'none' : '1px solid #F5F4F1',
                }}
              >
                <DimensionBar
                  dimension={dim}
                  activePeopleIds={activePeopleIds}
                  animationDelay={idx * 100}
                />
              </div>
            ))}
          </div>

          {/* Empty state when no one selected */}
          {activePeopleIds.length === 0 && (
            <div className="text-center py-8 text-sm text-gray-400">
              請選擇至少一位人物以顯示人格向度
            </div>
          )}
        </section>

        {/* ── Feature Proposals ───────────────────────────────────────── */}
        <section className="mb-16">
          <div
            className="h-px mb-12"
            style={{ background: 'linear-gradient(to right, transparent, #DDDBD8, transparent)' }}
          />
          <FeatureProposals />
        </section>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <footer className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {PEOPLE.map(p => (
              <div key={p.id} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color, opacity: 0.5 }} />
            ))}
          </div>
          <p className="text-xs text-gray-300">
            MBTI Personality Dashboard · 2024
          </p>
        </footer>

      </div>
    </div>
  );
}
