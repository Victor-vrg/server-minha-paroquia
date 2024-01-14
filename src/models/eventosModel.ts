import { ObjectId } from 'mongodb';

interface EventosModel {
  _id?: ObjectId | any ; 
  NomeEvento: string;
  DataInicio: Date | string;
  DataFim: Date | string;
  HoraInicio: string ;
  HoraFim: string;
  LocalizacaoEvento: string;
  DescricaoEvento: string;
  CaminhoImagem: string;
  TipoEvento: string;
  Destaque: boolean ;
  Ocultar:   boolean | Number;
  ParoquiaID: string | ObjectId;
  IDServicoComunitario?: string[]; 
}

export default EventosModel;
