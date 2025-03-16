import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ThemeToggle } from './ThemeToggle';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'professor' | 'aluno';
}

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await axios.get<User>('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        } catch (error) {
          console.error('Erro ao carregar usuário:', error);
        }
      }
    };

    fetchUser();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/profile');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          Blog dos Professores
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <ThemeToggle />
          {user ? (
            <>
              {(user.role === 'admin' || user.role === 'professor') && (
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/create-post"
                >
                  Novo Post
                </Button>
              )}
              {user.role === 'admin' && (
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/admin"
                >
                  Painel Admin
                </Button>
              )}
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ ml: 1 }}
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleProfileClick}>Meu Perfil</MenuItem>
                <MenuItem onClick={handleLogout}>Sair</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              component={RouterLink}
              to="/login"
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 