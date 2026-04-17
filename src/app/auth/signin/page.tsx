'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('帳號或密碼錯誤');
      } else {
        // 保存 email 到 localStorage 作为用户标识
        localStorage.setItem('fortune_user_email', email);
        localStorage.setItem('fortune_user_id', email); // 用 email 作为 userId
        window.location.href = '/';
      }
    } catch {
      setError('登入失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">命理會員登入</h1>
          <p className="text-gray-500">登入以保存和查看你的命理報告</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">電子信箱</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              placeholder="demo@fortune.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密碼</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              placeholder="fortune2026"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg shadow hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 transition-all"
          >
            {loading ? '登入中...' : '登入'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-700 font-medium mb-2">測試帳號</p>
          <p className="text-xs text-purple-600">帳號：demo@fortune.com</p>
          <p className="text-xs text-purple-600">密碼：fortune2026</p>
        </div>

        <div className="mt-4 text-center">
          <a href="/" className="text-sm text-gray-500 hover:text-purple-600 transition-colors">
            ← 先不登入，直接使用
          </a>
        </div>
      </div>
    </main>
  );
}
