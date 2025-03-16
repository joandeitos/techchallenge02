import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CardActions,
  TextField,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import DOMPurify from 'dompurify';
import axios from 'axios';

const StyledCard = styled(Card)`
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  width: 100%;
  margin-bottom: 16px;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const StyledCardContent = styled(CardContent)`
  flex-grow: 1;
`;

const PostContent = styled.div`
  margin-top: 16px;
  color: rgba(0, 0, 0, 0.7);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-height: 1.5;

  img {
    max-width: 100%;
    height: auto;
  }

  a {
    color: ${props => props.theme.palette?.primary?.main || '#1976d2'};
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

type SortOrder = 'desc' | 'asc';

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchPosts = async (query?: string) => {
    try {
      const url = query ? `/api/posts/search?q=${encodeURIComponent(query)}` : '/api/posts';
      const response = await axios.get<Post[]>(url);
      const sortedPosts = sortPosts(response.data, sortOrder);
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    }
  };

  const sortPosts = (postsToSort: Post[], order: SortOrder) => {
    return [...postsToSort].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return order === 'desc' ? dateB - dateA : dateA - dateB;
    });
  };

  const handleToggleSort = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    setPosts(sortPosts(posts, newOrder));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEdit = (postId: string) => {
    navigate(`/edit-post/${postId}`);
  };

  const handleViewPost = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value.length >= 3) {
      fetchPosts(value);
    } else if (value.length === 0) {
      fetchPosts();
    }
  };

  const createMarkup = (content: string) => {
    return { __html: DOMPurify.sanitize(content) };
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ 
        mb: 4,
        maxWidth: 600,
        mx: 'auto',
        width: '100%',
        display: 'flex',
        gap: 2,
        alignItems: 'center'
      }}>
        <TextField
          fullWidth
          label="Buscar posts"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
        <Tooltip title={sortOrder === 'desc' ? 'Mais antigos primeiro' : 'Mais novos primeiro'}>
          <IconButton 
            onClick={handleToggleSort}
            sx={{ 
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            <SortIcon sx={{ 
              transform: sortOrder === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.2s'
            }} />
          </IconButton>
        </Tooltip>
      </Box>

      {posts.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Nenhum post encontrado.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {posts.map((post) => (
              <StyledCard key={post._id}>
                <StyledCardContent>
                  <Box 
                    onClick={() => handleViewPost(post._id)}
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'color 0.2s ease-in-out',
                      '&:hover': {
                        color: theme.palette.primary.main
                      }
                    }}
                  >
                    <Typography variant={isMobile ? "h6" : "h5"} component="h2" gutterBottom>
                      {post.title}
                    </Typography>
                  </Box>
                  <Typography sx={{ mb: 2 }} color="text.secondary" variant={isMobile ? "body2" : "body1"}>
                    Por {post.author.name || post.author.email} em{' '}
                    {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <PostContent
                    dangerouslySetInnerHTML={createMarkup(
                      post.content.length > 500
                        ? post.content.substring(0, 500) + '...'
                        : post.content
                    )}
                  />
                </StyledCardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleViewPost(post._id)}>
                    Ler mais
                  </Button>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(post._id)}
                  >
                    Editar
                  </Button>
                </CardActions>
              </StyledCard>
            ))}
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default PostList; 