'use client';

import { ZiwuChart } from '@/types';

interface ZiwuChartProps {
  chart: ZiwuChart;
}

const PALACE_ORDER = [
  '命宮', '兄弟宮', '夫妻宮', '子女宮', '財帛宮', '疾厄宮',
  '遷移宮', '僕役宮', '官祿宮', '田宅宮', '福德宮', '父母宮'
];

export default function ZiwuChartDisplay({ chart }: ZiwuChartProps) {
  const getValue = (key: string): string => {
    switch(key) {
      case '命宮': return chart.mingGong;
      case '兄弟宮': return chart.siblingPalace;
      case '夫妻宮': return chart.spousePalace;
      case '子女宮': return chart.childPalace;
      case '財帛宮': return chart.wealthPalace;
      case '疾厄宮': return chart.healthPalace;
      case '遷移宮': return chart.迁移宫;
      case '僕役宮': return chart.仆役宫;
      case '官祿宮': return chart.官禄宫;
      case '田宅宮': return chart.田宅宫;
      case '福德宮': return chart.福德宫;
      case '父母宮': return chart.父母宫;
      default: return '';
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
      <h3 className="text-xl font-bold text-indigo-800 mb-4">紫微斗數命盤</h3>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {PALACE_ORDER.map((palace) => (
          <div key={palace} className="bg-white rounded-lg p-4 shadow-sm border border-indigo-100 text-center">
            <div className="text-xs text-gray-500 mb-1">{palace}</div>
            <div className="text-lg font-semibold text-indigo-700">{getValue(palace)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}