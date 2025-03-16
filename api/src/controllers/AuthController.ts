import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import logger from '../config/logger';
import { IUser } from '../models/User';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const AuthController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Email ou senha inválidos' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Email ou senha inválidos' });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          discipline: user.discipline
        }
      });
    } catch (error) {
      logger.error('Erro no login:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  async register(req: Request, res: Response) {
    try {
      const { name, email, password, role, discipline } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email já está em uso' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        discipline
      });

      const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          discipline: user.discipline
        }
      });
    } catch (error) {
      logger.error('Erro no registro:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  async me(req: Request, res: Response) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      return res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        discipline: user.discipline
      });
    } catch (error) {
      logger.error('Erro ao buscar dados do usuário:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },
}; 