export type DimensionKey = 'energy' | 'mind' | 'nature' | 'tactics' | 'identity';

export interface Dimension {
  key: DimensionKey;
  name: string;
  chineseName: string;
  leftLabel: string;
  rightLabel: string;
  leftCode: string;
  rightCode: string;
}

export interface PersonDimensions {
  energy: number;
  mind: number;
  nature: number;
  tactics: number;
  identity: number;
}

export interface Person {
  id: string;
  name: string;
  mbtiType: string;
  mbtiRole: string;
  mbtiRoleChinese: string;
  color: string;
  colorLight: string;
  vibe: string;
  dimensions: PersonDimensions;
}

export interface Group {
  id: string;
  name: string;
  emoji: string;
  memberIds: string[];
}

export const DIMENSIONS: Dimension[] = [
  { key: 'energy',   name: 'Energy',   chineseName: '能量',   leftLabel: '內向',     rightLabel: '外向',   leftCode: 'I', rightCode: 'E' },
  { key: 'mind',     name: 'Mind',     chineseName: '心智',   leftLabel: '求真務實', rightLabel: '天馬行空', leftCode: 'S', rightCode: 'N' },
  { key: 'nature',   name: 'Nature',   chineseName: '本性',   leftLabel: '理性思考', rightLabel: '情感細膩', leftCode: 'T', rightCode: 'F' },
  { key: 'tactics',  name: 'Tactics',  chineseName: '應對方式', leftLabel: '運籌帷幄', rightLabel: '隨機應變', leftCode: 'J', rightCode: 'P' },
  { key: 'identity', name: 'Identity', chineseName: '身分特徵', leftLabel: '情緒易波動', rightLabel: '自信果斷', leftCode: 'T', rightCode: 'A' },
];

// All values normalised 0–100: 0 = fully left trait, 100 = fully right trait.
// People ordered: Fairies first, then Fairies' Friends.
export const PEOPLE: Person[] = [
  // ── Fairies 🧚🏻 ──────────────────────────────────────────────────────────
  {
    id: 'alva',
    name: 'Alva',
    mbtiType: 'ENFP-A',
    mbtiRole: 'Campaigner',
    mbtiRoleChinese: '運動家',
    color: '#C96D6D',
    colorLight: '#FDF2F2',
    vibe: '自由靈魂，把每一天都活成冒險',
    dimensions: { energy: 73, mind: 79, nature: 68, tactics: 71, identity: 88 },
  },
  {
    id: 'abby',
    name: 'Abby',
    mbtiType: 'ENFJ-A',
    mbtiRole: 'Protagonist',
    mbtiRoleChinese: '主人公',
    color: '#4E9A73',
    colorLight: '#EDF6F1',
    vibe: '天生領導者，用同理心連結每個人',
    dimensions: { energy: 61, mind: 88, nature: 78, tactics: 46, identity: 85 },
  },
  {
    id: 'yoyo',
    name: 'Yoyo',
    mbtiType: 'INTJ-T',
    mbtiRole: 'Architect',
    mbtiRoleChinese: '建築師',
    color: '#5E6FBF',
    colorLight: '#EDEFFE',
    vibe: '深謀遠慮的策略家，安靜卻能改變世界',
    dimensions: { energy: 22, mind: 51, nature: 40, tactics: 24, identity: 44 },
  },
  {
    id: 'vivi',
    name: 'Vivi',
    mbtiType: 'ENFP-A',
    mbtiRole: 'Campaigner',
    mbtiRoleChinese: '運動家',
    color: '#B8883A',
    colorLight: '#FBF6EA',
    vibe: '好奇心旺盛的創意人，靈感永不停歇',
    dimensions: { energy: 62, mind: 81, nature: 51, tactics: 51, identity: 75 },
  },
  {
    id: 'evelyn',
    name: 'Evelyn',
    mbtiType: 'ENTJ-A',
    mbtiRole: 'Commander',
    mbtiRoleChinese: '指揮官',
    color: '#C4753D',
    colorLight: '#FAF0E8',
    vibe: '目標導向的指揮官，清晰直接，以結果說話',
    dimensions: {
      energy: 61,  // 61% 外向
      mind: 61,    // 61% 天馬行空
      nature: 39,  // 61% 理性思考 → 100-61=39
      tactics: 37, // 63% 運籌帷幄 → 100-63=37
      identity: 78,// 78% 自信果斷
    },
  },

  // ── Fairies' Friends 💅 ───────────────────────────────────────────────────
  {
    id: 'jenwei',
    name: 'Jenwei',
    mbtiType: 'ENFJ-A',
    mbtiRole: 'Protagonist',
    mbtiRoleChinese: '主人公',
    color: '#9B6DB5',
    colorLight: '#F5EEF8',
    vibe: '溫暖的支柱，把每個人的感受都記在心裡',
    dimensions: {
      energy: 64,  // 64% 外向
      mind: 68,    // 68% 天馬行空
      nature: 56,  // 56% 情感細膩
      tactics: 47, // 53% 運籌帷幄 → 100-53=47
      identity: 67,// 67% 自信果斷
    },
  },
  {
    id: 'david',
    name: 'David Hou',
    mbtiType: 'ENFJ-A',
    mbtiRole: 'Protagonist',
    mbtiRoleChinese: '主人公',
    color: '#3D9EA4',
    colorLight: '#E8F6F7',
    vibe: '高能量連結者，走進任何房間都是焦點',
    dimensions: {
      energy: 83,  // 83% 外向
      mind: 76,    // 76% 天馬行空
      nature: 51,  // 51% 情感細膩
      tactics: 32, // 68% 運籌帷幄 → 100-68=32
      identity: 60,// 60% 自信果斷
    },
  },
  {
    id: 'charles',
    name: 'Charles',
    mbtiType: 'ENFJ-T',
    mbtiRole: 'Protagonist',
    mbtiRoleChinese: '主人公',
    color: '#697B8C',
    colorLight: '#EDF0F2',
    vibe: '細心的協調者，用結構讓混亂變得有秩序',
    dimensions: {
      energy: 68,  // 68% 外向
      mind: 58,    // 58% 天馬行空
      nature: 51,  // 51% 情感細膩
      tactics: 29, // 71% 運籌帷幄 → 100-71=29
      identity: 32,// 68% 情緒易波動 → 100-68=32
    },
  },
];

export const GROUPS: Group[] = [
  {
    id: 'fairies',
    name: 'Fairies',
    emoji: '🧚🏻',
    memberIds: ['alva', 'abby', 'yoyo', 'vivi', 'evelyn'],
  },
  {
    id: 'friends',
    name: "Fairies' Friends",
    emoji: '💅',
    memberIds: ['jenwei', 'david', 'charles'],
  },
];
