import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

// 冷却时间（秒）
const COOLDOWN_SECONDS = 30;

// 获取文章评论列表
export function useComments(postId) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!postId || !isSupabaseConfigured || !supabase) {
            setLoading(false);
            return;
        }

        fetchComments();

        // 实时订阅新评论
        const subscription = supabase
            .channel(`post_comments_${postId}`)
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'post_comments', filter: `post_id=eq.${postId}` },
                (payload) => {
                    setComments((current) => [payload.new, ...current]);
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [postId]);

    async function fetchComments() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('post_comments')
                .select('*')
                .eq('post_id', postId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setComments(data || []);
        } catch (err) {
            console.error('Error fetching comments:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return { comments, loading, error, refetch: fetchComments };
}

// 提交评论
export async function submitComment(postId, name, content) {
    if (!isSupabaseConfigured || !supabase) {
        return { error: 'Supabase 未配置' };
    }

    if (!name?.trim() || !content?.trim()) {
        return { error: '请填写昵称和评论内容' };
    }

    // 检查冷却时间
    const lastSubmitTime = localStorage.getItem('lastCommentSubmit');
    if (lastSubmitTime) {
        const timeSinceLastSubmit = Date.now() - parseInt(lastSubmitTime);
        const cooldownMs = COOLDOWN_SECONDS * 1000;

        if (timeSinceLastSubmit < cooldownMs) {
            const remainingSeconds = Math.ceil((cooldownMs - timeSinceLastSubmit) / 1000);
            return { error: `请等待 ${remainingSeconds} 秒后再提交评论`, cooldown: remainingSeconds };
        }
    }

    try {
        const { data, error } = await supabase
            .from('post_comments')
            .insert([
                {
                    post_id: postId,
                    name: name.trim(),
                    content: content.trim(),
                },
            ])
            .select();

        if (error) throw error;

        // 记录提交时间到 localStorage
        localStorage.setItem('lastCommentSubmit', Date.now().toString());

        return { data: data[0], success: true };
    } catch (err) {
        console.error('Error submitting comment:', err);
        return { error: '提交评论失败，请稍后重试' };
    }
}

// 获取冷却剩余时间
export function getCommentCooldownRemaining() {
    const lastSubmitTime = localStorage.getItem('lastCommentSubmit');
    if (!lastSubmitTime) return 0;

    const timeSinceLastSubmit = Date.now() - parseInt(lastSubmitTime);
    const cooldownMs = COOLDOWN_SECONDS * 1000;
    const remaining = Math.ceil((cooldownMs - timeSinceLastSubmit) / 1000);

    return remaining > 0 ? remaining : 0;
}

// 格式化时间
export function formatCommentDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } else if (days > 0) {
        return `${days}天前`;
    } else if (hours > 0) {
        return `${hours}小时前`;
    } else if (minutes > 0) {
        return `${minutes}分钟前`;
    } else {
        return '刚刚';
    }
}
