// src/components/PostForm/PostForm.tsx
import React, { useState, useEffect } from 'react';
import { Post, PostFormData, User } from '../../types';
import { userService } from '../../services/userService';
import styles from './PostForm.module.css';

interface PostFormProps {
  post?: Post;
  onSubmit: (data: PostFormData) => Promise<void>;
  onCancel: () => void;
}

export const PostForm: React.FC<PostFormProps> = ({ post, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<PostFormData>({
    title: post?.title || '',
    content: post?.content || '',
    author: post?.author._id || ''
  });

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      const response = await userService.getUsers();
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setUsers(response.data);
      }
      setLoading(false);
    };

    loadUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.author) {
      setError('Por favor, selecione um autor');
      return;
    }
    await onSubmit(formData);
  };

  if (loading) return <div>Carregando professores...</div>;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Título"
        className={styles.input}
        required
      />
      
      <textarea
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        placeholder="Conteúdo"
        className={styles.textarea}
        required
      />

      <select
        value={formData.author}
        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
        className={styles.select}
        required
      >
        <option value="">Selecione um professor</option>
        {users.map(user => (
          <option key={user._id} value={user._id}>
            {user.name} - {user.discipline}
          </option>
        ))}
      </select>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.buttonGroup}>
        <button type="submit" className={`${styles.button} ${styles.primary}`}>
          {post ? 'Atualizar' : 'Criar'}
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          className={`${styles.button} ${styles.secondary}`}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};