import React from 'react';
import { Person } from '../data/mbti';

// ─── SVG Avatars ─────────────────────────────────────────────────────────────

const ENFPAvatar = ({ color }: { color: string }) => (
  <svg viewBox="0 0 80 80" fill="none" width="100%" height="100%">
    {[0, 72, 144, 216, 288].map((angle, i) => (
      <ellipse
        key={i}
        cx="40" cy="20"
        rx="7" ry="16"
        fill={color}
        opacity={0.55 + i * 0.05}
        transform={`rotate(${angle} 40 40)`}
      />
    ))}
    <circle cx="40" cy="40" r="9" fill={color} />
    <circle cx="40" cy="40" r="4" fill="white" opacity="0.45" />
  </svg>
);

const ENFJAvatar = ({ color }: { color: string }) => (
  <svg viewBox="0 0 80 80" fill="none" width="100%" height="100%">
    <path
      d="M40 8 L44 28 L62 22 L50 38 L68 46 L48 48 L52 68 L40 56 L28 68 L32 48 L12 46 L30 38 L18 22 L36 28 Z"
      fill={color}
      opacity="0.72"
    />
    <circle cx="40" cy="40" r="7" fill="white" opacity="0.35" />
    <circle cx="40" cy="40" r="3" fill={color} opacity="0.9" />
  </svg>
);

const INTJAvatar = ({ color }: { color: string }) => (
  <svg viewBox="0 0 80 80" fill="none" width="100%" height="100%">
    <polygon
      points="40,8 66,23 66,57 40,72 14,57 14,23"
      stroke={color} strokeWidth="3" fill="none" opacity="0.75"
    />
    <polygon
      points="40,20 56,29 56,51 40,60 24,51 24,29"
      stroke={color} strokeWidth="2" fill="none" opacity="0.45"
    />
    <circle cx="40" cy="40" r="6" fill={color} opacity="0.9" />
    <line x1="40" y1="33" x2="40" y2="47" stroke="white" strokeWidth="1.5" opacity="0.5" />
    <line x1="33" y1="40" x2="47" y2="40" stroke="white" strokeWidth="1.5" opacity="0.5" />
  </svg>
);

const PersonAvatar = ({ mbtiType, color }: { mbtiType: string; color: string }) => {
  const base = mbtiType.split('-')[0];
  if (base === 'ENFJ') return <ENFJAvatar color={color} />;
  if (base === 'INTJ') return <INTJAvatar color={color} />;
  return <ENFPAvatar color={color} />;
};

// ─── Card ─────────────────────────────────────────────────────────────────────

interface PersonCardProps {
  person: Person;
  isActive: boolean;
  onClick: () => void;
  onSnapshot: () => void;
}

export const PersonCard: React.FC<PersonCardProps> = ({ person, isActive, onClick, onSnapshot }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      className="relative flex flex-col items-center p-4 sm:p-5 rounded-2xl text-center w-full cursor-pointer select-none focus:outline-none"
      style={{
        backgroundColor: isActive ? '#ffffff' : 'rgba(255,255,255,0.5)',
        border: `1.5px solid ${isActive ? person.color : 'transparent'}`,
        boxShadow: isActive
          ? `0 4px 16px ${person.color}18, 0 1px 3px rgba(0,0,0,0.06)`
          : '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.5)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
        }
      }}
    >
      {/* Active dot */}
      <span
        className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full transition-all duration-200"
        style={{ backgroundColor: isActive ? person.color : 'transparent', transform: isActive ? 'scale(1)' : 'scale(0)' }}
      />

      {/* Avatar */}
      <div
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 flex-shrink-0"
        style={{ backgroundColor: person.colorLight }}
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10">
          <PersonAvatar mbtiType={person.mbtiType} color={person.color} />
        </div>
      </div>

      <span className="font-semibold text-gray-900 text-sm leading-tight">{person.name}</span>
      <span
        className="mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full tracking-wide"
        style={{ color: person.color, backgroundColor: person.colorLight }}
      >
        {person.mbtiType}
      </span>
      <span className="mt-1 text-xs text-gray-400 font-medium">{person.mbtiRole}</span>
      <p className="mt-2 text-xs text-gray-400 leading-relaxed line-clamp-2 hidden sm:block">
        {person.vibe}
      </p>

      {/* Snapshot trigger — stopPropagation so it doesn't toggle the card */}
      <button
        onClick={e => { e.stopPropagation(); onSnapshot(); }}
        className="mt-3 flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-lg transition-all duration-150"
        style={{ color: person.color, backgroundColor: 'transparent' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = person.colorLight; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
        title="生成人格快照"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
        快照
      </button>
    </div>
  );
};
