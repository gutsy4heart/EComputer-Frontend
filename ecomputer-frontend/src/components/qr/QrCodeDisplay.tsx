'use client';

import React, { useState } from 'react';
import { Icons } from '../ui/icons'; // импортируем наш объект Icons

interface QrCodeDisplayProps {
  qrCodeBase64: string;
  onClose?: () => void;
  userName?: string;
}

export const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({ 
  qrCodeBase64, 
  onClose, 
  userName 
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const link = document.createElement('a');
      link.href = qrCodeBase64;
      link.download = `qr-code-${userName || 'user'}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-950 to-purple-950 rounded-2xl shadow-2xl max-w-sm w-full p-6 relative border border-white/10 backdrop-blur-xl">
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors duration-300 p-2"
            aria-label="Close"
          >
            <Icons.Close className="h-6 w-6" />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Icons.CheckCircle className="text-green-400" /> Регистрация успешна!
          </h2>
          <p className="text-white/70 text-sm">
            Ваш QR код готов. Сохраните его для быстрого входа в будущем.
          </p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-4">
          <div className="bg-white/10 p-3 rounded-xl border border-white/20 shadow-lg">
            <img
              src={qrCodeBase64}
              alt="QR Code for login"
              className="w-28 h-28 object-contain"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/5 rounded-xl p-3 mb-4 border border-white/10">
          <h3 className="font-semibold text-white mb-2 text-sm flex items-center gap-1">
            <Icons.CheckCircle className="text-cyan-300" /> Как использовать QR код:
          </h3>
          <ul className="text-xs text-white/80 space-y-1 list-disc list-inside">
            <li>Сохраните этот QR код на вашем устройстве</li>
            <li>Используйте его для входа без ввода пароля</li>
            <li>Храните в безопасности — он предоставляет доступ к аккаунту</li>
            <li>Вы всегда можете сгенерировать новый в профиле</li>
          </ul>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2 text-sm"
          >
            {isDownloading ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Скачивание...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Icons.Shopping className="h-4 w-4" />
                Скачать QR код
              </div>
            )}
          </button>
        </div>

        {/* Continue button */}
        <div>
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-sm flex items-center justify-center gap-2"
          >
            <Icons.CheckCircle className="h-4 w-4" /> Перейти к входу
          </button>
        </div>
      </div>
    </div>
  );
};
