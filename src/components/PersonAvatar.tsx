import React from 'react';

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

const ENTJAvatar = ({ color }: { color: string }) => (
  <svg viewBox="0 0 80 80" fill="none" width="100%" height="100%">
    <path d="M40 6 L74 40 L40 74 L6 40 Z" fill={color} opacity="0.65"/>
    <path d="M40 18 L62 40 L40 62 L18 40 Z" fill={color} opacity="0.35"/>
    <circle cx="40" cy="40" r="7" fill={color} opacity="0.95"/>
    <circle cx="40" cy="40" r="3" fill="white" opacity="0.4"/>
  </svg>
);

export const PersonAvatar = ({ mbtiType, color }: { mbtiType: string; color: string }) => {
  const base = mbtiType.split('-')[0];
  if (base === 'ENFJ') return <ENFJAvatar color={color} />;
  if (base === 'INTJ') return <INTJAvatar color={color} />;
  if (base === 'ENTJ') return <ENTJAvatar color={color} />;
  return <ENFPAvatar color={color} />;
};
