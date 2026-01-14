'use client';

import React, { useState } from 'react';
import { ProductReview } from '../../types';
import { RatingStars, UserAvatar } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import { Icons } from '../ui/icons';

interface ProductReviewsProps {
  reviews: ProductReview[];
  loading: boolean;
  error: string | null;
  onAddReview: (rating: number, reviewText: string) => Promise<boolean>;  
  onUpdateReview: (reviewId: number, rating: number, reviewText: string) => Promise<boolean>;  
  onDeleteReview: (reviewId: number) => Promise<boolean>;
  averageRating: number;
  totalReviews: number;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  reviews,
  loading,
  error,
  onAddReview,
  onUpdateReview,
  onDeleteReview,
  averageRating,
  totalReviews
}) => {
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReview, setEditingReview] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const userReview = reviews.find(review => review.userId === user?.id);

  const { Star, Edit, Trash, Calendar, Save, CancelIcon } = Icons;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(reviewText || '').trim()) return;

    setSubmitting(true);
    try {
      if (editingReview) {
        await onUpdateReview(editingReview, rating, reviewText);
        setEditingReview(null);
      } else {
        await onAddReview(rating, reviewText);
        setShowAddForm(false);
      }
      setRating(5);
      setReviewText('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (review: ProductReview) => {
    setEditingReview(review.id);
    setRating(review.rating);
    setReviewText(review.comment || review.reviewText || '');
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingReview(null);
    setRating(5);
    setReviewText('');
  };

  const handleDelete = async (reviewId: number) => {
    if (confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      await onDeleteReview(reviewId);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-indigo-950/50 via-purple-950/50 to-slate-900/50 rounded-3xl shadow-2xl border border-white/10 p-8 backdrop-blur-xl">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded-xl w-1/4 mb-6"></div>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-white/10 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-950/50 via-purple-950/50 to-slate-900/50 rounded-3xl shadow-2xl border border-white/10 p-8 backdrop-blur-xl">
      {/* Header and Statistics */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-200 via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
            Отзывы
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-yellow-400 mr-3" />
              <span className="text-2xl font-bold text-white">
                {averageRating.toFixed(1)} из 5
              </span>
            </div>
            <span className="text-white/60 text-lg">
              ({totalReviews} отзывов)
            </span>
          </div>
        </div>

        {user && !userReview && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl backdrop-blur-sm border border-white/10 flex items-center"
          >
            <Edit className="w-5 h-5 mr-2" /> Написать отзыв
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-700/50 rounded-2xl p-6 mb-8 backdrop-blur-sm flex items-start">
          <Star className="w-8 h-8 text-red-400 mr-4" />
          <p className="text-red-300 text-lg">{error}</p>
        </div>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingReview) && (
        <div className="mb-8 bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-slate-900/30 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
          <h4 className="text-xl font-bold text-white mb-6 flex items-center">
            <Edit className="w-5 h-5 mr-2 text-cyan-300" />
            {editingReview ? 'Редактировать отзыв' : 'Написать отзыв'}
          </h4>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-white mb-3 font-bold flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-300" /> Рейтинг
              </label>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <RatingStars rating={rating} interactive onRatingChange={setRating} size="lg" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-white mb-3 font-bold flex items-center">
                <Edit className="w-5 h-5 mr-2 text-purple-300" /> Комментарий
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white rounded-2xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur-sm placeholder-white/50"
                rows={4}
                placeholder="Поделитесь своим мнением о продукте..."
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={submitting || !(reviewText || '').trim()}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:via-slate-700 disabled:to-slate-800 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl backdrop-blur-sm border border-white/10 disabled:opacity-50 disabled:transform-none flex items-center justify-center"
              >
                {submitting ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Сохранение...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save className="w-5 h-5 mr-2" />
                    {editingReview ? 'Обновить' : 'Отправить'}
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm border border-white/10 flex items-center"
              >
                <CancelIcon className="w-5 h-5 mr-2" /> Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-purple-500/30">
              <Edit className="w-10 h-10 text-purple-300" />
            </div>
            <p className="text-white/70 text-xl font-medium">Пока нет отзывов. Будьте первым!</p>
            <p className="text-white/50 text-sm mt-2">Поделитесь своим опытом с другими покупателями</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gradient-to-br from-indigo-900/30 via-purple-900/30 to-slate-900/30 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] shadow-lg backdrop-blur-sm group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <UserAvatar
                    user={{ id: review.userId, name: review.userName || 'Пользователь', image: review.userImage, imageUrl: review.userImageUrl }}
                    size="lg"
                  />
                  <div>
                    <p className="text-white font-bold text-lg">{review.userName || 'Пользователь'}</p>
                    <p className="text-white/60 text-sm flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-purple-300" />
                      {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>

                {user && review.userId === user.id && (
                  <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleEdit(review)}
                      className="text-cyan-400 hover:text-cyan-300 font-medium transition-all duration-300 hover:scale-105 bg-white/5 hover:bg-white/10 px-3 py-1 rounded-xl backdrop-blur-sm flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" /> Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-red-400 hover:text-red-300 font-medium transition-all duration-300 hover:scale-105 bg-white/5 hover:bg-white/10 px-3 py-1 rounded-xl backdrop-blur-sm flex items-center"
                    >
                      <Trash className="w-4 h-4 mr-1" /> Удалить
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-4 p-3 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-xl border border-yellow-500/20 backdrop-blur-sm">
                <RatingStars rating={review.rating} size="lg" />
              </div>

              {(review.comment || review.reviewText) && (
                <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <p className="text-white/80 leading-relaxed text-lg">{review.comment || review.reviewText}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
