import { NextFunction, Request, Response } from "express";
import EventosModel from "../models/eventosModel";
import EventoRepository from "../Repository/eventoRepository";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { checkUserAccess } from "../middleware";
import servicoComunitarioRepository from "../Repository/servicoComunitarioRepository";
import UsuarioRepository from "../Repository/UsuarioRepository";

const usuarioRepository = new UsuarioRepository();
const eventoRepository = new EventoRepository();
const ServicoComunitarioRepository = new servicoComunitarioRepository();

export const getEventosDestacados = async (req: Request, res: Response) => {
  try {
    const eventosDestacados = await eventoRepository.getEventosDestacados();
    // console.log('Eventos Destacados:', eventosDestacados);
    res.json(eventosDestacados);
  } catch (error) {
    console.error("Erro ao buscar eventos destacados:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getEventos = async (req: Request, res: Response) => {
  try {
    const eventos = await eventoRepository.getEventos();
    // console.log('Eventos:', eventos);
    res.json(eventos);
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const createEvento = async (req: Request, res: Response, next: NextFunction) => {
  console.log("Entrou na função createEvento");

  const token = req.header('Authorization');
  console.log('Token:', token);

  if (!token) {
    console.log("Token não fornecido");
    return res.status(401).json({ error: 'Token não fornecido' });
    
  }

  try {
    const secretKey = process.env.secretKey as Secret;
    const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
    console.log('Token decodificado:', decodedToken);
    const UserId: ObjectId = decodedToken.UserId;
    const user = await usuarioRepository.getUserById(UserId);

    if (!user) {
      console.log("Usuário associado ao token não encontrado");
      return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
    
    }
 
    const {
      NomeEvento,
      DataInicio,
      DataFim,
      HoraInicio,
      HoraFim,
      LocalizacaoEvento,
      DescricaoEvento,
      CaminhoImagem,
      TipoEvento,
      Destaque,
      Ocultar,
      IDServicoComunitario,
    } = req.body;

    
    console.log("servicosComunitarios", IDServicoComunitario);
// Verifica se IDServicoComunitario está presente antes de verificar o acesso
if (IDServicoComunitario !== undefined && IDServicoComunitario !== null) {
  // Espera a conclusão da função checkUserAccess antes de prosseguir
  const accessResult = await checkUserAccess(IDServicoComunitario, req, res);

  // Verifica se o acesso foi concedido antes de continuar
  if (!accessResult) {
    return res.status(403).json({ error: 'Acesso não autorizado para este serviço comunitário' });
  }
}
    const newEvento: EventosModel = {
      _id: new ObjectId(),
      NomeEvento,
      DataInicio,
      DataFim,
      HoraInicio,
      HoraFim,
      LocalizacaoEvento,
      DescricaoEvento,
      CaminhoImagem,
      TipoEvento,
      Destaque,
      Ocultar,
      ParoquiaID: user.ParoquiaMaisFrequentada ?? null,
    };

    // Associa o evento aos serviços comunitários na coleção separada
    console.log('Novo evento a ser criado:', newEvento);
    const eventId = await eventoRepository.createEvento(newEvento);
    console.log('Evento criado com sucesso. ID:', eventId ," pelo usuario:", UserId );

    
      const relacaoEventoServico = {
        EventoID: newEvento._id,
        NomeEvento: NomeEvento,
        DataInicio: DataInicio,
        DataFim: DataFim,
        ServicoComunitarioID : IDServicoComunitario,
      };
      console.log(relacaoEventoServico)
      await ServicoComunitarioRepository.insertEventoServicoComunitario(relacaoEventoServico);
      

     res.status(201).json({ message: 'Evento criado com sucesso', eventId });
    console.log('Novo evento criado:', eventId);
    return;
    
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
    return;
  }
};

export const editarEventos = async (req: Request, res: Response) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    const secretKey = process.env.secretKey as Secret;
    const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
    const user = await eventoRepository.getUsuario(decodedToken.UserId);

    if (!user) {
      return res
        .status(401)
        .json({ error: "Usuário associado ao token não encontrado" });
    }

    const eventId = req.params.id;

    const {
      NomeEvento,
      DataInicio,
      DataFim,
      HoraInicio,
      HoraFim,
      LocalizacaoEvento,
      DescricaoEvento,
      CaminhoImagem,
      TipoEvento,
      Destaque,
      IDServicoComunitario,
    } = req.body;

    const updatedEvento: EventosModel = {
      NomeEvento,
      DataInicio,
      DataFim,
      HoraInicio,
      HoraFim,
      LocalizacaoEvento,
      DescricaoEvento,
      CaminhoImagem,
      TipoEvento,
      Destaque,
      Ocultar: false,
      ParoquiaID: user.ParoquiaMaisFrequentada ?? null,
     IDServicoComunitario,
      _id: new ObjectId(),
    };

    await eventoRepository.updateEvento(eventId, updatedEvento);
    res.json({ message: "Evento atualizado com sucesso" });
    console.log("Evento atualizado com sucesso:", eventId);
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
