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
class TokenRepository {
    constructor() {
        this.collectionName = 'Tokens';
    }
    insertToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = (0, mongo_1.getDatabaseInstance)();
            const result = yield dbInstance.collection(this.collectionName).insertOne(token);
            return result.insertedId;
        });
    }
    getTokenInfo(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = (0, mongo_1.getDatabaseInstance)();
            return yield dbInstance.collection(this.collectionName).findOne({ Token: token, Expiracao: { $gte: new Date() } });
        });
    }
    deleteToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = (0, mongo_1.getDatabaseInstance)();
            yield dbInstance.collection(this.collectionName).deleteOne({ Token: token });
        });
    }
}
exports.default = TokenRepository;
