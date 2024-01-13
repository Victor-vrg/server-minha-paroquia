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
exports.editarNivelAcesso = exports.getServicosComunitariosDoUsuario = exports.getAllNivelAcessoUsuario = exports.getNivelAcessoUsuarioAbaixoDe5 = void 0;
const servicoComunitarioRepository_1 = __importDefault(require("../Repository/servicoComunitarioRepository"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const mongodb_1 = require("mongodb");
const UsuarioRepository_1 = __importDefault(require("../Repository/UsuarioRepository"));
(0, dotenv_1.config)();
const usuarioRepository = new UsuarioRepository_1.default();
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
const editarNivelAcesso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    try {
        const { UsuarioID, ServicoComunitarioID, NivelAcessoNoServico } = req.body;
        // Verifica se todos os parâmetros necessários estão presentes
        if (!UsuarioID || !ServicoComunitarioID || !NivelAcessoNoServico) {
            return res.status(400).json({ error: 'Parâmetros incompletos' });
        }
        console.log('Iniciando edição de nível de acesso...');
        console.log('UsuarioID:', UsuarioID);
        console.log('ServicoComunitarioID:', ServicoComunitarioID);
        console.log('NivelAcessoNoServico:', NivelAcessoNoServico);
        const usuario = yield servicoComunitarioRepository.getUserById(UsuarioID);
        console.log('Usuário encontrado:', usuario);
        if (!usuario) {
            console.log('Usuário não encontrado');
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        const servicoComunitario = yield usuarioRepository.getServicoComunitarioById(new mongodb_1.ObjectId(ServicoComunitarioID));
        console.log('Serviço comunitário encontrado:', servicoComunitario);
        if (!servicoComunitario) {
            console.log('Serviço comunitário não encontrado');
            return res.status(404).json({ error: 'Serviço comunitário não encontrado' });
        }
        // Atualiza o nível de acesso no serviço comunitário para o usuário
        yield servicoComunitarioRepository.updateNivelAcessoServicoComunitario(UsuarioID, ServicoComunitarioID, NivelAcessoNoServico);
        console.log('Nível de acesso atualizado com sucesso');
        res.json({ message: 'Nível de acesso atualizado com sucesso' });
    }
    catch (error) {
        console.error('Erro ao editar nível de acesso:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.editarNivelAcesso = editarNivelAcesso;
