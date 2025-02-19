// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Post, PostFormData } from './types';
import { postService } from './services/postService';
import { PostForm } from './components/PostForm/PostForm';
import { PostList } from './components/PostList/PostList';
import { PostReader } from './components/PostReader/PostReader';
import styles from './App.module.css';

const App: React.FC = () => {
  // Estados para gerenciamento de posts
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const loadPosts = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await postService.getPosts(page);

      if (response.error) {
        setError(response.error);
        setPosts([]);
        return;
      }

      if (response.data) {
        setPosts(response.data.posts);
        setTotalPages(response.data.totalPages);
        setError(null);
      }
    } catch (error) {
      setError('Erro ao carregar posts. Por favor, tente novamente.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadPosts(1);
      return;
    }

    try {
      setLoading(true);
      const response = await postService.searchPosts(searchTerm);

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setPosts(response.data);
      }
    } catch (error) {
      setError('Erro na busca. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: PostFormData) => {
    try {
      const response = editingPost
        ? await postService.updatePost(editingPost._id, formData)
        : await postService.createPost(formData);

      if (response.error) {
        setError(response.error);
        return;
      }

      setShowForm(false);
      setEditingPost(null);
      loadPosts(currentPage);
    } catch (error) {
      setError('Erro ao salvar post. Tente novamente.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este post?')) {
      return;
    }

    try {
      const response = await postService.deletePost(id);
      if (response.error) {
        setError(response.error);
        return;
      }

      loadPosts(currentPage);
    } catch (error) {
      setError('Erro ao excluir post. Tente novamente.');
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      loadPosts(currentPage);
    }
  }, [currentPage, searchTerm]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        {selectedPost ? (
          <PostReader 
            post={selectedPost} 
            onBack={() => setSelectedPost(null)}
          />
        ) : (
          <>
            <header className={styles.header}>
              <h1 className={styles.title}>Blog dos Professores</h1>
              <div className={styles.headerActions}>
                <button
                  onClick={() => setShowForm(true)}
                  className={styles.newPostButton}
                >
                  Novo Post
                </button>
              </div>
            </header>

            <div className={styles.searchBar}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar posts..."
                className={styles.searchInput}
              />
              <button 
                onClick={handleSearch}
                className={styles.searchButton}
              >
                Buscar
              </button>
            </div>

            {error && (
              <div className={styles.error}>
                {error}
                <button 
                  onClick={() => loadPosts(currentPage)}
                  className={styles.retryButton}
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {showForm && (
              <PostForm
                post={editingPost || undefined}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingPost(null);
                }}
              />
            )}

            {loading ? (
              <div className={styles.loading}>Carregando...</div>
            ) : (
              <>
                <PostList
                  posts={posts}
                  onEdit={(post) => {
                    setEditingPost(post);
                    setShowForm(true);
                  }}
                  onDelete={handleDelete}
                  onPostClick={setSelectedPost}
                />

                {!searchTerm && (
                  <div className={styles.pagination}>
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={styles.paginationButton}
                    >
                      Anterior
                    </button>
                    <span className={styles.pageInfo}>
                      Página {currentPage} de {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className={styles.paginationButton}
                    >
                      Próxima
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;