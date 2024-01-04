import express from 'express';
import { enviarEmailRecuperacao, verificarTokenRecuperacao } from '../controllers/TokenController';

const router = express.Router();


router.post('/enviar-email-recuperacao', enviarEmailRecuperacao);
router.post('/verificar-token-recuperacao', verificarTokenRecuperacao);

export default router;