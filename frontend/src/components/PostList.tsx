import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Tooltip,
  Divider,
  styled,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import DOMPurify from 'dompurify';
import axios from 'axios';

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  width: '100%',
  marginBottom: '16px',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
}));

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
  paddingBottom: '16px !important',
});

const PostContent = styled('div')(({ theme }) => ({
  marginTop: '16px',
  color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'rgba(0, 0, 0, 0.7)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  lineHeight: 1.5,

  '& img': {
    maxWidth: '100%',
    height: 'auto',
  },

  '& a': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },

  '& pre': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)' 
      : '#f5f5f5',
    padding: '8px',
    borderRadius: '4px',
    overflowX: 'auto',
  },

  '& code': {
    fontFamily: "'Consolas', 'Monaco', monospace",
    fontSize: '0.9em',
    color: theme.palette.text.primary,
  },
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  top: theme.spacing(2),
  display: 'flex',
  gap: theme.spacing(1),
}));

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

  const handleEdit = (postId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/posts/edit/${postId}`);
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
              <StyledCard 
                key={post._id} 
                onClick={() => handleViewPost(post._id)}
                sx={{ 
                  position: 'relative',
                  cursor: 'pointer',
                }}
              >
                <StyledCardContent>
                  <Box>
                    <Typography 
                      variant={isMobile ? "h6" : "h5"} 
                      component="h2" 
                      gutterBottom
                      sx={{
                        pr: 15, // Espaço para os botões
                        transition: 'color 0.2s ease-in-out',
                        '&:hover': {
                          color: theme.palette.primary.main
                        }
                      }}
                    >
                      {post.title}
                    </Typography>
                  </Box>
                  <Typography 
                    sx={{ mb: 2 }} 
                    color="text.secondary" 
                    variant={isMobile ? "body2" : "body1"}
                  >
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
                  <ActionButtons>
                    <Tooltip title="Ler mais">
                      <IconButton 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewPost(post._id);
                        }}
                        sx={{
                          color: theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: theme.palette.primary.main + '20',
                          }
                        }}
                      >
                        <ReadMoreIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={(e) => handleEdit(post._id, e)}
                        sx={{
                          color: theme.palette.secondary.main,
                          '&:hover': {
                            backgroundColor: theme.palette.secondary.main + '20',
                          }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </ActionButtons>
                </StyledCardContent>
              </StyledCard>
            ))}
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default PostList; 