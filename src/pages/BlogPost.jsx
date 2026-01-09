import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { usePost, likePost, checkLiked } from '../hooks/usePosts';
import { usePageView, incrementPostViews } from '../hooks/usePageView';
import { useComments, submitComment, getCommentCooldownRemaining, formatCommentDate } from '../hooks/useComments';
import { isSupabaseConfigured } from '../supabaseClient';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { format } from 'date-fns';

export default function BlogPost() {
    const { slug } = useParams();
    const { post, loading, refetch } = usePost(slug);
    const [liked, setLiked] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [viewsIncremented, setViewsIncremented] = useState(false);

    // 评论相关状态
    const { comments, loading: commentsLoading } = useComments(post?.id);
    const [newComment, setNewComment] = useState({ name: '', content: '' });
    const [submitting, setSubmitting] = useState(false);
    const [commentError, setCommentError] = useState(null);
    const [commentSuccess, setCommentSuccess] = useState(false);
    const [cooldownRemaining, setCooldownRemaining] = useState(0);

    usePageView(post ? `/blog/${post.slug}` : null, post?.title);

    useEffect(() => {
        if (post && !viewsIncremented) {
            console.log('📊 Post loaded:', {
                id: post.id,
                slug: post.slug,
                likes: post.likes,
                views: post.views,
                supabaseConfigured: isSupabaseConfigured
            });

            // 增加浏览量（只增加一次）
            setViewsIncremented(true);
            incrementPostViews(post.id).then(() => {
                // 延迟后重新获取数据
                setTimeout(() => {
                    refetch();
                }, 500);
            });

            // 检查是否已点赞
            checkLiked(post.id).then(setLiked);
        }
    }, [post?.id, viewsIncremented]);

    // 冷却倒计时
    useEffect(() => {
        if (cooldownRemaining <= 0) return;

        const timer = setInterval(() => {
            const remaining = getCommentCooldownRemaining();
            if (remaining <= 0) {
                setCooldownRemaining(0);
                setCommentError(null);
            } else {
                setCooldownRemaining(remaining);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldownRemaining]);

    async function handleLike() {
        if (!post || isLiking) return;

        setIsLiking(true);
        try {
            const result = await likePost(post.id);
            if (result.liked !== undefined) {
                setLiked(result.liked);
                // 重新获取文章数据
                setTimeout(() => {
                    refetch();
                }, 300);
            }
        } finally {
            setIsLiking(false);
        }
    }

    // 提交评论
    async function handleCommentSubmit(e) {
        e.preventDefault();

        if (!newComment.name.trim() || !newComment.content.trim()) {
            setCommentError('请填写昵称和评论内容');
            return;
        }

        setSubmitting(true);
        setCommentError(null);

        const result = await submitComment(post.id, newComment.name, newComment.content);

        if (result.error) {
            setCommentError(result.error);
            if (result.cooldown) {
                setCooldownRemaining(result.cooldown);
            }
        } else if (result.success) {
            setNewComment({ name: '', content: '' });
            setCommentSuccess(true);
            setTimeout(() => setCommentSuccess(false), 3000);
        }

        setSubmitting(false);
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-white">加载中...</div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-white text-xl mb-4">文章未找到</div>
                    <Link to="/blog" className="text-teal-400 hover:text-teal-300">
                        返回博客列表
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="min-h-screen bg-slate-950 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <LanguageSwitcher />

            <article className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
                {/* 返回链接 */}
                <Link
                    to="/blog"
                    className="text-teal-400 hover:text-teal-300 text-sm mb-8 inline-block"
                >
                    ← 返回博客列表
                </Link>

                {/* 文章头部 */}
                <motion.header
                    className="mb-12"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    {/* 标题 */}
                    <h1 className="text-4xl sm:text-5xl font-black mb-6 text-gradient">
                        {post.title}
                    </h1>

                    {/* 元信息 */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-6">
                        <span>📅 {format(new Date(post.created_at), 'yyyy年MM月dd日')}</span>
                        <span>👁️ {post.views || 0} 阅读</span>
                        <span>❤️ {post.likes || 0} 点赞</span>
                    </div>

                    {/* 标签 */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 bg-teal-500/10 text-teal-400 text-sm rounded-full"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </motion.header>

                {/* 封面图 */}
                {post.cover_image && (
                    <motion.div
                        className="rounded-xl overflow-hidden mb-12"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-auto"
                        />
                    </motion.div>
                )}

                {/* 文章内容 */}
                <motion.div
                    className="prose prose-invert prose-lg max-w-none mb-12"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={vscDarkPlus}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            }
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </motion.div>

                {/* 点赞按钮 */}
                <motion.div
                    className="flex justify-center mb-12"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <motion.button
                        onClick={handleLike}
                        disabled={isLiking}
                        className={`px-8 py-4 rounded-full text-lg font-semibold transition-all ${liked
                            ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                            : 'glass-effect border border-white/20 hover:border-teal-400/50'
                            } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
                        whileHover={{ scale: isLiking ? 1 : 1.05 }}
                        whileTap={{ scale: isLiking ? 1 : 0.95 }}
                    >
                        {isLiking ? '⏳ 处理中...' : liked ? '❤️ 已点赞' : '🤍 点个赞'}
                    </motion.button>
                </motion.div>

                {/* 评论区 */}
                <motion.section
                    className="mt-16 border-t border-white/10 pt-12"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    {/* 评论区标题 */}
                    <div className="flex items-center gap-3 mb-8">
                        <h2 className="text-3xl font-bold text-white">💬 评论区</h2>
                        <span className="px-3 py-1 bg-teal-500/20 text-teal-400 rounded-full text-sm font-bold border border-teal-500/30">
                            {comments?.length || 0}
                        </span>
                    </div>

                    {/* 评论表单 */}
                    <form onSubmit={handleCommentSubmit} className="glass-effect rounded-2xl p-6 sm:p-8 border border-white/10 mb-8">
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                昵称 *
                            </label>
                            <input
                                type="text"
                                value={newComment.name}
                                onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                                placeholder="请输入您的昵称"
                                maxLength={50}
                                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-white/10 focus:border-teal-400/50 focus:ring-2 focus:ring-teal-400/20 focus:outline-none text-white placeholder-slate-500 transition-all"
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                评论内容 *
                            </label>
                            <textarea
                                value={newComment.content}
                                onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                                placeholder="说点什么吧..."
                                rows={4}
                                maxLength={500}
                                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-white/10 focus:border-teal-400/50 focus:ring-2 focus:ring-teal-400/20 focus:outline-none text-white placeholder-slate-500 transition-all resize-none"
                            />
                            <div className="text-xs text-slate-400 mt-1 text-right">
                                {newComment.content.length}/500
                            </div>
                        </div>

                        {commentError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                            >
                                {commentError}
                            </motion.div>
                        )}

                        {commentSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-3 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm"
                            >
                                评论提交成功！✨
                            </motion.div>
                        )}

                        <motion.button
                            type="submit"
                            disabled={submitting || cooldownRemaining > 0}
                            whileHover={{ scale: (submitting || cooldownRemaining > 0) ? 1 : 1.02 }}
                            whileTap={{ scale: (submitting || cooldownRemaining > 0) ? 1 : 0.98 }}
                            className={`w-full py-3 rounded-xl font-bold transition-all ${submitting || cooldownRemaining > 0
                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg shadow-teal-500/20'
                                }`}
                        >
                            {submitting
                                ? '提交中...'
                                : cooldownRemaining > 0
                                    ? `请等待 ${cooldownRemaining} 秒`
                                    : '发表评论'}
                        </motion.button>
                    </form>

                    {/* 评论列表 */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-6">全部评论</h3>
                        {commentsLoading ? (
                            <div className="text-center py-16 glass-effect rounded-2xl border border-white/10">
                                <motion.div
                                    className="inline-block w-10 h-10 border-4 border-teal-500/30 border-t-teal-500 rounded-full mb-4"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                ></motion.div>
                                <p className="text-slate-400">加载评论中...</p>
                            </div>
                        ) : !comments || comments.length === 0 ? (
                            <div className="text-center py-16 glass-effect rounded-2xl border border-white/10">
                                <div className="text-6xl mb-4 opacity-30">💭</div>
                                <p className="text-slate-400">还没有评论，快来抢沙发吧！</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {comments.map((comment, index) => (
                                        <motion.div
                                            key={comment.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{ y: -2 }}
                                            className="glass-effect rounded-2xl p-6 border border-white/10 hover:border-teal-500/30 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 group"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    {/* 头像 */}
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-teal-400/30">
                                                        {comment.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white group-hover:text-teal-400 transition-colors">
                                                            {comment.name}
                                                        </div>
                                                        <div className="text-xs text-slate-400">
                                                            {formatCommentDate(comment.created_at)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                                {comment.content}
                                            </p>
                                            {/* 装饰条 */}
                                            <div className="h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent mt-4 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </motion.section>
            </article>
        </motion.div>
    );
}