import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUser;

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem acessar este recurso.' });
  }

  next();
}; 