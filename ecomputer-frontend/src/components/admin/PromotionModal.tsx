'use client';

import React, { useState, useEffect } from 'react';
import { Coupon, Discount, PromoCode } from '../../types/promotion';
import { Icons } from '../ui/icons'; // Импорт централизованных иконок

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'coupon' | 'discount' | 'promocode';
  promotion?: Coupon | Discount | PromoCode;
  onSave: (data: any) => Promise<void>;
  products: Array<{ id: number; name: string; price?: number; categoryName?: string }>;
}

export default function PromotionModal({
  isOpen,
  onClose,
  type,
  promotion,
  onSave,
  products,
}: PromotionModalProps) {
  const [selectedType, setSelectedType] = useState<'coupon' | 'discount' | 'promocode'>(type);
  const [productSearch, setProductSearch] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    discountAmount: 0,
    percentage: 0,
    discountPercentage: 0,
    validFrom: '',
    validTo: '',
    startDate: '',
    endDate: '',
    productIds: [] as number[],
    applicableProductIds: [] as number[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setSelectedType(type);
  }, [type]);

  useEffect(() => {
    if (promotion) {
      const extractDatePart = (dateString: string) => {
        if (!dateString) return '';
        try {
          if (dateString.includes('T')) return dateString.split('T')[0];
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
          if (/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(dateString)) {
            const parts = dateString.split('.');
            return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
          }
          const date = new Date(dateString);
          if (!isNaN(date.getTime())) return date.toISOString().split('T')[0];
          return '';
        } catch {
          return '';
        }
      };

      setFormData({
        code: 'code' in promotion ? promotion.code : '',
        name: 'name' in promotion ? promotion.name : '',
        discountAmount: 'discountAmount' in promotion ? promotion.discountAmount : 0,
        percentage: 'percentage' in promotion ? promotion.percentage : 0,
        discountPercentage: 'discountPercentage' in promotion ? promotion.discountPercentage : 0,
        validFrom: 'validFrom' in promotion ? extractDatePart(promotion.validFrom) : '',
        validTo: 'validTo' in promotion ? extractDatePart(promotion.validTo) : '',
        startDate: 'startDate' in promotion ? extractDatePart(promotion.startDate) : '',
        endDate: 'endDate' in promotion ? extractDatePart(promotion.endDate) : '',
        productIds: 'productIds' in promotion ? promotion.productIds : [],
        applicableProductIds: 'applicableProductIds' in promotion ? promotion.applicableProductIds : [],
      });
    } else {
      setFormData({
        code: '',
        name: '',
        discountAmount: 0,
        percentage: 0,
        discountPercentage: 0,
        validFrom: '',
        validTo: '',
        startDate: '',
        endDate: '',
        productIds: [],
        applicableProductIds: [],
      });
    }
  }, [promotion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

      if (selectedType === 'discount') {
        if (!formData.startDate || !dateFormatRegex.test(formData.startDate)) {
          setError('Неверный формат даты начала');
          setLoading(false);
          return;
        }
        if (!formData.endDate || !dateFormatRegex.test(formData.endDate)) {
          setError('Неверный формат даты окончания');
          setLoading(false);
          return;
        }
      } else {
        if (!formData.validFrom || !dateFormatRegex.test(formData.validFrom)) {
          setError('Неверный формат даты начала');
          setLoading(false);
          return;
        }
        if (!formData.validTo || !dateFormatRegex.test(formData.validTo)) {
          setError('Неверный формат даты окончания');
          setLoading(false);
          return;
        }
      }

      if (selectedType === 'discount' && (formData.percentage <= 0 || formData.percentage > 100)) {
        setError('Процент скидки должен быть от 1 до 100');
        setLoading(false);
        return;
      }

      if (selectedType === 'promocode' && (formData.discountPercentage <= 0 || formData.discountPercentage > 100)) {
        setError('Процент скидки должен быть от 1 до 100');
        setLoading(false);
        return;
      }

      if (selectedType === 'coupon' && formData.discountAmount <= 0) {
        setError('Сумма скидки должна быть больше 0');
        setLoading(false);
        return;
      }

      // Валидация дат
      if (selectedType === 'discount') {
        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
          setError('Дата начала должна быть меньше даты окончания');
          setLoading(false);
          return;
        }
      } else {
        if (new Date(formData.validFrom) >= new Date(formData.validTo)) {
          setError('Дата начала должна быть меньше даты окончания');
          setLoading(false);
          return;
        }
      }

      let data: any = {};

      if (selectedType === 'coupon') {
        data = {
          code: formData.code,
          discountAmount: formData.discountAmount,
          validFrom: new Date(formData.validFrom + 'T00:00:00').toISOString(),
          validTo: new Date(formData.validTo + 'T23:59:59').toISOString(),
          productIds: formData.productIds,
        };
      } else if (selectedType === 'discount') {
        data = {
          name: formData.name,
          percentage: formData.percentage,
          startDate: new Date(formData.startDate + 'T00:00:00').toISOString(),
          endDate: new Date(formData.endDate + 'T23:59:59').toISOString(),
          productIds: formData.productIds,
        };
      } else if (selectedType === 'promocode') {
        data = {
          code: formData.code,
          discountPercentage: formData.discountPercentage,
          validFrom: new Date(formData.validFrom + 'T00:00:00').toISOString(),
          validTo: new Date(formData.validTo + 'T23:59:59').toISOString(),
          applicableProductIds: formData.applicableProductIds,
        };
      }

      await onSave(data);
      onClose();
    } catch (err: any) {
      setError(err?.message || err?.error || 'Ошибка при сохранении');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelection = (productId: number, field: 'productIds' | 'applicableProductIds') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(productId)
        ? prev[field].filter(id => id !== productId)
        : [...prev[field], productId],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              {promotion ? 'Редактировать' : 'Создать'} Промоцию
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300"
            >
              <Icons.Close className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Type Selector */}
          {!promotion && (
            <div className="mb-6">
              <label className="block text-white/80 text-sm font-medium mb-3">Тип промоции</label>
              <div className="grid grid-cols-3 gap-3">
                {['coupon', 'discount', 'promocode'].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedType(t as 'coupon' | 'discount' | 'promocode')}
                    className={`p-3 rounded-xl border transition-all duration-300 ${
                      selectedType === t
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-sm font-medium capitalize">{t}</div>
                    <div className="text-xs opacity-75">
                      {t === 'coupon' ? 'Фиксированная скидка' : t === 'discount' ? 'Процентная скидка' : 'Код для скидки'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fields (Coupon, Discount, Promocode) */}
            {selectedType === 'coupon' && (
              <>
                <InputField label="Код купона" value={formData.code} onChange={val => setFormData(prev => ({ ...prev, code: val }))} />
                <InputField label="Сумма скидки" type="number" value={formData.discountAmount} onChange={val => setFormData(prev => ({ ...prev, discountAmount: parseFloat(val) || 0 }))} />
              </>
            )}
            {selectedType === 'discount' && (
              <>
                <InputField label="Название скидки" value={formData.name} onChange={val => setFormData(prev => ({ ...prev, name: val }))} />
                <InputField label="Процент скидки" type="number" value={formData.percentage} onChange={val => setFormData(prev => ({ ...prev, percentage: parseFloat(val) || 0 }))} />
              </>
            )}
            {selectedType === 'promocode' && (
              <>
                <InputField label="Код промокода" value={formData.code} onChange={val => setFormData(prev => ({ ...prev, code: val }))} />
                <InputField label="Процент скидки" type="number" value={formData.discountPercentage} onChange={val => setFormData(prev => ({ ...prev, discountPercentage: parseFloat(val) || 0 }))} />
              </>
            )}

            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateField
                label={selectedType === 'discount' ? 'Дата начала' : 'Действует с'}
                value={selectedType === 'discount' ? formData.startDate : formData.validFrom}
                onChange={val => setFormData(prev => ({ ...prev, [selectedType === 'discount' ? 'startDate' : 'validFrom']: val }))}
                min={new Date().toISOString().split('T')[0]}
              />
              <DateField
                label={selectedType === 'discount' ? 'Дата окончания' : 'Действует до'}
                value={selectedType === 'discount' ? formData.endDate : formData.validTo}
                onChange={val => setFormData(prev => ({ ...prev, [selectedType === 'discount' ? 'endDate' : 'validTo']: val }))}
                min={selectedType === 'discount' ? formData.startDate : formData.validFrom}
              />
            </div>

            {/* Products */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-white/80 text-sm font-medium flex items-center space-x-1">
                  <Icons.Cart className="w-4 h-4 text-white/80" />
                  <span>Применимые товары</span>
                </label>
              </div>
              {/* Products list with search */}
              <div className="max-h-40 overflow-y-auto bg-white/5 rounded-xl p-4 border border-white/10">
                {/* Search */}
                {products.length > 0 && (
                  <div className="mb-3">
                    <input
                      type="text"
                      value={productSearch}
                      onChange={e => setProductSearch(e.target.value)}
                      placeholder="Поиск товаров..."
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
                    />
                  </div>
                )}

                {/* Products */}
                {products.length === 0 ? (
                  <p className="text-white/60 text-sm">Нет доступных товаров</p>
                ) : (
                  <div className="space-y-3">
                    {products
                      .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || (p.categoryName && p.categoryName.toLowerCase().includes(productSearch.toLowerCase())))
                      .map(product => (
                        <label key={product.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors duration-200">
                          <input
                            type="checkbox"
                            checked={selectedType === 'promocode' ? formData.applicableProductIds.includes(product.id) : formData.productIds.includes(product.id)}
                            onChange={() => handleProductSelection(product.id, selectedType === 'promocode' ? 'applicableProductIds' : 'productIds')}
                            className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-white/90 text-sm font-medium truncate">{product.name}</div>
                            <div className="flex items-center space-x-4 text-xs text-white/60">
                              {product.categoryName && <span className="bg-white/10 px-2 py-1 rounded-full">{product.categoryName}</span>}
                              {product.price && <span className="text-emerald-400 font-medium">{product.price.toLocaleString('ru-RU')} ₽</span>}
                            </div>
                          </div>
                        </label>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex space-x-4 pt-4">
              <button type="button" onClick={onClose} className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all duration-300">
                Отмена
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// --- Вспомогательные компоненты для упрощения полей ---
const InputField = ({ label, type = 'text', value, onChange }: { label: string; type?: string; value: any; onChange: (val: string) => void }) => (
  <div>
    <label className="block text-white/80 text-sm font-medium mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
      required
    />
  </div>
);

const DateField = ({ label, value, onChange, min }: { label: string; value: string; onChange: (val: string) => void; min?: string }) => (
  <div>
    <label className="block text-white/80 text-sm font-medium mb-2">{label}</label>
    <input
      type="date"
      value={value}
      onChange={e => onChange(e.target.value)}
      min={min}
      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all duration-300"
      required
    />
  </div>
);
