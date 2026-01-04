import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

function GuestBook() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState({ name: '', content: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // 获取留言列表
    const fetchMessages = async () => {
        if (!isSupabaseConfigured || !supabase) return;

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('guestbook')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMessages(data || []);
        } catch (err) {
            console.error('Error fetching messages:', err);
            setError('加载留言失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    // 提交新留言
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isSupabaseConfigured || !supabase) {
            setError('Supabase 未配置');
            return;
        }

        if (!newMessage.name.trim() || !newMessage.content.trim()) {
            setError('请填写昵称和留言内容');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const { data, error } = await supabase
                .from('guestbook')
                .insert([
                    {
                        name: newMessage.name.trim(),
                        content: newMessage.content.trim(),
                    },
                ])
                .select();

            if (error) throw error;

            // 成功后重置表单并刷新列表
            setNewMessage({ name: '', content: '' });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            fetchMessages();
        } catch (err) {
            console.error('Error submitting message:', err);
            setError('提交留言失败，请稍后重试');
        } finally {
            setSubmitting(false);
        }
    };

    // 页面加载时获取留言
    useEffect(() => {
        if (!isSupabaseConfigured || !supabase) {
            setLoading(false);
            return;
        }

        fetchMessages();

        // 实时订阅新留言（可选）
        const subscription = supabase
            .channel('guestbook_changes')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'guestbook' },
                (payload) => {
                    setMessages((current) => [payload.new, ...current]);
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // 格式化时间
    const formatDate = (dateString) => {
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
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { delayChildren: 0.2, staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    // 如果 Supabase 未配置，显示配置指南
    if (!isSupabaseConfigured) {
        return (
            <motion.div
                className="relative min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 sm:p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-teal-500/10 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none"></div>

                <motion.div
                    className="container relative z-10 max-w-3xl w-full mx-auto p-6 sm:p-10 bg-slate-900/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Link to="/">
                        <motion.button
                            className="mb-6 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-teal-500/50 text-slate-400 hover:text-teal-400 transition-colors text-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            ← 返回首页
                        </motion.button>
                    </Link>

                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">⚙️</div>
                        <h1 className="text-3xl sm:text-4xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-sky-400 to-purple-500">
                            留言板功能需要配置
                        </h1>
                        <p className="text-slate-400">
                            请按照以下步骤配置 Supabase 后端服务
                        </p>
                    </div>

                    <div className="space-y-6 text-left">
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                            <h3 className="text-lg font-bold text-teal-400 mb-3">📝 配置步骤：</h3>
                            <ol className="space-y-3 text-slate-300 text-sm list-decimal list-inside">
                                <li>访问 <a href="https://app.supabase.com/" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">Supabase Dashboard</a> 并创建项目</li>
                                <li>在 SQL Editor 中执行建表语句（详见 SUPABASE_SETUP.md）</li>
                                <li>在项目根目录创建 <code className="px-2 py-1 bg-slate-800 rounded text-teal-300">.env</code> 文件</li>
                                <li>添加以下环境变量：</li>
                            </ol>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-800/50 border border-white/5">
                            <pre className="text-xs sm:text-sm text-slate-300 overflow-x-auto">
                                <code>{`VITE_SUPABASE_URL=你的Supabase项目URL
VITE_SUPABASE_ANON_KEY=你的anon密钥`}</code>
                            </pre>
                        </div>

                        <div className="p-5 rounded-2xl bg-teal-500/10 border border-teal-500/20">
                            <p className="text-teal-300 text-sm">
                                💡 <strong>提示：</strong> 详细配置指南请查看项目根目录的 <code className="px-2 py-1 bg-slate-800 rounded">SUPABASE_SETUP.md</code> 文件
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                            <p className="text-purple-300 text-sm">
                                🔒 <strong>安全提示：</strong> 请确保 <code className="px-2 py-1 bg-slate-800 rounded">.env</code> 文件已添加到 <code className="px-2 py-1 bg-slate-800 rounded">.gitignore</code> 中，避免泄露密钥
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="relative min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* 装饰光晕 */}
            <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-teal-500/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none"></div>

            <motion.div
                className="container relative z-10 max-w-4xl w-full mx-auto p-6 sm:p-10 bg-slate-900/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/5"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* 返回按钮 */}
                <Link to="/">
                    <motion.button
                        className="mb-6 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-teal-500/50 text-slate-400 hover:text-teal-400 transition-colors text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        ← 返回首页
                    </motion.button>
                </Link>

                {/* 标题 */}
                <motion.header variants={itemVariants} className="mb-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-sky-400 to-purple-500">
                        留言板 📝
                    </h1>
                    <p className="text-slate-400 max-w-md mx-auto">
                        留下您的足迹，分享您的想法
                    </p>
                </motion.header>

                {/* 留言表单 */}
                <motion.section variants={itemVariants} className="mb-10">
                    <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white/5 border border-white/5">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                昵称 *
                            </label>
                            <input
                                type="text"
                                value={newMessage.name}
                                onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })}
                                placeholder="请输入您的昵称"
                                maxLength={50}
                                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-white/10 focus:border-teal-500/50 focus:outline-none text-white placeholder-slate-500 transition-colors"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                留言内容 *
                            </label>
                            <textarea
                                value={newMessage.content}
                                onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                                placeholder="说点什么吧..."
                                rows={4}
                                maxLength={500}
                                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-white/10 focus:border-teal-500/50 focus:outline-none text-white placeholder-slate-500 transition-colors resize-none"
                            />
                            <div className="text-xs text-slate-500 mt-1 text-right">
                                {newMessage.content.length}/500
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-3 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm"
                            >
                                留言提交成功！感谢您的留言 ✨
                            </motion.div>
                        )}

                        <motion.button
                            type="submit"
                            disabled={submitting}
                            whileHover={{ scale: submitting ? 1 : 1.02 }}
                            whileTap={{ scale: submitting ? 1 : 0.98 }}
                            className={`w-full py-3 rounded-xl font-bold transition-all ${submitting
                                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-400 hover:to-purple-400 text-white shadow-lg shadow-teal-500/20'
                                }`}
                        >
                            {submitting ? '提交中...' : '发布留言'}
                        </motion.button>
                    </form>
                </motion.section>

                {/* 留言列表 */}
                <motion.section variants={itemVariants}>
                    <h2 className="text-2xl font-bold mb-6 text-white">
                        所有留言 ({messages.length})
                    </h2>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block w-8 h-8 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
                            <p className="text-slate-400 mt-4">加载中...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-12 p-6 rounded-2xl bg-white/5 border border-white/5">
                            <p className="text-slate-400 text-lg">暂无留言，快来抢沙发吧！</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <AnimatePresence>
                                {messages.map((message, index) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                                                    {message.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white">{message.name}</div>
                                                    <div className="text-xs text-slate-500">
                                                        {formatDate(message.created_at)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                            {message.content}
                                        </p>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </motion.section>

                {/* 页脚 */}
                <motion.footer
                    variants={itemVariants}
                    className="mt-12 text-center text-slate-600 text-xs tracking-widest uppercase"
                >
                    Powered by Supabase
                </motion.footer>
            </motion.div>
        </motion.div>
    );
}

export default GuestBook;
