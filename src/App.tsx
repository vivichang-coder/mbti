import React, { useState, useEffect, useRef } from 'react';
import { PEOPLE, DIMENSIONS, GROUPS } from './data/mbti';
import type { Person } from './data/mbti';
import { PersonCard } from './components/PersonCard';
import { DimensionBar } from './components/DimensionBar';
import { GroupPulse } from './components/GroupPulse';
import { DimensionLeaders } from './components/DimensionLeaders';
import { DailyPairing } from './components/DailyPairing';
import { VibeSnapshot } from './components/VibeSnapshot';

type GroupId = 'fairies' | 'friends' | 'all';

const NAV_ITEMS = [
  { id: 'cards',    label: '人物',    emoji: '👥' },
  { id: 'dims',     label: '向度',    emoji: '📊' },
  { id: 'pulse',    label: '共識地圖', emoji: '🗺️' },
  { id: 'leaders',  label: '極端榜',  emoji: '🏆' },
  { id: 'pairing',  label: '今日配對', emoji: '✨' },
];

export default function App() {
  const [activeGroupId, setActiveGroupId] = useState<GroupId>('all');
  const [activePeopleIds, setActivePeopleIds] = useState<string[]>(PEOPLE.map(p => p.id));
  const [snapshotPerson, setSnapshotPerson] = useState<Person | null>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [navVisible, setNavVisible] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const sectionRefs: Record<string, React.RefObject<HTMLElement>> = {
    cards:   useRef<HTMLElement>(null),
    dims:    useRef<HTMLElement>(null),
    pulse:   useRef<HTMLElement>(null),
    leaders: useRef<HTMLElement>(null),
    pairing: useRef<HTMLElement>(null),
  };

  const scrollToSection = (id: string) => {
    sectionRefs[id]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setNavVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const selectGroup = (groupId: GroupId) => {
    setActiveGroupId(groupId);
    if (groupId === 'all') setActivePeopleIds(PEOPLE.map(p => p.id));
    else setActivePeopleIds(GROUPS.find(g => g.id === groupId)!.memberIds);
  };

  const togglePerson = (id: string) => {
    setActivePeopleIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const visiblePeople =
    activeGroupId === 'all'
      ? PEOPLE
      : PEOPLE.filter(p => GROUPS.find(g => g.id === activeGroupId)!.memberIds.includes(p.id));

  const allVisibleActive = visiblePeople.every(p => activePeopleIds.includes(p.id));

  const resetToGroupDefaults = () => {
    if (activeGroupId === 'all') setActivePeopleIds(PEOPLE.map(p => p.id));
    else setActivePeopleIds(GROUPS.find(g => g.id === activeGroupId)!.memberIds);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F6F3' }}>

      {/* ── Sticky Nav ──────────────────────────────────────────────── */}
      <div
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        style={{
          opacity: navVisible ? 1 : 0,
          transform: navVisible ? 'translateY(0)' : 'translateY(-100%)',
          pointerEvents: navVisible ? 'auto' : 'none',
          backgroundColor: 'rgba(247,246,243,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-hide">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 flex-shrink-0"
                style={{ color: '#6B7280', backgroundColor: 'transparent' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff'; (e.currentTarget as HTMLElement).style.color = '#111111'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#6B7280'; }}
              >
                <span>{item.emoji}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <header
          ref={headerRef}
          className="mb-10 transition-all duration-700"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(12px)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1.5">
              {PEOPLE.map(p => (
                <div
                  key={p.id}
                  className="w-2 h-2 rounded-full transition-opacity duration-200"
                  style={{ backgroundColor: p.color, opacity: activePeopleIds.includes(p.id) ? 1 : 0.22 }}
                />
              ))}
            </div>
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-gray-400">MBTI</span>
          </div>

          <h1 className="text-[2rem] sm:text-[2.4rem] font-semibold tracking-tight text-gray-900 leading-tight">
            Personality<br />
            <span className="text-gray-400 font-light">Dashboard</span>
          </h1>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            探索人格向度 · 比較特質差異 · 理解彼此
          </p>
        </header>

        {/* ── Group Selector ─────────────────────────────────────────── */}
        <section
          className="mb-6 transition-all duration-500"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(8px)',
            transitionDelay: '80ms',
          }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            {/* All — first */}
            <button
              onClick={() => selectGroup('all')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
              style={
                activeGroupId === 'all'
                  ? { backgroundColor: '#D4607A', color: '#ffffff', boxShadow: '0 2px 8px rgba(212,96,122,0.35)' }
                  : { backgroundColor: '#ffffff', color: '#6B7280', border: '1px solid #E5E3DF' }
              }
            >
              <span>All</span>
              <span
                className="text-[11px] font-semibold ml-0.5 px-1.5 py-0.5 rounded-full"
                style={
                  activeGroupId === 'all'
                    ? { backgroundColor: 'rgba(255,255,255,0.22)', color: 'rgba(255,255,255,0.9)' }
                    : { backgroundColor: '#F7F6F3', color: '#9CA3AF' }
                }
              >
                {PEOPLE.length}
              </span>
            </button>
            {GROUPS.map(group => (
              <button
                key={group.id}
                onClick={() => selectGroup(group.id as GroupId)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                style={
                  activeGroupId === group.id
                    ? { backgroundColor: '#D4607A', color: '#ffffff', boxShadow: '0 2px 8px rgba(212,96,122,0.35)' }
                    : { backgroundColor: '#ffffff', color: '#6B7280', border: '1px solid #E5E3DF' }
                }
              >
                <span>{group.emoji}</span>
                <span>{group.name}</span>
                <span
                  className="text-[11px] font-semibold ml-0.5 px-1.5 py-0.5 rounded-full"
                  style={
                    activeGroupId === group.id
                      ? { backgroundColor: 'rgba(255,255,255,0.22)', color: 'rgba(255,255,255,0.9)' }
                      : { backgroundColor: '#F7F6F3', color: '#9CA3AF' }
                  }
                >
                  {group.memberIds.length}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Person Cards ──────────────────────────────────────────── */}
        <section ref={sectionRefs.cards} className="mb-10">
          {activeGroupId === 'all' ? (
            /* Two grouped sections */
            <div className="space-y-6">
              {GROUPS.map(group => {
                const groupPeople = PEOPLE.filter(p => group.memberIds.includes(p.id));
                return (
                  <div key={group.id}>
                    <div className="flex items-center gap-2 mb-3 px-1">
                      <span className="text-sm">{group.emoji}</span>
                      <span className="text-sm font-semibold text-gray-700">{group.name}</span>
                      <span className="text-xs text-gray-400">· {groupPeople.length} 人</span>
                    </div>
                    <div className="cards-scroll overflow-x-auto pb-2 -mx-1">
                      <div
                        className="grid gap-2.5 px-1"
                        style={{
                          gridTemplateColumns: `repeat(${groupPeople.length}, minmax(130px, 1fr))`,
                          minWidth: `${groupPeople.length * 142}px`,
                        }}
                      >
                        {groupPeople.map((person, i) => (
                          <div
                            key={person.id}
                            className="transition-all duration-500"
                            style={{
                              opacity: headerVisible ? 1 : 0,
                              transform: headerVisible ? 'translateY(0)' : 'translateY(10px)',
                              transitionDelay: `${i * 60 + 160}ms`,
                            }}
                          >
                            <PersonCard
                              person={person}
                              isActive={activePeopleIds.includes(person.id)}
                              onClick={() => togglePerson(person.id)}
                              onSnapshot={() => setSnapshotPerson(person)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Single group cards */
            <div className="cards-scroll overflow-x-auto pb-2 -mx-1">
              <div
                className="grid gap-2.5 px-1"
                style={{
                  gridTemplateColumns: `repeat(${visiblePeople.length}, minmax(130px, 1fr))`,
                  minWidth: `${visiblePeople.length * 142}px`,
                }}
              >
                {visiblePeople.map((person, i) => (
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
                      onSnapshot={() => setSnapshotPerson(person)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-3 px-1">
            <p className="text-xs text-gray-400">
              點擊卡片切換顯示
              {activePeopleIds.length < PEOPLE.length && (
                <span className="ml-1">· 顯示 {activePeopleIds.length}/{PEOPLE.length} 人</span>
              )}
            </p>
            {!allVisibleActive && (
              <button
                onClick={resetToGroupDefaults}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-150 underline underline-offset-2"
              >
                全部顯示
              </button>
            )}
          </div>
        </section>

        {/* ── Dimension Bars ────────────────────────────────────────── */}
        <section ref={sectionRefs.dims} className="mb-10">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #EEECEA',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.03)',
            }}
          >
            {DIMENSIONS.map((dim, idx) => (
              <div
                key={dim.key}
                className="px-5 sm:px-7"
                style={{ borderTop: idx === 0 ? 'none' : '1px solid #F5F4F1' }}
              >
                <DimensionBar
                  dimension={dim}
                  activePeopleIds={activePeopleIds}
                  animationDelay={idx * 100}
                />
              </div>
            ))}
          </div>

          {activePeopleIds.length === 0 && (
            <p className="text-center py-8 text-sm text-gray-400">
              請選擇至少一位人物以顯示人格向度
            </p>
          )}
        </section>

        {/* ── Group Pulse ───────────────────────────────────────────── */}
        <section ref={sectionRefs.pulse} className="mb-10">
          <GroupPulse activePeopleIds={activePeopleIds} />
        </section>

        {/* ── Dimension Leaders ─────────────────────────────────────── */}
        <section ref={sectionRefs.leaders} className="mb-10">
          <DimensionLeaders activePeopleIds={activePeopleIds} />
        </section>

        {/* ── Daily Pairing ─────────────────────────────────────────── */}
        <section ref={sectionRefs.pairing} className="mb-16">
          <DailyPairing activePeopleIds={activePeopleIds} />
        </section>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <footer className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {PEOPLE.map(p => (
              <div
                key={p.id}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: p.color, opacity: 0.4 }}
              />
            ))}
          </div>
          <p className="text-xs text-gray-300">MBTI Personality Dashboard · 2024</p>
        </footer>

      </div>

      {/* ── Vibe Snapshot Modal ──────────────────────────────────────── */}
      {snapshotPerson && (
        <VibeSnapshot
          person={snapshotPerson}
          onClose={() => setSnapshotPerson(null)}
        />
      )}
    </div>
  );
}
