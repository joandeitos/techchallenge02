import { Request, Response } from 'express';
import { User } from '../models/User';
import logger from '../config/logger';

// Listar todos os usuários
export const listUsers = async (_: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    logger.info('Usuários listados com sucesso');
    res.json(users);
  } catch (error) {
    logger.error('Erro ao listar usuários:', error);
    res.status(500).json({ message: 'Erro ao listar usuários' });
  }
};

// Buscar usuário por ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      logger.warn('Usuário não encontrado');
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }
    logger.info('Usuário encontrado com sucesso');
    res.json(user);
  } catch (error) {
    logger.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
};

// Criar um novo usuário
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = new User(req.body);
    await user.save();
    logger.info('Usuário criado com sucesso');
    res.status(201).json(user);
  } catch (error) {
    logger.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
};

// Atualizar um usuário
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      logger.warn('Usuário não encontrado para atualização');
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }
    logger.info('Usuário atualizado com sucesso');
    res.json(user);
  } catch (error) {
    logger.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
};

// Deletar um usuário
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      logger.warn('Usuário não encontrado para exclusão');
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }
    logger.info('Usuário deletado com sucesso');
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    logger.error('Erro ao deletar usuário:', error);
    res.status(500).json({ message: 'Erro ao deletar usuário' });
  }
}; 