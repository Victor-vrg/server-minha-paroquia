import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import TokenRepository from '../Repository/TokenRepository';
import TokenModel from '../models/TokenModel';
import { ObjectId } from 'mongodb';
import { getDatabaseInstance } from '../database/mongo';  // Importe a função getDatabaseInstance

const emailService = process.env.EMAIL_SERVICE;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

const tokenRepository = new TokenRepository();

export const enviarEmailRecuperacao = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    // Verifique se o e-mail está associado a um usuário
    // Agora utilize a função getDatabaseInstance para obter a instância do MongoDB
    const user = await getDatabaseInstance().collection('Usuarios').findOne({ Email: email });

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    // Gere um token de recuperação
    const token = generateRandomToken();
    const expiracao = new Date(new Date().getTime() + 3600000);

    // Insira o token no MongoDB
    const tokenData: TokenModel = {
      UserID: user.id,  // Ajuste conforme a estrutura do seu usuário no MongoDB
      Token: token,
      Expiracao: expiracao,
    };
    const insertedTokenId = await tokenRepository.insertToken(tokenData);

    // Configure o serviço de e-mail
    const transporter = nodemailer.createTransport({
      service: emailService,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // Configure as opções de e-mail
    const mailOptions = {
      from: emailUser,
      to: email,
      subject: 'Recuperação de Senha',
      text: `Use o código a seguir para recuperar sua senha: ${token}`,
    };

    // Envie o e-mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erro ao enviar o email:', error);
        res.status(500).json({ error: 'Erro ao enviar o email de recuperação.' });
      } else {
        res.json({ message: 'Email de recuperação enviado com sucesso.' });
      }
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

export const verificarTokenRecuperacao = async (req: Request, res: Response) => {
  const { token, novaSenha } = req.body;

  try {
    // Verifique o token no MongoDB
    const tokenInfo = await tokenRepository.getTokenInfo(token);

    if (!tokenInfo) {
      throw new Error('Token inválido ou expirado.');
    }

    // Atualize a senha no MongoDB
    const senhaHash = await bcrypt.hash(novaSenha, 10);
    await getDatabaseInstance().collection('Usuarios').updateOne({ _id: new ObjectId(tokenInfo.UserID) }, { $set: { SenhaHash: senhaHash } });

    // Delete o token do MongoDB após a verificação
    if (tokenInfo && tokenInfo._id) {
      await tokenRepository.deleteToken(tokenInfo._id.toString());
    } else {
      console.error('TokenInfo ou tokenInfo._id é indefinido ou nulo.'); }

    res.json({ message: 'Senha redefinida com sucesso.' });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

function generateRandomToken(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  const tokenLength = 8;

  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }

  return token;
}
