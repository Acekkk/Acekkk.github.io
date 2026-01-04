import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import ProjectDetailMywork from './pages/ProjectDetailMywork';
import ProjectDetailIntro from './pages/ProjectDetailIntro';
import ProjectDetailInterest from './pages/ProjectDetailInterest';
import GuestBook from './pages/GuestBook';

// 路由动画包装器
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/projectwork/:id" element={<ProjectDetailMywork />} />
        <Route path="/projectintro/:id" element={<ProjectDetailIntro />} />
        <Route path="/projectinterest/:id" element={<ProjectDetailInterest />} />
        <Route path="/guestbook" element={<GuestBook />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}


export default App;