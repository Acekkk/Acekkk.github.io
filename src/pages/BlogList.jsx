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

    // 页面动画配置
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    {/* 水墨风格的加载动画 */}
                    <motion.div
                        className="relative w-16 h-16"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="absolute inset-0 border-4 border-stone-300 border-t-teal-500 rounded-full"></div>
                    </motion.div>
                    <div className="text-stone-600 font-serif text-sm">
                        墨香渐起...
                    </div>
                </div>
            </div>
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
                {/* 水墨晕染效果 */}
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

            <LanguageSwitcher />

            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 relative z-10">
                {/* 返回按钮 */}
                <motion.div variants={itemVariants} className="mb-8">
                    <Link to="/">
                        <motion.button
                            className="px-4 py-2 rounded-lg bg-white/70 border border-stone-200 hover:border-teal-400 text-stone-600 hover:text-teal-600 transition-colors text-sm font-medium inline-flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>←</span>
                            <span>返回</span>
                        </motion.button>
                    </Link>
                </motion.div>

                {/* 页头 - 水墨+赛博风格 */}
                <motion.header
                    className="mb-16 text-center"
                    variants={itemVariants}
                >

                    {/* 主标题 - 书法风格 */}
                    <div className="relative inline-block mb-6">
                        {/* 墨迹效果背景 */}
                        <div className="absolute inset-0 bg-gradient-to-r from-stone-300/40 via-teal-200/30 to-stone-300/40 blur-2xl -z-10 scale-110"></div>

                        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black mb-2 relative">
                            <span className="bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 bg-clip-text text-transparent tracking-wider">
                                文
                            </span>
                            <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-teal-700 bg-clip-text text-transparent tracking-wider mx-2">
                                字
                            </span>
                            <span className="bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 bg-clip-text text-transparent tracking-wider">
                                世
                            </span>
                            <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-teal-700 bg-clip-text text-transparent tracking-wider mx-2">
                                界
                            </span>
                        </h1>

                        {/* 赛博风格的装饰线 */}
                        <div className="flex items-center justify-center gap-4 mt-4">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent via-teal-500 to-transparent"></div>
                            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                            <div className="h-px w-12 bg-gradient-to-r from-transparent via-teal-500 to-transparent"></div>
                        </div>
                    </div>

                    {/* 副标题 */}
                    <p className="text-stone-500 font-serif text-lg italic">
                        笔墨丹青 · 数字星河
                    </p>
                </motion.header>

                {/* 文章列表 */}
                {posts.length === 0 ? (
                    <motion.div
                        variants={itemVariants}
                        className="text-center py-32"
                    >
                        <div className="inline-block p-12 rounded-2xl bg-white/60 backdrop-blur-sm border border-stone-200">
                            <div className="text-6xl mb-4 opacity-30">📖</div>
                            <p className="text-stone-400 font-serif">静候墨香...</p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post, idx) => (
                            <motion.article
                                key={post.id}
                                variants={itemVariants}
                                whileHover={{ y: -8 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <Link to={`/blog/${post.slug}`} className="block h-full">
                                    <div className="h-full bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-stone-200/50 hover:border-teal-400/50 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 group">
                                        {/* 封面图 - 水墨滤镜效果 */}
                                        {post.cover_image && (
                                            <div className="relative overflow-hidden aspect-video">
                                                <img
                                                    src={post.cover_image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    style={{ filter: 'contrast(0.9) saturate(0.8)' }}
                                                />
                                                {/* 水墨叠加层 */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent"></div>
                                            </div>
                                        )}

                                        <div className="p-6">
                                            {/* 标题 - 书法风格 */}
                                            <h2 className="text-xl font-bold mb-3 text-stone-800 group-hover:text-teal-700 transition-colors line-clamp-2 leading-relaxed">
                                                {post.title}
                                            </h2>

                                            {/* 摘要 */}
                                            {post.excerpt && (
                                                <p className="text-stone-600 text-sm mb-4 line-clamp-3 leading-relaxed font-serif">
                                                    {post.excerpt}
                                                </p>
                                            )}

                                            {/* 标签 - 印章风格 */}
                                            {post.tags && post.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {post.tags.slice(0, 3).map((tag, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-3 py-1 bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 text-xs rounded-full border border-teal-200/50 font-medium"
                                                        >
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* 元信息 - 赛博风格 */}
                                            <div className="flex items-center gap-4 text-xs text-stone-400 pt-4 border-t border-stone-200">
                                                <span className="flex items-center gap-1">
                                                    <span className="text-teal-500">👁</span>
                                                    {post.views || 0}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="text-red-400">❤</span>
                                                    {post.likes || 0}
                                                </span>
                                                <span className="flex items-center gap-1 ml-auto">
                                                    <span>📅</span>
                                                    {format(new Date(post.created_at), 'yyyy-MM-dd')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* 赛博风格的底部装饰条 */}
                                        <div className="h-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent group-hover:via-teal-500 transition-all duration-300"></div>
                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </div>
                )}

                {/* 分页 - 水墨印章风格 */}
                {totalPages > 1 && (
                    <motion.div
                        variants={itemVariants}
                        className="flex justify-center gap-3 mt-16"
                    >
                        {Array.from({ length: totalPages }, (_, i) => (
                            <motion.button
                                key={i}
                                onClick={() => setPage(i)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className={`w-10 h-10 rounded-full font-bold transition-all ${i === page
                                    ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30'
                                    : 'bg-white/70 text-stone-600 hover:bg-white border border-stone-200'
                                    }`}
                            >
                                {i + 1}
                            </motion.button>
                        ))}
                    </motion.div>
                )}

                {/* 页脚水墨印章 */}
                <motion.footer
                    variants={itemVariants}
                    className="mt-24 text-center"
                >
                    <div className="inline-flex items-center gap-3 text-xs text-stone-400 font-serif">
                        <div className="w-12 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent"></div>
                        <span>墨韵流转 · 数字永恒</span>
                        <div className="w-12 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent"></div>
                    </div>
                </motion.footer>
            </div>
        </motion.div>
    );
}