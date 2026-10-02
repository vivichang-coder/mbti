import React from 'react';
import { PEOPLE, DIMENSIONS } from '../data/mbti';
import type { Person } from '../data/mbti';
import type { DimensionKey } from '../data/mbti';
import { PersonAvatar } from './PersonAvatar';

// ─── Seeded random ────────────────────────────────────────────────────────────

function seededRand(seed: number): number {
  let s = seed ^ (seed >>> 16);
  s = Math.imul(s, 0x45d9f3b);
  s = s ^ (s >>> 16);
  s = Math.imul(s, 0x45d9f3b);
  s = (s ^ (s >>> 16)) >>> 0;
  return s / 0xffffffff;
}

function getDailyPair(people: Person[], seed: number): [Person, Person] | null {
  if (people.length < 2) return null;
  const n = people.length;
  const i = Math.floor(seededRand(seed) * n);
  let j = Math.floor(seededRand(seed + 9999) * (n - 1));
  if (j >= i) j++;
  return [people[i], people[j % n]];
}

// ─── Templates ────────────────────────────────────────────────────────────────

const DIM_TEXTS: Record<DimensionKey, { big: string[]; mid: string[]; small: string[] }> = {
  energy: {
    big: [
      '一個在人群中充電，一個在獨處中充電——出門前先確認對方電量',
      '派對結束後，一個意猶未盡，一個終於鬆了口氣',
    ],
    mid: ['社交電池容量不太一樣，但都能找到彼此舒服的頻率'],
    small: ['能量節奏相近，相處起來不需要費力調頻'],
  },
  mind: {
    big: [
      '一個問「怎麼做到」，一個問「如果可以……」——對話永遠在跳躍',
      '現實與可能性之間的距離，剛好是你們對話的起點',
    ],
    mid: ['務實與想像力在你們之間保持著微妙的平衡'],
    small: ['看世界的方式出奇地相似，討論起來格外有默契'],
  },
  nature: {
    big: [
      '一個先分析邏輯，一個先感受情緒——爭論時超精彩',
      '理性與感性的碰撞，往往是最有深度的對話',
    ],
    mid: ['思考與感受兩種模式之間，形成互補'],
    small: ['面對事情的反應方式幾乎同步，省去不少解釋成本'],
  },
  tactics: {
    big: [
      '一個早就訂好計畫，一個還沒想好要不要去',
      '旅行前一個做了試算表，一個說「到時候再說」',
    ],
    mid: ['計劃性與彈性之間，能找到讓彼此都舒服的安排方式'],
    small: ['對「計劃」二字的理解幾乎一致——難得的默契'],
  },
  identity: {
    big: [
      '一個遇事果斷，一個反覆思量——決策速度差了不少',
      '「確定了嗎？」「嗯……再想想」',
    ],
    mid: ['自信程度各有千秋，在某些時刻剛好相互支撐'],
    small: ['面對壓力的反應方式相近，不需要太多解釋'],
  },
};

const OVERALL_TEXTS = [
  { min: 80, texts: ['靈魂相似度驚人——見面第一句話大概就是「我也是！」', '幾乎是同一種人，彼此的舒適圈高度重疊'] },
  { min: 60, texts: ['差異不大，但足以讓相處充滿剛剛好的新鮮感', '相似多過不同，偶爾的差異反而帶來驚喜'] },
  { min: 40, texts: ['互補多於相似——你的盲點剛好是對方的強項', '一半相似、一半不同——最有趣的組合'] },
  { min: 0,  texts: ['完全不同的兩個宇宙，正因如此才值得深入了解彼此', '差異是禮物——從對方身上能看見平時看不到的自己'] },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface DailyPairingProps {
  activePeopleIds: string[];
}

export const DailyPairing: React.FC<DailyPairingProps> = ({ activePeopleIds }) => {
  const activePeople = PEOPLE.filter(p => activePeopleIds.includes(p.id));
  if (activePeople.length < 2) return null;

  const now = new Date();
  const dateKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  const todayDisplay = now.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' });
  const seed = dateKey.split('').reduce((a, c) => ((a * 31 + c.charCodeAt(0)) | 0) >>> 0, 7);

  const pair = getDailyPair(activePeople, seed);
  if (!pair) return null;
  const [pa, pb] = pair;

  const diffs = DIMENSIONS.map(dim => ({
    dim,
    valA: pa.dimensions[dim.key],
    valB: pb.dimensions[dim.key],
    diff: Math.abs(pa.dimensions[dim.key] - pb.dimensions[dim.key]),
  })).sort((a, b) => b.diff - a.diff);

  const avgDiff = diffs.reduce((s, d) => s + d.diff, 0) / diffs.length;
  const similarity = Math.round(100 - avgDiff);

  const topDiff = diffs[0];
  const dimTexts = DIM_TEXTS[topDiff.dim.key];
  const textPool = topDiff.diff >= 35 ? dimTexts.big : topDiff.diff >= 18 ? dimTexts.mid : dimTexts.small;
  const dimText = textPool[Math.floor(seededRand(seed + 1234) * textPool.length)];

  const overallPool = OVERALL_TEXTS.find(t => similarity >= t.min)!;
  const overallText = overallPool.texts[Math.floor(seededRand(seed + 5678) * overallPool.texts.length)];

  const diffColor = (d: number) => d >= 35 ? '#F87171' : d >= 18 ? '#FBBF24' : '#34D399';

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-1">
        <h2 className="text-base font-semibold text-gray-900">今日配對</h2>
        <span className="text-xs text-gray-400">/ Daily Pairing · {todayDisplay}</span>
      </div>
      <p className="text-xs text-gray-400 mb-5">每天隨機配對一組，探索彼此的化學反應</p>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #EEECEA',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.03)',
        }}
      >
        {/* Pair header */}
        <div className="px-5 sm:px-7 py-5">
          <div className="flex items-center gap-4">
            {/* Person A */}
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: pa.colorLight }}
              >
                <div className="w-6 h-6">
                  <PersonAvatar mbtiType={pa.mbtiType} color={pa.color} />
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900 text-center leading-tight">{pa.name}</span>
              <span className="text-[11px] font-semibold" style={{ color: pa.color }}>{pa.mbtiType}</span>
            </div>

            {/* Center */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <span className="text-xl">✨</span>
              <span className="text-[10px] text-gray-400">相似度</span>
              <span className="text-xl font-bold text-gray-900">{similarity}%</span>
            </div>

            {/* Person B */}
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: pb.colorLight }}
              >
                <div className="w-6 h-6">
                  <PersonAvatar mbtiType={pb.mbtiType} color={pb.color} />
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900 text-center leading-tight">{pb.name}</span>
              <span className="text-[11px] font-semibold" style={{ color: pb.color }}>{pb.mbtiType}</span>
            </div>
          </div>

          {/* Similarity bar */}
          <div className="mt-4 h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${similarity}%`,
                background: `linear-gradient(to right, ${pa.color}, ${pb.color})`,
                transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
          </div>
        </div>

        {/* Dimension comparison */}
        <div className="px-5 sm:px-7 py-4" style={{ borderTop: '1px solid #F5F4F1' }}>
          <div className="space-y-3">
            {diffs.map(({ dim, valA, valB, diff }) => (
              <div key={dim.key} className="flex items-center gap-2.5">
                <span className="text-[11px] text-gray-400 w-8 flex-shrink-0">{dim.chineseName}</span>
                <span className="text-[11px] font-semibold tabular-nums w-8 text-right flex-shrink-0" style={{ color: pa.color }}>{valA}%</span>
                <div className="flex-1 relative h-1.5 bg-gray-100 rounded-full">
                  {/* Range fill */}
                  <div
                    className="absolute h-full rounded-full opacity-25"
                    style={{
                      left: `${Math.min(valA, valB)}%`,
                      width: `${diff}%`,
                      backgroundColor: diffColor(diff),
                    }}
                  />
                  {/* Dot A */}
                  <div
                    className="absolute top-1/2 w-2.5 h-2.5 rounded-full border-2 border-white"
                    style={{
                      left: `${valA}%`,
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: pa.color,
                      zIndex: 2,
                    }}
                  />
                  {/* Dot B */}
                  <div
                    className="absolute top-1/2 w-2.5 h-2.5 rounded-full border-2 border-white"
                    style={{
                      left: `${valB}%`,
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: pb.color,
                      zIndex: 2,
                    }}
                  />
                </div>
                <span className="text-[11px] font-semibold tabular-nums w-8 flex-shrink-0" style={{ color: pb.color }}>{valB}%</span>
                <span
                  className="text-[10px] font-semibold w-5 text-right flex-shrink-0"
                  style={{ color: diffColor(diff) }}
                >
                  {diff}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Text insight */}
        <div className="px-5 sm:px-7 py-4" style={{ borderTop: '1px solid #F5F4F1', backgroundColor: '#FAFAF9' }}>
          <p className="text-[12px] text-gray-600 leading-relaxed mb-2">
            <span className="font-semibold text-gray-800">「{topDiff.dim.chineseName}」差距最大（{topDiff.diff}%）</span>
            {' '}——{' '}{dimText}
          </p>
          <p className="text-[12px] text-gray-500 leading-relaxed">{overallText}</p>
        </div>
      </div>
    </div>
  );
};
