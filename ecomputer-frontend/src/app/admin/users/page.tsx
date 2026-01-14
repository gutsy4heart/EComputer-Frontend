'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '../../../components';
import { useAuthContext } from '../../../context';
import { UserRole } from '../../../types/user';
import { User } from '../../../types/user';
import { AuthService } from '../../../services/auth.service';
import { Icons } from '../../../components/ui/icons';

const authService = AuthService.getInstance();

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/admin/users');
    } else if (!loading && user && user.role !== UserRole.Admin) {
      router.push('/');
    } else if (!loading && user && user.role === UserRole.Admin) {
      loadUsers();
    }
  }, [user, loading, router]);

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      setError(null);

      const fetchedUsers = await authService.getAllUsers();

      if (fetchedUsers) {
        setUsers(fetchedUsers);
      } else {
        setError('Failed to load users');
      }
    } catch (err) {
      console.error('[AdminUsers] Error loading users:', err);
      setError('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  if (loading || usersLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
          {/* Animated background particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 50 }, (_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 py-8 relative z-10">
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/10 border-t-indigo-500 border-r-purple-500 border-b-pink-500"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-indigo-500 opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user || user.role !== UserRole.Admin) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white/5 rounded-full animate-spin" style={{ animationDuration: '30s' }}></div>
          <div className="absolute top-40 right-40 w-24 h-24 border border-white/5 rotate-45 animate-pulse"></div>
          <div className="absolute bottom-40 left-40 w-20 h-20 border border-white/5 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 right-20 w-36 h-36 border border-white/5 rotate-12 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/3 rounded-full animate-spin" style={{ animationDuration: '60s' }}></div>
        </div>

        {/* Animated background particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="p-3 rounded-2xl bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/40 transition-all duration-300 group"
              >
                <Icons.ArrowLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
              </button>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Users Management
                </h1>
                <p className="text-white/70 text-lg mt-2">
                  Manage user accounts and permissions
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards - Only Total Users */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/5 p-6 hover:bg-black/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/40">
                  <Icons.Users className="w-6 h-6 text-purple-300" />
                </div>
                <span className="text-2xl font-bold text-white">{users.length}</span>
              </div>
              <h3 className="text-white font-semibold mb-1">Total Users</h3>
              <p className="text-white/60 text-sm">Registered</p>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8 relative overflow-hidden">
            {/* Inner animated gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-red-600/10 animate-pulse"></div>

            <div className="relative z-10">
              {error ? (
                <div className="text-center py-16">
                  <div className="text-red-400 mb-4">
                    <Icons.Close className="w-16 h-16 mx-auto" />
                  </div>
                  <p className="text-red-200 text-lg font-medium">{error}</p>
                  <button
                    onClick={loadUsers}
                    className="mt-4 bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300"
                  >
                    Try Again
                  </button>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-white/40 text-6xl mb-4">
                    <Icons.Users className="w-16 h-16 mx-auto" />
                  </div>
                  <p className="text-white/60 text-lg font-medium">No users found</p>
                  <p className="text-white/40 text-sm mt-2">Users will appear here when they register</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-4 px-6 text-left text-white font-bold">ID</th>
                        <th className="py-4 px-6 text-left text-white font-bold">Name</th>
                        <th className="py-4 px-6 text-left text-white font-bold">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((userItem, index) => (
                        <tr
                          key={userItem.id}
                          className={`border-b border-white/10 hover:bg-white/5 transition-all duration-300 ${index % 2 === 0 ? 'bg-white/5' : 'bg-white/2'
                            }`}
                        >
                          <td className="py-4 px-6 text-white font-semibold">#{userItem.id}</td>
                          <td className="py-4 px-6 text-white font-medium">{userItem.name}</td>
                          <td className="py-4 px-6 text-indigo-300 font-medium">{userItem.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
