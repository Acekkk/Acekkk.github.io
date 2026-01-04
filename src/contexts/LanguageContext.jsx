import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    // 从 localStorage 读取语言设置，默认中文
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'zh';
    });

    // 切换语言
    const toggleLanguage = () => {
        setLanguage(prev => {
            const newLang = prev === 'zh' ? 'en' : 'zh';
            localStorage.setItem('language', newLang);
            return newLang;
        });
    };

    // 切换到指定语言
    const switchLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    // 更新HTML lang属性
    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, switchLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

// 自定义Hook
export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
}
