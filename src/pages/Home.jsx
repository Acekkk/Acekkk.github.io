import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // 核心：必须引入 AnimatePresence
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../i18n/translations';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import CryptoPrices from '../components/CryptoPrices';

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
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [count, setCount] = React.useState(0);
  const [popups, setPopups] = React.useState([]);

  const handleClick = () => {
    const nextCount = count + 1;
    setCount(nextCount);
    let popupText = language === 'zh' ? "功德 +1" : "Merit +1";
    if (nextCount > 100) popupText = language === 'zh' ? "功德圆满 🙏" : "Perfect Merit 🙏";
    else if (nextCount % 10 === 0) popupText = language === 'zh' ? "烦恼消散 ✨" : "Worries Gone ✨";

    const newPopup = { id: Date.now(), text: popupText };
    setPopups(prev => [...prev, newPopup]);
    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== newPopup.id));
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md mt-10 relative overflow-hidden max-w-sm mx-auto mb-10 shadow-2xl">
      <div className="text-slate-500 text-[10px] mb-4 uppercase tracking-[0.3em] font-bold">{t.cyberTemple}</div>
      <div className="text-4xl font-black text-white mb-8 tracking-tighter">
        {t.meritCount}：<span className={count >= 100 ? "text-yellow-400" : "text-teal-400"}>{count}</span>
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
  const { language } = useLanguage();
  const t = useTranslation(language);

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
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 掉落背景层 */}
      <RainEffect />

      {/* 语言切换按钮 */}
      <LanguageSwitcher />

      {/* 多层渐变光晕 - 创建更丰富的背景氛围 */}
      <div className="fixed top-1/4 right-1/4 w-[600px] h-[600px] bg-teal-500/10 blur-[150px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-sky-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <motion.div
        className="container relative z-10 max-w-4xl w-full mx-auto p-6 sm:p-10 glass-effect rounded-3xl shadow-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.header variants={itemVariants} className="mb-12 text-center">
          <div className="relative inline-block mb-6">
            {/* 头像发光效果 */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 blur-xl opacity-50 animate-pulse"></div>
            <motion.img
              src="/Avatar.jpg"
              className="relative w-32 h-32 rounded-full border-4 border-transparent bg-gradient-to-br from-teal-400 via-sky-400 to-purple-500 p-1 shadow-2xl object-cover"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 text-gradient animate-text-shimmer">
            {t.greeting}
          </h1>
          <p className="text-slate-400 max-w-md mx-auto italic text-lg">
            {t.tagline}
          </p>
        </motion.header>

        <main className="space-y-10">
          {/* 统一的渲染块函数，减少重复代码 */}
          {[
            { title: t.introduction, link: "/projectintro/intro", items: t.introItems },
            { title: t.interests, link: "/projectinterest/interest", items: t.interestItems },
            { title: t.skills, link: "/projectwork/work", items: t.skillItems }
          ].map((sec, idx) => (
            <motion.section key={idx} variants={itemVariants}>
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-2xl font-bold text-white">{sec.title}</h2>
                <Link to={sec.link}>
                  <motion.div whileHover={{ scale: 1.05 }} className="px-3 py-1 rounded-full border border-teal-500/30 text-teal-400 text-xs backdrop-blur-sm">
                    {t.viewDetails} →
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

          {/* 留言板入口 */}
          <motion.section variants={itemVariants}>
            <Link to="/guestbook">
              <motion.div
                whileHover={{ scale: 1.02, borderColor: 'rgba(20, 184, 166, 0.5)' }}
                whileTap={{ scale: 0.98 }}
                className="p-6 rounded-2xl bg-gradient-to-r from-teal-500/10 to-purple-500/10 border border-white/10 hover:border-teal-500/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-3xl shadow-lg shadow-teal-500/20">
                      📝
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-teal-400 transition-colors">
                        留言板
                      </h3>
                      <p className="text-slate-400 text-sm">
                        留下您的足迹，分享您的想法
                      </p>
                    </div>
                  </div>
                  <div className="text-teal-400 text-2xl group-hover:translate-x-2 transition-transform">
                    →
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.section>

          {/* 博客入口 */}
          <motion.section variants={itemVariants}>
            <Link to="/blog">
              <motion.div
                whileHover={{ scale: 1.02, borderColor: 'rgba(96, 165, 250, 0.5)' }}
                whileTap={{ scale: 0.98 }}
                className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-sky-500/10 border border-white/10 hover:border-blue-500/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-sky-500 flex items-center justify-center text-3xl shadow-lg shadow-blue-500/20">
                      📚
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                        我的文字
                      </h3>
                      <p className="text-slate-400 text-sm">
                        探索我的文字世界
                      </p>
                    </div>
                  </div>
                  <div className="text-blue-400 text-2xl group-hover:translate-x-2 transition-transform">
                    →
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.section>

          {/* 加密货币价格展示 */}
          <CryptoPrices />

          <WoodFish />
        </main>

        <motion.footer variants={itemVariants} className="mt-16 text-center text-slate-600 text-[10px] tracking-widest uppercase">
          <div className="flex items-center justify-center gap-2">
            <span>© 2026-01-04 Liu Bikun  contact:804872510@qq.com</span>
            <Link
              to="/login"
              className="inline-block opacity-30 hover:opacity-100 transition-opacity duration-300"
              title="Admin"
            >
              <span className="text-[8px]">🔐</span>
            </Link>
          </div>
        </motion.footer>
      </motion.div>
    </motion.div>
  );
}

export default Home;