import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

export default function GuestbookAdmin() {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    async function fetchMessages() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('guestbook')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
            alert('加载留言失败：' + error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm('确定要删除这条留言吗？')) return;

        try {
            const { error } = await supabase
                .from('guestbook')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // 从列表中移除
            setMessages(messages.filter(msg => msg.id !== id));
            alert('留言删除成功！');
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('删除失败：' + error.message);
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                    <h1 className="text-3xl font-black text-gradient">💬 留言管理</h1>
                    <div className="flex gap-4">
                        <Link to="/admin" className="px-4 py-2 text-sm bg-slate-800 rounded-lg hover:bg-slate-700">
                            返回后台
                        </Link>
                        <Link to="/guestbook" className="px-4 py-2 text-sm bg-teal-500/20 text-teal-400 rounded-lg hover:bg-teal-500/30">
                            查看留言板
                        </Link>
                    </div>
                </div>

                {/* 统计信息 */}
                <div className="glass-effect p-6 rounded-xl mb-8">
                    <div className="text-slate-400 text-sm mb-2">总留言数</div>
                    <div className="text-3xl font-bold">{messages.length}</div>
                </div>

                {/* 留言列表 */}
                <div className="glass-effect rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-6">所有留言</h2>

                    {messages.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            暂无留言
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    className="p-5 bg-slate-800/50 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            {/* 用户信息 */}
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-white font-bold">
                                                    {message.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white">{message.name}</div>
                                                    <div className="text-xs text-slate-500">
                                                        {formatDate(message.created_at)}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 留言内容 */}
                                            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap pl-13">
                                                {message.content}
                                            </p>
                                        </div>

                                        {/* 删除按钮 */}
                                        <button
                                            onClick={() => handleDelete(message.id)}
                                            className="px-4 py-2 text-sm bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex-shrink-0"
                                        >
                                            删除
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
