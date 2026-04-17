'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Report {
  id: string;
  birthInfo: {
    name?: string;
    birthDate: string;
    birthTime: string;
    isLunar: boolean;
  };
  createdAt: string;
  sharedId: string;
}

// 簡化版：用 localStorage 保存的 reportId 列表
function getLocalReports(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('fortune_reports');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveReportId(reportId: string) {
  if (typeof window === 'undefined') return;
  const ids = getLocalReports();
  if (!ids.includes(reportId)) {
    localStorage.setItem('fortune_reports', JSON.stringify([reportId, ...ids]));
  }
}

export default function MyReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('fortune_user_email');
    if (!email) {
      router.push('/auth/signin');
      return;
    }
    setUserEmail(email);

    // 從 localStorage 讀取報告（持久化存儲）
    const reportIds = getLocalReports();
    const loaded: Report[] = [];
    let completed = 0;

    if (reportIds.length === 0) {
      setLoading(false);
      return;
    }

    reportIds.forEach((id) => {
      // 完全從 localStorage 讀取（serverless cold start 不穩定，已停用 API fallback）
      const stored = localStorage.getItem(`fortune_report_${id}`);
      if (stored) {
        try {
          loaded.push(JSON.parse(stored));
        } catch {}
      }
      completed++;
      if (completed === reportIds.length) {
        setReports(loaded.filter(Boolean));
        setLoading(false);
      }
    });

    if (reportIds.length === 0) setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('fortune_user_email');
    localStorage.removeItem('fortune_user_id');
    router.push('/');
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">📋 我的報告</h1>
            <p className="text-gray-500 mt-1">{userEmail}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/')}
              className="py-2 px-4 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition-all"
            >
              + 新報告
            </button>
            <button
              onClick={handleLogout}
              className="py-2 px-4 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all"
            >
              登出
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 text-xl py-16">載入中...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl mb-6">還沒有保存任何報告</p>
            <button
              onClick={() => router.push('/')}
              className="py-3 px-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all"
            >
              開始分析
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map(report => (
              <div
                key={report.id}
                className="bg-white rounded-xl shadow-lg p-6 flex justify-between items-center hover:shadow-xl transition-all cursor-pointer"
                onClick={() => window.location.href = `/report?sharedId=${report.sharedId}`}
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {report.birthInfo.name || '命理報告'}
                  </h3>
                  <p className="text-gray-500 mt-1">
                    {report.birthInfo.birthDate} {report.birthInfo.birthTime}
                    {report.birthInfo.isLunar ? '（農曆）' : '（國曆）'}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    建立於 {formatDate(report.createdAt)}
                  </p>
                </div>
                <div className="text-purple-500">
                  <span className="text-2xl">→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
