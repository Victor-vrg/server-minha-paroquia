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
exports.getExcursoes = exports.getExcursoesDestacadas = void 0;
const excursoesRepository_1 = __importDefault(require("../Repository/excursoesRepository"));
const excursaoRepository = new excursoesRepository_1.default();
const getExcursoesDestacadas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const excursoesDestacadas = yield excursaoRepository.getExcursoesDestacadas();
        //  console.log('Excursões Destacadas:', excursoesDestacadas);
        res.json(excursoesDestacadas);
    }
    catch (error) {
        console.error('Erro ao buscar excursões destacadas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getExcursoesDestacadas = getExcursoesDestacadas;
const getExcursoes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const excursao = yield excursaoRepository.getExcursoes();
        //   console.log('Excursões:', excursao);
        res.json(excursao);
    }
    catch (error) {
        console.error('Erro ao buscar excursões:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getExcursoes = getExcursoes;
