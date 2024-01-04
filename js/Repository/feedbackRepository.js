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
class FeedbackRepository {
    constructor() {
        this.collectionName = 'Feedbacks';
    }
    addFeedback(feedback) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = (0, mongo_1.getDatabaseInstance)();
            yield dbInstance.collection(this.collectionName).insertOne(feedback);
        });
    }
    getFeedbacks() {
        return __awaiter(this, void 0, void 0, function* () {
            const dbInstance = (0, mongo_1.getDatabaseInstance)();
            return yield dbInstance.collection(this.collectionName).find().sort({ _id: -1 }).toArray();
        });
    }
}
exports.default = FeedbackRepository;
