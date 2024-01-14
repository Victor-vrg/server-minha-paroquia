import { Db, ObjectId } from 'mongodb';
import { getDatabaseInstance } from '../database/mongo';
import EventosModel from '../models/eventosModel';
import UsuarioModel from '../models/usuarioModel';

class EventoRepository {
  private collectionName: string;

  constructor() {
    this.collectionName = 'Eventos';
  }

  public async getEventosDestacados(): Promise<EventosModel[]> {
    const dbInstance: Db = getDatabaseInstance();
    return await dbInstance.collection<EventosModel>(this.collectionName).find({ Destaque: {$eq: true } }).toArray();
  }

  public async getEventos(): Promise<EventosModel[]> {
    const dbInstance: Db = getDatabaseInstance();
    return await dbInstance.collection<EventosModel>(this.collectionName).find().toArray();
  }

  public async createEvento(evento: EventosModel): Promise<ObjectId> {
    const dbInstance: Db = getDatabaseInstance();
    const result = await dbInstance.collection<EventosModel>(this.collectionName).insertOne(evento);
    return result.insertedId as ObjectId;
  }

  public async updateEvento(eventId: string, updatedEvento: EventosModel): Promise<void> {
    const dbInstance: Db = getDatabaseInstance();
    await dbInstance.collection(this.collectionName).updateOne({ _id: new ObjectId(eventId) }, { $set: updatedEvento });
  }

  public async deleteEvento(eventId: ObjectId): Promise<void> {
    const dbInstance: Db = getDatabaseInstance();
    await dbInstance.collection(this.collectionName).deleteOne({ _id: new ObjectId(eventId) });
  }

  public async getUsuario(UserId: ObjectId): Promise<UsuarioModel | null> {
    const dbInstance: Db = getDatabaseInstance();
    return await dbInstance.collection<UsuarioModel>('Usuarios').findOne({_id: UserId });
  }
}

export default EventoRepository;
