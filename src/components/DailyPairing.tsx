import React, { useState } from 'react';
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
      '一個把人群當充電站，一個把人群當耗電場——強烈建議出發前確認彼此電量',
      '派對結束後，一個說「再一攤！」，一個已經在計程車上準備回家了',
      '一個社交不累，一個社交累到隔天要補眠——這趟約會可能需要排休假',
    ],
    mid: [
      '社交電量設定略有落差，但至少不會在派對上走散（大概）',
      '一個充電快一點，一個放電慢一點——總體來說湊合著用',
    ],
    small: [
      '能量節奏幾乎一致，大概連「今天不想出門」都會在同一天傳訊息說',
      '社交電池規格相近，充電方式也差不多——非常省事的組合',
    ],
  },
  mind: {
    big: [
      '一個在 Google Maps 看路線，一個在想「如果能飛過去」要幾分鐘',
      '討論計畫時，一個說「但現實上…」，另一個說「但如果可以…」——這個循環可以持續到天亮',
      '一個活在當下，一個同時活在十種平行宇宙——對話偶爾需要翻譯',
    ],
    mid: [
      '務實和天馬行空各出一半，一個負責落地，一個負責起飛',
      '介於「這可行嗎」和「管它可不可行先說說看」之間，剛好互補',
    ],
    small: [
      '看世界的方式出奇地相似，大概會一起腦洞大開，然後一起問「但真的能做到嗎」',
      '同頻率運作，溝通成本極低——這很難得',
    ],
  },
  nature: {
    big: [
      '一個先問「邏輯說得通嗎」，一個先問「你還好嗎」——吵架時超精彩',
      '一個用 Excel 分析問題，一個用眼淚分析問題——方法不同，都有效',
      '吵架時一個講道理，一個講感受，雙方都覺得自己才是對的——典型的跨次元衝突',
    ],
    mid: [
      '理性和感性各出一半，剛好補足彼此的盲點——組合效益不錯',
      '一個負責說「冷靜分析一下」，一個負責說「但我的感覺是…」——互為煞車與油門',
    ],
    small: [
      '面對事情的反應幾乎同步——要麼都很理性，要麼一起感性崩潰',
      '省去大量「你到底在想什麼」的解釋成本，是種奢侈的默契',
    ],
  },
  tactics: {
    big: [
      '一個已把行程規劃到每個小時，一個還在考慮要不要去',
      '一個的手機裡有三套備用計畫，另一個覺得「有計畫就輸了」',
      '約好的事，一個提前兩週確認，一個當天早上才回訊息——請保持耐心',
    ],
    mid: [
      '一個要有大概方向，一個要保留一點彈性——其實可以談',
      '計劃性與即興感各出一半，旅行起來可能很有趣，也可能在機場大眼瞪小眼',
    ],
    small: [
      '行事風格相近，估計不會為「要不要提前訂位」吵架——難得的默契',
      '對「計劃」的理解幾乎一致，可以直接跳過最耗精力的前置協商',
    ],
  },
  identity: {
    big: [
      '一個遇到問題直接往前衝，一個先在腦中把所有壞結果預演三遍',
      '一個說「沒問題！」，另一個說「等等，我們有沒有考慮到所有可能性」——建議設定決策倒數計時',
      '面對不確定性，一個是「先射箭再畫靶」，一個是「把靶算清楚再射」',
    ],
    mid: [
      '自信程度各有高低，剛好在對方最需要支撐的時刻互補——挺好的',
      '一個果斷，一個謹慎，合在一起剛好是一個完整的決策系統',
    ],
    small: [
      '面對壓力的反應方式相近，大概都是先冷靜，然後一起焦慮',
      '自信底色相似，遇到難題時的反應也差不多——很容易同步',
    ],
  },
};

const OVERALL_TEXTS = [
  { min: 80, texts: [
    '靈魂相似度爆表——見面第一句話大概就是「我也這樣！」然後聊到天亮',
    '基本上是同一個人分裂成兩份，建議互相照鏡子',
  ]},
  { min: 60, texts: [
    '差異不大，但足以讓相處充滿剛剛好的新鮮感——不陌生，也不無聊',
    '相似多過不同，偶爾的小摩擦大概只會讓關係更有趣',
  ]},
  { min: 40, texts: [
    '互補多於相似——你的盲點剛好是對方的強項，組隊效果出奇地好',
    '一半天作之合，一半截然相反——最有爆點的組合',
  ]},
  { min: 0, texts: [
    '完全不同的兩個宇宙，每次對話都像在即時翻譯兩種語言——但也因此最有料',
    '差距大到值得寫一篇學術論文，不過也代表彼此都能從對方身上學到很多',
  ]},
];

// ─── Component ────────────────────────────────────────────────────────────────

interface DailyPairingProps {
  activePeopleIds: string[];
}

export const DailyPairing: React.FC<DailyPairingProps> = ({ activePeopleIds }) => {
  const [refreshOffset, setRefreshOffset] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const activePeople = PEOPLE.filter(p => activePeopleIds.includes(p.id));
  if (activePeople.length < 2) return null;

  const now = new Date();
  const dateKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  const todayDisplay = now.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' });
  const baseSeed = dateKey.split('').reduce((a, c) => ((a * 31 + c.charCodeAt(0)) | 0) >>> 0, 7);
  const seed = (baseSeed + refreshOffset * 0x9e3779b9) >>> 0;

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

  const handleRefresh = () => {
    setSpinning(true);
    setRefreshOffset(prev => prev + 1);
    setTimeout(() => setSpinning(false), 500);
  };

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <div className="flex items-baseline gap-2">
          <h2 className="text-base font-semibold text-gray-900">今日配對</h2>
          <span className="text-xs text-gray-400">/ Daily Pairing · {todayDisplay}</span>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors duration-150 px-2 py-1 rounded-lg hover:bg-white"
          title="換一對"
        >
          <svg
            width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: 'transform 0.5s ease', transform: spinning ? 'rotate(360deg)' : 'rotate(0deg)' }}
          >
            <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          換一對
        </button>
      </div>
      <p className="text-xs text-gray-400 mb-5">探索彼此的化學反應，每天自動換一組</p>

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
                  <div
                    className="absolute h-full rounded-full opacity-25"
                    style={{
                      left: `${Math.min(valA, valB)}%`,
                      width: `${diff}%`,
                      backgroundColor: diffColor(diff),
                    }}
                  />
                  <div
                    className="absolute top-1/2 w-2.5 h-2.5 rounded-full border-2 border-white"
                    style={{ left: `${valA}%`, transform: 'translate(-50%, -50%)', backgroundColor: pa.color, zIndex: 2 }}
                  />
                  <div
                    className="absolute top-1/2 w-2.5 h-2.5 rounded-full border-2 border-white"
                    style={{ left: `${valB}%`, transform: 'translate(-50%, -50%)', backgroundColor: pb.color, zIndex: 2 }}
                  />
                </div>
                <span className="text-[11px] font-semibold tabular-nums w-8 flex-shrink-0" style={{ color: pb.color }}>{valB}%</span>
                <span className="text-[10px] font-semibold w-5 text-right flex-shrink-0" style={{ color: diffColor(diff) }}>
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
