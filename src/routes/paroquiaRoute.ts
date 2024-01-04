import { Router } from 'express';
import { obterSugestoesParoquias,obterParoquiaPorNome, obterParoquiaMaisFrequentada, atualizarParoquia} from '../controllers/paroquiacontrole'; 

const router = Router();

router.get('/paroquias', obterSugestoesParoquias); 
router.patch('/paroquias/:id', atualizarParoquia);  
router.get('/paroquias-nome/:nomeParoquia', obterParoquiaPorNome);
router.get('/paroquia-mais-frequentada', obterParoquiaMaisFrequentada);


export default router;
