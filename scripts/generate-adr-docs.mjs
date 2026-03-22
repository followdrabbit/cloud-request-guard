import { writeFileSync } from 'node:fs';
import path from 'node:path';

const ADR_DIR = path.resolve('docs', 'adr');
const TODAY = '2026-03-18';

const CATS = {
  'aws-accounts': {
    name: 'Contas AWS',
    criticality: 'Critica',
    sla: '5 dias uteis',
    type: 'standard',
    description: 'Criacao, alteracao e remocao de contas AWS na organizacao corporativa.',
    whenToUse: 'Quando um projeto precisar de isolamento em conta dedicada.',
    prerequisites: ['Aprovacao executiva', 'Centro de custo definido', 'Owner tecnico designado'],
    documents: ['Business case', 'Classificacao de dados', 'Plano de compliance'],
    validations: ['Nome padronizado', 'Baseline obrigatoria', 'Centro de custo valido'],
    approvals: ['Gestor solicitante', 'Arquiteto Cloud', 'Seguranca Cloud', 'Governanca Cloud'],
    taxonomy: ['Conta AWS: AWS_AC_{NOME_DA_CONTA}_{PRD|HML|DEV}'],
    standards: ['Tela unica com revisao final', 'Escopo por conta AWS quando alteracao/remocao'],
    jsonUpload: true,
    categoryRules: ['Criacao nao exige conta preexistente.', 'Alteracao/remocao exigem conta(s) alvo.'],
    relatedExamples: ['Conta produtiva para pagamentos', 'Conta sandbox para dados'],
    actions: {
      'account-create': {
        name: 'Criacao de conta AWS',
        objective: 'Criar nova conta com contexto completo de ownership, finalidade e governanca.',
        required: [
          'Nome da conta AWS',
          'Descricao / finalidade da conta',
          'Tipo de conta',
          'Ambiente',
          'Responsavel de negocio',
          'E-mail do responsavel principal',
          'Responsavel tecnico',
          'Gestor aprovador',
          'Centro de custo',
          'Unidade de negocio',
          'Justificativa da criacao',
        ],
        optional: ['Anexo de JSON(s)'],
        rules: ['Nome segue AWS_AC_{NOME_DA_CONTA}_{PRD|HML|DEV}.'],
        examples: ['AWS_AC_PAYMENT_GATEWAY_PRD | Tipo: Aplicacao | Ambiente: PRD'],
      },
      'account-update': { name: 'Alteracao de conta AWS', objective: 'Ajustar baseline e configuracoes de conta existente.', required: ['Contas AWS', 'Alteracoes Solicitadas', 'Justificativa'], optional: ['Anexo de JSON(s)'], rules: ['Descrever impacto e reversao quando aplicavel.'], examples: ['Ajuste de owner tecnico e guardrails de rede'] },
      'account-delete': { name: 'Remocao de conta AWS', objective: 'Descomissionar conta com controle de risco.', required: ['Contas AWS', 'Plano de Descomissionamento', 'Justificativa'], optional: ['Anexo de JSON(s)'], rules: ['Plano deve cobrir migracao, logs e encerramento financeiro.'], examples: ['Migrar workloads e manter logs por 12 meses'] },
    },
  },
  'aws-information': {
    name: 'Levantamento de Informacoes AWS',
    criticality: 'Alta',
    sla: '24 horas uteis',
    type: 'standard',
    description: 'Solicitacao de consultas, inventarios e extracoes de informacoes sobre contas, recursos, servicos e identidades AWS.',
    whenToUse: 'Quando o solicitante precisar de dados de AWS para analise operacional, seguranca, compliance ou governanca.',
    prerequisites: ['Objetivo do levantamento definido', 'Descricao do levantamento informada', 'Resultado esperado claro'],
    documents: ['Descricao do levantamento', 'Anexos de apoio (quando houver)'],
    validations: ['Descricao do levantamento obrigatoria', 'Justificativa obrigatoria'],
    approvals: ['Gestor solicitante', 'Seguranca Cloud', 'Governanca Cloud'],
    taxonomy: ['Nao ha taxonomia obrigatoria de nome para este fluxo.'],
    standards: ['Fluxo em tela unica com revisao final', 'Formulario simplificado com foco em texto livre'],
    jsonUpload: true,
    categoryRules: [
      'O formulario aceita escopo amplo (todas as contas/organizacao inteira) ou escopo especifico (conta, recurso ou identidade unica).',
      'Campos estruturados foram reduzidos para priorizar descricao livre do que deve ser levantado.',
      'A tela usa um unico campo descritivo para o conteudo do levantamento.',
    ],
    relatedExamples: [
      'Dump completo de roles e policies em todas as contas',
      'Inventario de recursos utilizados em toda a organizacao',
      'Consulta detalhada de um recurso especifico',
    ],
    actions: {
      'info-create': {
        name: 'Levantamento de informacoes AWS',
        objective: 'Registrar solicitacao de levantamento AWS em formato simplificado, com foco em um campo unico de descricao livre.',
        required: [
          'Descricao do levantamento',
          'Justificativa do levantamento',
        ],
        optional: [
          'Anexo de JSON(s)',
        ],
        rules: [
          'A solicitacao pode cobrir dump amplo (ex.: todas as roles/policies/recursos) ou alvo especifico.',
          'O conteudo do levantamento e informado em texto livre para reduzir friccao de abertura.',
          'No mesmo campo, o solicitante pode combinar escopo amplo e alvos especificos.',
        ],
        examples: [
          'Descricao: dump de roles e policies em todas as contas + inventario de recursos em uso + detalhe do bucket bucket-logs-aplicacao-prd',
        ],
      },
    },
  },
  'aws-profiles': {
    name: 'Acessos Corporativos (AD + Identity Center)',
    criticality: 'Alta',
    sla: '72 horas uteis',
    type: 'standard',
    description: 'Criacao, alteracao e remocao de perfis corporativos com AD e Identity Center.',
    whenToUse: 'Quando for necessario ajustar perfil completo de acesso corporativo.',
    prerequisites: ['PSET existente', 'Grupo AD definido', 'Conta(s) AWS definidas'],
    documents: ['Justificativa de negocio', 'Matriz de acesso'],
    validations: ['Grupo AD obrigatorio', 'PSET vinculado obrigatorio', 'Ao menos uma conta AWS', 'Menor privilegio'],
    approvals: ['Gestor solicitante', 'Seguranca Cloud', 'IAM Admin'],
    taxonomy: ['Perfil: prf-{ambiente}-{nome}', 'Grupo de acesso: AWS_GR_{NOME_DO_PERFIL}_{PRD|HML|DEV}'],
    standards: ['Tela unica com revisao final'],
    jsonUpload: true,
    categoryRules: ['Manter coerencia entre perfil, grupo AD, PSET e contas alvo.'],
    relatedExamples: ['Perfil SRE readonly', 'Perfil admin restrito'],
    actions: {
      'profile-create': { name: 'Criacao de perfil corporativo', objective: 'Criar perfil corporativo com grupo e PSET associados.', required: ['Contas AWS', 'Nome do Perfil Corporativo (Taxonomia)', 'Grupo do Perfil de Acesso (Taxonomia)', 'PSET Associado', 'Justificativa'], optional: ['Anexo de JSON(s)'], rules: ['Grupo segue AWS_GR_{NOME_DO_PERFIL}_{PRD|HML|DEV}.'], examples: ['prf-prd-sre-readonly + AWS_GR_SRE_READONLY_PRD'] },
      'profile-update': { name: 'Alteracao de perfil corporativo', objective: 'Ajustar perfil, grupo e PSET existentes.', required: ['Contas AWS', 'Perfil Corporativo Alvo', 'Grupo do Perfil de Acesso (nome livre)', 'PSET Associado (nome/ARN)', 'Justificativa'], optional: ['Anexo de JSON(s)'], rules: ['Preservar segregacao de funcao e menor privilegio.'], examples: ['Troca de PSET de PowerUser para ReadOnly em PRD'] },
      'profile-delete': { name: 'Remocao de perfil corporativo', objective: 'Desativar perfil com plano de migracao de acessos.', required: ['Contas AWS', 'Perfil Corporativo Alvo', 'Plano de Revogacao e Migracao', 'Justificativa'], optional: ['Anexo de JSON(s)'], rules: ['Detalhar destino dos usuarios impactados.'], examples: ['Migracao para perfil readonly de contingencia'] },
    },
  },
  'aws-iam-users': {
    name: 'Usuarios IAM AWS',
    criticality: 'Alta',
    sla: '24 horas uteis',
    type: 'standard',
    description: 'Criacao, alteracao e remocao de usuarios IAM locais em contas AWS.',
    whenToUse: 'Quando houver necessidade excepcional de usuario IAM local de servico.',
    prerequisites: ['Conta AWS ativa', 'Justificativa de excecao para usuario local', 'Owner tecnico definido'],
    documents: ['Justificativa de negocio', 'Escopo de permissoes', 'Plano de desativacao (remocao)'],
    validations: ['Acesso de usuario de servico somente Programatico (sem console)', 'Sem privilegio admin sem justificativa', 'Rotacao de access keys', 'Producao com aprovacao reforcada'],
    approvals: ['Gestor solicitante', 'Seguranca Cloud', 'IAM Admin'],
    taxonomy: ['Fluxo padrao: AWS_US_{NOME_DO_USUARIO}_{PRD|HML|DEV}', 'US_PRS reservado para fluxo de excecao'],
    standards: ['Criacao padrao somente para usuario de servico local', 'Usuario pessoal local somente por fluxo de excecao'],
    jsonUpload: true,
    categoryRules: ['Fluxo padrao nao inclui criacao de usuario IAM pessoal local.'],
    relatedExamples: ['Usuario IAM para integracao legada', 'Remocao de usuario orfao'],
    actions: {
      'iam-user-create': { name: 'Criacao de usuario IAM', objective: 'Criar usuario IAM local de servico com menor privilegio.', required: ['Contas AWS', 'Usuario IAM (Taxonomia)', 'Permissoes Iniciais do Usuario IAM', 'Justificativa'], optional: ['Grupos IAM Existentes para Inclusao (quando aplicavel)', 'Policies Existentes para Attach (quando aplicavel)', 'Anexo de JSON(s)'], rules: ['Usuario pessoal local nao faz parte do fluxo padrao.', 'Acesso de usuario de servico e implicito como Programatico (sem campo de tipo).', 'Permissoes iniciais podem ser: sem permissao, incluir em grupo existente, attach de policies existentes ou ambos.'], examples: ['AWS_US_INTEGRACAO_ETL_HML + Incluir em grupo IAM existente + attach de policies existentes'] },
      'iam-user-update': { name: 'Alteracao de usuario IAM', objective: 'Ajustar usuario IAM existente com acoes explicitas de policy, grupo e access key.', required: ['Contas AWS', 'Usuario IAM Alvo (nome/ARN)', 'Acoes da Alteracao do Usuario IAM', 'Justificativa'], optional: ['Anexo de JSON(s)'], rules: ['Selecionar ao menos uma acao: Adicionar policy, Remover policy, Adicionar grupo, Remover grupo ou Rotacionar key.', 'Cada acao deve conter ao menos um item objetivo para execucao.', 'Limite de ate 10 itens por acao.', 'Na acao Rotacionar key, a key atual e desativada e, apos 7 dias sem solicitacao de reativacao, e excluida.'], examples: ['Adicionar policy ReadOnlyAccess + Remover grupo IAM-Legado + Rotacionar key AKIAIOSFODNN7EXAMPLE'] },
      'iam-user-delete': { name: 'Remocao de usuario IAM', objective: 'Remover usuario IAM com revogacao previa de credenciais.', required: ['Contas AWS', 'Usuario IAM Alvo (nome/ARN)', 'Plano de Revogacao de Credenciais', 'Justificativa'], optional: ['Anexo de JSON(s)'], rules: ['Revogar access keys/senha antes da exclusao.'], examples: ['Desativar chaves e remover senha de console'] },
    },
  },
  'aws-iam-groups': {
    name: 'Grupos IAM AWS',
    criticality: 'Alta',
    sla: '24 horas uteis',
    type: 'standard',
    description: 'Criacao, alteracao e remocao de grupos IAM para organizacao de permissoes.',
    whenToUse: 'Quando for necessario estruturar permissao compartilhada para usuarios IAM.',
    prerequisites: ['Conta AWS ativa', 'Escopo de permissoes definido', 'Matriz de acesso atualizada'],
    documents: ['Matriz de acesso', 'Lista de policies', 'Plano de migracao de membros'],
    validations: ['Sem wildcard critico sem justificativa', 'Sem membros privilegiados indevidos', 'Grupo substituto quando aplicavel'],
    approvals: ['Gestor solicitante', 'Seguranca Cloud', 'IAM Admin'],
    taxonomy: ['Grupo IAM: AWS_GR_{NOME_DO_GRUPO}_{PRD|HML|DEV}'],
    standards: ['Tela unica com revisao final'],
    jsonUpload: true,
    categoryRules: ['Criacao pode ocorrer sem permissao inicial ou com attach de policies existentes.', 'Policies do grupo devem seguir menor privilegio.'],
    relatedExamples: ['Grupo para operadores de backup', 'Ajuste de policies de grupo de suporte'],
    actions: {
      'iam-group-create': { name: 'Criacao de grupo IAM', objective: 'Criar grupo com permissao inicial opcional.', required: ['Contas AWS', 'Nome do Grupo IAM (Taxonomia)', 'Permissoes Iniciais do Grupo IAM', 'Justificativa'], optional: ['Policies Existentes para Attach (quando aplicavel)', 'Anexo de JSON(s)'], rules: ['Nome do grupo deve seguir padrao AWS_GR_{NOME_DO_GRUPO}_{PRD|HML|DEV}.', 'Permissoes iniciais podem ser: sem permissao ou attach de policies existentes.'], examples: ['AWS_GR_BACKUP_OPERATORS_HML + Criar sem permissoes iniciais'] },
      'iam-group-update': { name: 'Alteracao de grupo IAM', objective: 'Ajustar grupo IAM existente com acoes explicitas de policy e membership.', required: ['Contas AWS', 'Grupo IAM Alvo (nome/ARN)', 'Acoes da Alteracao do Grupo IAM', 'Justificativa'], optional: ['Anexo de JSON(s)'], rules: ['Selecionar ao menos uma acao: Adicionar policy, Remover policy, Adicionar usuario ou Remover usuario.', 'Cada acao deve conter ao menos um item objetivo para execucao.', 'Limite de ate 10 itens por acao.'], examples: ['Adicionar policy SecurityAudit + Remover usuario legado sem uso'] },
      'iam-group-delete': { name: 'Remocao de grupo IAM', objective: 'Remover grupo com plano de migracao dos membros.', required: ['Contas AWS', 'Grupo IAM Alvo (nome/ARN)', 'Plano de Migracao dos Membros', 'Justificativa'], optional: ['Anexo de JSON(s)'], rules: ['Plano de migracao deve cobrir como os membros serao realocados antes da remocao.'], examples: ['Migrar usuarios para IAM-Backup-Operators antes de remover'] },
    },
  },
  'aws-psets': {
    name: 'PSET AWS',
    criticality: 'Alta',
    sla: '48 horas uteis',
    type: 'standard',
    description: 'Criacao, alteracao e remocao de Permission Sets no IAM Identity Center.',
    whenToUse: 'Para padronizar perfis de permissao distribuidos via Identity Center.',
    prerequisites: ['Identity Center configurado'],
    documents: ['Justificativa tecnica', 'Lista de policies pretendidas'],
    validations: ['Ao menos uma policy obrigatoria', 'Permission boundary em producao', 'Session duration definida'],
    approvals: ['Gestor solicitante', 'Seguranca Cloud', 'IAM Admin'],
    taxonomy: ['PSET: AWS_PS_{NOME_DO_PSET}_{PRD|HML|DEV}'],
    standards: ['Associacao com Grupo AD tratada em alteracoes quando aplicavel'],
    jsonUpload: true,
    categoryRules: ['Manter coerencia entre policies e grupos vinculados.'],
    relatedExamples: ['PSET ReadOnly para observabilidade', 'PSET PowerUser para DevOps'],
    actions: {
      'pset-create': { name: 'Criacao de PSET', objective: 'Criar Permission Set com nomenclatura padronizada e uma ou mais policies definidas.', required: ['Contas AWS', 'Nome do PSET', 'Policies do PSET', 'Justificativa'], optional: ['Anexo de JSON(s)'], rules: ['Nome do PSET segue AWS_PS_{NOME_DO_PSET}_{PRD|HML|DEV}.', 'No create, o solicitante pode informar uma ou mais policies para vincular ao PSET.'], examples: ['AWS_PS_SRE_READONLY_PRD + ReadOnlyAccess + CloudWatchReadOnlyAccess'] },
      'pset-update': { name: 'Alteracao de PSET', objective: 'Ajustar PSET existente com acoes explicitas de policy e atribuicao por conta.', required: ['Contas AWS', 'Nome do PSET', 'Acoes da Alteracao do PSET', 'Justificativa'], optional: ['Anexo de JSON(s)'], rules: ['Selecionar ao menos uma acao: Adicionar policy, Remover policy, Adicionar conta ou Remover conta.', 'Cada acao deve conter ao menos um item objetivo para execucao.', 'Limite de ate 10 itens por acao.'], examples: ['Adicionar policy CloudWatchReadOnlyAccess + Remover conta 210987654321 (hml-payment-gateway)'] },
      'pset-delete': { name: 'Remocao de PSET', objective: 'Remover PSET com controle de impacto.', required: ['Contas AWS', 'Nome do PSET', 'Justificativa'], optional: ['Anexo de JSON(s)'], rules: ['Validar impacto em grupos e contas antes de remover.'], examples: ['Remover PSET legado apos migracao'] },
    },
  },
  'aws-roles': {
    name: 'Role AWS',
    criticality: 'Alta',
    sla: '48 horas uteis',
    type: 'standard',
    description: 'Criacao, alteracao e remocao de IAM Roles para workloads e servicos AWS.',
    whenToUse: 'Quando uma entidade precisar assumir permissoes especificas via role.',
    prerequisites: ['Conta AWS ativa', 'Role alvo ou nome padronizado definido conforme acao'],
    documents: ['Justificativa de menor privilegio', 'Evidencias tecnicas da alteracao/remocao quando aplicavel'],
    validations: ['Escopo por conta AWS obrigatorio', 'Nome padronizado obrigatorio no create', 'Role alvo obrigatoria no update/delete', 'Acoes de alteracao obrigatorias no role-update', 'Policy JSON valido quando anexado'],
    approvals: ['Gestor solicitante', 'Seguranca Cloud', 'IAM Admin'],
    taxonomy: ['Role: AWS_RL_{NOME_DA_ROLE}_{PRD|HML|DEV}'],
    standards: ['Escopo por chamado: 1 role por solicitacao', 'Escopo por conta AWS: 1 conta por solicitacao (ambiente implicito pela conta)'],
    jsonUpload: true,
    categoryRules: ['Uma conta AWS por solicitacao; ambiente e implicito na conta selecionada.', 'Criacao pode ocorrer sem policy ou com attach de policies existentes.'],
    relatedExamples: ['Role para Lambda integracao S3', 'Role cross-account para pipeline CI/CD'],
    actions: {
      'role-create': { name: 'Criacao de role', objective: 'Criar role padronizada no ambiente da conta selecionada.', required: ['Conta AWS', 'Nome da Role', 'Trusted Entity', 'Principal(is) Confiavel(is)', 'Permissoes Iniciais da Role', 'Justificativa'], optional: ['Policies Existentes para Attach (quando modo attach-existing)', 'Anexo de JSON(s)'], rules: ['Revisao deve exibir nome final da role, ambiente e policies vinculadas.'], examples: ['AWS_RL_LAMBDA_INTEGRATION_PRD'] },
      'role-update': { name: 'Alteracao de role', objective: 'Alterar role existente com acoes explicitas de policy/trusted entity.', required: ['Conta AWS', 'Role alvo para alteracao', 'Acoes da Alteracao da Role', 'Justificativa'], optional: ['Anexo de JSON(s)'], rules: ['Selecionar ao menos uma acao no dropdown: Adicionar policy, Remover policy, Adicionar Trusted Entity, Alterar Trusted Entity, Remover Trusted Entity.', 'Acoes de policy permitem ate 10 policies por solicitacao.', 'Cada acao selecionada deve conter detalhamento objetivo para execucao.'], examples: ['Adicionar policy: arn:aws:iam::aws:policy/SecurityAudit + Alterar Trusted Entity: trocar principal da conta origem'] },
      'role-delete': { name: 'Remocao de role', objective: 'Remover role existente no ambiente da conta selecionada.', required: ['Conta AWS', 'Role alvo para remocao', 'Justificativa'], optional: ['Anexo de JSON(s)'], rules: ['Informar role em nome livre ou ARN.', 'Validar dependencias e rollback antes da remocao.'], examples: ['role-legada-pipeline ou arn:aws:iam::123456789012:role/role-legada-pipeline'] },
    },
  },
  'aws-policies': {
    name: 'Policy AWS',
    criticality: 'Alta',
    sla: '48 horas uteis',
    type: 'standard',
    description: 'Criacao, alteracao e remocao de IAM Managed Policies.',
    whenToUse: 'Quando for necessario controlar permissao com rastreabilidade e aprovacao formal.',
    prerequisites: ['Conta ou OU alvo definida', 'Owner tecnico identificado', 'Escopo da policy detalhado'],
    documents: ['Actions/Resources/Conditions esperados (create)', 'JSON atual e JSON proposto (update/remove)', 'Justificativa de negocio e risco', 'Plano de rollback'],
    validations: ['Acoes e resources devem ser informados no create', 'Sem wildcard critico sem justificativa', 'Change window para producao', 'Alteracao/remocao deve manter menor privilegio e plano de rollback'],
    approvals: ['Gestor solicitante', 'Seguranca Cloud', 'IAM Admin', 'Governanca Cloud'],
    taxonomy: ['Policy: AWS_PL_{NOME_DA_POLICY}_{PRD|HML|DEV}'],
    standards: ['Nesta fase, criacao/alteracao/remocao aceitam somente IAM Managed Policy (sem campo de tipo na tela)', 'No create, formulario coleta Actions/Resources/Conditions em vez de JSON bruto', 'Em alteracao/remocao, informar diff/plano com impacto e rollback'],
    jsonUpload: true,
    categoryRules: ['Criacao coleta Actions e Resources obrigatorios + Conditions opcional; JSON final e montado pelo time executor.', 'Alteracao/remocao cobrem somente IAM Managed Policy (tipo implicito, sem selecao).', 'Remocao exige plano de reversao.'],
    relatedExamples: ['Policy managed para leitura de logs de aplicacao', 'Policy managed com deny explicito para acao sensivel'],
    actions: {
      'policy-create': { name: 'Criacao de policy', objective: 'Criar IAM Managed Policy nova com Actions/Resources/Conditions estruturados.', required: ['Contas AWS', 'Nome da Policy (Taxonomia)', 'Actions Necessarias', 'Resources', 'Justificativa'], optional: ['Conditions (opcional)', 'Anexo de JSON(s)'], rules: ['Tipo de policy e implicito no create: IAM Managed Policy (sem campo na tela).', 'No create, o solicitante informa Actions, Resources e Conditions (se houver), sem montar JSON manual.', 'No campo Resources, o solicitante deve informar o nome exato do recurso (nao descricao em texto livre) ou ARN.', 'Naming segue AWS_PL_{NOME_DA_POLICY}_{PRD|HML|DEV}.'], examples: ['Actions: s3:GetObject, s3:PutObject | Resources: bucket-logs-aplicacao-prd (nome exato) ou arn:aws:s3:::bucket-logs-aplicacao-prd/*'] },
      'policy-update': { name: 'Alteracao de policy', objective: 'Atualizar IAM Managed Policy existente com diff JSON controlado.', required: ['Contas AWS', 'Policy Alvo (nome/ARN)', 'Diff da Policy (JSON)', 'Justificativa'], optional: ['Anexo de JSON(s)'], rules: ['Fluxo cobre somente IAM Managed Policy (tipo implicito, sem selecao).', 'Registrar impacto e estrategia de rollback.'], examples: ['Adicionar deny explicito para acao sensivel'] },
      'policy-delete': { name: 'Remocao de policy', objective: 'Remover IAM Managed Policy com plano de remocao/reversao.', required: ['Contas AWS', 'Policy Alvo (nome/ARN)', 'Plano de Remocao e Reversao', 'Justificativa'], optional: ['Anexo de JSON(s)'], rules: ['Fluxo cobre somente IAM Managed Policy (tipo implicito, sem selecao).', 'Atualizar entidades dependentes antes da exclusao.'], examples: ['Desanexar de roles e aplicar policy substituta'] },
    },
  },
  'aws-audit': {
    name: 'Auditoria AWS',
    criticality: 'Alta',
    sla: '5-7 dias uteis',
    type: 'audit',
    description: 'Abertura, alteracao e encerramento de auditorias de seguranca em ambientes AWS.',
    whenToUse: 'Para levantamentos e revisoes de conformidade em contas e recursos AWS.',
    prerequisites: ['Conta(s) AWS alvo definidas', 'Escopo de analise claro'],
    documents: ['Escopo da auditoria', 'Justificativa e base regulatoria'],
    validations: ['Escopo obrigatorio', 'Justificativa obrigatoria', 'Conta AWS obrigatoria'],
    approvals: ['Gestor solicitante', 'Cloud Audit Specialist', 'Seguranca Cloud'],
    taxonomy: ['Nao ha naming de recurso novo nessa categoria.'],
    standards: ['Fluxo de auditoria orientado a escopo, periodo e parecer final.'],
    jsonUpload: false,
    categoryRules: ['Abertura define escopo e periodo.', 'Encerramento exige parecer final.'],
    relatedExamples: ['Inventario de recursos em conta produtiva', 'Auditoria de permissoes administrativas'],
    actions: {
      'audit-create': { name: 'Abertura de auditoria', objective: 'Abrir auditoria com escopo e periodo de referencia.', required: ['Contas AWS', 'Escopo da Auditoria', 'Periodo de Referencia', 'Justificativa'], optional: [], rules: ['Definir escopo inicial claro para reduzir retrabalho.'], examples: ['Escopo: Permissoes IAM | Periodo: Ultimos 90 dias'] },
      'audit-update': { name: 'Alteracao de auditoria', objective: 'Ajustar escopo e prazo de auditoria em andamento.', required: ['Contas AWS', 'ID da Auditoria', 'Ajustes de Escopo/Prazo', 'Justificativa'], optional: [], rules: ['Registrar motivacao da mudanca e aprovacao correspondente.'], examples: ['Incluir revisao de SCP e estender prazo em 3 dias'] },
      'audit-close': { name: 'Encerramento de auditoria', objective: 'Concluir auditoria com parecer final.', required: ['Contas AWS', 'ID da Auditoria', 'Parecer Final', 'Justificativa'], optional: [], rules: ['Encerrar apenas com evidencias e parecer consolidado.'], examples: ['Parecer final: Conforme com ressalvas'] },
    },
  },
  'aws-emergency': {
    name: 'Breaking Glass AWS',
    criticality: 'Critica',
    sla: '30 min - 1 hora',
    type: 'breaking-glass',
    description: 'Concessao, alteracao e revogacao de acesso emergencial para incidentes criticos.',
    whenToUse: 'Quando houver incidente critico que exija atuacao imediata fora do fluxo padrao.',
    prerequisites: ['Incidente registrado e ativo', 'Justificativa emergencial', 'Aprovacao de seguranca'],
    documents: ['Evidencia do incidente', 'Plano de acao', 'Justificativa emergencial'],
    validations: ['Incidente obrigatorio', 'Justificativa obrigatoria', 'Conta AWS obrigatoria', 'Duracao maxima obrigatoria', 'Revisao pos-uso obrigatoria'],
    approvals: ['Gestor solicitante', 'Seguranca Cloud', 'Incident Response', 'CISO'],
    taxonomy: ['Nao ha naming de recurso novo nessa categoria.'],
    standards: ['Processo excepcional com aprovacao reforcada', 'Justificativa Emergencial obrigatoria'],
    jsonUpload: false,
    categoryRules: ['Concessao exige incidente ativo.', 'Revogacao exige evidencia de encerramento.'],
    relatedExamples: ['Acesso admin emergencial para incidente em producao', 'Leitura emergencial de CloudTrail'],
    actions: {
      'bg-create': { name: 'Concessao de acesso emergencial', objective: 'Conceder acesso temporario para resposta a incidente critico.', required: ['Contas AWS', 'Incidente Relacionado', 'Tipo de Acesso', 'Identidade que Recebera Acesso', 'Duracao Maxima', 'Justificativa Emergencial'], optional: [], rules: ['Somente para incidente ativo com aprovacao reforcada.'], examples: ['INC-2026-0042 | Administrador restrito | 1 hora'] },
      'bg-update': { name: 'Alteracao de acesso emergencial', objective: 'Ajustar duracao de acesso emergencial em andamento.', required: ['Contas AWS', 'Ticket BG em Andamento', 'Nova Duracao Maxima', 'Justificativa Emergencial'], optional: [], rules: ['Manter vinculo com incidente original.'], examples: ['Ticket AWS-BG-95001 prorrogado por 1 hora'] },
      'bg-revoke': { name: 'Revogacao de acesso emergencial', objective: 'Revogar acesso emergencial e registrar evidencia.', required: ['Contas AWS', 'Ticket BG em Andamento', 'Evidencia de Revogacao', 'Justificativa Emergencial'], optional: [], rules: ['Registrar evidencia objetiva de revogacao.'], examples: ['CloudTrail confirma sessao encerrada e privilegio removido'] },
    },
  },
};

const TARGETS = [
  ['ADR_CRIACAO_CONTA_AWS.md', 'aws-accounts', 'account-create'], ['ADR_ALTERACAO_CONTA_AWS.md', 'aws-accounts', 'account-update'], ['ADR_REMOCAO_CONTA_AWS.md', 'aws-accounts', 'account-delete'],
  ['ADR_LEVANTAMENTO_INFORMACOES_AWS.md', 'aws-information', 'info-create'],
  ['ADR_CRIACAO_PERFIL_ACESSO_AWS.md', 'aws-profiles', 'profile-create'], ['ADR_ALTERACAO_PERFIL_ACESSO_AWS.md', 'aws-profiles', 'profile-update'], ['ADR_REMOCAO_PERFIL_ACESSO_AWS.md', 'aws-profiles', 'profile-delete'],
  ['ADR_CRIACAO_USUARIO_IAM_AWS.md', 'aws-iam-users', 'iam-user-create'], ['ADR_ALTERACAO_USUARIO_IAM_AWS.md', 'aws-iam-users', 'iam-user-update'], ['ADR_REMOCAO_USUARIO_IAM_AWS.md', 'aws-iam-users', 'iam-user-delete'],
  ['ADR_CRIACAO_GRUPO_IAM_AWS.md', 'aws-iam-groups', 'iam-group-create'], ['ADR_ALTERACAO_GRUPO_IAM_AWS.md', 'aws-iam-groups', 'iam-group-update'], ['ADR_REMOCAO_GRUPO_IAM_AWS.md', 'aws-iam-groups', 'iam-group-delete'],
  ['ADR_CRIACAO_PSET_AWS.md', 'aws-psets', 'pset-create'], ['ADR_ALTERACAO_PSET_AWS.md', 'aws-psets', 'pset-update'], ['ADR_REMOCAO_PSET_AWS.md', 'aws-psets', 'pset-delete'],
  ['ADR_CRIACAO_ROLE_AWS.md', 'aws-roles', 'role-create'], ['ADR_ALTERACAO_ROLE_AWS.md', 'aws-roles', 'role-update'], ['ADR_REMOCAO_ROLE_AWS.md', 'aws-roles', 'role-delete'],
  ['ADR_CRIACAO_POLICY_AWS.md', 'aws-policies', 'policy-create'], ['ADR_ALTERACAO_POLICY_AWS.md', 'aws-policies', 'policy-update'], ['ADR_REMOCAO_POLICY_AWS.md', 'aws-policies', 'policy-delete'],
  ['ADR_ABERTURA_AUDITORIA_AWS.md', 'aws-audit', 'audit-create'], ['ADR_ALTERACAO_AUDITORIA_AWS.md', 'aws-audit', 'audit-update'], ['ADR_ENCERRAMENTO_AUDITORIA_AWS.md', 'aws-audit', 'audit-close'],
  ['ADR_CONCESSAO_BREAKING_GLASS_AWS.md', 'aws-emergency', 'bg-create'], ['ADR_ALTERACAO_BREAKING_GLASS_AWS.md', 'aws-emergency', 'bg-update'], ['ADR_REVOGACAO_BREAKING_GLASS_AWS.md', 'aws-emergency', 'bg-revoke'],
];

const AWS_DOCS = {
  organizationsCreateAccount: { label: 'AWS Organizations - Criar conta', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_create.html' },
  iamRoles: { label: 'IAM Roles', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html' },
  iamTrustPolicy: { label: 'Trust policy de role', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_update-role-trust-policy.html' },
  iamPolicies: { label: 'IAM Policies', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html' },
  iamPolicyJson: { label: 'JSON policy elements', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html' },
  iamUsers: { label: 'IAM Users', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html' },
  iamAccessKeys: { label: 'IAM access keys', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html' },
  iamGroups: { label: 'IAM User groups', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html' },
  identityCenterPsets: { label: 'IAM Identity Center - Permission sets', url: 'https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsetsconcept.html' },
  serviceControlPolicies: { label: 'Service control policies (SCP)', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html' },
  permissionBoundaries: { label: 'Permissions boundaries', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html' },
};

const COMMON_OPTIONAL_FIELDS = ['Comentarios', 'Upload de Anexos (opcional)'];

function normalizeText(value) {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function dedupeFields(fields) {
  const seen = new Set();
  const result = [];
  for (const field of fields || []) {
    const key = normalizeText(field);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(field);
  }
  return result;
}

function dedupeDocs(docs) {
  const seen = new Set();
  const result = [];
  for (const doc of docs || []) {
    if (!doc || !doc.url) continue;
    if (seen.has(doc.url)) continue;
    seen.add(doc.url);
    result.push(doc);
  }
  return result;
}

function normalizeRequiredFields(action) {
  const normalized = [];
  for (const field of action.required || []) {
    if (field === 'Contas AWS') {
      normalized.push('Conta AWS');
      continue;
    }
    if (field === 'Conta AWS (Nome do Produto)') {
      normalized.push('Conta AWS');
      continue;
    }
    if (field === 'Ambientes da Role') continue;
    normalized.push(field);
  }
  return dedupeFields(normalized);
}

function normalizeOptionalFields(action) {
  const normalized = [];
  for (const field of action.optional || []) {
    if (normalizeText(field).includes('anexo de json')) continue;
    normalized.push(field);
  }
  for (const commonField of COMMON_OPTIONAL_FIELDS) {
    normalized.push(commonField);
  }
  return dedupeFields(normalized);
}

function getTooltip(field) {
  const normalized = normalizeText(field);
  let text = 'Preencha somente com informacoes necessarias para execucao segura da atividade.';
  let example = '';
  let docs = [];

  if (normalized.includes('nome da conta aws') || (normalized.includes('nome da conta') && normalized.includes('taxonomia'))) {
    text = 'Informe o nome final da conta AWS seguindo padrao corporativo.';
    example = 'AWS_AC_PAYMENT_GATEWAY_PRD';
    docs = [AWS_DOCS.organizationsCreateAccount];
  } else if (normalized === 'conta aws' || normalized === 'contas aws' || normalized.includes('contas aws')) {
    text = 'Selecione a conta AWS alvo da solicitacao. O ambiente ja esta implicito na conta selecionada.';
    example = '123456789012 (prd-payment-gateway) - Ambiente: PRD';
    docs = [AWS_DOCS.organizationsCreateAccount];
  } else if (normalized === 'ambiente' || normalized.includes('ambiente da conta')) {
    text = 'Informe o ambiente da conta a ser criada.';
    example = 'PRD';
    docs = [AWS_DOCS.organizationsCreateAccount];
  } else if (normalized.includes('descricao / finalidade da conta') || normalized.includes('descricao da conta')) {
    text = 'Descreva o objetivo da conta, workload principal e limite de escopo esperado.';
    example = 'Conta dedicada para workload transacional de pagamentos com isolamento de custos.';
  } else if (normalized.includes('tipo de conta')) {
    text = 'Selecione o tipo de conta que melhor representa o uso principal.';
    example = 'Aplicacao';
  } else if (normalized.includes('responsavel de negocio')) {
    text = 'Informe o owner de negocio responsavel pelo resultado e priorizacao da conta.';
    example = 'Maria Souza';
  } else if (normalized.includes('e-mail do responsavel principal') || normalized.includes('email do responsavel principal')) {
    text = 'Use e-mail corporativo do responsavel principal da conta.';
    example = 'maria.souza@empresa.com';
    docs = [AWS_DOCS.organizationsCreateAccount];
  } else if (normalized.includes('responsavel tecnico')) {
    text = 'Informe o responsavel tecnico pela operacao da conta e suas configuracoes.';
    example = 'Carlos Lima';
  } else if (normalized.includes('gestor aprovador')) {
    text = 'Informe o gestor que aprova formalmente a criacao da conta.';
    example = 'Ana Ribeiro';
  } else if (normalized.includes('centro de custo')) {
    text = 'Informe o centro de custo para alocacao financeira e rastreabilidade de cobranca.';
    example = 'CC-10457';
  } else if (normalized.includes('unidade de negocio') || normalized.includes('business unit')) {
    text = 'Selecione a unidade de negocio responsavel pela conta/servico.';
    example = 'Pagamentos';
  } else if (normalized.includes('justificativa da criacao')) {
    text = 'Explique o racional da criacao da conta, risco mitigado e resultado esperado.';
    example = 'Isolar workload critico de pagamentos e separar custos para controle de governanca.';
  } else if (normalized.includes('titulo da solicitacao')) {
    text = 'Informe um titulo objetivo que resuma o levantamento solicitado em AWS.';
    example = 'Levantamento IAM em contas produtivas para revisao de menor privilegio';
  } else if (normalized.includes('descricao do levantamento') || normalized.includes('descrição do levantamento')) {
    text = 'Descreva de forma livre o que precisa ser levantado, podendo combinar escopo amplo e itens especificos.';
    example = 'Dump de roles/policies/recursos em todas as contas + detalhe do bucket bucket-logs-aplicacao-prd.';
  } else if (normalized.includes('justificativa do levantamento')) {
    text = 'Explique por que o levantamento e necessario, qual risco/decisao ele suporta e resultado esperado.';
    example = 'Mapear permissoes e ultimo uso para preparar remediacao de acessos privilegiados.';
  } else if (normalized.includes('tipo de levantamento')) {
    text = 'Selecione o dominio do levantamento para ativar campos e sugestoes coerentes ao contexto.';
    example = 'IAM';
  } else if (normalized === 'escopo') {
    text = 'Defina o alcance organizacional do levantamento (conta, multiplas contas, OU ou organizacao inteira).';
    example = 'Multiplas contas';
  } else if (normalized.includes('conta aws alvo') || normalized.includes('contas aws alvo')) {
    text = 'Informe a conta (ou contas) alvo quando o escopo exigir conta especifica.';
    example = '123456789012 (prd-payment-gateway)';
    docs = [AWS_DOCS.organizationsCreateAccount];
  } else if (normalized.includes('ou alvo')) {
    text = 'Informe a OU alvo quando o escopo for OU inteira.';
    example = 'OU=Plataforma';
    docs = [AWS_DOCS.organizationsCreateAccount];
  } else if (normalized.includes('regiao aws') || normalized.includes('outra regiao aws')) {
    text = 'Selecione a regiao AWS alvo ou informe a regiao especifica quando usar opcao Outra.';
    example = 'sa-east-1';
  } else if (normalized.includes('objeto do levantamento') || normalized.includes('outro objeto')) {
    text = 'Informe um ou mais objetos que devem ser consultados/inventariados no levantamento.';
    example = 'Usuarios IAM, Roles, Policies';
    docs = [AWS_DOCS.iamUsers, AWS_DOCS.iamGroups, AWS_DOCS.iamRoles, AWS_DOCS.iamPolicies];
  } else if (normalized.includes('tipo de informacao desejada') || normalized.includes('outro tipo de informacao')) {
    text = 'Informe quais visoes/informacoes devem ser retornadas no resultado do levantamento.';
    example = 'Permissoes, Ultimo uso e Relacionamentos';
  } else if (normalized === 'id') {
    text = 'Opcional: informe o ID exato do recurso para reduzir ambiguidade de busca.';
    example = 'i-0abc123def4567890';
  } else if (normalized === 'arn') {
    text = 'Opcional: informe ARN exato para direcionar consulta precisa em AWS.';
    example = 'arn:aws:s3:::bucket-logs-aplicacao-prd';
    docs = [AWS_DOCS.iamPolicyJson];
  } else if (normalized.includes('tag chave') || normalized.includes('tag valor')) {
    text = 'Opcional: use filtros de tag para limitar o escopo da consulta a recursos com metadados especificos.';
    example = 'Tag chave: owner | Tag valor: time-seguranca';
  } else if (normalized.includes('nome do usuario / role / policy')) {
    text = 'Opcional: informe nome exato de principal IAM para consultas especificas de identidade/permissao.';
    example = 'AWS_RL_APP_READONLY_PRD';
    docs = [AWS_DOCS.iamUsers, AWS_DOCS.iamRoles, AWS_DOCS.iamPolicies];
  } else if (normalized.includes('servico aws') || normalized.includes('outro servico aws')) {
    text = 'Informe o servico AWS para filtrar resultados, especialmente em levantamentos de recursos, custos e quotas.';
    example = 'EC2';
  } else if (normalized.includes('periodo de referencia') || normalized.includes('periodo customizado')) {
    text = 'Defina a janela temporal para consultas de uso, historico ou mudancas.';
    example = 'Ultimos 90 dias';
  } else if (normalized.includes('formato de saida')) {
    text = 'Defina o formato de entrega esperado para que o time executor prepare a resposta adequada.';
    example = 'CSV/XLSX';
  } else if (normalized.includes('nivel de detalhamento')) {
    text = 'Defina profundidade da resposta para equilibrar prazo e granularidade de informacao.';
    example = 'Alto';
  } else if (normalized.includes('urgencia')) {
    text = 'Informe prioridade operacional da demanda para triagem e SLA interno.';
    example = 'Media';
  } else if (normalized.includes('nome do perfil corporativo') && normalized.includes('taxonomia')) {
    text = 'Informe somente a parte nao padronizada do nome do perfil.';
    example = 'prf-prd-sre-readonly';
  } else if (normalized.includes('grupo do perfil de acesso') && normalized.includes('taxonomia')) {
    text = 'Informe somente a parte variavel do grupo, mantendo padrao de nomenclatura.';
    example = 'AWS_GR_SRE_READONLY_PRD';
  } else if (normalized.includes('perfil corporativo alvo')) {
    text = 'Informe nome ou identificador existente do perfil corporativo.';
    example = 'PRF-PGW-PRD-SRE-READONLY';
  } else if (normalized.includes('pset associado')) {
    text = 'Selecione o Permission Set que sera associado ao perfil.';
    example = 'AWS_PS_SRE_READONLY_PRD';
    docs = [AWS_DOCS.identityCenterPsets];
  } else if (normalized.includes('nome do pset')) {
    text = 'No create, informe a parte variavel para gerar o padrao do PSET. Em alteracao/remocao, informe nome existente ou ARN do recurso alvo.';
    example = 'AWS_PS_FINOPS_READONLY_PRD ou arn:aws:sso:::permissionSet/ssoins-1234567890abcdef/ps-1234567890abcdef';
    docs = [AWS_DOCS.identityCenterPsets];
  } else if (normalized.includes('pset alvo')) {
    text = 'Informe nome ou ARN do Permission Set existente para alteracao/remocao.';
    example = 'arn:aws:sso:::permissionSet/ssoins-1234567890abcdef/ps-1234567890abcdef';
    docs = [AWS_DOCS.identityCenterPsets];
  } else if (normalized.includes('grupo ad vinculado')) {
    text = 'Informe o grupo AD que recebera o PSET no Identity Center.';
    example = 'GG_AWS_SRE_READONLY_PRD';
    docs = [AWS_DOCS.identityCenterPsets];
  } else if (normalized.includes('nome da role')) {
    text = 'Informe somente a parte variavel da role. O padrao final e montado automaticamente.';
    example = 'AWS_RL_LAMBDA_INTEGRATION_PRD';
    docs = [AWS_DOCS.iamRoles];
  } else if (normalized.includes('role alvo')) {
    text = 'Informe nome ou ARN da role existente, sem forcar taxonomia nova.';
    example = 'legacy-lambda-integration-role';
    docs = [AWS_DOCS.iamRoles];
  } else if (normalized.includes('acoes da alteracao da role')) {
    text = 'Selecione ao menos uma acao de alteracao; cada acao exige detalhamento objetivo para execucao.';
    example = 'Adicionar policy + Alterar Trusted Entity';
    docs = [AWS_DOCS.iamRoles, AWS_DOCS.iamPolicies, AWS_DOCS.iamTrustPolicy];
  } else if (normalized.includes('trusted entity')) {
    text = 'Selecione o tipo de entidade confiavel para guiar o formato de principal.';
    example = 'AWS Service';
    docs = [AWS_DOCS.iamRoles, AWS_DOCS.iamTrustPolicy];
  } else if (normalized.includes('principal')) {
    text = 'Informe um ou mais principals coerentes com o Trusted Entity selecionado.';
    example = 'lambda.amazonaws.com ou arn:aws:iam::123456789012:root';
    docs = [AWS_DOCS.iamRoles, AWS_DOCS.iamTrustPolicy];
  } else if (normalized.includes('permissoes iniciais da role')) {
    text = 'Escolha se a role sera criada sem permissao inicial ou com attach de policies existentes.';
    example = 'Realizar attach de policies existentes';
    docs = [AWS_DOCS.iamRoles, AWS_DOCS.iamPolicies];
  } else if (normalized.includes('policies existentes para attach')) {
    text = 'Informe nome ou ARN das policies existentes que devem ser anexadas no momento da criacao.';
    example = 'arn:aws:iam::aws:policy/ReadOnlyAccess';
    docs = [AWS_DOCS.iamPolicies];
  } else if (normalized.includes('nome da policy') && normalized.includes('taxonomia')) {
    text = 'Informe somente a parte variavel da policy; prefixo/sufixo seguem padrao corporativo.';
    example = 'AWS_PL_BLOCK_TRAIL_DELETE_PRD';
    docs = [AWS_DOCS.iamPolicies];
  } else if (normalized.includes('policy alvo')) {
    text = 'Informe nome ou ARN de IAM Managed Policy existente para alteracao/remocao.';
    example = 'arn:aws:iam::123456789012:policy/minha-policy';
    docs = [AWS_DOCS.iamPolicies];
  } else if (normalized.includes('actions necessarias')) {
    text = 'No create de policy managed, informe as actions IAM necessarias para o caso de uso.';
    example = 's3:GetObject, s3:PutObject, s3:ListBucket';
    docs = [AWS_DOCS.iamPolicies, AWS_DOCS.iamPolicyJson];
  } else if (normalized.startsWith('resources') || normalized.includes(' resources')) {
    text = 'No create, informe o nome exato do recurso AWS (nao descricao em texto livre). ARN tambem e aceito.';
    example = 'bucket-logs-aplicacao-prd (nome exato) ou arn:aws:s3:::bucket-logs-aplicacao-prd/*';
    docs = [AWS_DOCS.iamPolicies, AWS_DOCS.iamPolicyJson];
  } else if (normalized.includes('conditions')) {
    text = 'Opcional no create: informe conditions para restringir ainda mais a policy.';
    example = 'StringEquals aws:SourceVpce=vpce-0123456789abcdef0';
    docs = [AWS_DOCS.iamPolicies, AWS_DOCS.iamPolicyJson];
  } else if (normalized.includes('tipo de policy')) {
    text = 'Campo removido nesta fase: criacao, alteracao e remocao cobrem somente IAM Managed Policy com tipo implicito.';
    example = 'IAM Managed Policy';
    docs = [AWS_DOCS.iamPolicies];
  } else if (normalized.includes('json da policy') || normalized.includes('diff da policy')) {
    text = 'Informe JSON valido da policy ou diff esperado para execucao com rastreabilidade.';
    example = '{"Version":"2012-10-17","Statement":[...]}';
    docs = [AWS_DOCS.iamPolicies, AWS_DOCS.iamPolicyJson];
  } else if (normalized.includes('nome do grupo iam') && normalized.includes('taxonomia')) {
    text = 'Informe somente a parte variavel do grupo IAM seguindo padrao definido.';
    example = 'AWS_GR_BACKUP_OPERATORS_HML';
    docs = [AWS_DOCS.iamGroups];
  } else if (normalized.includes('grupo iam alvo')) {
    text = 'Informe nome ou ARN do grupo IAM existente para alteracao/remocao.';
    example = 'arn:aws:iam::123456789012:group/grupo-legado';
    docs = [AWS_DOCS.iamGroups];
  } else if (normalized.includes('acoes da alteracao do grupo iam')) {
    text = 'Selecione ao menos uma acao de alteracao para o grupo IAM e detalhe os itens envolvidos.';
    example = 'Adicionar policy + Remover usuario';
    docs = [AWS_DOCS.iamGroups, AWS_DOCS.iamPolicies, AWS_DOCS.iamUsers];
  } else if (normalized.includes('acoes da alteracao do pset')) {
    text = 'Selecione ao menos uma acao de alteracao para o PSET e detalhe os itens de policy/conta por acao.';
    example = 'Adicionar policy + Remover conta';
    docs = [AWS_DOCS.identityCenterPsets, AWS_DOCS.iamPolicies, AWS_DOCS.organizationsCreateAccount];
  } else if (normalized.includes('acoes da alteracao do usuario iam')) {
    text = 'Selecione ao menos uma acao de alteracao para o usuario IAM e detalhe os itens envolvidos. Em rotacao de key, a key atual e desativada e excluida apos 7 dias sem solicitacao de reativacao.';
    example = 'Adicionar policy + Remover grupo + Rotacionar key';
    docs = [AWS_DOCS.iamUsers, AWS_DOCS.iamGroups, AWS_DOCS.iamPolicies, AWS_DOCS.iamAccessKeys];
  } else if (normalized.includes('permissoes iniciais do grupo iam')) {
    text = 'Defina se o grupo sera criado sem permissao inicial ou com attach de policies existentes.';
    example = 'Realizar attach de policies existentes';
    docs = [AWS_DOCS.iamGroups, AWS_DOCS.iamPolicies];
  } else if (normalized.includes('permissoes iniciais do usuario iam')) {
    text = 'Defina se o usuario sera criado sem permissao inicial ou com vinculo em grupos/policies existentes.';
    example = 'Incluir em grupo IAM existente e attach de policies existentes';
    docs = [AWS_DOCS.iamUsers, AWS_DOCS.iamGroups, AWS_DOCS.iamPolicies];
  } else if (normalized.includes('grupos iam existentes para inclusao')) {
    text = 'Selecione um ou mais grupos IAM existentes para incluir o usuario apos a criacao.';
    example = 'IAM-Backup-Operators';
    docs = [AWS_DOCS.iamGroups];
  } else if (normalized.includes('policies do grupo')) {
    text = 'Informe policies que devem permanecer no grupo apos a criacao/ajuste.';
    example = 'ReadOnlyAccess, SecurityAudit';
    docs = [AWS_DOCS.iamPolicies, AWS_DOCS.iamGroups];
  } else if (normalized.includes('policies do pset')) {
    text = 'Informe uma ou mais policies para vincular ao PSET. Adicione uma policy por campo para facilitar a execucao.';
    example = 'ReadOnlyAccess, CloudWatchReadOnlyAccess';
    docs = [AWS_DOCS.identityCenterPsets, AWS_DOCS.iamPolicies];
  } else if (normalized.includes('usuario iam') && normalized.includes('taxonomia')) {
    text = 'Fluxo padrao: usuario IAM local de servico. Informe somente a parte variavel.';
    example = 'AWS_US_INTEGRACAO_ETL_HML';
    docs = [AWS_DOCS.iamUsers];
  } else if (normalized.includes('usuario iam alvo')) {
    text = 'Informe nome ou ARN de usuario IAM existente para alteracao/remocao.';
    example = 'arn:aws:iam::123456789012:user/usuario-legado';
    docs = [AWS_DOCS.iamUsers];
  } else if (normalized.includes('tipo de acesso')) {
    text = 'Selecione o tipo de acesso permitido para o fluxo selecionado, mantendo menor privilegio.';
    example = 'Administrador restrito (breaking glass) ou Programatico (usuario IAM de servico)';
    docs = [AWS_DOCS.iamUsers, AWS_DOCS.iamRoles];
  } else if (normalized.includes('escopo da auditoria')) {
    text = 'Defina exatamente o escopo tecnico/funcional que sera auditado.';
    example = 'Permissoes IAM';
  } else if (normalized.includes('periodo de referencia')) {
    text = 'Selecione a janela temporal de dados/evidencias para a auditoria.';
    example = 'Ultimos 90 dias';
  } else if (normalized.includes('id da auditoria')) {
    text = 'Informe o identificador da auditoria em andamento para alteracao/encerramento.';
    example = 'AWS-AUD-90001';
  } else if (normalized.includes('parecer final')) {
    text = 'Selecione o parecer consolidado ao encerrar a auditoria.';
    example = 'Conforme com ressalvas';
  } else if (normalized.includes('incidente relacionado')) {
    text = 'Informe o ID do incidente ativo que justifica o fluxo emergencial.';
    example = 'INC-2026-0042';
  } else if (normalized.includes('identidade que recebera acesso')) {
    text = 'Informe a identidade corporativa que recebera o acesso emergencial.';
    example = 'analista@corp.com';
  } else if (normalized.includes('duracao maxima') || normalized.includes('nova duracao maxima')) {
    text = 'Defina o menor tempo necessario para o acesso emergencial.';
    example = '1 hora';
  } else if (normalized.includes('ticket bg em andamento')) {
    text = 'Informe o ticket de breaking glass ja existente para ajuste ou revogacao.';
    example = 'AWS-BG-95001';
  } else if (normalized.includes('evidencia de revogacao')) {
    text = 'Descreva a evidencia objetiva de revogacao do acesso emergencial.';
    example = 'CloudTrail confirma sessao encerrada e privilegio removido';
  } else if (normalized.startsWith('alteracoes solicitadas')) {
    text = 'Descreva objetivamente o que deve mudar, com acao esperada, impacto e criterio de sucesso.';
    example = 'Adicionar policy X, remover policy Y e ajustar trust para incluir service Z.';
  } else if (normalized.includes('alteracoes de permissoes da role')) {
    text = 'Descreva inclusoes/remocoes de policies e permissoes de forma objetiva.';
    example = 'Adicionar SecurityAudit e remover PowerUserAccess.';
    docs = [AWS_DOCS.iamPolicies, AWS_DOCS.iamRoles];
  } else if (normalized.includes('alteracoes de trusted entity') || normalized.includes('trust policy')) {
    text = 'Descreva alteracoes de trusted entity/principals na trust policy da role.';
    example = 'Adicionar events.amazonaws.com e remover arn:aws:iam::123456789012:root.';
    docs = [AWS_DOCS.iamRoles, AWS_DOCS.iamTrustPolicy];
  } else if (normalized.includes('plano de descomissionamento')) {
    text = 'Descreva ordem de desativacao, migracao de workloads, logs e encerramento financeiro.';
    example = 'Migrar workloads, manter logs por 12 meses e encerrar billing.';
  } else if (normalized.includes('plano de remocao e reversao') || normalized.includes('plano de revogacao e migracao') || normalized.includes('plano de migracao dos membros') || normalized.includes('plano de revogacao de credenciais')) {
    text = 'Descreva plano passo a passo de execucao e reversao quando aplicavel.';
    example = 'Revogar acesso atual, aplicar substituto e validar sem impacto.';
  } else if (normalized.includes('justificativa emergencial')) {
    text = 'Explique incidente, impacto e por que o fluxo emergencial e indispensavel.';
    example = 'Incidente critico em producao com risco de indisponibilidade.';
  } else if (normalized === 'justificativa' || normalized.includes('justificativa')) {
    text = 'Justifique necessidade, risco mitigado e resultado esperado da solicitacao.';
    example = 'Ajuste necessario para atender auditoria e principio de menor privilegio.';
  } else if (normalized.includes('comentario')) {
    text = 'Campo opcional para contexto adicional que nao cabe nos demais campos.';
    example = 'Executar fora do horario comercial para reduzir impacto.';
  } else if (normalized.includes('upload de anexos') || normalized.includes('anexo de json')) {
    text = 'Upload opcional unico para evidencias da justificativa e arquivos tecnicos (incluindo JSON).';
    example = 'evidencias_operacao.pdf, trust-policy.json';
  } else if (normalized.includes('json')) {
    text = 'Anexe ou informe JSON tecnico quando necessario para execucao/auditoria.';
    example = '{"Version":"2012-10-17","Statement":[...]}';
    docs = [AWS_DOCS.iamPolicyJson];
  }

  return {
    text,
    example: example || 'Nao aplicavel',
    docs: dedupeDocs(docs),
  };
}

function renderTooltips(fields) {
  if (!fields || fields.length === 0) return '- Nao aplicavel';

  return dedupeFields(fields)
    .map((field) => {
      const tooltip = getTooltip(field);
      const docs = tooltip.docs.length > 0
        ? tooltip.docs.map((doc) => `[${doc.label}](${doc.url})`).join(', ')
        : 'Nao aplicavel';

      return [
        `- **${field}**`,
        `  Tooltip: ${tooltip.text}`,
        `  Exemplo: ${tooltip.example}`,
        `  Documentacao AWS: ${docs}`,
      ].join('\n');
    })
    .join('\n\n');
}

function bullets(items) {
  return !items || items.length === 0 ? '- Nao aplicavel' : items.map((x) => `- ${x}`).join('\n');
}

function explainField(field) {
  if (field === 'Conta AWS') return 'Conta AWS alvo da execucao; ambiente e implicito na conta selecionada.';
  if (field === 'Contas AWS') return 'Conta(s) alvo da execucao. Exemplo: 123456789012 (prd-payment-gateway).';
  if (field === 'Titulo da solicitacao') return 'Resumo objetivo da demanda de levantamento para facilitar triagem e execucao.';
  if (field === 'Descricao do levantamento') return 'Campo livre para o solicitante descrever exatamente o que precisa levantar, incluindo escopo amplo e/ou alvos especificos.';
  if (field === 'Tipo de levantamento') return 'Define o contexto principal da consulta (IAM, Conta, Rede, Servicos, etc.) e influencia sugestoes/condicionais.';
  if (field === 'Escopo') return 'Define alcance organizacional do levantamento (conta, multiplas contas, OU ou organizacao inteira).';
  if (field === 'Conta AWS alvo / Contas AWS alvo (conforme escopo)') return 'Campo condicional usado quando o escopo exige conta(s) especifica(s).';
  if (field === 'OU alvo (quando aplicavel)') return 'Campo condicional usado quando o escopo e OU inteira.';
  if (field === 'Regiao AWS') return 'Regiao principal para consulta de recursos e configuracoes no levantamento.';
  if (field === 'Objeto do levantamento') return 'Lista multipla de objetos alvo da consulta (identidades, recursos, servicos, quotas, etc.).';
  if (field === 'Tipo de informacao desejada') return 'Lista multipla do tipo de resposta esperada (inventario, configuracao, ultimo uso, permissoes, etc.).';
  if (field === 'Formato de saida') return 'Define formato de entrega esperado no chamado (texto, tabela, CSV/XLSX, relatorio).';
  if (field === 'Nivel de detalhamento') return 'Define profundidade tecnica da resposta para equilibrar prazo e granularidade.';
  if (field === 'Urgencia') return 'Prioridade operacional informada pelo solicitante para ordenacao de atendimento.';
  if (field === 'Justificativa do levantamento') return 'Motivacao formal da consulta e resultado esperado para aprovacao e rastreabilidade.';
  if (field === 'Nome do recurso') return 'Filtro opcional por nome exato de recurso AWS.';
  if (field === 'ID') return 'Filtro opcional por identificador tecnico do recurso.';
  if (field === 'ARN') return 'Filtro opcional por ARN para consulta precisa.';
  if (field === 'Tag chave') return 'Filtro opcional por chave de tag.';
  if (field === 'Tag valor') return 'Filtro opcional por valor de tag.';
  if (field === 'Nome do usuario / role / policy') return 'Filtro opcional por identidade IAM alvo.';
  if (field === 'Servico AWS') return 'Filtro opcional/condicional por servico AWS (EC2, S3, IAM, etc.).';
  if (field === 'Periodo de referencia') return 'Janela temporal para consultas de historico/uso.';
  if (field === 'Nome da conta AWS') return 'Nome final da conta solicitado no padrao corporativo de nomenclatura.';
  if (field === 'Descricao / finalidade da conta') return 'Finalidade operacional da conta e escopo de workload esperado.';
  if (field === 'Tipo de conta') return 'Classificacao funcional da conta para aplicacao de guardrails e ownership.';
  if (field === 'Ambiente') return 'Ambiente operacional da conta (DEV/HML/PRD/Sandbox).';
  if (field === 'Responsavel de negocio') return 'Owner de negocio responsavel pelo resultado e prioridade da conta.';
  if (field === 'E-mail do responsavel principal') return 'Contato corporativo principal para comunicacao e governanca da conta.';
  if (field === 'Responsavel tecnico') return 'Owner tecnico da conta para operacao, suporte e tratativas de mudanca.';
  if (field === 'Gestor aprovador') return 'Gestor que aprova formalmente a criacao da conta.';
  if (field === 'Centro de custo') return 'Identificador financeiro para alocacao de despesas da conta.';
  if (field === 'Unidade de negocio') return 'Unidade organizacional responsavel pela conta.';
  if (field === 'Justificativa da criacao') return 'Motivacao formal da abertura da conta para aprovacao e auditoria.';
  if (field === 'Nome do PSET') return 'No create, usa nomenclatura padronizada; em alteracao/remocao, identifica o PSET alvo por nome existente ou ARN.';
  if (field === 'Acoes da Alteracao do PSET') return 'Dropdown com acoes padronizadas (policy e conta); ao menos uma acao obrigatoria com detalhamento por item.';
  if (field === 'Nome da Role') return 'No create, usa nomenclatura padronizada para gerar o nome final da role no ambiente da conta selecionada.';
  if (field === 'Role alvo para alteracao') return 'Nome livre ou ARN da role existente que sera alterada.';
  if (field === 'Role alvo para remocao') return 'Nome livre ou ARN da role existente que sera removida.';
  if (field === 'Acoes da Alteracao da Role') return 'Dropdown com acoes padronizadas; ao menos uma acao obrigatoria com detalhamento por item.';
  if (field === 'Acoes da Alteracao do Usuario IAM') return 'Dropdown com acoes padronizadas (policy, grupo e rotacao de key); ao menos uma acao obrigatoria com detalhamento por item. Em rotacao de key, a key atual e desativada e excluida apos 7 dias sem reativacao.';
  if (field === 'Roles alvo para alteracao (nome livre + ambiente)') return 'Lista dinamica: para cada role informada em texto livre, selecionar o ambiente correspondente no dropdown.';
  if (field === 'Roles alvo para remocao (nome livre + ambiente)') return 'Lista dinamica: para cada role informada em texto livre, selecionar o ambiente correspondente no dropdown.';
  if (field.includes('Alvo (nome/ARN)')) return 'Identificador livre do recurso existente (nome legado ou ARN), sem exigir taxonomia nova.';
  if (field.includes('(nome livre)')) return 'Nome existente do recurso, sem imposicao de taxonomia de criacao.';
  if (field === 'Justificativa' || field === 'Justificativa Emergencial') return 'Motivacao formal para aprovacao e auditoria.';
  if (normalizeText(field).includes('comentario')) return 'Campo opcional para contexto adicional e orientacoes de execucao.';
  if (normalizeText(field).includes('upload de anexos')) return 'Upload opcional unico para evidencias da justificativa e artefatos tecnicos.';
  if (field.includes('Taxonomia')) return 'Campo de nomenclatura padronizada para reduzir ambiguidade.';
  if (field.includes('JSON')) return 'Evidencia tecnica JSON para execucao/auditoria.';
  if (field.includes('Plano')) return 'Plano de execucao controlada e, quando aplicavel, reversao.';
  return 'Campo tecnico/operacional necessario para execucao segura.';
}

function detailedFields(fields) {
  return !fields || fields.length === 0
    ? '- Nao aplicavel'
    : fields.map((f) => `- **${f}**: ${explainField(f)}`).join('\n');
}

function renderDecisionSections(cat, action) {
  const jsonInfo = cat.jsonUpload
    ? 'A categoria aceita anexo opcional de JSON tecnico para apoiar execucao e auditoria.'
    : 'A categoria nao usa anexo JSON no fluxo padrao.';

  const items = [
    ['Fluxo em tela unica', 'Preenchimento em tela unica reduz friccao; revisao final e obrigatoria antes do envio.', 'Solicitante revisa categoria, acao, escopo e justificativa antes de confirmar.'],
    ['Categoria e acao implicitas pela navegacao', 'A rota do catalogo define automaticamente o contexto da solicitacao.', `Esta solicitacao ja nasce no contexto de "${action.name}".`],
    ['Coleta minima de dados', 'Somente campos que impactam execucao, risco e auditoria permanecem obrigatorios.', 'Campos variam por categoria; no levantamento AWS ha titulo da solicitacao para orientar a consulta.'],
    ['Escopo e validacao operacional', 'A categoria define regras de escopo para evitar erro de execucao.', cat.categoryRules[0] || 'Escopo validado antes da revisao final.'],
    ['Padroes e taxonomia', 'Naming e padroes operacionais sao obrigatorios para consistencia e automacao.', cat.taxonomy[0]],
    ['Requisitos e aprovacoes formais', 'Prerequisitos, validacoes e cadeia de aprovacao sustentam governanca e compliance.', `Aprovadores: ${cat.approvals.join(', ')}.`],
    ['Evidencia tecnica', jsonInfo, cat.jsonUpload ? 'Exemplo: trust-policy.json e permission-policy.json.' : 'Evidencia registrada no proprio formulario.'],
    ['Regra especifica da acao', action.rules.join(' '), action.examples[0] || 'Aplicar regra conforme contexto.'],
  ];

  return items
    .map((item, i) => `### 2.${i + 1} ${item[0]}\n**Explicacao**: ${item[1]}\n**Exemplo**: ${item[2]}`)
    .join('\n\n');
}

function renderAdr(fileName, catId, actionId) {
  const cat = CATS[catId];
  const action = cat.actions[actionId];
  const requiredFields = normalizeRequiredFields(action);
  const optionalFields = normalizeOptionalFields(action);

  return [
    `# ${path.parse(fileName).name}`,
    '',
    '- Status: Proposto',
    `- Data: ${TODAY}`,
    `- Tipo de solicitacao: ${actionId}`,
    `- Categoria: ${cat.name}`,
    `- Acao registrada: ${action.name}`,
    '',
    '## 1. Contexto da Tela',
    `Categoria com criticidade **${cat.criticality}**, SLA **${cat.sla}** e tipo **${cat.type}**.`,
    cat.description,
    `Quando usar: ${cat.whenToUse}`,
    `Foco deste ADR: somente a tela de **${action.name}**.`,
    '',
    '## 2. Decisoes Arquiteturais (itens detalhados)',
    renderDecisionSections(cat, action),
    '',
    `## 3. Campos da Tela (${action.name})`,
    `**Objetivo da tela**: ${action.objective}`,
    '### 3.1 Campos obrigatorios',
    bullets(requiredFields),
    '',
    '### 3.2 Campos opcionais',
    bullets(optionalFields),
    '',
    '## 4. Detalhamento dos Campos da Tela',
    '### 4.1 Campos obrigatorios com explicacao',
    detailedFields(requiredFields),
    '',
    '### 4.2 Campos opcionais com explicacao',
    detailedFields(optionalFields),
    '',
    '## 5. Requisitos Aplicaveis a Esta Tela',
    '### 5.1 Prerequisitos',
    bullets(cat.prerequisites),
    '',
    '### 5.2 Documentos e evidencias',
    bullets(cat.documents),
    '',
    '### 5.3 Validacoes obrigatorias',
    bullets(cat.validations),
    '',
    '### 5.4 Cadeia de aprovacao',
    bullets(cat.approvals),
    '',
    '## 6. Padroes Aplicaveis a Esta Tela',
    '### 6.1 Taxonomia e nomenclatura',
    bullets(cat.taxonomy),
    '',
    '### 6.2 Padroes operacionais',
    bullets(cat.standards),
    '',
    '### 6.3 Regras especificas desta acao',
    bullets(action.rules),
    '',
    '## 7. Exemplos da Tela',
    bullets(action.examples),
    '',
    '## 8. Tooltips da Tela',
    '### 8.1 Tooltips dos campos obrigatorios',
    renderTooltips(requiredFields),
    '',
    '### 8.2 Tooltips dos campos opcionais',
    renderTooltips(optionalFields),
    '',
    '## 9. Consequencias',
    '- Reduz ambiguidade de preenchimento e melhora consistencia operacional.',
    '- Facilita implementacao backend, QA e auditoria.',
    '- Serve como base de treinamento para solicitantes e aprovadores.',
    '',
  ].join('\n');
}

function renderGeneralAdr() {
  const summary = Object.values(CATS).map((c) => `- **${c.name}**: criticidade ${c.criticality}, SLA ${c.sla}, tipo ${c.type}`).join('\n');
  const tax = Object.values(CATS).flatMap((c) => c.taxonomy.map((t) => `- ${c.name}: ${t}`)).join('\n');
  return [
    '# ADR_DECISOES_GERAIS_ISM_AWS', '',
    '- Status: Proposto', `- Data: ${TODAY}`, '- Escopo: Sistema ISM para solicitacoes de atividades AWS por SI', '',
    '## 1. Contexto', 'Consolida decisoes transversais de UX, governanca e seguranca do catalogo AWS.', '',
    '## 2. Itens de Decisao com Secao Propria',
    '### 2.1 Fluxo em tela unica com revisao final\n**Explicacao**: Formularios em tela unica reduzem retrabalho.\n**Exemplo**: Revisar escopo e justificativa antes de enviar.',
    '### 2.2 Categoria/acao implicitas por rota\n**Explicacao**: Navegacao no catalogo define o contexto da solicitacao.\n**Exemplo**: /catalog/aws-roles/new/role-create.',
    '### 2.3 Coleta minima de dados\n**Explicacao**: Apenas campos essenciais ficam no formulario.\n**Exemplo**: Campos variam por categoria; no levantamento AWS existe titulo da solicitacao para orientar a analise.',
    '### 2.4 Taxonomia padronizada\n**Explicacao**: Naming padrao sustenta rastreabilidade e automacao.\n**Exemplo**: AWS_RL_LAMBDA_INTEGRATION_PRD.',
    '### 2.5 Governanca IAM e excecoes\n**Explicacao**: Fluxo padrao privilegia menor privilegio e identidade corporativa.\n**Exemplo**: Usuario IAM pessoal local somente por fluxo de excecao.',
    '### 2.6 Escopo especial para Role AWS\n**Explicacao**: Role opera com escopo unitario por chamado: 1 conta AWS (ambiente implicito) e 1 role por solicitacao.\n**Exemplo**: Criar AWS_RL_APP_READONLY_PRD na conta prd-payment-gateway.',
    '### 2.7 Evidencia tecnica e anexos\n**Explicacao**: Categorias tecnicas permitem upload opcional de JSON.\n**Exemplo**: Anexar trust policy em role.',
    '### 2.8 Evidencia visual obrigatoria\n**Explicacao**: Mudanca em categoria/tela exige update de screenshots.\n**Exemplo**: npm run screenshots:update no mesmo PR.', '',
    '## 3. Mapa de Categorias', summary, '',
    '## 4. Taxonomias Consolidadas', tax, '',
    '## 5. Consequencias', '- Padronizacao documental para todos os ADRs por solicitacao.', '- Melhora de onboarding, QA e auditoria.', '- Menor risco de interpretacao divergente entre times.', '',
  ].join('\n');
}

function renderAdrReadme() {
  const list = TARGETS.map(([file]) => `- ${path.parse(file).name}`).join('\n');
  return [
    '# ADRs do Projeto', '',
    'Este diretorio concentra os Architecture Decision Records (ADRs) do My ISTM.', '',
    '- ADR geral: ADR_DECISOES_GERAIS_ISM_AWS', `- ADRs por tipo de solicitacao: ${TARGETS.length} documentos`, '',
    '## Estrutura padrao de cada ADR',
    '- Contexto da tela/acao',
    '- Itens de decisao com secao propria (explicacao + exemplo)',
    '- Campos da tela (somente acao atual)',
    '- Detalhamento dos campos da tela',
    '- Requisitos aplicaveis a tela',
    '- Padroes aplicaveis a tela',
    '- Exemplos da tela',
    '- Tooltips dos campos (texto, exemplo e links AWS quando aplicavel)',
    '- Consequencias', '',
    '## Lista de ADRs por solicitacao', list, '',
  ].join('\n');
}

for (const [file, catId, actionId] of TARGETS) {
  writeFileSync(path.join(ADR_DIR, file), renderAdr(file, catId, actionId), 'utf-8');
}
writeFileSync(path.join(ADR_DIR, 'ADR_DECISOES_GERAIS_ISM_AWS.md'), renderGeneralAdr(), 'utf-8');
writeFileSync(path.join(ADR_DIR, 'README.md'), renderAdrReadme(), 'utf-8');
console.log(`ADRs atualizados: ${TARGETS.length + 2} arquivos`);
