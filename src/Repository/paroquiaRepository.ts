
import { Db, ObjectId } from 'mongodb';
import { getDatabaseInstance } from '../database/mongo';
import ParoquiaModel from '../models/paroquiaModel';

class ParoquiaRepository {
  private collectionName: string;

  constructor() {
    this.collectionName = 'Paroquias';
  }

  public async obterSugestoesParoquias(searchText: string): Promise<ParoquiaModel[]> {
    const dbInstance: Db = getDatabaseInstance();
    const regex = new RegExp(searchText, 'i'); // "i" para tornar a pesquisa sem distinção entre maiúsculas e minúsculas
    return await dbInstance.collection<ParoquiaModel>(this.collectionName).find({ NomeParoquia: { $regex: regex } }).toArray();
  }

  public async atualizarParoquia(id: ObjectId, atualizacoes: Partial<ParoquiaModel>): Promise<void> {
    const dbInstance: Db = getDatabaseInstance();
    await dbInstance.collection<ParoquiaModel>(this.collectionName).updateOne({ _id: id }, { $set: atualizacoes });
  }

  public async obterParoquiaPorNome(nomeParoquia: string): Promise<ParoquiaModel | null> {
    const dbInstance: Db = getDatabaseInstance();
    return await dbInstance.collection<ParoquiaModel>(this.collectionName).findOne({ NomeParoquia: nomeParoquia });
  }
}

export default ParoquiaRepository;
