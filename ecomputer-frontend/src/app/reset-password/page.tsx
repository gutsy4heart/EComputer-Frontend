'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Layout } from '../../components';
import { userService } from '../../services';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setMessage({ type: 'error', text: 'Токен не найден. Запросите новый код.' });
      return;
    }

    if (!newPassword.trim()) {
      setMessage({ type: 'error', text: 'Введите новый пароль' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Пароль должен содержать минимум 6 символов' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Пароли не совпадают' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const success = await userService.confirmPasswordChange({ 
        token: token.trim(), 
        newPassword: newPassword.trim() 
      });
      
      if (success) {
        setMessage({ 
          type: 'success', 
          text: 'Пароль успешно изменен! Перенаправление на страницу входа...' 
        });
        
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setMessage({ 
          type: 'error', 
          text: 'Ошибка при смене пароля. Проверьте код и попробуйте снова' 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Произошла ошибка. Попробуйте позже' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-2xl border border-gray-600 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                Смена пароля
              </h2>
              <p className="text-gray-300">
                Введите новый пароль
              </p>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-xl border ${
                message.type === 'success' 
                  ? 'bg-green-900/50 border-green-700 text-green-300' 
                  : 'bg-red-900/50 border-red-700 text-red-300'
              }`}>
                <div className="text-2xl mb-2">
                  {message.type === 'success' ? '✅' : '⚠️'}
                </div>
                <p>{message.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-gray-300 mb-2 font-medium">
                  Новый пароль
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  placeholder="Минимум 6 символов"
                  minLength={6}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-gray-300 mb-2 font-medium">
                  Подтвердите пароль
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  placeholder="Повторите пароль"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
              >
                {loading ? 'Смена пароля...' : 'Сменить пароль'}
              </button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <a 
                href="/forgot-password" 
                className="block text-blue-400 hover:text-blue-300 transition-colors duration-300"
              >
                Запросить новый код
              </a>
              <a 
                href="/login" 
                className="block text-gray-400 hover:text-gray-300 transition-colors duration-300"
              >
                Вернуться к входу
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
