import { NextRequest, NextResponse } from 'next/server';
import { calculateZiwuChart, calculateBaziChart, calculateLifePath, calculateZodiac, isValidDate } from '@/lib/fortune';
import { lunarToSolar, solarToLunar } from '@/lib/lunar';
import { nanoid } from 'nanoid';

// In-memory store (per-instance, reset on cold start)
const reportStore = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, birthDate, birthTime, gender, isLunar } = body;

    // Validate date
    if (!isValidDate(birthDate, birthTime)) {
      return NextResponse.json({ error: '無效的日期格式' }, { status: 400 });
    }

    let solarDate = new Date(birthDate);
    
    // Convert lunar to solar if needed
    if (isLunar) {
      const parts = birthDate.split('-').map(Number);
      const lunar = solarToLunar(new Date(parts[0], parts[1] - 1, parts[2]));
      const converted = lunarToSolar(lunar.year, lunar.month, lunar.day, lunar.isLeap);
      solarDate = converted;
    }

    const report = {
      id: nanoid(),
      birthInfo: { name, birthDate, birthTime, gender, isLunar },
      ziwu: calculateZiwuChart(solarDate, birthTime),
      bazi: calculateBaziChart(solarDate, birthTime),
      tarot: null,
      lifePath: calculateLifePath(solarDate),
      zodiac: calculateZodiac(solarDate),
      createdAt: new Date().toISOString(),
      sharedId: nanoid(10),
    };

    // 只保留於 memory（退場，不再依賴 server 持久化分享報告）
    // client 端會在收到 response 後直接 localStorage 持久化
    reportStore.set(report.id, report);
    reportStore.set(report.sharedId, report);

    return NextResponse.json({ success: true, reportId: report.id, sharedId: report.sharedId, report });
  } catch (error) {
    console.error('Fortune generation error:', error);
    return NextResponse.json({ error: '生成失敗' }, { status: 500 });
  }
}

// GET 已停用分享功能（serverless cold start 不穩定）
// 分享報告現在完全由 client-side localStorage 持久化
// 見：src/app/page.tsx（生成時直接 localStorage.setItem）
// 見：src/app/report/page.tsx（讀取時直接 localStorage.getItem）
export async function GET(request: NextRequest) {
  return NextResponse.json({ error: '分享功能已改為 localStorage，請從首頁重新生成報告' }, { status: 410 });
}