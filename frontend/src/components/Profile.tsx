import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Divider,
} from '@mui/material';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  discipline?: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get<User>('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setName(response.data.name);
        setDiscipline(response.data.discipline || '');
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        setError('Erro ao carregar perfil do usuário');
      }
    };

    fetchUserProfile();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put<User>(
        '/api/users/profile',
        {
          name,
          ...(user?.role === 'professor' ? { discipline } : {}),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data);
      setMessage('Perfil atualizado com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setError('Erro ao atualizar perfil');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      await axios.put(
        '/api/users/change-password',
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Senha atualizada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      console.error('Erro ao atualizar senha:', error);
      setPasswordError(
        error.response?.data?.message || 'Erro ao atualizar senha'
      );
    }
  };

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Typography>Carregando...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Meu Perfil
        </Typography>

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            fullWidth
            label="Email"
            value={user.email}
            disabled
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {user.role === 'professor' && (
            <TextField
              margin="normal"
              fullWidth
              label="Disciplina"
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
            />
          )}

          <TextField
            margin="normal"
            fullWidth
            label="Função"
            value={user.role === 'admin' ? 'Administrador' : user.role === 'professor' ? 'Professor' : 'Aluno'}
            disabled
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            Salvar Alterações
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" component="h2" gutterBottom>
          Alterar Senha
        </Typography>

        {passwordError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {passwordError}
          </Alert>
        )}

        <Box component="form" onSubmit={handlePasswordChange}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Senha Atual"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Nova Senha"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirmar Nova Senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mt: 3 }}
          >
            Alterar Senha
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 