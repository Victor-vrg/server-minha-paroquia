import jwt, { JwtPayload, Secret } from 'jsonwebtoken'; 
import { NextFunction, Request, Response } from 'express';
import { Db, ObjectId } from 'mongodb';
import { getDatabaseInstance } from './database/mongo'; 
import UsuarioRepository from './Repository/UsuarioRepository';
import ServicoComunitarioRepository from './Repository/servicoComunitarioRepository'


require('dotenv').config()
  
const usuarioRepository = new UsuarioRepository();
const servicoComunitarioRepository = new ServicoComunitarioRepository();

export const verifyToken = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');
  console.log(' token recebido no verifyToken do servidor:', token);
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
 
  try {
    const secretKey = process.env.secretKey as Secret;
    const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
    
    const UserId: ObjectId = decodedToken.UserId;
    console.log ("UserId do verifyToken",UserId)

    const userdados = await usuarioRepository.getUserById( UserId);
   
    console.log( "dados do usuario", userdados)
    if (!userdados) {
      return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
    }
    req.user = {
      UserId: UserId,
      NomeCompleto: userdados.NomeCompleto,
      Email: userdados.Email,
      Telefone: userdados.Telefone,
      Bairro: userdados.Bairro,
      DataNascimento: userdados.DataNascimento,
      ParoquiaMaisFrequentada: userdados.ParoquiaMaisFrequentada,
      IDServicoComunitario: userdados.IDServicoComunitario,
    };
    next();
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

export const checkUserAccess = async (
  IDServicoComunitario: string[],
  req: Request & { user?: any },
  res: Response
) => {
  try {
    console.log("Iniciando função checkUserAccess ");
    console.log("IDServicoComunitario recebidos", IDServicoComunitario);

    const token = req.header('Authorization');
    console.log("Token:", token);

    if (!token) {
      console.log("Token não fornecido");
      return false;
    }

    const secretKey = process.env.secretKey as Secret;
    const decodedToken = jwt.verify(token, secretKey) as JwtPayload;

    const UserId = decodedToken.UserId;
    const usuario = decodedToken.NomeCompleto;
    console.log("UserID do usuário:", UserId);

    const user = await usuarioRepository.getUserById(UserId);
    console.log("Usuário encontrado:", user);

    if (!user) {
      console.log("Usuário associado ao token não encontrado");
      return false;
    }

    if (IDServicoComunitario.length === 0) {
      console.log("IDServicoComunitario está vazia. Acesso negado.");
      return false;
    }

    console.log("Usuario e IDServicoComunitario a ser utilizado na consulta:", usuario, IDServicoComunitario);

    const userAccessArray = await servicoComunitarioRepository.getUserAccess(UserId, IDServicoComunitario);

    console.log("Resultado da consulta ao banco de dados (userAccessArray):", userAccessArray);
    if (!userAccessArray || userAccessArray.length !== IDServicoComunitario.length) {
      console.log("Não foi possível verificar todos os serviços comunitários. Acesso negado.");
      return false;
    }

    const isAccessGranted = userAccessArray.every((access) => access?.NivelAcessoNoServico && access.NivelAcessoNoServico < 5);

    if (!isAccessGranted) {
      console.log("Acesso negado");
      return false;
    }

    console.log("Acesso concedido. Continuando...");
    return true;

  } catch (error) {
    console.log("Erro ao processar o token:", error);
    return false;
  }
};

