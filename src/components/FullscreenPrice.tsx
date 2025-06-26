import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CryptoData, KlineData } from '../types';
import { MiniChart } from './MiniChart';

interface FullscreenPriceProps {
  isOpen: boolean;
  onClose: () => void;
  data: CryptoData | null;
  klineData: KlineData[];
  symbol: string;
  fullscreenMode: 'browser' | 'ui-only';
  fullscreenInfoMode: 'rich' | 'simple';
  fullscreenBackground: 'default' | 'gradient' | 'matrix' | 'wave' | 'particle' | 'neon' | 'cosmic' | 'pixel' | 'hacker';
}

export const FullscreenPrice: React.FC<FullscreenPriceProps> = ({
  isOpen,
  onClose,
  data,
  klineData,
  symbol,
  fullscreenMode,
  fullscreenInfoMode,
  fullscreenBackground
}) => {
  const { t } = useTranslation();
  const [showControls, setShowControls] = useState(true);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [originalTitle, setOriginalTitle] = useState<string>('');
  const [matrixRain, setMatrixRain] = useState<JSX.Element[]>([]);

  // 数字雨类型定义
  interface MatrixChar {
    char: string;
    opacity: number;
    isHead: boolean;
  }

  interface MatrixColumn {
    id: number;
    x: number;
    y: number;
    speed: number;
    chars: MatrixChar[];
  }

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
      // 7秒后隐藏控制按钮
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 7000);
      setHideTimeout(timeout);

      // 鼠标移动时显示控制按钮
      const handleMouseMove = () => {
        setShowControls(true);
        if (hideTimeout) {
          clearTimeout(hideTimeout);
        }
        const newTimeout = setTimeout(() => {
          setShowControls(false);
        }, 3000); // 3秒后再次隐藏
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

  // 当前时间更新
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isOpen]);

  // 黑客主题数字雨效果
  useEffect(() => {
    if (isOpen && fullscreenBackground === 'hacker') {
      const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:,.<>?';
      const matrixColumns: MatrixColumn[] = [];
      const columnCount = Math.floor(window.innerWidth / 20);

      // 创建数字雨列
      for (let i = 0; i < columnCount; i++) {
        const column = [];
        const columnHeight = Math.floor(Math.random() * 30) + 10;

        for (let j = 0; j < columnHeight; j++) {
          column.push({
            char: characters[Math.floor(Math.random() * characters.length)],
            opacity: Math.max(0.1, 1 - (j / columnHeight)),
            isHead: j === 0
          });
        }

        matrixColumns.push({
          id: i,
          x: i * 20,
          y: Math.random() * -500,
          speed: Math.random() * 3 + 1,
          chars: column
        });
      }

      const rainElements = matrixColumns.map((column) => (
        <div
          key={column.id}
          className="matrix-column"
          style={{
            position: 'absolute',
            left: `${column.x}px`,
            top: `${column.y}px`,
            fontSize: '14px',
            fontFamily: 'Courier New, monospace',
            color: '#00ff00',
            lineHeight: '18px',
            animation: `matrixFall-${column.id} ${15 / column.speed}s linear infinite`
          }}
        >
          {column.chars.map((char, charIndex) => (
            <div
              key={charIndex}
              style={{
                opacity: char.opacity,
                color: char.isHead ? '#ffffff' : '#00ff00',
                textShadow: char.isHead
                  ? '0 0 10px #ffffff, 0 0 20px #00ff00'
                  : '0 0 5px #00ff00',
                fontWeight: char.isHead ? 'bold' : 'normal'
              }}
            >
              {char.char}
            </div>
          ))}
        </div>
      ));

      setMatrixRain(rainElements);

      // 动态更新字符
      const updateInterval = setInterval(() => {
        const newRainElements = matrixColumns.map((column) => {
          // 随机更新字符
          if (Math.random() < 0.1) {
            column.chars.forEach(char => {
              if (Math.random() < 0.3) {
                char.char = characters[Math.floor(Math.random() * characters.length)];
              }
            });
          }

          return (
            <div
              key={column.id}
              className="matrix-column"
              style={{
                position: 'absolute',
                left: `${column.x}px`,
                top: `${column.y}px`,
                fontSize: '14px',
                fontFamily: 'Courier New, monospace',
                color: '#00ff00',
                lineHeight: '18px',
                animation: `matrixFall-${column.id} ${15 / column.speed}s linear infinite`
              }}
            >
              {column.chars.map((char, charIndex) => (
                <div
                  key={charIndex}
                  style={{
                    opacity: char.opacity,
                    color: char.isHead ? '#ffffff' : '#00ff00',
                    textShadow: char.isHead
                      ? '0 0 10px #ffffff, 0 0 20px #00ff00'
                      : '0 0 5px #00ff00',
                    fontWeight: char.isHead ? 'bold' : 'normal'
                  }}
                >
                  {char.char}
                </div>
              ))}
            </div>
          );
        });

        setMatrixRain(newRainElements);
      }, 150);

      // 添加CSS动画
      const style = document.createElement('style');
      style.textContent = matrixColumns.map(column => `
        @keyframes matrixFall-${column.id} {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
      `).join('\n');
      document.head.appendChild(style);

      return () => {
        clearInterval(updateInterval);
        document.head.removeChild(style);
        setMatrixRain([]);
      };
    } else {
      setMatrixRain([]);
    }
  }, [isOpen, fullscreenBackground]);

  // 网站标题价格更新
  useEffect(() => {
    if (isOpen && data) {
      // 保存原始标题
      if (!originalTitle) {
        setOriginalTitle(document.title);
      }

      // 更新标题为实时价格
      const cryptoName = symbol.replace('USDT', '');
      const priceText = `$${formatPrice(data.price)}`;
      const changeText = data.priceChange >= 0 ? `+${data.priceChange.toFixed(2)}` : data.priceChange.toFixed(2);
      const percentText = `${data.priceChangePercent >= 0 ? '+' : ''}${data.priceChangePercent.toFixed(2)}%`;

      document.title = `${cryptoName} ${priceText} (${changeText} ${percentText})`;
    } else if (!isOpen && originalTitle) {
      // 恢复原始标题
      document.title = originalTitle;
    }
  }, [isOpen, data, symbol, originalTitle]);

  // 清理：组件卸载时恢复标题
  useEffect(() => {
    return () => {
      if (originalTitle) {
        document.title = originalTitle;
      }
    };
  }, [originalTitle]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      console.log('Fullscreen mode opened for:', symbol);

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
  }, [isOpen, onClose, symbol, fullscreenMode]);

  if (!data) return null;

  const isPositive = data.priceChange >= 0;

  // 计算24小时开盘价
  const openPrice = data.price - data.priceChange;

  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return price.toFixed(6);
  };

  const getCryptoName = (symbol: string): string => {
    const nameMap: { [key: string]: string } = {
      'BTCUSDT': 'Bitcoin', 'ETHUSDT': 'Ethereum', 'BNBUSDT': 'Binance Coin', 'XRPUSDT': 'Ripple',
      'SOLUSDT': 'Solana', 'ADAUSDT': 'Cardano', 'DOGEUSDT': 'Dogecoin', 'AVAXUSDT': 'Avalanche',
      'TRXUSDT': 'TRON', 'LINKUSDT': 'Chainlink', 'TONUSDT': 'Toncoin', 'MATICUSDT': 'Polygon',
      'WBTCUSDT': 'Wrapped Bitcoin', 'ICPUSDT': 'Internet Computer', 'SHIBUSDT': 'Shiba Inu',
      'NEARUSDT': 'NEAR Protocol', 'UNIUSDT': 'Uniswap', 'APTUSDT': 'Aptos', 'FETUSDT': 'Fetch.ai',
      'LDOUSDT': 'Lido DAO', 'PEPEUSDT': 'Pepe', 'HBARUSDT': 'Hedera', 'XLMUSDT': 'Stellar',
      'LTCUSDT': 'Litecoin', 'KASUSDT': 'Kaspa', 'ETCUSDT': 'Ethereum Classic', 'BCHUSDT': 'Bitcoin Cash',
      'ATOMUSDT': 'Cosmos', 'RNDRUSDT': 'Render', 'FILUSDT': 'Filecoin', 'CRVUSDT': 'Curve DAO',
      'AAVEUSDT': 'Aave', 'MKRUSDT': 'Maker', 'TIAUSDT': 'Celestia', 'INJUSDT': 'Injective',
      'OPUSDT': 'Optimism', 'WIFUSDT': 'dogwifhat', 'ARBUSDT': 'Arbitrum', 'GRTUSDT': 'The Graph',
      'FLOKIUSDT': 'FLOKI', 'ALGOUSDT': 'Algorand', 'VETUSDT': 'VeChain', 'MANAUSDT': 'Decentraland',
      'SANDUSDT': 'The Sandbox', 'AXSUSDT': 'Axie Infinity', 'THETAUSDT': 'Theta Network',
      'FLOWUSDT': 'Flow', 'EGGSUSDT': 'Eggs', 'CHZUSDT': 'Chiliz', 'APEUSDT': 'ApeCoin',

      // 51-60扩展
      'DOTUSDT': 'Polkadot', 'RUNEUSDT': 'THORChain', 'WLDUSDT': 'Worldcoin', 'ENJUSDT': 'Enjin Coin', 'XTZUSDT': 'Tezos',
      'QNTUSDT': 'Quant', 'KSMUSDT': 'Kusama', 'SUIUSDT': 'Sui', 'ROSUSDT': 'Oasis Network', 'JUPUSDT': 'Jupiter',

      // 61-70扩展
      'RAYUSDT': 'Raydium', 'ORDIUSDT': 'ORDI', 'MINAUSDT': 'Mina Protocol', 'ZILUSDT': 'Zilliqa', 'GODSUSDT': 'Gods Unchained',
      'KLAYUSDT': 'Klaytn', 'COMPUSDT': 'Compound', 'MOVRUSDT': 'Mover', 'FANTUSDT': 'Fantom', 'PENDLEUSDT': 'Pendle',

      // 71-80扩展
      'YFIUSDT': 'yearn.finance', 'PYTHUSDT': 'Pyth Network', 'IOTAUSDT': 'IOTA', 'ZECUSDT': 'Zcash', 'DASHUSDT': 'Dash',
      'SNTUSDT': 'Status', 'ARUSDT': 'Arweave', 'LRCUSDT': 'Loopring', 'CELERXUSDT': 'Celer Network', 'WAVEUSDT': 'Waves',

      // 81-90扩展
      'ARKMUSDT': 'Arkham', 'GMTUSDT': 'GMT', 'GALAUSDT': 'Gala', 'XMRUSDT': 'Monero', 'BNXUSDT': 'BinaryX',
      'EOSUSDT': 'EOS', 'XEMUSDT': 'NEM', 'NKNUSDT': 'NKN', 'BAKEUSDT': 'BakeryToken', 'SXPUSDT': 'Solar',

      // 91-100扩展
      'DENTUSDT': 'Dent', 'RSRUSDT': 'Reserve Rights', 'REEFUSDT': 'Reef', 'CKBUSDT': 'Nervos Network', 'ONEUSDT': 'Harmony',
      'CTSIUSDT': 'Cartesi', 'STORJUSDT': 'Storj', 'OCEANUSDT': 'Ocean Protocol', 'BTTCUSDT': 'BitTorrent', 'CELOUSDT': 'Celo'
    };
    return nameMap[symbol] || symbol.replace('USDT', '');
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fullscreen-price fullscreen-mode ${fullscreenBackground === 'pixel' ? 'pixel-theme' : ''} ${fullscreenBackground === 'hacker' ? 'hacker-theme' : ''}`}
          style={getBackgroundStyle(fullscreenBackground)}
        >
          {/* 数字雨效果 - 仅在黑客主题显示 */}
          {fullscreenBackground === 'hacker' && (
            <div className="matrix-rain-container">
              {matrixRain}
            </div>
          )}
          {/* 关闭按钮 */}
          <AnimatePresence>
            {showControls && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClose}
                className="absolute top-8 right-8 z-50 p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <X className="w-8 h-8 text-white" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* ESC 提示 */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-8 left-8 text-white/60 text-sm z-50"
              >
                {t('fullscreen.pressEsc')}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 主要内容 */}
          <div className="flex flex-col items-center justify-center h-full p-8">
            {/* 币种信息 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getCryptoColor(symbol)} flex items-center justify-center text-white font-bold text-2xl shadow-2xl`}>
                  {getCryptoIcon(symbol)}
                </div>
                <div className="text-left">
                  <h1 className="crypto-symbol text-white/90">{symbol.replace('USDT', '')}</h1>
                  <p className="text-white/60 text-2xl">{getCryptoName(symbol)}</p>
                </div>
              </div>
            </motion.div>

            {/* 主要价格显示 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="text-center mb-8"
            >
              <motion.div
                key={data.price}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 0.5 }}
                className="price-display text-white font-mono"
                style={{
                  textShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
                }}
              >
                ${formatPrice(data.price)}
              </motion.div>
              <div className="text-white/60 text-2xl mt-2">USDT</div>
            </motion.div>

            {/* 价格变化信息 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-8 mb-12"
            >
              <div className="flex items-center space-x-3 relative group">
                {isPositive ? (
                  <TrendingUp className="w-8 h-8 text-success-400" />
                ) : (
                  <TrendingDown className="w-8 h-8 text-danger-400" />
                )}
                <motion.span
                  key={data.priceChange}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3 }}
                  className={`text-4xl font-bold ${isPositive ? 'text-success-400' : 'text-danger-400'
                    }`}
                >
                  {isPositive ? '+' : ''}{data.priceChange.toFixed(2)}
                </motion.span>

                {/* 24小时开盘价提示 */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-black/80 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
                    {t('fullscreen.openPrice24h')}: ${formatPrice(openPrice)}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
                  </div>
                </div>
              </div>

              <motion.div
                key={data.priceChangePercent}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
                className={`relative group px-6 py-3 rounded-2xl text-2xl font-bold transition-all hover:scale-105 ${isPositive
                  ? 'bg-success-500/20 text-success-400 border border-success-500/30'
                  : 'bg-danger-500/20 text-danger-400 border border-danger-500/30'
                  }`}
              >
                {isPositive ? '+' : ''}{data.priceChangePercent.toFixed(2)}%

                {/* 24小时开盘价提示 */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-black/80 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
                    {t('fullscreen.openPrice24h')}: ${formatPrice(openPrice)}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* K线图表 */}
            {klineData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full max-w-4xl h-64 mb-8"
              >
                <div className="glass-effect rounded-2xl p-6 h-full">
                  <h3 className="text-white/80 text-xl mb-4 text-center">{t('chart.candlestick')} - {t('common.realTime', '实时')}</h3>
                  <MiniChart data={klineData} height={180} />
                </div>
              </motion.div>
            )}

            {/* 额外信息 */}
            {fullscreenInfoMode === 'rich' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full"
              >
                <div className="glass-effect rounded-xl p-6 text-center">
                  <div className="text-white/60 text-lg mb-2">{t('fullscreen.volume24h')}</div>
                  <div className="text-white text-2xl font-bold">
                    {data.volume >= 1e9 ? `${(data.volume / 1e9).toFixed(2)}B` :
                      data.volume >= 1e6 ? `${(data.volume / 1e6).toFixed(2)}M` :
                        `${(data.volume / 1e3).toFixed(2)}K`}
                  </div>
                </div>

                <div className="glass-effect rounded-xl p-6 text-center">
                  <div className="text-white/60 text-lg mb-2">{t('fullscreen.currentTime')}</div>
                  <div className="text-white text-2xl font-bold">
                    {currentTime.toLocaleTimeString('zh-CN')}
                  </div>
                </div>

                <div className="glass-effect rounded-xl p-6 text-center">
                  <div className="text-white/60 text-lg mb-2">{t('fullscreen.lastUpdate')}</div>
                  <div className="text-white text-2xl font-bold">
                    {data.lastUpdate.toLocaleTimeString('zh-CN')}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 