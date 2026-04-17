'use client';

import { useState } from 'react';
import { TarotCard } from '@/types';

interface TarotDrawProps {
  onDraw: () => Promise<TarotCard | null>;
}

export default function TarotDraw({ onDraw }: TarotDrawProps) {
  const [card, setCard] = useState<TarotCard | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleDraw = async () => {
    setIsDrawing(true);
    try {
      const result = await onDraw();
      setCard(result);
    } finally {
      setIsDrawing(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
      <h3 className="text-xl font-bold text-purple-800 mb-4">塔羅占卜</h3>
      
      {!card ? (
        <div className="text-center py-8">
          <button
            onClick={handleDraw}
            disabled={isDrawing}
            className="py-3 px-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all"
          >
            {isDrawing ? '抽取中...' : '抽取一張塔羅牌'}
          </button>
          <p className="mt-4 text-gray-500 text-sm">點擊按鈕，讓命運為你指引方向</p>
        </div>
      ) : (
        <div className="text-center">
          <div className={`relative inline-block ${card.reversed ? 'rotate-180' : ''}`}>
            <div className="w-40 h-64 mx-auto bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-xl shadow-lg border-4 border-yellow-400 flex flex-col items-center justify-center p-4">
              <div className="text-4xl mb-2">🎴</div>
              <div className="text-xl font-bold text-purple-800">{card.name}</div>
              <div className="text-sm text-gray-500">{card.nameEn}</div>
              {card.reversed && (
                <div className="mt-2 px-2 py-1 bg-red-100 text-red-600 text-xs rounded">逆位</div>
              )}
            </div>
          </div>
          <div className="mt-4 bg-white rounded-lg p-4 shadow-sm border border-purple-100">
            <div className="text-sm text-gray-500 mb-1">牌義解讀</div>
            <div className="text-gray-800">{card.meaning}</div>
          </div>
          <button
            onClick={() => setCard(null)}
            className="mt-4 py-2 px-6 bg-purple-100 text-purple-700 font-medium rounded-lg hover:bg-purple-200 transition-all"
          >
            重新抽取
          </button>
        </div>
      )}
    </div>
  );
}