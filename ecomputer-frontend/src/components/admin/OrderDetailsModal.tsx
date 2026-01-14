'use client';

import React, { useState, useEffect } from 'react';
import { Order } from '../../types/order';
import { OrderService } from '../../services/order.service';
import { calculateOrderDetails, formatOrderPrice } from '../../utils/orderCalculator';
import { Icons } from '../ui/icons'; // Импорт централизованных иконок

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
}

export default function OrderDetailsModal({ isOpen, onClose, orderId }: OrderDetailsModalProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const orderService = OrderService.getInstance();

  useEffect(() => {
    if (isOpen && orderId) {
      loadOrder();
    }
  }, [isOpen, orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const order = await orderService.getOrderByIdForAdmin(orderId);
      if (order) setOrder(order);
      else setError('Заказ не найден');
    } catch (err) {
      console.error('Error loading order:', err);
      setError('Ошибка при загрузке заказа');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string | number) => {
    const statusStr = typeof status === 'number' ? status.toString() : status;
    switch (statusStr) {
      case '0':
      case 'Pending':
        return 'bg-gradient-to-r from-yellow-600 to-orange-500';
      case '1':
      case 'Processing':
        return 'bg-gradient-to-r from-blue-600 to-blue-500';
      case '2':
      case 'Shipped':
        return 'bg-gradient-to-r from-purple-600 to-purple-500';
      case '3':
      case 'Delivered':
        return 'bg-gradient-to-r from-green-600 to-green-500';
      case '4':
      case 'Cancelled':
        return 'bg-gradient-to-r from-red-600 to-red-500';
      default:
        return 'bg-gradient-to-r from-gray-600 to-gray-500';
    }
  };

  const getStatusText = (status: string | number) => {
    const statusStr = typeof status === 'number' ? status.toString() : status;
    switch (statusStr) {
      case '0':
      case 'Pending':
        return 'Pending';
      case '1':
      case 'Processing':
        return 'Processing';
      case '2':
      case 'Shipped':
        return 'Shipped';
      case '3':
      case 'Delivered':
        return 'Delivered';
      case '4':
      case 'Cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const getStatusIcon = (status: string | number) => {
    const statusStr = typeof status === 'number' ? status.toString() : status;
    switch (statusStr) {
      case '0':
      case 'Pending':
        return <Icons.Pending className="text-yellow-400 w-5 h-5 mr-1" />;
      case '1':
      case 'Processing':
        return <Icons.Shipping className="text-blue-400 w-5 h-5 mr-1" />;
      case '2':
      case 'Shipped':
        return <Icons.Shipping className="text-purple-400 w-5 h-5 mr-1" />;
      case '3':
      case 'Delivered':
        return <Icons.Delivered className="text-green-400 w-5 h-5 mr-1" />;
      case '4':
      case 'Cancelled':
        return <Icons.CancelIcon className="text-red-400 w-5 h-5 mr-1" />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl border border-white/10 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">Order Details #{orderId}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300"
          >
            <Icons.Close className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/70">Loading order details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-400 text-4xl mb-4">❌</div>
              <p className="text-red-300">{error}</p>
            </div>
          ) : order ? (
            <div className="space-y-6">
              {/* Order Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-3">Order Information</h3>
                  <div className="space-y-2 text-white/80">
                    <p>
                      <span className="font-medium">Order ID:</span> #{order.id}
                    </p>
                    <p>
                      <span className="font-medium">Date:</span>{' '}
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>
                      <span
                        className={`ml-2 px-2 py-1 text-white text-xs rounded-full font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-3">Customer Information</h3>
                  <div className="space-y-2 text-white/80">
                    <p>
                      <span className="font-medium">Name:</span> {order.user?.name || 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {order.user?.email || 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">User ID:</span> #{order.userId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <Icons.Cart className="mr-2 w-5 h-5 text-white" />
                    Order Items
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="py-3 px-4 text-left text-white font-bold text-sm">Product</th>
                        <th className="py-3 px-4 text-left text-white font-bold text-sm">Category</th>
                        <th className="py-3 px-4 text-left text-white font-bold text-sm">Quantity</th>
                        <th className="py-3 px-4 text-left text-white font-bold text-sm">Price</th>
                        <th className="py-3 px-4 text-left text-white font-bold text-sm">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(order.orderItems || order.items) &&
                      (order.orderItems || order.items)!.length > 0 ? (
                        (order.orderItems || order.items)!.map((item, index) => (
                          <tr
                            key={index}
                            className={`border-b border-white/5 ${
                              index % 2 === 0 ? 'bg-white/5' : 'bg-white/2'
                            }`}
                          >
                            <td className="py-3 px-4 text-white font-semibold text-sm">
                              {item.productName || 'Unknown Product'}
                            </td>
                            <td className="py-3 px-4 text-white/80 text-sm">
                              {item.categoryName || 'Unknown Category'}
                            </td>
                            <td className="py-3 px-4 text-white font-medium text-sm">{item.quantity}</td>
                            <td className="py-3 px-4 text-emerald-400 font-bold text-sm">
                              {(() => {
                                const originalPrice = item.priceAtPurchase || item.price || 0;
                                const finalPrice = item.finalPriceAtPurchase || item.price || 0;
                                const hasDiscount = item.discountAtPurchase > 0;

                                if (hasDiscount) {
                                  return (
                                    <div className="space-y-1">
                                      <div className="text-white/60 text-xs line-through">
                                        {formatOrderPrice(originalPrice)}
                                      </div>
                                      <div className="text-emerald-400">{formatOrderPrice(finalPrice)}</div>
                                    </div>
                                  );
                                }

                                return formatOrderPrice(finalPrice);
                              })()}
                            </td>
                            <td className="py-3 px-4 text-emerald-400 font-bold text-sm">
                              {(() => {
                                const originalPrice = item.priceAtPurchase || item.price || 0;
                                const finalPrice = item.finalPriceAtPurchase || item.price || 0;
                                const hasDiscount = item.discountAtPurchase > 0;

                                if (hasDiscount) {
                                  const originalTotal = originalPrice * item.quantity;
                                  const finalTotal = finalPrice * item.quantity;
                                  return (
                                    <div className="space-y-1">
                                      <div className="text-white/60 text-xs line-through">
                                        {formatOrderPrice(originalTotal)}
                                      </div>
                                      <div className="text-emerald-400">{formatOrderPrice(finalTotal)}</div>
                                    </div>
                                  );
                                }

                                return formatOrderPrice(finalPrice * item.quantity);
                              })()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-white/40">
                            Товары не найдены
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary */}
              {(() => {
                const orderCalculation = calculateOrderDetails(order);
                return (
                  <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl p-4 border border-emerald-500/20 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                      <Icons.Money className="text-emerald-300 mr-2" />
                      Order Summary
                    </h3>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Subtotal:</span>
                        <span className="text-white font-semibold">{formatOrderPrice(orderCalculation.subtotal)}</span>
                      </div>

                      {orderCalculation.discountAmount > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-white/80">Discount:</span>
                          <span className="text-emerald-400 font-semibold">
                            -{formatOrderPrice(orderCalculation.discountAmount)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2 border-t border-white/20">
                        <span className="text-white font-bold">Total Amount:</span>
                        <span className="text-emerald-300 font-bold text-xl">
                          {formatOrderPrice(orderCalculation.total)}
                        </span>
                      </div>

                      {orderCalculation.discountPercentage && orderCalculation.discountPercentage > 0 && (
                        <div className="text-center pt-2">
                          <span className="text-emerald-400 text-sm">
                            Discount: {orderCalculation.discountPercentage.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>

                    {order.items && (
                      <div className="mt-3 text-white/60 text-sm">
                        Items: {order.items.length} | Total Quantity:{' '}
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="text-center py-12">
              <Icons.Cart className="text-gray-400 w-12 h-12 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Заказ не найден</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
