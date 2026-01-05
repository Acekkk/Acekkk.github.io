import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

export default function Dashboard() {
    const { user, signOut } = useAuth();
    const [stats, setStats] = useState({ posts: 0, views: 0, visitors: 0 });
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            // 获取统计数据
            const { data: statsData } = await supabase.rpc('get_site_stats');
            if (statsData && statsData.length > 0) {
                setStats({
                    posts: statsData[0].total_posts || 0,
                    views: statsData[0].total_views || 0,
                    visitors: statsData[0].unique_visitors || 0
                });
            }

            // 获取文章列表
            const { data: postsData } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            setPosts(postsData || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm('确定要删除这篇文章吗？')) return;

        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) {
            alert('删除失败：' + error.message);
        } else {
            fetchData(); // 刷新列表
        }
    }

    async function togglePublish(post) {
        const { error } = await supabase
            .from('posts')
            .update({ published: !post.published })
            .eq('id', post.id);

        if (error) {
            alert('更新失败：' + error.message);
        } else {
            fetchData(); // 刷新列表
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-white">加载中...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                {/* 页头 */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-black text-gradient">📊 管理后台</h1>
                    <div className="flex gap-4">
                        <Link to="/" className="px-4 py-2 text-sm bg-slate-800 rounded-lg hover:bg-slate-700">
                            返回首页
                        </Link>
                        <button
                            onClick={signOut}
                            className="px-4 py-2 text-sm bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                        >
                            退出登录
                        </button>
                    </div>
                </div>

                {/* 统计卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="glass-effect p-6 rounded-xl">
                        <div className="text-slate-400 text-sm mb-2">📝 总文章数</div>
                        <div className="text-3xl font-bold">{stats.posts}</div>
                    </div>
                    <div className="glass-effect p-6 rounded-xl">
                        <div className="text-slate-400 text-sm mb-2">👁️ 总浏览量</div>
                        <div className="text-3xl font-bold">{stats.views}</div>
                    </div>
                    <div className="glass-effect p-6 rounded-xl">
                        <div className="text-slate-400 text-sm mb-2">👥 独立访客</div>
                        <div className="text-3xl font-bold">{stats.visitors}</div>
                    </div>
                </div>

                {/* 快捷入口 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Link
                        to="/admin/new-post"
                        className="glass-effect p-6 rounded-xl hover:border-teal-400/50 border border-white/10 transition-colors group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-slate-400 text-sm mb-2">📝 文章管理</div>
                                <div className="text-xl font-bold group-hover:text-teal-400 transition-colors">创建新文章</div>
                            </div>
                            <div className="text-3xl opacity-50 group-hover:opacity-100 transition-opacity">→</div>
                        </div>
                    </Link>

                    <Link
                        to="/admin/guestbook"
                        className="glass-effect p-6 rounded-xl hover:border-purple-400/50 border border-white/10 transition-colors group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-slate-400 text-sm mb-2">💬 留言管理</div>
                                <div className="text-xl font-bold group-hover:text-purple-400 transition-colors">管理留言板</div>
                            </div>
                            <div className="text-3xl opacity-50 group-hover:opacity-100 transition-opacity">→</div>
                        </div>
                    </Link>
                </div>

                {/* 文章列表 */}
                <div className="glass-effect rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">文章管理</h2>
                        <Link
                            to="/admin/new-post"
                            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-sky-500 rounded-lg font-medium"
                        >
                            + 新建文章
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold">{post.title}</h3>
                                        <span className={`px-2 py-1 text-xs rounded ${post.published
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {post.published ? '已发布' : '草稿'}
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-400 mt-1">
                                        👁️ {post.views || 0} | ❤️ {post.likes || 0}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => togglePublish(post)}
                                        className="px-3 py-1 text-sm bg-slate-700 rounded hover:bg-slate-600"
                                    >
                                        {post.published ? '取消发布' : '发布'}
                                    </button>
                                    <Link
                                        to={`/admin/edit-post/${post.id}`}
                                        className="px-3 py-1 text-sm bg-teal-500/20 text-teal-400 rounded hover:bg-teal-500/30"
                                    >
                                        编辑
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                                    >
                                        删除
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
