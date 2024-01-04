"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TokenController_1 = require("../controllers/TokenController");
const router = express_1.default.Router();
router.post('/enviar-email-recuperacao', TokenController_1.enviarEmailRecuperacao);
router.post('/verificar-token-recuperacao', TokenController_1.verificarTokenRecuperacao);
exports.default = router;
