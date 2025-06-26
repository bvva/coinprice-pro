import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Maximize2, Heart } from 'lucide-react';
import { CryptoData } from '../types';

interface CryptoCardProps {
  data: CryptoData;
  onFullscreen: () => void;
  className?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const CryptoCard: React.FC<CryptoCardProps> = ({
  data,
  onFullscreen,
  className = '',
  isFavorite = false,
  onToggleFavorite
}) => {
  const isPositive = data.priceChange > 0;
  const isNeutral = data.priceChange === 0;

  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return price.toFixed(6);
  };

  const formatVolume = (volume: number): string => {
    if (volume >= 1e9) {
      return `${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(2)}M`;
    } else if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(2)}K`;
    }
    return volume.toFixed(2);
  };

  const getCryptoIcon = (symbol: string): string => {
    const iconMap: { [key: string]: string } = {
      // 主流币种
      'BTCUSDT': '₿', 'ETHUSDT': 'Ξ', 'BNBUSDT': '🔶', 'XRPUSDT': '💧',
      'SOLUSDT': '◎', 'ADAUSDT': '₳', 'DOGEUSDT': '🐕', 'AVAXUSDT': '🔺',
      'TRXUSDT': 'Ⱦ', 'LINKUSDT': '🔗', 'TONUSDT': '💎', 'MATICUSDT': '🔷',

      // DeFi & Layer 2
      'WBTCUSDT': '₿', 'ICPUSDT': '∞', 'SHIBUSDT': '🐕', 'NEARUSDT': 'Ⓝ',
      'UNIUSDT': '🦄', 'APTUSDT': 'Ⓐ', 'FETUSDT': '🤖', 'LDOUSDT': '🌊',
      'PEPEUSDT': '🐸', 'HBARUSDT': 'ℏ', 'XLMUSDT': '⭐', 'LTCUSDT': 'Ł',

      // 其他热门
      'KASUSDT': 'K', 'ETCUSDT': 'Ξ', 'BCHUSDT': '₿', 'ATOMUSDT': '⚛️',
      'RNDRUSDT': 'R', 'FILUSDT': '📁', 'CRVUSDT': '📈', 'AAVEUSDT': '👻',
      'MKRUSDT': 'M', 'TIAUSDT': 'T', 'INJUSDT': 'I', 'OPUSDT': '🔴',
      'WIFUSDT': 'W', 'ARBUSDT': '🔵', 'GRTUSDT': 'G', 'FLOKIUSDT': '🐕',
      'ALGOUSDT': 'A', 'VETUSDT': 'V', 'MANAUSDT': 'M', 'SANDUSDT': 'S',
      'AXSUSDT': 'A', 'THETAUSDT': 'θ', 'FLOWUSDT': 'F', 'EGGSUSDT': '🥚',
      'CHZUSDT': '🌶️', 'APEUSDT': '🐒',

      // 51-60扩展
      'DOTUSDT': '🔴', 'RUNEUSDT': 'ᚱ', 'WLDUSDT': '🌍', 'ENJUSDT': '🎮', 'XTZUSDT': 'ꜩ',
      'QNTUSDT': 'Q', 'KSMUSDT': 'K', 'SUIUSDT': '💧', 'ROSUSDT': '🌹', 'JUPUSDT': '🪐',

      // 61-70扩展
      'RAYUSDT': '☀️', 'ORDIUSDT': 'O', 'MINAUSDT': 'M', 'ZILUSDT': 'Z', 'GODSUSDT': '⚔️',
      'KLAYUSDT': 'K', 'COMPUSDT': '💰', 'MOVRUSDT': 'M', 'FANTUSDT': '👻', 'PENDLEUSDT': 'P',

      // 71-80扩展
      'YFIUSDT': '💰', 'PYTHUSDT': '🐍', 'IOTAUSDT': '⚡', 'ZECUSDT': 'Z', 'DASHUSDT': 'D',
      'SNTUSDT': 'S', 'ARUSDT': 'A', 'LRCUSDT': 'L', 'CELERXUSDT': 'C', 'WAVEUSDT': '🌊',

      // 81-90扩展
      'ARKMUSDT': 'A', 'GMTUSDT': 'G', 'GALAUSDT': 'G', 'XMRUSDT': 'ɱ', 'BNXUSDT': 'B',
      'EOSUSDT': 'E', 'XEMUSDT': 'X', 'NKNUSDT': 'N', 'BAKEUSDT': '🎂', 'SXPUSDT': 'S',

      // 91-100扩展
      'DENTUSDT': '🦷', 'RSRUSDT': 'R', 'REEFUSDT': '🐠', 'CKBUSDT': 'C', 'ONEUSDT': '1',
      'CTSIUSDT': 'C', 'STORJUSDT': '☁️', 'OCEANUSDT': '🌊', 'BTTCUSDT': 'B', 'CELOUSDT': 'C'
    };
    return iconMap[symbol] || symbol.replace('USDT', '').substring(0, 3);
  };

  const getCryptoColor = (symbol: string): string => {
    const colorMap: { [key: string]: string } = {
      // 前50个已有颜色
      'BTCUSDT': 'from-orange-400 to-orange-600',
      'ETHUSDT': 'from-blue-400 to-blue-600',
      'BNBUSDT': 'from-yellow-400 to-yellow-600',
      'XRPUSDT': 'from-blue-500 to-cyan-500',
      'SOLUSDT': 'from-purple-400 to-purple-600',
      'ADAUSDT': 'from-blue-400 to-indigo-500',
      'DOGEUSDT': 'from-yellow-300 to-yellow-500',
      'AVAXUSDT': 'from-red-400 to-red-600',
      'TRXUSDT': 'from-red-500 to-pink-500',
      'LINKUSDT': 'from-blue-500 to-blue-700',
      'TONUSDT': 'from-blue-400 to-blue-600',
      'MATICUSDT': 'from-purple-500 to-indigo-600',
      'UNIUSDT': 'from-pink-400 to-pink-600',
      'PEPEUSDT': 'from-green-400 to-green-600',
      'SHIBUSDT': 'from-orange-300 to-orange-500',

      // 51-60新增颜色
      'DOTUSDT': 'from-pink-500 to-rose-600',
      'RUNEUSDT': 'from-green-500 to-emerald-600',
      'WLDUSDT': 'from-blue-600 to-indigo-700',
      'ENJUSDT': 'from-purple-500 to-violet-600',
      'XTZUSDT': 'from-blue-500 to-sky-600',
      'QNTUSDT': 'from-indigo-500 to-purple-600',
      'KSMUSDT': 'from-gray-500 to-slate-600',
      'SUIUSDT': 'from-cyan-500 to-blue-600',
      'ROSUSDT': 'from-pink-400 to-red-500',
      'JUPUSDT': 'from-orange-500 to-amber-600',

      // 61-70新增颜色
      'RAYUSDT': 'from-yellow-400 to-orange-500',
      'ORDIUSDT': 'from-orange-600 to-red-700',
      'MINAUSDT': 'from-emerald-500 to-teal-600',
      'ZILUSDT': 'from-teal-500 to-cyan-600',
      'GODSUSDT': 'from-amber-500 to-yellow-600',
      'KLAYUSDT': 'from-red-400 to-pink-500',
      'COMPUSDT': 'from-green-600 to-emerald-700',
      'MOVRUSDT': 'from-violet-500 to-purple-600',
      'FANTUSDT': 'from-blue-600 to-indigo-700',
      'PENDLEUSDT': 'from-lime-500 to-green-600',

      // 71-80新增颜色
      'YFIUSDT': 'from-blue-700 to-indigo-800',
      'PYTHUSDT': 'from-purple-600 to-violet-700',
      'IOTAUSDT': 'from-gray-600 to-zinc-700',
      'ZECUSDT': 'from-yellow-600 to-orange-700',
      'DASHUSDT': 'from-blue-500 to-cyan-600',
      'SNTUSDT': 'from-indigo-600 to-purple-700',
      'ARUSDT': 'from-slate-600 to-gray-700',
      'LRCUSDT': 'from-blue-400 to-indigo-500',
      'CELERXUSDT': 'from-violet-400 to-purple-500',
      'WAVEUSDT': 'from-cyan-400 to-blue-500',

      // 81-90新增颜色
      'ARKMUSDT': 'from-stone-500 to-slate-600',
      'GMTUSDT': 'from-red-500 to-rose-600',
      'GALAUSDT': 'from-emerald-400 to-green-500',
      'XMRUSDT': 'from-orange-700 to-red-800',
      'BNXUSDT': 'from-yellow-500 to-amber-600',
      'EOSUSDT': 'from-gray-700 to-zinc-800',
      'XEMUSDT': 'from-blue-700 to-indigo-800',
      'NKNUSDT': 'from-teal-600 to-cyan-700',
      'BAKEUSDT': 'from-pink-500 to-rose-600',
      'SXPUSDT': 'from-orange-600 to-amber-700',

      // 91-100新增颜色
      'DENTUSDT': 'from-sky-500 to-blue-600',
      'RSRUSDT': 'from-green-700 to-emerald-800',
      'REEFUSDT': 'from-purple-700 to-violet-800',
      'CKBUSDT': 'from-lime-600 to-green-700',
      'ONEUSDT': 'from-cyan-600 to-blue-700',
      'CTSIUSDT': 'from-violet-600 to-purple-700',
      'STORJUSDT': 'from-blue-800 to-indigo-900',
      'OCEANUSDT': 'from-teal-700 to-cyan-800',
      'BTTCUSDT': 'from-red-600 to-rose-700',
      'CELOUSDT': 'from-yellow-700 to-amber-800'
    };
    return colorMap[symbol] || 'from-gray-400 to-gray-600';
  };

  return (
    <motion.div
      className={`crypto-card group relative overflow-hidden cursor-pointer ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onFullscreen}
    >
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* 操作按钮 */}
      <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        {/* 收藏按钮 */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition-all border border-white/20 ${isFavorite
              ? 'bg-red-500/80 hover:bg-red-500/90'
              : 'bg-black/20 hover:bg-black/40'
              }`}
            title={isFavorite ? "取消收藏" : "添加收藏"}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'text-white fill-current' : 'text-white'}`} />
          </button>
        )}

        {/* 全屏按钮 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFullscreen();
          }}
          className="p-2 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm transition-all border border-white/20"
          title="进入全屏模式"
        >
          <Maximize2 className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* 主要内容 */}
      <div className="relative z-10">
        {/* 头部：货币信息 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getCryptoColor(data.symbol)} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
              {getCryptoIcon(data.symbol)}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{data.symbol.replace('USDT', '')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{data.symbol}</p>
            </div>
          </div>

          {/* 趋势图标 */}
          <div className={`p-2 rounded-full ${isPositive
            ? 'bg-success-100 dark:bg-success-900/20'
            : isNeutral
              ? 'bg-gray-100 dark:bg-gray-800/20'
              : 'bg-danger-100 dark:bg-danger-900/20'
            }`}>
            {isPositive ? (
              <TrendingUp className="w-5 h-5 text-success-600 dark:text-success-400" />
            ) : isNeutral ? (
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-3 h-0.5 bg-gray-600 dark:bg-gray-400 rounded"></div>
              </div>
            ) : (
              <TrendingDown className="w-5 h-5 text-danger-600 dark:text-danger-400" />
            )}
          </div>
        </div>

        {/* 价格信息 */}
        <div className="space-y-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono">
              ${formatPrice(data.price)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">USDT</span>
          </div>

          {/* 价格变化 */}
          <div className="flex items-center space-x-3">
            <motion.span
              className={`font-medium ${isPositive
                ? 'text-success-600 dark:text-success-400'
                : isNeutral
                  ? 'text-gray-600 dark:text-gray-400'
                  : 'text-danger-600 dark:text-danger-400'
                }`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.3 }}
              key={`${data.symbol}-change-${data.priceChange.toFixed(2)}`}
            >
              {isPositive ? '+' : ''}{data.priceChange.toFixed(2)}
            </motion.span>
            <motion.span
              className={`px-2 py-1 rounded-full text-xs font-medium ${isPositive
                ? 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300'
                : isNeutral
                  ? 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300'
                  : 'bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300'
                }`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.3 }}
              key={`${data.symbol}-percent-${data.priceChangePercent.toFixed(2)}`}
            >
              {isPositive ? '+' : ''}{data.priceChangePercent.toFixed(2)}%
            </motion.span>
          </div>
        </div>

        {/* 交易量 */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">24h 成交量</span>
            <span className="font-medium">{formatVolume(data.volume)}</span>
          </div>
        </div>

        {/* 更新时间 */}
        <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          更新于 {data.lastUpdate.toLocaleTimeString('zh-CN')}
        </div>
      </div>

      {/* 动态边框效果 */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(45deg, transparent, transparent)',
          backgroundSize: '400% 400%',
          animation: 'gradient-shift 3s ease infinite'
        }} />
    </motion.div>
  );
}; 