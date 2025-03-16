import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../config/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JwtPayload {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'professor';
  discipline?: string;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    req.user = decoded;

    next();
  } catch (error) {
    logger.error('Erro na autenticação:', error);
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
    }

    return next();
  } catch (error) {
    logger.error('Erro na verificação de admin:', error);
    return res.status(500).json({ message: 'Erro ao verificar permissões de administrador' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Autenticação necessária' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    return next();
  };
}; 