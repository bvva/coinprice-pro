export interface CryptoData {
  symbol: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  volume: number;
  marketCap?: number;
  lastUpdate: Date;
}

export interface KlineData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface WebSocketMessage {
  stream: string;
  data: any;
}

export interface BinanceTickerData {
  s: string; // symbol
  c: string; // current price
  P: string; // price change percent
  p: string; // price change
  v: string; // volume
}

export interface OKXTickerData {
  instId: string;
  last: string;
  lastSz: string;
  askPx: string;
  askSz: string;
  bidPx: string;
  bidSz: string;
  open24h: string;
  high24h: string;
  low24h: string;
  volCcy24h: string;
  vol24h: string;
  ts: string;
  sodUtc0: string;
  sodUtc8: string;
}

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    accent: string;
  };
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'zh' | 'en';
  exchange: 'binance' | 'okx';
  autoRefresh: boolean;
  refreshInterval: number;
  showVolume: boolean;
  showMarketCap: boolean;
  fullscreenMode: 'browser' | 'ui-only';
  fullscreenInfoMode: 'rich' | 'simple';
  fullscreenBackground: 'default' | 'gradient' | 'matrix' | 'wave' | 'particle' | 'neon' | 'cosmic' | 'pixel' | 'hacker';
}

export interface CryptoSymbol {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  displayName: string;
  icon?: string;
  color?: string;
}

export interface FullscreenData {
  symbol: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  volume: number;
  klineData: KlineData[];
}

// 快讯相关类型定义
export interface NewsItem {
  nnewflash_id: string;
  stitle: string;
  sabstract: string;
  surl: string;
  dcreate_time: string;
  is_hot: string;
  times: string;
}

export interface NewsResponse {
  success: string;
  time: string;
  msg: string;
  content: NewsItem[];
} 