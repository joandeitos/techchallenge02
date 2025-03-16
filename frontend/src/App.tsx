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

  const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return token ? <>{children}</> : <Navigate to="/login" />;
  };

  const TeacherRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAllowed, setIsAllowed] = React.useState<boolean | null>(null);

    React.useEffect(() => {
      const checkPermission = async () => {
        try {
          const response = await axios.get<{ role: string }>('/api/auth/me');
          setIsAllowed(response.data.role === 'admin' || response.data.role === 'professor');
        } catch (error) {
          setIsAllowed(false);
        }
      };

      checkPermission();
    }, []);

    if (isAllowed === null) {
      return <div>Carregando...</div>;
    }

    return isAllowed ? <>{children}</> : <Navigate to="/" />;
  };

  return (
    <ThemeProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/create-post"
            element={
              <TeacherRoute>
                <NewPost />
              </TeacherRoute>
            }
          />
          <Route
            path="/edit-post/:id"
            element={
              <TeacherRoute>
                <EditPost />
              </TeacherRoute>
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
  );
};

export default App;
