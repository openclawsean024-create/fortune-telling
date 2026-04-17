'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { FortuneReport } from '@/types';
import ZiwuChartDisplay from '@/components/ZiwuChart';
import BaziChartDisplay from '@/components/BaziChart';
import LifePathDisplay from '@/components/LifePathDisplay';
import ZodiacDisplay from '@/components/ZodiacDisplay';
import TarotDisplay from '@/components/TarotDisplay';

type Tab = 'ziwu' | 'bazi' | 'tarot' | 'lifepath' | 'zodiac';

function ReportContent() {
  const searchParams = useSearchParams();
  const dataParam = searchParams.get('data');
  const sharedId = searchParams.get('sharedId');
  const [report, setReport] = useState<FortuneReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('ziwu');

  useEffect(() => {
    let found = false;

    // base64url 解碼（cold-start 可靠，data 內嵌 URL）
    if (dataParam) {
      try {
        const base64 = dataParam.replace(/-/g, '+').replace(/_/g, '/');
        const jsonStr = decodeURIComponent(escape(atob(base64)));
        const parsed = JSON.parse(jsonStr) as FortuneReport;
        setReport(parsed);
        found = true;
      } catch (e) {
        console.error('[Report] ?data= decode error:', e);
      }
    }

    // 回退：讀取 ?sharedId=（舊格式，仍支援）
    if (!found && sharedId) {
      const stored = localStorage.getItem(`fortune_report_${sharedId}`);
      if (stored) {
        try {
          setReport(JSON.parse(stored));
          found = true;
        } catch {
          console.error('[Report] ?sharedId= localStorage parse error');
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
    { key: 'tarot', label: '塔羅占卜' },
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
        {activeTab === 'tarot' && report.tarot && <TarotDisplay card={report.tarot} />}
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