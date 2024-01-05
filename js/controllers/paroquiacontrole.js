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
exports.obterParoquiaPorNome = exports.obterSugestoesParoquias = exports.atualizarParoquia = exports.obterParoquiaMaisFrequentada = void 0;
const paroquiaRepository_1 = __importDefault(require("../Repository/paroquiaRepository"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongodb_1 = require("mongodb");
const paroquiaRepository = new paroquiaRepository_1.default();
const obterParoquiaMaisFrequentada = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    try {
        const secretKey = process.env.secretKey;
        const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
        const paroquiaMaisFrequentada = decodedToken.ParoquiaMaisFrequentada;
        const paroquia = yield paroquiaRepository.obterParoquiaPorNome(paroquiaMaisFrequentada);
        if (paroquia) {
            res.json(paroquia);
        }
        else {
            res.status(404).json({ error: 'Paróquia mais frequentada não encontrada' });
        }
    }
    catch (error) {
        console.error('Erro ao obter paróquia mais frequentada:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.obterParoquiaMaisFrequentada = obterParoquiaMaisFrequentada;
const atualizarParoquia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idParam = req.params.id;
        if (!mongodb_1.ObjectId.isValid(idParam)) {
            res.status(400).json({ error: 'ID inválido' });
            return;
        }
        const id = new mongodb_1.ObjectId(idParam);
        const atualizacoes = req.body;
        yield paroquiaRepository.atualizarParoquia(id, atualizacoes);
        res.json({ message: 'Paróquia atualizada com sucesso' });
    }
    catch (error) {
        console.error('Erro ao atualizar paróquia:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.atualizarParoquia = atualizarParoquia;
const obterSugestoesParoquias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchText = req.query.s;
        if (!searchText.trim()) {
            res.status(400).json({ error: 'Texto de busca inválido' });
            return;
        }
        const sugestoes = yield paroquiaRepository.obterSugestoesParoquias(searchText);
        res.json(sugestoes);
    }
    catch (error) {
        console.error('Erro ao buscar sugestões de paróquias:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.obterSugestoesParoquias = obterSugestoesParoquias;
const obterParoquiaPorNome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nomeParoquia = req.params.nomeParoquia;
        const paroquia = yield paroquiaRepository.obterParoquiaPorNome(nomeParoquia);
        if (paroquia) {
            res.json(paroquia);
        }
        else {
            res.status(404).json({ error: 'Paróquia não encontrada' });
        }
    }
    catch (error) {
        console.error('Erro ao buscar informações da paróquia:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.obterParoquiaPorNome = obterParoquiaPorNome;
