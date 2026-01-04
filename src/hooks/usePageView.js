import { useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function usePageView(pageUrl, pageTitle) {
    useEffect(() => {
        if (!pageUrl) return;

        async function recordPageView() {
            try {
                // 获取用户信息
                const userAgent = navigator.userAgent;
                const referrer = document.referrer;

                // 检测设备类型
                const deviceType = /Mobile|Android|iPhone/i.test(userAgent)
                    ? 'mobile'
                    : /Tablet|iPad/i.test(userAgent)
                        ? 'tablet'
                        : 'desktop';

                // 插入访问记录
                const { error } = await supabase
                    .from('page_views')
                    .insert({
                        page_url: pageUrl,
                        page_title: pageTitle || document.title,
                        referrer: referrer || null,
                        user_agent: userAgent,
                        device_type: deviceType,
                    });

                if (error && error.code !== '23505') { // 忽略重复插入错误
                    console.error('Error recording page view:', error);
                }
            } catch (error) {
                console.error('Failed to record page view:', error);
            }
        }

        // 延迟记录，避免影响页面加载
        const timer = setTimeout(recordPageView, 1000);

        return () => clearTimeout(timer);
    }, [pageUrl, pageTitle]);
}

// 增加文章浏览量
export async function incrementPostViews(postId) {
    try {
        const { error } = await supabase.rpc('increment_post_views', {
            post_id: postId
        });

        if (error) {
            console.error('Error incrementing views:', error);
        }
    } catch (error) {
        console.error('Failed to increment views:', error);
    }
}
