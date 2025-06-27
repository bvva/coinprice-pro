import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Grid, TrendingUp, TrendingDown, Settings, Newspaper, Edit } from 'lucide-react';
import { CryptoData } from '../types';
import { DraggableNewsCard } from './DraggableNewsCard';

interface GridFullscreenModeProps {
  isOpen: boolean;
  onClose: () => void;
  cryptoData: CryptoData[];
  language: 'zh' | 'en';
  selectedSymbols?: string[];
  onSymbolsChange?: (symbols: string[]) => void;
  fullscreenMode: 'browser' | 'ui-only';
  fullscreenBackground: 'default' | 'gradient' | 'matrix' | 'wave' | 'particle' | 'neon' | 'cosmic' | 'pixel' | 'hacker';
  news: any[];
  newsLoading: boolean;
  newsError: string | null;
  onNewsRefresh: () => void;
}

type GridLayout = '2x2' | '3x2' | '3x3' | '2x3';

interface GridConfig {
  layout: GridLayout;
  name: string;
  nameEn: string;
  cols: number;
  rows: number;
  maxSymbols: number;
}

const GRID_CONFIGS: GridConfig[] = [
  { layout: '2x2', name: '2×2 (4格)', nameEn: '2×2 (4 grids)', cols: 2, rows: 2, maxSymbols: 4 },
  { layout: '3x2', name: '3×2 (6格)', nameEn: '3×2 (6 grids)', cols: 3, rows: 2, maxSymbols: 6 },
  { layout: '2x3', name: '2×3 (6格)', nameEn: '2×3 (6 grids)', cols: 2, rows: 3, maxSymbols: 6 },
  { layout: '3x3', name: '3×3 (9格)', nameEn: '3×3 (9 grids)', cols: 3, rows: 3, maxSymbols: 9 },
];

const AVAILABLE_SYMBOLS = [
  'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'SOLUSDT', 'ADAUSDT', 'DOGEUSDT', 'AVAXUSDT',
  'TRXUSDT', 'LINKUSDT', 'TONUSDT', 'MATICUSDT', 'WBTCUSDT', 'ICPUSDT', 'SHIBUSDT', 'NEARUSDT',
  'UNIUSDT', 'APTUSDT', 'FETUSDT', 'LDOUSDT', 'PEPEUSDT', 'HBARUSDT', 'XLMUSDT', 'LTCUSDT',
  'KASUSDT', 'ETCUSDT', 'BCHUSDT', 'ATOMUSDT', 'RNDRUSDT', 'FILUSDT', 'CRVUSDT', 'AAVEUSDT',
  'MKRUSDT', 'TIAUSDT', 'INJUSDT', 'OPUSDT', 'WIFUSDT', 'ARBUSDT', 'GRTUSDT', 'FLOKIUSDT'
];

export const GridFullscreenMode: React.FC<GridFullscreenModeProps> = ({
  isOpen,
  onClose,
  cryptoData,
  language,
  selectedSymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT'],
  onSymbolsChange,
  fullscreenMode,
  fullscreenBackground,
  news,
  newsLoading,
  newsError,
  onNewsRefresh
}) => {
  const [currentLayout, setCurrentLayout] = useState<GridLayout>('2x2');
  const [showSettings, setShowSettings] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showNewsCard, setShowNewsCard] = useState(true);
  const [showSymbolSelector, setShowSymbolSelector] = useState(false);

  const currentConfig = GRID_CONFIGS.find(config => config.layout === currentLayout)!;
  const displaySymbols = selectedSymbols.slice(0, currentConfig.maxSymbols);

  // 处理关闭全屏
  const handleClose = () => {
    // 如果是浏览器全屏模式，先退出浏览器全屏
    if (fullscreenMode === 'browser' && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {
        console.log('Failed to exit fullscreen');
      });
    }
    onClose();
  };

  // 控制按钮隐藏逻辑
  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 5000);
      setHideTimeout(timeout);

      const handleMouseMove = () => {
        setShowControls(true);
        if (hideTimeout) {
          clearTimeout(hideTimeout);
        }
        const newTimeout = setTimeout(() => {
          setShowControls(false);
        }, 3000);
        setHideTimeout(newTimeout);
      };

      document.addEventListener('mousemove', handleMouseMove);

      return () => {
        if (hideTimeout) {
          clearTimeout(hideTimeout);
        }
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isOpen, hideTimeout]);

  // ESC键退出和浏览器全屏
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      // 尝试浏览器全屏
      if (fullscreenMode === 'browser') {
        const docEl = document.documentElement as any;
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen().catch(() => {
            console.log('Fullscreen not supported, using UI-only mode');
          });
        }
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, fullscreenMode, handleClose]);

  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return price.toFixed(6);
  };

  const getBackgroundStyle = (background: string): React.CSSProperties => {
    switch (background) {
      case 'default':
        return {
          background: '#000000'
        };
      case 'gradient':
        return {
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 0%, rgba(255, 131, 122, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 0% 50%, rgba(255, 121, 198, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 100%, rgba(120, 219, 255, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 0% 0%, rgba(233, 30, 99, 0.5) 0%, transparent 50%),
            linear-gradient(135deg, #0c0c0c 0%, #000000 100%)
          `,
          animation: 'gradientShift 8s ease-in-out infinite alternate'
        };
      case 'matrix':
        return {
          background: `
            linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #0f0f23 100%),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 98px,
              rgba(0, 255, 0, 0.08) 100px
            ),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 98px,
              rgba(0, 255, 0, 0.08) 100px
            )
          `,
          backgroundSize: '100% 100%, 100px 100px, 100px 100px',
          animation: 'matrixFlow 6s linear infinite, matrixGlow 2s ease-in-out infinite alternate'
        };
      case 'wave':
        return {
          background: `
            linear-gradient(45deg, #667eea 0%, #764ba2 20%, #f093fb 40%, #f5576c 60%, #4facfe 80%, #00d2ff 100%),
            radial-gradient(ellipse at 0% 0%, rgba(255, 0, 150, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 100%, rgba(0, 200, 255, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 0% 100%, rgba(150, 0, 255, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 0%, rgba(255, 150, 0, 0.3) 0%, transparent 50%),
            linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)
          `,
          backgroundSize: '300% 300%, 600px 600px, 800px 800px, 700px 700px, 500px 500px, 200% 200%',
          animation: 'waveMove 8s ease-in-out infinite, waveShift 12s linear infinite, waveGlow 6s ease-in-out infinite alternate'
        };
      case 'particle':
        return {
          background: `
            radial-gradient(ellipse at center, #0a0a2e 0%, #1e3c72 50%, #2a5298 100%),
            radial-gradient(circle at 5% 10%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 2%, transparent 3%),
            radial-gradient(circle at 15% 25%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.3) 1.5%, transparent 2.5%),
            radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.5) 1%, transparent 2%),
            radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.4) 1.2%, transparent 2.2%),
            radial-gradient(circle at 20% 60%, rgba(0, 255, 255, 0.6) 0%, rgba(0, 255, 255, 0.3) 3%, transparent 5%),
            radial-gradient(circle at 90% 40%, rgba(255, 0, 255, 0.5) 0%, rgba(255, 0, 255, 0.2) 4%, transparent 6%),
            radial-gradient(circle at 40% 90%, rgba(255, 255, 0, 0.4) 0%, rgba(255, 255, 0, 0.2) 5%, transparent 8%),
            radial-gradient(circle at 60% 20%, rgba(255, 100, 0, 0.5) 0%, rgba(255, 100, 0, 0.3) 3.5%, transparent 6%),
            radial-gradient(circle at 30% 30%, rgba(100, 255, 100, 0.4) 0%, rgba(100, 255, 100, 0.2) 4.5%, transparent 7%)
          `,
          backgroundSize: '100% 100%, 3px 3px, 2px 2px, 2px 2px, 2.5px 2.5px, 8px 8px, 10px 10px, 12px 12px, 9px 9px, 11px 11px',
          animation: 'particleFloat 10s ease-in-out infinite, particleGlow 4s ease-in-out infinite alternate, particleTwinkle 2s ease-in-out infinite'
        };
      case 'neon':
        return {
          background: `
            radial-gradient(ellipse at center, #000000 0%, #1a0033 50%, #330066 100%),
            linear-gradient(45deg, transparent 30%, rgba(255, 0, 255, 0.3) 50%, transparent 70%),
            linear-gradient(-45deg, transparent 30%, rgba(0, 255, 255, 0.3) 50%, transparent 70%),
            radial-gradient(circle at 25% 25%, rgba(255, 0, 255, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(0, 255, 255, 0.4) 0%, transparent 50%)
          `,
          backgroundSize: '100% 100%, 200% 200%, 200% 200%, 300px 300px, 400px 400px',
          animation: 'neonPulse 3s ease-in-out infinite alternate, neonMove 8s linear infinite'
        };
      case 'cosmic':
        return {
          background: `
            radial-gradient(ellipse at center, #0a0a0a 0%, #1a0d2e 30%, #16213e 60%, #0f4c75 100%),
            radial-gradient(circle at 10% 20%, rgba(255, 215, 0, 0.3) 0%, transparent 20%),
            radial-gradient(circle at 90% 80%, rgba(255, 105, 180, 0.4) 0%, transparent 30%),
            radial-gradient(circle at 30% 70%, rgba(138, 43, 226, 0.3) 0%, transparent 25%),
            radial-gradient(circle at 80% 10%, rgba(30, 144, 255, 0.4) 0%, transparent 35%),
            radial-gradient(circle at 60% 40%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 2%),
            radial-gradient(circle at 20% 60%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 1%),
            radial-gradient(circle at 85% 30%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 1.5%),
            radial-gradient(circle at 45% 80%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 1%)
          `,
          backgroundSize: '100% 100%, 400px 400px, 500px 500px, 350px 350px, 450px 450px, 3px 3px, 2px 2px, 2px 2px, 2px 2px',
          animation: 'cosmicSwirl 20s linear infinite, cosmicTwinkle 4s ease-in-out infinite alternate, cosmicGlow 8s ease-in-out infinite'
        };
      case 'pixel':
        return {
          backgroundColor: '#2a2a3e',
          backgroundImage: `
            linear-gradient(90deg, 
              #ff6b6b 0%, #ff6b6b 12.5%,
              #4ecdc4 12.5%, #4ecdc4 25%,
              #45b7d1 25%, #45b7d1 37.5%,
              #f9ca24 37.5%, #f9ca24 50%,
              #f0932b 50%, #f0932b 62.5%,
              #eb4d4b 62.5%, #eb4d4b 75%,
              #6c5ce7 75%, #6c5ce7 87.5%,
              #fd79a8 87.5%, #fd79a8 100%
            ),
            linear-gradient(0deg, 
              #ff6b6b 0%, #ff6b6b 12.5%,
              #4ecdc4 12.5%, #4ecdc4 25%,
              #45b7d1 25%, #45b7d1 37.5%,
              #f9ca24 37.5%, #f9ca24 50%,
              #f0932b 50%, #f0932b 62.5%,
              #eb4d4b 62.5%, #eb4d4b 75%,
              #6c5ce7 75%, #6c5ce7 87.5%,
              #fd79a8 87.5%, #fd79a8 100%
            ),
            linear-gradient(45deg, 
              transparent 0%, transparent 49%,
              rgba(255, 255, 255, 0.1) 49%, rgba(255, 255, 255, 0.1) 51%,
              transparent 51%, transparent 100%
            )
          `,
          backgroundSize: '64px 64px, 64px 64px, 16px 16px',
          backgroundBlendMode: 'multiply, screen, overlay',
          animation: 'pixelShift 12s linear infinite, pixelPulse 4s ease-in-out infinite alternate',
          imageRendering: 'pixelated' as any,
          filter: 'contrast(1.8) saturate(1.5)',
          fontFamily: '"Courier New", "Lucida Console", monospace'
        };
      case 'hacker':
        return {
          backgroundColor: '#000000',
          backgroundImage: 'radial-gradient(ellipse at center, #000000 0%, #001100 50%, #000000 100%)',
          fontFamily: '"Courier New", "Lucida Console", monospace',
          color: '#00ff00',
          overflow: 'hidden'
        };
      default:
        return {
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.95) 100%)'
        };
    }
  };

  const getCryptoIcon = (symbol: string): string => {
    const iconMap: { [key: string]: string } = {
      'BTCUSDT': '₿', 'ETHUSDT': 'Ξ', 'BNBUSDT': '🔶', 'XRPUSDT': '💧',
      'SOLUSDT': '◎', 'ADAUSDT': '₳', 'DOGEUSDT': '🐕', 'AVAXUSDT': '🔺',
      'TRXUSDT': 'Ⱦ', 'LINKUSDT': '🔗', 'TONUSDT': '💎', 'MATICUSDT': '🔷',
      'UNIUSDT': '🦄', 'APTUSDT': 'Ⓐ', 'PEPEUSDT': '🐸', 'SHIBUSDT': '🐕'
    };
    return iconMap[symbol] || symbol.replace('USDT', '').substring(0, 2);
  };

  const getCryptoColor = (symbol: string): string => {
    const colorMap: { [key: string]: string } = {
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
      'APTUSDT': 'from-green-400 to-green-600',
      'PEPEUSDT': 'from-green-400 to-green-600',
      'SHIBUSDT': 'from-orange-300 to-orange-500'
    };
    return colorMap[symbol] || 'from-gray-400 to-gray-600';
  };

  const toggleSymbolSelection = (symbol: string) => {
    if (!onSymbolsChange) return;

    const newSymbols = [...selectedSymbols];
    const index = newSymbols.indexOf(symbol);

    if (index > -1) {
      // 移除已选择的代币
      newSymbols.splice(index, 1);
    } else {
      // 添加新代币，但不超过当前布局的最大数量
      if (newSymbols.length < currentConfig.maxSymbols) {
        newSymbols.push(symbol);
      }
    }

    onSymbolsChange(newSymbols);
  };

  const renderGridItem = (symbol: string, index: number) => {
    const data = cryptoData.find(crypto => crypto.symbol === symbol);
    if (!data) return null;

    const isPositive = data.priceChange >= 0;

    return (
      <motion.div
        key={symbol}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className="relative bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-6 flex flex-col items-center justify-center h-full min-h-[200px] hover:bg-black/50 transition-all group"
      >
        {/* 币种图标和名称 */}
        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getCryptoColor(symbol)} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
            {getCryptoIcon(symbol)}
          </div>
          <div className="text-center">
            <h3 className="text-white font-bold text-xl">{symbol.replace('USDT', '')}</h3>
            <p className="text-white/60 text-sm">USDT</p>
          </div>
        </div>

        {/* 价格 */}
        <motion.div
          key={data.price}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.3 }}
          className="text-center mb-4"
        >
          <div className="text-white font-mono text-3xl font-bold mb-2">
            ${formatPrice(data.price)}
          </div>
        </motion.div>

        {/* 涨跌幅 */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isPositive ? (
              <TrendingUp className="w-5 h-5 text-success-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-danger-400" />
            )}
            <span className={`text-lg font-bold ${isPositive ? 'text-success-400' : 'text-danger-400'}`}>
              {isPositive ? '+' : ''}{data.priceChange.toFixed(2)}
            </span>
          </div>

          <div className={`px-3 py-1 rounded-full text-sm font-bold ${isPositive
            ? 'bg-success-500/20 text-success-400 border border-success-500/30'
            : 'bg-danger-500/20 text-danger-400 border border-danger-500/30'
            }`}>
            {isPositive ? '+' : ''}{data.priceChangePercent.toFixed(2)}%
          </div>
        </div>

        {/* 最后更新时间 */}
        <div className="absolute bottom-2 right-2 text-white/40 text-xs">
          {data.lastUpdate.toLocaleTimeString()}
        </div>
      </motion.div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 ${fullscreenBackground === 'pixel' ? 'pixel-theme' : ''} ${fullscreenBackground === 'hacker' ? 'hacker-theme' : ''}`}
        style={getBackgroundStyle(fullscreenBackground)}
      >
        {/* 控制按钮 */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-6 right-6 z-50 flex space-x-2"
            >
              {/* 快讯按钮 */}
              <button
                onClick={() => setShowNewsCard(!showNewsCard)}
                className={`p-3 rounded-full transition-colors backdrop-blur-sm ${showNewsCard
                  ? 'bg-blue-500/30 hover:bg-blue-500/40 border border-blue-400/50'
                  : 'bg-white/10 hover:bg-white/20'
                  }`}
                title={language === 'zh' ? (showNewsCard ? '隐藏快讯' : '显示快讯') : (showNewsCard ? 'Hide News' : 'Show News')}
              >
                <Newspaper className="w-6 h-6 text-white" />
              </button>

              {/* 代币选择按钮 */}
              <button
                onClick={() => setShowSymbolSelector(!showSymbolSelector)}
                className={`p-3 rounded-full transition-colors backdrop-blur-sm ${showSymbolSelector
                  ? 'bg-green-500/30 hover:bg-green-500/40 border border-green-400/50'
                  : 'bg-white/10 hover:bg-white/20'
                  }`}
                title={language === 'zh' ? '选择代币' : 'Select Symbols'}
              >
                <Edit className="w-6 h-6 text-white" />
              </button>

              {/* 设置按钮 */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-3 rounded-full transition-colors backdrop-blur-sm ${showSettings
                  ? 'bg-purple-500/30 hover:bg-purple-500/40 border border-purple-400/50'
                  : 'bg-white/10 hover:bg-white/20'
                  }`}
                title={language === 'zh' ? '布局设置' : 'Layout Settings'}
              >
                <Settings className="w-6 h-6 text-white" />
              </button>

              {/* 退出按钮 */}
              <button
                onClick={handleClose}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
                title={language === 'zh' ? '退出' : 'Exit'}
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 设置面板 */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute top-20 right-6 z-50 bg-black/90 backdrop-blur-md border border-white/20 rounded-xl p-6 w-80"
            >
              <h3 className="text-white font-bold text-lg mb-4">
                {language === 'zh' ? '布局设置' : 'Layout Settings'}
              </h3>

              <div className="space-y-3">
                {GRID_CONFIGS.map((config) => (
                  <button
                    key={config.layout}
                    onClick={() => setCurrentLayout(config.layout)}
                    className={`w-full p-3 rounded-lg flex items-center space-x-3 transition-colors ${currentLayout === config.layout
                      ? 'bg-purple-500/30 border border-purple-400/50 text-purple-200'
                      : 'bg-white/5 hover:bg-white/10 text-white/80'
                      }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Grid className="w-5 h-5" />
                      <span>{language === 'zh' ? config.name : config.nameEn}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 代币选择面板 */}
        <AnimatePresence>
          {showSymbolSelector && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute top-20 right-6 z-50 bg-black/90 backdrop-blur-md border border-white/20 rounded-xl p-6 w-96 max-h-96 overflow-y-auto"
            >
              <h3 className="text-white font-bold text-lg mb-4">
                {language === 'zh' ? '选择代币' : 'Select Symbols'}
                <span className="text-sm text-white/60 ml-2">
                  ({selectedSymbols.length}/{currentConfig.maxSymbols})
                </span>
              </h3>

              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto custom-scrollbar">
                {AVAILABLE_SYMBOLS.map((symbol) => {
                  const isSelected = selectedSymbols.includes(symbol);
                  const canSelect = selectedSymbols.length < currentConfig.maxSymbols || isSelected;

                  return (
                    <button
                      key={symbol}
                      onClick={() => toggleSymbolSelection(symbol)}
                      disabled={!canSelect}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${isSelected
                        ? 'bg-green-500/30 border border-green-400/50 text-green-200'
                        : canSelect
                          ? 'bg-white/5 hover:bg-white/10 text-white/80 border border-transparent hover:border-white/20'
                          : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${getCryptoColor(symbol)} flex items-center justify-center text-white text-xs font-bold`}>
                        {getCryptoIcon(symbol)}
                      </div>
                      <span>{symbol.replace('USDT', '')}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 text-xs text-white/60">
                {language === 'zh'
                  ? `最多可选择 ${currentConfig.maxSymbols} 个代币`
                  : `Maximum ${currentConfig.maxSymbols} symbols can be selected`
                }
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ESC 提示 */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-6 left-6 text-white/60 text-sm z-50"
            >
              {language === 'zh' ? '按 ESC 键退出' : 'Press ESC to exit'}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 网格布局 */}
        <div className="h-full p-8">
          <div
            className="h-full gap-6"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${currentConfig.cols}, 1fr)`,
              gridTemplateRows: `repeat(${currentConfig.rows}, 1fr)`
            }}
          >
            {displaySymbols.map((symbol, index) => renderGridItem(symbol, index))}
          </div>
        </div>

        {/* 可拖动的快讯卡片 */}
        <DraggableNewsCard
          language={language}
          isVisible={showNewsCard}
          onToggleVisibility={() => setShowNewsCard(false)}
          news={news}
          loading={newsLoading}
          error={newsError}
          onRefresh={onNewsRefresh}
        />
      </motion.div>
    </AnimatePresence>
  );
}; 