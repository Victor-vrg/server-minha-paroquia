import { Request, Response } from 'express';
import FeedbackRepository from '../Repository/feedbackRepository';

const feedbackRepository = new FeedbackRepository();

export const addFeedback = async (req: Request, res: Response) => {
  try {
    const { NomeUsuario, Email, Mensagem } = req.body;
    const feedback = { NomeUsuario, Email, Mensagem, DataEnvio: new Date().toISOString() };
    await feedbackRepository.addFeedback(feedback);
    res.status(201).json({ message: 'Feedback adicionado com sucesso' });
  } catch (error) {
    console.error('Erro ao adicionar feedback:', error);
    res.status(500).json({ error: 'Erro ao adicionar feedback' });
  }
};

export const getFeedbacks = async (req: Request, res: Response) => {
  try {
    const feedbacks = await feedbackRepository.getFeedbacks();
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Erro ao buscar feedbacks:', error);
    res.status(500).json({ error: 'Erro ao buscar feedbacks' });
  }
};

