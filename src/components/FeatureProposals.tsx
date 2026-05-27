import React, { useState } from 'react';

interface Proposal {
  id: string;
  emoji: string;
  title: string;
  titleChinese: string;
  description: string;
  whyFit: string;
  uxHighlight: string;
  difficulty: 'Low' | 'Medium' | 'High';
}

const proposals: Proposal[] = [
  {
    id: 'blind-spot',
    emoji: '🔍',
    title: 'The Blind Spot',
    titleChinese: '盲點偵測',
    description:
      '自動計算五個向度中，四人差異最大的那一個，以視覺強調色標記出「這個群體最不一樣的維度」，並附上一句人味十足的解讀——說明這個差異在日常相處或團隊合作中代表什麼意思。',
    whyFit:
      '把靜態數字轉化為可行動的洞察。讓這個 dashboard 不只是資料展示，而是真正幫助人理解彼此的起點。',
    uxHighlight:
      '對應向度列自動亮起高光底色 + 一張浮現的「衝突點卡片」，語氣輕鬆不嚴肅，例如「Pinyu 和 Alva 對計畫這件事根本活在兩個宇宙。」',
    difficulty: 'Low',
  },
  {
    id: 'shape-of-you',
    emoji: '🕸',
    title: 'Shape of You',
    titleChinese: '人格輪廓圖',
    description:
      '將五個向度映射成雷達圖，每個人的 MBTI 特質構成一個獨特的幾何形狀。多人比較時，半透明多邊形互相疊加——交集代表共鳴，差距代表互補。',
    whyFit:
      '補充條形圖的侷限：讓整體人格「形狀感」一目瞭然，比數字更直覺，更容易記憶。',
    uxHighlight:
      '點擊人物卡片時，對應輪廓以流暢動畫展開；多人重疊時呈現漂亮的透明多邊形疊加效果，可截圖分享。',
    difficulty: 'Medium',
  },
  {
    id: 'chemistry',
    emoji: '⚗️',
    title: 'Chemistry Report',
    titleChinese: '人格化學分析',
    description:
      '選擇任意兩人，即時生成「人格相容報告」——哪些向度高度互補、哪些可能摩擦？以視覺化方式呈現相容分數，並附上一句金句式的相遇描述，例如「一個想征服未來，一個想體驗當下。」',
    whyFit:
      '這是 MBTI dashboard 中社交討論性最高的功能，天生適合截圖傳給對方說「你看這個說的是不是我們」。',
    uxHighlight:
      '「✓ 高度共鳴」/「⚡ 潛在張力」/ 「◎ 完美互補」三種標籤分類，搭配動態對比視覺；結果卡片可一鍵複製分享。',
    difficulty: 'Low',
  },
  {
    id: 'vibe-card',
    emoji: '📸',
    title: 'Vibe Snapshot',
    titleChinese: '人格快照',
    description:
      '一鍵生成可下載的人格快照卡片——像 Spotify Wrapped 的形式，把一個人的五大 MBTI 特質濃縮成一張精美視覺卡片。每張卡片有獨特的配色與排版，可直接分享到 IG Story。',
    whyFit:
      '社交傳播力極強，同時讓抽象的人格描述有了具體、可傳播的載體——這是資料視覺化最終極的形式。',
    uxHighlight:
      '逐項揭曉數值的動畫，最後卡片「閃現」的期待感；生成後可選擇深色/淺色版本，附帶 MBTI 官方角色說明連結。',
    difficulty: 'Medium',
  },
  {
    id: 'time-capsule',
    emoji: '⏳',
    title: 'Time Capsule',
    titleChinese: '人格時光機',
    description:
      '記錄每次 MBTI 測驗的日期。未來重新輸入新數值後，可以看到人格隨時間漂移的軌跡——用「幽靈標記」呈現過去的位置，與現在的你並排。',
    whyFit:
      'MBTI 的迷人事實是它會隨著人生經歷而改變。這個功能把靜態的自我認識轉化為動態的成長紀錄，讓 dashboard 有了時間維度。',
    uxHighlight:
      '時間軸滑桿控制「過去 → 現在」的動態過渡；幽靈標記以半透明虛線呈現，充滿詩意感；搭配「你在這段時間裡，變得更___了」的文字描述。',
    difficulty: 'High',
  },
];

const difficultyConfig = {
  Low: { label: '低', color: '#4E9A73', bg: '#EDF6F1' },
  Medium: { label: '中', color: '#B8883A', bg: '#FBF6EA' },
  High: { label: '高', color: '#C96D6D', bg: '#FDF2F2' },
};

export const FeatureProposals: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-1">
        <h2 className="text-base font-semibold text-gray-900">額外功能提案</h2>
        <span className="text-xs text-gray-400">5 ideas worth building</span>
      </div>
      <p className="text-xs text-gray-400 mb-6">
        以下是這個 dashboard 可以延伸的方向——每一個都是真實產品會考慮實作的功能。
      </p>

      <div className="space-y-2">
        {proposals.map(proposal => {
          const isExpanded = expandedId === proposal.id;
          const diff = difficultyConfig[proposal.difficulty];

          return (
            <div
              key={proposal.id}
              className="rounded-xl border overflow-hidden cursor-pointer"
              style={{
                backgroundColor: '#ffffff',
                borderColor: isExpanded ? '#E5E5E5' : '#F0EFEC',
                boxShadow: isExpanded
                  ? '0 4px 16px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)'
                  : '0 1px 2px rgba(0,0,0,0.03)',
                transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
              }}
              onClick={() => setExpandedId(isExpanded ? null : proposal.id)}
            >
              {/* Header row */}
              <div className="flex items-center justify-between px-4 sm:px-5 py-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl flex-shrink-0 select-none">{proposal.emoji}</span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-medium text-gray-900 text-sm">{proposal.title}</span>
                      <span className="text-xs text-gray-400 hidden sm:inline">{proposal.titleChinese}</span>
                    </div>
                    {!isExpanded && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate pr-4 hidden sm:block">
                        {proposal.description.slice(0, 60)}…
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold hidden sm:inline-block"
                    style={{ color: diff.color, backgroundColor: diff.bg }}
                  >
                    難度 {diff.label}
                  </span>
                  <span
                    className="text-gray-400 text-sm select-none block transition-transform duration-200"
                    style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }}
                  >
                    ▾
                  </span>
                </div>
              </div>

              {/* Expanded body */}
              {isExpanded && (
                <div
                  className="px-4 sm:px-5 pb-5 border-t"
                  style={{ borderColor: '#F5F4F1' }}
                >
                  <p className="text-sm text-gray-600 leading-relaxed pt-4 mb-4">
                    {proposal.description}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                        為什麼適合
                      </p>
                      <p className="text-xs text-gray-500 leading-relaxed">{proposal.whyFit}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                        UX 亮點
                      </p>
                      <p className="text-xs text-gray-500 leading-relaxed">{proposal.uxHighlight}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t" style={{ borderColor: '#F5F4F1' }}>
                    <span className="text-xs text-gray-400">實作難度</span>
                    <span
                      className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                      style={{ color: diff.color, backgroundColor: diff.bg }}
                    >
                      {proposal.difficulty} · {diff.label}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
