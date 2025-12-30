import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function ProjectDetailInterest() {
  // 导航项数据
  const navItems = [
    { name: '游戏', id: 'game' },
    { name: '户外', id: 'outdoor' },
    { name: '音乐', id: 'music' },
    { name: '其他', id: 'others' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* 1. 固定侧边导航栏 */}
      <motion.nav 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 h-screen sticky top-0 border-r border-slate-800 p-6 flex flex-col hidden md:flex"
      >
        <Link to="/" className="text-teal-400 hover:text-teal-300 mb-10 flex items-center gap-2">
          <span>←</span> 返回主页
        </Link>

        <div className="space-y-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">目录</p>
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    // 1. 找到对应的 DOM 元素
                    const element = document.getElementById(item.id);
                    // 2. 执行平滑滚动
                    if (element) {
                      element.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                      });
                    }
                  }}
                  className="text-slate-400 hover:text-teal-400 transition-colors block text-sm text-left w-full cursor-pointer"
                >
                  {item.name}
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
        className="flex-1 p-8 md:p-16 max-w-4xl"
      >
        {/* 移动端返回按钮 (仅在小屏幕显示) */}
        <Link to="/" className="md:hidden text-teal-400 mb-6 block">← 返回主页</Link>

        {/* 项目标题 */}
        <motion.header 
          id="overview" 
          className="mb-16 relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* 背景装饰：一个淡淡的渐变光晕，增加空间感 */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-teal-500/10 blur-[80px] rounded-full"></div>

          {/* 主标题 ABILITY */}
          {/* <h2 className="text-6xl md:text-7xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-sky-400 to-purple-500 animate-text-shimmer drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
            ABILITY
          </h2> */}
          <h2 className="text-6xl md:text-7xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-sky-400 to-purple-500 animate-text-shimmer drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
            INTEREST
          </h2>

          {/* 副标题 */}
          <motion.p 
            className="text-xl md:text-2xl text-slate-400 font-light tracking-[0.2em] uppercase"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
             <span className="text-teal-400 font-medium relative">
              Fall into some things
              {/* 文字下方的渐变线条 */}
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-teal-400 to-transparent"></span>
            </span>!
          </motion.p>
        </motion.header>

        {/* 项目图片 */}
        <section className="mb-16">
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <img 
              src="/interest.jpg" 
              alt="Project" 
              className="w-full h-auto object-cover"
            />
          </div>
        </section>

        {/* 游戏部分 */}
        <section id="game" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-red-500">游戏</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
              <h3 className="font-bold text-white mb-2">永劫无间</h3>
              <section className="mb-2">
                <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                  <img 
                    src="/yj.webp" 
                    alt="Project" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </section>
            </div>
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
              <h3 className="font-bold text-white mb-2">死亡搁浅</h3>
              <section className="mb-2">
                <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                  <img 
                    src="/ds.jpg" 
                    alt="Project" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </section>
            </div>
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
              <h3 className="font-bold text-white mb-2">荒野大镖客</h3>
              <section className="mb-2">
                <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                  <img 
                    src="/rd.jpg" 
                    alt="Project" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </section>
            </div>
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
              <h3 className="font-bold text-white mb-2">仙剑奇侠传</h3>
              <section className="mb-2">
                <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                  <img 
                    src="/xj.jpeg" 
                    alt="Project" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </section>
            </div>
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
              <h3 className="font-bold text-white mb-2">鬼泣</h3>
              <section className="mb-2">
                <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                  <img 
                    src="/dmc.webp" 
                    alt="Project" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </section>
            </div>
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
              <h3 className="font-bold text-white mb-2">wow</h3>
              <section className="mb-2">
                <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                  <img 
                    src="/wow.jpeg" 
                    alt="Project" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </section>
            </div>
          </div>
        </section>

        {/* 户外部分 */}
        <section id="outdoor" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-teal-400">户外</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
              <h3 className="font-bold text-white mb-2">徒步</h3>
              <section className="mb-2">
                <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                  <img 
                    src="/yj.webp" 
                    alt="Project" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </section>
            </div>
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
              <h3 className="font-bold text-white mb-2">自驾</h3>
              <section className="mb-2">
                <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                  <img 
                    src="/yj.webp" 
                    alt="Project" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </section>
            </div>
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
              <h3 className="font-bold text-white mb-2">滑雪</h3>
              <section className="mb-2">
                <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                  <img 
                    src="/yj.webp" 
                    alt="Project" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </section>
            </div>
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
              <h3 className="font-bold text-white mb-2">游泳</h3>
              <section className="mb-2">
                <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                  <img 
                    src="/yj.webp" 
                    alt="Project" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </section>
            </div>
          </div>
        </section>

        {/* 音乐 */}
        <section id="music" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-sky-400">音乐</h2>
          <ul className="list-disc list-inside space-y-4 text-slate-300">
            <li><span className="text-white font-semibold">响应式设计：</span> 完美适配手机、平板和桌面端。</li>
            <li><span className="text-white font-semibold">流体动画：</span> 所有的入场和交互均有微动效。</li>
            <li><span className="text-white font-semibold">自动化部署：</span> 每次 Push 都会通过 GitHub Actions 自动上线。</li>
          </ul>
        </section>

        {/* 底部占位，方便演示目录跳转 */}
        <section id="others" className="h-64">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">其他</h2>
          <p className="text-slate-300">在这个项目中，我深刻体会到了现代前端工具链带来的效率提升...</p>
        </section>
      </motion.main>
    </div>
  );
}

export default ProjectDetailInterest;