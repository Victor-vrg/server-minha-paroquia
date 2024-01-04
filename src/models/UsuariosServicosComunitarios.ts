import { ObjectId } from "mongodb";

interface UsuariosServicosComunitarios {
  _id?: string | ObjectId;
  UsuarioID: string | ObjectId;
  nomeServicoComunitario: string;
  ServicoComunitarioID: string;
  NivelAcessoNoServico: number;
}

export default UsuariosServicosComunitarios;
