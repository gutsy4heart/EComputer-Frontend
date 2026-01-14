'use client';

import React, { useState } from 'react';
import { Layout } from '../../components';
import { userService } from '../../services';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Введите email адрес' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const success = await userService.requestPasswordChange({ email: email.trim() });
      
      if (success) {
        setMessage({ 
          type: 'success', 
          text: 'Email с инструкциями по смене пароля отправлен на ваш адрес' 
        });
        setEmail('');
      } else {
        setMessage({ 
          type: 'error', 
          text: 'Ошибка при отправке запроса. Проверьте email и попробуйте снова' 
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
                Восстановление пароля
              </h2>
              <p className="text-gray-300">
                Введите ваш email для получения инструкций
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
                <label htmlFor="email" className="block text-gray-300 mb-2 font-medium">
                  Email адрес
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  placeholder="Введите ваш email"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
              >
                {loading ? 'Отправка...' : 'Отправить инструкции'}
              </button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <a 
                href="/login" 
                className="block text-blue-400 hover:text-blue-300 transition-colors duration-300"
              >
                Вернуться к входу
              </a>
              <a 
                href="/register" 
                className="block text-gray-400 hover:text-gray-300 transition-colors duration-300"
              >
                Создать аккаунт
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
