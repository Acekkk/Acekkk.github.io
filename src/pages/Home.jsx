import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../i18n/translations';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import CryptoPrices from '../components/CryptoPrices';

// --- 电子木鱼组件 ---
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
    <motion.div
      className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
      whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)" }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center">
        <div className="text-gray-400 text-[10px] mb-4 uppercase tracking-[0.3em] font-semibold">
          {t.cyberTemple}
        </div>
        <div className="text-2xl font-medium text-gray-400 mb-8">
          {t.meritCount}：<span className={count >= 100 ? "text-teal-500 font-bold" : "text-teal-400 font-bold"}>{count}</span>
        </div>
        <div className="relative cursor-pointer select-none" onClick={handleClick}>
          {/* 文字特效容器 - z-20确保在功德数文字之上 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 text-center pointer-events-none z-20" style={{ height: '150px' }}>
            <AnimatePresence>
              {popups.map(popup => (
                <motion.div
                  key={popup.id}
                  initial={{ opacity: 0, y: 0, scale: 0.5 }}
                  animate={{
                    opacity: [0, 1, 0.8, 0],  // 淡入后逐渐淡出
                    y: -120,
                    scale: 1.2
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    ease: "easeOut",
                    opacity: {
                      times: [0, 0.2, 0.6, 1],  // 控制淡化时间点
                      duration: 1.5
                    }
                  }}
                  className={`font-bold absolute w-full left-0 text-xl ${popup.text.includes('圆满') || popup.text.includes('Perfect')
                    ? 'text-teal-600'
                    : popup.text.includes('消散') || popup.text.includes('Gone')
                      ? 'text-purple-500'
                      : 'text-teal-500'
                    } drop-shadow-lg`}
                  style={{ top: 0, textShadow: '0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.7)' }}
                >
                  {popup.text}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <motion.div
            whileTap={{ scale: 0.9, rotate: -3 }}
            className={`w-28 h-28 rounded-full flex items-center justify-center shadow-lg ${count >= 100 ? "bg-teal-50" : "bg-gray-50"
              } border-4 border-gray-100`}
          >
            <span className="text-5xl">{count >= 100 ? "🏮" : "🪵"}</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

function Home() {
  const { language } = useLanguage();
  const t = useTranslation(language);

  // 页面级别动画配置
  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.98
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1], // easeOutQuint
        staggerChildren: 0.06,
        when: "beforeChildren"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const itemVariants = {
    initial: {
      y: 30,
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 16,
        mass: 0.9
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50 relative"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* 背景装饰 */}
      <div className="fixed top-20 right-20 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      <div className="fixed bottom-20 left-20 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

      {/* 语言切换器 */}
      <LanguageSwitcher />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* 头部区域 */}
        <motion.header
          variants={itemVariants}
          className="max-w-4xl mx-auto mb-16 text-center"
        >
          <motion.div
            className="relative inline-block mb-8"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-teal-400 rounded-full blur-xl opacity-20"></div>
            <img
              src="/Avatar.jpg"
              className="relative w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
              alt="Avatar"
            />
          </motion.div>

          <h1 className="text-5xl sm:text-6xl font-black mb-6 text-gray-900 tracking-tight">
            {t.greeting}
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            {t.tagline}
          </p>
        </motion.header>

        {/* 主要内容区域 */}
        <main className="max-w-6xl mx-auto space-y-8">
          {/* 信息卡片 */}
          {[
            {
              title: t.introduction,
              link: "/projectintro/intro",
              items: t.introItems,
              icon: "👋",
              color: "teal"
            },
            {
              title: t.interests,
              link: "/projectinterest/interest",
              items: t.interestItems,
              icon: "💡",
              color: "blue"
            },
            {
              title: t.skills,
              link: "/projectwork/work",
              items: t.skillItems,
              icon: "🚀",
              color: "purple"
            }
          ].map((sec, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-${sec.color}-400 to-${sec.color}-600 flex items-center justify-center text-2xl shadow-lg`}>
                    {sec.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{sec.title}</h2>
                </div>
                <Link to={sec.link}>
                  <motion.button
                    className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-full font-medium text-sm shadow-sm transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t.viewDetails} →
                  </motion.button>
                </Link>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sec.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* 留言板入口 */}
          <motion.div variants={itemVariants}>
            <Link to="/guestbook">
              <motion.div
                className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl">
                      📝
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">留言板</h3>
                      <p className="text-teal-100">留下您的足迹，分享您的想法</p>
                    </div>
                  </div>
                  <div className="text-3xl group-hover:translate-x-2 transition-transform">
                    →
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* 博客入口 */}
          <motion.div variants={itemVariants}>
            <Link to="/blog">
              <motion.div
                className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl">
                      📚
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">我的文字</h3>
                      <p className="text-blue-100">探索我的文字世界</p>
                    </div>
                  </div>
                  <div className="text-3xl group-hover:translate-x-2 transition-transform">
                    →
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* 加密货币价格 */}
          <motion.div variants={itemVariants}>
            <CryptoPrices />
          </motion.div>

          {/* 电子木鱼 */}
          <motion.div variants={itemVariants}>
            <WoodFish />
          </motion.div>
        </main>

        {/* 页脚 */}
        <motion.footer
          variants={itemVariants}
          className="mt-20 text-center text-gray-400 text-xs"
        >
          <div className="flex items-center justify-center gap-3">
            <span>© 2026-01-04 Liu Bikun  contact:804872510@qq.com</span>
            <Link
              to="/login"
              className="inline-block opacity-40 hover:opacity-100 transition-opacity"
              title="Admin"
            >
              <span className="text-[10px]">🔐</span>
            </Link>
          </div>
        </motion.footer>
      </div>
    </motion.div>
  );
}

export default Home;