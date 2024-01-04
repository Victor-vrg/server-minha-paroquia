import express from 'express';
import { verifyToken } from '../middleware';
import {login , getUsers, cadastrarUsuario, getServicosComunitarios, editarPerfil, getUsuarioLogado } from '../controllers/userController';

const router = express.Router();

router.post('/cadastrar', cadastrarUsuario);
router.post('/login', login);

router.get('/usuario-logado',verifyToken, getUsuarioLogado);
router.put('/editar-perfil', verifyToken, editarPerfil)


router.get('/getUsers', verifyToken,  getUsers) 
router.get('/servicos-comunitarios', getServicosComunitarios);


export default router;
