// src/components/SafeHTML/SafeHTML.tsx
import React from 'react';
import DOMPurify from 'dompurify';
import styles from './SafeHTML.module.css';

interface SafeHTMLProps {
  content: string;
  className?: string;
}

export const SafeHTML: React.FC<SafeHTMLProps> = ({ content, className }) => {
  // Sanitizamos o HTML para remover scripts maliciosos e tags perigosas
  const sanitizedContent = DOMPurify.sanitize(content, {
    // Configuramos quais tags HTML são permitidas
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre'
    ],
    // Permitimos apenas atributos seguros
    ALLOWED_ATTR: ['href', 'target', 'class']
  });

  return (
    <div 
      className={`${styles.content} ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};