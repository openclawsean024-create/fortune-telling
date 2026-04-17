import { NextRequest, NextResponse } from 'next/server';
import { calculateZiwuChart, calculateBaziChart, calculateLifePath, calculateZodiac, isValidDate, isValidSolarDate } from '@/lib/fortune';
import { lunarToSolar, solarToLunar } from '@/lib/lunar';
import { nanoid } from 'nanoid';

// 簡單的本地儲存（生產環境應用 PostgreSQL）
const reports = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, birthDate, birthTime, gender, isLunar } = body;

    // 驗證日期
    if (!isValidDate(birthDate, birthTime)) {
      return NextResponse.json({ error: '無效的日期格式' }, { status: 400 });
    }

    let solarDate = new Date(birthDate);
    
    // 如果是農曆，轉換為國曆
    if (isLunar) {
      const parts = birthDate.split('-').map(Number);
      const lunar = solarToLunar(new Date(parts[0], parts[1] - 1, parts[2]));
      // 這裡需要反向查找，簡化處理：直接用 solarToLunar 的結果
      const converted = lunarToSolar(lunar.year, lunar.month, lunar.day, lunar.isLeap);
      solarDate = converted;
    }

    const seed = parseInt(`${solarDate.getFullYear()}${solarDate.getMonth() + 1}${solarDate.getDate()}${birthTime.replace(':', '')}`);

    const report = {
      id: nanoid(),
      birthInfo: { name, birthDate, birthTime, gender, isLunar },
      ziwu: calculateZiwuChart(solarDate, birthTime),
      bazi: calculateBaziChart(solarDate, birthTime),
      tarot: null, // 塔羅需要用戶主動抽取
      lifePath: calculateLifePath(solarDate),
      zodiac: calculateZodiac(solarDate),
      createdAt: new Date().toISOString(),
      sharedId: nanoid(10),
    };

    reports.set(report.id, report);

    return NextResponse.json({ success: true, reportId: report.id, sharedId: report.sharedId });
  } catch (error) {
    console.error('Fortune generation error:', error);
    return NextResponse.json({ error: '生成失敗' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reportId = searchParams.get('id');
  const sharedId = searchParams.get('sharedId');

  if (reportId) {
    const report = reports.get(reportId);
    if (!report) return NextResponse.json({ error: '找不到報告' }, { status: 404 });
    return NextResponse.json(report);
  }

  if (sharedId) {
    for (const report of reports.values()) {
      if (report.sharedId === sharedId) {
        return NextResponse.json(report);
      }
    }
    return NextResponse.json({ error: '找不到分享的報告' }, { status: 404 });
  }

  return NextResponse.json({ error: '需要提供 id 或 sharedId' }, { status: 400 });
}