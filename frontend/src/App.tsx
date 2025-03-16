import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './components/Login';
import ViewPost from './pages/ViewPost';
import PostEditor from './pages/PostEditor';
import AdminPanel from './components/AdminPanel';
import AdminRoute from './components/AdminRoute';
import { PrivateRoute } from './components/PrivateRoute';
import Profile from './components/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/post/:id" element={<ViewPost />} />
          <Route
            path="/post/new"
            element={
              <PrivateRoute requiredRole="professor">
                <PostEditor />
              </PrivateRoute>
            }
          />
          <Route
            path="/post/:id/edit"
            element={
              <PrivateRoute requiredRole="professor">
                <PostEditor />
              </PrivateRoute>
            }
          />
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
    </AuthProvider>
  );
}

export default App;
