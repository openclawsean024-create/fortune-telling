// Types for fortune-telling app
export interface BirthInfo {
  name?: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:MM
  gender?: 'male' | 'female';
  isLunar: boolean;
}

export interface TarotCard {
  id: number;
  name: string;
  nameEn: string;
  meaning: string;
  reversed: boolean;
}

export interface ZiwuChart {
  mingGong: string; // 命宮
  siblingPalace: string; // 兄弟宮
  spousePalace: string; // 夫妻宮
  childPalace: string; // 子女宮
  wealthPalace: string; // 財帛宮
  healthPalace: string; // 疾厄宮
 迁移宫: string; // 遷移宮
 仆役宫: string; // 僕役宮
  官禄宫: string; // 官祿宮
  田宅宫: string; // 田宅宮
 福德宫: string; // 福德宮
  父母宫: string; // 父母宮
}

export interface BaziChart {
  年柱: string;
  月柱: string;
  日柱: string;
  時柱: string;
  五行分析: string;
  性格特點: string;
  事業建議: string;
  感情建議: string;
}

export interface LifePathResult {
  number: number;
  description: string;
  strengths: string[];
  challenges: string[];
}

export interface ZodiacResult {
  zodiac: string;
  element: string;
  description: string;
  luckyNumbers: number[];
  luckyColors: string[];
  compatibleWith: string[];
}

export interface FortuneReport {
  id: string;
  userId?: string;
  birthInfo: BirthInfo;
  ziwu?: ZiwuChart;
  bazi?: BaziChart;
  tarot?: TarotCard;
  lifePath?: LifePathResult;
  zodiac?: ZodiacResult;
  createdAt: string;
  sharedId?: string;
}
