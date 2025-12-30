import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function Home() {
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
          <motion.img 
            src="/Avatar.jpg" // 确保图片放在 public 目录下
            className="w-36 h-36 rounded-full border-4 border-teal-400 shadow-lg mx-auto mb-4 object-cover"
            whileHover={{ scale: 1.1, rotate: 5 }}
          />
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-sky-500">
            你好！这里是刘碧坤的个人主页
          </h1>
          <p className="text-lg sm:text-xl text-gray-300">
            包含一些个人介绍，兴趣爱好，技术能力~
          </p>
        </motion.header>

        <main>
          {/* 个人介绍 */}
          <motion.section variants={itemVariants} className="mb-8">
            <h2 className="text-3xl font-bold text-teal-400 mb-4">个人介绍</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <motion.li variants={itemVariants}>一名对技术充满热情的探索者。</motion.li>
              <motion.li variants={itemVariants}>致力于通过技术解决实际问题，创造有价值的产品。</motion.li>
              <motion.li variants={itemVariants}>乐于学习新知识，挑战未知领域。</motion.li>
            </ul>
          </motion.section>

          {/* 兴趣爱好 */}
          <motion.section variants={itemVariants} className="mb-8">
            <h2 className="text-3xl font-bold text-sky-400 mb-4">兴趣爱好</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <motion.li variants={itemVariants}>游戏：死亡搁浅、大镖客、永劫无间、仙剑...</motion.li>
              <motion.li variants={itemVariants}>户外：喜欢徒步和探索自然、闲逛、骑摩托、游泳...</motion.li>
              <motion.li variants={itemVariants}>阅读：历史与科幻类书籍...</motion.li>
              <motion.li variants={itemVariants}>音乐：喜欢玩但都不太会，比如竹笛、陶笛...</motion.li>
            </ul>
          </motion.section>

          {/* 做过的东西 */}
          <motion.section variants={itemVariants} className="mb-8">
            <h2 className="text-3xl font-bold text-purple-400 mb-4">技术能力</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <motion.li 
              variants={itemVariants} 
              className="p-3 mb-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-teal-500/30" 
              >
              <Link to="/project/my-site" 
                className="hover:text-teal-300 transition-colors flex items-center"
              >
              {/* 左侧文字 */}
              {/* <span className="font-semibold">这个个人主页：</span>    */}
              {/* 右侧交互标签：当鼠标悬停在整行时，这个小标签会显得更亮 */}
              <span className="ml-2 text-sm bg-teal-500/20 px-2 py-0.5 rounded text-teal-300 group-hover:bg-teal-500/40 transition-all">
              点击查看详情 →</span>
              </Link>
              </motion.li>

              {/* <motion.li variants={itemVariants}>
                <span className="font-semibold">智能家居集成：</span> 基于 Home Assistant 实现了全屋自动化控制。
              </motion.li>
              
              <motion.li variants={itemVariants}>
                <span className="font-semibold">数据可视化工具：</span> 开发了一个小型 Python + Echarts 数据展示平台。
              </motion.li> */}
            </ul>
          </motion.section>
        </main>

        {/* 底部动画 */}
        <motion.footer variants={itemVariants} className="mt-12 text-center text-gray-500 text-sm">
          <small>update:2025-12-28 • 刘碧坤   contact:804872510@qq.com</small>
          {/* <motion.a
            href="https://docs.github.com/en/pages"
            target="_blank"
            rel="noreferrer"
            className="block sm:inline-block mt-4 sm:ml-4 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full transition transform hover:-translate-y-1 hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            官方文档
          </motion.a> */}
        </motion.footer>
      </motion.div>
    </motion.div>
  );
}

export default Home;