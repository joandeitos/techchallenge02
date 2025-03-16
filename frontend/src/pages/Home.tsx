import React from 'react';
import PostList from '../components/PostList';
import { Container, Typography, Box } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 4
          }}
        >
          Blog dos Professores
        </Typography>
        <PostList />
      </Box>
    </Container>
  );
} 