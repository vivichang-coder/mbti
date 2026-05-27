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

export const DIMENSIONS: Dimension[] = [
  {
    key: 'energy',
    name: 'Energy',
    chineseName: '能量',
    leftLabel: '內向',
    rightLabel: '外向',
    leftCode: 'I',
    rightCode: 'E',
  },
  {
    key: 'mind',
    name: 'Mind',
    chineseName: '心智',
    leftLabel: '求真務實',
    rightLabel: '天馬行空',
    leftCode: 'S',
    rightCode: 'N',
  },
  {
    key: 'nature',
    name: 'Nature',
    chineseName: '本性',
    leftLabel: '理性思考',
    rightLabel: '情感細膩',
    leftCode: 'T',
    rightCode: 'F',
  },
  {
    key: 'tactics',
    name: 'Tactics',
    chineseName: '應對方式',
    leftLabel: '運籌帷幄',
    rightLabel: '隨機應變',
    leftCode: 'J',
    rightCode: 'P',
  },
  {
    key: 'identity',
    name: 'Identity',
    chineseName: '身分特徵',
    leftLabel: '情緒易波動',
    rightLabel: '自信果斷',
    leftCode: 'T',
    rightCode: 'A',
  },
];

// All percentage values normalized to 0–100 where:
//   0 = fully left-side trait, 100 = fully right-side trait
export const PEOPLE: Person[] = [
  {
    id: 'alva',
    name: 'Alva',
    mbtiType: 'ENFP-A',
    mbtiRole: 'Campaigner',
    mbtiRoleChinese: '運動家',
    color: '#C96D6D',
    colorLight: '#FDF2F2',
    vibe: '自由靈魂，把每一天都活成冒險',
    dimensions: {
      energy: 73,   // 73% 外向
      mind: 79,     // 79% 天馬行空
      nature: 68,   // 68% 情感細膩
      tactics: 71,  // 71% 隨機應變
      identity: 88, // 88% 自信果斷
    },
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
    dimensions: {
      energy: 61,   // 61% 外向
      mind: 88,     // 88% 天馬行空
      nature: 78,   // 78% 情感細膩
      tactics: 46,  // 54% 運籌帷幄 → 100-54=46
      identity: 85, // 85% 自信果斷
    },
  },
  {
    id: 'pinyu',
    name: 'Pinyu',
    mbtiType: 'INTJ-T',
    mbtiRole: 'Architect',
    mbtiRoleChinese: '建築師',
    color: '#5E6FBF',
    colorLight: '#EDEFFE',
    vibe: '深謀遠慮的策略家，安靜卻能改變世界',
    dimensions: {
      energy: 22,   // 78% 內向 → 100-78=22
      mind: 51,     // 51% 天馬行空
      nature: 40,   // 60% 理性思考 → 100-60=40
      tactics: 24,  // 76% 運籌帷幄 → 100-76=24
      identity: 44, // 56% 情緒易波動 → 100-56=44
    },
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
    dimensions: {
      energy: 62,   // 62% 外向
      mind: 81,     // 81% 天馬行空
      nature: 51,   // 51% 情感細膩
      tactics: 51,  // 51% 隨機應變
      identity: 75, // 75% 自信果斷
    },
  },
];
