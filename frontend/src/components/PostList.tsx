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
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import DOMPurify from 'dompurify';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

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
  const { user } = useAuth();

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

  const canEditPost = (post: Post) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.role === 'professor' && post.author._id === user._id) return true;
    return false;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
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
        <List>
          {posts.map((post) => (
            <Paper
              key={post._id}
              elevation={2}
              sx={{ mb: 2, p: 2, '&:hover': { bgcolor: 'action.hover' } }}
            >
              <ListItem
                disablePadding
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/post/${post._id}`)}
                  >
                    {post.title}
                  </Typography>
                  {canEditPost(post) && (
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => navigate(`/post/${post._id}/edit`)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </Box>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate(`/post/${post._id}`)}
                    >
                      {post.content}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Por {post.author.name} em {formatDate(post.createdAt)}
                    </Typography>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Container>
  );
};

export default PostList; 