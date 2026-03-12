// ============ PROVIDERS ============
export type Provider = 'aws' | 'azure' | 'oci';

export const providers = [
  {
    id: 'aws' as Provider,
    name: 'Amazon Web Services',
    shortName: 'AWS',
    description: 'Solicitações de acesso, recursos, roles, permission sets e provisionamento para ambientes AWS.',
    categoriesCount: 16,
    color: 'aws',
    examples: ['Criação de Role para Lambda', 'PSET ReadOnly para Observabilidade', 'Auditoria de permissões IAM'],
  },
  {
    id: 'azure' as Provider,
    name: 'Microsoft Azure',
    shortName: 'Azure',
    description: 'Solicitações de RBAC, subscriptions, resource groups, service principals e identidades gerenciadas.',
    categoriesCount: 14,
    color: 'azure',
    examples: ['Role Assignment Reader', 'Auditoria de RBAC', 'Acesso emergencial a subscription'],
  },
  {
    id: 'oci' as Provider,
    name: 'Oracle Cloud Infrastructure',
    shortName: 'OCI',
    description: 'Solicitações de policies, groups, dynamic groups, compartments e gerenciamento de acessos OCI.',
    categoriesCount: 13,
    color: 'oci',
    examples: ['Policy para compartment financeiro', 'Auditoria de policies OCI', 'Breaking Glass compartment'],
  },
];

// ============ CATEGORIES ============
export type CategoryType = 'standard' | 'audit' | 'breaking-glass';

export interface Category {
  id: string;
  provider: Provider;
  name: string;
  description: string;
  criticality: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  fieldsCount: number;
  validationsCount: number;
  approvalsCount: number;
  icon: string;
  sla: string;
  prerequisites: string[];
  documents: string[];
  validations: string[];
  approvals: string[];
  whenToUse: string;
  relatedExamples: string[];
  type: CategoryType;
}

export const categories: Category[] = [
  // ============ AWS STANDARD ============
  { id: 'aws-iam', provider: 'aws', name: 'IAM e Acessos', description: 'Gestão de identidades, usuários, grupos e políticas de acesso IAM.', criticality: 'Alta', fieldsCount: 18, validationsCount: 8, approvalsCount: 3, icon: 'Shield', sla: '24 horas úteis', prerequisites: ['Conta AWS ativa', 'Gestor definido'], documents: ['Justificativa de negócio', 'Matriz de responsabilidade'], validations: ['Princípio do menor privilégio', 'Segregação de funções', 'MFA obrigatório para admin'], approvals: ['Gestor direto', 'Segurança Cloud', 'Compliance (produção)'], whenToUse: 'Quando precisar gerenciar identidades, criar usuários técnicos ou ajustar políticas IAM.', relatedExamples: ['Criação de usuário técnico para pipeline', 'Ajuste de policy IAM para serviço'], type: 'standard' },
  { id: 'aws-account', provider: 'aws', name: 'Criação de Conta', description: 'Provisionamento de nova conta AWS dentro da organização corporativa.', criticality: 'Crítica', fieldsCount: 22, validationsCount: 12, approvalsCount: 4, icon: 'Building2', sla: '5 dias úteis', prerequisites: ['Aprovação executiva', 'Centro de custo definido', 'Owner técnico designado'], documents: ['Business case', 'Classificação de dados', 'Plano de compliance'], validations: ['Email único', 'Nome padronizado', 'Owner definido', 'Baseline obrigatória'], approvals: ['Gestor', 'Arquiteto Cloud', 'Segurança', 'Governança'], whenToUse: 'Quando um novo projeto, sistema ou ambiente precisar de isolamento em uma conta AWS dedicada.', relatedExamples: ['Conta de produção para sistema de pagamentos', 'Conta sandbox para equipe de dados'], type: 'standard' },
  { id: 'aws-pset', provider: 'aws', name: 'PSET / Permission Set', description: 'Criação ou alteração de Permission Sets no AWS IAM Identity Center.', criticality: 'Alta', fieldsCount: 16, validationsCount: 7, approvalsCount: 3, icon: 'KeyRound', sla: '48 horas úteis', prerequisites: ['Identity Center configurado', 'Grupo AD identificado'], documents: ['Justificativa', 'Lista de policies'], validations: ['Ao menos uma policy', 'Permission boundary em produção', 'Grupo AD obrigatório'], approvals: ['Gestor', 'Segurança Cloud', 'IAM Admin'], whenToUse: 'Para criar perfis de permissão padronizados que serão atribuídos via Identity Center.', relatedExamples: ['PSET ReadOnly para time de observabilidade', 'PSET PowerUser para DevOps'], type: 'standard' },
  { id: 'aws-profile', provider: 'aws', name: 'Perfis de Acesso', description: 'Criação de perfil corporativo integrando AD, AWS Identity Center, PSET e contas alvo.', criticality: 'Alta', fieldsCount: 24, validationsCount: 10, approvalsCount: 3, icon: 'Users', sla: '72 horas úteis', prerequisites: ['PSET existente ou em criação', 'Grupo AD definido', 'Conta(s) AWS definidas'], documents: ['Justificativa de negócio', 'Matriz de acesso'], validations: ['Grupo AD obrigatório', 'PSET obrigatório', 'Ao menos uma conta AWS', 'Produção exige aprovação extra'], approvals: ['Gestor', 'Segurança Cloud', 'IAM Admin'], whenToUse: 'Quando precisar criar um perfil completo de acesso que envolve grupo AD, PSET e contas AWS.', relatedExamples: ['Perfil corporativo para equipe de SRE', 'Perfil de leitura para auditoria'], type: 'standard' },
  { id: 'aws-role', provider: 'aws', name: 'Roles', description: 'Criação de IAM Roles para serviços, cross-account ou federação.', criticality: 'Alta', fieldsCount: 20, validationsCount: 9, approvalsCount: 3, icon: 'ShieldCheck', sla: '48 horas úteis', prerequisites: ['Conta AWS ativa', 'Trusted entity definida'], documents: ['Justificativa de menor privilégio', 'JSON de policy customizada (se aplicável)'], validations: ['Nome obrigatório', 'Account ID obrigatório', 'Trusted entity obrigatória', 'Permission boundary em produção', 'Cross-account exige origem e destino', 'JSON válido para policy customizada'], approvals: ['Gestor', 'Segurança Cloud', 'IAM Admin'], whenToUse: 'Quando um serviço, aplicação ou entidade precisar assumir permissões específicas via IAM Role.', relatedExamples: ['Role para Lambda de integração com S3', 'Role cross-account para pipeline de CI/CD'], type: 'standard' },
  { id: 'aws-policy', provider: 'aws', name: 'Policies', description: 'Criação ou ajuste de IAM Policies customizadas.', criticality: 'Alta', fieldsCount: 14, validationsCount: 6, approvalsCount: 2, icon: 'FileText', sla: '48 horas úteis', prerequisites: ['Conta AWS ativa'], documents: ['JSON da policy', 'Justificativa'], validations: ['JSON válido', 'Menor privilégio', 'Sem wildcards em produção'], approvals: ['Gestor', 'Segurança Cloud'], whenToUse: 'Quando precisar criar uma política de permissão customizada para cenários não cobertos por policies gerenciadas.', relatedExamples: ['Policy customizada para acesso a bucket específico', 'Policy para DynamoDB com condições'], type: 'standard' },
  { id: 'aws-cross', provider: 'aws', name: 'Cross-Account Access', description: 'Configuração de acessos entre contas AWS da organização.', criticality: 'Crítica', fieldsCount: 16, validationsCount: 8, approvalsCount: 3, icon: 'ArrowLeftRight', sla: '72 horas úteis', prerequisites: ['Ambas contas ativas', 'Roles existentes ou em criação'], documents: ['Diagrama de acesso', 'Justificativa'], validations: ['Conta origem obrigatória', 'Conta destino obrigatória', 'Menor privilégio'], approvals: ['Gestor', 'Segurança Cloud', 'Arquiteto Cloud'], whenToUse: 'Quando um serviço em uma conta AWS precisar acessar recursos em outra conta da organização.', relatedExamples: ['Acesso cross-account para centralized logging', 'Pipeline CI/CD acessando conta de produção'], type: 'standard' },
  { id: 'aws-s3', provider: 'aws', name: 'Storage / S3 Access', description: 'Permissões de acesso a buckets S3 e políticas de storage.', criticality: 'Média', fieldsCount: 12, validationsCount: 5, approvalsCount: 2, icon: 'HardDrive', sla: '24 horas úteis', prerequisites: ['Bucket existente', 'Conta AWS ativa'], documents: ['Justificativa de acesso'], validations: ['Bucket name obrigatório', 'Tipo de acesso definido', 'Criptografia verificada'], approvals: ['Gestor', 'Segurança Cloud'], whenToUse: 'Quando precisar liberar acesso de leitura ou escrita a buckets S3 específicos.', relatedExamples: ['Acesso de leitura a bucket de logs', 'Acesso de escrita para data lake'], type: 'standard' },
  { id: 'aws-kms', provider: 'aws', name: 'KMS / Criptografia', description: 'Gerenciamento de chaves KMS e políticas de criptografia.', criticality: 'Crítica', fieldsCount: 14, validationsCount: 7, approvalsCount: 3, icon: 'Lock', sla: '48 horas úteis', prerequisites: ['Conta AWS ativa', 'Classificação de dados definida'], documents: ['Justificativa', 'Política de criptografia'], validations: ['Key alias obrigatório', 'Rotation policy', 'Acesso restrito'], approvals: ['Gestor', 'Segurança Cloud', 'Compliance'], whenToUse: 'Quando precisar criar ou gerenciar chaves de criptografia para proteger dados sensíveis.', relatedExamples: ['Chave KMS para RDS de produção', 'Chave para criptografia de bucket S3'], type: 'standard' },
  { id: 'aws-sg', provider: 'aws', name: 'Rede / Security Group', description: 'Criação ou alteração de Security Groups e regras de firewall.', criticality: 'Alta', fieldsCount: 15, validationsCount: 8, approvalsCount: 2, icon: 'Network', sla: '24 horas úteis', prerequisites: ['VPC existente', 'Conta AWS ativa'], documents: ['Diagrama de rede', 'Justificativa'], validations: ['Sem 0.0.0.0/0 em produção', 'Portas mínimas', 'Protocolo definido'], approvals: ['Gestor', 'Segurança de Rede'], whenToUse: 'Quando precisar abrir ou ajustar regras de firewall em um Security Group.', relatedExamples: ['Liberar porta 443 para ALB', 'Security Group para cluster EKS'], type: 'standard' },

  // ============ AWS AUDIT ============
  { id: 'aws-audit-resources', provider: 'aws', name: 'Levantamento de Recursos', description: 'Inventário de recursos ativos em contas AWS para análise de conformidade.', criticality: 'Média', fieldsCount: 16, validationsCount: 6, approvalsCount: 2, icon: 'ClipboardList', sla: '5 dias úteis', prerequisites: ['Conta AWS ativa', 'Escopo definido'], documents: ['Justificativa da auditoria', 'Escopo desejado'], validations: ['Ao menos um escopo obrigatório', 'Justificativa obrigatória', 'Conta AWS obrigatória', 'Ambiente obrigatório'], approvals: ['Gestor', 'Cloud Audit Specialist'], whenToUse: 'Quando precisar identificar EC2, S3, RDS, Lambda, IAM Roles, KMS e Security Groups ativos em uma conta.', relatedExamples: ['Inventário de recursos em conta produtiva', 'Levantamento de recursos sem tag'], type: 'audit' },
  { id: 'aws-audit-permissions', provider: 'aws', name: 'Auditoria de Permissões', description: 'Revisão de permissões de usuários, grupos, PSETs e roles IAM.', criticality: 'Alta', fieldsCount: 20, validationsCount: 8, approvalsCount: 3, icon: 'UserCheck', sla: '7 dias úteis', prerequisites: ['Contas AWS alvo definidas', 'Escopo de identidades definido'], documents: ['Escopo da auditoria', 'Lista de contas/usuários alvo'], validations: ['Escopo obrigatório', 'Conta AWS obrigatória', 'Alvo definido para auditoria de permissões', 'Privilégios elevados exigem aprovação extra'], approvals: ['Gestor', 'Identity Governance Specialist', 'Segurança Cloud'], whenToUse: 'Para revisar grupos AD, PSETs, roles e acessos administrativos em contas AWS.', relatedExamples: ['Auditoria de PSETs em contas produtivas', 'Revisão de permissões administrativas'], type: 'audit' },
  { id: 'aws-audit-privileged', provider: 'aws', name: 'Auditoria de Acessos Privilegiados', description: 'Revisão de contas e roles com privilégios elevados ou administrativos.', criticality: 'Crítica', fieldsCount: 18, validationsCount: 9, approvalsCount: 3, icon: 'ShieldAlert', sla: '5 dias úteis', prerequisites: ['Conta AWS ativa', 'Aprovação de segurança'], documents: ['Justificativa', 'Escopo de análise'], validations: ['Justificativa obrigatória', 'Conta obrigatória', 'Dados sensíveis exigem classificação', 'Escopo amplo requer aprovação extra'], approvals: ['Gestor', 'Identity Governance Specialist', 'CISO'], whenToUse: 'Quando precisar identificar e revisar acessos com permissões administrativas ou elevadas.', relatedExamples: ['Revisão de roles com AdministratorAccess', 'Auditoria de acessos root'], type: 'audit' },

  // ============ AWS BREAKING GLASS ============
  { id: 'aws-bg-admin', provider: 'aws', name: 'Acesso Emergencial Admin', description: 'Solicitação de acesso administrativo emergencial e temporário em conta AWS.', criticality: 'Crítica', fieldsCount: 22, validationsCount: 12, approvalsCount: 4, icon: 'AlertOctagon', sla: '1 hora', prerequisites: ['Incidente registrado', 'Justificativa emergencial', 'Aprovação de segurança'], documents: ['Evidência do incidente', 'Plano de ação', 'Justificativa emergencial'], validations: ['Justificativa obrigatória', 'Incidente obrigatório', 'Conta AWS obrigatória', 'Identidade alvo obrigatória', 'Duração máxima obrigatória', 'Acesso admin exige dupla aprovação', 'Produção exige aprovação reforçada', 'Revisão pós-uso obrigatória', 'Sem prazo de expiração = bloqueado'], approvals: ['Gestor', 'Segurança Cloud', 'Incident Response Specialist', 'CISO'], whenToUse: 'Em caso de incidente crítico que exija atuação administrativa imediata em conta AWS.', relatedExamples: ['Acesso emergencial para troubleshooting em conta de produção', 'Ativação de role emergencial para KMS'], type: 'breaking-glass' },
  { id: 'aws-bg-readonly', provider: 'aws', name: 'Acesso Emergencial Leitura', description: 'Solicitação de acesso emergencial de leitura para investigação de incidentes.', criticality: 'Alta', fieldsCount: 18, validationsCount: 8, approvalsCount: 3, icon: 'Eye', sla: '30 minutos', prerequisites: ['Incidente ou suspeita registrada', 'Justificativa'], documents: ['Evidência do incidente'], validations: ['Justificativa obrigatória', 'Incidente obrigatório', 'Conta AWS obrigatória', 'Duração máxima obrigatória', 'Revisão pós-uso obrigatória'], approvals: ['Gestor', 'Segurança Cloud', 'Incident Response Specialist'], whenToUse: 'Para investigação emergencial com acesso somente leitura em conta AWS.', relatedExamples: ['Leitura emergencial de logs CloudTrail', 'Análise de incidente de segurança'], type: 'breaking-glass' },
  { id: 'aws-bg-privilege', provider: 'aws', name: 'Elevação Temporária de Privilégio', description: 'Concessão temporária de privilégio elevado para resolução de incidentes.', criticality: 'Crítica', fieldsCount: 20, validationsCount: 10, approvalsCount: 4, icon: 'ArrowUpCircle', sla: '1 hora', prerequisites: ['Incidente ativo', 'Aprovação emergencial'], documents: ['Justificativa', 'Plano de rollback'], validations: ['Justificativa obrigatória', 'Incidente obrigatório', 'Duração máxima obrigatória', 'Revogação automática obrigatória', 'Aprovação de segurança obrigatória', 'Revisão posterior obrigatória'], approvals: ['Gestor', 'Segurança Cloud', 'Incident Response Specialist', 'CISO'], whenToUse: 'Quando um operador precisar temporariamente de privilégios elevados para resolver um incidente.', relatedExamples: ['Elevação para ajuste em política KMS', 'Privilégio para rollback em ECS'], type: 'breaking-glass' },

  // ============ AZURE STANDARD ============
  { id: 'azure-rbac', provider: 'azure', name: 'IAM / RBAC', description: 'Gestão de Role-Based Access Control no Azure.', criticality: 'Alta', fieldsCount: 14, validationsCount: 6, approvalsCount: 2, icon: 'Shield', sla: '24 horas úteis', prerequisites: ['Subscription ativa', 'Escopo definido'], documents: ['Justificativa'], validations: ['Role definition válida', 'Escopo correto', 'Menor privilégio'], approvals: ['Gestor', 'Segurança Cloud'], whenToUse: 'Quando precisar atribuir roles RBAC a usuários ou serviços no Azure.', relatedExamples: ['Atribuição de Reader em subscription de analytics'], type: 'standard' },
  { id: 'azure-sub', provider: 'azure', name: 'Acesso a Subscription', description: 'Solicitação de acesso a subscriptions Azure corporativas.', criticality: 'Alta', fieldsCount: 12, validationsCount: 5, approvalsCount: 2, icon: 'CreditCard', sla: '48 horas úteis', prerequisites: ['Subscription existente', 'Justificativa aprovada'], documents: ['Justificativa de negócio'], validations: ['Subscription ID válido', 'Role adequada'], approvals: ['Gestor', 'Owner da Subscription'], whenToUse: 'Quando precisar de acesso a uma subscription Azure para gerenciar recursos.', relatedExamples: ['Acesso Contributor a subscription de desenvolvimento'], type: 'standard' },
  { id: 'azure-rg', provider: 'azure', name: 'Acesso a Resource Group', description: 'Permissões de acesso a Resource Groups específicos.', criticality: 'Média', fieldsCount: 11, validationsCount: 4, approvalsCount: 2, icon: 'FolderOpen', sla: '24 horas úteis', prerequisites: ['Resource Group existente'], documents: ['Justificativa'], validations: ['RG name válido', 'Role adequada'], approvals: ['Gestor', 'Owner do RG'], whenToUse: 'Quando precisar de acesso restrito a um Resource Group específico.', relatedExamples: ['Acesso Reader ao RG de analytics', 'Contributor no RG de staging'], type: 'standard' },
  { id: 'azure-role', provider: 'azure', name: 'Role Assignment', description: 'Atribuição de roles customizadas ou built-in no Azure.', criticality: 'Alta', fieldsCount: 13, validationsCount: 6, approvalsCount: 2, icon: 'ShieldCheck', sla: '48 horas úteis', prerequisites: ['Escopo definido', 'Role existente'], documents: ['Justificativa'], validations: ['Principal type definido', 'Escopo correto', 'Role válida'], approvals: ['Gestor', 'Segurança Cloud'], whenToUse: 'Quando precisar atribuir uma role Azure a um principal (user, group, service principal).', relatedExamples: ['Atribuir Custom Role para time de DevOps'], type: 'standard' },
  { id: 'azure-sp', provider: 'azure', name: 'Service Principal', description: 'Criação de Service Principals para automação e CI/CD.', criticality: 'Alta', fieldsCount: 15, validationsCount: 7, approvalsCount: 3, icon: 'Bot', sla: '48 horas úteis', prerequisites: ['Tenant acessível', 'Justificativa técnica'], documents: ['Diagrama de integração', 'Justificativa'], validations: ['Nome único', 'Escopo mínimo', 'Expiração de credenciais'], approvals: ['Gestor', 'Segurança Cloud', 'IAM Admin'], whenToUse: 'Quando uma aplicação ou pipeline CI/CD precisar de identidade para acessar recursos Azure.', relatedExamples: ['Service Principal para GitHub Actions', 'SP para Terraform'], type: 'standard' },
  { id: 'azure-mi', provider: 'azure', name: 'Managed Identity', description: 'Configuração de Managed Identities para recursos Azure.', criticality: 'Média', fieldsCount: 10, validationsCount: 4, approvalsCount: 2, icon: 'Fingerprint', sla: '24 horas úteis', prerequisites: ['Recurso Azure existente'], documents: ['Justificativa'], validations: ['Tipo de MI (system/user)', 'Escopo correto'], approvals: ['Gestor', 'Segurança Cloud'], whenToUse: 'Quando um recurso Azure precisar acessar outros recursos sem credenciais explícitas.', relatedExamples: ['Managed Identity para App Service acessar Key Vault'], type: 'standard' },
  { id: 'azure-kv', provider: 'azure', name: 'Key Vault Access', description: 'Permissões de acesso a Azure Key Vaults.', criticality: 'Crítica', fieldsCount: 13, validationsCount: 6, approvalsCount: 3, icon: 'Lock', sla: '48 horas úteis', prerequisites: ['Key Vault existente', 'Classificação de dados'], documents: ['Justificativa', 'Política de acesso'], validations: ['Vault name válido', 'Permissões mínimas', 'Acesso restrito'], approvals: ['Gestor', 'Segurança Cloud', 'Compliance'], whenToUse: 'Quando precisar acessar segredos, chaves ou certificados em um Azure Key Vault.', relatedExamples: ['Acesso Get/List a secrets para aplicação web'], type: 'standard' },
  { id: 'azure-nsg', provider: 'azure', name: 'Rede / NSG', description: 'Criação ou alteração de Network Security Groups.', criticality: 'Alta', fieldsCount: 14, validationsCount: 7, approvalsCount: 2, icon: 'Network', sla: '24 horas úteis', prerequisites: ['VNet existente'], documents: ['Diagrama de rede'], validations: ['Sem regras permissivas', 'Portas mínimas'], approvals: ['Gestor', 'Segurança de Rede'], whenToUse: 'Quando precisar configurar regras de firewall em NSGs do Azure.', relatedExamples: ['Liberar porta 443 para Application Gateway'], type: 'standard' },

  // ============ AZURE AUDIT ============
  { id: 'azure-audit-rbac', provider: 'azure', name: 'Auditoria de RBAC', description: 'Revisão de role assignments, service principals e managed identities em subscriptions Azure.', criticality: 'Alta', fieldsCount: 18, validationsCount: 7, approvalsCount: 3, icon: 'ClipboardList', sla: '7 dias úteis', prerequisites: ['Tenant e subscriptions definidos', 'Escopo de análise claro'], documents: ['Escopo da auditoria', 'Lista de subscriptions'], validations: ['Subscription obrigatória', 'Escopo obrigatório', 'Justificativa obrigatória', 'Alvo definido para auditoria'], approvals: ['Gestor', 'Identity Governance Specialist', 'Segurança Cloud'], whenToUse: 'Para revisar permissões de RBAC, role assignments e identidades em subscriptions Azure.', relatedExamples: ['Auditoria de role assignments em subscription de produção', 'Revisão de service principals inativos'], type: 'audit' },
  { id: 'azure-audit-resources', provider: 'azure', name: 'Auditoria de Recursos Azure', description: 'Inventário e análise de recursos ativos em subscriptions e resource groups Azure.', criticality: 'Média', fieldsCount: 16, validationsCount: 6, approvalsCount: 2, icon: 'Search', sla: '5 dias úteis', prerequisites: ['Subscription ativa', 'Escopo definido'], documents: ['Justificativa', 'Escopo de análise'], validations: ['Subscription obrigatória', 'Ambiente obrigatório', 'Justificativa obrigatória'], approvals: ['Gestor', 'Cloud Audit Specialist'], whenToUse: 'Para identificar e catalogar recursos ativos, órfãos ou sem conformidade em subscriptions Azure.', relatedExamples: ['Inventário de VMs em subscription de produção', 'Recursos sem tags em resource groups'], type: 'audit' },
  { id: 'azure-audit-privileged', provider: 'azure', name: 'Auditoria de Acessos Privilegiados', description: 'Revisão de contas e identidades com privilégios elevados no Azure AD e subscriptions.', criticality: 'Crítica', fieldsCount: 18, validationsCount: 8, approvalsCount: 3, icon: 'ShieldAlert', sla: '5 dias úteis', prerequisites: ['Tenant definido', 'Aprovação de segurança'], documents: ['Justificativa', 'Escopo'], validations: ['Justificativa obrigatória', 'Tenant obrigatório', 'Dados sensíveis exigem classificação'], approvals: ['Gestor', 'Identity Governance Specialist', 'CISO'], whenToUse: 'Para revisar Global Admins, PIM assignments e identidades com Owner/User Access Administrator.', relatedExamples: ['Auditoria de Global Admins no tenant', 'Revisão de PIM eligible assignments'], type: 'audit' },

  // ============ AZURE BREAKING GLASS ============
  { id: 'azure-bg-admin', provider: 'azure', name: 'Acesso Emergencial Admin', description: 'Acesso administrativo emergencial e temporário em subscription Azure.', criticality: 'Crítica', fieldsCount: 22, validationsCount: 12, approvalsCount: 4, icon: 'AlertOctagon', sla: '1 hora', prerequisites: ['Incidente registrado', 'Justificativa emergencial'], documents: ['Evidência do incidente', 'Justificativa emergencial'], validations: ['Justificativa obrigatória', 'Incidente obrigatório', 'Subscription obrigatória', 'Identidade alvo obrigatória', 'Duração máxima obrigatória', 'Acesso admin exige dupla aprovação', 'Revisão pós-uso obrigatória'], approvals: ['Gestor', 'Segurança Cloud', 'Incident Response Specialist', 'CISO'], whenToUse: 'Em incidente crítico que exija acesso administrativo emergencial em subscription Azure.', relatedExamples: ['Elevação de privilégio para troubleshooting de AKS', 'Acesso Owner emergencial em subscription'], type: 'breaking-glass' },
  { id: 'azure-bg-privilege', provider: 'azure', name: 'Elevação Temporária PIM', description: 'Ativação emergencial de PIM role assignment com privilégio elevado.', criticality: 'Crítica', fieldsCount: 20, validationsCount: 10, approvalsCount: 4, icon: 'ArrowUpCircle', sla: '30 minutos', prerequisites: ['Incidente ativo', 'PIM configurado'], documents: ['Justificativa', 'Evidência do incidente'], validations: ['Justificativa obrigatória', 'Incidente obrigatório', 'Duração máxima obrigatória', 'Revogação automática obrigatória', 'Revisão posterior obrigatória'], approvals: ['Gestor', 'Segurança Cloud', 'Incident Response Specialist', 'CISO'], whenToUse: 'Quando PIM eligible assignment precisar ser ativado emergencialmente fora do fluxo padrão.', relatedExamples: ['Ativação emergencial de Contributor para troubleshooting', 'Elevação para Owner temporário'], type: 'breaking-glass' },
  { id: 'azure-bg-account', provider: 'azure', name: 'Ativação Conta Emergência', description: 'Ativação de break-glass account no Azure AD para cenários de emergência.', criticality: 'Crítica', fieldsCount: 16, validationsCount: 8, approvalsCount: 3, icon: 'KeyRound', sla: '15 minutos', prerequisites: ['Break-glass account configurada', 'Incidente P1/P2'], documents: ['Evidência do incidente'], validations: ['Incidente P1/P2 obrigatório', 'Justificativa obrigatória', 'Duração máxima obrigatória', 'Revisão pós-uso obrigatória'], approvals: ['Segurança Cloud', 'Incident Response Specialist', 'CISO'], whenToUse: 'Para ativar conta break-glass do Azure AD em cenários de emergência extrema.', relatedExamples: ['Ativação de break-glass por falha de MFA no tenant', 'Acesso de emergência por lockout de Global Admins'], type: 'breaking-glass' },

  // ============ OCI STANDARD ============
  { id: 'oci-iam', provider: 'oci', name: 'IAM / Policies', description: 'Gestão de policies IAM para controle de acesso no OCI.', criticality: 'Alta', fieldsCount: 14, validationsCount: 6, approvalsCount: 2, icon: 'Shield', sla: '48 horas úteis', prerequisites: ['Tenancy acessível', 'Compartment definido'], documents: ['Justificativa'], validations: ['Policy statement válido', 'Compartment correto', 'Menor privilégio'], approvals: ['Gestor', 'Segurança Cloud'], whenToUse: 'Quando precisar criar ou alterar policies de acesso no OCI.', relatedExamples: ['Policy para acesso a compartment financeiro'], type: 'standard' },
  { id: 'oci-group', provider: 'oci', name: 'Group Creation', description: 'Criação de grupos de usuários no OCI IAM.', criticality: 'Média', fieldsCount: 10, validationsCount: 4, approvalsCount: 2, icon: 'Users', sla: '24 horas úteis', prerequisites: ['Tenancy acessível'], documents: ['Justificativa'], validations: ['Nome único', 'Descrição obrigatória'], approvals: ['Gestor', 'IAM Admin'], whenToUse: 'Quando precisar criar um novo grupo para organizar usuários no OCI.', relatedExamples: ['Grupo para equipe de desenvolvimento', 'Grupo para administradores de rede'], type: 'standard' },
  { id: 'oci-dyngroup', provider: 'oci', name: 'Dynamic Group', description: 'Criação de Dynamic Groups para recursos OCI.', criticality: 'Alta', fieldsCount: 12, validationsCount: 5, approvalsCount: 2, icon: 'Zap', sla: '48 horas úteis', prerequisites: ['Tenancy acessível', 'Regra de matching definida'], documents: ['Justificativa', 'Regra de matching'], validations: ['Regra válida', 'Escopo correto'], approvals: ['Gestor', 'Segurança Cloud'], whenToUse: 'Quando resources (instances, functions) precisarem de identidade para acessar outros recursos.', relatedExamples: ['Dynamic Group para Functions acessarem Object Storage'], type: 'standard' },
  { id: 'oci-compartment', provider: 'oci', name: 'Access to Compartment', description: 'Solicitação de acesso a compartments OCI.', criticality: 'Média', fieldsCount: 11, validationsCount: 4, approvalsCount: 2, icon: 'FolderOpen', sla: '24 horas úteis', prerequisites: ['Compartment existente'], documents: ['Justificativa'], validations: ['Compartment OCID válido', 'Nível de acesso definido'], approvals: ['Gestor', 'Owner do Compartment'], whenToUse: 'Quando precisar de acesso a um compartment específico para gerenciar recursos.', relatedExamples: ['Acesso ao compartment de staging'], type: 'standard' },
  { id: 'oci-policy', provider: 'oci', name: 'Policy Creation', description: 'Criação de policies OCI para permissões específicas.', criticality: 'Alta', fieldsCount: 13, validationsCount: 6, approvalsCount: 2, icon: 'FileText', sla: '48 horas úteis', prerequisites: ['Compartment target definido', 'Group existente'], documents: ['Policy statements', 'Justificativa'], validations: ['Statement válido', 'Target correto', 'Menor privilégio'], approvals: ['Gestor', 'Segurança Cloud'], whenToUse: 'Quando precisar criar uma policy OCI para conceder permissões a um group ou dynamic group.', relatedExamples: ['Policy para permitir manage de instâncias em compartment de dev'], type: 'standard' },
  { id: 'oci-vault', provider: 'oci', name: 'Vault / Keys', description: 'Gerenciamento de Vaults e chaves de criptografia OCI.', criticality: 'Crítica', fieldsCount: 12, validationsCount: 5, approvalsCount: 3, icon: 'Lock', sla: '48 horas úteis', prerequisites: ['Compartment definido', 'Classificação de dados'], documents: ['Justificativa', 'Política de criptografia'], validations: ['Vault name válido', 'Key rotation configurada'], approvals: ['Gestor', 'Segurança Cloud', 'Compliance'], whenToUse: 'Quando precisar criar vaults ou chaves para criptografia de dados no OCI.', relatedExamples: ['Vault para criptografia de Autonomous Database'], type: 'standard' },
  { id: 'oci-nsg', provider: 'oci', name: 'Network Security Group', description: 'Configuração de NSGs para controle de tráfego de rede no OCI.', criticality: 'Alta', fieldsCount: 13, validationsCount: 6, approvalsCount: 2, icon: 'Network', sla: '24 horas úteis', prerequisites: ['VCN existente'], documents: ['Diagrama de rede'], validations: ['Regras mínimas', 'Sem regras permissivas'], approvals: ['Gestor', 'Segurança de Rede'], whenToUse: 'Quando precisar configurar regras de firewall em NSGs do OCI.', relatedExamples: ['NSG para cluster OKE'], type: 'standard' },
  { id: 'oci-os', provider: 'oci', name: 'Object Storage Access', description: 'Permissões de acesso a buckets de Object Storage no OCI.', criticality: 'Média', fieldsCount: 11, validationsCount: 4, approvalsCount: 2, icon: 'HardDrive', sla: '24 horas úteis', prerequisites: ['Bucket existente', 'Compartment definido'], documents: ['Justificativa'], validations: ['Bucket name válido', 'Tipo de acesso definido'], approvals: ['Gestor', 'Owner do Bucket'], whenToUse: 'Quando precisar de acesso de leitura ou escrita a buckets de Object Storage.', relatedExamples: ['Acesso de leitura a bucket de backups'], type: 'standard' },

  // ============ OCI AUDIT ============
  { id: 'oci-audit-policies', provider: 'oci', name: 'Auditoria de Policies e Groups', description: 'Revisão de groups, dynamic groups e policy statements OCI.', criticality: 'Alta', fieldsCount: 18, validationsCount: 7, approvalsCount: 3, icon: 'ClipboardList', sla: '7 dias úteis', prerequisites: ['Tenancy definida', 'Compartments alvo definidos'], documents: ['Escopo da auditoria', 'Lista de compartments'], validations: ['Tenancy obrigatória', 'Escopo obrigatório', 'Justificativa obrigatória', 'Compartment obrigatório'], approvals: ['Gestor', 'Identity Governance Specialist', 'Segurança Cloud'], whenToUse: 'Para auditar groups, dynamic groups e policies no OCI verificando conformidade e privilégio mínimo.', relatedExamples: ['Auditoria de policies em compartment financeiro', 'Revisão de dynamic groups com amplo escopo'], type: 'audit' },
  { id: 'oci-audit-resources', provider: 'oci', name: 'Auditoria de Recursos OCI', description: 'Inventário de recursos ativos e análise de conformidade em compartments OCI.', criticality: 'Média', fieldsCount: 16, validationsCount: 6, approvalsCount: 2, icon: 'Search', sla: '5 dias úteis', prerequisites: ['Tenancy ativa', 'Compartments definidos'], documents: ['Justificativa', 'Escopo'], validations: ['Compartment obrigatório', 'Ambiente obrigatório', 'Justificativa obrigatória'], approvals: ['Gestor', 'Cloud Audit Specialist'], whenToUse: 'Para identificar recursos ativos, órfãos ou sem conformidade em compartments OCI.', relatedExamples: ['Inventário de instâncias em compartment de produção', 'Recursos sem tags'], type: 'audit' },
  { id: 'oci-audit-privileged', provider: 'oci', name: 'Auditoria de Acessos Privilegiados', description: 'Revisão de usuários e groups com permissões administrativas na tenancy OCI.', criticality: 'Crítica', fieldsCount: 18, validationsCount: 8, approvalsCount: 3, icon: 'ShieldAlert', sla: '5 dias úteis', prerequisites: ['Tenancy definida', 'Aprovação de segurança'], documents: ['Justificativa', 'Escopo'], validations: ['Justificativa obrigatória', 'Tenancy obrigatória', 'Dados sensíveis exigem classificação'], approvals: ['Gestor', 'Identity Governance Specialist', 'CISO'], whenToUse: 'Para revisar administradores da tenancy, groups com manage all-resources e acessos elevados.', relatedExamples: ['Revisão de membros do grupo Administrators', 'Auditoria de policies com manage all-resources'], type: 'audit' },

  // ============ OCI BREAKING GLASS ============
  { id: 'oci-bg-admin', provider: 'oci', name: 'Acesso Emergencial a Compartment', description: 'Acesso administrativo emergencial e temporário a compartment OCI crítico.', criticality: 'Crítica', fieldsCount: 22, validationsCount: 12, approvalsCount: 4, icon: 'AlertOctagon', sla: '1 hora', prerequisites: ['Incidente registrado', 'Tenancy acessível'], documents: ['Evidência do incidente', 'Justificativa emergencial'], validations: ['Justificativa obrigatória', 'Incidente obrigatório', 'Compartment obrigatório', 'Identidade alvo obrigatória', 'Duração máxima obrigatória', 'Revisão pós-uso obrigatória'], approvals: ['Gestor', 'Segurança Cloud', 'Incident Response Specialist', 'CISO'], whenToUse: 'Em incidente crítico que exija acesso administrativo emergencial a compartment OCI.', relatedExamples: ['Acesso emergencial a compartment financeiro', 'Policy temporária para troubleshooting'], type: 'breaking-glass' },
  { id: 'oci-bg-privilege', provider: 'oci', name: 'Elevação Temporária de Privilégio', description: 'Concessão temporária de policy com privilégio elevado para resolução de incidentes.', criticality: 'Crítica', fieldsCount: 20, validationsCount: 10, approvalsCount: 4, icon: 'ArrowUpCircle', sla: '1 hora', prerequisites: ['Incidente ativo', 'Group existente'], documents: ['Justificativa', 'Plano de rollback'], validations: ['Justificativa obrigatória', 'Incidente obrigatório', 'Duração máxima obrigatória', 'Revogação automática obrigatória', 'Revisão posterior obrigatória'], approvals: ['Gestor', 'Segurança Cloud', 'Incident Response Specialist', 'CISO'], whenToUse: 'Quando policy temporária com privilégio elevado for necessária para resolver incidente OCI.', relatedExamples: ['Policy temporária manage all-resources', 'Elevação para manage instances em compartment prod'], type: 'breaking-glass' },
];

// ============ TICKETS ============
export type TicketStatus = 'Em Preenchimento' | 'Aguardando Aprovação' | 'Aprovado' | 'Em Execução' | 'Concluído' | 'Rejeitado' | 'Cancelado';
export type Criticality = 'Baixa' | 'Média' | 'Alta' | 'Crítica';
export type Environment = 'Desenvolvimento' | 'Homologação' | 'Produção';

export interface Ticket {
  id: string;
  title: string;
  provider: Provider;
  categoryId: string;
  categoryName: string;
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
  incidentId?: string;
  breakingGlassDuration?: string;
  postReviewStatus?: 'Pendente' | 'Em Análise' | 'Concluída';
}

export const tickets: Ticket[] = [
  // STANDARD TICKETS
  { id: 'CLD-REQ-84721', title: 'Criação de Role para Lambda de integração com S3', provider: 'aws', categoryId: 'aws-role', categoryName: 'Roles', type: 'standard', requester: 'Ana Souza', requesterEmail: 'ana.souza@corp.com', team: 'Engenharia de Dados', manager: 'Carlos Silva', environment: 'Produção', criticality: 'Alta', status: 'Aguardando Aprovação', createdAt: '2024-01-15T10:30:00', updatedAt: '2024-01-15T14:22:00', sla: '48 horas úteis', description: 'Role necessária para função Lambda que processa arquivos de integração no bucket S3 de produção.', justification: 'Pipeline de dados crítica para reconciliação financeira diária.', project: 'Data Pipeline v2', costCenter: 'CC-4521', system: 'Sistema de Reconciliação' },
  { id: 'CLD-REQ-84722', title: 'PSET ReadOnly para time de observabilidade', provider: 'aws', categoryId: 'aws-pset', categoryName: 'PSET / Permission Set', type: 'standard', requester: 'Bruno Mendes', requesterEmail: 'bruno.mendes@corp.com', team: 'SRE / Observabilidade', manager: 'Juliana Costa', environment: 'Produção', criticality: 'Média', status: 'Em Execução', createdAt: '2024-01-14T09:15:00', updatedAt: '2024-01-15T11:00:00', sla: '48 horas úteis', description: 'Permission Set de leitura para equipe de SRE monitorar recursos em contas de produção.', justification: 'Time de SRE precisa visibilidade em todas as contas para troubleshooting.', project: 'Observability Platform', costCenter: 'CC-3201', system: 'Grafana / CloudWatch' },
  { id: 'CLD-REQ-84723', title: 'Perfil corporativo para equipe de SRE com AD e PSET', provider: 'aws', categoryId: 'aws-profile', categoryName: 'Perfis de Acesso', type: 'standard', requester: 'Juliana Costa', requesterEmail: 'juliana.costa@corp.com', team: 'SRE / Observabilidade', manager: 'Ricardo Almeida', environment: 'Produção', criticality: 'Alta', status: 'Aguardando Aprovação', createdAt: '2024-01-13T16:45:00', updatedAt: '2024-01-14T08:30:00', sla: '72 horas úteis', description: 'Perfil completo integrando grupo AD, PSET e contas AWS para equipe de SRE.', justification: 'Padronização de acessos da equipe de SRE em múltiplas contas.', project: 'IAM Governance', costCenter: 'CC-3201', system: 'AWS Identity Center' },
  { id: 'CLD-REQ-84724', title: 'Nova conta de produção para sistema de pagamentos', provider: 'aws', categoryId: 'aws-account', categoryName: 'Criação de Conta', type: 'standard', requester: 'Ricardo Almeida', requesterEmail: 'ricardo.almeida@corp.com', team: 'Arquitetura Cloud', manager: 'Fernanda Lima', environment: 'Produção', criticality: 'Crítica', status: 'Aprovado', createdAt: '2024-01-12T11:00:00', updatedAt: '2024-01-14T16:00:00', sla: '5 dias úteis', description: 'Conta AWS dedicada para o novo sistema de pagamentos com isolamento completo.', justification: 'Requisito regulatório PCI-DSS exige isolamento de workloads de pagamento.', project: 'Payment Gateway v3', costCenter: 'CC-1001', system: 'Payment Gateway' },
  { id: 'CLD-REQ-84725', title: 'Acesso Reader em Resource Group de analytics', provider: 'azure', categoryId: 'azure-rg', categoryName: 'Acesso a Resource Group', type: 'standard', requester: 'Mariana Oliveira', requesterEmail: 'mariana.oliveira@corp.com', team: 'Business Intelligence', manager: 'Paulo Santos', environment: 'Produção', criticality: 'Baixa', status: 'Concluído', createdAt: '2024-01-11T08:00:00', updatedAt: '2024-01-12T10:00:00', sla: '24 horas úteis', description: 'Acesso de leitura ao Resource Group rg-analytics-prod para consulta de dashboards.', justification: 'Time de BI precisa consultar dados de Power BI Embedded.', project: 'BI Dashboard', costCenter: 'CC-2301', system: 'Power BI' },
  { id: 'CLD-REQ-84726', title: 'Service Principal para pipeline CI/CD do GitHub Actions', provider: 'azure', categoryId: 'azure-sp', categoryName: 'Service Principal', type: 'standard', requester: 'Felipe Torres', requesterEmail: 'felipe.torres@corp.com', team: 'DevOps', manager: 'Carlos Silva', environment: 'Homologação', criticality: 'Média', status: 'Em Preenchimento', createdAt: '2024-01-15T13:00:00', updatedAt: '2024-01-15T13:00:00', sla: '48 horas úteis', description: 'Service Principal com permissões para deploy automatizado via GitHub Actions.', justification: 'Automação de deploy para ambiente de homologação.', project: 'Platform Engineering', costCenter: 'CC-3001', system: 'GitHub Actions' },
  { id: 'CLD-REQ-84727', title: 'Policy para acesso a compartment financeiro', provider: 'oci', categoryId: 'oci-iam', categoryName: 'IAM / Policies', type: 'standard', requester: 'Carla Duarte', requesterEmail: 'carla.duarte@corp.com', team: 'Infraestrutura Cloud', manager: 'Roberto Nascimento', environment: 'Produção', criticality: 'Alta', status: 'Aguardando Aprovação', createdAt: '2024-01-14T14:30:00', updatedAt: '2024-01-15T09:15:00', sla: '48 horas úteis', description: 'Policy OCI para permitir que grupo FinOps gerencie recursos no compartment financeiro.', justification: 'Equipe de FinOps precisa gerenciar budgets e cost analysis.', project: 'FinOps Initiative', costCenter: 'CC-5001', system: 'OCI Console' },
  { id: 'CLD-REQ-84728', title: 'Dynamic Group para Functions acessarem Object Storage', provider: 'oci', categoryId: 'oci-dyngroup', categoryName: 'Dynamic Group', type: 'standard', requester: 'Lucas Ferreira', requesterEmail: 'lucas.ferreira@corp.com', team: 'Desenvolvimento', manager: 'Ana Souza', environment: 'Desenvolvimento', criticality: 'Média', status: 'Concluído', createdAt: '2024-01-10T10:00:00', updatedAt: '2024-01-11T15:00:00', sla: '48 horas úteis', description: 'Dynamic Group para Functions no compartment de dev acessarem buckets de Object Storage.', justification: 'Functions precisam ler/escrever dados de processamento.', project: 'Serverless App', costCenter: 'CC-4001', system: 'OCI Functions' },
  { id: 'CLD-REQ-84729', title: 'Criação de Policy customizada para acesso S3 restrito', provider: 'aws', categoryId: 'aws-policy', categoryName: 'Policies', type: 'standard', requester: 'Diego Martins', requesterEmail: 'diego.martins@corp.com', team: 'Segurança', manager: 'Juliana Costa', environment: 'Produção', criticality: 'Alta', status: 'Rejeitado', createdAt: '2024-01-09T11:30:00', updatedAt: '2024-01-10T16:45:00', sla: '48 horas úteis', description: 'Policy customizada para restringir acesso a prefix específico em bucket S3.', justification: 'Acesso granular necessário para conformidade com LGPD.', project: 'Data Privacy', costCenter: 'CC-6001', system: 'S3 Data Lake' },
  { id: 'CLD-REQ-84730', title: 'Acesso Key Vault para aplicação de certificados', provider: 'azure', categoryId: 'azure-kv', categoryName: 'Key Vault Access', type: 'standard', requester: 'Patrícia Gomes', requesterEmail: 'patricia.gomes@corp.com', team: 'Segurança', manager: 'Roberto Nascimento', environment: 'Produção', criticality: 'Crítica', status: 'Em Execução', createdAt: '2024-01-13T09:00:00', updatedAt: '2024-01-14T11:30:00', sla: '48 horas úteis', description: 'Acesso Get/List a certificates e secrets no Key Vault kv-certs-prod.', justification: 'Aplicação de rotação de certificados precisa acessar Key Vault.', project: 'Certificate Management', costCenter: 'CC-6002', system: 'Cert Manager' },

  // AUDIT TICKETS
  { id: 'CLD-AUD-90001', title: 'Levantamento de recursos em uso na conta prd-payment-gateway', provider: 'aws', categoryId: 'aws-audit-resources', categoryName: 'Levantamento de Recursos', type: 'audit', requester: 'Roberto Nascimento', requesterEmail: 'roberto.nascimento@corp.com', team: 'SecOps', manager: 'Fernanda Lima', environment: 'Produção', criticality: 'Média', status: 'Em Execução', createdAt: '2024-01-16T08:00:00', updatedAt: '2024-01-17T10:00:00', sla: '5 dias úteis', description: 'Inventário completo de recursos ativos na conta 123456789012 (prd-payment-gateway) incluindo EC2, S3, RDS, Lambda, IAM Roles, KMS e Security Groups.', justification: 'Auditoria trimestral de conformidade exigida por compliance PCI-DSS.', project: 'Audit Q1-2024', costCenter: 'CC-6001', system: 'AWS Config / CloudTrail' },
  { id: 'CLD-AUD-90002', title: 'Auditoria de permissões de usuários e perfis IAM', provider: 'aws', categoryId: 'aws-audit-permissions', categoryName: 'Auditoria de Permissões', type: 'audit', requester: 'Patrícia Gomes', requesterEmail: 'patricia.gomes@corp.com', team: 'GRC', manager: 'Fernanda Lima', environment: 'Produção', criticality: 'Alta', status: 'Aguardando Aprovação', createdAt: '2024-01-17T09:00:00', updatedAt: '2024-01-17T14:00:00', sla: '7 dias úteis', description: 'Revisão de grupos AD refletidos na AWS, PSETs, roles e acessos administrativos em contas produtivas.', justification: 'Revisão semestral de acessos conforme política de governança corporativa.', project: 'Access Review H1-2024', costCenter: 'CC-6001', system: 'AWS IAM / Identity Center' },
  { id: 'CLD-AUD-90003', title: 'Auditoria de RBAC em subscriptions Azure de produção', provider: 'azure', categoryId: 'azure-audit-rbac', categoryName: 'Auditoria de RBAC', type: 'audit', requester: 'Marcos Ribeiro', requesterEmail: 'marcos.ribeiro@corp.com', team: 'IAM', manager: 'Roberto Nascimento', environment: 'Produção', criticality: 'Alta', status: 'Em Preenchimento', createdAt: '2024-01-18T10:00:00', updatedAt: '2024-01-18T10:00:00', sla: '7 dias úteis', description: 'Auditoria de role assignments, service principals e managed identities em subscriptions Corp-Production e Analytics-Production.', justification: 'Identificação de permissões excessivas e identidades inativas conforme baseline SOX.', project: 'SOX Compliance 2024', costCenter: 'CC-6002', system: 'Azure AD / RBAC' },
  { id: 'CLD-AUD-90004', title: 'Auditoria de groups, dynamic groups e policies OCI', provider: 'oci', categoryId: 'oci-audit-policies', categoryName: 'Auditoria de Policies e Groups', type: 'audit', requester: 'Carla Duarte', requesterEmail: 'carla.duarte@corp.com', team: 'Infraestrutura Cloud', manager: 'Roberto Nascimento', environment: 'Produção', criticality: 'Alta', status: 'Concluído', createdAt: '2024-01-10T14:00:00', updatedAt: '2024-01-16T16:00:00', sla: '7 dias úteis', description: 'Revisão completa de groups, dynamic groups e policy statements na tenancy OCI com foco em compartments financeiro e segurança.', justification: 'Auditoria anual de governança de acessos OCI exigida por compliance.', project: 'OCI Governance Review', costCenter: 'CC-5001', system: 'OCI IAM' },

  // BREAKING GLASS TICKETS
  { id: 'CLD-BG-95001', title: 'Acesso emergencial administrativo em conta prd-payment-gateway', provider: 'aws', categoryId: 'aws-bg-admin', categoryName: 'Acesso Emergencial Admin', type: 'breaking-glass', requester: 'Ana Souza', requesterEmail: 'ana.souza@corp.com', team: 'Engenharia de Dados', manager: 'Carlos Silva', environment: 'Produção', criticality: 'Crítica', status: 'Concluído', createdAt: '2024-01-14T02:15:00', updatedAt: '2024-01-14T06:30:00', sla: '1 hora', description: 'Acesso administrativo emergencial necessário para resolver incidente crítico em workload de pagamentos que afetou processamento de transações.', justification: 'Incidente P1 - Falha crítica no pipeline de pagamentos. Processamento de transações parado desde 02:00.', project: 'Payment Gateway v3', costCenter: 'CC-1001', system: 'Payment Gateway', incidentId: 'INC-2024-0142', breakingGlassDuration: '2 horas', postReviewStatus: 'Concluída' },
  { id: 'CLD-BG-95002', title: 'Elevação temporária de privilégio para troubleshooting AKS', provider: 'azure', categoryId: 'azure-bg-privilege', categoryName: 'Elevação Temporária PIM', type: 'breaking-glass', requester: 'Felipe Torres', requesterEmail: 'felipe.torres@corp.com', team: 'DevOps', manager: 'Carlos Silva', environment: 'Produção', criticality: 'Crítica', status: 'Em Execução', createdAt: '2024-01-18T14:30:00', updatedAt: '2024-01-18T14:45:00', sla: '30 minutos', description: 'Elevação emergencial de Contributor para Owner em subscription de produção para resolver falha no cluster AKS que afeta serviços críticos.', justification: 'Incidente P1 - Cluster AKS em CrashLoopBackOff. Necessário acesso Owner para ajuste de RBAC do cluster.', project: 'Platform Engineering', costCenter: 'CC-3001', system: 'Azure AKS', incidentId: 'INC-2024-0198', breakingGlassDuration: '4 horas', postReviewStatus: 'Pendente' },
  { id: 'CLD-BG-95003', title: 'Acesso emergencial a compartment financeiro OCI', provider: 'oci', categoryId: 'oci-bg-admin', categoryName: 'Acesso Emergencial a Compartment', type: 'breaking-glass', requester: 'Carla Duarte', requesterEmail: 'carla.duarte@corp.com', team: 'Infraestrutura Cloud', manager: 'Roberto Nascimento', environment: 'Produção', criticality: 'Crítica', status: 'Aguardando Aprovação', createdAt: '2024-01-19T03:45:00', updatedAt: '2024-01-19T04:00:00', sla: '1 hora', description: 'Acesso emergencial ao compartment financeiro para investigar e corrigir falha no Autonomous Database que afeta sistema de faturamento.', justification: 'Incidente P1 - Autonomous Database no compartment financeiro com erro de storage. Faturamento diário bloqueado.', project: 'FinOps Initiative', costCenter: 'CC-5001', system: 'OCI Autonomous DB', incidentId: 'INC-2024-0201', breakingGlassDuration: '3 horas', postReviewStatus: 'Pendente' },
  { id: 'CLD-BG-95004', title: 'Ativação de acesso emergencial para ajuste em política KMS', provider: 'aws', categoryId: 'aws-bg-privilege', categoryName: 'Elevação Temporária de Privilégio', type: 'breaking-glass', requester: 'Diego Martins', requesterEmail: 'diego.martins@corp.com', team: 'Segurança', manager: 'Juliana Costa', environment: 'Produção', criticality: 'Crítica', status: 'Concluído', createdAt: '2024-01-12T22:00:00', updatedAt: '2024-01-13T01:00:00', sla: '1 hora', description: 'Elevação temporária de privilégio para corrigir política KMS que bloqueou criptografia de dados em bucket S3 crítico.', justification: 'Incidente P2 - Política KMS com deny explícito bloqueou escrita em bucket de dados financeiros.', project: 'Data Privacy', costCenter: 'CC-6001', system: 'AWS KMS', incidentId: 'INC-2024-0135', breakingGlassDuration: '1 hora', postReviewStatus: 'Concluída' },
];

// ============ AWS ACCOUNTS ============
export const awsAccounts = [
  { id: '123456789012', name: 'prd-payment-gateway', env: 'Produção' },
  { id: '234567890123', name: 'prd-data-lake', env: 'Produção' },
  { id: '345678901234', name: 'hml-payment-gateway', env: 'Homologação' },
  { id: '456789012345', name: 'dev-sandbox-eng', env: 'Desenvolvimento' },
  { id: '567890123456', name: 'prd-shared-services', env: 'Produção' },
  { id: '678901234567', name: 'prd-security-logging', env: 'Produção' },
  { id: '789012345678', name: 'hml-data-analytics', env: 'Homologação' },
  { id: '890123456789', name: 'dev-ml-experiments', env: 'Desenvolvimento' },
];

export const azureSubscriptions = [
  { id: 'sub-001', name: 'Corp-Production', env: 'Produção' },
  { id: 'sub-002', name: 'Corp-Staging', env: 'Homologação' },
  { id: 'sub-003', name: 'Corp-Development', env: 'Desenvolvimento' },
  { id: 'sub-004', name: 'Analytics-Production', env: 'Produção' },
  { id: 'sub-005', name: 'Security-Hub', env: 'Produção' },
];

export const azureResourceGroups = [
  { name: 'rg-analytics-prod', subscription: 'Corp-Production' },
  { name: 'rg-webapp-prod', subscription: 'Corp-Production' },
  { name: 'rg-data-staging', subscription: 'Corp-Staging' },
  { name: 'rg-devops-tools', subscription: 'Corp-Development' },
  { name: 'rg-security-mon', subscription: 'Security-Hub' },
  { name: 'rg-ml-experiments', subscription: 'Corp-Development' },
  { name: 'rg-networking-prod', subscription: 'Corp-Production' },
];

export const azureRoleDefinitions = [
  'Reader', 'Contributor', 'Owner', 'User Access Administrator',
  'Key Vault Secrets Officer', 'Key Vault Certificates Officer', 'Key Vault Crypto Officer',
  'Storage Blob Data Reader', 'Storage Blob Data Contributor',
  'Network Contributor', 'Virtual Machine Contributor',
  'AcrPush', 'AcrPull', 'Monitoring Reader', 'Log Analytics Reader',
  'Custom Role (especificar)',
];

export const azureKeyVaults = [
  { name: 'kv-certs-prod', rg: 'rg-security-mon', subscription: 'Security-Hub' },
  { name: 'kv-secrets-webapp', rg: 'rg-webapp-prod', subscription: 'Corp-Production' },
  { name: 'kv-data-encryption', rg: 'rg-analytics-prod', subscription: 'Analytics-Production' },
  { name: 'kv-devops-tokens', rg: 'rg-devops-tools', subscription: 'Corp-Development' },
];

export const ociCompartments = [
  { id: 'ocid1.compartment.oc1..finance', name: 'cmp-financeiro', env: 'Produção' },
  { id: 'ocid1.compartment.oc1..dev', name: 'cmp-desenvolvimento', env: 'Desenvolvimento' },
  { id: 'ocid1.compartment.oc1..security', name: 'cmp-seguranca', env: 'Produção' },
  { id: 'ocid1.compartment.oc1..network', name: 'cmp-network', env: 'Produção' },
  { id: 'ocid1.compartment.oc1..staging', name: 'cmp-staging', env: 'Homologação' },
  { id: 'ocid1.compartment.oc1..apps', name: 'cmp-aplicacoes', env: 'Produção' },
  { id: 'ocid1.compartment.oc1..shared', name: 'cmp-shared-services', env: 'Produção' },
];

export const ociGroups = [
  'grp-finops-users', 'grp-dev-team', 'grp-security-admins',
  'grp-network-admins', 'grp-dba-team', 'grp-app-deployers',
  'grp-audit-readers', 'grp-cloud-admins',
];

export const ociVaults = [
  { name: 'vault-master-prod', compartment: 'cmp-seguranca' },
  { name: 'vault-data-encryption', compartment: 'cmp-financeiro' },
  { name: 'vault-app-secrets', compartment: 'cmp-aplicacoes' },
];

export const adGroups = [
  'GRP-AWS-SRE-ReadOnly',
  'GRP-AWS-DevOps-PowerUser',
  'GRP-AWS-DataEng-Admin',
  'GRP-AWS-Security-Audit',
  'GRP-AWS-FinOps-Reader',
  'GRP-AZURE-BI-Reader',
  'GRP-AZURE-DevOps-Contributor',
  'GRP-OCI-Dev-Manage',
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

export const approvers = [
  { name: 'Carlos Silva', role: 'Gestor', team: 'Engenharia' },
  { name: 'Juliana Costa', role: 'Gestor', team: 'SRE' },
  { name: 'Fernanda Lima', role: 'Diretora', team: 'Tecnologia' },
  { name: 'Roberto Nascimento', role: 'Segurança Cloud', team: 'SecOps' },
  { name: 'Marcos Ribeiro', role: 'IAM Admin', team: 'IAM' },
  { name: 'Patrícia Gomes', role: 'Compliance', team: 'GRC' },
  { name: 'Ricardo Almeida', role: 'Arquiteto Cloud', team: 'Arquitetura' },
  { name: 'Eduardo Santos', role: 'Cloud Audit Specialist', team: 'Auditoria' },
  { name: 'Lúcia Mendes', role: 'Identity Governance Specialist', team: 'IAM Governance' },
  { name: 'André Costa', role: 'Incident Response Specialist', team: 'CSIRT' },
];

// ============ CROSS-CUTTING CATEGORIES ============
export const crossCuttingCategories = [
  {
    id: 'audit',
    name: 'Auditoria e Conformidade',
    description: 'Solicitações de auditoria, inventário, revisão de acessos e conformidade em ambientes multi-cloud.',
    icon: 'ClipboardCheck',
    color: 'info',
    count: categories.filter(c => c.type === 'audit').length,
  },
  {
    id: 'breaking-glass',
    name: 'Acesso Emergencial / Breaking Glass',
    description: 'Solicitações de acesso temporário, emergencial e altamente controlado com trilha de auditoria.',
    icon: 'AlertOctagon',
    color: 'destructive',
    count: categories.filter(c => c.type === 'breaking-glass').length,
  },
];
