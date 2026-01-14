'use client';
 
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input, Button } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import { isValidEmail } from '../../utils';
import { QrCodeDisplay } from '../qr';
import jsQR from 'jsqr';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const router = useRouter();
  const { login, loginWithQr, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [showQrLogin, setShowQrLogin] = useState(false);
  const [qrLoginLoading, setQrLoginLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const scanIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);
 
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setFormErrors((prev) => ({ ...prev, email: '' }));
  };

 
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setFormErrors((prev) => ({ ...prev, password: '' }));
  };

   
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      email: '',
      password: '',
    };
 
    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Invalid email format';
      valid = false;
    }
 
    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[LoginForm] Form submitted');

    if (!validateForm()) {
      console.log('[LoginForm] Form validation failed');
      return;
    }

    console.log('[LoginForm] Form validation passed, attempting login');
    try {
      const success = await login({ email, password });
      console.log('[LoginForm] Login result:', success);

      if (success) {
         
        setEmail('');
        setPassword('');
        console.log('[LoginForm] Login successful');
        
  
        if (onSuccess) {
          onSuccess();
        }
      } else {
        console.error('[LoginForm] Login failed');
      }
    } catch (err) {
      console.error('[LoginForm] Error during login:', err);
    }
  };
 
  const handleButtonClick = () => {
    console.log('[LoginForm] Button clicked directly');
  };

  const startCamera = async () => {
    try {
      setIsScanning(true);
      setScanResult(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Use back camera if available
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Start automatic scanning every 1 second
        scanIntervalRef.current = setInterval(() => {
          if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            const context = canvas.getContext('2d');
            
            if (context) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              context.drawImage(video, 0, 0);
              
              const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
              const code = jsQR(imageData.data, imageData.width, imageData.height);
              
              if (code) {
                setScanResult('QR код обнаружен! Вход в систему...');
                stopCamera();
                
                // Автоматически выполняем вход
                handleQrLoginAuto(code.data);
              }
            }
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setScanResult('Доступ к камере запрещен. Разрешите доступ к камере для сканирования QR кодов.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setIsScanning(false);
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        // Here you would typically use a QR code library to decode the image
        // For now, we'll simulate the process
        return canvas.toDataURL();
      }
    }
    return null;
  };

  const handleScan = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          console.log('[QR Scan] Detected QR code data:', code.data);
          setScanResult('QR код обнаружен! Обработка...');
          setScanResult('QR код успешно обработан!');
          stopCamera();
        } else {
          setScanResult('QR код не найден. Попробуйте еще раз.');
        }
      }
    }
  };

  const handleQrLoginAuto = async (token: string) => {
    try {
      setQrLoginLoading(true);
      
      // Используем loginWithQr из useAuth хука
      const success = await loginWithQr(token.trim());
      
      if (success) {
        // Очищаем результат сканирования после успешного входа
        setScanResult(null);
        
        // Закрываем модальное окно
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setScanResult('Ошибка входа. Попробуйте еще раз.');
        setFormErrors({ email: '', password: 'QR login failed. Please try again.' });
      }
    } catch (error) {
      console.error('QR login error:', error);
      setScanResult('Ошибка входа. Попробуйте еще раз.');
      setFormErrors({ email: '', password: error instanceof Error ? error.message : 'QR login failed. Please try again.' });
    } finally {
      setQrLoginLoading(false);
    }
  };


  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail.trim()) {
      setForgotPasswordMessage({ type: 'error', text: 'Введите email адрес' });
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordMessage(null);

    try {
      const { userService } = await import('../../services');
      const success = await userService.requestPasswordChange({ email: forgotPasswordEmail.trim() });
      
      if (success) {
        setForgotPasswordMessage({ 
          type: 'success', 
          text: 'Email с инструкциями по смене пароля отправлен на ваш адрес' 
        });
        setShowResetPassword(true);
        // Очищаем поля для смены пароля
        setResetToken('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setForgotPasswordMessage({ 
          type: 'error', 
          text: 'Ошибка при отправке запроса. Проверьте email и попробуйте снова' 
        });
      }
    } catch (error) {
      setForgotPasswordMessage({ 
        type: 'error', 
        text: 'Произошла ошибка. Попробуйте позже' 
      });
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Очищаем предыдущие сообщения при новой попытке
    setForgotPasswordMessage(null);
    
    if (!resetToken.trim()) {
      setForgotPasswordMessage({ type: 'error', text: 'Введите 6-значный код' });
      return;
    }

    if (!newPassword.trim()) {
      setForgotPasswordMessage({ type: 'error', text: 'Введите новый пароль' });
      return;
    }

    if (newPassword.length < 6) {
      setForgotPasswordMessage({ type: 'error', text: 'Пароль должен содержать минимум 6 символов' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotPasswordMessage({ type: 'error', text: 'Пароли не совпадают' });
      return;
    }

    setResetPasswordLoading(true);

    try {
      const { userService } = await import('../../services');
      const success = await userService.confirmPasswordChange({ 
        token: resetToken.trim(), 
        newPassword: newPassword.trim() 
      });
      
      if (success) {
        setForgotPasswordMessage({ 
          type: 'success', 
          text: 'Пароль успешно изменен! Перенаправление на страницу входа...' 
        });
        
        // Сброс всех полей
        setResetToken('');
        setNewPassword('');
        setConfirmPassword('');
        setShowResetPassword(false);
        setShowForgotPassword(false);
        
        // Перенаправление через 2 секунды
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          }
        }, 2000);
      } else {
        setForgotPasswordMessage({ 
          type: 'error', 
          text: 'Ошибка при смене пароля. Проверьте код и попробуйте снова' 
        });
      }
    } catch (error) {
      setForgotPasswordMessage({ 
        type: 'error', 
        text: 'Произошла ошибка. Попробуйте позже' 
      });
    } finally {
      setResetPasswordLoading(false);
    }
  };

  return (
    <div className="w-full">
      {!showForgotPassword && !showQrLogin ? (
        <>
          <h2 className="text-2xl font-semibold mb-6 text-center text-white">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              error={formErrors.email}
              fullWidth
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              error={formErrors.password}
              fullWidth
            />

            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              disabled={loading}   
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : "Login"}
            </button>

            {/* Ссылка на смену пароля */}
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(true);
                  // Очищаем все поля при переходе к восстановлению пароля
                  setForgotPasswordEmail('');
                  setResetToken('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setForgotPasswordMessage(null);
                }}
                className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
              >
                Забыли пароль?
              </button>
            </div>

            {/* QR Login Option */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-white/70">Или</span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setShowQrLogin(true)}
                className="mt-4 w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                Войти с QR кодом
              </button>
            </div>
          </form>
        </>
      ) : showQrLogin ? (
        <>
          <h2 className="text-2xl font-semibold mb-6 text-center text-white">QR Code Login</h2>

          {/* Camera Section */}
          <div className="mb-6">
            <div className="bg-black/20 rounded-lg p-4 mb-4">
              {!isScanning ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-white/70 mb-4">Камера не активна</p>
                  <button
                    onClick={startCamera}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                  >
                    Запустить камеру
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 bg-black rounded-lg object-cover"
                  />
                  <canvas
                    ref={canvasRef}
                    className="hidden"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-white border-dashed rounded-lg flex items-center justify-center">
                      <p className="text-white text-sm">Поместите QR код сюда</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={stopCamera}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                    >
                      Остановить камеру
                    </button>
                    <p className="text-center text-white/70 text-sm mt-2">
                      QR код сканируется автоматически
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>


          {/* Status Messages */}
          {scanResult && (
            <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-300 text-center">{scanResult}</p>
            </div>
          )}

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                setShowQrLogin(false);
                stopCamera();
                setScanResult(null);
              }}
              className="text-gray-400 hover:text-gray-300 text-sm transition-colors duration-200"
            >
              Вернуться к обычному входу
            </button>
          </div>
        </>
      ) : !showResetPassword ? (
        <>
          <h2 className="text-2xl font-semibold mb-6 text-center text-white">Восстановление пароля</h2>

          {forgotPasswordMessage && (
            <div className={`mb-6 p-4 rounded-xl border ${
              forgotPasswordMessage.type === 'success' 
                ? 'bg-green-900/50 border-green-700 text-green-300' 
                : 'bg-red-900/50 border-red-700 text-red-300'
            }`}>
              <div className="text-2xl mb-2">
                {forgotPasswordMessage.type === 'success' ? '✅' : '⚠️'}
              </div>
              <p>{forgotPasswordMessage.text}</p>
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={forgotPasswordEmail}
              onChange={(e) => {
                setForgotPasswordEmail(e.target.value);
                // Очищаем сообщения при изменении email
                if (forgotPasswordMessage?.type === 'error') {
                  setForgotPasswordMessage(null);
                }
              }}
              fullWidth
              placeholder="Введите ваш email"
              required
              disabled={forgotPasswordLoading}
            />

            <button
              type="submit"
              disabled={forgotPasswordLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
            >
              {forgotPasswordLoading ? 'Отправка...' : 'Отправить инструкции'}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotPasswordEmail('');
                  setForgotPasswordMessage(null);
                  // Очищаем поля формы входа
                  setEmail('');
                  setPassword('');
                  setFormErrors({ email: '', password: '' });
                }}
                className="text-gray-400 hover:text-gray-300 text-sm transition-colors duration-200"
              >
                Вернуться к входу
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-6 text-center text-white">Смена пароля</h2>

          {forgotPasswordMessage && (
            <div className={`mb-6 p-4 rounded-xl border ${
              forgotPasswordMessage.type === 'success' 
                ? 'bg-green-900/50 border-green-700 text-green-300' 
                : 'bg-red-900/50 border-red-700 text-red-300'
            }`}>
              <div className="text-2xl mb-2">
                {forgotPasswordMessage.type === 'success' ? '✅' : '⚠️'}
              </div>
              <p>{forgotPasswordMessage.text}</p>
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <Input
              label="6-значный код"
              type="text"
              value={resetToken}
              onChange={(e) => {
                setResetToken(e.target.value);
                // Очищаем сообщения при изменении кода
                if (forgotPasswordMessage?.type === 'error') {
                  setForgotPasswordMessage(null);
                }
              }}
              fullWidth
              placeholder="Введите код из email"
              maxLength={6}
              required
              disabled={resetPasswordLoading}
            />

            <Input
              label="Новый пароль"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                // Очищаем сообщения при изменении пароля
                if (forgotPasswordMessage?.type === 'error') {
                  setForgotPasswordMessage(null);
                }
              }}
              fullWidth
              placeholder="Минимум 6 символов"
              minLength={6}
              required
              disabled={resetPasswordLoading}
            />

            <Input
              label="Подтвердите пароль"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                // Очищаем сообщения при изменении подтверждения пароля
                if (forgotPasswordMessage?.type === 'error') {
                  setForgotPasswordMessage(null);
                }
              }}
              fullWidth
              placeholder="Повторите пароль"
              required
              disabled={resetPasswordLoading}
            />

            <button
              type="submit"
              disabled={resetPasswordLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
            >
              {resetPasswordLoading ? 'Смена пароля...' : 'Сменить пароль'}
            </button>

            <div className="text-center mt-4 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setShowResetPassword(false);
                  setResetToken('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setForgotPasswordMessage(null);
                  // Очищаем email для повторной отправки
                  setForgotPasswordEmail('');
                }}
                className="block text-blue-400 hover:text-blue-300 transition-colors duration-300"
              >
                Запросить новый код
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setShowResetPassword(false);
                  setForgotPasswordEmail('');
                  setResetToken('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setForgotPasswordMessage(null);
                  // Очищаем поля формы входа
                  setEmail('');
                  setPassword('');
                  setFormErrors({ email: '', password: '' });
                }}
                className="block text-gray-400 hover:text-gray-300 transition-colors duration-300"
              >
                Вернуться к входу
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};
