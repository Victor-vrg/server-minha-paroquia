import { ObjectId } from 'mongodb';

interface UsuarioModel {
  _id?: ObjectId;
  NomeCompleto: string,
  Email: string;
  Telefone?: string | null;
  Bairro?: string | null;
  DataNascimento?: string | null;
  ParoquiaMaisFrequentada?: any;
  IDServicoComunitario?: ObjectId[] | null;
  SenhaHash: string;
}

export default UsuarioModel;