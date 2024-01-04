import { Db } from 'mongodb';
import { getDatabaseInstance } from '../database/mongo';
import ExcursaoModel from '../models/ExcursaoModel';

class ExcursaoRepository {
  private collectionName: string;

  constructor() {
    this.collectionName = 'Excursoes';
  }

  public async getExcursoesDestacadas(): Promise<ExcursaoModel[]> {
    const dbInstance: Db = getDatabaseInstance();
    return await dbInstance.collection<ExcursaoModel>(this.collectionName).find({ Destaque: { $gt: 0 } }).toArray();
  }

  public async getExcursoes(): Promise<ExcursaoModel[]> {
    const dbInstance: Db = getDatabaseInstance();
    return await dbInstance.collection<ExcursaoModel>(this.collectionName).find().toArray();
  }

}

export default ExcursaoRepository;
