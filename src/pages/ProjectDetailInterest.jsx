import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// 数据配置：只要在这里修改，页面就会自动更新
const interestData = [
  {
    id: 'game',
    title: '游戏',
    color: 'text-red-500',
    items: [
      {
        title: '永劫无间',
        img: '/yj.webp',
        desc: '在聚窟洲中博弈，体验冷兵器格斗的魅力，振刀时刻的快感无与伦比。'
      },
      {
        title: '死亡搁浅',
        img: '/ds.jpg',
        desc: '连接断裂的世界。送快递不仅仅是任务，更是一场关于孤独、连接与希望的修行。'
      },
      {
        title: '荒野大镖客2',
        img: '/rd.jpg',
        desc: '沉浸于西部世界的余晖，体验亚瑟·摩根传奇而又悲情的一生。'
      },
      {
        title: '仙剑奇侠传',
        img: '/xj.jpeg',
        desc: '仗剑江湖，儿女情长。承载着无数回忆的经典国产 RPG。'
      },
      {
        title: '鬼泣5',
        img: '/dmc.webp',
        desc: '不仅是战斗，更是华丽的表演。追求 SSSS 级评价的极限操作。'
      },
      {
        title: '魔兽世界',
        img: '/wow.jpeg',
        desc: '为了艾泽拉斯！在宏大的奇幻世界中探索、战斗与社交。'
      }
    ]
  },
  {
    id: 'outdoor',
    title: '户外',
    color: 'text-teal-400',
    items: [
      {
        title: '徒步 & 探索自然',
        img: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80',
        desc: '远离城市喧嚣，用双脚丈量大地，感受森林与山川的呼吸。'
      },
      {
        title: '自驾 & 骑行',
        img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80',
        desc: '风是自由的。骑上摩托，穿梭在城市与旷野之间，享受路途本身。'
      },
      {
        title: '滑雪',
        img: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&q=80',
        desc: '在银装素裹的世界中飞驰，掌控平衡，享受速度带来的肾上腺素。'
      },
      {
        title: '游泳',
        img: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80',
        desc: '像鱼一样自由。在水中舒展身体，释放所有的重力与压力。'
      }
    ]
  },
  {
    id: 'reading',
    title: '阅读',
    color: 'text-amber-400',
    items: [
      {
        title: '历史',
        img: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80',
        desc: '以史为鉴。在字里行间探寻人类文明的兴衰演变与规律。'
      },
      {
        title: '科幻',
        img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
        desc: '仰望星空。沉浸在《三体》、《沙丘》等宏大叙事中，畅想技术与伦理的未来。'
      }
    ]
  },
  {
    id: 'music',
    title: '音乐',
    color: 'text-purple-400',
    items: [
      {
        title: '竹笛',
        img: '/zd.jpg',
        desc: '虽然技艺不精，但喜爱那份悠扬婉转，感受传统乐器的清雅之音。'
      },
      {
        title: '陶笛',
        img: '/td.png',
        desc: '古朴深沉，小巧随身。在闲暇时刻吹奏一曲，自娱自乐。'
      }
    ]
  }
];

// 提取的子组件：单个展示卡片
const InterestCard = ({ item }) => (
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
      {/* 遮罩，增加质感 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
    {item.desc && (
      <p className="text-sm text-slate-400 leading-relaxed mt-auto">
        {item.desc}
      </p>
    )}
  </motion.div>
);

function ProjectDetailInterest() {
  return (
    <motion.div
      className="flex min-h-screen bg-slate-950 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 1. 固定侧边导航栏 */}
      <motion.nav
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 h-screen sticky top-0 border-r border-slate-800 p-6 flex flex-col hidden md:flex"
      >
        <Link to="/" className="text-teal-400 hover:text-teal-300 mb-10 flex items-center gap-2 font-medium">
          <span>←</span> 返回主页
        </Link>

        <div className="space-y-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2 border-l-2 border-slate-700">目录</p>
          <ul className="space-y-2">
            {interestData.map((section) => (
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
                  {section.title}
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
            INTEREST
          </h2>

          <motion.p
            className="text-lg md:text-2xl text-slate-400 font-light tracking-[0.2em] uppercase"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-teal-400 font-medium relative inline-block">
              Fall into some things
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-teal-400 to-transparent"></span>
            </span>
          </motion.p>
        </motion.header>

        {/* 顶部主图 */}
        <section className="mb-20">
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10 pointer-events-none"></div>
            <img
              src="/interest.jpg"
              alt="Interest Cover"
              className="w-full h-[300px] md:h-[400px] object-cover"
            />
            <div className="absolute bottom-6 left-6 right-6 z-20">
              <p className="text-slate-300 max-w-2xl text-sm md:text-base italic">
                “我们所热爱的不仅仅是事物本身，更是它们让我们感受到的那个世界。”
              </p>
            </div>
          </div>
        </section>

        {/* 循环渲染各个板块 */}
        {interestData.map((section, idx) => (
          <section key={section.id} id={section.id} className="mb-20 scroll-mt-10">
            <div className="flex items-center gap-4 mb-8">
              <h2 className={`text-3xl font-bold ${section.color}`}>{section.title}</h2>
              <div className="h-[1px] bg-slate-800 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {section.items.map((item, i) => (
                <InterestCard key={i} item={item} />
              ))}
            </div>
          </section>
        ))}

        <div className="h-32 text-center text-slate-600 flex items-center justify-center text-sm">
          Life needs passions to keep going.
        </div>

      </motion.main>
    </motion.div>
  );
}

export default ProjectDetailInterest;
