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
const mongodb_1 = require("mongodb");
const mongo_1 = require("../database/mongo");
class UsuarioRepository {
    constructor() {
        this.collectionName = 'Usuarios';
    }
    getUsersByParoquia(ParoquiaMaisFrequentada) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("dado que chegou no repository", ParoquiaMaisFrequentada);
                const dbInstance = (0, mongo_1.getDatabaseInstance)();
                const regex = new RegExp(ParoquiaMaisFrequentada, 'i');
                // Specify the fields you want to include/exclude in the projection
                const projection = {
                    SenhaHash: 0 // Exclude SenhaHash field
                };
                return yield dbInstance.collection(this.collectionName)
                    .find({ ParoquiaMaisFrequentada: { $regex: regex } }, { projection })
                    .toArray();
            }
            catch (error) {
                console.error('Erro ao buscar usuários por paróquia:', error);
                return [];
            }
        });
    }
    getUserByEmailOrName(email, nomeCompleto) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = (0, mongo_1.getDatabaseInstance)();
            return yield dbInstance.collection(this.collectionName).findOne({ $or: [{ Email: email }, { NomeCompleto: nomeCompleto }] });
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = (0, mongo_1.getDatabaseInstance)();
            yield dbInstance.collection(this.collectionName).insertOne(user);
        });
    }
    updateProfile(UserId, updatedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = (0, mongo_1.getDatabaseInstance)();
            yield dbInstance.collection(this.collectionName).updateOne({ _id: UserId }, { $set: updatedUser });
        });
    }
    insertOrUpdateToken(UserId, token, expiration) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = (0, mongo_1.getDatabaseInstance)();
            const TokensCollection = dbInstance.collection('Tokens');
            // Verifique se já existe um token para o usuário
            const existingToken = yield TokensCollection.findOne({ _id: UserId });
            if (existingToken) {
                // Se o token existir, atualize-o
                yield TokensCollection.updateOne({ _id: UserId }, { $set: { token, expiration } });
            }
            else {
                // Se o token não existir, insira um novo documento
                const tokenDocument = {
                    _id: UserId,
                    token,
                    expiration,
                };
                yield TokensCollection.insertOne(tokenDocument);
            }
        });
    }
    insertnewUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dbInstance = (0, mongo_1.getDatabaseInstance)();
                const result = yield dbInstance.collection(this.collectionName).insertOne(user);
                return result.insertedId;
            }
            catch (error) {
                console.error('Error inserting user:', error);
                return null;
            }
        });
    }
    getUserById(UserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dbInstance = (0, mongo_1.getDatabaseInstance)();
                const isValidObjectId = mongodb_1.ObjectId.isValid(UserId);
                const user = yield dbInstance.collection(this.collectionName).findOne({
                    _id: isValidObjectId ? new mongodb_1.ObjectId(UserId) : UserId
                });
                if (user) {
                    return user;
                }
                else {
                    console.log(`Usuário com ID ${UserId} não encontrado.`);
                    return null;
                }
            }
            catch (error) {
                console.error('Erro ao buscar usuário por ID:', error);
                return null;
            }
        });
    }
}
exports.default = UsuarioRepository;
