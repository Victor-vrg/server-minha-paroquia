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
exports.editarEventos = exports.createEvento = exports.getEventos = exports.getEventosDestacados = void 0;
const eventoRepository_1 = __importDefault(require("../Repository/eventoRepository"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongodb_1 = require("mongodb");
const middleware_1 = require("../middleware");
const servicoComunitarioRepository_1 = __importDefault(require("../Repository/servicoComunitarioRepository"));
const UsuarioRepository_1 = __importDefault(require("../Repository/UsuarioRepository"));
const usuarioRepository = new UsuarioRepository_1.default();
const eventoRepository = new eventoRepository_1.default();
const ServicoComunitarioRepository = new servicoComunitarioRepository_1.default();
const getEventosDestacados = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventosDestacados = yield eventoRepository.getEventosDestacados();
        // console.log('Eventos Destacados:', eventosDestacados);
        res.json(eventosDestacados);
    }
    catch (error) {
        console.error("Erro ao buscar eventos destacados:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
exports.getEventosDestacados = getEventosDestacados;
const getEventos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventos = yield eventoRepository.getEventos();
        // console.log('Eventos:', eventos);
        res.json(eventos);
    }
    catch (error) {
        console.error("Erro ao buscar eventos:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
exports.getEventos = getEventos;
const createEvento = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("Entrou na função createEvento");
    const token = req.header('Authorization');
    console.log('Token:', token);
    if (!token) {
        console.log("Token não fornecido");
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    try {
        const secretKey = process.env.secretKey;
        const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
        console.log('Token decodificado:', decodedToken);
        const UserId = decodedToken.UserId;
        const user = yield usuarioRepository.getUserById(UserId);
        if (!user) {
            console.log("Usuário associado ao token não encontrado");
            return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
        }
        const { NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Destaque, Ocultar, IDServicoComunitario, } = req.body;
        console.log("servicosComunitarios", IDServicoComunitario);
        // Verifica se IDServicoComunitario está presente antes de verificar o acesso
        if (IDServicoComunitario !== undefined && IDServicoComunitario !== null) {
            // Espera a conclusão da função checkUserAccess antes de prosseguir
            const accessResult = yield (0, middleware_1.checkUserAccess)(IDServicoComunitario, req, res);
            // Verifica se o acesso foi concedido antes de continuar
            if (!accessResult) {
                return res.status(403).json({ error: 'Acesso não autorizado para este serviço comunitário' });
            }
        }
        const newEvento = {
            _id: new mongodb_1.ObjectId(),
            NomeEvento,
            DataInicio,
            DataFim,
            HoraInicio,
            HoraFim,
            LocalizacaoEvento,
            DescricaoEvento,
            CaminhoImagem,
            TipoEvento,
            Destaque,
            Ocultar,
            ParoquiaID: (_a = user.ParoquiaMaisFrequentada) !== null && _a !== void 0 ? _a : null,
        };
        // Associa o evento aos serviços comunitários na coleção separada
        console.log('Novo evento a ser criado:', newEvento);
        const eventId = yield eventoRepository.createEvento(newEvento);
        console.log('Evento criado com sucesso. ID:', eventId, " pelo usuario:", UserId);
        const relacaoEventoServico = {
            EventoID: newEvento._id,
            NomeEvento: NomeEvento,
            DataInicio: DataInicio,
            DataFim: DataFim,
            ServicoComunitarioID: IDServicoComunitario,
        };
        console.log(relacaoEventoServico);
        yield ServicoComunitarioRepository.insertEventoServicoComunitario(relacaoEventoServico);
        res.status(201).json({ message: 'Evento criado com sucesso', eventId });
        console.log('Novo evento criado:', eventId);
        return;
    }
    catch (error) {
        console.error('Erro ao criar evento:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
    }
});
exports.createEvento = createEvento;
const editarEventos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    console.log("Entrou na função editarEventos");
    const token = req.header('Authorization');
    console.log('Token:', token);
    if (!token) {
        console.log("Token não fornecido");
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    try {
        const secretKey = process.env.secretKey;
        const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
        console.log('Token decodificado:', decodedToken);
        const UserId = decodedToken.UserId;
        const user = yield usuarioRepository.getUserById(UserId);
        if (!user) {
            console.log("Usuário associado ao token não encontrado");
            return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
        }
        const eventId = req.body._id;
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(eventId);
        if (!isValidObjectId) {
            return res.status(400).json({ error: 'ID do evento inválido' });
        }
        const { NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Destaque, IDServicoComunitario, } = req.body;
        console.log("servicosComunitarios", IDServicoComunitario);
        // Verifica se IDServicoComunitario está presente antes de verificar o acesso
        if (IDServicoComunitario !== undefined && IDServicoComunitario !== null) {
            // Espera a conclusão da função checkUserAccess antes de prosseguir
            const accessResult = yield (0, middleware_1.checkUserAccess)(IDServicoComunitario, req, res);
            // Verifica se o acesso foi concedido antes de continuar
            if (!accessResult) {
                return res.status(403).json({ error: 'Acesso não autorizado para este serviço comunitário' });
            }
        }
        const updatedEvento = {
            NomeEvento,
            DataInicio,
            DataFim,
            HoraInicio,
            HoraFim,
            LocalizacaoEvento,
            DescricaoEvento,
            CaminhoImagem,
            TipoEvento,
            Destaque,
            Ocultar: false,
            ParoquiaID: (_b = user.ParoquiaMaisFrequentada) !== null && _b !== void 0 ? _b : null,
            IDServicoComunitario,
            _id: new mongodb_1.ObjectId(eventId),
        };
        yield eventoRepository.updateEvento(eventId, updatedEvento);
        res.json({ message: "Evento atualizado com sucesso" });
        console.log("Evento atualizado com sucesso:", eventId);
    }
    catch (error) {
        console.error("Erro ao atualizar evento:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
exports.editarEventos = editarEventos;
