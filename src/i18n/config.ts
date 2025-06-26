import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // 导航
      nav: {
        dashboard: 'Dashboard',
        markets: 'Markets',
        favorites: 'Favorites',
        settings: 'Settings'
      },
      // 通用
      common: {
        price: 'Price',
        change: 'Change',
        volume: 'Volume',
        marketCap: 'Market Cap',
        loading: 'Loading...',
        error: 'Error',
        retry: 'Retry',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        refresh: 'Refresh',
        connected: 'Connected',
        connecting: 'Connecting...',
        disconnected: 'Disconnected',
        cryptocurrencies: 'Cryptocurrencies',
        realTime: 'Real-time'
      },
      // 加密货币
      crypto: {
        bitcoin: 'Bitcoin',
        ethereum: 'Ethereum',
        binanceCoin: 'Binance Coin',
        cardano: 'Cardano',
        solana: 'Solana',
        dogecoin: 'Dogecoin',
        polygon: 'Polygon',
        avalanche: 'Avalanche'
      },
      // 全屏模式
      fullscreen: {
        enterFullscreen: 'Enter Fullscreen',
        exitFullscreen: 'Exit Fullscreen',
        pressEsc: 'Press ESC to exit',
        currentPrice: 'Current Price',
        priceChange: 'Price Change',
        volume24h: '24H Volume',
        openPrice24h: '24H Open Price',
        lastUpdate: 'Last Update',
        currentTime: 'Current Time',
        background: {
          default: 'Default (Pure Black)',
          gradient: 'Gradient',
          matrix: 'Matrix',
          wave: 'Wave',
          particle: 'Particle',
          neon: 'Neon',
          cosmic: 'Cosmic',
          pixel: 'Pixel',
          hacker: 'Hacker'
        },
        mode: {
          browser: 'Browser Fullscreen',
          uiOnly: 'UI Only'
        },
        info: {
          rich: 'Rich Mode',
          simple: 'Simple Mode'
        }
      },
      // 图表
      chart: {
        candlestick: 'Candlestick',
        line: 'Line',
        area: 'Area',
        timeframe: 'Timeframe',
        '1m': '1 Minute',
        '5m': '5 Minutes',
        '15m': '15 Minutes',
        '1h': '1 Hour',
        '4h': '4 Hours',
        '1d': '1 Day'
      },
      // 设置
      settings: {
        appearance: 'Appearance',
        theme: 'Theme',
        language: 'Language',
        exchange: 'Exchange',
        autoRefresh: 'Auto Refresh',
        refreshInterval: 'Refresh Interval',
        notifications: 'Notifications',
        light: 'Light',
        dark: 'Dark',
        auto: 'Auto'
      },
      // 收藏功能
      favorites: {
        addToFavorites: 'Add to Favorites',
        removeFromFavorites: 'Remove from Favorites',
        noFavorites: 'No favorite cryptocurrencies yet',
        noFavoritesDesc: 'Click the heart icon on any cryptocurrency card to add favorites',
        all: 'All',
        favorites: 'Favorites'
      },
      // 错误信息
      errors: {
        connectionFailed: 'Connection failed',
        dataLoadFailed: 'Failed to load data',
        websocketError: 'WebSocket connection error',
        networkError: 'Network error',
        unknownError: 'Unknown error occurred'
      }
    }
  },
  zh: {
    translation: {
      // 导航
      nav: {
        dashboard: '仪表板',
        markets: '市场',
        favorites: '收藏',
        settings: '设置'
      },
      // 通用
      common: {
        price: '价格',
        change: '变化',
        volume: '成交量',
        marketCap: '市值',
        loading: '加载中...',
        error: '错误',
        retry: '重试',
        search: '搜索',
        filter: '筛选',
        sort: '排序',
        refresh: '刷新',
        connected: '已连接',
        connecting: '连接中...',
        disconnected: '已断开',
        cryptocurrencies: '加密货币',
        realTime: '实时'
      },
      // 加密货币
      crypto: {
        bitcoin: '比特币',
        ethereum: '以太坊',
        binanceCoin: '币安币',
        cardano: '艾达币',
        solana: '索拉纳',
        dogecoin: '狗狗币',
        polygon: '马蹄币',
        avalanche: '雪崩币'
      },
      // 全屏模式
      fullscreen: {
        enterFullscreen: '进入全屏',
        exitFullscreen: '退出全屏',
        pressEsc: '按 ESC 键退出',
        currentPrice: '当前价格',
        priceChange: '价格变化',
        volume24h: '24小时成交量',
        openPrice24h: '24小时开盘价',
        lastUpdate: '最后更新',
        currentTime: '当前时间',
        background: {
          default: '默认(纯黑)',
          gradient: '渐变',
          matrix: '矩阵',
          wave: '波浪',
          particle: '粒子',
          neon: '霓虹',
          cosmic: '宇宙',
          pixel: '像素',
          hacker: '黑客'
        },
        mode: {
          browser: '浏览器全屏',
          uiOnly: '界面全屏'
        },
        info: {
          rich: '丰富模式',
          simple: '简洁模式'
        }
      },
      // 图表
      chart: {
        candlestick: 'K线图',
        line: '线图',
        area: '面积图',
        timeframe: '时间周期',
        '1m': '1分钟',
        '5m': '5分钟',
        '15m': '15分钟',
        '1h': '1小时',
        '4h': '4小时',
        '1d': '1天'
      },
      // 设置
      settings: {
        appearance: '外观',
        theme: '主题',
        language: '语言',
        exchange: '交易所',
        autoRefresh: '自动刷新',
        refreshInterval: '刷新间隔',
        notifications: '通知',
        light: '浅色',
        dark: '深色',
        auto: '自动'
      },
      // 收藏功能
      favorites: {
        addToFavorites: '添加收藏',
        removeFromFavorites: '取消收藏',
        noFavorites: '还没有收藏的加密货币',
        noFavoritesDesc: '点击加密货币卡片上的心形图标来添加收藏',
        all: '全部',
        favorites: '自选'
      },
      // 错误信息
      errors: {
        connectionFailed: '连接失败',
        dataLoadFailed: '数据加载失败',
        websocketError: 'WebSocket 连接错误',
        networkError: '网络错误',
        unknownError: '发生未知错误'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    }
  });

export default i18n; 