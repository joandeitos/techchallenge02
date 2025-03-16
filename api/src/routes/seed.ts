import express from 'express';
import { seedPosts, seedUsers } from '../controllers/seedController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Seed
 *   description: Rotas para popular o banco de dados com dados de exemplo
 */

/**
 * @swagger
 * /api/seed/users:
 *   post:
 *     summary: Cria usuários de exemplo
 *     tags: [Seed]
 *     description: Cria 10 usuários de exemplo, incluindo um administrador
 *     responses:
 *       201:
 *         description: Usuários criados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuários criados com sucesso
 *       400:
 *         description: Usuários já existem no banco de dados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuários já existem no banco de dados
 *       500:
 *         description: Erro ao criar usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao criar usuários
 */

/**
 * @swagger
 * /api/seed/posts:
 *   post:
 *     summary: Cria posts de exemplo
 *     tags: [Seed]
 *     description: Cria 10 posts de exemplo com conteúdo HTML formatado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Posts criados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Posts criados com sucesso
 *       400:
 *         description: Posts já existem no banco de dados ou nenhum usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Posts já existem no banco de dados
 *       401:
 *         description: Não autorizado - Token JWT ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Não autorizado
 *       500:
 *         description: Erro ao criar posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao criar posts
 */

// Rota disponível apenas em ambiente de desenvolvimento
if (process.env.NODE_ENV === 'development') {
  router.post('/', seedPosts);
}

router.post('/users', seedUsers);
router.post('/posts', authMiddleware, seedPosts);

export default router; 