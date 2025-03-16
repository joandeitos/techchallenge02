import mongoose from 'mongoose';
import logger from './logger';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog';
    await mongoose.connect(mongoURI);
    logger.info('MongoDB conectado com sucesso');
  } catch (error) {
    logger.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB; 