import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Settings, Globe, TrendingUp } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onThemeToggle: () => void;
  language: 'zh' | 'en';
  onLanguageChange: (lang: 'zh' | 'en') => void;
  exchange: 'binance' | 'okx';
  onExchangeChange: (exchange: 'binance' | 'okx') => void;
  fullscreenMode: 'browser' | 'ui-only';
  onFullscreenModeChange: (mode: 'browser' | 'ui-only') => void;
  fullscreenInfoMode: 'rich' | 'simple';
  onFullscreenInfoModeChange: (mode: 'rich' | 'simple') => void;
  fullscreenBackground: 'default' | 'gradient' | 'matrix' | 'wave' | 'particle' | 'neon' | 'cosmic' | 'pixel' | 'hacker';
  onFullscreenBackgroundChange: (bg: 'default' | 'gradient' | 'matrix' | 'wave' | 'particle' | 'neon' | 'cosmic' | 'pixel' | 'hacker') => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onThemeToggle,
  language,
  onLanguageChange,
  exchange,
  onExchangeChange,
  fullscreenMode,
  onFullscreenModeChange,
  fullscreenInfoMode,
  onFullscreenInfoModeChange,
  fullscreenBackground,
  onFullscreenBackgroundChange
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="sticky top-0 z-40 glass-effect border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">CoinPrice Pro</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'zh' ? '专业加密货币行情' : 'Professional Crypto Market'}
              </p>
            </div>
          </motion.div>

          {/* 控制按钮 */}
          <div className="flex items-center space-x-2">
            {/* 交易所选择 */}
            <div className="relative">
              <select
                value={exchange}
                onChange={(e) => onExchangeChange(e.target.value as 'binance' | 'okx')}
                className="appearance-none bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm"
              >
                <option value="binance">Binance</option>
                <option value="okx">OKX</option>
              </select>
            </div>

            {/* 语言切换 */}
            <motion.button
              onClick={() => onLanguageChange(language === 'zh' ? 'en' : 'zh')}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe className="w-5 h-5" />
            </motion.button>

            {/* 主题切换 */}
            <motion.button
              onClick={onThemeToggle}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {/* 设置按钮 */}
            <motion.button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* 设置面板 */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 mx-4 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">
                  {language === 'zh' ? '主题设置' : 'Theme Settings'}
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="theme"
                      checked={!isDark}
                      onChange={() => !isDark || onThemeToggle()}
                      className="text-primary-500"
                    />
                    <span className="text-sm">{language === 'zh' ? '浅色' : 'Light'}</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="theme"
                      checked={isDark}
                      onChange={() => isDark || onThemeToggle()}
                      className="text-primary-500"
                    />
                    <span className="text-sm">{language === 'zh' ? '深色' : 'Dark'}</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">
                  {language === 'zh' ? '语言设置' : 'Language Settings'}
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="language"
                      checked={language === 'zh'}
                      onChange={() => onLanguageChange('zh')}
                      className="text-primary-500"
                    />
                    <span className="text-sm">中文</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="language"
                      checked={language === 'en'}
                      onChange={() => onLanguageChange('en')}
                      className="text-primary-500"
                    />
                    <span className="text-sm">English</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">
                  {language === 'zh' ? '交易所设置' : 'Exchange Settings'}
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="exchange"
                      checked={exchange === 'binance'}
                      onChange={() => onExchangeChange('binance')}
                      className="text-primary-500"
                    />
                    <span className="text-sm">Binance</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="exchange"
                      checked={exchange === 'okx'}
                      onChange={() => onExchangeChange('okx')}
                      className="text-primary-500"
                    />
                    <span className="text-sm">OKX</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">
                  {language === 'zh' ? '全屏方式' : 'Fullscreen Mode'}
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="fullscreenMode"
                      checked={fullscreenMode === 'browser'}
                      onChange={() => onFullscreenModeChange('browser')}
                      className="text-primary-500"
                    />
                    <span className="text-sm">{language === 'zh' ? '浏览器全屏' : 'Browser Fullscreen'}</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="fullscreenMode"
                      checked={fullscreenMode === 'ui-only'}
                      onChange={() => onFullscreenModeChange('ui-only')}
                      className="text-primary-500"
                    />
                    <span className="text-sm">{language === 'zh' ? '界面全屏' : 'UI Only'}</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">
                  {language === 'zh' ? '全屏信息' : 'Fullscreen Info'}
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="fullscreenInfoMode"
                      checked={fullscreenInfoMode === 'rich'}
                      onChange={() => onFullscreenInfoModeChange('rich')}
                      className="text-primary-500"
                    />
                    <span className="text-sm">{language === 'zh' ? '丰富模式' : 'Rich Mode'}</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="fullscreenInfoMode"
                      checked={fullscreenInfoMode === 'simple'}
                      onChange={() => onFullscreenInfoModeChange('simple')}
                      className="text-primary-500"
                    />
                    <span className="text-sm">{language === 'zh' ? '简洁模式' : 'Simple Mode'}</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">
                  {language === 'zh' ? '全屏背景' : 'Fullscreen Background'}
                </h3>
                <div className="space-y-1">
                  {[
                    { value: 'default', label: language === 'zh' ? '默认(纯黑)' : 'Default(Pure Black)' },
                    { value: 'gradient', label: language === 'zh' ? '渐变' : 'Gradient' },
                    { value: 'matrix', label: language === 'zh' ? '矩阵' : 'Matrix' },
                    { value: 'wave', label: language === 'zh' ? '波浪' : 'Wave' },
                    { value: 'particle', label: language === 'zh' ? '粒子' : 'Particle' },
                    { value: 'neon', label: language === 'zh' ? '霓虹' : 'Neon' },
                    { value: 'cosmic', label: language === 'zh' ? '宇宙' : 'Cosmic' },
                    { value: 'pixel', label: language === 'zh' ? '像素' : 'Pixel' },
                    { value: 'hacker', label: language === 'zh' ? '黑客' : 'Hacker' },
                  ].map((bg) => (
                    <label key={bg.value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="fullscreenBackground"
                        checked={fullscreenBackground === bg.value}
                        onChange={() => onFullscreenBackgroundChange(bg.value as any)}
                        className="text-primary-500"
                      />
                      <span className="text-sm">{bg.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}; 