import express, { Router, Request, Response } from 'express';
import { getEventosDestacados, getEventos, createEvento ,editarEventos } from '../controllers/EventosController';
import { checkUserAccess, verifyToken } from '../middleware';


const router: Router = express.Router();

router.get('/destaque', getEventosDestacados);
router.get('/eventos', getEventos);
//router.put('/editar-evento/:id', verifyToken, editarEventos);
//router.post('/criar', verifyToken,  createEvento)


router.put('/editar-evento/:id',  editarEventos);
router.post('/criar',   createEvento)
export default router; 