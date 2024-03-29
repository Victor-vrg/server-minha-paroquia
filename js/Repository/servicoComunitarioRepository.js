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
class ServicoComunitarioRepository {
    constructor() {
        this.collectionName = "ServicosComunitarios";
    }
    getNivelAcessoUsuarioAbaixoDe5(UserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = (0, mongo_1.getDatabaseInstance)();
            return yield dbInstance
                .collection("UsuariosServicosComunitarios")
                .find({ UsuarioID: UserId, NivelAcessoNoServico: { $lt: 5 } })
                .toArray();
        });
    }
    getAllNivelAcessoUsuario(UserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = (0, mongo_1.getDatabaseInstance)();
            return yield dbInstance
                .collection("UsuariosServicosComunitarios")
                .find({ UsuarioID: UserId })
                .toArray();
        });
    }
    getServicosComunitarios() {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = (0, mongo_1.getDatabaseInstance)();
            return yield dbInstance
                .collection(this.collectionName)
                .find()
                .toArray();
        });
    }
    insertEventoServicoComunitario(relacaoEventoServico) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = (0, mongo_1.getDatabaseInstance)();
            const eventosServicosCollection = dbInstance.collection('EventosServicosComunitarios');
            return yield eventosServicosCollection.insertOne(relacaoEventoServico);
        });
    }
    getUserAccess(UserId, IDServicoComunitario) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = (0, mongo_1.getDatabaseInstance)();
            const usuarioServicoCollection = dbInstance.collection('UsuariosServicosComunitarios');
            try {
                const result = yield usuarioServicoCollection.find({
                    UsuarioID: UserId,
                    _id: { $in: IDServicoComunitario },
                }).toArray();
                return result;
            }
            catch (error) {
                console.error("Erro durante a consulta ao banco de dados:", error);
                return null;
            }
        });
    }
    updateNivelAcessoServicoComunitario(UsuarioID, ServicoComunitarioID, NivelAcessoNoServico) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = (0, mongo_1.getDatabaseInstance)();
            const colecao = dbInstance.collection('UsuariosServicosComunitarios');
            try {
                yield colecao.updateOne({
                    UsuarioID,
                    ServicoComunitarioID,
                }, {
                    $set: {
                        NivelAcessoNoServico,
                    },
                });
            }
            catch (error) {
                console.error('Erro ao atualizar nível de acesso do serviço comunitário:', error);
                throw error;
            }
        });
    }
    getUserById(UsuarioID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dbInstance = (0, mongo_1.getDatabaseInstance)();
                const isValidObjectId = mongodb_1.ObjectId.isValid(UsuarioID);
                const user = yield dbInstance.collection(this.collectionName).findOne({
                    _id: isValidObjectId ? new mongodb_1.ObjectId(UsuarioID) : UsuarioID
                });
                if (user) {
                    return user;
                }
                else {
                    console.log(`Usuário com ID ${UsuarioID} não encontrado.`);
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
exports.default = ServicoComunitarioRepository;
