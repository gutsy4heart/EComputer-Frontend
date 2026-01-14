import React from 'react';
import { OrderStatistics } from '../../services/order.service';
import { Icons } from '../ui/icons'; // Импорт централизованных иконок
import { SvgIcon } from '@mui/material';

interface StatisticsChartProps {
  statistics: OrderStatistics;
}

export const StatisticsChart: React.FC<StatisticsChartProps> = ({ statistics }) => {
  if (!statistics) {
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

  const svgWidth = 1000;
  const svgHeight = 500;
  const padding = 80;
  const bottomPadding = 120;
  const barWidth = 80;
  const barSpacing = 100;

  const chartData = [
    { label: 'Total Orders', value: statistics.totalOrders, icon: Icons.Cart, gradient: 'from-blue-400 to-blue-600' },
    { label: 'Pending', value: statistics.pendingOrders, icon: Icons.Pending, gradient: 'from-amber-400 to-orange-500' },
    { label: 'Completed', value: statistics.completedOrders, icon: Icons.Delivered, gradient: 'from-emerald-400 to-green-500' },
    { label: 'Unique Users', value: statistics.uniqueUsers, icon: Icons.Shipping, gradient: 'from-purple-400 to-violet-500' },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value), 1);

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>

      <div className="mb-8 text-center relative z-10">
        <h3 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
          Order Statistics Overview
        </h3>
        <p className="text-white/60 text-lg font-medium">Key metrics visualization</p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10 relative z-10">
        <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl p-8 border border-emerald-500/20 backdrop-blur-sm shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 group relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div className="text-5xl font-bold text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
              ${statistics.totalRevenue.toFixed(2)}
            </div>
            <SvgIcon className="text-emerald-300 text-3xl animate-pulse group-hover:animate-bounce">
              <Icons.Money />
            </SvgIcon>
          </div>
          <p className="text-emerald-200 text-base mt-4 font-medium">Total Revenue</p>
        </div>

        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-8 border border-indigo-500/20 backdrop-blur-sm shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 group relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div className="text-5xl font-bold text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
              ${statistics.averageOrderValue.toFixed(2)}
            </div>
            <SvgIcon className="text-indigo-300 text-3xl animate-pulse group-hover:animate-bounce">
              <Icons.Shipping />
            </SvgIcon>
          </div>
          <p className="text-indigo-200 text-base mt-4 font-medium">Average Order Value</p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl relative overflow-hidden">
        <svg width={svgWidth} height={svgHeight} className="w-full h-auto relative z-10">
          {chartData.map((item, index) => {
            const barX = padding + index * (barWidth + barSpacing) + barSpacing / 2;
            const barHeight = (item.value / maxValue) * (svgHeight - padding - bottomPadding);
            const barY = svgHeight - bottomPadding - barHeight;

            return (
              <g key={index}>
                <rect
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill={`url(#statGradient${index + 1})`}
                  rx="10"
                />
                <foreignObject x={barX} y={svgHeight - bottomPadding + 30} width={barWidth} height={50}>
                  <div className="flex justify-center items-center">
                    <SvgIcon fontSize="small">
                      <item.icon />
                    </SvgIcon>
                    <span className="text-white text-sm ml-1">{item.label}</span>
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
