'use client';

import { useState } from 'react';
import FortuneForm from '@/components/FortuneForm';
import ZiwuChartDisplay from '@/components/ZiwuChart';
import BaziChartDisplay from '@/components/BaziChart';
import TarotDraw from '@/components/TarotDraw';
import LifePathDisplay from '@/components/LifePathDisplay';
import ZodiacDisplay from '@/components/ZodiacDisplay';
import PDFExport from '@/components/PDFExport';
import { FortuneReport, BirthInfo, TarotCard } from '@/types';
import LZString from 'lz-string';

type Tab = 'ziwu' | 'bazi' | 'tarot' | 'lifepath' | 'zodiac';

export default function Home() {
  const [report, setReport] = useState<FortuneReport | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('ziwu');
  const [tarotCard, setTarotCard] = useState<TarotCard | null>(null);

  const handleSubmit = async (data: BirthInfo) => {
    try {
      const response = await fetch('/api/fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        alert(error.error || '生成失敗');
        return;
      }

      const result = await response.json();
      
      if (!result.success || !result.report) {
        alert(result.error || '生成失敗');
        return;
      }

      const reportData = result.report;

      // 直接從 POST response 取得 report 並寫入 localStorage（不再呼叫 GET API）
      localStorage.setItem(`fortune_report_${reportData.sharedId}`, JSON.stringify(reportData));
      localStorage.setItem(`fortune_report_${reportData.id}`, JSON.stringify(reportData));
      // 保存壓縮分享 URL（跨瀏覽器可用，不受 server cold start 影響）
      const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(reportData));
      localStorage.setItem(`fortune_report_${reportData.sharedId}_url`, `${window.location.origin}/report?data=${compressed}`);
      const existing = JSON.parse(localStorage.getItem('fortune_reports') || '[]');
      if (!existing.includes(reportData.id)) {
        localStorage.setItem('fortune_reports', JSON.stringify([reportData.id, ...existing]));
      }

      setReport(reportData);
    } catch (error) {
      console.error('Error:', error);
      alert('發生錯誤，請稍後再試');
    }
  };

  const handleDrawTarot = async () => {
    try {
      const response = await fetch('/api/tarot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seed: Date.now() }),
      });
      const result = await response.json();
      setTarotCard(result.card);
      setReport(prev => prev ? { ...prev, tarot: result.card } : prev);
    } catch (error) {
      console.error('Tarot draw error:', error);
      return null;
    }
  };

  const handleShare = async () => {
    if (!report) return;
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(report));
    const shareUrl = `${window.location.origin}/report?data=${compressed}`;
    try { await navigator.clipboard.writeText(shareUrl); } catch {}
    window.location.href = shareUrl;
  };

  if (!report) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white text-center mb-2">全方位的命理分析</h1>
          <p className="text-purple-200 text-center mb-8">紫微斗數 · 八字命盤 · 塔羅占卜 · 生命靈數 · 生肖星座</p>
          <FortuneForm onSubmit={handleSubmit} />
        </div>
      </main>
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
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {report.birthInfo.name || '命理報告'}
              </h2>
              <p className="text-gray-500">
                {report.birthInfo.birthDate} {report.birthInfo.birthTime} · 
                {report.birthInfo.isLunar ? '農曆' : '國曆'}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.href = '/my-reports'}
                className="py-2 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all"
              >
                📋 我的報告
              </button>
              <button
                onClick={handleShare}
                className="py-2 px-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-all"
              >
                🔗 分享
              </button>
              <PDFExport report={report} />
            </div>
          </div>
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
          {activeTab === 'tarot' && (
            <TarotDraw onDraw={handleDrawTarot} />
          )}
          {activeTab === 'lifepath' && report.lifePath && <LifePathDisplay result={report.lifePath} />}
          {activeTab === 'zodiac' && report.zodiac && <ZodiacDisplay result={report.zodiac} />}
        </div>
      </div>
    </main>
  );
}