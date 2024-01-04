import { Db, ObjectId, InsertOneResult} from "mongodb";
import { getDatabaseInstance } from "../database/mongo";
import ServicoComunitario from "../models/ServicoComunitarioModels";
import UsuariosServicosComunitarios from "../models/UsuariosServicosComunitarios";
import UsuariosServicosComunitariosModel from "../models/UsuariosServicosComunitariosModel";
import UsuarioModel from "../models/usuarioModel";

class ServicoComunitarioRepository {
  private collectionName: string;

  constructor() {
    this.collectionName = "ServicosComunitarios";
  }

  public async getNivelAcessoUsuarioAbaixoDe5(
    UserId: string | ObjectId
  ): Promise<UsuariosServicosComunitarios[]> {
    const dbInstance: Db = getDatabaseInstance();
    return await dbInstance
      .collection<UsuariosServicosComunitarios>("UsuariosServicosComunitarios")
      .find({ UsuarioID: UserId, NivelAcessoNoServico: { $lt: 5 } })
      .toArray();
  }

  public async getAllNivelAcessoUsuario(
    UserId: string | ObjectId
  ): Promise<UsuariosServicosComunitarios[]> {
    const dbInstance: Db = getDatabaseInstance();
    return await dbInstance
      .collection<UsuariosServicosComunitarios>("UsuariosServicosComunitarios")
      .find({ UsuarioID: UserId })
      .toArray();
  }

  public async getServicosComunitarios(): Promise<ServicoComunitario[]> {
    const dbInstance: Db = getDatabaseInstance();
    return await dbInstance
      .collection<ServicoComunitario>(this.collectionName)
      .find()
      .toArray();
  }

  public async insertEventoServicoComunitario(relacaoEventoServico: {
    EventoID: string | ObjectId;
    NomeEvento: string,
    DataInicio: string,
    DataFim: string,
    ServicoComunitarioID: string | ObjectId[];
  }): Promise<InsertOneResult<any>> {
    const dbInstance: Db = getDatabaseInstance();
    const eventosServicosCollection = dbInstance.collection('EventosServicosComunitarios');
    return await eventosServicosCollection.insertOne(relacaoEventoServico);
  }
  
  public async getUserAccess(UserId: string, IDServicoComunitario: string[]): Promise<UsuariosServicosComunitarios[] | null> {
    const dbInstance: Db = getDatabaseInstance();
    const usuarioServicoCollection = dbInstance.collection<UsuariosServicosComunitarios>('UsuariosServicosComunitarios');

    try {
      const result = await usuarioServicoCollection.find({
        UsuarioID: UserId,
        _id: { $in: IDServicoComunitario },
      }).toArray();
      return result;
    } catch (error) {
      console.error("Erro durante a consulta ao banco de dados:", error);
      return null;
    }
  }


}


export default ServicoComunitarioRepository;
