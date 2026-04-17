'use client';

import { TarotCard } from '@/types';

interface TarotDisplayProps {
  card: TarotCard;
}

export default function TarotDisplay({ card }: TarotDisplayProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-purple-800 mb-6 text-center">塔羅占卜結果</h3>
      <div className="flex flex-col items-center">
        <div className={`relative inline-block ${card.reversed ? 'rotate-180' : ''}`}>
          <div className="w-48 h-72 mx-auto bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-xl shadow-lg border-4 border-yellow-400 flex flex-col items-center justify-center p-4">
            <div className="text-5xl mb-3">🎴</div>
            <div className="text-xl font-bold text-purple-800 text-center">{card.name}</div>
            <div className="text-sm text-gray-500">{card.nameEn}</div>
            {card.reversed && (
              <div className="mt-2 px-2 py-1 bg-red-100 text-red-600 text-xs rounded">逆位</div>
            )}
          </div>
        </div>
        <div className="mt-6 w-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-100">
          <div className="text-sm text-purple-500 mb-2 font-medium">牌義解讀</div>
          <div className="text-gray-800 text-lg leading-relaxed">{card.meaning}</div>
        </div>
      </div>
    </div>
  );
}