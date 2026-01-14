import React, { useState } from 'react';
import { useOrderDiscounts } from '../../hooks/useOrderDiscounts';
import { useCartContext } from '../../context';

export const DiscountTest: React.FC = () => {
  const { calculateDiscounts, loading, error, discountCalculation } = useOrderDiscounts();
  const { cart } = useCartContext();
  const [couponCode, setCouponCode] = useState('');
  const [promoCode, setPromoCode] = useState('');

  const handleTest = async () => {
    if (!cart?.id) {
      alert('Корзина не найдена');
      return;
    }

    try {
      console.log('Тестируем расчет скидок...');
      const result = await calculateDiscounts(
        cart.id,
        couponCode || undefined,
        promoCode || undefined
      );
      
      console.log('Результат расчета:', result);
      alert(`Расчет успешен! Итоговая сумма: $${result.finalTotal}`);
    } catch (err) {
      console.error('Ошибка:', err);
      alert(`Ошибка: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Тест расчета скидок</h3>
      
      <div className="space-y-2 mb-4">
        <div>
          <label className="block text-sm font-medium">Код купона:</label>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Введите код купона"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium">Промокод:</label>
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Введите промокод"
          />
        </div>
      </div>

      <button
        onClick={handleTest}
        disabled={loading || !cart?.id}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Тестируем...' : 'Тест расчета скидок'}
      </button>

      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
          Ошибка: {error}
        </div>
      )}

      {discountCalculation && (
        <div className="mt-4 p-3 bg-green-100 rounded">
          <h4 className="font-bold">Результат расчета:</h4>
          <p>Исходная сумма: ${discountCalculation.originalTotal}</p>
          <p>Сумма со скидками: ${discountCalculation.discountedTotal}</p>
          <p>Итоговая сумма: ${discountCalculation.finalTotal}</p>
          <p>Экономия: ${discountCalculation.totalSavings}</p>
        </div>
      )}
    </div>
  );
};
