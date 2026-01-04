import { useState, useEffect } from 'react';

/**
 * 检测是否为移动设备
 */
export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // 初始检查
        checkMobile();

        // 监听窗口大小变化
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
}

/**
 * 检测是否支持触摸
 */
export function useTouchDevice() {
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        setIsTouch(
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0
        );
    }, []);

    return isTouch;
}

/**
 * 获取安全区域 insets（用于处理刘海屏等）
 */
export function useSafeArea() {
    const [safeArea, setSafeArea] = useState({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    });

    useEffect(() => {
        const updateSafeArea = () => {
            const style = getComputedStyle(document.documentElement);
            setSafeArea({
                top: parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0'),
                right: parseInt(style.getPropertyValue('env(safe-area-inset-right)') || '0'),
                bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
                left: parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0'),
            });
        };

        updateSafeArea();
        window.addEventListener('resize', updateSafeArea);
        return () => window.removeEventListener('resize', updateSafeArea);
    }, []);

    return safeArea;
}

/**
 * 获取响应式断点
 */
export function useBreakpoint() {
    const [breakpoint, setBreakpoint] = useState('sm');

    useEffect(() => {
        const updateBreakpoint = () => {
            const width = window.innerWidth;
            if (width < 640) setBreakpoint('sm');
            else if (width < 768) setBreakpoint('md');
            else if (width < 1024) setBreakpoint('lg');
            else if (width < 1280) setBreakpoint('xl');
            else setBreakpoint('2xl');
        };

        updateBreakpoint();
        window.addEventListener('resize', updateBreakpoint);
        return () => window.removeEventListener('resize', updateBreakpoint);
    }, []);

    return breakpoint;
}
