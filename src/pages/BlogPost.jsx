import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { usePost, likePost, checkLiked } from '../hooks/usePosts';
import { usePageView, incrementPostViews } from '../hooks/usePageView';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { format } from 'date-fns';

export default function BlogPost() {
    const { slug } = useParams();
    const { post, loading } = usePost(slug);
    const [liked, setLiked] = useState(false);
    const [localLikes, setLocalLikes] = useState(0);

    usePageView(post ? `/blog/${post.slug}` : null, post?.title);

    useEffect(() => {
        if (post) {
            // 增加浏览量
            incrementPostViews(post.id);
            setLocalLikes(post.likes || 0);

            // 检查是否已点赞
            checkLiked(post.id).then(setLiked);
        }
    }, [post]);

    async function handleLike() {
        if (!post) return;

        const result = await likePost(post.id);
        if (result.liked !== undefined) {
            setLiked(result.liked);
            setLocalLikes(prev => result.liked ? prev + 1 : prev - 1);
        }
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
                        <span>❤️ {localLikes} 点赞</span>
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
                        className={`px-8 py-4 rounded-full text-lg font-semibold transition-all ${liked
                            ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                            : 'glass-effect border border-white/20 hover:border-teal-400/50'
                            }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {liked ? '❤️ 已点赞' : '🤍 点个赞'}
                    </motion.button>
                </motion.div>
            </article>
        </motion.div>
    );
}