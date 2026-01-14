"use client";
import { useFavorites } from '../../hooks/useFavorites';
import { ProductCard } from '../../components/products/ProductCard';
import { useCartContext } from '../../context';
import { useRouter } from 'next/navigation';
import { AnimatedParticles } from '../../components/ui/AnimatedParticles';

export default function FavoritesPage() {
  const { favorites, loading, error } = useFavorites();
  const { cart } = useCartContext();
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/');
  };

  const handleCartClick = () => {
    router.push('/cart');
  };

  // Подсчитываем общее количество товаров в корзине
  const totalItems = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Анимированные частицы */}
      <AnimatedParticles count={20} />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header с кнопками */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleBackClick}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-white rounded-2xl font-bold shadow-lg transition-all duration-300 border border-white/10 hover:border-white/20 transform hover:scale-105 backdrop-blur-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Favorites
            </h1>
          </div>

          {/* Корзина с количеством */}
          <button
            onClick={handleCartClick}
            className="relative flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl font-bold shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                {totalItems}
              </span>
            )}
          </button>
        </div>
        
        {loading ? (
          <div className="text-center text-white py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-xl">Loading favorites...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-xl">Error: {error}</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-bold text-white mb-2">No favorites yet</h2>
            <p className="text-gray-400 mb-6">Add some products to your favorites to see them here.</p>
            <button
              onClick={() => router.push('/products')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8 relative overflow-hidden">
            {/* Внутренний градиент */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5"></div>
            
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
              {Array.isArray(favorites) && favorites.length > 0 ? (
                favorites.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-400 bg-black/20 backdrop-blur-sm rounded-2xl p-8">
                  <div className="text-4xl mb-4">💔</div>
                  <p className="text-lg">No favorites found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 