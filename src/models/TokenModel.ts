import { ObjectId } from 'mongodb';

interface TokenModel {
  _id?: ObjectId;
  UserID: string;
  Token: string;
  Expiracao: Date;
}

export default TokenModel;
