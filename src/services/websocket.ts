import { CryptoData, BinanceTickerData, KlineData } from '../types';

export type ExchangeType = 'binance' | 'okx';

export class CryptoWebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private exchange: ExchangeType = 'binance';
  private subscribers = new Map<string, Set<(data: CryptoData) => void>>();
  private klineSubscribers = new Map<string, Set<(data: KlineData[]) => void>>();

  constructor(exchange: ExchangeType = 'binance') {
    this.exchange = exchange;
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = this.getWebSocketUrl();
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log(`${this.exchange} WebSocket connected`);
          this.reconnectAttempts = 0;

          // 延迟一点时间再重新订阅，确保连接稳定
          setTimeout(() => {
            this.resubscribeAll();
          }, 100);

          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = () => {
          console.log(`${this.exchange} WebSocket disconnected`);
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error(`${this.exchange} WebSocket error:`, error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscribers.clear();
    this.klineSubscribers.clear();
  }

  public subscribeTicker(symbol: string, callback: (data: CryptoData) => void): void {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
    }
    this.subscribers.get(symbol)!.add(callback);

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.sendSubscription(symbol, 'ticker');
    }
  }

  public unsubscribeTicker(symbol: string, callback: (data: CryptoData) => void): void {
    const symbolSubscribers = this.subscribers.get(symbol);
    if (symbolSubscribers) {
      symbolSubscribers.delete(callback);
      if (symbolSubscribers.size === 0) {
        this.subscribers.delete(symbol);
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.sendUnsubscription(symbol, 'ticker');
        }
      }
    }
  }

  public subscribeKline(symbol: string, interval: string, callback: (data: KlineData[]) => void): void {
    const key = `${symbol}_${interval}`;
    if (!this.klineSubscribers.has(key)) {
      this.klineSubscribers.set(key, new Set());
    }
    this.klineSubscribers.get(key)!.add(callback);

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.sendSubscription(symbol, 'kline', interval);
    }
  }

  public unsubscribeKline(symbol: string, interval: string, callback: (data: KlineData[]) => void): void {
    const key = `${symbol}_${interval}`;
    const keySubscribers = this.klineSubscribers.get(key);
    if (keySubscribers) {
      keySubscribers.delete(callback);
      if (keySubscribers.size === 0) {
        this.klineSubscribers.delete(key);
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.sendUnsubscription(symbol, 'kline', interval);
        }
      }
    }
  }

  private getWebSocketUrl(): string {
    switch (this.exchange) {
      case 'binance':
        return 'wss://stream.binance.com:9443/ws/!ticker@arr';
      case 'okx':
        return 'wss://ws.okx.com:8443/ws/v5/public';
      default:
        throw new Error(`Unsupported exchange: ${this.exchange}`);
    }
  }

  private sendSubscription(symbol: string, type: 'ticker' | 'kline', interval?: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    let message: any;

    switch (this.exchange) {
      case 'binance':
        if (type === 'ticker') {
          message = {
            method: 'SUBSCRIBE',
            params: [`${symbol.toLowerCase()}@ticker`],
            id: Date.now()
          };
        } else if (type === 'kline' && interval) {
          message = {
            method: 'SUBSCRIBE',
            params: [`${symbol.toLowerCase()}@kline_${interval}`],
            id: Date.now()
          };
        }
        break;
      case 'okx':
        if (type === 'ticker') {
          message = {
            op: 'subscribe',
            args: [{
              channel: 'tickers',
              instId: this.convertSymbolForOKX(symbol)
            }]
          };
        } else if (type === 'kline' && interval) {
          message = {
            op: 'subscribe',
            args: [{
              channel: 'candle' + this.convertInterval(interval),
              instId: this.convertSymbolForOKX(symbol)
            }]
          };
        }
        break;
    }

    if (message) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private sendUnsubscription(symbol: string, type: 'ticker' | 'kline', interval?: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    let message: any;

    switch (this.exchange) {
      case 'binance':
        if (type === 'ticker') {
          message = {
            method: 'UNSUBSCRIBE',
            params: [`${symbol.toLowerCase()}@ticker`],
            id: Date.now()
          };
        } else if (type === 'kline' && interval) {
          message = {
            method: 'UNSUBSCRIBE',
            params: [`${symbol.toLowerCase()}@kline_${interval}`],
            id: Date.now()
          };
        }
        break;
      case 'okx':
        if (type === 'ticker') {
          message = {
            op: 'unsubscribe',
            args: [{
              channel: 'tickers',
              instId: this.convertSymbolForOKX(symbol)
            }]
          };
        } else if (type === 'kline' && interval) {
          message = {
            op: 'unsubscribe',
            args: [{
              channel: 'candle' + this.convertInterval(interval),
              instId: this.convertSymbolForOKX(symbol)
            }]
          };
        }
        break;
    }

    if (message) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private handleMessage(data: any): void {
    switch (this.exchange) {
      case 'binance':
        this.handleBinanceMessage(data);
        break;
      case 'okx':
        this.handleOKXMessage(data);
        break;
    }
  }

  private handleBinanceMessage(data: any): void {
    if (Array.isArray(data)) {
      // 处理 ticker 数组数据
      data.forEach((ticker: BinanceTickerData) => {
        const cryptoData: CryptoData = {
          symbol: ticker.s,
          price: parseFloat(ticker.c),
          priceChange: parseFloat(ticker.p),
          priceChangePercent: parseFloat(ticker.P),
          volume: parseFloat(ticker.v),
          lastUpdate: new Date()
        };

        const subscribers = this.subscribers.get(ticker.s);
        if (subscribers) {
          subscribers.forEach(callback => callback(cryptoData));
        }
      });
    } else if (data.stream && data.data) {
      // 处理单个数据流
      const streamType = data.stream.split('@')[1];
      if (streamType === 'ticker') {
        const ticker: BinanceTickerData = data.data;
        const cryptoData: CryptoData = {
          symbol: ticker.s,
          price: parseFloat(ticker.c),
          priceChange: parseFloat(ticker.p),
          priceChangePercent: parseFloat(ticker.P),
          volume: parseFloat(ticker.v),
          lastUpdate: new Date()
        };

        const subscribers = this.subscribers.get(ticker.s);
        if (subscribers) {
          subscribers.forEach(callback => callback(cryptoData));
        }
      } else if (streamType.startsWith('kline')) {
        // 处理 K线数据
        const klineData: KlineData = {
          timestamp: data.data.k.t,
          open: parseFloat(data.data.k.o),
          high: parseFloat(data.data.k.h),
          low: parseFloat(data.data.k.l),
          close: parseFloat(data.data.k.c),
          volume: parseFloat(data.data.k.v)
        };

        // 这里简化处理，实际应该累积 K线数据
        const interval = streamType.split('_')[1];
        const key = `${data.data.k.s}_${interval}`;
        const subscribers = this.klineSubscribers.get(key);
        if (subscribers) {
          subscribers.forEach(callback => callback([klineData]));
        }
      }
    }
  }

  private handleOKXMessage(data: any): void {
    console.log('OKX message received:', data);

    if (data.data && Array.isArray(data.data)) {
      data.data.forEach((item: any) => {
        if (data.arg?.channel === 'tickers') {
          // 将OKX的符号格式转换回我们的格式
          const normalizedSymbol = this.convertOKXSymbolBack(item.instId);

          const cryptoData: CryptoData = {
            symbol: normalizedSymbol,
            price: parseFloat(item.last),
            priceChange: parseFloat(item.last) - parseFloat(item.open24h),
            priceChangePercent: ((parseFloat(item.last) - parseFloat(item.open24h)) / parseFloat(item.open24h)) * 100,
            volume: parseFloat(item.vol24h),
            lastUpdate: new Date(parseInt(item.ts))
          };

          // 使用原始符号查找订阅者
          const subscribers = this.subscribers.get(normalizedSymbol);
          if (subscribers) {
            subscribers.forEach(callback => callback(cryptoData));
          }
        } else if (data.arg?.channel?.startsWith('candle')) {
          // 处理K线数据 - OKX格式: [timestamp, open, high, low, close, volume, volCcy]
          const normalizedSymbol = this.convertOKXSymbolBack(data.arg.instId);
          const klineData: KlineData = {
            timestamp: parseInt(item[0]),
            open: parseFloat(item[1]),
            high: parseFloat(item[2]),
            low: parseFloat(item[3]),
            close: parseFloat(item[4]),
            volume: parseFloat(item[5])
          };

          // 从channel中提取时间间隔
          const channel = data.arg.channel;
          const interval = channel.replace('candle', '').toLowerCase();
          const key = `${normalizedSymbol}_${interval}`;
          const subscribers = this.klineSubscribers.get(key);
          if (subscribers) {
            subscribers.forEach(callback => callback([klineData]));
          }
        }
      });
    }
  }

  private convertOKXSymbolBack(okxSymbol: string): string {
    // 将OKX的符号格式 (如 BTC-USDT) 转换回我们的格式 (BTCUSDT)
    return okxSymbol.replace('-', '');
  }

  private resubscribeAll(): void {
    // 重新订阅所有ticker
    this.subscribers.forEach((_callbacks, symbol) => {
      this.sendSubscription(symbol, 'ticker');
    });

    // 重新订阅所有K线
    this.klineSubscribers.forEach((_callbacks, key) => {
      const [symbol, interval] = key.split('_');
      this.sendSubscription(symbol, 'kline', interval);
    });
  }

  private convertInterval(interval: string): string {
    // 将通用的时间间隔转换为 OKX 格式
    const intervalMap: { [key: string]: string } = {
      '1m': '1m',
      '5m': '5m',
      '15m': '15m',
      '1h': '1H',
      '4h': '4H',
      '1d': '1D'
    };
    return intervalMap[interval] || '1m';
  }

  private convertSymbolForOKX(symbol: string): string {
    // OKX使用不同的符号格式，如 BTC-USDT 而不是 BTCUSDT
    if (symbol.endsWith('USDT')) {
      const base = symbol.replace('USDT', '');
      return `${base}-USDT`;
    }
    return symbol;
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

      setTimeout(() => {
        this.connect().catch(error => {
          console.error('Reconnection failed:', error);
        });
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }
}

// 单例模式
export const wsService = new CryptoWebSocketService();
export const okxWsService = new CryptoWebSocketService('okx'); 