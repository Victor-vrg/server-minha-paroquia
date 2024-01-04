import { Db, ObjectId } from 'mongodb';
import { getDatabaseInstance } from '../database/mongo';
import UsuarioModel from '../models/usuarioModel';

class UsuarioRepository {
  private collectionName: string;

  constructor() {
    this.collectionName = 'Usuarios';
  }

  public async getUsersByParoquia(ParoquiaMaisFrequentada: string): Promise<UsuarioModel[]> {
    try {
      console.log("dado que chegou no repository", ParoquiaMaisFrequentada)
      const dbInstance: Db = getDatabaseInstance();
      const regex = new RegExp(ParoquiaMaisFrequentada, 'i'); 
  
      // Specify the fields you want to include/exclude in the projection
      const projection = {
        SenhaHash: 0        // Exclude SenhaHash field
      };
  
      return await dbInstance.collection<UsuarioModel>(this.collectionName)
        .find({ ParoquiaMaisFrequentada: { $regex: regex } }, { projection })
        .toArray();
    } catch (error) {
      console.error('Erro ao buscar usuários por paróquia:', error);
      return [];
    }
  }

  public async getUserByEmailOrName(email: string, nomeCompleto: string): Promise<UsuarioModel | null> {
    const dbInstance: Db = getDatabaseInstance();
    return await dbInstance.collection<UsuarioModel>(this.collectionName).findOne({ $or: [{ Email: email }, { NomeCompleto: nomeCompleto }] });
  }

  public async createUser(user: UsuarioModel): Promise<any> {
    const dbInstance: Db = getDatabaseInstance();
   await dbInstance.collection<UsuarioModel>(this.collectionName).insertOne(user);
   
  }

  public async updateProfile(UserId: ObjectId, updatedUser: UsuarioModel): Promise<void> {
    const dbInstance: Db = getDatabaseInstance();
    await dbInstance.collection(this.collectionName).updateOne({ _id: UserId }, { $set: updatedUser });
  }

  public async insertOrUpdateToken(UserId: ObjectId, token: string, expiration: Date): Promise<void> {
    const dbInstance: Db = getDatabaseInstance();
    const TokensCollection = dbInstance.collection('Tokens');
  
    // Verifique se já existe um token para o usuário
    const existingToken = await TokensCollection.findOne({ _id: UserId });
  
    if (existingToken) {
      // Se o token existir, atualize-o
      await TokensCollection.updateOne({ _id: UserId }, { $set: { token, expiration } });
    } else {
      // Se o token não existir, insira um novo documento
      const tokenDocument = {
        _id: UserId,
        token,
        expiration,
      };
  
      await TokensCollection.insertOne(tokenDocument);
    }
  }

  public async insertnewUser(user: UsuarioModel): Promise<ObjectId | null> {
    try {
      const dbInstance: Db = getDatabaseInstance();
      const result = await dbInstance.collection<UsuarioModel>(this.collectionName).insertOne(user);
      return result.insertedId;
    } catch (error) {
      console.error('Error inserting user:', error);
      return null;
    }
  }

  public async getUserById(UserId: ObjectId): Promise<UsuarioModel | null> {
    try {
      const dbInstance: Db = getDatabaseInstance();
      const isValidObjectId = ObjectId.isValid(UserId);
      const user = await dbInstance.collection<UsuarioModel>(this.collectionName).findOne({
        _id: isValidObjectId ? new ObjectId(UserId) : UserId
      });
      if (user) {
        return user;
        
      } else {
        console.log(`Usuário com ID ${UserId} não encontrado.`);
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      return null;
    }
  }
}

export default UsuarioRepository;
