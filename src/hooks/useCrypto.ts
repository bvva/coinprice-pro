import { useState, useEffect, useCallback } from 'react';
import { CryptoData, KlineData } from '../types';
import { wsService, okxWsService } from '../services/websocket';

interface UseCryptoOptions {
  exchange?: 'binance' | 'okx';
  autoConnect?: boolean;
}

export const useCrypto = (options: UseCryptoOptions = {}) => {
  const { exchange = 'binance', autoConnect = true } = options;
  const [cryptoData, setCryptoData] = useState<Map<string, CryptoData>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const service = exchange === 'binance' ? wsService : okxWsService;

  const connect = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await service.connect();
      setIsConnected(true);
      setError(null); // 清除之前的错误
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  }, [service]);

  const disconnect = useCallback(() => {
    service.disconnect();
    setIsConnected(false);
    setCryptoData(new Map());
  }, [service]);

  const subscribe = useCallback((symbol: string) => {
    const handleData = (data: CryptoData) => {
      setCryptoData(prev => new Map(prev.set(symbol, data)));
    };

    service.subscribeTicker(symbol, handleData);

    return () => {
      service.unsubscribeTicker(symbol, handleData);
    };
  }, [service]);

  const getCryptoData = useCallback((symbol: string): CryptoData | undefined => {
    return cryptoData.get(symbol);
  }, [cryptoData]);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    cryptoData: Array.from(cryptoData.values()),
    isConnected,
    error,
    loading,
    connect,
    disconnect,
    subscribe,
    getCryptoData
  };
};

export const useKlineData = (symbol: string, interval: string = '1m', exchange: 'binance' | 'okx' = 'binance') => {
  const [klineData, setKlineData] = useState<KlineData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const service = exchange === 'binance' ? wsService : okxWsService;

  useEffect(() => {
    setLoading(true);
    setError(null);

    const handleKlineData = (data: KlineData[]) => {
      setKlineData(prev => {
        // 简化处理：保留最近100个数据点
        const combined = [...prev, ...data];
        return combined.slice(-100).sort((a, b) => a.timestamp - b.timestamp);
      });
      setLoading(false);
    };

    try {
      service.subscribeKline(symbol, interval, handleKlineData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe to kline data');
      setLoading(false);
    }

    return () => {
      service.unsubscribeKline(symbol, interval, handleKlineData);
    };
  }, [symbol, interval, service]);

  return { klineData, loading, error };
};

export const useFullscreenCrypto = (symbol: string, exchange: 'binance' | 'okx' = 'binance') => {
  const [data, setData] = useState<CryptoData | null>(null);
  const [klineData, setKlineData] = useState<KlineData[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const service = exchange === 'binance' ? wsService : okxWsService;

  const enterFullscreen = useCallback(async () => {
    console.log('Entering fullscreen mode...');
    setIsFullscreen(true);

    // 尝试多种全屏API的兼容性处理
    try {
      const docEl = document.documentElement as any;
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        await docEl.webkitRequestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        await docEl.mozRequestFullScreen();
      } else if (docEl.msRequestFullscreen) {
        await docEl.msRequestFullscreen();
      }
    } catch (error) {
      console.warn('Fullscreen API not supported, using fallback UI');
      // 即使全屏API失败，我们仍然显示全屏UI
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    console.log('Exiting fullscreen mode...');
    setIsFullscreen(false);

    try {
      const doc = document as any;
      if (doc.exitFullscreen) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        await doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen();
      }
    } catch (error) {
      console.warn('Exit fullscreen failed:', error);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement = document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement;

      // 只有当浏览器全屏状态和我们的状态不一致时才更新
      if (!fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        exitFullscreen();
      }
    };

    // 监听各种浏览器的全屏事件
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, exitFullscreen]);

  useEffect(() => {
    if (!symbol) return;

    const handleTickerData = (tickerData: CryptoData) => {
      setData(tickerData);
    };

    const handleKlineData = (klineDataArray: KlineData[]) => {
      setKlineData(prev => {
        const combined = [...prev, ...klineDataArray];
        return combined.slice(-50).sort((a, b) => a.timestamp - b.timestamp);
      });
    };

    service.subscribeTicker(symbol, handleTickerData);
    service.subscribeKline(symbol, '1m', handleKlineData);

    return () => {
      service.unsubscribeTicker(symbol, handleTickerData);
      service.unsubscribeKline(symbol, '1m', handleKlineData);
    };
  }, [symbol, service]);

  return {
    data,
    klineData,
    isFullscreen,
    enterFullscreen,
    exitFullscreen
  };
}; 