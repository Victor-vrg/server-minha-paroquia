import { Request, Response } from 'express';
import ServicoComunitarioRepository from '../Repository/servicoComunitarioRepository';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { config } from 'dotenv';
import UsuarioModel from '../models/usuarioModel';

config(); 

const servicoComunitarioRepository = new ServicoComunitarioRepository();

export const getNivelAcessoUsuarioAbaixoDe5 = async (req: Request & { user?: any }, res: Response) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const secretKey = process.env.secretKey as Secret;
    const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
    const UserId = decodedToken.UserId;

    const servicosComunitarios = await servicoComunitarioRepository.getNivelAcessoUsuarioAbaixoDe5(UserId);

    res.json(servicosComunitarios);
    console.log(servicosComunitarios);
  } catch (error) {
    console.error('Erro ao obter nível de acesso do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getAllNivelAcessoUsuario = async (req: Request & { user?: any }, res: Response) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const secretKey = process.env.secretKey as Secret;
    const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
    const UserId = decodedToken.UserId;
    
    console.log("userId", UserId)
    const servicosComunitarios = await servicoComunitarioRepository.getAllNivelAcessoUsuario(UserId);

    res.json(servicosComunitarios);
    console.log(servicosComunitarios);
  } catch (error) {
    console.error('Erro ao obter nível de acesso do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getServicosComunitariosDoUsuario = async (req: Request & { user?: any }, res: Response) => {
  const { usuarioId } = req.params; // Obtém o ID do usuário a partir dos parâmetros da rota

  // Sua lógica para buscar os serviços comunitários específicos do usuário aqui...
  try {
    const servicosComunitarios = await servicoComunitarioRepository.getAllNivelAcessoUsuario(usuarioId);

    res.json(servicosComunitarios);
    console.log(servicosComunitarios);
  } catch (error) {
    console.error('Erro ao obter serviços comunitários do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};