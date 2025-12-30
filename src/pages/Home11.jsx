import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';


const RainEffect = () => {
  const [drops, setDrops] = React.useState([]);

  React.useEffect(() => {
    // 每 500ms 生成一个新的掉落物
    const interval = setInterval(() => {
      const newDrop = {
        id: Date.now(),
        x: Math.random() * 100, // 随机横向位置 (0-100%)
        char: ["+1", "功德", "✨", "0", "1"][Math.floor(Math.random() * 5)],
        duration: 3 + Math.random() * 4, // 随机掉落速度
        size: 12 + Math.random() * 20, // 随机大小
      };
      setDrops((prev) => [...prev.slice(-15), newDrop]); // 最多保留15个，防止卡顿
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <AnimatePresence>
        {drops.map((drop) => (
          <motion.div
            key={drop.id}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: "110vh", opacity: [0, 0.8, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: drop.duration, ease: "linear" }}
            className="absolute font-mono text-teal-500/20 whitespace-nowrap"
            style={{ left: `${drop.x}%`, fontSize: drop.size }}
          >
            {drop.char}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const WoodFish = () => {
  const [count, setCount] = React.useState(0);
  const [popups, setPopups] = React.useState([]);

  const handleClick = () => {
    const nextCount = count + 1;
    setCount(nextCount);
    
    // 逻辑判断：决定弹出什么文字
    let popupText = "功德 +1";
    
    if (nextCount > 100) {
      popupText = "功德圆满 🙏";
    } else if (nextCount % 10 === 0) {
      popupText = "烦恼消散 ✨";
    }

    const newPopup = { id: Date.now(), text: popupText };
    setPopups(prev => [...prev, newPopup]);

    // 1秒后移除文字
    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== newPopup.id));
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md mt-10 relative overflow-hidden max-w-sm mx-auto mb-20 shadow-2xl">
      <div className="text-slate-500 text-[10px] mb-4 uppercase tracking-[0.3em] font-bold">Cyber Temple</div>
      
      {/* 功德计数器 - 增加一个颜色切换逻辑 */}
      <div className="text-4xl font-black text-white mb-8 tracking-tighter">
        功德数：
        <span className={count >= 100 ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" : "text-teal-400"}>
          {count}
        </span>
      </div>

      {/* 木鱼主体 */}
      <div className="relative cursor-pointer select-none active:scale-95 transition-transform" onClick={handleClick}>
        {/* 弹出文字动画容器 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 text-center pointer-events-none">
          {popups.map(popup => (
            <motion.div
              key={popup.id}
              initial={{ opacity: 1, y: 0, scale: 0.5 }}
              animate={{ opacity: 0, y: -120, scale: 1.2 }}
              className={`font-bold absolute w-full left-0 ${
                popup.text === "功德 +1" ? "text-teal-300" : "text-yellow-300 text-xl"
              }`}
            >
              {popup.text}
            </motion.div>
          ))}
        </div>

        {/* 木鱼外观 */}
        <motion.div
          whileTap={{ scale: 0.9, rotate: -3 }}
          className={`w-32 h-32 rounded-full flex items-center justify-center shadow-inner relative transition-colors duration-500 ${
            count >= 100 ? "bg-yellow-600/20 border-yellow-500/50" : "bg-slate-800 border-slate-950"
          } border-b-8`}
        >
          {/* 木鱼的小纹理 */}
          <div className="w-20 h-1 rounded-full bg-white/5 absolute top-10 rotate-12"></div>
          <span className="text-6xl drop-shadow-lg">
            {count >= 100 ? "🏮" : "🪵"}
          </span>
        </motion.div>
      </div>

      <p className="mt-8 text-[10px] text-slate-500 tracking-widest font-light">
        {count >= 100 ? "您已功德无量" : "心诚则灵，万物皆空"}
      </p>
    </div>
  );
};


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
          <motion.section variants={itemVariants} className="mb-10">
            {/* 标题与按钮的容器：使用 gap-4 让它们靠在一起 */}
            <div className="flex items-center gap-4 mb-6">
              {/* 左侧标题 */}
              <h2 className="text-3xl font-bold text-purple-400">个人介绍</h2>

              {/* 紧贴标题的详情按钮 */}
              <Link to="/projectintro/intro">
                <motion.div
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(45,212,191,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-teal-500/40 text-teal-300 text-xs font-medium transition-all backdrop-blur-sm cursor-pointer"
                >
                  <span>查看详情</span>
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="inline-block"
                  >
                    →
                  </motion.span>
                </motion.div>
              </Link>
            </div>
            {/* 下方的技能列表 */}
            <div className="grid grid-cols-1 gap-3">
              <motion.div 
                variants={itemVariants} 
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group/item"
              >
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li className="marker:text-purple-400">一名对技术充满热情的探索者</li>
                  <li className="marker:text-purple-400">致力于通过技术解决实际问题，创造有价值的产品</li>
                  <li className="marker:text-purple-400">乐于学习新知识，挑战未知领域</li>
                </ul>
              </motion.div>
            </div>
          </motion.section>

          {/* <WoodFish /> */}

          {/* 兴趣爱好 */}
          <motion.section variants={itemVariants} className="mb-10">
            {/* 标题与按钮的容器：使用 gap-4 让它们靠在一起 */}
            <div className="flex items-center gap-4 mb-6">
              {/* 左侧标题 */}
              <h2 className="text-3xl font-bold text-purple-400">兴趣爱好</h2>

              {/* 紧贴标题的详情按钮 */}
              <Link to="/projectinterest/interest">
                <motion.div
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(45,212,191,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-teal-500/40 text-teal-300 text-xs font-medium transition-all backdrop-blur-sm cursor-pointer"
                >
                  <span>查看详情</span>
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="inline-block"
                  >
                    →
                  </motion.span>
                </motion.div>
              </Link>
            </div>
            {/* 下方的技能列表 */}
            <div className="grid grid-cols-1 gap-3">
              <motion.div 
                variants={itemVariants} 
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group/item"
              >
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li className="marker:text-purple-400">游戏：死亡搁浅、大镖客、永劫无间、仙剑...</li>
                  <li className="marker:text-purple-400">户外：徒步和探索自然、闲逛、骑摩托、游泳...</li>
                  <li className="marker:text-purple-400">阅读：历史与科幻类书籍...</li>
                  <li className="marker:text-purple-400">音乐：喜欢玩但都不太会，比如竹笛、陶笛...</li>
                </ul>
              </motion.div>
            </div>
          </motion.section>

          {/* 技术能力 */}
          <motion.section variants={itemVariants} className="mb-10">
            {/* 标题与按钮的容器：使用 gap-4 让它们靠在一起 */}
            <div className="flex items-center gap-4 mb-6">
              {/* 左侧标题 */}
              <h2 className="text-3xl font-bold text-purple-400">技术能力</h2>

              {/* 紧贴标题的详情按钮 */}
              <Link to="/projectwork/work">
                <motion.div
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(45,212,191,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-teal-500/40 text-teal-300 text-xs font-medium transition-all backdrop-blur-sm cursor-pointer"
                >
                  <span>查看详情</span>
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="inline-block"
                  >
                    →
                  </motion.span>
                </motion.div>
              </Link>
            </div>
            {/* 下方的技能列表 */}
            <div className="grid grid-cols-1 gap-3">
              <motion.div 
                variants={itemVariants} 
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group/item"
              >
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li className="marker:text-purple-400">自动驾驶相关技术(算法、中间件、基础设施等)</li>
                  <li className="marker:text-purple-400">港口机械自动化 (算法、业务等)</li>
                  <li className="marker:text-purple-400">前后端开发(react、html等)</li>
                </ul>
              </motion.div>
            </div>
        </motion.section>

        <WoodFish />

        </main>

        {/* 底部动画 */}
        <motion.footer variants={itemVariants} className="mt-12 text-center text-gray-500 text-sm">
          <small>update:2025-12-28 • 刘碧坤   contact:804872510@qq.com</small>
        </motion.footer>
      </motion.div>
    </motion.div>
  );
}

export default Home;