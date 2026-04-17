'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FortuneReport } from '@/types';
import ZiwuChartDisplay from '@/components/ZiwuChart';
import BaziChartDisplay from '@/components/BaziChart';
import LifePathDisplay from '@/components/LifePathDisplay';
import ZodiacDisplay from '@/components/ZodiacDisplay';

type Tab = 'ziwu' | 'bazi' | 'lifepath' | 'zodiac';

export default function SharePage() {
  const searchParams = useSearchParams();
  const sharedId = searchParams.get('sharedId');
  const [report, setReport] = useState<FortuneReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('ziwu');

  useEffect(() => {
    if (sharedId) {
      fetch(`/api/fortune?sharedId=${sharedId}`)
        .then(res => res.json())
        .then(data => {
          setReport(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [sharedId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-500">載入中...</div>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-500">找不到報告</div>
      </main>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'ziwu', label: '紫微斗數' },
    { key: 'bazi', label: '八字命盤' },
    { key: 'lifepath', label: '生命靈數' },
    { key: 'zodiac', label: '生肖星座' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
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
      </div>
    </main>
  );
}