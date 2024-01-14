import express, { Router, Request, Response } from 'express';
import { getEventosDestacados, getEventos, createEvento ,editarEventos, deletarEvento } from '../controllers/EventosController';
import { checkUserAccess, verifyToken } from '../middleware';


const router: Router = express.Router();

router.get('/destaque', getEventosDestacados);
router.get('/eventos', getEventos);
router.put('/editar-evento', verifyToken, editarEventos);
router.post('/criar', verifyToken,  createEvento)
router.delete('/eventos/deletar-evento', verifyToken, deletarEvento);



export default router; 