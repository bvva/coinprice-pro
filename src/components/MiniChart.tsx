import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { KlineData } from '../types';

interface MiniChartProps {
  data: KlineData[];
  width?: number;
  height?: number;
  className?: string;
}

export const MiniChart: React.FC<MiniChartProps> = ({
  data,
  width = 400,
  height = 200,
  className = ''
}) => {
  const chartData = useMemo(() => {
    if (!data.length) return { candlesticks: [], minPrice: 0, maxPrice: 0, priceRange: 0 };

    const prices = data.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    const candlesticks = data.map((item, index) => {
      const x = (index / (data.length - 1)) * width;
      const candleWidth = Math.max(2, width / data.length * 0.8);

      // 计算价格在图表中的 Y 坐标（翻转坐标系）
      const yHigh = height - ((item.high - minPrice) / priceRange) * height;
      const yLow = height - ((item.low - minPrice) / priceRange) * height;
      const yOpen = height - ((item.open - minPrice) / priceRange) * height;
      const yClose = height - ((item.close - minPrice) / priceRange) * height;

      const isGreen = item.close >= item.open;
      const bodyTop = Math.min(yOpen, yClose);
      const bodyHeight = Math.abs(yClose - yOpen);

      return {
        x,
        candleWidth,
        yHigh,
        yLow,
        bodyTop,
        bodyHeight,
        isGreen,
        wickTop: yHigh,
        wickBottom: yLow,
        bodyY: bodyTop
      };
    });

    return { candlesticks, minPrice, maxPrice, priceRange };
  }, [data, width, height]);

  if (!data.length) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
        <div className="text-gray-400 text-sm">暂无数据</div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg width={width} height={height} className="w-full h-full">
        {/* 背景网格线 */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* K线蜡烛图 */}
        {chartData.candlesticks.map((candle, index) => (
          <motion.g
            key={index}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: index * 0.02, duration: 0.3 }}
          >
            {/* 上下影线 */}
            <line
              x1={candle.x}
              y1={candle.wickTop}
              x2={candle.x}
              y2={candle.wickBottom}
              stroke={candle.isGreen ? '#22c55e' : '#ef4444'}
              strokeWidth="1"
              opacity="0.8"
            />

            {/* 实体部分 */}
            <rect
              x={candle.x - candle.candleWidth / 2}
              y={candle.bodyY}
              width={candle.candleWidth}
              height={Math.max(1, candle.bodyHeight)}
              fill={candle.isGreen ? '#22c55e' : '#ef4444'}
              stroke={candle.isGreen ? '#16a34a' : '#dc2626'}
              strokeWidth="0.5"
              opacity="0.9"
              rx="1"
            />
          </motion.g>
        ))}

        {/* 价格趋势线 */}
        <motion.path
          d={`M ${chartData.candlesticks.map((candle, index) =>
            `${index === 0 ? 'M' : 'L'} ${candle.x} ${candle.bodyY + candle.bodyHeight / 2}`
          ).join(' ')}`}
          fill="none"
          stroke="rgba(59, 130, 246, 0.6)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>

      {/* 价格标签 */}
      <div className="absolute top-2 left-2 text-xs text-white/70 bg-black/30 rounded px-2 py-1 backdrop-blur-sm">
        最高: ${chartData.maxPrice.toFixed(2)}
      </div>
      <div className="absolute bottom-2 left-2 text-xs text-white/70 bg-black/30 rounded px-2 py-1 backdrop-blur-sm">
        最低: ${chartData.minPrice.toFixed(2)}
      </div>

      {/* 最新价格指示器 */}
      {chartData.candlesticks.length > 0 && (
        <motion.div
          className="absolute right-0 w-2 h-2 bg-primary-400 rounded-full"
          style={{
            top: chartData.candlesticks[chartData.candlesticks.length - 1].bodyY +
              chartData.candlesticks[chartData.candlesticks.length - 1].bodyHeight / 2 - 4
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </div>
  );
}; 