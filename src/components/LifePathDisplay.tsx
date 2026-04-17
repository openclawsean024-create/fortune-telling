'use client';

import { LifePathResult } from '@/types';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

interface LifePathDisplayProps {
  result: LifePathResult;
}

export default function LifePathDisplay({ result }: LifePathDisplayProps) {
  const radarData = [
    { subject: '創造力', value: 80 },
    { subject: '適應力', value: 75 },
    { subject: '洞察力', value: 85 },
    { subject: '執行力', value: 70 },
    { subject: '領導力', value: 60 },
  ];

  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6">
      <h3 className="text-xl font-bold text-teal-800 mb-4">生命靈數</h3>
      
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full text-white text-3xl font-bold shadow-lg">
          {result.number}
        </div>
        <p className="mt-3 text-gray-700">{result.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#94a3b8" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <Radar name="能力" dataKey="value" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-sm text-gray-500">優勢</div>
            <div className="flex flex-wrap gap-2 mt-1">
              {result.strengths.map((s, i) => (
                <span key={i} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">挑戰</div>
            <div className="flex flex-wrap gap-2 mt-1">
              {result.challenges.map((c, i) => (
                <span key={i} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}