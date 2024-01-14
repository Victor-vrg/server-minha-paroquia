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
class EventoRepository {
    constructor() {
        this.collectionName = 'Eventos';
    }
    getEventosDestacados() {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = (0, mongo_1.getDatabaseInstance)();
            return yield dbInstance.collection(this.collectionName).find({ Destaque: { $eq: true } }).toArray();
        });
    }
    getEventos() {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = (0, mongo_1.getDatabaseInstance)();
            return yield dbInstance.collection(this.collectionName).find().toArray();
        });
    }
    createEvento(evento) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = (0, mongo_1.getDatabaseInstance)();
            const result = yield dbInstance.collection(this.collectionName).insertOne(evento);
            return result.insertedId;
        });
    }
    updateEvento(eventId, updatedEvento) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = (0, mongo_1.getDatabaseInstance)();
            yield dbInstance.collection(this.collectionName).updateOne({ _id: new mongodb_1.ObjectId(eventId) }, { $set: updatedEvento });
        });
    }
    deleteEvento(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = (0, mongo_1.getDatabaseInstance)();
            yield dbInstance.collection(this.collectionName).deleteOne({ _id: new mongodb_1.ObjectId(eventId) });
        });
    }
    getUsuario(UserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = (0, mongo_1.getDatabaseInstance)();
            return yield dbInstance.collection('Usuarios').findOne({ _id: UserId });
        });
    }
    getEventoById(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = (0, mongo_1.getDatabaseInstance)();
            return yield dbInstance.collection(this.collectionName).findOne({ _id: eventId });
        });
    }
}
exports.default = EventoRepository;
