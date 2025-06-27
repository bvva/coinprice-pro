import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, Clock, ExternalLink, RefreshCw, X, Minimize2, Maximize2, GripVertical } from 'lucide-react';
import { NewsItem } from '../types';

interface DraggableNewsCardProps {
  language: 'zh' | 'en';
  isVisible?: boolean;
  onToggleVisibility?: () => void;
  news: NewsItem[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export const DraggableNewsCard: React.FC<DraggableNewsCardProps> = ({
  language,
  isVisible = true,
  onToggleVisibility,
  news,
  loading,
  error,
  onRefresh
}) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  // 拖动功能
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!cardRef.current || !dragRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setIsDragging(true);

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;

      // 限制在视窗范围内
      const maxX = window.innerWidth - card.offsetWidth;
      const maxY = window.innerHeight - card.offsetHeight;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // 格式化时间
  const formatTime = (timeStr: string) => {
    return timeStr || '';
  };

  // 打开新闻链接
  const openNewsLink = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // 处理新闻项点击
  const handleNewsClick = (newsItem: NewsItem) => {
    openNewsLink(newsItem.surl);
  };

  // 监听窗口大小变化，调整位置
  useEffect(() => {
    const handleResize = () => {
      if (!cardRef.current) return;

      const card = cardRef.current;
      const maxX = window.innerWidth - card.offsetWidth;
      const maxY = window.innerHeight - card.offsetHeight;

      setPosition(prev => ({
        x: Math.max(0, Math.min(prev.x, maxX)),
        y: Math.max(0, Math.min(prev.y, maxY))
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: isHovered ? 1 : 0.7,
        scale: 1
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed z-50 transition-opacity duration-300 ${isDragging ? 'cursor-grabbing' : 'cursor-default'}`}
      style={{
        left: position.x,
        top: position.y,
        width: isMinimized ? '280px' : '380px',
        maxHeight: isMinimized ? '60px' : '500px'
      }}
    >
      <div className="bg-black/90 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl overflow-hidden">
        {/* 标题栏 */}
        <div
          ref={dragRef}
          className={`flex items-center justify-between p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-b border-white/10 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center space-x-2">
            <GripVertical className="w-4 h-4 text-white/40" />
            <Newspaper className="w-4 h-4 text-blue-400" />
            <span className="text-white font-medium text-sm">
              {language === 'zh' ? '快讯' : 'News'}
            </span>
            {news.length > 0 && (
              <span className="text-white/60 text-xs">({news.length})</span>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRefresh();
              }}
              disabled={loading}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              title={language === 'zh' ? '刷新' : 'Refresh'}
            >
              <RefreshCw className={`w-3 h-3 text-white/60 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(!isMinimized);
              }}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              title={language === 'zh' ? (isMinimized ? '展开' : '最小化') : (isMinimized ? 'Expand' : 'Minimize')}
            >
              {isMinimized ? (
                <Maximize2 className="w-3 h-3 text-white/60" />
              ) : (
                <Minimize2 className="w-3 h-3 text-white/60" />
              )}
            </button>

            {onToggleVisibility && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility();
                }}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                title={language === 'zh' ? '关闭' : 'Close'}
              >
                <X className="w-3 h-3 text-white/60" />
              </button>
            )}
          </div>
        </div>

        {/* 内容区域 */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-3">
                {/* 错误提示 */}
                {error && (
                  <div className="mb-3 p-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded text-xs flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* 加载状态 */}
                {loading && news.length === 0 && (
                  <div className="flex items-center justify-center py-4">
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                      <span className="text-white/60 text-xs">
                        {language === 'zh' ? '加载中...' : 'Loading...'}
                      </span>
                    </div>
                  </div>
                )}

                {/* 快讯列表 */}
                <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                  {news.slice(0, 5).map((item, index) => (
                    <motion.div
                      key={item.nnewflash_id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative bg-white/5 hover:bg-white/10 rounded-lg p-2 cursor-pointer transition-all border border-transparent hover:border-white/10"
                      onClick={() => handleNewsClick(item)}
                    >
                      {/* 热门标签 */}
                      {item.is_hot === 'Y' && (
                        <div className="absolute top-1 right-1">
                          <span className="px-1 py-0.5 bg-red-500/30 text-red-300 text-xs rounded">
                            {language === 'zh' ? '热' : 'Hot'}
                          </span>
                        </div>
                      )}

                      {/* 标题 */}
                      <h4 className="font-medium text-white text-xs mb-1 pr-6 line-clamp-2 group-hover:text-blue-300 transition-colors">
                        {item.stitle}
                      </h4>

                      {/* 摘要 */}
                      <p className="text-white/60 text-xs mb-2 line-clamp-2">
                        {item.sabstract}
                      </p>

                      {/* 底部信息 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-xs text-white/40">
                          <Clock className="w-2 h-2" />
                          <span>{formatTime(item.times)}</span>
                        </div>

                        {item.surl && (
                          <ExternalLink className="w-3 h-3 text-white/30 group-hover:text-blue-300 transition-colors" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* 空状态 */}
                {!loading && news.length === 0 && !error && (
                  <div className="text-center py-4">
                    <Newspaper className="w-8 h-8 text-white/30 mx-auto mb-2" />
                    <p className="text-white/40 text-xs">
                      {language === 'zh' ? '暂无快讯' : 'No news available'}
                    </p>
                  </div>
                )}

                {/* 更多快讯提示 */}
                {news.length > 5 && (
                  <div className="mt-2 pt-2 border-t border-white/10 text-center">
                    <span className="text-white/40 text-xs">
                      {language === 'zh' ? `还有 ${news.length - 5} 条快讯...` : `${news.length - 5} more news...`}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}; 