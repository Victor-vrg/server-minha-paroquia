import { Request, Response } from 'express';
import ParoquiaRepository from '../Repository/paroquiaRepository';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const paroquiaRepository = new ParoquiaRepository();

export const obterParoquiaMaisFrequentada = async (req: Request, res: Response) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const secretKey = process.env.secretKey as Secret;
    const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
    const paroquiaMaisFrequentada = decodedToken.ParoquiaMaisFrequentada;

    const paroquia = await paroquiaRepository.obterParoquiaPorNome(paroquiaMaisFrequentada);

    if (paroquia) {
      res.json(paroquia);
    } else {
      res.status(404).json({ error: 'Paróquia mais frequentada não encontrada' });
    }
  } catch (error) {
    console.error('Erro ao obter paróquia mais frequentada:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const atualizarParoquia = async (req: Request, res: Response): Promise<void> => {
  try {
    const idParam = req.params.id;

    if (!ObjectId.isValid(idParam)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }

    const id = new ObjectId(idParam); 
    const atualizacoes = req.body; 

    await paroquiaRepository.atualizarParoquia(id, atualizacoes);
    
    res.json({ message: 'Paróquia atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar paróquia:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};


export const obterSugestoesParoquias = async (req: Request, res: Response): Promise<void> => {
  try {
    const searchText = req.query.s as string;

    if (!searchText.trim()) {
      res.status(400).json({ error: 'Texto de busca inválido' });
      return;
    }

    const sugestoes = await paroquiaRepository.obterSugestoesParoquias(searchText);
    res.json(sugestoes);
  } catch (error) {
    console.error('Erro ao buscar sugestões de paróquias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const obterParoquiaPorNome = async (req: Request, res: Response): Promise<void> => {
  try {
    const nomeParoquia = req.params.nomeParoquia as string;
    const paroquia = await paroquiaRepository.obterParoquiaPorNome(nomeParoquia);

    if (paroquia) {
      res.json(paroquia);
    } else {
      res.status(404).json({ error: 'Paróquia não encontrada' });
    }
  } catch (error) {
    console.error('Erro ao buscar informações da paróquia:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
  
};