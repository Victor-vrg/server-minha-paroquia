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
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = require("../database/mongo");
class ParoquiaRepository {
    constructor() {
        this.collectionName = 'Paroquias';
    }
    obterSugestoesParoquias(searchText) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = (0, mongo_1.getDatabaseInstance)();
            const regex = new RegExp(searchText, 'i'); // "i" para tornar a pesquisa sem distinção entre maiúsculas e minúsculas
            return yield dbInstance.collection(this.collectionName).find({ NomeParoquia: { $regex: regex } }).toArray();
        });
    }
    atualizarParoquia(id, atualizacoes) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = (0, mongo_1.getDatabaseInstance)();
            yield dbInstance.collection(this.collectionName).updateOne({ _id: id }, { $set: atualizacoes });
        });
    }
    obterParoquiaPorNome(nomeParoquia) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = (0, mongo_1.getDatabaseInstance)();
            return yield dbInstance.collection(this.collectionName).findOne({ NomeParoquia: nomeParoquia });
        });
    }
}
exports.default = ParoquiaRepository;
