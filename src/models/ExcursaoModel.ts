import { ObjectId } from 'mongodb';

interface ExcursaoModel {
  _id: ObjectId;
  NomeExcursao: string;
  DataInicioExcursao: Date;
  DataFimExcursao: Date;
  HoraInicioExcursao: string;
  HoraFimExcursao: string;
  LocalizacaoExcursao: string;
  DescricaoExcursao: string;
  CaminhoImagem: string;
  PrecoExcursao: number;
  VagasExcursao: number;
  ParoquiaID:  ObjectId | null;
  Ocultar: number;
  Destaque: number;
}

export default ExcursaoModel;
