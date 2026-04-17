'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { FortuneReport } from '@/types';
import LZString from 'lz-string';
import ZiwuChartDisplay from '@/components/ZiwuChart';
import BaziChartDisplay from '@/components/BaziChart';
import LifePathDisplay from '@/components/LifePathDisplay';
import ZodiacDisplay from '@/components/ZodiacDisplay';

type Tab = 'ziwu' | 'bazi' | 'lifepath' | 'zodiac';

function ReportContent() {
  const searchParams = useSearchParams();
  const dataParam = searchParams.get('data');
  const sharedId = searchParams.get('sharedId');
  const [report, setReport] = useState<FortuneReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('ziwu');

  useEffect(() => {
    let loaded = false;

    // Priority 1: ?data= — lz-string URL-encoded full report (cross-browser, cold-start safe)
    if (dataParam) {
      try {
        const decompressed = LZString.decompressFromEncodedURIComponent(dataParam);
        if (decompressed) {
          const parsed = JSON.parse(decompressed) as FortuneReport;
          setReport(parsed);
          loaded = true;
        }
      } catch {
        // invalid data — try next source
      }
    }
    // Priority 2: ?sharedId= — localStorage (same browser that generated report)
    if (!loaded && sharedId) {
      const stored = localStorage.getItem(`fortune_report_${sharedId}`);
      if (stored) {
        try {
          setReport(JSON.parse(stored));
          loaded = true;
        } catch {
          // invalid
        }
      }
    }

    setLoading(false);
  }, [dataParam, sharedId]);

  if (loading) {
    return (
      <div className="text-xl text-gray-500">載入中...</div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-red-500 mb-6">找不到報告，請重新生成</p>
        <p className="text-gray-500 mb-6">分享連結已過期，請重新從首頁生成報告</p>
        <a
          href="/"
          className="inline-block py-3 px-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all"
        >
          回到首頁
        </a>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'ziwu', label: '紫微斗數' },
    { key: 'bazi', label: '八字命盤' },
    { key: 'lifepath', label: '生命靈數' },
    { key: 'zodiac', label: '生肖星座' },
  ];

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {report.birthInfo.name || '命理報告'}
        </h2>
        <p className="text-gray-500">
          {report.birthInfo.birthDate} {report.birthInfo.birthTime}
        </p>
        <p className="text-sm text-purple-600 mt-2">✨ 分享報告</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg mb-6">
        <div className="flex border-b overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-purple-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {activeTab === 'ziwu' && report.ziwu && <ZiwuChartDisplay chart={report.ziwu} />}
        {activeTab === 'bazi' && report.bazi && <BaziChartDisplay chart={report.bazi} />}
        {activeTab === 'lifepath' && report.lifePath && <LifePathDisplay result={report.lifePath} />}
        {activeTab === 'zodiac' && report.zodiac && <ZodiacDisplay result={report.zodiac} />}
      </div>
    </>
  );
}

export default function ReportPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Suspense fallback={<div className="text-xl text-gray-500">載入中...</div>}>
          <ReportContent />
        </Suspense>
      </div>
    </main>
  );
}
