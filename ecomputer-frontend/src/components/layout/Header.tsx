'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { useCartContext } from '../../context';
import { UserRole } from '../../types';
import { LoginForm, RegisterForm, LanguageSwitcher } from '../index';
import { AnimatedParticles } from '../ui/AnimatedParticles';
import { Icons } from '../ui/icons';

export const Header: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useTranslation();
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCartContext();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'login' | 'register' | null>(null);

  const { Close: CloseIcon, Cart: CartIcon } = Icons; 
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const translate = (key: string) => {
    if (!isMounted) {
      const fallbacks: { [key: string]: string } = {
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        cart: 'Cart',
        products: 'Products',
        profile: 'Profile',
        admin_panel: 'Admin Panel',
        orders: 'Orders',
        favorites: 'Favorites',
        home: 'Home'
      };
      return fallbacks[key] || key;
    }
    try {
      return t(key);
    } catch {
      const fallbacks: { [key: string]: string } = {
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        cart: 'Cart',
        products: 'Products',
        profile: 'Profile',
        admin_panel: 'Admin Panel',
        orders: 'Orders',
        favorites: 'Favorites',
        home: 'Home'
      };
      return fallbacks[key] || key;
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleLogout = async () => await logout();
  const openModal = (modal: 'login' | 'register') => setActiveModal(modal);
  const closeModals = () => setActiveModal(null);

  const navLinks = [];
  if (isAuthenticated) {
    navLinks.push(
      { href: '/products', label: translate('products') },
      { href: '/profile', label: translate('profile') },
    );
    if (user?.role === UserRole.Admin) {
      navLinks.push({ href: '/admin', label: translate('admin_panel') });
    } else {
      navLinks.push({ href: '/orders', label: translate('orders') });
      navLinks.push({ href: '/favorites', label: translate('favorites') });
    }
  }

  return (
    <>
      <header className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-950 backdrop-blur-xl border-b border-white/10 shadow-2xl sticky top-0 z-50 relative overflow-hidden">
        <AnimatedParticles count={15} />

        <div className="container mx-auto px-4 py-4 relative z-10">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold flex items-center group">
              <span className="mr-2 text-purple-400 group-hover:text-purple-300 transition-colors duration-300">TECH</span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
                ZONE
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`text-white/80 hover:text-purple-300 transition-all duration-300 relative group ${pathname === href ? 'text-purple-300' : ''}`}
                >
                  {label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}

              {isAuthenticated && (
                <Link
                  href="/cart"
                  className="relative flex items-center space-x-2 text-white/80 hover:text-purple-300 transition-all duration-300 group"
                >
                  <CartIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  <span>{translate('cart')}</span>
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <button onClick={handleLogout} className="text-white/80 hover:text-red-400 transition-all duration-300 hover:scale-105 font-medium">
                    {translate('logout')}
                  </button>
                  <LanguageSwitcher />
                </>
              ) : (
                <>
                  <button onClick={() => openModal('login')} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer">
                    {translate('login')}
                  </button>
                  <button onClick={() => openModal('register')} className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer">
                    {translate('register')}
                  </button>
                  <LanguageSwitcher />
                </>
              )}
            </nav>

            <button
              className="md:hidden text-white/80 hover:text-purple-300 transition-colors duration-300"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <CloseIcon className="w-6 h-6" /> : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {isMenuOpen && (
            <nav className="md:hidden mt-4 space-y-4 bg-black/50 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`block text-white/80 hover:text-purple-300 transition-all duration-300 ${pathname === href ? 'text-purple-300' : ''}`}
                >
                  {label}
                </Link>
              ))}

              {isAuthenticated && (
                <Link href="/cart" className="flex items-center space-x-2 text-white/80 hover:text-purple-300 transition-all duration-300">
                  <CartIcon className="w-5 h-5" />
                  <span>{translate('cart')}</span>
                  {totalItems > 0 && (
                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-1 animate-pulse shadow-lg">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <button onClick={handleLogout} className="block w-full text-left text-white/80 hover:text-red-400 transition-all duration-300 font-medium">
                    {translate('logout')}
                  </button>
                  <div className="flex justify-center py-2">
                    <LanguageSwitcher />
                  </div>
                </>
              ) : (
                <>
                  <button onClick={() => openModal('login')} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg w-full text-left cursor-pointer">
                    {translate('login')}
                  </button>
                  <button onClick={() => openModal('register')} className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg w-full text-left mt-2 cursor-pointer">
                    {translate('register')}
                  </button>
                  <div className="flex justify-center py-2">
                    <LanguageSwitcher />
                  </div>
                </>
              )}
            </nav>
          )}
        </div>
      </header>

      {activeModal === 'login' && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999]" onClick={closeModals}></div>
          <div className="fixed inset-0 flex items-center justify-center z-[100000] p-4">
            <div className="w-full max-w-md">
              <div className="bg-gradient-to-br from-slate-950 to-purple-950 rounded-2xl shadow-2xl border border-white/10 p-8 relative backdrop-blur-xl">
                <button onClick={closeModals} className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors duration-300 p-2">
                  <CloseIcon className="w-6 h-6" />
                </button>
                <LoginForm onSuccess={closeModals} />
                <div className="text-center pb-4 mt-4">
                  <p className="text-white/60">
                    Don't have an account?{' '}
                    <button onClick={() => openModal('register')} className="text-purple-300 hover:text-purple-200 transition-colors duration-300 underline">
                      Register here
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeModal === 'register' && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999]" onClick={closeModals}></div>
          <div className="fixed inset-0 flex items-center justify-center z-[100000] p-4">
            <div className="w-full max-w-md">
              <div className="bg-gradient-to-br from-slate-950 to-purple-950 rounded-2xl shadow-2xl border border-white/10 p-8 relative backdrop-blur-xl">
                <button onClick={closeModals} className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors duration-300 p-2">
                  <CloseIcon className="w-6 h-6" />
                </button>
                <RegisterForm onSuccess={closeModals} />
                <div className="text-center pb-4 mt-4">
                  <p className="text-white/60">
                    Already have an account?{' '}
                    <button onClick={() => openModal('login')} className="text-purple-300 hover:text-purple-200 transition-colors duration-300 underline">
                      Login here
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
