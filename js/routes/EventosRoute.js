"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EventosController_1 = require("../controllers/EventosController");
const router = express_1.default.Router();
router.get('/destaque', EventosController_1.getEventosDestacados);
router.get('/eventos', EventosController_1.getEventos);
//router.put('/editar-evento/:id', verifyToken, editarEventos);
//router.post('/criar', verifyToken,  createEvento)
router.put('/editar-evento/:id', EventosController_1.editarEventos);
router.post('/criar', EventosController_1.createEvento);
exports.default = router;
