'use client';

import { ZodiacResult } from '@/types';

interface ZodiacDisplayProps {
  result: ZodiacResult;
}

export default function ZodiacDisplay({ result }: ZodiacDisplayProps) {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6">
      <h3 className="text-xl font-bold text-orange-800 mb-4">生肖星座</h3>
      
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full text-white text-3xl font-bold shadow-lg">
          {result.zodiac}
        </div>
        <p className="mt-3 text-gray-700">{result.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-orange-100 text-center">
          <div className="text-sm text-gray-500">五行</div>
          <div className="text-lg font-semibold text-orange-700">{result.element}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-orange-100 text-center">
          <div className="text-sm text-gray-500">幸運數字</div>
          <div className="text-lg font-semibold text-orange-700">{result.luckyNumbers.join(', ')}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-orange-100 text-center">
          <div className="text-sm text-gray-500">幸運色</div>
          <div className="flex justify-center gap-2 mt-1">
            {result.luckyColors.map((c, i) => (
              <span key={i} className="w-6 h-6 rounded-full bg-orange-300" title={c}></span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-lg p-4 shadow-sm border border-orange-100">
        <div className="text-sm text-gray-500 text-center mb-2">最佳配對</div>
        <div className="flex justify-center gap-2">
          {result.compatibleWith.map((z, i) => (
            <span key={i} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">{z}</span>
          ))}
        </div>
      </div>
    </div>
  );
}