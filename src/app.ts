import express from 'express';
import cors from 'cors';
import paroquiasRoutes from './routes/paroquiaRoute';
import eventosRoute from './routes/EventosRoute';
import ExcursaoRoute from './routes/ExcursaoRoute';
import FeedbackRoute from './routes/feedbackRoute';
import usuarioRoute from './routes/usuarioRoute'
import tokenRoute from './routes/tokenRoute'; 
import  ServicoComunitario  from './routes/ServicoComunitarioRoute';
import { initializeDatabase } from './database/mongo'; 

require('dotenv').config()
const cors = require('cors');
const app = express();
const port = 3001;


app.use(cors());
app.use(express.json());



const startServer = async () => {
  try {
    await initializeDatabase();

    // Roteadores
    app.use('/api', paroquiasRoutes);
    app.use('/paroquias-nome', paroquiasRoutes);
    app.use('/destaque', eventosRoute);
    app.use('/eventos', eventosRoute);
    app.use('/destaqueEx', ExcursaoRoute);
    app.use('/excursao', ExcursaoRoute);
    app.use('/feedback', FeedbackRoute);
    app.use('/usuarios',  usuarioRoute)
    app.use('/tokens', tokenRoute);
    app.use('/role', ServicoComunitario);

 

    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  }
};

startServer();

export default app;
