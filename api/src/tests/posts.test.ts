import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import Post from '../models/Post';
import { User, IUser } from '../models/User';
import jwt from 'jsonwebtoken';

describe('Post Endpoints', () => {
  let mongoServer: MongoMemoryServer;
  let testUser: IUser;
  let authToken: string;

  beforeAll(async () => {
    console.log('Iniciando o MongoMemoryServer...');
    // Desconecta qualquer conexão existente
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    mongoServer = await MongoMemoryServer.create();
    console.log('MongoMemoryServer iniciado:', mongoServer);
    await mongoose.connect(mongoServer.getUri());
    console.log('Conectado ao MongoDB');
  }, 10000); // Timeout de 10 segundos para o beforeAll

  afterAll(async () => {
    console.log('Desconectando do MongoDB...');
    await mongoose.disconnect();
    console.log('Desconectado do MongoDB');
    console.log('Parando o MongoMemoryServer...');
    await mongoServer.stop();
    console.log('MongoMemoryServer parado');
  }, 15000); // Timeout de 15 segundos para finalizar o afterAll

  beforeEach(async () => {
    await Post.deleteMany({});
    await User.deleteMany({});

    // Criar um usuário para teste
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: '123456', // Adicionando senha obrigatória
      discipline: 'Test Discipline',
      role: 'professor'
    });

    // Gerar token JWT
    authToken = jwt.sign(
      { id: testUser._id, role: testUser.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
  });

  it('should create a new post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Post',
        content: 'Test Content',
        author: testUser._id
      });
      
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Post');
    expect(res.body.author.id).toBe(testUser._id.toString());
  });

  it('should get all posts', async () => {
    await Post.create({
      title: 'Test Post',
      content: 'Test Content',
      author: testUser._id
    });

    const res = await request(app)
      .get('/api/posts')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBe(1);
    expect(res.body[0].author.name).toBe(testUser.name);
  });

  it('should get a specific post', async () => {
    const post = await Post.create({
      title: 'Test Post',
      content: 'Test Content',
      author: testUser._id
    });

    const res = await request(app)
      .get(`/api/posts/${post._id}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Test Post');
  });

  it('should update a post', async () => {
    const post = await Post.create({
      title: 'Test Post',
      content: 'Test Content',
      author: testUser._id
    });

    const res = await request(app)
      .put(`/api/posts/${post._id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Updated Post',
        content: 'Updated Content'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Post');
    expect(res.body.author.id).toBe(testUser._id.toString());
  });

  it('should delete a post', async () => {
    const post = await Post.create({
      title: 'Test Post',
      content: 'Test Content',
      author: testUser._id
    });

    const res = await request(app)
      .delete(`/api/posts/${post._id}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(res.statusCode).toBe(200);
    
    const deletedPost = await Post.findById(post._id);
    expect(deletedPost).toBeNull();
  });

  it('should search posts by term', async () => {
    await Post.create([
      {
        title: 'Mathematics Class',
        content: 'Learning about algebra',
        author: testUser._id
      },
      {
        title: 'History Class',
        content: 'Learning about mathematics in history',
        author: testUser._id
      }
    ]);

    const res = await request(app)
      .get('/api/posts/search?q=mathematics')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBe(2);
    expect(res.body[0].author.name).toBe(testUser.name);
  });

  it('should handle invalid post ID', async () => {
    const invalidId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/posts/${invalidId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(res.statusCode).toBe(404);
  });
}); 