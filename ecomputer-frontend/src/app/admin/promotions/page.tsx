'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '../../../components';
import { useAuthContext } from '../../../context';
import { UserRole } from '../../../types/user';
import { Coupon, Discount, PromoCode } from '../../../types/promotion';
import { promotionService } from '../../../services/promotion.service';
import { ProductService } from '../../../services/product.service';
import PromotionModal from '../../../components/admin/PromotionModal';
import { Icons } from '../../../components/ui/icons';

export default function AdminPromotionsPage() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'coupons' | 'discounts' | 'promocodes'>('coupons');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [products, setProducts] = useState<Array<{ id: number; name: string; price?: number; categoryName?: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Coupon | Discount | PromoCode | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/admin/promotions');
    } else if (!loading && user && user.role !== UserRole.Admin) {
      router.push('/');
    } else if (!loading && user && user.role === UserRole.Admin) {
      loadData();
    }
  }, [user, loading, router]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [couponsData, discountsData, promoCodesData, productsData] = await Promise.all([
        promotionService.getCoupons(),
        promotionService.getDiscounts(),
        promotionService.getPromoCodes(),
        ProductService.getInstance().getAllProducts()
      ]);
      
      console.log('[AdminPromotions] Loaded data:', { 
        couponsCount: Array.isArray(couponsData) ? couponsData.length : 0,
        discountsCount: Array.isArray(discountsData) ? discountsData.length : 0,
        promoCodesCount: Array.isArray(promoCodesData) ? promoCodesData.length : 0,
        productsCount: Array.isArray(productsData) ? productsData.length : 0
      });
      
      setCoupons(couponsData || []);
      setDiscounts(discountsData || []);
      setPromoCodes(promoCodesData || []);
      
      // Загружаем реальные продукты из API
      if (Array.isArray(productsData)) {
        const formattedProducts = productsData.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          categoryName: product.categoryName || product.category?.name
        }));
        setProducts(formattedProducts);
        console.log('[AdminPromotions] Loaded products:', formattedProducts);
      } else {
        console.warn('[AdminPromotions] No products data received');
        setProducts([]);
      }
    } catch (err) {
      console.error('[AdminPromotions] Error loading data:', err);
      setError('Failed to load promotions data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    try {
      // Определяем тип промоции на основе данных
      let promotionType = activeTab;
      if (data.code && data.discountAmount) {
        promotionType = 'coupons';
      } else if (data.name && data.percentage) {
        promotionType = 'discounts';
      } else if (data.code && data.discountPercentage) {
        promotionType = 'promocodes';
      }
      
      if (editingPromotion) {
        // Update existing promotion
        if (promotionType === 'coupons') {
          const result = await promotionService.updateCoupon(editingPromotion.id, data);
          if (!result) throw new Error('Не удалось обновить купон');
        } else if (promotionType === 'discounts') {
          const result = await promotionService.updateDiscount(editingPromotion.id, data);
          if (!result) throw new Error('Не удалось обновить скидку');
        } else if (promotionType === 'promocodes') {
          const result = await promotionService.updatePromoCode(editingPromotion.id, data);
          if (!result) throw new Error('Не удалось обновить промокод');
        }
      } else {
        // Create new promotion
        if (promotionType === 'coupons') {
          const result = await promotionService.createCoupon(data);
          if (!result) throw new Error('Не удалось создать купон');
        } else if (promotionType === 'discounts') {
          const result = await promotionService.createDiscount(data);
          if (!result) throw new Error('Не удалось создать скидку');
        } else if (promotionType === 'promocodes') {
          const result = await promotionService.createPromoCode(data);
          if (!result) throw new Error('Не удалось создать промокод');
        }
      }
      
      await loadData();
    } catch (err) {
      console.error('[AdminPromotions] Error saving promotion:', err);
      throw err;
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту промоцию?')) return;
    
    try {
      let success = false;
      if (activeTab === 'coupons') {
        success = await promotionService.deleteCoupon(id);
      } else if (activeTab === 'discounts') {
        success = await promotionService.deleteDiscount(id);
      } else if (activeTab === 'promocodes') {
        success = await promotionService.deletePromoCode(id);
      }
      
      if (success) {
        await loadData();
      }
    } catch (err) {
      console.error('[AdminPromotions] Error deleting promotion:', err);
    }
  };

  const openCreateModal = () => {
    setEditingPromotion(null);
    setShowModal(true);
  };

  const openEditModal = (promotion: Coupon | Discount | PromoCode) => {
    setEditingPromotion(promotion);
    setShowModal(true);
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
      : 'bg-gradient-to-r from-red-500 to-pink-500';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Активна' : 'Неактивна';
  };

  // Безопасная функция для получения текущего массива
  const getCurrentArray = () => {
    if (activeTab === 'coupons') {
      return Array.isArray(coupons) ? coupons : [];
    } else if (activeTab === 'discounts') {
      return Array.isArray(discounts) ? discounts : [];
    } else if (activeTab === 'promocodes') {
      return Array.isArray(promoCodes) ? promoCodes : [];
    }
    return [];
  };

  if (loading || isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
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
                  Управление Промоциями
                </h1>
                <p className="text-white/70 text-lg mt-2">
                  Создавайте и управляйте купонами, скидками и промокодами
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/5 p-6 hover:bg-black/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/40">
                  <Icons.Coupon className="w-6 h-6 text-purple-300" />
                </div>
                <span className="text-2xl font-bold text-white">{coupons.length}</span>
              </div>
              <h3 className="text-white font-semibold mb-1">Купоны</h3>
              <p className="text-white/60 text-sm">Активные купоны</p>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/5 p-6 hover:bg-black/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-600/30 to-green-600/30 border border-emerald-500/40">
                  <Icons.Star className="w-6 h-6 text-emerald-300" />
                </div>
                <span className="text-2xl font-bold text-white">{discounts.length}</span>
              </div>
              <h3 className="text-white font-semibold mb-1">Скидки</h3>
              <p className="text-white/60 text-sm">Активные скидки</p>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/5 p-6 hover:bg-black/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border border-blue-500/40">
                  <Icons.Money className="w-6 h-6 text-blue-300" />
                </div>
                <span className="text-2xl font-bold text-white">{promoCodes.length}</span>
              </div>
              <h3 className="text-white font-semibold mb-1">Промокоды</h3>
              <p className="text-white/60 text-sm">Активные промокоды</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/5 p-2 mb-8">
            <div className="flex space-x-2">
              {[
                { key: 'coupons', label: 'Купоны', icon: Icons.Coupon },
                { key: 'discounts', label: 'Скидки', icon: Icons.Star },
                { key: 'promocodes', label: 'Промокоды', icon: Icons.Money }
              ].map((tab) => {
                const TabIcon = tab.icon;
                return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="mr-2">
                    <TabIcon className="inline w-5 h-5" />
                  </span>
                  {tab.label}
                </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8 relative overflow-hidden">
            {/* Inner animated gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-red-600/10 animate-pulse"></div>
            
            <div className="relative z-10">
              {/* Header with Create Button */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {activeTab === 'coupons' ? 'Купоны' : 
                   activeTab === 'discounts' ? 'Скидки' : 'Промокоды'}
                </h2>
                <button
                  onClick={openCreateModal}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-300 flex items-center space-x-2"
                >
                  <Icons.Add className="w-5 h-5" />
                  <span>Создать</span>
                </button>
              </div>

              {error ? (
                <div className="text-center py-16">
                  <div className="text-red-400 text-5xl mb-4">⚠️</div>
                  <p className="text-red-200 text-lg font-medium">{error}</p>
                  <button
                    onClick={loadData}
                    className="mt-4 bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300"
                  >
                    Попробовать снова
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-4 px-6 text-left text-white font-bold">ID</th>
                        {activeTab === 'coupons' && (
                          <>
                            <th className="py-4 px-6 text-left text-white font-bold">Код</th>
                            <th className="py-4 px-6 text-left text-white font-bold">Скидка</th>
                          </>
                        )}
                        {activeTab === 'discounts' && (
                          <>
                            <th className="py-4 px-6 text-left text-white font-bold">Название</th>
                            <th className="py-4 px-6 text-left text-white font-bold">Процент</th>
                          </>
                        )}
                        {activeTab === 'promocodes' && (
                          <>
                            <th className="py-4 px-6 text-left text-white font-bold">Код</th>
                            <th className="py-4 px-6 text-left text-white font-bold">Процент</th>
                          </>
                        )}
                        <th className="py-4 px-6 text-left text-white font-bold">Статус</th>
                        <th className="py-4 px-6 text-left text-white font-bold">Действует до</th>
                        <th className="py-4 px-6 text-left text-white font-bold">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getCurrentArray().map((item, index) => (
                        <tr 
                          key={item.id} 
                          className={`border-b border-white/10 hover:bg-white/5 transition-all duration-300 ${
                            index % 2 === 0 ? 'bg-white/5' : 'bg-white/2'
                          }`}
                        >
                          <td className="py-4 px-6 text-white font-semibold">#{item.id}</td>
                          
                                                     {activeTab === 'coupons' && (
                             <>
                               <td className="py-4 px-6 text-white font-medium">{(item as Coupon).code}</td>
                               <td className="py-4 px-6 text-white font-medium">{(item as Coupon).discountAmount} ₽</td>
                             </>
                           )}
                           
                           {activeTab === 'discounts' && (
                             <>
                               <td className="py-4 px-6 text-white font-medium">{(item as Discount).name}</td>
                               <td className="py-4 px-6 text-white font-medium">{(item as Discount).percentage}%</td>
                             </>
                           )}
                           
                           {activeTab === 'promocodes' && (
                             <>
                               <td className="py-4 px-6 text-white font-medium">{(item as PromoCode).code}</td>
                               <td className="py-4 px-6 text-white font-medium">{(item as PromoCode).discountPercentage}%</td>
                             </>
                           )}
                          
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 text-white text-sm rounded-full font-medium ${getStatusColor(item.isActive)}`}>
                              {getStatusText(item.isActive)}
                            </span>
                          </td>
                          
                                                     <td className="py-4 px-6 text-white/80">
                             {new Date(
                               activeTab === 'discounts' ? (item as Discount).endDate : (item as Coupon | PromoCode).validTo
                             ).toLocaleDateString()}
                           </td>
                          
                          <td className="py-4 px-6">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openEditModal(item)}
                                className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm rounded-lg transition-all duration-300 hover:scale-105 font-medium"
                              >
                                Изменить
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm rounded-lg transition-all duration-300 hover:scale-105 font-medium"
                              >
                                Удалить
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {getCurrentArray().length === 0 && (
                    <div className="text-center py-16">
                      <div className="text-white/40 text-6xl mb-4">
                        {activeTab === 'coupons' ? (
                          <Icons.Coupon className="w-16 h-16 mx-auto" />
                        ) : activeTab === 'discounts' ? (
                          <Icons.Star className="w-16 h-16 mx-auto" />
                        ) : (
                          <Icons.Money className="w-16 h-16 mx-auto" />
                        )}
                      </div>
                      <p className="text-white/60 text-lg font-medium">
                        Нет {activeTab === 'coupons' ? 'купонов' : 
                              activeTab === 'discounts' ? 'скидок' : 'промокодов'}
                      </p>
                      <p className="text-white/40 text-sm mt-2">
                        Создайте первую промоцию для привлечения клиентов
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <PromotionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type={activeTab === 'coupons' ? 'coupon' : 
              activeTab === 'discounts' ? 'discount' : 
              activeTab === 'promocodes' ? 'promocode' : 'coupon'}
                 promotion={editingPromotion || undefined}
        onSave={handleSave}
        products={products}
      />
    </Layout>
  );
}
