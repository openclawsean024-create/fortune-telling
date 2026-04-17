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

    reportStore.set(report.id, report);
    reportStore.set(report.sharedId, report);

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
    const report = reportStore.get(reportId);
    if (!report) {
      // Try to regenerate from query params
      return NextResponse.json({ error: '報告已過期，請重新生成' }, { status: 404 });
    }
    return NextResponse.json(report);
  }

  if (sharedId) {
    const report = reportStore.get(sharedId);
    if (!report) {
      return NextResponse.json({ error: '分享的報告已過期' }, { status: 404 });
    }
    return NextResponse.json(report);
  }

  return NextResponse.json({ error: '需要提供 id 或 sharedId' }, { status: 400 });
}