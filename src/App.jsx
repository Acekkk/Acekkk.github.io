import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import ProjectDetailMywork from './pages/ProjectDetailMywork';
import ProjectDetailIntro from './pages/ProjectDetailIntro';
import ProjectDetailInterest from './pages/ProjectDetailInterest';
import GuestBook from './pages/GuestBook';
import Login from './pages/Login';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import Dashboard from './pages/admin/Dashboard';
import ProtectedRoute from './pages/admin/ProtectedRoute';
import PostEditor from './pages/admin/PostEditor';

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

        {/* 博客路由 */}
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />

        {/* 登录 */}
        <Route path="/login" element={<Login />} />

        {/* 管理后台 */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/new-post" element={
          <ProtectedRoute>
            <PostEditor />
          </ProtectedRoute>
        } />
        <Route path="/admin/edit-post/:id" element={
          <ProtectedRoute>
            <PostEditor />
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <AnimatedRoutes />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}


export default App;