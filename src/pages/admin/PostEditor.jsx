import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function PostEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        cover_image: '',
        tags: '',
        published: false
    });
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(isEditing);

    useEffect(() => {
        if (isEditing) {
            fetchPost();
        }
    }, [id]);

    async function fetchPost() {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            setFormData({
                title: data.title || '',
                slug: data.slug || '',
                excerpt: data.excerpt || '',
                content: data.content || '',
                cover_image: data.cover_image || '',
                tags: data.tags ? data.tags.join(', ') : '',
                published: data.published || false
            });
        } catch (error) {
            console.error('Error fetching post:', error);
            alert('加载文章失败：' + error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);

        try {
            // 生成 slug（如果没有提供）
            let slug = formData.slug;
            if (!slug) {
                slug = formData.title
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w\-]+/g, '')
                    .replace(/\-\-+/g, '-');
            }

            // 处理标签
            const tags = formData.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag);

            const postData = {
                title: formData.title,
                slug,
                excerpt: formData.excerpt,
                content: formData.content,
                cover_image: formData.cover_image || null,
                tags,
                published: formData.published
            };

            if (isEditing) {
                // 更新文章
                const { error } = await supabase
                    .from('posts')
                    .update(postData)
                    .eq('id', id);

                if (error) throw error;
                alert('文章更新成功！');
            } else {
                // 创建新文章
                const { error } = await supabase
                    .from('posts')
                    .insert([postData]);

                if (error) throw error;
                alert('文章创建成功！');
            }

            navigate('/admin');
        } catch (error) {
            console.error('Error saving post:', error);
            alert('保存失败：' + error.message);
        } finally {
            setSaving(false);
        }
    }

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* 页头 */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-black text-gradient">
                            {isEditing ? '✏️ 编辑文章' : '✨ 新建文章'}
                        </h1>
                        <button
                            onClick={() => navigate('/admin')}
                            className="px-4 py-2 text-sm bg-slate-800 rounded-lg hover:bg-slate-700"
                        >
                            返回后台
                        </button>
                    </div>

                    {/* 表单 */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 标题 */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                文章标题 <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg focus:border-teal-400/50 focus:outline-none"
                                placeholder="输入文章标题"
                            />
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                URL Slug（留空自动生成）
                            </label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg focus:border-teal-400/50 focus:outline-none"
                                placeholder="my-awesome-post"
                            />
                        </div>

                        {/* 摘要 */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                文章摘要
                            </label>
                            <textarea
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg focus:border-teal-400/50 focus:outline-none resize-none"
                                placeholder="简短描述文章内容"
                            />
                        </div>

                        {/* 封面图片 */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                封面图片 URL
                            </label>
                            <input
                                type="url"
                                name="cover_image"
                                value={formData.cover_image}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg focus:border-teal-400/50 focus:outline-none"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        {/* 标签 */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                标签（用逗号分隔）
                            </label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg focus:border-teal-400/50 focus:outline-none"
                                placeholder="技术, 分享, 思考"
                            />
                        </div>

                        {/* 内容 */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                文章内容（支持 Markdown） <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                required
                                rows="20"
                                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg focus:border-teal-400/50 focus:outline-none font-mono text-sm resize-none"
                                placeholder="# 标题&#x0A;&#x0A;正文内容..."
                            />
                        </div>

                        {/* 发布状态 */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="published"
                                name="published"
                                checked={formData.published}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-white/10 bg-slate-800/50 text-teal-500 focus:ring-teal-400/50"
                            />
                            <label htmlFor="published" className="text-sm font-medium cursor-pointer">
                                立即发布（取消勾选则保存为草稿）
                            </label>
                        </div>

                        {/* 提交按钮 */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-sky-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-teal-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? '保存中...' : (isEditing ? '更新文章' : '创建文章')}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin')}
                                className="px-6 py-3 bg-slate-800 rounded-lg font-semibold hover:bg-slate-700"
                            >
                                取消
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
