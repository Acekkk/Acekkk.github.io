import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// 数据配置：工作技能/技术栈
const workData = [
  {
    id: 'autonomous-driving',
    title: '自动驾驶技术',
    color: 'text-teal-400',
    items: [
      {
        title: '环境感知 (Perception)',
        img: '/carpercep.jpeg',
        desc: '深入研究单模态以及多传感器融合算法，利用激光雷达、摄像头和毫米波雷达构建车辆周围的高精度环境模型。'
      },
      {
        title: '规划控制 (PNC)',
        img: '/pnc.jpg',
        desc: '设计路径规划与轨迹跟踪算法，确保车辆在复杂交通场景下的安全、高效和舒适行驶。'
      },
      {
        title: '中间件技术 (Middleware)',
        img: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80',
        desc: '熟练掌握 ROS/ROS2 及 CyberRT 等通信中间件，优化节点间的高吞吐量、低延迟数据传输。'
      },
      {
        title: '基础设施 (Infrastructure)',
        img: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?auto=format&fit=crop&q=80',
        desc: '构建仿真测试平台与数据闭环系统，实现 CI/CD 自动化部署，提升研发迭代效率。'
      }
    ]
  },
  {
    id: 'port-automation',
    title: '港口机械自动化',
    color: 'text-blue-400',
    items: [
      {
        title: '系统标定 (Calibration)',
        img: '/calib.png',
        desc: '负责复杂的港口机械多传感器联合标定，确保感知系统在作业场景下的空间一致性。'
      },
      {
        title: '作业感知 (Sensing)',
        img: '/ship.jpg',
        desc: '针对船舱检测、物料检测识别、集装箱识别、防撞检测等特定业务场景，开发高鲁棒性的视觉检测算法。'
      },
      {
        title: '规控算法 (Control)',
        img: '/shipwork.jpg',
        desc: '装船机、卸船机、门机等大型机械规划控制、实现 AGV 路径调度与龙门吊吊具的精准控制，大幅提升港口自动化作业效率。'
      },
      {
        title: '业务逻辑 (Business)',
        img: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&q=80',
        desc: '对接 TOS (码头操作系统)，深入理解并优化自动化装卸流程，解决实际运营痛点。'
      }
    ]
  },
  {
    id: 'frontend',
    title: '现代前端开发',
    color: 'text-purple-400',
    items: [
      {
        title: 'React 生态',
        img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80',
        desc: '精通 React 18+，熟练使用 Hooks、Context API 进行组件化开发与状态管理，构建高性能 SPA。'
      },
      {
        title: 'Tailwind CSS',
        img: 'https://images.unsplash.com/photo-1581276879432-15e50529f34b?auto=format&fit=crop&q=80',
        desc: '拥抱 Utility-First 理念，利用 Tailwind 快速构建现代化、响应式且美观的用户界面。'
      }
    ]
  }
];

// 复用卡片组件
const WorkCard = ({ item }) => (
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

function ProjectDetailMywork() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
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
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2 border-l-2 border-slate-700">技能树</p>
          <ul className="space-y-2">
            {workData.map((section) => (
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
            ABILITY
          </h2>

          <motion.p
            className="text-lg md:text-2xl text-slate-400 font-light tracking-[0.2em] uppercase"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-teal-400 font-medium relative inline-block">
              Change some things
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-teal-400 to-transparent"></span>
            </span>
          </motion.p>
        </motion.header>

        {/* 顶部主图 */}
        <section className="mb-20">
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10 pointer-events-none"></div>
            <img
              src="/work.jpg"
              alt="Work Cover"
              className="w-full h-[300px] md:h-[400px] object-cover"
            />
            <div className="absolute bottom-6 left-6 right-6 z-20">
              <p className="text-slate-300 max-w-2xl text-sm md:text-base italic">
                “技术是改变世界的支点，而每一行代码都是杠杆的一部分。”
              </p>
            </div>
          </div>
        </section>

        {/* 循环渲染各个板块 */}
        {workData.map((section, idx) => (
          <section key={section.id} id={section.id} className="mb-20 scroll-mt-10">
            <div className="flex items-center gap-4 mb-8">
              <h2 className={`text-3xl font-bold ${section.color}`}>{section.title}</h2>
              <div className="h-[1px] bg-slate-800 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {section.items.map((item, i) => (
                <WorkCard key={i} item={item} />
              ))}
            </div>
          </section>
        ))}

        <div className="h-32 text-center text-slate-600 flex items-center justify-center text-sm">
          Keep coding, keep learning.
        </div>

      </motion.main>
    </div>
  );
}

export default ProjectDetailMywork;
