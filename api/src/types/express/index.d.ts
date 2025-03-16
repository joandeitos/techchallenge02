import { IUser } from '../../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: 'admin' | 'professor';
      };
    }
  }
} 