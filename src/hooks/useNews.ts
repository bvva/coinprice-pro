import { useState, useEffect, useCallback } from 'react';
import { NewsItem } from '../types';
import { newsService } from '../services/newsService';

interface UseNewsReturn {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
  refreshNews: () => void;
}

export function useNews(refreshInterval: number = 30000): UseNewsReturn {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    try {
      setError(null);
      const newsData = await newsService.fetchNews(1, 20);
      setNews(newsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取快讯失败');
      console.error('快讯获取错误:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshNews = useCallback(() => {
    setLoading(true);
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        fetchNews();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [fetchNews, refreshInterval]);

  return {
    news,
    loading,
    error,
    refreshNews
  };
} 