import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

export function useTotalViews() {
    const [totalViews, setTotalViews] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isSupabaseConfigured || !supabase) {
            setLoading(false);
            return;
        }

        fetchTotalViews();

        // 每30秒刷新一次
        const interval = setInterval(fetchTotalViews, 30000);

        return () => clearInterval(interval);
    }, []);

    async function fetchTotalViews() {
        try {
            setLoading(true);
            const { count, error } = await supabase
                .from('page_views')
                .select('*', { count: 'exact', head: true });

            if (error) throw error;

            setTotalViews(count || 0);
        } catch (err) {
            console.error('Error fetching total views:', err);
        } finally {
            setLoading(false);
        }
    }

    return { totalViews, loading };
}
