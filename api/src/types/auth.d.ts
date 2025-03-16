export interface AuthUser {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: string;
  discipline?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
} 