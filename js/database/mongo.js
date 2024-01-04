"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseInstance = exports.initializeDatabase = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const { MONGODB_URL, MONGODB_USER, MONGODB_PASS } = process.env;
let dbInstance = null;
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield mongodb_1.MongoClient.connect(`mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}${MONGODB_URL}`, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Conectado ao MongoDB Atlas!');
        return client;
    }
    catch (error) {
        console.error('Erro ao conectar ao MongoDB Atlas:', error);
        throw error;
    }
});
const initializeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield connectToDatabase();
    dbInstance = client.db('minha-paroquia');
    // await createCollections();
    // await insertTestData();
    console.log('banco de dados iniciado!');
});
exports.initializeDatabase = initializeDatabase;
const getDatabaseInstance = () => {
    if (!dbInstance) {
        throw new Error('Banco de dados não inicializado.');
    }
    return dbInstance;
};
exports.getDatabaseInstance = getDatabaseInstance;
const createCollections = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = (0, exports.getDatabaseInstance)();
        // Paroquias Collection
        yield db.createCollection('Paroquias', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['NomeParoquia', 'CEP', 'EmailResponsavel'],
                    properties: {
                        ParoquiaID: { bsonType: 'string' },
                        NomeParoquia: { bsonType: 'string' },
                        Padres: { bsonType: 'string' },
                        CEP: { bsonType: 'string' },
                        LocalizacaoParoquia: { bsonType: 'string' },
                        Bairro: { bsonType: 'string' },
                        InformacoesAdicionais: { bsonType: 'string' },
                        EmailResponsavel: { bsonType: 'string' }
                    }
                }
            }
        });
        // ServicosComunitarios Collection
        yield db.createCollection('ServicosComunitarios', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['nomeServicoComunitario', 'DescricaoServico', 'ParoquiaID'],
                    properties: {
                        nomeServicoComunitario: { bsonType: 'string' },
                        DescricaoServico: { bsonType: 'string' },
                        ObjetivosServico: { bsonType: 'string' },
                        PublicoAlvoServico: { bsonType: 'string' },
                        TipoServicoComunitario: { bsonType: 'string' },
                        ParoquiaID: { bsonType: 'int' },
                        Ativo: { bsonType: 'bool' }
                    }
                }
            }
        });
        // Usuarios Collection
        yield db.createCollection('Usuarios', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['NomeCompleto', 'Email', 'SenhaHash'],
                    properties: {
                        NomeCompleto: { bsonType: 'string' },
                        Email: { bsonType: 'string' },
                        SenhaHash: { bsonType: 'string' },
                        Telefone: { bsonType: 'string' },
                        Bairro: { bsonType: 'string' },
                        DataNascimento: { bsonType: 'date' },
                        ParoquiaMaisFrequentada: { bsonType: 'int' },
                        IDServicoComunitario: { bsonType: 'array' }, items: { bsonType: 'objectId' }
                    }
                }
            }
        });
        // Feedback Collection
        yield db.createCollection('Feedback', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['NomeUsuario', 'Email'],
                    properties: {
                        NomeUsuario: { bsonType: 'string' },
                        Email: { bsonType: 'string' },
                        Mensagem: { bsonType: 'string' },
                        DataEnvio: { bsonType: 'date' }
                    }
                }
            }
        });
        // Eventos Collection
        yield db.createCollection('Eventos', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['NomeEvento', 'DataInicio', 'DataFim', 'DescricaoEvento', 'LocalizacaoEvento'],
                    properties: {
                        NomeEvento: { bsonType: 'string' },
                        DataInicio: { bsonType: 'date' },
                        DataFim: { bsonType: 'date' },
                        HoraInicio: { bsonType: 'string' },
                        HoraFim: { bsonType: 'string' },
                        LocalizacaoEvento: { bsonType: 'string' },
                        DescricaoEvento: { bsonType: 'string' },
                        CaminhoImagem: { bsonType: 'string' },
                        TipoEvento: { bsonType: 'string' },
                        Destaque: { bsonType: 'bool' },
                        Ocultar: { bsonType: 'bool' },
                        ParoquiaID: { bsonType: 'string' }
                    }
                }
            }
        });
        // EventosServicosComunitarios Collection
        yield db.createCollection('EventosServicosComunitarios', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['EventoID', 'ServicoComunitarioID'],
                    properties: {
                        EventoID: { bsonType: 'string' },
                        ServicoComunitarioID: { bsonType: 'string' }
                    }
                }
            }
        });
        // Excursoes Collection
        yield db.createCollection('Excursoes', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['NomeExcursao', 'ParoquiaID'],
                    properties: {
                        NomeExcursao: { bsonType: 'string' },
                        DescricaoExcursao: { bsonType: 'string' },
                        DataInicioExcursao: { bsonType: 'date' },
                        DataFimExcursao: { bsonType: 'date' },
                        HoraInicioExcursao: { bsonType: 'string' },
                        HoraFimExcursao: { bsonType: 'string' },
                        LocalizacaoExcursao: { bsonType: 'string' },
                        PrecoExcursao: { bsonType: 'double' },
                        VagasExcursao: { bsonType: 'int' },
                        ParoquiaID: { bsonType: 'string' },
                        CaminhoImagem: { bsonType: 'string' },
                        Destaque: { bsonType: 'bool' },
                        Ocultar: { bsonType: 'bool' }
                    }
                }
            }
        });
        // Inscricoes Collection
        yield db.createCollection('Inscricoes', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['UsuarioID', 'ServicoComunitarioID', 'DataInscricao'],
                    properties: {
                        UsuarioID: { bsonType: 'string' },
                        ServicoComunitarioID: { bsonType: 'string' },
                        DataInscricao: { bsonType: 'date' }
                    }
                }
            }
        });
        // ParticipacoesEventos Collection
        yield db.createCollection('ParticipacoesEventos', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['UsuarioID', 'EventoID', 'Participacao'],
                    properties: {
                        UsuarioID: { bsonType: 'string' },
                        EventoID: { bsonType: 'string' },
                        Participacao: { bsonType: 'string', enum: ['Sim', 'Talvez', 'Não'] }
                    }
                }
            }
        });
        // SolicitacoesServicosComunitarios Collection
        yield db.createCollection('SolicitacoesServicosComunitarios', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['NomeServicoComunitario', 'SolicitanteID', 'DataSolicitacao'],
                    properties: {
                        NomeServicoComunitario: { bsonType: 'string' },
                        DescricaoServico: { bsonType: 'string' },
                        ObjetivosServico: { bsonType: 'string' },
                        PublicoAlvoServico: { bsonType: 'string' },
                        StatusSolicitacao: { bsonType: 'string', enum: ['Pendente', 'Aprovada', 'Rejeitada'] },
                        JustificativaAprovacao: { bsonType: 'string' },
                        SolicitanteID: { bsonType: 'string' },
                        DataSolicitacao: { bsonType: 'date' }
                    }
                }
            }
        });
        // ExcursaoServicoComunitario Collection
        yield db.createCollection('ExcursaoServicoComunitario', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['ExcursaoID', 'ServicoComunitarioID'],
                    properties: {
                        ExcursaoID: { bsonType: 'string' },
                        ServicoComunitarioID: { bsonType: 'string' }
                    }
                }
            }
        });
        // Tokens Collection
        yield db.createCollection('Tokens', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['UserID', 'Token', 'Expiracao'],
                    properties: {
                        UserID: { bsonType: 'string' },
                        Token: { bsonType: 'string' },
                        Expiracao: { bsonType: 'date' }
                    }
                }
            }
        });
        // LogAtividades Collection
        yield db.createCollection('LogAtividades', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['UsuarioID', 'TipoAcao'],
                    properties: {
                        UsuarioID: { bsonType: 'string' },
                        DataHora: { bsonType: 'date' },
                        TipoAcao: { bsonType: 'string' },
                        RecursoAfetado: { bsonType: 'string' },
                        DetalhesAcao: { bsonType: 'string' }
                    }
                }
            }
        });
        // UsuariosServicosComunitarios Collection
        yield db.createCollection('UsuariosServicosComunitarios', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['UsuarioID', 'nomeServicoComunitario', 'ServicoComunitarioID', 'NivelAcessoNoServico'],
                    properties: {
                        UsuarioID: { bsonType: 'string' },
                        nomeServicoComunitario: { bsonType: 'string' },
                        ServicoComunitarioID: { bsonType: 'string' },
                        NivelAcessoNoServico: { bsonType: 'int' }
                    }
                }
            }
        });
        console.log('Coleções criadas com sucesso.');
    }
    catch (error) {
        console.error('Erro na criação de coleções:', error);
        throw error;
    }
});
const insertTestData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = (0, exports.getDatabaseInstance)();
        yield db.collection('Eventos').insertMany([
            {
                NomeEvento: 'Missa da Manhã',
                DataInicio: new Date('2023-11-28T08:00:00Z'),
                DataFim: new Date('2023-11-28T09:00:00Z'),
                HoraInicio: '08:00:00',
                HoraFim: '09:00:00',
                LocalizacaoEvento: 'Igreja Paroquial',
                DescricaoEvento: 'Missa matinal de domingo.',
                CaminhoImagem: '/img/eventos/missa.jpg',
                TipoEvento: 'Missa',
                Destaque: true,
                Ocultar: false,
                ParoquiaID: "a1",
            },
            {
                NomeEvento: 'Missa da Noite',
                DataInicio: new Date('2023-11-28T18:00:00Z'),
                DataFim: new Date('2023-11-28T19:00:00Z'),
                HoraInicio: '18:00:00',
                HoraFim: '19:00:00',
                LocalizacaoEvento: 'Igreja Paroquial',
                DescricaoEvento: 'Missa noturna de domingo.',
                CaminhoImagem: 'https://drive.google.com/uc?id=1iPJR6fwW0Jv4BDCp_bhzcagrTpErxsGR',
                TipoEvento: 'Missa',
                Destaque: false,
                Ocultar: false,
                ParoquiaID: "1aa",
            },
            {
                NomeEvento: 'Catequese Infantil',
                DataInicio: new Date('2023-11-11T08:00:00Z'),
                DataFim: new Date('2023-11-11T09:00:00Z'),
                HoraInicio: '08:00:00',
                HoraFim: '09:00:00',
                LocalizacaoEvento: 'Salão Paroquial',
                DescricaoEvento: 'Aula de catequese para crianças.',
                CaminhoImagem: '/img/eventos/catequese.jpg',
                TipoEvento: 'Catequese',
                Destaque: true,
                Ocultar: false,
                ParoquiaID: "e12",
            },
            {
                NomeEvento: 'Grupo de Jovens',
                DataInicio: new Date('2023-11-11T15:00:00Z'),
                DataFim: new Date('2023-11-11T16:30:00Z'),
                HoraInicio: '14:00:00',
                HoraFim: '15:00:00',
                LocalizacaoEvento: 'Salão Paroquial',
                DescricaoEvento: 'Reunião do grupo de jovens.',
                CaminhoImagem: 'https://drive.google.com/uc?id=14mQ6BF1nXFuR_sxa02mImNF-W8mN6You',
                TipoEvento: 'Encontro',
                Destaque: false,
                Ocultar: false,
                ParoquiaID: "12a",
            },
        ]);
        console.log('Dados de teste inseridos com sucesso!');
    }
    catch (error) {
        console.error('Erro ao inserir dados de teste:', error);
        throw error;
    }
});
