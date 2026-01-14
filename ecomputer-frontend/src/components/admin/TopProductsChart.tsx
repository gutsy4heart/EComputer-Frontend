import React from 'react';
import { TopProduct } from '../../services/order.service';
import { Icons } from '../ui/icons';
import { SvgIcon } from '@mui/material';

interface TopProductsChartProps {
  products: TopProduct[];
}

export const TopProductsChart: React.FC<TopProductsChartProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 text-center">
        <div className="text-white/40 text-4xl mb-4">
          <SvgIcon fontSize="inherit">
            <Icons.Cart />
          </SvgIcon>
        </div>
        <p className="text-white/60 text-lg">Нет данных для отображения</p>
      </div>
    );
  }

  const totalSold = products.reduce((sum, p) => sum + p.totalSold, 0);
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  const sortedProducts = [...products].sort((a, b) => b.totalSold - a.totalSold).slice(0, 3);
  const maxSold = Math.max(...sortedProducts.map(p => p.totalSold), 1);

  const svgWidth = 1000;
  const svgHeight = 500;
  const padding = 80;
  const bottomPadding = 120;
  const barWidth = 120;
  const barSpacing = 120;

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>

      <div className="mb-8 text-center relative z-10">
        <h3 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
          Top 3 Products Performance
        </h3>
        <p className="text-white/60 text-lg font-medium">Sales volume comparison</p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10 relative z-10">
        <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl p-8 border border-emerald-500/20 backdrop-blur-sm shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 group relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div className="text-5xl font-bold text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
              {totalSold.toLocaleString()} U.
            </div>
            <SvgIcon className="text-emerald-300 text-3xl animate-pulse group-hover:animate-bounce">
              <Icons.Delivered /> {/* заменяем ↗ */}
            </SvgIcon>
          </div>
          <p className="text-emerald-200 text-base mt-4 font-medium">Total units sold</p>
        </div>

        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-8 border border-indigo-500/20 backdrop-blur-sm shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 group relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div className="text-5xl font-bold text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
              ${totalRevenue.toLocaleString()}
            </div>
            <SvgIcon className="text-indigo-300 text-3xl animate-pulse group-hover:animate-bounce">
              <Icons.Money /> {/* заменяем ↘ */}
            </SvgIcon>
          </div>
          <p className="text-indigo-200 text-base mt-4 font-medium">Total revenue</p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl relative overflow-hidden">
        <svg width={svgWidth} height={svgHeight} className="w-full h-auto relative z-10">
          {sortedProducts.map((product, index) => {
            const barX = padding + (index * (barWidth + barSpacing)) + (barSpacing / 2);
            const barHeight = (product.totalSold / maxSold) * (svgHeight - padding - bottomPadding);
            const barY = svgHeight - bottomPadding - barHeight;

            return (
              <g key={index}>
                <rect
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill={`url(#barGradient${index + 1})`}
                  rx="15"
                />
                <foreignObject x={barX} y={svgHeight - bottomPadding + 30} width={barWidth} height={50}>
                  <div className="flex justify-center items-center">
                    <SvgIcon fontSize="small">
                      <Icons.Cart /> {/* можно кастомизировать иконку по продукту */}
                    </SvgIcon>
                    <span className="text-white text-sm ml-1">{product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name}</span>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
