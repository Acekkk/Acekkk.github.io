import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../i18n/translations';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

// 数据配置：个人生活轨迹/成长经历
const introData = [
  {
    id: 'child',
    title: '小破孩 (Childhood)',
    color: 'text-red-500',
    items: [
      {
        title: '无忧无虑',
        img: '/intro8.jpg',
        desc: '那是记忆中最纯粹的时光，世界很大，烦恼很小。每天的作业是最大的敌人，楼下的沙堆是最好的城堡。'
      },
      {
        title: '好奇心',
        img: '/intro7.jpg',
        desc: '对一切未知充满好奇，拆过收音机，抓过知了，每一次探索都是一次伟大的冒险。'
      }
    ]
  },
  {
    id: 'teenager',
    title: '初具战力 (Adolescence)',
    color: 'text-teal-400',
    items: [
      {
        title: '求学之路',
        img: '/intro3.jpg',
        desc: '书山有路勤为径。在知识的海洋里遨游，开始构建自己的世界观，虽然偶尔也会即使迷茫，但眼中总有光。'
      },
      {
        title: '初识代码',
        img: '/intro6.jpg',
        desc: 'Hello World! 当第一次在屏幕上打印出这行字时，仿佛拥有了改变世界的魔法钥匙。'
      }
    ]
  },
  {
    id: 'work',
    title: '社会牛马 (Career)',
    color: 'text-sky-400',
    items: [
      {
        title: '打工人的日常',
        img: '/intro4.jpg',
        desc: '早八晚五？不存在的。在代码的构建与重构中寻找价值，虽然自嘲牛马，但依然对技术保持热忱。'
      },
      {
        title: '技术沉淀',
        img: '/intro2.jpg',
        desc: '从 React 到自动驾驶算法，技能树不断点亮。解决问题的快感，是支撑每一个加班夜的动力。'
      }
    ]
  },
  {
    id: 'future',
    title: '老狗 (Future)',
    color: 'text-purple-400',
    items: [
      {
        title: '归于平淡',
        img: '/intro1.jpg',
        desc: '希望能有一个小院子，晒晒太阳，写写自己喜欢的代码，不为生计奔波，只为热爱而活。'
      },
      {
        title: '薪火相传',
        img: 'introx.jpg',
        desc: '将毕生所学整理成册，或许能给后来的探索者一点点光亮，这就足够了。'
      }
    ]
  }
];

// 复用与 Interest 页面一直的卡片组件风格
const IntroCard = ({ item }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-slate-900 rounded-xl border border-slate-800 p-4 h-full flex flex-col hover:border-slate-700 transition-colors"
  >
    <h3 className="font-bold text-white mb-3 text-lg">{item.title}</h3>
    <div className="rounded-lg overflow-hidden border border-slate-800 shadow-lg mb-4 bg-slate-950 aspect-video relative group">
      <img
        src={item.img}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
    {item.desc && (
      <p className="text-sm text-slate-400 leading-relaxed mt-auto">
        {item.desc}
      </p>
    )}
  </motion.div>
);

function ProjectDetailIntro() {
  const { language } = useLanguage();
  const t = useTranslation(language);

  return (
    <motion.div
      className="flex min-h-screen bg-slate-950 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 语言切换按钮 */}
      <LanguageSwitcher />

      {/* 1. 固定侧边导航栏 */}
      <motion.nav
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 h-screen sticky top-0 border-r border-slate-800 p-6 flex flex-col hidden md:flex"
      >
        <Link to="/" className="text-teal-400 hover:text-teal-300 mb-10 flex items-center gap-2 font-medium">
          <span>←</span> {t.backToHome}
        </Link>

        <div className="space-y-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2 border-l-2 border-slate-700">{t.detailPages.intro.nav}</p>
          <ul className="space-y-2">
            {introData.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => {
                    document.getElementById(section.id)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }}
                  className="text-slate-400 hover:text-teal-400 hover:bg-slate-900 px-3 py-2 rounded-lg transition-all block text-sm text-left w-full cursor-pointer"
                >
                  {section.title.split(' ')[0]} {/* 仅显示中文标题 */}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <p className="text-xs text-slate-500">© 2025 刘碧坤</p>
        </div>
      </motion.nav>

      {/* 2. 主内容区域 */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 p-6 md:p-16 max-w-5xl mx-auto"
      >
        {/* 移动端返回按钮 */}
        <Link to="/" className="md:hidden text-teal-400 mb-8 inline-flex items-center gap-2 border border-slate-800 px-4 py-2 rounded-full text-sm bg-slate-900/50">
          ← 返回主页
        </Link>

        {/* 页面头部 */}
        <motion.header
          id="overview"
          className="mb-20 relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-teal-500/10 blur-[80px] rounded-full"></div>

          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-sky-400 to-purple-500 animate-text-shimmer">
            {t.detailPages.intro.title}
          </h2>

          <motion.p
            className="text-lg md:text-2xl text-slate-400 font-light tracking-[0.2em] uppercase"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-teal-400 font-medium relative inline-block">
              {t.detailPages.intro.subtitle}
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-teal-400 to-transparent"></span>
            </span>
          </motion.p>
        </motion.header>

        {/* 顶部主图 */}
        <section className="mb-20">
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10 pointer-events-none"></div>
            <img
              src="/intro.jpg"
              alt="Introduction Cover"
              className="w-full h-[300px] md:h-[400px] object-cover"
            />
            <div className="absolute bottom-6 left-6 right-6 z-20">
              <p className="text-slate-300 max-w-2xl text-sm md:text-base italic">
                “                {t.detailPages.intro.quote}”
              </p>
            </div>
          </div>
        </section>

        {/* 循环渲染各个板块 */}
        {introData.map((section, idx) => (
          <section key={section.id} id={section.id} className="mb-20 scroll-mt-10">
            <div className="flex items-center gap-4 mb-8">
              <h2 className={`text-3xl font-bold ${section.color}`}>{section.title}</h2>
              <div className="h-[1px] bg-slate-800 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {section.items.map((item, i) => (
                <IntroCard key={i} item={item} />
              ))}
            </div>
          </section>
        ))}

        <div className="h-32 text-center text-slate-600 flex items-center justify-center text-sm">
          {t.detailPages.intro.footer}
        </div>

      </motion.main>
    </motion.div>
  );
}

export default ProjectDetailIntro;