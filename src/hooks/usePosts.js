import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// 获取博客列表
export function usePosts(options = {}) {
    const { published = true, limit = 10, offset = 0 } = options;
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchPosts();
    }, [published, limit, offset]);

    async function fetchPosts() {
        try {
            setLoading(true);
            let query = supabase
                .from('posts')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false });

            if (published) {
                query = query.eq('published', true);
            }

            if (limit) {
                query = query.range(offset, offset + limit - 1);
            }

            const { data, error, count } = await query;

            if (error) throw error;

            setPosts(data || []);
            setTotal(count || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return { posts, loading, error, total, refetch: fetchPosts };
}

// 获取单篇文章
export function usePost(slug) {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!slug) return;
        fetchPost();
    }, [slug]);

    async function fetchPost() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) throw error;

            setPost(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return { post, loading, error, refetch: fetchPost };
}

// 点赞文章
export async function likePost(postId) {
    try {
        // 生成用户指纹（简单版本，使用本地存储）
        let fingerprint = localStorage.getItem('user_fingerprint');
        if (!fingerprint) {
            fingerprint = 'fp_' + Math.random().toString(36).substring(7);
            localStorage.setItem('user_fingerprint', fingerprint);
        }

        // 尝试点赞
        const { error } = await supabase
            .from('post_likes')
            .insert({
                post_id: postId,
                user_fingerprint: fingerprint
            });

        if (error) {
            // 如果已经点赞，则取消点赞
            if (error.code === '23505') {
                await supabase
                    .from('post_likes')
                    .delete()
                    .eq('post_id', postId)
                    .eq('user_fingerprint', fingerprint);

                return { liked: false };
            }
            throw error;
        }

        // 更新文章点赞数
        await supabase.rpc('increment', {
            row_id: postId,
            table_name: 'posts',
            column_name: 'likes'
        });

        return { liked: true };
    } catch (error) {
        console.error('Error liking post:', error);
        return { error };
    }
}

// 检查是否已点赞
export async function checkLiked(postId) {
    try {
        const fingerprint = localStorage.getItem('user_fingerprint');
        if (!fingerprint) return false;

        const { data, error } = await supabase
            .from('post_likes')
            .select('id')
            .eq('post_id', postId)
            .eq('user_fingerprint', fingerprint)
            .single();

        return !error && !!data;
    } catch {
        return false;
    }
}
