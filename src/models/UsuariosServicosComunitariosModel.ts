import { ObjectId } from "mongodb";

interface UsuariosServicosComunitariosModel {
    _id?: string | ObjectId;
    UsuarioID:  string;
    nomeServicoComunitario: string;
    ServicoComunitarioID: string [];
    NivelAcessoNoServico: number;
    }

export default UsuariosServicosComunitariosModel;