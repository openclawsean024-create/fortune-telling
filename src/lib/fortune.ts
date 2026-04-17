import type { ZiwuChart, BaziChart, LifePathResult, ZodiacResult, TarotCard } from '@/types';

// ============ 紫微斗數 ============
const ZIWU_STARS = [
  '紫微', '天機', '太陽', '武曲', '天同', '廉貞', '天府', '太陰', '貪狼', '巨門', '天相', '天梁', '七殺', '破軍', '左輔', '右弼',
  '文昌', '文曲', '廉貞', '破軍', '擎羊', '陀羅', '火星', '鈴星', '天魁', '天鉞', '天馬', '紅鸞', '天喜', '天德', '月德'
];

const PALACES = ['命宮', '兄弟宮', '夫妻宮', '子女宮', '財帛宮', '疾厄宮', '遷移宮', '僕役宮', '官祿宮', '田宅宮', '福德宮', '父母宮'];

export function calculateZiwuChart(birthDate: Date, birthTime: string): ZiwuChart {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const hour = parseInt(birthTime.split(':')[0]);

  // 簡易算法：用生日和時辰計算星曜配置
  const seed = (year * 10000 + month * 100 + day + hour) % 60;
  
  const chart: Record<string, string> = {};
  PALACES.forEach((palace, i) => {
    const starIndex = (seed + i * 3) % ZIWU_STARS.length;
    chart[palace] = ZIWU_STARS[starIndex];
  });

  return {
    mingGong: chart['命宮'],
    siblingPalace: chart['兄弟宮'],
    spousePalace: chart['夫妻宮'],
    childPalace: chart['子女宮'],
    wealthPalace: chart['財帛宮'],
    healthPalace: chart['疾厄宮'],
    迁移宫: chart['遷移宮'],
    仆役宫: chart['僕役宮'],
    官禄宫: chart['官祿宮'],
    田宅宫: chart['田宅宮'],
    福德宫: chart['福德宮'],
    父母宫: chart['父母宮'],
  };
}

// ============ 八字命盤 ============
const HEAVEN_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const EARTH_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const ELEMENTS = ['木', '火', '土', '金', '水'];
const MONTH_BRANCHES = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];

function getStemIndex(year: number): number {
  return (year - 4) % 10;
}

function getBranchIndex(year: number): number {
  return (year - 4) % 12;
}

function getHourBranch(hour: number): number {
  return Math.floor((hour + 1) / 2) % 12;
}

function getMonthBranch(month: number): number {
  return (month + 1) % 12;
}

function getDayStemAndBranch(jd: number): { stem: number; branch: number } {
  const cycle = (jd - 10) % 60;
  return {
    stem: cycle % 10,
    branch: cycle % 12,
  };
}

export function calculateBaziChart(birthDate: Date, birthTime: string): BaziChart {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const hour = parseInt(birthTime.split(':')[0]);

  const jd = Math.floor((birthDate.getTime() / 86400000) + 2440588);
  const dayResult = getDayStemAndBranch(jd);

  const yearStem = getStemIndex(year);
  const yearBranch = getBranchIndex(year);
  const monthBranch = getMonthBranch(month);
  const monthStem = (yearStem % 5) * 2 + Math.floor(month / 2) % 5;
  const hourBranch = getHourBranch(hour);
  const hourStem = (dayResult.stem % 5) * 2 + Math.floor(hour / 2) % 5;

  const elementMap: Record<number, string> = { 0: '木', 1: '火', 2: '土', 3: '金', 4: '水' };
  const yearElement = elementMap[yearStem % 5];
  const dayElement = elementMap[dayResult.stem % 5];

  return {
    年柱: HEAVEN_STEMS[yearStem] + EARTH_BRANCHES[yearBranch],
    月柱: HEAVEN_STEMS[monthStem] + EARTH_BRANCHES[monthBranch],
    日柱: HEAVEN_STEMS[dayResult.stem] + EARTH_BRANCHES[dayResult.branch],
    時柱: HEAVEN_STEMS[hourStem] + EARTH_BRANCHES[hourBranch],
    五行分析: `${yearElement}年 ${dayElement}日主`,
    性格特點: '根據八字分析，此人具有獨特的性格特徵...',
    事業建議: '事業發展建議...',
    感情建議: '感情相處建議...',
  };
}

// ============ 塔羅占卜 ============
const TAROT_DECK: TarotCard[] = [
  { id: 0, name: '愚者', nameEn: 'The Fool', meaning: '新的開始、冒險、單純。標誌著踏出第一步的勇氣，但也提醒需要謹慎評估風險。', reversed: false },
  { id: 1, name: '魔術師', nameEn: 'The Magician', meaning: '創造力、意志力、スキル。擁有實現目標的能力和決心。', reversed: false },
  { id: 2, name: '女祭司', nameEn: 'High Priestess', meaning: '直覺、神秘、智慧。倾听內心的聲音，探索潛意識。', reversed: false },
  { id: 3, name: '女皇', nameEn: 'The Empress', meaning: '豐盛、溫柔、母性。創造力與美的實現。', reversed: false },
  { id: 4, name: '皇帝', nameEn: 'The Emperor', meaning: '權威、秩序、領導力。穩健的領導與結構。', reversed: false },
  { id: 5, name: '教皇', nameEn: 'The Hierophant', meaning: '傳統、信仰、道德。精神上的指引與教育。', reversed: false },
  { id: 6, name: '戀人', nameEn: 'The Lovers', meaning: '愛情、選擇、和諧。重要的決定與關係。', reversed: false },
  { id: 7, name: '戰車', nameEn: 'The Chariot', meaning: '勝利、意志、決心。克服障礙取得成功。', reversed: false },
  { id: 8, name: '力量', nameEn: 'Strength', meaning: '勇氣、耐心、內在力量。用溫柔控制力量。', reversed: false },
  { id: 9, name: '隱者', nameEn: 'The Hermit', meaning: '內省、孤獨、尋找真理。內在的探索之旅。', reversed: false },
  { id: 10, name: '命運之輪', nameEn: 'Wheel of Fortune', meaning: '命運、轉機、運氣。生命的循環與轉變。', reversed: false },
  { id: 11, name: '正義', nameEn: 'Justice', meaning: '公平、真相、法律。因果律與道德責任。', reversed: false },
  { id: 12, name: '吊人', nameEn: 'The Hanged Man', meaning: '犧牲、等待、轉念。改變觀點帶來突破。', reversed: false },
  { id: 13, name: '死神', nameEn: 'Death', meaning: '結束、轉變、釋放。放下過去迎接新生。', reversed: false },
  { id: 14, name: '節制', nameEn: 'Temperance', meaning: '平衡、調和、耐心。中庸之道與和諧。', reversed: false },
  { id: 15, name: '惡魔', nameEn: 'The Devil', meaning: '束縛、誘惑、物质主义。擺脫負面影響。', reversed: false },
  { id: 16, name: '塔', nameEn: 'The Tower', meaning: '突變、覺醒、淨化。破壞後的重生。', reversed: false },
  { id: 17, name: '星星', nameEn: 'The Star', meaning: '希望、靈感、寧静。指引方向帶來希望。', reversed: false },
  { id: 18, name: '月亮', nameEn: 'The Moon', meaning: '幻覺、不安、潛意識。面對恐懼與不確定。', reversed: false },
  { id: 19, name: '太陽', nameEn: 'The Sun', meaning: '快樂、活力、成功。温暖與正向的能量。', reversed: false },
  { id: 20, name: '審判', nameEn: 'Judgement', meaning: '覺醒、重新開始、寬恕。過去的清算與新生。', reversed: false },
  { id: 21, name: '世界', nameEn: 'The World', meaning: '完成、成就感、和諧。達成目標與圓滿。', reversed: false },
];

export function drawTarotCard(seed?: number): TarotCard {
  const random = seed !== undefined ? seed % 22 : Math.floor(Math.random() * 22);
  const card = TAROT_DECK[Math.abs(random)];
  const reversed = seed !== undefined ? (seed % 2 === 1) : Math.random() > 0.5;
  return { ...card, reversed };
}

// ============ 生命靈數 ============
export function calculateLifePath(birthDate: Date): LifePathResult {
  const digits = `${birthDate.getFullYear()}${birthDate.getMonth() + 1}${birthDate.getDate()}`
    .split('').map(Number);
  
  const sum = digits.reduce((a, b) => a + b, 0);
  let lifePath = sum;
  while (lifePath > 9 && lifePath !== 11 && lifePath !== 22 && lifePath !== 33) {
    lifePath = String(lifePath).split('').reduce((a, b) => a + parseInt(b), 0);
  }

  const descriptions: Record<number, string> = {
    1: '獨立、創新領導者。勇於開創新局，擁有強烈的自主意識。',
    2: '合作、協調外交家。擅長團隊合作，注重關係和諧。',
    3: '表達、創意藝術家。充滿創造力，善於溝通與表達。',
    4: '務實、穩定建設者。腳踏實地，重視規劃與執行。',
    5: '自由、探險旅行家。渴望自由，多才多藝適應力強。',
    6: '責任、關懷守護者。重視家庭，樂於奉獻與照顧他人。',
    7: '分析、靈性探索者。喜歡深度思考，追求真理與智慧。',
    8: '成就、物質成功者。目標導向，渴望在事業上有所成就。',
    9: '博愛、理想人道主義者。關心他人，富有同理心與慈悲。',
    11: '直覺、啟發者。擁有超強直覺，能啟發帶動他人。',
    22: '大師、建造者。能將理想化為實際，成就大事。',
    33: '超越、奉獻者。超越自我，無私奉獻人群。',
  };

  return {
    number: lifePath,
    description: descriptions[lifePath] || descriptions[9],
    strengths: ['創造力', '適應力', '洞察力', '執行力'],
    challenges: ['有時過度理想化', '需要學會說不'],
  };
}

// ============ 生肖星座 ============
const ZODIAC_ANIMALS = ['鼠', '牛', '虎', '兔', '龍', '蛇', '馬', '羊', '猴', '雞', '狗', '豬'];
const ZODIAC_ELEMENTS: Record<number, string> = {
  0: '木', 1: '火', 2: '土', 3: '金', 4: '水', 5: '木', 6: '火', 7: '土', 8: '金', 9: '水'
};

export function calculateZodiac(birthDate: Date): ZodiacResult {
  const year = birthDate.getFullYear();
  const animalIndex = (year - 1900) % 12;
  const elementIndex = Math.floor((year - 1900) / 2) % 5;
  
  const descriptions: Record<string, string> = {
    '鼠': '機智靈活，善於理財，人際關係佳。',
    '牛': '勤懇踏實，毅力驚人，固執但可靠。',
    '虎': '勇猛自信，領導力強，具備魅力。',
    '兔': '溫柔細膩，善於社交，運氣良好。',
    '龍': '氣勢磅礴，野心勃勃，領導能力出眾。',
    '蛇': '神秘智慧，直覺敏銳，善于理財。',
    '馬': '熱情奔放，自由開朗，行動力強。',
    '羊': '溫和善良，藝術氣質，富有同情心。',
    '猴': '聰明機智，創意十足，適應力強。',
    '雞': '注重細節，辦事認真，勇於表達。',
    '狗': '忠誠可靠，正義感強，值得信賴。',
    '豬': '誠懇厚道，包容力強，財運佳。',
  };

  const elementDescs: Record<string, string> = {
    '木': '東方生气蓬勃之人，適合從事創意、文化、教育相關行業。',
    '火': '熱情活力四射之人，適合從事表演、銷售、創業相關行業。',
    '土': '穩重務實厚重之人，適合從事建築、金融、管理相關行業。',
    '金': '剛毅果斷銳利之人，適合從事法律、軍事、金融相關行業。',
    '水': '靈活變通智慧之人，適合從事技術、貿易、服務相關行業。',
  };

  return {
    zodiac: ZODIAC_ANIMALS[animalIndex],
    element: ZODIAC_ELEMENTS[elementIndex],
    description: descriptions[ZODIAC_ANIMALS[animalIndex]] + ' ' + elementDescs[ZODIAC_ELEMENTS[elementIndex]],
    luckyNumbers: [Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 9) + 1],
    luckyColors: ['紅', '金', '綠'],
    compatibleWith: ['鼠', '龍', '猴'],
  };
}

// ============ 日期驗證 ============
export function isValidDate(dateStr: string, timeStr: string): boolean {
  try {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return false;
    
    // 檢查日期範圍
    const year = date.getFullYear();
    if (year < 1900 || year > 2100) return false;
    
    // 檢查時間格式
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(timeStr)) return false;
    
    const hour = parseInt(timeStr.split(':')[0]);
    if (hour < 0 || hour > 23) return false;
    
    return true;
  } catch {
    return false;
  }
}

export function isValidSolarDate(year: number, month: number, day: number): boolean {
  const d = new Date(year, month - 1, day);
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}