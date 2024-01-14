import express, { Router, Request, Response } from 'express';
import { getEventosDestacados, getEventos, createEvento ,editarEventos, deletarEvento,getEventoById } from '../controllers/EventosController';
import { checkUserAccess, verifyToken } from '../middleware';


const router: Router = express.Router();

router.get('/destaque', getEventosDestacados);
router.get('/eventos', getEventos);
router.put('/editar-evento', verifyToken, editarEventos);
router.post('/criar', verifyToken,  createEvento)
router.delete('/deletar-evento', verifyToken, deletarEvento);
router.post('/evento', getEventoById);



export default router; 