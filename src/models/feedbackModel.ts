import { ObjectId } from 'mongodb';

interface  FeedbackModel {
    id?: ObjectId;
    NomeUsuario: string;
    Email: string;
    Mensagem: string;
    DataEnvio: string;
}

export default FeedbackModel