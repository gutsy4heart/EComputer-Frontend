'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileSettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-purple-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Profile Settings</h1>
          <p className="text-white/70 mb-6">
            This page is under construction. Please use the profile page to manage your settings.
          </p>
          <button
            onClick={() => router.push('/profile')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            Go to Profile
          </button>
        </div>
      </div>
    </div>
  );
}
