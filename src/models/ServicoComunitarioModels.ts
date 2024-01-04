import { ObjectId } from 'mongodb';

interface ServicoComunitario {
  _id?: ObjectId;
  nomeServicoComunitario: string;
  DescricaoServico: string;
  ObjetivosServico: string;
  PublicoAlvoServico: string;
  TipoServicoComunitario: string;
  ParoquiaID: string;
  Ativo: boolean;
  UsuarioID: string;
  NivelAcessoNoServico: number;
}

export default ServicoComunitario;