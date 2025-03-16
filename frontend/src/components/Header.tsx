import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import AddIcon from '@mui/icons-material/Add';

export default function Header() {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          Blog dos Professores
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {user && (
            <>
              {user.role === 'professor' && (
                <Button
                  color="inherit"
                  component={Link}
                  to="/post/new"
                  startIcon={<AddIcon />}
                >
                  Novo Post
                </Button>
              )}
              {user.role === 'admin' && (
                <Button
                  color="inherit"
                  component={Link}
                  to="/admin"
                >
                  Admin
                </Button>
              )}
              <ThemeToggle />
              <IconButton
                onClick={handleMenu}
                color="inherit"
                edge="end"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem 
                  component={Link} 
                  to="/profile"
                  onClick={handleClose}
                >
                  Perfil
                </MenuItem>
                <MenuItem onClick={handleLogout}>Sair</MenuItem>
              </Menu>
            </>
          )}
          {!user && (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/register"
              >
                Registrar
              </Button>
              <ThemeToggle />
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
} 