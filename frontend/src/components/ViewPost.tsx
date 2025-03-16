import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  styled,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DOMPurify from 'dompurify';
import axios from 'axios';

const PostContent = styled('div')`
  margin-top: 24px;
  color: rgba(0, 0, 0, 0.7);
  line-height: 1.6;

  h3, h4 {
    color: rgba(0, 0, 0, 0.87);
    margin-top: 24px;
    margin-bottom: 16px;
  }

  p {
    margin-bottom: 16px;
  }

  ul, ol {
    margin-bottom: 16px;
    padding-left: 24px;
  }

  li {
    margin-bottom: 8px;
  }

  blockquote {
    margin: 16px 0;
    padding: 8px 24px;
    border-left: 4px solid #1976d2;
    background-color: rgba(25, 118, 210, 0.05);
    font-style: italic;
  }

  pre {
    background-color: #f5f5f5;
    padding: 16px;
    border-radius: 4px;
    overflow-x: auto;
    margin: 16px 0;
  }

  code {
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 0.9em;
  }

  img {
    max-width: 100%;
    height: auto;
    margin: 16px 0;
  }

  a {
    color: #1976d2;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

interface Author {
  _id: string;
  name: string;
  email: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  author: Author;
  createdAt: string;
}

const ViewPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get<Post>(`/api/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error('Erro ao carregar post:', error);
        setError('Erro ao carregar o post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleEdit = () => {
    navigate(`/edit-post/${id}`);
  };

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography color="error">{error || 'Post não encontrado'}</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Voltar
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mb: 2 }}
          >
            Voltar
          </Button>
          <Typography variant="h4" component="h1" gutterBottom>
            {post.title}
          </Typography>
          <Typography color="text.secondary">
            Por {post.author.name || post.author.email} em{' '}
            {new Date(post.createdAt).toLocaleDateString('pt-BR')}
          </Typography>
        </Box>

        <PostContent
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.content),
          }}
        />

        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Editar Post
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ViewPost; 