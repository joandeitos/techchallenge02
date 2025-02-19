import React from 'react';
import { SafeHTML } from '../SafeHTML/SafeHTML';
import styles from './PostReader.module.css';
import { Post } from '../../types';

interface PostReaderProps {
  post: Post;
  onBack: () => void;
}

export const PostReader: React.FC<PostReaderProps> = ({ post, onBack }) => {
  console.log(post);
  return (
    <div className={styles.container}>
      <button onClick={onBack} className={styles.backButton}>
        ← Voltar para a lista
      </button>
      
      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.meta}>
            <span className={styles.author}>Por {post.author.name}</span>
            <time className={styles.date}>
              {new Date(post.createdAt).toLocaleDateString()}
            </time>
          </div>
        </header>
        
        <div className={styles.content}>
          <SafeHTML content={post.content} />
        </div>
      </article>
    </div>
  );
};
