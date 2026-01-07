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
    const [cooldownRemaining, setCooldownRemaining] = useState(0);

    // 冷却时间（秒）
    const COOLDOWN_SECONDS = 30;

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

        // 检查冷却时间
        const lastSubmitTime = localStorage.getItem('lastGuestbookSubmit');
        if (lastSubmitTime) {
            const timeSinceLastSubmit = Date.now() - parseInt(lastSubmitTime);
            const cooldownMs = COOLDOWN_SECONDS * 1000;

            if (timeSinceLastSubmit < cooldownMs) {
                const remainingSeconds = Math.ceil((cooldownMs - timeSinceLastSubmit) / 1000);
                setError(`请等待 ${remainingSeconds} 秒后再提交留言`);
                setCooldownRemaining(remainingSeconds);
                return;
            }
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

            // 记录提交时间到 localStorage
            localStorage.setItem('lastGuestbookSubmit', Date.now().toString());

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

        // 实时订阅新留言
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

    // 冷却倒计时
    useEffect(() => {
        if (cooldownRemaining <= 0) return;

        const timer = setInterval(() => {
            const lastSubmitTime = localStorage.getItem('lastGuestbookSubmit');
            if (!lastSubmitTime) {
                setCooldownRemaining(0);
                return;
            }

            const timeSinceLastSubmit = Date.now() - parseInt(lastSubmitTime);
            const cooldownMs = COOLDOWN_SECONDS * 1000;
            const remaining = Math.ceil((cooldownMs - timeSinceLastSubmit) / 1000);

            if (remaining <= 0) {
                setCooldownRemaining(0);
                setError(null);
            } else {
                setCooldownRemaining(remaining);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldownRemaining, COOLDOWN_SECONDS]);

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

    // 页面动画
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                staggerChildren: 0.08
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.3 }
        }
    };

    const itemVariants = {
        initial: { opacity: 0, y: 30 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    // 如果 Supabase 未配置，显示配置指南
    if (!isSupabaseConfigured) {
        return (
            <motion.div
                className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 relative overflow-hidden p-4 sm:p-8"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                {/* 水墨背景 */}
                <div className="fixed inset-0 pointer-events-none opacity-30">
                    <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-radial from-stone-300/40 via-transparent to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-radial from-teal-200/30 via-transparent to-transparent rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-3xl mx-auto relative z-10">
                    <Link to="/">
                        <motion.button
                            className="mb-6 px-4 py-2 rounded-lg bg-white/70 border border-stone-200 hover:border-teal-400 text-stone-600 hover:text-teal-600 transition-colors text-sm font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            ← 返回
                        </motion.button>
                    </Link>

                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-stone-200">
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4 opacity-50">⚙️</div>
                            <h1 className="text-3xl sm:text-4xl font-black mb-4 bg-gradient-to-r from-stone-800 to-teal-700 bg-clip-text text-transparent">
                                留言板功能需要配置
                            </h1>
                            <p className="text-stone-500 font-serif">
                                请按照以下步骤配置 Supabase 后端服务
                            </p>
                        </div>

                        <div className="space-y-4 text-left text-sm">
                            <div className="p-5 rounded-xl bg-teal-50 border border-teal-200">
                                <h3 className="text-lg font-bold text-teal-700 mb-3">📝 配置步骤：</h3>
                                <ol className="space-y-2 text-stone-700 list-decimal list-inside">
                                    <li>访问 <a href="https://app.supabase.com/" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">Supabase Dashboard</a> 并创建项目</li>
                                    <li>在 SQL Editor 中执行建表语句（详见 SUPABASE_SETUP.md）</li>
                                    <li>在项目根目录创建 <code className="px-2 py-1 bg-white rounded text-teal-600">.env</code> 文件</li>
                                    <li>添加环境变量</li>
                                </ol>
                            </div>

                            <div className="p-5 rounded-xl bg-stone-100 border border-stone-200">
                                <pre className="text-xs text-stone-700 overflow-x-auto">
                                    <code>{`VITE_SUPABASE_URL=你的Supabase项目URL
VITE_SUPABASE_ANON_KEY=你的anon密钥`}</code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 relative overflow-hidden"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            {/* 水墨风格的背景装饰 */}
            <div className="fixed inset-0 pointer-events-none opacity-30">
                <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-radial from-stone-300/40 via-transparent to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-radial from-teal-200/30 via-transparent to-transparent rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-radial from-stone-400/20 via-transparent to-transparent rounded-full blur-2xl"></div>
            </div>

            {/* 赛博网格线 */}
            <div className="fixed inset-0 pointer-events-none opacity-5">
                <div className="w-full h-full" style={{
                    backgroundImage: 'linear-gradient(teal 1px, transparent 1px), linear-gradient(90deg, teal 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 relative z-10">
                {/* 返回按钮 */}
                <Link to="/">
                    <motion.button
                        variants={itemVariants}
                        className="mb-8 px-4 py-2 rounded-lg bg-white/70 border border-stone-200 hover:border-teal-400 text-stone-600 hover:text-teal-600 transition-colors text-sm font-medium inline-flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>←</span>
                        <span>返回</span>
                    </motion.button>
                </Link>

                {/* 标题 - 水墨书法风格 */}
                <motion.header variants={itemVariants} className="mb-12 text-center">
                    <div className="relative inline-block mb-6">
                        {/* 墨迹效果背景 */}
                        <div className="absolute inset-0 bg-gradient-to-r from-stone-300/40 via-teal-200/30 to-stone-300/40 blur-2xl -z-10 scale-110"></div>

                        <h1 className="text-6xl sm:text-7xl font-black mb-2 relative">
                            <span className="bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 bg-clip-text text-transparent tracking-wider">
                                留
                            </span>
                            <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-teal-700 bg-clip-text text-transparent tracking-wider mx-2">
                                言
                            </span>
                            <span className="bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 bg-clip-text text-transparent tracking-wider">
                                板
                            </span>
                        </h1>

                        {/* 赛博装饰线 */}
                        <div className="flex items-center justify-center gap-4 mt-4">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent via-teal-500 to-transparent"></div>
                            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                            <div className="h-px w-12 bg-gradient-to-r from-transparent via-teal-500 to-transparent"></div>
                        </div>
                    </div>

                    <p className="text-stone-500 font-serif text-lg italic">
                        笔落惊风雨 · 诗成泣鬼神
                    </p>
                </motion.header>

                {/* 留言表单 */}
                <motion.section variants={itemVariants} className="mb-12">
                    <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-stone-700 mb-2 font-serif">
                                昵称 *
                            </label>
                            <input
                                type="text"
                                value={newMessage.name}
                                onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })}
                                placeholder="请输入您的昵称"
                                maxLength={50}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-200 focus:outline-none text-stone-800 placeholder-stone-400 transition-all"
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-medium text-stone-700 mb-2 font-serif">
                                留言内容 *
                            </label>
                            <textarea
                                value={newMessage.content}
                                onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                                placeholder="说点什么吧..."
                                rows={4}
                                maxLength={500}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-200 focus:outline-none text-stone-800 placeholder-stone-400 transition-all resize-none font-serif"
                            />
                            <div className="text-xs text-stone-400 mt-1 text-right">
                                {newMessage.content.length}/500
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-serif"
                            >
                                {error}
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-3 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 text-sm font-serif"
                            >
                                留言提交成功！墨香犹存 ✨
                            </motion.div>
                        )}

                        <motion.button
                            type="submit"
                            disabled={submitting || cooldownRemaining > 0}
                            whileHover={{ scale: (submitting || cooldownRemaining > 0) ? 1 : 1.02 }}
                            whileTap={{ scale: (submitting || cooldownRemaining > 0) ? 1 : 0.98 }}
                            className={`w-full py-3 rounded-xl font-bold transition-all ${submitting || cooldownRemaining > 0
                                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg shadow-teal-500/20'
                                }`}
                        >
                            {submitting
                                ? '提交中...'
                                : cooldownRemaining > 0
                                    ? `请等待 ${cooldownRemaining} 秒`
                                    : '落笔留言'}
                        </motion.button>
                    </form>
                </motion.section>

                {/* 留言列表 */}
                <motion.section variants={itemVariants}>
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-bold text-stone-800">
                            所有留言
                        </h2>
                        <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-bold border border-teal-200">
                            {messages.length}
                        </span>
                    </div>

                    {loading ? (
                        <div className="text-center py-16 bg-white/70 rounded-2xl border border-stone-200">
                            <motion.div
                                className="inline-block w-10 h-10 border-4 border-teal-200 border-t-teal-500 rounded-full mb-4"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            ></motion.div>
                            <p className="text-stone-500 font-serif">墨香渐起...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-16 bg-white/70 rounded-2xl border border-stone-200">
                            <div className="text-6xl mb-4 opacity-30">📖</div>
                            <p className="text-stone-400 font-serif">空白画卷，待君挥毫...</p>
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
                                        whileHover={{ y: -2 }}
                                        className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-stone-200 hover:border-teal-300 hover:shadow-md transition-all duration-300 group"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                {/* 印章风格头像 */}
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white">
                                                    {message.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-stone-800 group-hover:text-teal-700 transition-colors">
                                                        {message.name}
                                                    </div>
                                                    <div className="text-xs text-stone-400 font-serif">
                                                        {formatDate(message.created_at)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-stone-700 leading-relaxed whitespace-pre-wrap font-serif">
                                            {message.content}
                                        </p>
                                        {/* 装饰条 */}
                                        <div className="h-px bg-gradient-to-r from-transparent via-teal-200 to-transparent mt-4 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </motion.section>

                {/* 页脚水墨印章 */}
                <motion.footer
                    variants={itemVariants}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-3 text-xs text-stone-400 font-serif">
                        <div className="w-12 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent"></div>
                        <span>留言千古 · 墨韵流芳</span>
                        <div className="w-12 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent"></div>
                    </div>
                </motion.footer>
            </div>
        </motion.div>
    );
}

export default GuestBook;
