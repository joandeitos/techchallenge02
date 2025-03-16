export interface AuthUser {
  id: string;
  role: 'admin' | 'professor';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
} 