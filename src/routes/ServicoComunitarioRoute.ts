import express from 'express';
import { verifyToken, checkUserAccess } from '../middleware';
import { editarNivelAcesso, getAllNivelAcessoUsuario, getNivelAcessoUsuarioAbaixoDe5 , getServicosComunitariosDoUsuario} from '../controllers/ServicoComunitarioController';

const router = express.Router();

router.get('/niveis-de-acesso', verifyToken, getAllNivelAcessoUsuario);// pega todos niveis de acesso
router.get('/niveis-abaixode5', verifyToken,  getNivelAcessoUsuarioAbaixoDe5); //abaixo de nivel 5 pode criar algo em algum serviço-comunitario
router.get('/getServicosComunitarios/:usuarioId' ,getServicosComunitariosDoUsuario );
router.put('/editarNivelAcesso',verifyToken, editarNivelAcesso);


export default router;