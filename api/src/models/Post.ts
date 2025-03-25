import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - author
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-gerado do post
 *         title:
 *           type: string
 *           description: Título do post
 *         content:
 *           type: string
 *           description: Conteúdo do post
 *         author:
 *           type: string
 *           description: ID do autor (professor)
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         title: Introdução à Álgebra
 *         content: Nesta aula vamos aprender...
 *         author: 60d6ec9f1346f3b5e4c8c1d8
 */

export interface IPost extends Document {
  title: string;
  content: string;
  author: IUser['_id'];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>({
  title: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true,
    minlength: [1, 'Título deve ter no mínimo 1 caracter'],
    maxlength: [100, 'Título deve ter no máximo 100 caracteres']
  },
  content: {
    type: String,
    required: [true, 'Conteúdo é obrigatório'],
    minlength: [1, 'Conteúdo deve ter no mínimo 1 caracter']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Autor é obrigatório']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

postSchema.index({ title: 'text', content: 'text' });

export default mongoose.model<IPost>('Post', postSchema); 
