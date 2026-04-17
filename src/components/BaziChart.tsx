'use client';

import { BaziChart } from '@/types';

interface BaziChartProps {
  chart: BaziChart;
}

export default function BaziChartDisplay({ chart }: BaziChartProps) {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6">
      <h3 className="text-xl font-bold text-amber-800 mb-4">八字命盤</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: '年柱', value: chart.年柱 },
            { label: '月柱', value: chart.月柱 },
            { label: '日柱', value: chart.日柱 },
            { label: '時柱', value: chart.時柱 },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-lg p-4 shadow-sm border border-amber-100 text-center">
              <div className="text-xs text-gray-500 mb-1">{item.label}</div>
              <div className="text-lg font-semibold text-amber-700">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-amber-100">
            <div className="text-sm text-gray-500 mb-1">五行分析</div>
            <div className="text-gray-800">{chart.五行分析}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-amber-100">
            <div className="text-sm text-gray-500 mb-1">性格特點</div>
            <div className="text-gray-800">{chart.性格特點}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-amber-100">
            <div className="text-sm text-gray-500 mb-1">事業建議</div>
            <div className="text-gray-800">{chart.事業建議}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-amber-100">
            <div className="text-sm text-gray-500 mb-1">感情建議</div>
            <div className="text-gray-800">{chart.感情建議}</div>
          </div>
        </div>
      </div>
    </div>
  );
}