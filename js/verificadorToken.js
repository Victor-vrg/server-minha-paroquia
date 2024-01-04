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
exports.checkUserRole = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const db_1 = require("./database/db");
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    const db = (0, db_1.getDatabaseInstance)();
    const row = yield db.get('SELECT Token FROM Tokens WHERE Token = ? AND Expiracao > ?', [token, new Date()]);
    if (!row) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, config_1.secretKey);
        req.user = decodedToken;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Token inválido' });
    }
});
exports.verifyToken = verifyToken;
const checkUserRole = (role) => {
    return (req, res, next) => {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, config_1.secretKey);
            const user = decodedToken;
            if (user.role === role) {
                req.user = user;
                next();
            }
            else {
                return res.status(403).json({ error: 'Acesso não autorizado' });
            }
        }
        catch (error) {
            return res.status(401).json({ error: 'Token inválido' });
        }
    };
};
exports.checkUserRole = checkUserRole;
