import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - discipline
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-gerado do usuário
 *         name:
 *           type: string
 *           description: Nome completo do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         discipline:
 *           type: string
 *           description: Disciplina lecionada pelo professor
 *         role:
 *           type: string
 *           enum: [professor, admin, aluno]
 *           description: Função do usuário no sistema
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do usuário
 *       example:
 *         name: Maria Silva
 *         email: maria@escola.edu
 *         discipline: Matemática
 *         role: professor
 */

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'professor' | 'aluno';
  discipline?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'professor', 'aluno'],
    default: 'aluno'
  },
  discipline: {
    type: String,
    required: function(this: any) {
      return this.role === 'professor';
    }
  }
}, {
  timestamps: true
});

// Hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema); 