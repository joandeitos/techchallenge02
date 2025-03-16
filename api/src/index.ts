import app from './app';
import connectDB from './config/database';
import logger from './config/logger';

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Conectar ao banco de dados
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error: Error) => {
    logger.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }); 