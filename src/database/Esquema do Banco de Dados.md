## Tabela Feedback
- **ID**: Chave primária que identifica exclusivamente cada feedback.
- **NomeUsuario**: O nome do usuário que enviou o feedback.
- **Email**: O endereço de e-mail do usuário.
- **Mensagem**: O conteúdo do feedback.
- **DataEnvio**: A data e hora em que o feedback foi enviado.

## Tabela Eventos
- **ID**: Chave primária que identifica exclusivamente cada evento.
- **NomeEvento**: O nome do evento.
- **DataInicio**: Data de início do evento.
- **DataFim**: Data de término do evento.
- **HoraInicio**: Hora de início do evento.
- **HoraFim**: Hora de término do evento.
- **LocalizacaoEvento**: A localização do evento.
- **DescricaoEvento**: Uma descrição textual do evento.
- **CaminhoImagem**: O caminho para uma imagem relacionada ao evento.
- **TipoEvento**: O tipo ou categoria do evento.
- **Participacao**: Uma indicação da participação no evento, que pode ser "Sim", "Talvez" ou "Não".
- **Destaque**: Um valor inteiro que indica se o evento é destacado (1 para destacado, 0 para não destacado).
- **ParoquiaID**: Uma chave estrangeira que se relaciona com a tabela "Paroquias", representando a paróquia associada a este evento.

## Tabela Eventos_ServicosComunitarios
- **EventoID**: Chave estrangeira que se relaciona com a tabela "Eventos", representando o evento ao qual o serviço comunitário está vinculado.
- **ServicoComunitarioID**: Chave estrangeira que se relaciona com a tabela "ServicosComunitarios", representando o serviço comunitário associado ao evento. Esta tabela é uma tabela de junção que permite relacionar eventos a serviços comunitários em uma relação muitos-para-muitos.

## Tabela Excursoes
- **ID**: Chave primária que identifica exclusivamente cada excursão.
- **NomeExcursao**: O nome da excursão.
- **DescricaoExcursao**: Uma descrição textual da excursão.
- **DataInicioExcursao**: Data de início da excursão.
- **DataFimExcursao**: Data de término da excursão.
- **HoraInicioExcursao**: Hora de início da excursão.
- **HoraFimExcursao**: Hora de término da excursão.
- **LocalizacaoExcursao**: A localização da excursão.
- **PrecoExcursao**: O preço da excursão.
- **VagasExcursao**: O número de vagas disponíveis para a excursão.
- **ParoquiaID**: Uma chave estrangeira que se relaciona com a tabela "Paroquias", representando a paróquia associada à excursão.
- **CaminhoImagem**: O caminho para uma imagem relacionada à excursão.
- **Destaque**: Um valor inteiro que indica se a excursão é destacada (1 para destacada, 0 para não destacada).

## Tabela Inscricoes
- **ID**: Chave primária que identifica exclusivamente cada inscrição.
- **UsuarioID**: Chave estrangeira que se relaciona com a tabela "Usuarios", representando o usuário que fez a inscrição.
- **ServicoComunitarioID**: Chave estrangeira que se relaciona com a tabela "ServicosComunitarios", representando o serviço comunitário para o qual a inscrição foi feita.
- **DataInscricao**: Data em que a inscrição foi feita.

## Tabela Paroquias
- **ID**: Chave primária que identifica exclusivamente cada paróquia.
- **NomeParoquia**: O nome da paróquia.
- **Padres**: Os padres associados à paróquia.
- **CEP**: Código de Endereçamento Postal da paróquia.
- **LocalizacaoParoquia**: A localização geográfica da paróquia.
- **Bairro**: O bairro onde a paróquia está localizada.
- **InformacoesAdicionais**: Informações adicionais sobre a paróquia.
- **EmailResponsavel**: O endereço de e-mail do responsável pela paróquia.

## Tabela ParticipacoesEventos
- **ID**: Chave primária que identifica exclusivamente cada participação em evento.
- **UsuarioID**: Chave estrangeira que se relaciona com a tabela "Usuarios", representando o usuário que está participando do evento.
- **EventoID**: Chave estrangeira que se relaciona com a tabela "Eventos", representando o evento em que o usuário está participando.
- **Participacao**: Uma indicação da participação no evento, que pode ser "Sim", "Talvez" ou "Não".

## Tabela ServicosComunitarios
- **ID**: Chave primária que identifica exclusivamente cada serviço comunitário.
- **nomeServicoComunitario**: O nome ou tipo de serviço comunitário.
- **DescricaoServico**: Uma descrição textual do serviço comunitário.
- **ObjetivosServico**: Os objetivos do serviço comunitário.
- **PublicoAlvoServico**: O público-alvo do serviço comunitário.
- **TipoServicoComunitario**: O tipo ou categoria do serviço comunitário.
- **ParoquiaID**: Uma chave estrangeira que se relaciona com a tabela "Paroquias", representando a paróquia à qual o serviço comunitário está associado.
- **Ativo**: Um valor booleano que indica se o serviço comunitário está ativo ou não.

## Tabela Tokens
- **ID**: Chave primária que identifica exclusivamente cada token.
- **UserID**: Chave estrangeira que se relaciona com a tabela "Usuarios", representando o usuário associado ao token.
- **Token**: O token em si.
- **Expiracao**: A data e hora de expiração do token.

## Tabela Usuarios
- **ID**: Chave primária que identifica exclusivamente cada usuário.
- **NomeCompleto**: O nome completo do usuário.
- **Email**: O endereço de e-mail do usuário.
- **Telefone**: O número de telefone do usuário.
- **Bairro**: O bairro onde o usuário reside para saber se tal paróquia recebe público externo de seu bairro.
- **DataNascimento**: A data de nascimento do usuário, para saber média de idade.
- **ParoquiaMaisFrequentada**: Chave estrangeira que se relaciona com a tabela "Paroquias", representando a paróquia mais frequentada pelo usuário.
- **IDServicoComunitario**: Chave estrangeira que se relaciona com a tabela "ServicosComunitarios", representando o serviço comunitário associado ao usuário, pois um usuário pode fazer parte de um, vários ou nenhum serviço comunitário.
- **SenhaHash**: A senha do usuário, armazenada como um hash.


## Tabela LogAtividades
- **ID**: Chave primária que identifica exclusivamente cada log de atividade.
- **UsuarioID**: Chave estrangeira que se relaciona com a tabela "Usuarios", representando o usuário associado ao log de atividade.
- **DataHora**: A data e hora em que a ação foi registrada.
- **TipoAcao**: O tipo de ação realizada.
- **RecursoAfetado**: O recurso afetado pela ação.
- **DetalhesAcao**: Detalhes adicionais sobre a ação.

## Tabela Usuarios_ServicosComunitarios
- **ID**: Chave primária que identifica exclusivamente cada associação entre usuários e serviços comunitários.
- **UsuarioID**: Chave estrangeira que se relaciona com a tabela "Usuarios", representando o usuário associado ao serviço comunitário.
- **ServicoComunitarioID**: Chave estrangeira que se relaciona com a tabela "ServicosComunitarios", representando o serviço comunitário associado ao usuário.
- **NivelAcessoNoServico**: O nível de acesso do usuário para um serviço comunitário específico.

INSERT INTO ParticipacaoServicoComunitario (ID, UsuarioID, ServicoComunitarioID, NivelAcessoNoServico, nomeServicoComunitario) VALUES
(1, 3, 1, 5, 'Cantor na Missa'),
(2, 3, 4, 4, 'Catequista'),
(3, 3, 13, 4, 'Cantor no Grupo de Oração'),
(4, 2, 4, 4, 'Catequista'),
(5, 2, 2, 4, 'Violinista na Missa'),

