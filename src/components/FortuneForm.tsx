'use client';

import { useState } from 'react';
import { BirthInfo } from '@/types';

interface FortuneFormProps {
  onSubmit: (data: BirthInfo) => void;
}

export default function FortuneForm({ onSubmit }: FortuneFormProps) {
  const [formData, setFormData] = useState<BirthInfo>({
    birthDate: '',
    birthTime: '00:00',
    isLunar: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateDate = (dateStr: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.birthDate) {
      newErrors.birthDate = '請選擇出生日期';
    } else if (!validateDate(formData.birthDate)) {
      newErrors.birthDate = '無效的日期格式，請使用 YYYY-MM-DD 格式';
    }

    if (!formData.birthTime) {
      newErrors.birthTime = '請選擇出生時間';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">姓名（選填）</label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
          placeholder="請輸入姓名"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">出生日期（必填）</label>
        <input
          type="date"
          value={formData.birthDate}
          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
          className={`mt-1 block w-full rounded-md border ${errors.birthDate ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-purple-500 focus:ring-purple-500`}
        />
        {errors.birthDate && <p className="mt-1 text-sm text-red-500">{errors.birthDate}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">出生時間（必填）</label>
        <input
          type="time"
          value={formData.birthTime}
          onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
          className={`mt-1 block w-full rounded-md border ${errors.birthTime ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-purple-500 focus:ring-purple-500`}
        />
        {errors.birthTime && <p className="mt-1 text-sm text-red-500">{errors.birthTime}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">性別（選填）</label>
        <select
          value={formData.gender || ''}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' | undefined })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
        >
          <option value="">不透露</option>
          <option value="male">男</option>
          <option value="female">女</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isLunar"
          checked={formData.isLunar}
          onChange={(e) => setFormData({ ...formData, isLunar: e.target.checked })}
          className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
        />
        <label htmlFor="isLunar" className="ml-2 text-sm text-gray-700">使用農曆生日</label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg shadow hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 transition-all"
      >
        {isLoading ? '分析中...' : '開始分析'}
      </button>
    </form>
  );
}