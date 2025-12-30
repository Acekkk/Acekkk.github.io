import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProjectDetailMywork from './pages/ProjectDetailMywork';

function App() {
  return (
    // 使用 HashRouter 对 GitHub Pages 兼容性最好，避免刷新 404
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetailMywork />} />
      </Routes>
    </Router>
  );
}
export default App;