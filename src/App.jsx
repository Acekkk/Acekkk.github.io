import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Home from './pages/Home';
import ProjectDetailMywork from './pages/ProjectDetailMywork';
import ProjectDetailIntro from './pages/ProjectDetailIntro';
import ProjectDetailInterest from './pages/ProjectDetailInterest';

function App() {
  return (
    // 使用 HashRouter 对 GitHub Pages 兼容性最好，避免刷新 404
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projectwork/:id" element={<ProjectDetailMywork />} />
        <Route path="/projectintro/:id" element={<ProjectDetailIntro />} />
        <Route path="/projectinterest/:id" element={<ProjectDetailInterest />} />
      </Routes>
      {/* <WoodFish /> */}
    </Router>
  );
}


export default App;