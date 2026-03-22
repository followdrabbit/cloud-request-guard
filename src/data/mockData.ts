// ============ CATALOG STRUCTURE ============
export type CategoryType = 'standard' | 'audit' | 'breaking-glass';

export interface RequestType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface MacroCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: CategoryType;
  criticality: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  sla: string;
  requestTypes: RequestType[];
  prerequisites: string[];
  documents: string[];
  validations: string[];
  approvals: string[];
  whenToUse: string;
  relatedExamples: string[];
}

export const catalog: MacroCategory[] = [
  // 1. Contas AWS
  {
    id: 'aws-accounts',
    name: 'Contas AWS',
    description: 'Solicitações de criação, alteração e remoção de contas AWS na organização corporativa.',
    icon: 'Building2',
    type: 'standard',
    criticality: 'Crítica',
    sla: '5 dias úteis',
    requestTypes: [
      { id: 'account-create', name: 'Criação de conta AWS', description: 'Nova conta dentro da AWS Organization com baseline corporativa.', icon: 'Plus' },
      { id: 'account-update', name: 'Alteração de conta AWS', description: 'Ajuste de guardrails, owner, configuração e parâmetros de conta existente.', icon: 'Edit' },
      { id: 'account-delete', name: 'Remoção de conta AWS', description: 'Descomissionamento controlado de conta com plano de migração e retenção de evidências.', icon: 'Trash2' },
    ],
    prerequisites: ['Aprovação executiva', 'Centro de custo definido', 'Owner técnico designado'],
    documents: ['Business case', 'Classificação de dados', 'Plano de compliance'],
    validations: ['E-mail único na organização', 'Nome padronizado (env-projeto)', 'Owner técnico e executivo definidos', 'Baseline obrigatória', 'Centro de custo válido'],
    approvals: ['Gestor solicitante', 'Arquiteto Cloud', 'Segurança Cloud', 'Governança Cloud'],
    whenToUse: 'Quando um novo projeto, sistema ou workload precisar de isolamento em conta AWS dedicada dentro da organização.',
    relatedExamples: ['Conta produtiva para sistema de pagamentos (PCI-DSS)', 'Conta sandbox para equipe de dados'],
  },
  // 2. Levantamento de Informações AWS
  {
    id: 'aws-information',
    name: 'Levantamento de Informações AWS',
    description: 'Solicitações para consultas, inventários e extrações de informações sobre contas, recursos, serviços, identidades e configurações AWS.',
    icon: 'Search',
    type: 'standard',
    criticality: 'Alta',
    sla: '24 horas úteis',
    requestTypes: [
      { id: 'info-create', name: 'Levantamento de informações AWS', description: 'Abertura de solicitação para levantamento técnico/funcional de informações em ambientes AWS.', icon: 'Search' },
    ],
    prerequisites: ['Objetivo do levantamento definido', 'Descrição do levantamento informada', 'Justificativa formal'],
    documents: ['Descrição do levantamento', 'Anexos de apoio (quando aplicável)'],
    validations: ['Descrição do levantamento obrigatória', 'Justificativa obrigatória'],
    approvals: ['Gestor solicitante', 'Segurança Cloud', 'Cloud Governance'],
    whenToUse: 'Quando houver necessidade de consultar, inventariar ou extrair informações em AWS para operação, governança, segurança, compliance ou planejamento.',
    relatedExamples: ['Dump de roles e policies em todas as contas', 'Inventário de recursos em toda a organização', 'Consulta detalhada de um recurso específico'],
  },
  // 3. Acessos Corporativos (AD + Identity Center)
  {
    id: 'aws-profiles',
    name: 'Acessos Corporativos (AD + Identity Center)',
    description: 'Solicitações de criação, alteração e remoção de perfis corporativos integrando AD e AWS IAM Identity Center.',
    icon: 'Users',
    type: 'standard',
    criticality: 'Alta',
    sla: '72 horas úteis',
    requestTypes: [
      { id: 'profile-create', name: 'Criação de perfil corporativo', description: 'Novo perfil integrando grupo AD, PSET e contas AWS.', icon: 'UserPlus' },
      { id: 'profile-update', name: 'Alteração de perfil corporativo', description: 'Ajuste de grupo AD, escopo de contas e permissões de perfil existente.', icon: 'Edit' },
      { id: 'profile-delete', name: 'Remoção de perfil corporativo', description: 'Desativação de perfil corporativo e revogação controlada de acessos.', icon: 'Trash2' },
    ],
    prerequisites: ['PSET existente ou em criação simultânea', 'Grupo AD definido', 'Conta(s) AWS definidas'],
    documents: ['Justificativa de negócio', 'Matriz de acesso pretendida'],
    validations: ['Grupo AD obrigatório', 'PSET vinculado obrigatório', 'Ao menos uma conta AWS', 'Produção exige aprovação adicional', 'Princípio do menor privilégio'],
    approvals: ['Gestor solicitante', 'Segurança Cloud', 'IAM Admin'],
    whenToUse: 'Quando precisar criar ou ajustar um perfil completo de acesso envolvendo grupo AD, PSET e contas AWS.',
    relatedExamples: ['Perfil corporativo para equipe de SRE com leitura em todas as contas produtivas', 'Perfil de administrador restrito para time de DevOps'],
  },
  // 3. Usuários IAM AWS
  {
    id: 'aws-iam-users',
    name: 'Usuários IAM AWS',
    description: 'Solicitações de criação, alteração e remoção de usuários IAM locais em contas AWS.',
    icon: 'UserCog',
    type: 'standard',
    criticality: 'Alta',
    sla: '24 horas úteis',
    requestTypes: [
      { id: 'iam-user-create', name: 'Criação de usuário IAM', description: 'Criação de usuário IAM local com escopo controlado e rastreável.', icon: 'Plus' },
      { id: 'iam-user-update', name: 'Alteração de usuário IAM', description: 'Ajuste de permissões, credenciais e associação de grupos do usuário IAM.', icon: 'Edit' },
      { id: 'iam-user-delete', name: 'Remoção de usuário IAM', description: 'Desativação e remoção de usuário IAM com revogação de credenciais.', icon: 'Trash2' },
    ],
    prerequisites: ['Conta AWS ativa', 'Justificativa de exceção para usuário local', 'Owner técnico definido'],
    documents: ['Justificativa de negócio', 'Escopo de permissões', 'Plano de desativação (para remoção)'],
    validations: ['MFA obrigatório para acesso console', 'Sem privilégios administrativos sem justificativa', 'Access keys com rotação definida', 'Produção exige aprovação reforçada'],
    approvals: ['Gestor solicitante', 'Segurança Cloud', 'IAM Admin'],
    whenToUse: 'Quando houver necessidade excepcional de usuário IAM local para integração legada, automação específica ou contingência controlada.',
    relatedExamples: ['Usuário IAM de integração para ferramenta legada', 'Remoção de usuário IAM órfão após desligamento'],
  },
  // 4. Grupos IAM AWS
  {
    id: 'aws-iam-groups',
    name: 'Grupos IAM AWS',
    description: 'Solicitações de criação, alteração e remoção de grupos IAM para organização de permissões.',
    icon: 'Users',
    type: 'standard',
    criticality: 'Alta',
    sla: '24 horas úteis',
    requestTypes: [
      { id: 'iam-group-create', name: 'Criação de grupo IAM', description: 'Criação de grupo IAM com políticas anexadas conforme menor privilégio.', icon: 'Plus' },
      { id: 'iam-group-update', name: 'Alteração de grupo IAM', description: 'Ajuste de políticas, membros e escopo de permissões do grupo IAM.', icon: 'Edit' },
      { id: 'iam-group-delete', name: 'Remoção de grupo IAM', description: 'Remoção de grupo IAM com migração de usuários para grupo substituto.', icon: 'Trash2' },
    ],
    prerequisites: ['Conta AWS ativa', 'Escopo de permissões definido', 'Matriz de acesso atualizada'],
    documents: ['Matriz de acesso', 'Lista de políticas a anexar/remover', 'Plano de migração de membros'],
    validations: ['Sem policy com wildcard crítico sem justificativa', 'Grupo sem membros privilegiados indevidos', 'Remoção exige grupo substituto quando aplicável'],
    approvals: ['Gestor solicitante', 'Segurança Cloud', 'IAM Admin'],
    whenToUse: 'Quando for necessário estruturar permissões compartilhadas para usuários IAM em conta específica.',
    relatedExamples: ['Grupo IAM para operadores de backup', 'Ajuste de políticas do grupo IAM de suporte'],
  },
  // 5. PSET AWS
  {
    id: 'aws-psets',
    name: 'PSET AWS',
    description: 'Solicitações de criação, alteração e remoção de Permission Sets no AWS IAM Identity Center.',
    icon: 'KeyRound',
    type: 'standard',
    criticality: 'Alta',
    sla: '48 horas úteis',
    requestTypes: [
      { id: 'pset-create', name: 'Criação de PSET', description: 'Novo Permission Set com policies gerenciadas ou customizadas.', icon: 'Plus' },
      { id: 'pset-update', name: 'Alteração de PSET', description: 'Ajuste de policies, boundary, sessão e associação em PSET existente.', icon: 'Edit' },
      { id: 'pset-delete', name: 'Remoção de PSET', description: 'Remoção controlada de PSET com plano de migração de acessos.', icon: 'Trash2' },
    ],
    prerequisites: ['Identity Center configurado', 'Grupo AD identificado'],
    documents: ['Justificativa técnica', 'Lista de policies pretendidas'],
    validations: ['Ao menos uma policy obrigatória', 'Permission boundary em produção', 'Grupo AD vinculado obrigatório', 'Session duration definida'],
    approvals: ['Gestor solicitante', 'Segurança Cloud', 'IAM Admin'],
    whenToUse: 'Para criar perfis de permissão padronizados atribuídos via AWS IAM Identity Center.',
    relatedExamples: ['PSET ReadOnly para time de observabilidade', 'PSET PowerUser para equipe de DevOps'],
  },
  // 6. Role AWS
  {
    id: 'aws-roles',
    name: 'Role AWS',
    description: 'Solicitações de criação, alteração e remoção de IAM Roles para workloads e serviços AWS.',
    icon: 'ShieldCheck',
    type: 'standard',
    criticality: 'Alta',
    sla: '48 horas úteis',
    requestTypes: [
      { id: 'role-create', name: 'Criação de role', description: 'Nova IAM Role para serviço, aplicação ou workload.', icon: 'Plus' },
      { id: 'role-update', name: 'Alteração de role', description: 'Ajuste de trust policy, permissions e boundary de role existente.', icon: 'Edit' },
      { id: 'role-delete', name: 'Remoção de role', description: 'Remoção de role com validação de dependências e plano de rollback.', icon: 'Trash2' },
    ],
    prerequisites: ['Conta AWS ativa', 'Trusted entity definida'],
    documents: ['Justificativa de menor privilégio', 'JSON de policy customizada (se aplicável)'],
    validations: ['Nome padronizado obrigatório', 'Account ID obrigatório', 'Trusted entity obrigatória', 'Permission boundary em produção', 'Cross-account exige conta origem e destino', 'Policy JSON válido'],
    approvals: ['Gestor solicitante', 'Segurança Cloud', 'IAM Admin'],
    whenToUse: 'Quando um serviço, aplicação ou entidade precisar assumir permissões específicas via IAM Role.',
    relatedExamples: ['Role para Lambda de integração com S3', 'Role cross-account para pipeline CI/CD'],
  },
  // 7. Policy AWS
  {
    id: 'aws-policies',
    name: 'Policy AWS',
    description: 'Solicitações de criação, alteração e remoção de policies IAM, boundaries, SCPs e resource policies.',
    icon: 'FileText',
    type: 'standard',
    criticality: 'Alta',
    sla: '48 horas úteis',
    requestTypes: [
      { id: 'policy-create', name: 'Criação de policy', description: 'Criação de nova policy para IAM, SCP, boundary ou resource policy.', icon: 'Plus' },
      { id: 'policy-update', name: 'Alteração de policy', description: 'Ajuste de statements, actions, resources e conditions de policy existente.', icon: 'Edit' },
      { id: 'policy-delete', name: 'Remoção de policy', description: 'Remoção de policy com análise de impacto e plano de reversão.', icon: 'Trash2' },
    ],
    prerequisites: ['Conta ou OU alvo definida', 'Owner técnico identificado', 'Escopo da policy detalhado'],
    documents: ['JSON atual e JSON proposto', 'Justificativa de negócio e risco', 'Plano de rollback'],
    validations: ['JSON válido', 'Sem wildcard crítico sem justificativa', 'Change window definida para produção', 'Teste em ambiente não produtivo quando aplicável', 'Aprovação reforçada para SCP e boundary'],
    approvals: ['Gestor solicitante', 'Segurança Cloud', 'IAM Admin', 'Governança Cloud'],
    whenToUse: 'Quando houver necessidade de criar ou alterar políticas de permissão e controle para proteger workloads AWS com rastreabilidade e aprovação formal.',
    relatedExamples: ['SCP para bloquear desativação de CloudTrail e Config', 'Permission boundary para workloads de desenvolvimento', 'Revisão de policy KMS para acesso cross-account'],
  },
  // 8. Auditoria AWS
  {
    id: 'aws-audit',
    name: 'Auditoria AWS',
    description: 'Solicitações de abertura, alteração e encerramento de auditorias de segurança em ambientes AWS.',
    icon: 'ClipboardCheck',
    type: 'audit',
    criticality: 'Alta',
    sla: '5–7 dias úteis',
    requestTypes: [
      { id: 'audit-create', name: 'Abertura de auditoria', description: 'Início formal de auditoria com escopo e período definidos.', icon: 'Plus' },
      { id: 'audit-update', name: 'Alteração de auditoria', description: 'Ajuste de escopo, prazo, controles e critérios da auditoria em andamento.', icon: 'Edit' },
      { id: 'audit-close', name: 'Encerramento de auditoria', description: 'Conclusão da auditoria com registro de evidências, achados e parecer final.', icon: 'CheckSquare' },
    ],
    prerequisites: ['Conta(s) AWS alvo definidas', 'Escopo de análise claro'],
    documents: ['Escopo da auditoria', 'Justificativa e base regulatória'],
    validations: ['Ao menos um escopo obrigatório', 'Justificativa obrigatória', 'Conta AWS obrigatória', 'Escopo amplo requer aprovação extra'],
    approvals: ['Gestor solicitante', 'Cloud Audit Specialist', 'Segurança Cloud'],
    whenToUse: 'Para solicitar levantamentos, inventários e revisões de conformidade em contas e recursos AWS.',
    relatedExamples: ['Inventário de recursos em conta produtiva', 'Auditoria de permissões administrativas semestrais'],
  },
  // 9. Breaking Glass AWS
  {
    id: 'aws-emergency',
    name: 'Breaking Glass AWS',
    description: 'Solicitações de concessão, alteração e revogação de acesso emergencial para incidentes críticos.',
    icon: 'AlertOctagon',
    type: 'breaking-glass',
    criticality: 'Crítica',
    sla: '30 min – 1 hora',
    requestTypes: [
      { id: 'bg-create', name: 'Concessão de acesso emergencial', description: 'Concessão inicial de acesso temporário para resposta a incidente crítico.', icon: 'Plus' },
      { id: 'bg-update', name: 'Alteração de acesso emergencial', description: 'Prorrogação ou ajuste de escopo de acesso emergencial em execução.', icon: 'Edit' },
      { id: 'bg-revoke', name: 'Revogação de acesso emergencial', description: 'Encerramento e revogação formal de acesso breaking glass.', icon: 'ShieldOff' },
    ],
    prerequisites: ['Incidente registrado e ativo', 'Justificativa emergencial', 'Aprovação de segurança'],
    documents: ['Evidência do incidente', 'Plano de ação', 'Justificativa emergencial'],
    validations: ['Incidente obrigatório', 'Justificativa obrigatória', 'Conta AWS obrigatória', 'Duração máxima obrigatória', 'Revogação automática obrigatória', 'Revisão pós-uso obrigatória'],
    approvals: ['Gestor solicitante', 'Segurança Cloud', 'Incident Response', 'CISO'],
    whenToUse: 'Em caso de incidente crítico que exija atuação imediata fora dos fluxos padrão de acesso.',
    relatedExamples: ['Acesso emergencial admin para troubleshooting em produção', 'Leitura emergencial de CloudTrail para análise de incidente'],
  },
];

// ============ TICKETS ============
export type TicketStatus = 'Em Preenchimento' | 'Aguardando Aprovação' | 'Aprovado' | 'Em Execução' | 'Concluído' | 'Rejeitado' | 'Cancelado';
export type Criticality = 'Baixa' | 'Média' | 'Alta' | 'Crítica';
export type Environment = 'Desenvolvimento' | 'Homologação' | 'Produção';

export interface Ticket {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  requestTypeId: string;
  requestTypeName: string;
  type: CategoryType;
  requester: string;
  requesterEmail: string;
  team: string;
  manager: string;
  environment: Environment;
  criticality: Criticality;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  sla: string;
  description: string;
  justification: string;
  project: string;
  costCenter: string;
  system: string;
  accountId?: string;
  accountName?: string;
  incidentId?: string;
  breakingGlassDuration?: string;
  postReviewStatus?: 'Pendente' | 'Em Análise' | 'Concluída';
}

export const tickets: Ticket[] = [
  // STANDARD
  {
    id: 'AWS-REQ-84721', title: 'Criação de Role para Lambda de integração com S3', categoryId: 'aws-roles', categoryName: 'Role AWS', requestTypeId: 'role-create', requestTypeName: 'Criação de role', type: 'standard',
    requester: 'Ana Souza', requesterEmail: 'ana.souza@corp.com', team: 'Engenharia de Dados', manager: 'Carlos Silva', environment: 'Produção', criticality: 'Alta', status: 'Aguardando Aprovação',
    createdAt: '2024-01-15T10:30:00', updatedAt: '2024-01-15T14:22:00', sla: '48 horas úteis',
    description: 'Role necessária para função Lambda que processa arquivos de integração no bucket S3 de produção.', justification: 'Pipeline de dados crítica para reconciliação financeira diária.',
    project: 'Data Pipeline v2', costCenter: 'CC-4521', system: 'Sistema de Reconciliação', accountId: '123456789012', accountName: 'prd-payment-gateway',
  },
  {
    id: 'AWS-REQ-84722', title: 'PSET ReadOnly para time de observabilidade', categoryId: 'aws-psets', categoryName: 'PSET AWS', requestTypeId: 'pset-create', requestTypeName: 'Criação de PSET', type: 'standard',
    requester: 'Bruno Mendes', requesterEmail: 'bruno.mendes@corp.com', team: 'SRE / Observabilidade', manager: 'Juliana Costa', environment: 'Produção', criticality: 'Média', status: 'Em Execução',
    createdAt: '2024-01-14T09:15:00', updatedAt: '2024-01-15T11:00:00', sla: '48 horas úteis',
    description: 'Permission Set de leitura para equipe de SRE monitorar recursos em contas de produção.', justification: 'Time de SRE precisa visibilidade em todas as contas para troubleshooting.',
    project: 'Observability Platform', costCenter: 'CC-3201', system: 'Grafana / CloudWatch',
  },
  {
    id: 'AWS-REQ-84723', title: 'Perfil corporativo para equipe de SRE com AD e PSET', categoryId: 'aws-profiles', categoryName: 'Acessos Corporativos (AD + Identity Center)', requestTypeId: 'profile-create', requestTypeName: 'Criação de perfil corporativo', type: 'standard',
    requester: 'Juliana Costa', requesterEmail: 'juliana.costa@corp.com', team: 'SRE / Observabilidade', manager: 'Ricardo Almeida', environment: 'Produção', criticality: 'Alta', status: 'Aguardando Aprovação',
    createdAt: '2024-01-13T16:45:00', updatedAt: '2024-01-14T08:30:00', sla: '72 horas úteis',
    description: 'Perfil completo integrando grupo AD, PSET e contas AWS para equipe de SRE.', justification: 'Padronização de acessos da equipe de SRE em múltiplas contas.',
    project: 'IAM Governance', costCenter: 'CC-3201', system: 'AWS Identity Center',
  },
  {
    id: 'AWS-REQ-84724', title: 'Nova conta de produção para sistema de pagamentos', categoryId: 'aws-accounts', categoryName: 'Contas AWS', requestTypeId: 'account-create', requestTypeName: 'Criação de conta AWS', type: 'standard',
    requester: 'Ricardo Almeida', requesterEmail: 'ricardo.almeida@corp.com', team: 'Arquitetura Cloud', manager: 'Fernanda Lima', environment: 'Produção', criticality: 'Crítica', status: 'Aprovado',
    createdAt: '2024-01-12T11:00:00', updatedAt: '2024-01-14T16:00:00', sla: '5 dias úteis',
    description: 'Conta AWS dedicada para o novo sistema de pagamentos com isolamento completo.', justification: 'Requisito regulatório PCI-DSS exige isolamento de workloads de pagamento.',
    project: 'Payment Gateway v3', costCenter: 'CC-1001', system: 'Payment Gateway',
  },
  {
    id: 'AWS-REQ-84725', title: 'Associação de PSET SecurityAudit a contas produtivas', categoryId: 'aws-psets', categoryName: 'PSET AWS', requestTypeId: 'pset-update', requestTypeName: 'Alteração de PSET', type: 'standard',
    requester: 'Patrícia Gomes', requesterEmail: 'patricia.gomes@corp.com', team: 'GRC', manager: 'Fernanda Lima', environment: 'Produção', criticality: 'Média', status: 'Concluído',
    createdAt: '2024-01-11T08:00:00', updatedAt: '2024-01-12T10:00:00', sla: '48 horas úteis',
    description: 'Vincular PSET SecurityAudit a 3 contas produtivas para time de compliance.', justification: 'Time de GRC precisa acesso de auditoria padronizado.',
    project: 'SOX Compliance 2024', costCenter: 'CC-6001', system: 'AWS IAM Identity Center',
  },
  {
    id: 'AWS-REQ-84726', title: 'Role cross-account para pipeline CI/CD', categoryId: 'aws-roles', categoryName: 'Role AWS', requestTypeId: 'role-update', requestTypeName: 'Alteração de role', type: 'standard',
    requester: 'Felipe Torres', requesterEmail: 'felipe.torres@corp.com', team: 'DevOps', manager: 'Carlos Silva', environment: 'Homologação', criticality: 'Média', status: 'Em Preenchimento',
    createdAt: '2024-01-15T13:00:00', updatedAt: '2024-01-15T13:00:00', sla: '48 horas úteis',
    description: 'Role cross-account para pipeline CI/CD acessar conta de homologação a partir da conta de shared-services.', justification: 'Automação de deploy entre contas via CodePipeline.',
    project: 'Platform Engineering', costCenter: 'CC-3001', system: 'AWS CodePipeline', accountId: '567890123456', accountName: 'prd-shared-services',
  },
  {
    id: 'AWS-REQ-84727', title: 'Ajuste de perfil corporativo — inclusão de conta de dados', categoryId: 'aws-profiles', categoryName: 'Acessos Corporativos (AD + Identity Center)', requestTypeId: 'profile-update', requestTypeName: 'Alteração de perfil corporativo', type: 'standard',
    requester: 'Diego Martins', requesterEmail: 'diego.martins@corp.com', team: 'Engenharia de Dados', manager: 'Juliana Costa', environment: 'Produção', criticality: 'Alta', status: 'Rejeitado',
    createdAt: '2024-01-09T11:30:00', updatedAt: '2024-01-10T16:45:00', sla: '72 horas úteis',
    description: 'Adicionar conta prd-data-lake ao perfil corporativo de engenharia de dados.', justification: 'Equipe precisa acessar novo data lake para conformidade LGPD.',
    project: 'Data Privacy', costCenter: 'CC-6001', system: 'AWS Identity Center',
  },
  {
    id: 'AWS-REQ-84728', title: 'Role para serviço ECS — processamento de eventos', categoryId: 'aws-roles', categoryName: 'Role AWS', requestTypeId: 'role-create', requestTypeName: 'Criação de role', type: 'standard',
    requester: 'Lucas Ferreira', requesterEmail: 'lucas.ferreira@corp.com', team: 'Desenvolvimento', manager: 'Ana Souza', environment: 'Desenvolvimento', criticality: 'Média', status: 'Concluído',
    createdAt: '2024-01-10T10:00:00', updatedAt: '2024-01-11T15:00:00', sla: '48 horas úteis',
    description: 'Role para task ECS que processa eventos do SQS e grava no DynamoDB.', justification: 'Serviço de processamento de eventos precisa de permissões para SQS e DynamoDB.',
    project: 'Event Processing', costCenter: 'CC-4001', system: 'ECS / SQS / DynamoDB',
  },
  {
    id: 'AWS-REQ-84729', title: 'Criação de SCP para bloquear desativação de trilhas de auditoria', categoryId: 'aws-policies', categoryName: 'Policy AWS', requestTypeId: 'policy-create', requestTypeName: 'Criação de policy', type: 'standard',
    requester: 'Roberto Nascimento', requesterEmail: 'roberto.nascimento@corp.com', team: 'SecOps', manager: 'Fernanda Lima', environment: 'Produção', criticality: 'Alta', status: 'Aguardando Aprovação',
    createdAt: '2024-01-18T10:20:00', updatedAt: '2024-01-18T12:40:00', sla: '48 horas úteis',
    description: 'Aplicar SCP na OU de produção para bloquear Disable/Delete em CloudTrail e AWS Config, com exceção para conta de segurança.',
    justification: 'Redução de risco de apagamento de trilhas de auditoria e atendimento de controles de conformidade.',
    project: 'Cloud Security Hardening', costCenter: 'CC-6001', system: 'AWS Organizations', accountId: '567890123456', accountName: 'prd-shared-services',
  },
  {
    id: 'AWS-REQ-84730', title: 'Criação de usuário IAM para integração legada', categoryId: 'aws-iam-users', categoryName: 'Usuários IAM AWS', requestTypeId: 'iam-user-create', requestTypeName: 'Criação de usuário IAM', type: 'standard',
    requester: 'Felipe Torres', requesterEmail: 'felipe.torres@corp.com', team: 'DevOps', manager: 'Carlos Silva', environment: 'Homologação', criticality: 'Alta', status: 'Aguardando Aprovação',
    createdAt: '2024-01-18T09:10:00', updatedAt: '2024-01-18T10:00:00', sla: '24 horas úteis',
    description: 'Criar usuário IAM local para integração temporária com ferramenta legada sem suporte a Identity Center.',
    justification: 'Necessidade técnica transitória com trilha de auditoria e rotação obrigatória de credenciais.',
    project: 'Legacy Integration', costCenter: 'CC-3001', system: 'Ferramenta Legada', accountId: '345678901234', accountName: 'hml-payment-gateway',
  },
  {
    id: 'AWS-REQ-84731', title: 'Alteração de políticas em grupo IAM de suporte', categoryId: 'aws-iam-groups', categoryName: 'Grupos IAM AWS', requestTypeId: 'iam-group-update', requestTypeName: 'Alteração de grupo IAM', type: 'standard',
    requester: 'Patrícia Gomes', requesterEmail: 'patricia.gomes@corp.com', team: 'GRC', manager: 'Fernanda Lima', environment: 'Produção', criticality: 'Média', status: 'Em Execução',
    createdAt: '2024-01-17T11:30:00', updatedAt: '2024-01-18T15:00:00', sla: '24 horas úteis',
    description: 'Ajustar policies anexadas ao grupo IAM de suporte para remover permissões excessivas e reforçar menor privilégio.',
    justification: 'Resultado de revisão de conformidade IAM do trimestre.',
    project: 'IAM Governance', costCenter: 'CC-6001', system: 'AWS IAM', accountId: '123456789012', accountName: 'prd-payment-gateway',
  },
  {
    id: 'AWS-REQ-84732', title: 'Levantamento de permissões IAM e último uso em contas produtivas', categoryId: 'aws-information', categoryName: 'Levantamento de Informações AWS', requestTypeId: 'info-create', requestTypeName: 'Levantamento de informações AWS', type: 'standard',
    requester: 'Marina Alves', requesterEmail: 'marina.alves@corp.com', team: 'Cloud Governance', manager: 'Fernanda Lima', environment: 'Produção', criticality: 'Alta', status: 'Aguardando Aprovação',
    createdAt: '2024-01-19T09:00:00', updatedAt: '2024-01-19T11:30:00', sla: '24 horas úteis',
    description: 'Solicitação de inventário de usuários IAM, roles e policies com foco em último uso e permissões efetivas.',
    justification: 'Necessidade de revisão de acessos privilegiados para atendimento a requisitos de auditoria e compliance.',
    project: 'Access Review 2024', costCenter: 'CC-6001', system: 'AWS IAM / CloudTrail', accountId: '123456789012', accountName: 'prd-payment-gateway',
  },

  // AUDIT
  {
    id: 'AWS-AUD-90001', title: 'Levantamento de recursos em conta prd-payment-gateway', categoryId: 'aws-audit', categoryName: 'Auditoria AWS', requestTypeId: 'audit-create', requestTypeName: 'Abertura de auditoria', type: 'audit',
    requester: 'Roberto Nascimento', requesterEmail: 'roberto.nascimento@corp.com', team: 'SecOps', manager: 'Fernanda Lima', environment: 'Produção', criticality: 'Média', status: 'Em Execução',
    createdAt: '2024-01-16T08:00:00', updatedAt: '2024-01-17T10:00:00', sla: '5 dias úteis',
    description: 'Inventário completo de recursos ativos na conta 123456789012 incluindo EC2, S3, RDS, Lambda, IAM Roles, KMS e Security Groups.',
    justification: 'Auditoria trimestral de conformidade exigida por PCI-DSS.', project: 'Audit Q1-2024', costCenter: 'CC-6001', system: 'AWS Config / CloudTrail', accountId: '123456789012', accountName: 'prd-payment-gateway',
  },
  {
    id: 'AWS-AUD-90002', title: 'Auditoria de permissões administrativas em contas produtivas', categoryId: 'aws-audit', categoryName: 'Auditoria AWS', requestTypeId: 'audit-update', requestTypeName: 'Alteração de auditoria', type: 'audit',
    requester: 'Patrícia Gomes', requesterEmail: 'patricia.gomes@corp.com', team: 'GRC', manager: 'Fernanda Lima', environment: 'Produção', criticality: 'Alta', status: 'Aguardando Aprovação',
    createdAt: '2024-01-17T09:00:00', updatedAt: '2024-01-17T14:00:00', sla: '7 dias úteis',
    description: 'Revisão de identidades com AdministratorAccess, roles com trust amplo e PSETs com permissões elevadas.',
    justification: 'Revisão semestral de acessos privilegiados conforme política de governança.', project: 'Access Review H1-2024', costCenter: 'CC-6001', system: 'AWS IAM / Identity Center',
  },
  {
    id: 'AWS-AUD-90003', title: 'Auditoria de perfis corporativos e PSETs', categoryId: 'aws-audit', categoryName: 'Auditoria AWS', requestTypeId: 'audit-close', requestTypeName: 'Encerramento de auditoria', type: 'audit',
    requester: 'Marcos Ribeiro', requesterEmail: 'marcos.ribeiro@corp.com', team: 'IAM', manager: 'Roberto Nascimento', environment: 'Produção', criticality: 'Alta', status: 'Concluído',
    createdAt: '2024-01-10T14:00:00', updatedAt: '2024-01-16T16:00:00', sla: '7 dias úteis',
    description: 'Revisão completa de perfis corporativos, grupos AD e PSETs vinculados com foco em aderência ao menor privilégio.',
    justification: 'Auditoria anual de governança de acessos exigida por compliance.', project: 'IAM Governance Review', costCenter: 'CC-6001', system: 'AWS Identity Center',
  },

  // BREAKING GLASS
  {
    id: 'AWS-BG-95001', title: 'Acesso emergencial admin — incidente em pipeline de pagamentos', categoryId: 'aws-emergency', categoryName: 'Breaking Glass AWS', requestTypeId: 'bg-create', requestTypeName: 'Concessão de acesso emergencial', type: 'breaking-glass',
    requester: 'Ana Souza', requesterEmail: 'ana.souza@corp.com', team: 'Engenharia de Dados', manager: 'Carlos Silva', environment: 'Produção', criticality: 'Crítica', status: 'Concluído',
    createdAt: '2024-01-14T02:15:00', updatedAt: '2024-01-14T06:30:00', sla: '1 hora',
    description: 'Acesso administrativo emergencial para resolver incidente crítico que paralisou processamento de transações.',
    justification: 'Incidente P1 — Falha no pipeline de pagamentos. Transações paradas desde 02:00.',
    project: 'Payment Gateway v3', costCenter: 'CC-1001', system: 'Payment Gateway', accountId: '123456789012', accountName: 'prd-payment-gateway',
    incidentId: 'INC-2024-0142', breakingGlassDuration: '2 horas', postReviewStatus: 'Concluída',
  },
  {
    id: 'AWS-BG-95002', title: 'Elevação temporária para ajuste em política KMS', categoryId: 'aws-emergency', categoryName: 'Breaking Glass AWS', requestTypeId: 'bg-update', requestTypeName: 'Alteração de acesso emergencial', type: 'breaking-glass',
    requester: 'Diego Martins', requesterEmail: 'diego.martins@corp.com', team: 'Segurança', manager: 'Juliana Costa', environment: 'Produção', criticality: 'Crítica', status: 'Concluído',
    createdAt: '2024-01-12T22:00:00', updatedAt: '2024-01-13T01:00:00', sla: '1 hora',
    description: 'Elevação temporária para corrigir política KMS que bloqueou criptografia de dados em bucket S3 crítico.',
    justification: 'Incidente P2 — Deny explícito em KMS bloqueou escrita em bucket de dados financeiros.',
    project: 'Data Privacy', costCenter: 'CC-6001', system: 'AWS KMS', accountId: '234567890123', accountName: 'prd-data-lake',
    incidentId: 'INC-2024-0135', breakingGlassDuration: '1 hora', postReviewStatus: 'Concluída',
  },
  {
    id: 'AWS-BG-95003', title: 'Revogação de acesso emergencial — encerramento de incidente', categoryId: 'aws-emergency', categoryName: 'Breaking Glass AWS', requestTypeId: 'bg-revoke', requestTypeName: 'Revogação de acesso emergencial', type: 'breaking-glass',
    requester: 'Roberto Nascimento', requesterEmail: 'roberto.nascimento@corp.com', team: 'SecOps', manager: 'Fernanda Lima', environment: 'Produção', criticality: 'Alta', status: 'Aguardando Aprovação',
    createdAt: '2024-01-19T03:45:00', updatedAt: '2024-01-19T04:00:00', sla: '30 minutos',
    description: 'Revogar acesso emergencial previamente concedido após contenção do incidente e coleta de evidências.',
    justification: 'Incidente contido. Acesso emergencial deve ser encerrado para restabelecer baseline de privilégios.',
    project: 'Security Operations', costCenter: 'CC-6001', system: 'CloudTrail / CloudWatch', accountId: '678901234567', accountName: 'prd-security-logging',
    incidentId: 'INC-2024-0201', breakingGlassDuration: '4 horas', postReviewStatus: 'Pendente',
  },
];

// ============ AWS ACCOUNTS ============
export const awsAccounts = [
  { id: '123456789012', name: 'prd-payment-gateway', env: 'Produção' as Environment },
  { id: '234567890123', name: 'prd-data-lake', env: 'Produção' as Environment },
  { id: '345678901234', name: 'hml-payment-gateway', env: 'Homologação' as Environment },
  { id: '901234567890', name: 'dev-payment-gateway', env: 'Desenvolvimento' as Environment },
  { id: '456789012345', name: 'dev-sandbox-eng', env: 'Desenvolvimento' as Environment },
  { id: '567890123456', name: 'prd-shared-services', env: 'Produção' as Environment },
  { id: '678901234567', name: 'prd-security-logging', env: 'Produção' as Environment },
  { id: '789012345678', name: 'hml-data-analytics', env: 'Homologação' as Environment },
  { id: '890123456789', name: 'dev-ml-experiments', env: 'Desenvolvimento' as Environment },
];

export const adGroups = [
  'GRP-AWS-SRE-ReadOnly',
  'GRP-AWS-DevOps-PowerUser',
  'GRP-AWS-DataEng-Admin',
  'GRP-AWS-Security-Audit',
  'GRP-AWS-FinOps-Reader',
  'GRP-AWS-Platform-Admin',
  'GRP-AWS-Compliance-Viewer',
];

export const psets = [
  'PSET-ReadOnly-Global',
  'PSET-PowerUser-Dev',
  'PSET-Admin-Restricted',
  'PSET-SecurityAudit',
  'PSET-DataEngineer',
  'PSET-NetworkAdmin',
  'PSET-BillingViewer',
];

export const iamUsers = [
  'svc-legacy-integration',
  'svc-backup-automation',
  'ops-support-user',
];

export const iamGroups = [
  'IAM-Backup-Operators',
  'IAM-Support-ReadOnly',
  'IAM-Legacy-Integration',
  'IAM-FinOps-Readers',
];

export const approvers = [
  { name: 'Carlos Silva', role: 'Gestor', team: 'Engenharia' },
  { name: 'Juliana Costa', role: 'Gestor', team: 'SRE' },
  { name: 'Fernanda Lima', role: 'Diretora', team: 'Tecnologia' },
  { name: 'Roberto Nascimento', role: 'Segurança Cloud', team: 'SecOps' },
  { name: 'Marcos Ribeiro', role: 'IAM Admin', team: 'IAM' },
  { name: 'Patrícia Gomes', role: 'Compliance', team: 'GRC' },
  { name: 'Ricardo Almeida', role: 'Arquiteto Cloud', team: 'Arquitetura' },
  { name: 'Eduardo Santos', role: 'Cloud Audit Specialist', team: 'Auditoria' },
  { name: 'Lúcia Mendes', role: 'Identity Governance', team: 'IAM Governance' },
  { name: 'André Costa', role: 'Incident Response', team: 'CSIRT' },
];

