import { Db, ObjectId } from 'mongodb';
import { getDatabaseInstance } from '../database/mongo';
import TokenModel from '../models/TokenModel';

class TokenRepository {
  private collectionName: string;

  constructor() {
    this.collectionName = 'Tokens';
  }

  public async insertToken(token: TokenModel): Promise<ObjectId> {
    const dbInstance: Db = getDatabaseInstance();
    const result = await dbInstance.collection<TokenModel>(this.collectionName).insertOne(token);
    return result.insertedId as unknown as ObjectId;
  }

  public async getTokenInfo(token: string): Promise<TokenModel | null> {
    const dbInstance: Db = getDatabaseInstance();
    return await dbInstance.collection<TokenModel>(this.collectionName).findOne({ Token: token, Expiracao: { $gte: new Date() } });
  }

  public async deleteToken(token: string): Promise<void> {
    const dbInstance: Db = getDatabaseInstance();
    await dbInstance.collection(this.collectionName).deleteOne({ Token: token });
  }

}

export default TokenRepository;
