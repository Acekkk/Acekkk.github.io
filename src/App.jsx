import React from 'react';
import { motion } from 'framer-motion';

function App() {
  // 定义容器的动画变量
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.2, // 子元素延迟 0.2 秒开始动画
        staggerChildren: 0.1, // 每个子元素动画之间间隔 0.1 秒
      },
    },
  };

  // 定义子元素的动画变量
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="container max-w-4xl w-full mx-auto p-6 sm:p-10 bg-gray-900 bg-opacity-70 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-800"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 头部动画 */}
        <motion.header variants={itemVariants} className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-sky-500">
            你好！这里是刘碧坤的个人主页
          </h1>
          <p className="text-lg sm:text-xl text-gray-300">
            包含一些个人介绍，兴趣爱好，做过的一些东西~
          </p>
        </motion.header>

        <main>
          {/* 个人介绍 */}
          <motion.section variants={itemVariants} className="mb-8">
            <h2 className="text-3xl font-bold text-teal-400 mb-4">个人介绍</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <motion.li variants={itemVariants}>一名对技术充满热情的探索者。</motion.li>
              <motion.li variants={itemVariants}>致力于通过代码解决实际问题，创造有价值的产品。</motion.li>
              <motion.li variants={itemVariants}>乐于学习新知识，挑战未知领域。</motion.li>
            </ul>
          </motion.section>

          {/* 兴趣爱好 */}
          <motion.section variants={itemVariants} className="mb-8">
            <h2 className="text-3xl font-bold text-sky-400 mb-4">兴趣爱好</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <motion.li variants={itemVariants}>编程：沉迷于前端框架和自动化脚本。</motion.li>
              <motion.li variants={itemVariants}>户外：喜欢徒步和探索自然。</motion.li>
              <motion.li variants={itemVariants}>阅读：偏爱科幻与技术类书籍。</motion.li>
            </ul>
          </motion.section>

          {/* 做过的东西 */}
          <motion.section variants={itemVariants} className="mb-8">
            <h2 className="text-3xl font-bold text-purple-400 mb-4">做过的东西</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <motion.li variants={itemVariants}>
                <span className="font-semibold">这个个人主页：</span> 使用 React, Tailwind CSS 和 Framer Motion 搭建并自动化部署。
              </motion.li>
              <motion.li variants={itemVariants}>
                <span className="font-semibold">智能家居集成：</span> 基于 Home Assistant 实现了全屋自动化控制。
              </motion.li>
              <motion.li variants={itemVariants}>
                <span className="font-semibold">数据可视化工具：</span> 开发了一个小型 Python + Echarts 数据展示平台。
              </motion.li>
            </ul>
          </motion.section>
        </main>

        {/* 底部动画 */}
        <motion.footer variants={itemVariants} className="mt-12 text-center text-gray-500 text-sm">
          <small>更新时间：2025-12-28 • 刘碧坤 </small>
          <motion.a
            href="https://docs.github.com/en/pages"
            target="_blank"
            rel="noreferrer"
            className="block sm:inline-block mt-4 sm:ml-4 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full transition transform hover:-translate-y-1 hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            官方文档
          </motion.a>
        </motion.footer>
      </motion.div>
    </motion.div>
  );
}

export default App;