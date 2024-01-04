import { ObjectId } from 'mongodb';

interface EventosServicosComunitarios {
  _id?: ObjectId ; 
  EventoID: ObjectId | string;
  ServicoComunitarioID: string[]; 
}

export default EventosServicosComunitarios;
