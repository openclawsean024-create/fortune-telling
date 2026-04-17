import { NextRequest, NextResponse } from 'next/server';

// 簡單的本地儲存（生產環境應用 PostgreSQL/Supabase）
const reports = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportId, userId } = body;

    const report = reports.get(reportId);
    if (!report) return NextResponse.json({ error: '找不到報告' }, { status: 404 });

    if (userId) {
      report.userId = userId;
      reports.set(reportId, report);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: '保存失敗' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) return NextResponse.json({ error: '需要 userId' }, { status: 400 });

  const userReports = Array.from(reports.values()).filter(r => r.userId === userId);
  return NextResponse.json({ reports: userReports });
}