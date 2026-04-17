import { NextRequest, NextResponse } from 'next/server';
import { drawTarotCard } from '@/lib/fortune';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { seed } = body;

    const card = drawTarotCard(seed || Date.now());
    return NextResponse.json({ success: true, card });
  } catch (error) {
    return NextResponse.json({ error: '抽取失敗' }, { status: 500 });
  }
}