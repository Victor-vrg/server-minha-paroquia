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
exports.getParoquiaByName = exports.createParoquia = exports.openDatabaseConnection = void 0;
const sqlite_1 = require("sqlite");
function openDatabaseConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, sqlite_1.open)({
            filename: 'backend/minha-paroquia-db.sqlite3',
            driver: sqlite_1.Database,
        });
        return db;
    });
}
exports.openDatabaseConnection = openDatabaseConnection;
function createParoquia(db, paroquia) {
    return __awaiter(this, void 0, void 0, function* () {
        const { NomeParoquia, Padres, CEP, LocalizacaoParoquia, Bairro, InformacoesAdicionais, EmailResponsavel } = paroquia;
        return db.run(`
    INSERT INTO Paroquias (NomeParoquia, Padres, CEP, LocalizacaoParoquia, Bairro, InformacoesAdicionais, EmailResponsavel)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [NomeParoquia, Padres, CEP, LocalizacaoParoquia, Bairro, InformacoesAdicionais, EmailResponsavel]);
    });
}
exports.createParoquia = createParoquia;
function getParoquiaByName(db, nome) {
    return __awaiter(this, void 0, void 0, function* () {
        return db.get('SELECT * FROM Paroquias WHERE NomeParoquia = ?', [nome]);
    });
}
exports.getParoquiaByName = getParoquiaByName;
