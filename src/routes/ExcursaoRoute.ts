import express from 'express';
import { getExcursoesDestacadas, getExcursoes } from '../controllers/ExcursaoController';

const router = express.Router();

router.get('/destaqueEx', getExcursoesDestacadas);
router.get('/excursao', getExcursoes);

export default router;