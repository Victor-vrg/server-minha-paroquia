"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.post('/cadastrar', userController_1.cadastrarUsuario);
router.post('/login', userController_1.login);
router.get('/usuario-logado', middleware_1.verifyToken, userController_1.getUsuarioLogado);
router.put('/editar-perfil', middleware_1.verifyToken, userController_1.editarPerfil);
router.get('/getUsers', middleware_1.verifyToken, userController_1.getUsers);
router.get('/servicos-comunitarios', userController_1.getServicosComunitarios);
exports.default = router;
