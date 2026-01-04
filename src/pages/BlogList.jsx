import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { usePageView } from '../hooks/usePageView';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { format } from 'date-fns';

export default function BlogList() {
    const [page, setPage] = useState(0);
    const pageSize = 9;
    const { posts, loading, total } = usePosts({
        published: true,
        limit: pageSize,
        offset: page * pageSize
    });

    usePageView('/blog', '文字世界');

    const totalPages = Math.ceil(total / pageSize);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-white">加载中...</div>
            </div>
        );
    }

    return (
        <motion.div
            className="min-h-screen bg-slate-950 text-white p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <LanguageSwitcher />

            <div className="max-w-6xl mx-auto">
                {/* 页头 */}
                <motion.header
                    className="mb-12 text-center"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <Link to="/" className="text-teal-400 hover:text-teal-300 text-sm mb-4 inline-block">
                        ← 返回首页
                    </Link>
                    <h1 className="text-4xl sm:text-6xl font-black text-gradient animate-text-shimmer mb-4">
                        📝 文字世界
                    </h1>
                    <p className="text-slate-400">分享思考</p>
                </motion.header>

                {/* 文章列表 */}
                {posts.length === 0 ? (
                    <div className="text-center text-slate-500 py-20">
                        暂无文章，敬请期待...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post, idx) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Link to={`/blog/${post.slug}`}>
                                    <div className="h-full glass-effect rounded-xl p-6 border border-white/10 hover:border-teal-400/50 transition-all group">
                                        {/* 封面图 */}
                                        {post.cover_image && (
                                            <div className="rounded-lg overflow-hidden mb-4">
                                                <img
                                                    src={post.cover_image}
                                                    alt={post.title}
                                                    className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                        )}

                                        {/* 标题 */}
                                        <h2 className="text-xl font-bold mb-3 group-hover:text-teal-400 transition-colors">
                                            {post.title}
                                        </h2>

                                        {/* 摘要 */}
                                        {post.excerpt && (
                                            <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        {/* 标签 */}
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {post.tags.slice(0, 3).map((tag, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-1 bg-teal-500/10 text-teal-400 text-xs rounded"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* 元信息 */}
                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                            <span>👁️ {post.views || 0}</span>
                                            <span>❤️ {post.likes || 0}</span>
                                            <span>📅 {format(new Date(post.created_at), 'yyyy-MM-dd')}</span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </div>
                )}

                {/* 分页 */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-12">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i)}
                                className={`px-4 py-2 rounded-lg transition-colors ${i === page
                                    ? 'bg-teal-500 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}