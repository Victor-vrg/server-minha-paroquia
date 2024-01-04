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
exports.getUsuarioLogado = exports.editarPerfil = exports.getServicosComunitarios = exports.cadastrarUsuario = exports.login = exports.getUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UsuarioRepository_1 = __importDefault(require("../Repository/UsuarioRepository"));
const servicoComunitarioRepository_1 = __importDefault(require("../Repository/servicoComunitarioRepository"));
const usuarioRepository = new UsuarioRepository_1.default();
const servicoComunitarioRepository = new servicoComunitarioRepository_1.default();
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    try {
        const secretKey = process.env.secretKey;
        const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
        const UserId = decodedToken.UserId;
        // const ParoquiaMaisFrequentada = 'Paróquia Teste'
        const ParoquiaMaisFrequentada = decodedToken.ParoquiaMaisFrequentada;
        const user = yield usuarioRepository.getUserById(UserId);
        if (!user) {
            return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
        }
        const users = yield usuarioRepository.getUsersByParoquia(ParoquiaMaisFrequentada);
        console.log("usuarios", users);
        res.json(users);
    }
    catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getUsers = getUsers;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { NomeCompleto, Email, senha } = req.body;
    try {
        if (!NomeCompleto && !Email) {
            throw new Error('Nome Completo ou Email são necessários.');
        }
        const user = yield usuarioRepository.getUserByEmailOrName(Email, NomeCompleto);
        if (!user) {
            throw new Error('Usuário não encontrado.');
        }
        const passwordMatch = yield bcrypt_1.default.compare(senha, user.SenhaHash);
        if (!passwordMatch) {
            throw new Error('Senha incorreta.');
        }
        const secretKey = process.env.secretKey;
        const token = jsonwebtoken_1.default.sign({
            UserId: user._id,
            NomeCompleto: user.NomeCompleto,
            Email: user.Email,
            Telefone: user.Telefone,
            Bairro: user.Bairro,
            DataNascimento: user.DataNascimento,
            ParoquiaMaisFrequentada: user.ParoquiaMaisFrequentada,
            IDServicoComunitario: user.IDServicoComunitario,
        }, secretKey, { expiresIn: '3h' });
        const expiration = new Date(new Date().getTime() + 10800000);
        yield usuarioRepository.insertOrUpdateToken(user._id, token, expiration);
        console.log('Token gerado:', token);
        res.json({ token });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});
exports.login = login;
const cadastrarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { NomeCompleto, Email, Telefone, Bairro, ParoquiaMaisFrequentada, DataNascimento, IDServicoComunitario, } = req.body;
    try {
        const SenhaHash = yield bcrypt_1.default.hash(req.body.senha, 10);
        console.log("dados obrigatorios", NomeCompleto, Email, SenhaHash, IDServicoComunitario);
        const novoUsuario = yield usuarioRepository.insertnewUser({
            NomeCompleto,
            Email,
            SenhaHash: SenhaHash,
            Telefone,
            Bairro,
            ParoquiaMaisFrequentada,
            DataNascimento,
            IDServicoComunitario,
        });
        if (novoUsuario) {
            res.json({ message: 'Usuário cadastrado com sucesso.', userId: novoUsuario });
        }
        else {
            res.status(500).json({ error: 'Erro interno do servidor ao cadastrar usuário.' });
        }
    }
    catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.cadastrarUsuario = cadastrarUsuario;
const getServicosComunitarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const servicosComunitarios = yield servicoComunitarioRepository.getServicosComunitarios();
        res.json(servicosComunitarios);
    }
    catch (error) {
        console.error('Erro ao buscar serviços comunitários:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getServicosComunitarios = getServicosComunitarios;
const editarPerfil = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    try {
        const secretKey = process.env.secretKey;
        const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
        const user = yield usuarioRepository.getUserById(decodedToken.UserId);
        if (!user) {
            return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
        }
        const { NomeCompleto, Email, Telefone, Bairro, ParoquiaMaisFrequentada, DataNascimento, IDServicoComunitario, NovaSenha } = req.body;
        if (NomeCompleto) {
            user.NomeCompleto = NomeCompleto;
        }
        if (Email) {
            user.Email = Email;
        }
        if (Telefone) {
            user.Telefone = Telefone;
        }
        if (Bairro) {
            user.Bairro = Bairro;
        }
        if (ParoquiaMaisFrequentada) {
            user.ParoquiaMaisFrequentada = ParoquiaMaisFrequentada;
        }
        if (DataNascimento) {
            user.DataNascimento = DataNascimento;
        }
        if (IDServicoComunitario) {
            user.IDServicoComunitario = IDServicoComunitario;
        }
        if (NovaSenha) {
            const senhaHash = yield bcrypt_1.default.hash(NovaSenha, 10);
            user.SenhaHash = senhaHash;
        }
        yield usuarioRepository.updateProfile(decodedToken.UserId, user);
        res.json({ message: 'Perfil atualizado com sucesso' });
    }
    catch (error) {
        res.status(401).json({ error: 'Token inválido ou expirado' });
    }
});
exports.editarPerfil = editarPerfil;
const getUsuarioLogado = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    try {
        const secretKey = process.env.secretKey;
        const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
        console.log("Decoded Token:", decodedToken);
        const UserId = decodedToken.UserId;
        const user = yield usuarioRepository.getUserById(UserId);
        if (!user) {
            return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
        }
        const userData = {
            UserId: UserId,
            nomeCompleto: user.NomeCompleto,
            email: user.Email,
            telefone: user.Telefone,
            bairro: user.Bairro,
            dataNascimento: user.DataNascimento,
            paroquiaMaisFrequentada: user.ParoquiaMaisFrequentada,
            idServicoComunitario: user.IDServicoComunitario,
        };
        res.json(userData);
        console.log("seu userdata:", userData);
    }
    catch (error) {
        res.status(401).json({ error: 'Token inválido ou expirado' });
    }
});
exports.getUsuarioLogado = getUsuarioLogado;
