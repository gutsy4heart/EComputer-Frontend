'use client';

import React from 'react';
import Link from 'next/link';
import { AnimatedParticles } from '../ui/AnimatedParticles';
import { Icons } from '../ui/icons';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { Shipping, Delivered, CancelIcon, Pending, Cart, Money, Close, Heart } = Icons;

  return (
    <footer className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-purple-950 to-slate-950 border-t border-white/10">
      <AnimatedParticles count={20} particleClassName="absolute w-1 h-1 bg-white/10 rounded-full animate-pulse" />

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* О компании */}
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              EComputer
            </h3>
            <p className="text-white/70 mb-6 leading-relaxed">
              Your one-stop shop for all computer hardware and accessories. Discover amazing products at competitive prices with exceptional service.
            </p>
            <div className="flex space-x-4">
              {/* Соцсети */}
              <a href="#" className="text-white/60 hover:text-purple-300 transition-all duration-300 hover:scale-110">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="#" className="text-white/60 hover:text-pink-300 transition-all duration-300 hover:scale-110">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {['/', '/products', '/cart', '/profile', '/favorites'].map((path, i) => (
                <li key={i}>
                  <Link href={path} className="text-white/80 hover:text-purple-300 transition-all duration-300 hover:translate-x-1 inline-block">
                    {path === '/' ? 'Home' :
                     path === '/products' ? 'Products' :
                     path === '/cart' ? 'Cart' :
                     path === '/profile' ? 'Profile' :
                     'Favorites'}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Contact Us
            </h3>
            <address className="not-italic text-white/80 space-y-3">
              <div className="flex items-center space-x-3">
                <Shipping className="text-purple-400 w-5 h-5" />
                <p>123 Computer Street, Tech City, TC 12345</p>
              </div>
              <div className="flex items-center space-x-3">
                <Money className="text-purple-400 w-5 h-5" />
                <p>info@ecomputer.com</p>
              </div>
              <div className="flex items-center space-x-3">
                <Cart className="text-purple-400 w-5 h-5" />
                <p>(123) 456-7890</p>
              </div>
            </address>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-white/60">
            &copy; {currentYear} EComputer. All rights reserved. | 
            <span className="text-purple-300 ml-1">Built with <Heart className="w-4 h-4 inline" /> for tech enthusiasts</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
