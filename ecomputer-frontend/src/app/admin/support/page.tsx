'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '../../../components';
import { useAuthContext } from '../../../context';
import { UserRole } from '../../../types/user';

interface SupportTicket {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  user: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AdminSupportPage() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'in-progress' | 'resolved'>('all');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/admin/support');
    } else if (!loading && user && user.role !== UserRole.Admin) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === UserRole.Admin) {
      loadTickets();
    }
  }, [user]);

  const loadTickets = async () => {
    setTicketsLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockTickets: SupportTicket[] = [
        {
          id: 1,
          title: 'Payment processing issue',
          description: 'Customer reported that payment is not going through during checkout process.',
          status: 'open',
          priority: 'high',
          category: 'Payment',
          user: {
            name: 'John Doe',
            email: 'john@example.com'
          },
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          title: 'Product not showing in search',
          description: 'Newly added products are not appearing in search results.',
          status: 'in-progress',
          priority: 'medium',
          category: 'Technical',
          user: {
            name: 'Jane Smith',
            email: 'jane@example.com'
          },
          createdAt: '2024-01-14T15:45:00Z',
          updatedAt: '2024-01-15T09:20:00Z'
        },
        {
          id: 3,
          title: 'Order tracking not working',
          description: 'Order tracking system is down and customers cannot track their orders.',
          status: 'resolved',
          priority: 'urgent',
          category: 'Orders',
          user: {
            name: 'Mike Johnson',
            email: 'mike@example.com'
          },
          createdAt: '2024-01-13T08:15:00Z',
          updatedAt: '2024-01-14T16:30:00Z'
        },
        {
          id: 4,
          title: 'Account login problems',
          description: 'Multiple users reporting issues with account login and password reset.',
          status: 'open',
          priority: 'high',
          category: 'Account',
          user: {
            name: 'Sarah Wilson',
            email: 'sarah@example.com'
          },
          createdAt: '2024-01-15T12:00:00Z',
          updatedAt: '2024-01-15T12:00:00Z'
        }
      ];
      
      setTickets(mockTickets);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setTicketsLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: number, status: SupportTicket['status']) => {
    try {
      // Mock API call - replace with actual implementation
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status, updatedAt: new Date().toISOString() } : ticket
      ));
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'in-progress': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'resolved': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'closed': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const filteredTickets = tickets.filter(ticket => 
    filter === 'all' ? true : ticket.status === filter
  );

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  };

  if (loading) {
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
                <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white bg-gradient-to-r from-gray-300 to-slate-300 bg-clip-text text-transparent">
                  Support
                </h1>
                <p className="text-white/70 text-lg mt-2">
                  Manage customer support tickets and inquiries
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Total Tickets</p>
                  <p className="text-3xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="p-3 bg-gray-600/20 rounded-xl">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Open</p>
                  <p className="text-3xl font-bold text-yellow-400">{stats.open}</p>
                </div>
                <div className="p-3 bg-yellow-400/20 rounded-xl">
                  <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">In Progress</p>
                  <p className="text-3xl font-bold text-blue-400">{stats.inProgress}</p>
                </div>
                <div className="p-3 bg-blue-400/20 rounded-xl">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Resolved</p>
                  <p className="text-3xl font-bold text-green-400">{stats.resolved}</p>
                </div>
                <div className="p-3 bg-green-400/20 rounded-xl">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-2 mb-6">
            {[
              { key: 'all', label: 'All Tickets' },
              { key: 'open', label: 'Open' },
              { key: 'in-progress', label: 'In Progress' },
              { key: 'resolved', label: 'Resolved' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  filter === tab.key
                    ? 'bg-gray-600 text-white shadow-lg'
                    : 'bg-black/30 text-white/70 hover:bg-black/40 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tickets List */}
          <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
            {ticketsLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/10 border-t-indigo-500 border-r-purple-500 border-b-pink-500 mx-auto"></div>
                <p className="text-white/70 mt-4">Loading tickets...</p>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-white/70 text-lg">No tickets found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-white/90 font-medium">Ticket</th>
                      <th className="px-6 py-4 text-left text-white/90 font-medium">User</th>
                      <th className="px-6 py-4 text-left text-white/90 font-medium">Category</th>
                      <th className="px-6 py-4 text-left text-white/90 font-medium">Priority</th>
                      <th className="px-6 py-4 text-left text-white/90 font-medium">Status</th>
                      <th className="px-6 py-4 text-left text-white/90 font-medium">Created</th>
                      <th className="px-6 py-4 text-left text-white/90 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-black/10 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white font-medium">{ticket.title}</p>
                            <p className="text-white/60 text-sm mt-1 line-clamp-2">{ticket.description}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white">{ticket.user.name}</p>
                            <p className="text-white/60 text-sm">{ticket.user.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-gray-600/20 text-white/90 rounded-full text-sm">
                            {ticket.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm border ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={ticket.status}
                            onChange={(e) => updateTicketStatus(ticket.id, e.target.value as SupportTicket['status'])}
                            className={`px-3 py-1 rounded-full text-sm border bg-transparent ${getStatusColor(ticket.status)}`}
                          >
                            <option value="open">Open</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white/70 text-sm">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedTicket(ticket)}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all duration-300 text-sm"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Ticket Details Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-black/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Ticket #{selectedTicket.id}</h2>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{selectedTicket.title}</h3>
                    <p className="text-white/70">{selectedTicket.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/60 text-sm">User</p>
                      <p className="text-white">{selectedTicket.user.name}</p>
                      <p className="text-white/70 text-sm">{selectedTicket.user.email}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Category</p>
                      <p className="text-white">{selectedTicket.category}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Priority</p>
                      <span className={`px-3 py-1 rounded-full text-sm border ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority}
                      </span>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Status</p>
                      <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(selectedTicket.status)}`}>
                        {selectedTicket.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/60 text-sm">Created</p>
                      <p className="text-white">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Updated</p>
                      <p className="text-white">{new Date(selectedTicket.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all duration-300"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        // TODO: Implement reply functionality
                        console.log('Reply to ticket:', selectedTicket.id);
                      }}
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all duration-300"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
