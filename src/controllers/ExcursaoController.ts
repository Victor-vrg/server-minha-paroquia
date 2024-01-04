import { Request, Response } from 'express';
import ExcursaoRepository from '../Repository/excursoesRepository';

const excursaoRepository = new ExcursaoRepository();

export const getExcursoesDestacadas = async (req: Request, res: Response) => {
  try {
    const excursoesDestacadas = await excursaoRepository.getExcursoesDestacadas();
  //  console.log('Excursões Destacadas:', excursoesDestacadas);
    res.json(excursoesDestacadas);
  } catch (error) {
    console.error('Erro ao buscar excursões destacadas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getExcursoes = async (req: Request, res: Response) => {
  try {
    const excursao = await excursaoRepository.getExcursoes();
 //   console.log('Excursões:', excursao);
    res.json(excursao);
  } catch (error) {
    console.error('Erro ao buscar excursões:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

