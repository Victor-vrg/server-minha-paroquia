
import { ObjectId } from 'mongodb';

interface ParoquiaModel {
  _id: ObjectId;
  NomeParoquia: string;
  Padres: string;
  CEP: string;
  LocalizacaoParoquia: string;
  Bairro: string;
  InformacoesAdicionais: string;
  EmailResponsavel: string;
}

export default ParoquiaModel;
