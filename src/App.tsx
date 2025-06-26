import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Wifi, WifiOff, AlertCircle, Heart } from 'lucide-react';
import { Header } from './components/Header';
import { CryptoCard } from './components/CryptoCard';
import { FullscreenPrice } from './components/FullscreenPrice';
import { useCrypto, useFullscreenCrypto } from './hooks/useCrypto';

// 按市值排序的前100个热门加密货币
const POPULAR_CRYPTOS = [
  // 前10大
  'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'SOLUSDT',
  'ADAUSDT', 'DOGEUSDT', 'AVAXUSDT', 'TRXUSDT', 'LINKUSDT',

  // 11-20
  'TONUSDT', 'MATICUSDT', 'WBTCUSDT', 'ICPUSDT', 'SHIBUSDT',
  'NEARUSDT', 'UNIUSDT', 'APTUSDT', 'FETUSDT', 'LDOUSDT',

  // 21-30  
  'PEPEUSDT', 'HBARUSDT', 'XLMUSDT', 'LTCUSDT', 'KASUSDT',
  'ETCUSDT', 'BCHUSDT', 'ATOMUSDT', 'RNDRUSDT', 'FILUSDT',

  // 31-40
  'CRVUSDT', 'AAVEUSDT', 'MKRUSDT', 'TIAUSDT', 'INJUSDT',
  'OPUSDT', 'WIFUSDT', 'ARBUSDT', 'GRTUSDT', 'FLOKIUSDT',

  // 41-50
  'ALGOUSDT', 'VETUSDT', 'MANAUSDT', 'SANDUSDT', 'AXSUSDT',
  'THETAUSDT', 'FLOWUSDT', 'EGGSUSDT', 'CHZUSDT', 'APEUSDT',

  // 51-60
  'DOTUSDT', 'RUNEUSDT', 'WLDUSDT', 'ENJUSDT', 'XTZUSDT',
  'QNTUSDT', 'KSMUSDT', 'SUIUSDT', 'ROSUSDT', 'JUPUSDT',

  // 61-70
  'RAYUSDT', 'ORDIUSDT', 'MINAUSDT', 'ZILUSDT', 'GODSUSDT',
  'KLAYUSDT', 'COMPUSDT', 'MOVRUSDT', 'FANTUSDT', 'PENDLEUSDT',

  // 71-80
  'YFIUSDT', 'PYTHUSDT', 'IOTAUSDT', 'ZECUSDT', 'DASHUSDT',
  'SNTUSDT', 'ARUSDT', 'LRCUSDT', 'CELERXUSDT', 'WAVEUSDT',

  // 81-90  
  'ARKMUSDT', 'GMTUSDT', 'GALAUSDT', 'XMRUSDT', 'BNXUSDT',
  'EOSUSDT', 'XEMUSDT', 'NKNUSDT', 'BAKEUSDT', 'SXPUSDT',

  // 91-100
  'DENTUSDT', 'RSRUSDT', 'REEFUSDT', 'CKBUSDT', 'ONEUSDT',
  'CTSIUSDT', 'STORJUSDT', 'OCEANUSDT', 'BTTCUSDT', 'CELOUSDT'
];

function App() {
  // 主题和设置状态
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true; // 默认深色主题
  });

  const [language, setLanguage] = useState<'zh' | 'en'>(() => {
    const saved = localStorage.getItem('language');
    return (saved as 'zh' | 'en') || 'zh';
  });

  const [exchange, setExchange] = useState<'binance' | 'okx'>(() => {
    const saved = localStorage.getItem('exchange');
    return (saved as 'binance' | 'okx') || 'okx';
  });

  const [fullscreenMode, setFullscreenMode] = useState<'browser' | 'ui-only'>(() => {
    const saved = localStorage.getItem('fullscreenMode');
    return (saved as 'browser' | 'ui-only') || 'browser';
  });

  const [fullscreenInfoMode, setFullscreenInfoMode] = useState<'rich' | 'simple'>(() => {
    const saved = localStorage.getItem('fullscreenInfoMode');
    return (saved as 'rich' | 'simple') || 'rich';
  });

  const [fullscreenBackground, setFullscreenBackground] = useState<'default' | 'gradient' | 'matrix' | 'wave' | 'particle' | 'neon' | 'cosmic' | 'pixel' | 'hacker'>(() => {
    const saved = localStorage.getItem('fullscreenBackground');
    return (saved as 'default' | 'gradient' | 'matrix' | 'wave' | 'particle' | 'neon' | 'cosmic' | 'pixel' | 'hacker') || 'default';
  });

  // 自选列表状态
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // 全屏状态
  const [fullscreenSymbol, setFullscreenSymbol] = useState<string | null>(null);

  // 使用自定义 hooks
  const { cryptoData, isConnected, error, loading, subscribe } = useCrypto({ exchange });
  const { data: fullscreenData, klineData } = useFullscreenCrypto(fullscreenSymbol || '', exchange);

  // 主题切换
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // 处理全屏 - 简化为只控制UI状态
  const handleFullscreen = (symbol: string) => {
    console.log('Opening fullscreen for:', symbol);
    setFullscreenSymbol(symbol);
  };

  const handleExitFullscreen = () => {
    console.log('Closing fullscreen');
    setFullscreenSymbol(null);
  };

  // 订阅加密货币数据
  useEffect(() => {
    const unsubscribeFunctions: (() => void)[] = [];

    POPULAR_CRYPTOS.forEach(symbol => {
      const unsubscribe = subscribe(symbol);
      unsubscribeFunctions.push(unsubscribe);
    });

    return () => {
      unsubscribeFunctions.forEach(fn => fn());
    };
  }, [subscribe]);

  // 保存设置到 localStorage
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('exchange', exchange);
  }, [exchange]);

  useEffect(() => {
    localStorage.setItem('fullscreenMode', fullscreenMode);
  }, [fullscreenMode]);

  useEffect(() => {
    localStorage.setItem('fullscreenInfoMode', fullscreenInfoMode);
  }, [fullscreenInfoMode]);

  useEffect(() => {
    localStorage.setItem('fullscreenBackground', fullscreenBackground);
  }, [fullscreenBackground]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // 收藏/取消收藏
  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => {
      if (prev.includes(symbol)) {
        return prev.filter(s => s !== symbol);
      } else {
        return [...prev, symbol];
      }
    });
  };

  // 获取特定加密货币的数据
  const getCryptoBySymbol = (symbol: string) => {
    return cryptoData.find(crypto => crypto.symbol === symbol);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      {/* Header */}
      <Header
        isDark={isDark}
        onThemeToggle={toggleTheme}
        language={language}
        onLanguageChange={setLanguage}
        exchange={exchange}
        onExchangeChange={setExchange}
        fullscreenMode={fullscreenMode}
        onFullscreenModeChange={setFullscreenMode}
        fullscreenInfoMode={fullscreenInfoMode}
        onFullscreenInfoModeChange={setFullscreenInfoMode}
        fullscreenBackground={fullscreenBackground}
        onFullscreenBackgroundChange={setFullscreenBackground}
      />

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-8">
        {/* 连接状态指示器和Tab切换 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              {language === 'zh' ? '加密货币' : 'Cryptocurrencies'}
            </h2>

            <div className="flex items-center space-x-2">
              {isConnected ? (
                <div className="flex items-center space-x-2 text-success-600 dark:text-success-400">
                  <Wifi className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {language === 'zh' ? '已连接' : 'Connected'} ({exchange.toUpperCase()})
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-danger-600 dark:text-danger-400">
                  <WifiOff className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {language === 'zh' ? '连接中...' : 'Connecting...'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Tab切换 */}
          <div className="flex space-x-1 p-1 glass-effect rounded-lg">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'all'
                ? 'bg-primary-500 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10'
                }`}
            >
              {language === 'zh' ? '全部' : 'All'} ({POPULAR_CRYPTOS.length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'favorites'
                ? 'bg-primary-500 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10'
                }`}
            >
              {language === 'zh' ? '自选' : 'Favorites'} ({favorites.length})
            </button>
          </div>
        </motion.div>

        {/* 错误提示 */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-6 p-4 bg-danger-100 border border-danger-200 text-danger-800 rounded-lg flex items-center space-x-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-medium">
                  {language === 'zh' ? '连接错误' : 'Connection Error'}
                </p>
                <p className="text-sm">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 加载状态 - 只在没有任何数据且正在加载时显示 */}
        {loading && cryptoData.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-12"
          >
            <div className="flex items-center space-x-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              <span className="text-lg text-gray-600 dark:text-gray-300">
                {language === 'zh' ? '加载中...' : 'Loading...'}
              </span>
            </div>
          </motion.div>
        )}

        {/* 加密货币卡片网格 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence>
            {(activeTab === 'all' ? POPULAR_CRYPTOS : favorites).map((symbol) => {
              const data = getCryptoBySymbol(symbol);
              return data ? (
                <motion.div
                  key={symbol}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <CryptoCard
                    data={data}
                    onFullscreen={() => handleFullscreen(symbol)}
                    isFavorite={favorites.includes(symbol)}
                    onToggleFavorite={() => toggleFavorite(symbol)}
                  />
                </motion.div>
              ) : (
                // 只在初始加载或连接失败时显示骨架屏
                (!isConnected || loading) && (
                  <motion.div
                    key={`skeleton-${symbol}`}
                    className="crypto-card animate-pulse"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                      </div>
                    </div>
                  </motion.div>
                )
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* 空状态提示 */}
        {activeTab === 'favorites' && favorites.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-2">
              {language === 'zh' ? '还没有收藏的加密货币' : 'No favorite cryptocurrencies yet'}
            </p>
            <p className="text-gray-400 dark:text-gray-500">
              {language === 'zh'
                ? '点击加密货币卡片上的心形图标来添加收藏'
                : 'Click the heart icon on any cryptocurrency card to add favorites'
              }
            </p>
          </motion.div>
        )}

        {/* 提示文本 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 py-8"
        >
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {language === 'zh'
              ? '点击任意加密货币卡片右上角的全屏按钮，即可进入全屏价格显示模式，享受炫酷的实时价格展示和简约的 K 线图。'
              : 'Click the fullscreen button in the top-right corner of any cryptocurrency card to enter fullscreen price display mode and enjoy cool real-time price display and minimalist candlestick charts.'
            }
          </p>
        </motion.div>
      </main>

      {/* 全屏价格显示 */}
      <FullscreenPrice
        isOpen={!!fullscreenSymbol}
        onClose={handleExitFullscreen}
        data={fullscreenData}
        klineData={klineData}
        symbol={fullscreenSymbol || ''}
        fullscreenMode={fullscreenMode}
        fullscreenInfoMode={fullscreenInfoMode}
        fullscreenBackground={fullscreenBackground}
      />

      {/* 浮动的动画背景元素 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-success-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-3/4 left-1/3 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
    </div>
  );
}

export default App; 