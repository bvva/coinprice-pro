import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ExternalLink, Newspaper, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsPanelProps {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  language: 'zh' | 'en';
}

export function NewsPanel({ news, loading, error, onRefresh, language }: NewsPanelProps) {
  const formatTime = (timeStr: string) => {
    return timeStr || '';
  };

  const openNewsLink = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-xl p-6 border border-white/10"
    >
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Newspaper className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {language === 'zh' ? '快讯' : 'News'}
          </h3>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* 错误提示 */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg flex items-center space-x-2"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 加载状态 */}
      {loading && news.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span className="text-gray-600 dark:text-gray-300">
              {language === 'zh' ? '加载快讯中...' : 'Loading news...'}
            </span>
          </div>
        </div>
      )}

      {/* 快讯列表 */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {news.map((item, index) => (
            <motion.div
              key={item.nnewflash_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-white/5 hover:bg-white/10 dark:bg-black/10 dark:hover:bg-black/20 rounded-lg p-4 transition-all cursor-pointer border border-transparent hover:border-white/20"
              onClick={() => openNewsLink(item.surl)}
            >
              {/* 热门标签 */}
              {item.is_hot === 'Y' && (
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                    {language === 'zh' ? '热门' : 'Hot'}
                  </span>
                </div>
              )}

              {/* 标题 */}
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 pr-8 line-clamp-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                {item.stitle}
              </h4>

              {/* 摘要 */}
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {item.sabstract}
              </p>

              {/* 底部信息 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(item.times)}</span>
                </div>

                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 空状态 */}
      {!loading && news.length === 0 && !error && (
        <div className="text-center py-8">
          <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            {language === 'zh' ? '暂无快讯' : 'No news available'}
          </p>
        </div>
      )}
    </motion.div>
  );
} 