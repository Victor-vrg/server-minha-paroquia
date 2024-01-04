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
exports.verificarTokenRecuperacao = exports.enviarEmailRecuperacao = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const TokenRepository_1 = __importDefault(require("../Repository/TokenRepository"));
const mongodb_1 = require("mongodb");
const mongo_1 = require("../database/mongo"); // Importe a função getDatabaseInstance
const emailService = process.env.EMAIL_SERVICE;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const tokenRepository = new TokenRepository_1.default();
const enviarEmailRecuperacao = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        // Verifique se o e-mail está associado a um usuário
        // Agora utilize a função getDatabaseInstance para obter a instância do MongoDB
        const user = yield (0, mongo_1.getDatabaseInstance)().collection('Usuarios').findOne({ Email: email });
        if (!user) {
            throw new Error('Usuário não encontrado.');
        }
        // Gere um token de recuperação
        const token = generateRandomToken();
        const expiracao = new Date(new Date().getTime() + 3600000);
        // Insira o token no MongoDB
        const tokenData = {
            UserID: user.id, // Ajuste conforme a estrutura do seu usuário no MongoDB
            Token: token,
            Expiracao: expiracao,
        };
        const insertedTokenId = yield tokenRepository.insertToken(tokenData);
        // Configure o serviço de e-mail
        const transporter = nodemailer_1.default.createTransport({
            service: emailService,
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        });
        // Configure as opções de e-mail
        const mailOptions = {
            from: emailUser,
            to: email,
            subject: 'Recuperação de Senha',
            text: `Use o código a seguir para recuperar sua senha: ${token}`,
        };
        // Envie o e-mail
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Erro ao enviar o email:', error);
                res.status(500).json({ error: 'Erro ao enviar o email de recuperação.' });
            }
            else {
                res.json({ message: 'Email de recuperação enviado com sucesso.' });
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});
exports.enviarEmailRecuperacao = enviarEmailRecuperacao;
const verificarTokenRecuperacao = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, novaSenha } = req.body;
    try {
        // Verifique o token no MongoDB
        const tokenInfo = yield tokenRepository.getTokenInfo(token);
        if (!tokenInfo) {
            throw new Error('Token inválido ou expirado.');
        }
        // Atualize a senha no MongoDB
        const senhaHash = yield bcrypt_1.default.hash(novaSenha, 10);
        yield (0, mongo_1.getDatabaseInstance)().collection('Usuarios').updateOne({ _id: new mongodb_1.ObjectId(tokenInfo.UserID) }, { $set: { SenhaHash: senhaHash } });
        // Delete o token do MongoDB após a verificação
        if (tokenInfo && tokenInfo._id) {
            yield tokenRepository.deleteToken(tokenInfo._id.toString());
        }
        else {
            console.error('TokenInfo ou tokenInfo._id é indefinido ou nulo.');
        }
        res.json({ message: 'Senha redefinida com sucesso.' });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});
exports.verificarTokenRecuperacao = verificarTokenRecuperacao;
function generateRandomToken() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    const tokenLength = 8;
    for (let i = 0; i < tokenLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters.charAt(randomIndex);
    }
    return token;
}
