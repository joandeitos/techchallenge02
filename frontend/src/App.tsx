import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PostList from './components/PostList';
import NewPost from './components/NewPost';
import EditPost from './components/EditPost';
import ViewPost from './components/ViewPost';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';
import Profile from './components/Profile';
import AdminRoute from './components/AdminRoute';
import { ThemeProvider } from './theme/ThemeContext';
import axios from 'axios';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import PostEditor from './pages/PostEditor';

const App: React.FC = () => {
  const token = localStorage.getItem('token');

  // Configuração global do axios
  axios.interceptors.request.use(
    (config) => {
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor para tratar erros de autenticação
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Header />
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rotas protegidas */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/posts/new"
              element={
                <PrivateRoute requiredRole="professor">
                  <PostEditor />
                </PrivateRoute>
              }
            />
            <Route
              path="/posts/edit/:id"
              element={
                <PrivateRoute requiredRole="professor">
                  <PostEditor />
                </PrivateRoute>
              }
            />
            <Route path="/post/:id" element={<ViewPost />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
