import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export function LanguageSwitcher() {
    const { language, toggleLanguage } = useLanguage();

    return (
        <motion.button
            onClick={toggleLanguage}
            className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-white/20 hover:border-teal-400/50 transition-all group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <motion.div
                className="flex items-center gap-2"
                initial={false}
                animate={{ opacity: 1 }}
            >
                {/* 语言图标 */}
                <svg
                    className="w-5 h-5 text-teal-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                </svg>

                {/* 当前语言显示 */}
                <span className="text-sm font-medium text-white">
                    {language === 'zh' ? '中文' : 'EN'}
                </span>

                {/* 切换箭头 */}
                <motion.svg
                    className="w-4 h-4 text-teal-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: language === 'zh' ? 0 : 180 }}
                    transition={{ duration: 0.3 }}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                </motion.svg>
            </motion.div>

            {/* 悬停提示 */}
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900 rounded-lg text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {language === 'zh' ? 'Switch to English' : '切换到中文'}
            </span>
        </motion.button>
    );
}
