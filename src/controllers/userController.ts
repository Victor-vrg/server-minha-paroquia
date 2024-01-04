import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import UsuarioRepository from '../Repository/UsuarioRepository';
import ServicoComunitarioRepository from '../Repository/servicoComunitarioRepository';
import { ObjectId } from 'mongodb';


const usuarioRepository = new UsuarioRepository();
const servicoComunitarioRepository = new ServicoComunitarioRepository();

export const getUsers = async (req: Request, res: Response) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  } try {

    const secretKey = process.env.secretKey as Secret;
    const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
    const UserId: ObjectId = decodedToken.UserId;
    // const ParoquiaMaisFrequentada = 'Paróquia Teste'
    const ParoquiaMaisFrequentada = decodedToken.ParoquiaMaisFrequentada
    const user = await usuarioRepository.getUserById(UserId);

    if (!user) {
      return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
    }

    const users = await usuarioRepository.getUsersByParoquia(ParoquiaMaisFrequentada);
    console.log ("usuarios", users)
    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { NomeCompleto, Email, senha } = req.body;

  try {
    if (!NomeCompleto && !Email) {
      throw new Error('Nome Completo ou Email são necessários.');
    }

    const user = await usuarioRepository.getUserByEmailOrName(Email, NomeCompleto);

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const passwordMatch = await bcrypt.compare(senha, user.SenhaHash);

    if (!passwordMatch) {
      throw new Error('Senha incorreta.');
    }

    const secretKey = process.env.secretKey as Secret;
    const token = jwt.sign(
      {
        UserId: user._id,
        NomeCompleto: user.NomeCompleto,
        Email: user.Email,
        Telefone: user.Telefone,
        Bairro: user.Bairro,
        DataNascimento: user.DataNascimento,
        ParoquiaMaisFrequentada: user.ParoquiaMaisFrequentada,
        IDServicoComunitario: user.IDServicoComunitario,
      },
      secretKey,
      { expiresIn: '3h' }
    );
    const expiration = new Date(new Date().getTime() + 10800000);
    await usuarioRepository.insertOrUpdateToken(user._id as ObjectId , token, expiration);
    console.log('Token gerado:', token);
    res.json({ token });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

export const cadastrarUsuario = async (req: Request, res: Response) => {
  const {
    NomeCompleto,
    Email,
    Telefone,
    Bairro,
    ParoquiaMaisFrequentada,
    DataNascimento,
    IDServicoComunitario,
  } = req.body;

  try {
    const SenhaHash = await bcrypt.hash(req.body.senha, 10);
    console.log( "dados obrigatorios", NomeCompleto,Email,SenhaHash, IDServicoComunitario)
    const novoUsuario = await usuarioRepository.insertnewUser({
      NomeCompleto,
      Email,
      SenhaHash: SenhaHash,
      Telefone,
      Bairro,
      ParoquiaMaisFrequentada,
      DataNascimento,
      IDServicoComunitario,
    });

    if (novoUsuario) {
      res.json({ message: 'Usuário cadastrado com sucesso.', userId: novoUsuario });
    } else {
      res.status(500).json({ error: 'Erro interno do servidor ao cadastrar usuário.' });
    }
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getServicosComunitarios = async (req: Request, res: Response) => {
  try {
    const servicosComunitarios = await servicoComunitarioRepository.getServicosComunitarios();
    res.json(servicosComunitarios);
  } catch (error) {
    console.error('Erro ao buscar serviços comunitários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const editarPerfil = async (req: Request, res: Response) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const secretKey = process.env.secretKey as Secret;
    const decodedToken = jwt.verify(token, secretKey) as JwtPayload;

    const user = await usuarioRepository.getUserById(decodedToken.UserId);

    if (!user) {
      return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
    }

    const { NomeCompleto, Email, Telefone, Bairro, ParoquiaMaisFrequentada, DataNascimento, IDServicoComunitario, NovaSenha } = req.body;

    if (NomeCompleto) {
      user.NomeCompleto = NomeCompleto;
    }
    if (Email) {
      user.Email = Email;
    }
    if (Telefone) {
      user.Telefone = Telefone;
    }
    if (Bairro) {
      user.Bairro = Bairro;
    }
    if (ParoquiaMaisFrequentada) {
      user.ParoquiaMaisFrequentada = ParoquiaMaisFrequentada;
    }
    if (DataNascimento) {
      user.DataNascimento = DataNascimento;
    }
    if (IDServicoComunitario) {
      user.IDServicoComunitario = IDServicoComunitario;
    }
    if (NovaSenha) {
      const senhaHash = await bcrypt.hash(NovaSenha, 10);
      user.SenhaHash = senhaHash;
    }

    await usuarioRepository.updateProfile(decodedToken.UserId, user);

    res.json({ message: 'Perfil atualizado com sucesso' });
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

export const getUsuarioLogado = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const secretKey = process.env.secretKey as Secret;
    const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
    console.log("Decoded Token:", decodedToken);
    const UserId: ObjectId = decodedToken.UserId;
    const user = await usuarioRepository.getUserById(UserId);

    if (!user) {
      return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
    }

    const userData = {
      UserId: UserId,
      nomeCompleto: user.NomeCompleto,
      email: user.Email,
      telefone: user.Telefone,
      bairro: user.Bairro,
      dataNascimento: user.DataNascimento,
      paroquiaMaisFrequentada: user.ParoquiaMaisFrequentada,
      idServicoComunitario: user.IDServicoComunitario,
    };

    res.json(userData);
    console.log("seu userdata:",userData);
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};
