import { Request, Response } from 'express';
import ServicoComunitarioRepository from '../Repository/servicoComunitarioRepository';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { config } from 'dotenv';
import UsuarioModel from '../models/usuarioModel';
import { ObjectId } from 'mongodb';
import UsuarioRepository from '../Repository/UsuarioRepository';

config(); 



const usuarioRepository = new UsuarioRepository();
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

export const editarNivelAcesso = async (req: Request, res: Response) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const { UsuarioID, ServicoComunitarioID, NivelAcessoNoServico } = req.body;

    // Verifica se todos os parâmetros necessários estão presentes
    if (!UsuarioID || !ServicoComunitarioID || !NivelAcessoNoServico) {
      return res.status(400).json({ error: 'Parâmetros incompletos' });
    }

    console.log('Iniciando edição de nível de acesso...');
    console.log('UsuarioID:', UsuarioID);
    console.log('ServicoComunitarioID:', ServicoComunitarioID);
    console.log('NivelAcessoNoServico:', NivelAcessoNoServico);
    
    const usuario = await servicoComunitarioRepository.getUserById(UsuarioID);
    console.log('Usuário encontrado:', usuario);

    if (!usuario) {
      console.log('Usuário não encontrado');
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const servicoComunitario = await usuarioRepository.getServicoComunitarioById(new ObjectId(ServicoComunitarioID));
    console.log('Serviço comunitário encontrado:', servicoComunitario);

    if (!servicoComunitario) {
      console.log('Serviço comunitário não encontrado');
      return res.status(404).json({ error: 'Serviço comunitário não encontrado' });
    }

    // Atualiza o nível de acesso no serviço comunitário para o usuário
    await servicoComunitarioRepository.updateNivelAcessoServicoComunitario(
      UsuarioID,
      ServicoComunitarioID,
      NivelAcessoNoServico
    );

    console.log('Nível de acesso atualizado com sucesso');
    res.json({ message: 'Nível de acesso atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao editar nível de acesso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
