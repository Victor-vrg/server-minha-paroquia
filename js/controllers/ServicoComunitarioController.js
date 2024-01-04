"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServicosComunitariosDoUsuario = exports.getAllNivelAcessoUsuario = exports.getNivelAcessoUsuarioAbaixoDe5 = void 0;
const servicoComunitarioRepository_1 = __importDefault(require("../Repository/servicoComunitarioRepository"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const servicoComunitarioRepository = new servicoComunitarioRepository_1.default();
const getNivelAcessoUsuarioAbaixoDe5 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    try {
        const secretKey = process.env.secretKey;
        const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
        const UserId = decodedToken.UserId;
        const servicosComunitarios = yield servicoComunitarioRepository.getNivelAcessoUsuarioAbaixoDe5(UserId);
        res.json(servicosComunitarios);
        console.log(servicosComunitarios);
    }
    catch (error) {
        console.error('Erro ao obter nível de acesso do usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getNivelAcessoUsuarioAbaixoDe5 = getNivelAcessoUsuarioAbaixoDe5;
const getAllNivelAcessoUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    try {
        const secretKey = process.env.secretKey;
        const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
        const UserId = decodedToken.UserId;
        console.log("userId", UserId);
        const servicosComunitarios = yield servicoComunitarioRepository.getAllNivelAcessoUsuario(UserId);
        res.json(servicosComunitarios);
        console.log(servicosComunitarios);
    }
    catch (error) {
        console.error('Erro ao obter nível de acesso do usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getAllNivelAcessoUsuario = getAllNivelAcessoUsuario;
const getServicosComunitariosDoUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { usuarioId } = req.params; // Obtém o ID do usuário a partir dos parâmetros da rota
    // Sua lógica para buscar os serviços comunitários específicos do usuário aqui...
    try {
        const servicosComunitarios = yield servicoComunitarioRepository.getAllNivelAcessoUsuario(usuarioId);
        res.json(servicosComunitarios);
        console.log(servicosComunitarios);
    }
    catch (error) {
        console.error('Erro ao obter serviços comunitários do usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getServicosComunitariosDoUsuario = getServicosComunitariosDoUsuario;
