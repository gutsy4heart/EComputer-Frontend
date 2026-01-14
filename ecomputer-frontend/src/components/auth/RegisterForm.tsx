'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import { isValidEmail, isValidPassword, isValidName } from '../../utils';
import { QrCodeDisplay } from '../qr';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const router = useRouter();
  const { register, login, loading, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
  });
  const [apiError, setApiError] = useState<string | null>(null);
  const [showQrCode, setShowQrCode] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
 
    setFormErrors(prev => ({ ...prev, [name]: '' }));
 
    if (apiError) setApiError(null);
  };

  const validateField = (name: keyof typeof formData, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Username is required';
        if (!isValidName(value)) return 'Username must be 3-20 characters';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!isValidEmail(value)) return 'Invalid email format';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (!isValidPassword(value)) return 'Password must be at least 8 characters';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      case 'address':
        if (!value.trim()) return 'Address is required';
        return '';
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { ...formErrors };

    (Object.keys(formData) as Array<keyof typeof formData>).forEach(key => {
      const error = validateField(key, formData[key]);
      newErrors[key] = error;
      if (error) isValid = false;
    });

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) return;

    const { name, email, password, address } = formData;
    
    try {
      const registrationResponse = await register({ 
        name, 
        email, 
        password, 
        address,
        role: 0, // Default role for regular users (0 = User, 1 = Admin)
        returnUrl: window.location.origin + '/'
      });

      if (registrationResponse && registrationResponse.qrCodeBase64) {
        // Show QR code modal
        setQrCodeData(registrationResponse.qrCodeBase64);
        setShowQrCode(true);
        setApiError('Registration successful! Your QR code is ready.');
      } else {
        setApiError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'An unexpected error occurred during registration';
      
      if (error instanceof Error) {
        errorMessage = error.message.includes('SMTP') || error.message.includes('email')
          ? 'Registration complete, but we couldn\'t send a confirmation email. You can log in directly.'
          : error.message;
      }

      setApiError(errorMessage);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6 text-center text-white">Create Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={(e) => setFormErrors(prev => ({
            ...prev,
            name: validateField('name', e.target.value)
          }))}
          error={formErrors.name}
          fullWidth
          required
          autoComplete="name"
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={(e) => setFormErrors(prev => ({
            ...prev,
            email: validateField('email', e.target.value)
          }))}
          error={formErrors.email}
          fullWidth
          required
          autoComplete="email"
        />

        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={(e) => setFormErrors(prev => ({
            ...prev,
            password: validateField('password', e.target.value)
          }))}
          error={formErrors.password}
          fullWidth
          required
          autoComplete="new-password"
        />

        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={(e) => setFormErrors(prev => ({
            ...prev,
            confirmPassword: validateField('confirmPassword', e.target.value)
          }))}
          error={formErrors.confirmPassword}
          fullWidth
          required
          autoComplete="new-password"
        />

        <Input
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          onBlur={(e) => setFormErrors(prev => ({
            ...prev,
            address: validateField('address', e.target.value)
          }))}
          error={formErrors.address}
          fullWidth
          required
          autoComplete="street-address"
        />
 
        {(apiError || authError) && (
          <div className={`p-3 rounded-md mb-4 ${
            apiError?.includes('successful') 
              ? 'bg-green-900/20 text-green-400 border border-green-500/30' 
              : 'bg-red-900/20 text-red-400 border border-red-500/30'
          }`}>
            <p className="font-medium">
              {apiError?.includes('successful') ? 'Success!' : 'Error'}
            </p>
            <p>{apiError || authError}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg 
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
          ) : "Register"}
        </button>
      </form>

      {/* QR Code Modal */}
      {showQrCode && qrCodeData && (
        <QrCodeDisplay
          qrCodeBase64={qrCodeData}
          userName={formData.name}
          onClose={() => {
            setShowQrCode(false);
            setQrCodeData(null);
            onSuccess?.();
          }}
        />
      )}
    </div>
  );
};