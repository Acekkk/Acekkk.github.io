import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // 核心：必须引入 AnimatePresence
import { Link } from 'react-router-dom';

// --- 特效组件：掉落雨 ---
const RainEffect = () => {
  const [drops, setDrops] = React.useState([]);

  React.useEffect(() => {
    // 【修改 1】：频率从 800 改为 300ms，掉落数量变多，画面更满
    const interval = setInterval(() => {
      const newDrop = {
        id: Date.now(),
        x: Math.random() * 100,
        char: ["+1", "功德", "✨", "0", "1", "Cyber", "Zen"][Math.floor(Math.random() * 7)],
        duration: 3 + Math.random() * 3, // 【修改 2】：稍微调快一点掉落速度 (3-6秒)
        size: 14 + Math.random() * 10,
      };
      setDrops((prev) => [...prev.slice(-30), newDrop]); // 【修改 3】：保留上限从 15 增加到 30
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <AnimatePresence>
        {drops.map((drop) => (
          <motion.div
            key={drop.id}
            initial={{ y: -50, opacity: 0 }}
            // 【修改 4】：opacity 从 0.5 提高到 0.9，让它非常清晰
            animate={{ y: "110vh", opacity: [0, 0.9, 0.9, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: drop.duration, ease: "linear" }}
            // 【修改 5】：颜色改为 text-white 或 text-teal-300，并去掉过淡的透明度类名
            className="absolute font-bold text-teal-300 whitespace-nowrap drop-shadow-[0_0_5px_rgba(20,184,166,0.8)]"
            style={{ left: `${drop.x}%`, fontSize: drop.size }}
          >
            {drop.char}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// --- 功能组件：电子木鱼 ---
const WoodFish = () => {
  const [count, setCount] = React.useState(0);
  const [popups, setPopups] = React.useState([]);

  const handleClick = () => {
    const nextCount = count + 1;
    setCount(nextCount);
    let popupText = "功德 +1";
    if (nextCount > 100) popupText = "功德圆满 🙏";
    else if (nextCount % 10 === 0) popupText = "烦恼消散 ✨";

    const newPopup = { id: Date.now(), text: popupText };
    setPopups(prev => [...prev, newPopup]);
    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== newPopup.id));
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md mt-10 relative overflow-hidden max-w-sm mx-auto mb-10 shadow-2xl">
      <div className="text-slate-500 text-[10px] mb-4 uppercase tracking-[0.3em] font-bold">Cyber Temple</div>
      <div className="text-4xl font-black text-white mb-8 tracking-tighter">
        功德数：<span className={count >= 100 ? "text-yellow-400" : "text-teal-400"}>{count}</span>
      </div>
      <div className="relative cursor-pointer select-none active:scale-95 transition-transform" onClick={handleClick}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 text-center pointer-events-none">
          <AnimatePresence>
            {popups.map(popup => (
              <motion.div
                key={popup.id}
                initial={{ opacity: 1, y: 0, scale: 0.5 }}
                animate={{ opacity: 0, y: -120, scale: 1.2 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                exit={{ opacity: 0 }}
                className={`font-bold absolute w-full left-0 ${popup.text === "功德 +1" ? "text-teal-300" : "text-yellow-300"}`}
              >
                {popup.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <motion.div
          whileTap={{ scale: 0.9, rotate: -3 }}
          className={`w-28 h-28 rounded-full flex items-center justify-center shadow-inner relative ${count >= 100 ? "bg-yellow-600/20" : "bg-slate-800"} border-b-8 border-black`}
        >
          <span className="text-5xl">{count >= 100 ? "🏮" : "🪵"}</span>
        </motion.div>
      </div>
    </div>
  );
};

// --- 页面主体 ---
function Home() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, y: 0,
      transition: { delayChildren: 0.2, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      className="relative min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 sm:p-8 overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* 掉落背景层 */}
      <RainEffect />

      {/* 装饰光晕 */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div
        className="container relative z-10 max-w-4xl w-full mx-auto p-6 sm:p-10 bg-slate-900/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.header variants={itemVariants} className="mb-12 text-center">
          <motion.img
            src="/Avatar.jpg"
            className="w-32 h-32 rounded-full border-4 border-teal-500/50 shadow-2xl mx-auto mb-6 object-cover"
            whileHover={{ scale: 1.1, rotate: 5 }}
          />
          <h1 className="text-4xl sm:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-sky-400 to-purple-500">
            你好！这里是刘碧坤
          </h1>
          <p className="text-slate-400 max-w-md mx-auto italic">
            探索技术边界，积攒赛博功德。
          </p>
        </motion.header>

        <main className="space-y-10">
          {/* 统一的渲染块函数，减少重复代码 */}
          {[
            { title: "个人介绍", link: "/projectintro/intro", items: ["一名对技术充满热情的探索者", "致力于通过技术解决实际问题", "乐于学习新知识，挑战未知"] },
            {
              title: "兴趣爱好", link: "/projectinterest/interest", items: ["游戏：死亡搁浅、大镖客、永劫无间、仙剑...", "户外：徒步和探索自然、闲逛、骑摩托、游泳...",
                "阅读：历史与科幻", "音乐：竹笛、陶笛爱好者，喜欢玩但都不太会"]
            },
            { title: "技术能力", link: "/projectwork/work", items: ["自动驾驶相关技术(算法、中间件、基础设施等)", "港口机械自动化 (算法、业务等)", "现代前端开发 (React, Tailwind)"] }
          ].map((sec, idx) => (
            <motion.section key={idx} variants={itemVariants}>
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-2xl font-bold text-white">{sec.title}</h2>
                <Link to={sec.link}>
                  <motion.div whileHover={{ scale: 1.05 }} className="px-3 py-1 rounded-full border border-teal-500/30 text-teal-400 text-xs backdrop-blur-sm">
                    查看详情 →
                  </motion.div>
                </Link>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-400 text-sm">
                  {sec.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500/50"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.section>
          ))}

          <WoodFish />
        </main>

        <motion.footer variants={itemVariants} className="mt-16 text-center text-slate-600 text-[10px] tracking-widest uppercase">
          © 2025-12-30 Liu Bikun  contact:804872510@qq.com
        </motion.footer>
      </motion.div>
    </motion.div>
  );
}

export default Home;