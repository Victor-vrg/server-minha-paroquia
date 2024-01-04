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
exports.checkUserAccess = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UsuarioRepository_1 = __importDefault(require("./Repository/UsuarioRepository"));
const servicoComunitarioRepository_1 = __importDefault(require("./Repository/servicoComunitarioRepository"));
require('dotenv').config();
const usuarioRepository = new UsuarioRepository_1.default();
const servicoComunitarioRepository = new servicoComunitarioRepository_1.default();
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('Authorization');
    console.log(' token recebido no verifyToken do servidor:', token);
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    try {
        const secretKey = process.env.secretKey;
        const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
        const UserId = decodedToken.UserId;
        console.log("UserId do verifyToken", UserId);
        const userdados = yield usuarioRepository.getUserById(UserId);
        console.log("dados do usuario", userdados);
        if (!userdados) {
            return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
        }
        req.user = {
            UserId: UserId,
            NomeCompleto: userdados.NomeCompleto,
            Email: userdados.Email,
            Telefone: userdados.Telefone,
            Bairro: userdados.Bairro,
            DataNascimento: userdados.DataNascimento,
            ParoquiaMaisFrequentada: userdados.ParoquiaMaisFrequentada,
            IDServicoComunitario: userdados.IDServicoComunitario,
        };
        next();
    }
    catch (error) {
        console.error('Erro na verificação do token:', error);
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
});
exports.verifyToken = verifyToken;
const checkUserAccess = (IDServicoComunitario, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Iniciando função checkUserAccess ");
        console.log("IDServicoComunitario recebidos", IDServicoComunitario);
        const token = req.header('Authorization');
        console.log("Token:", token);
        if (!token) {
            console.log("Token não fornecido");
            return false;
        }
        const secretKey = process.env.secretKey;
        const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
        const UserId = decodedToken.UserId;
        const usuario = decodedToken.NomeCompleto;
        console.log("UserID do usuário:", UserId);
        const user = yield usuarioRepository.getUserById(UserId);
        console.log("Usuário encontrado:", user);
        if (!user) {
            console.log("Usuário associado ao token não encontrado");
            return false;
        }
        if (IDServicoComunitario.length === 0) {
            console.log("IDServicoComunitario está vazia. Acesso negado.");
            return false;
        }
        console.log("Usuario e IDServicoComunitario a ser utilizado na consulta:", usuario, IDServicoComunitario);
        const userAccessArray = yield servicoComunitarioRepository.getUserAccess(UserId, IDServicoComunitario);
        console.log("Resultado da consulta ao banco de dados (userAccessArray):", userAccessArray);
        if (!userAccessArray || userAccessArray.length !== IDServicoComunitario.length) {
            console.log("Não foi possível verificar todos os serviços comunitários. Acesso negado.");
            return false;
        }
        const isAccessGranted = userAccessArray.every((access) => (access === null || access === void 0 ? void 0 : access.NivelAcessoNoServico) && access.NivelAcessoNoServico < 5);
        if (!isAccessGranted) {
            console.log("Acesso negado");
            return false;
        }
        console.log("Acesso concedido. Continuando...");
        return true;
    }
    catch (error) {
        console.log("Erro ao processar o token:", error);
        return false;
    }
});
exports.checkUserAccess = checkUserAccess;
