import { Layout } from '@/components/Layout';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createContext, useContext, useMemo, useState } from 'react';
import { awsAccounts, catalog, iamGroups, psets } from '@/data/mockData';
import { AlertOctagon, ArrowLeft, Info, Plus, Trash2 } from 'lucide-react';

type ActionType = 'create' | 'update' | 'delete' | 'close' | 'unknown';
type RolePermissionMode = 'none' | 'attach-existing';
type IamUserPermissionMode = 'none' | 'group-existing' | 'attach-existing' | 'group-and-attach-existing';
type GroupPermissionMode = 'none' | 'attach-existing';
type SelectOption = { value: string; label: string };
type RoleEnvironment = 'DEV' | 'HML' | 'PRD';
type RoleDeleteTarget = { roleName: string };
type HelpLink = { label: string; url: string };
type HelpContent = string | { text: string; example?: string; docs?: HelpLink[] };
type RoleUpdateActionType =
  | 'add-policy'
  | 'remove-policy'
  | 'add-trusted-entity'
  | 'update-trusted-entity'
  | 'remove-trusted-entity';
type RoleUpdateActionItem = {
  id: string;
  type: RoleUpdateActionType;
  details: string;
  policies: string[];
};
type GroupUpdateActionType = 'add-policy' | 'remove-policy' | 'add-user' | 'remove-user';
type GroupUpdateActionItem = {
  id: string;
  type: GroupUpdateActionType;
  items: string[];
};
type UserUpdateActionType = 'add-policy' | 'remove-policy' | 'add-group' | 'remove-group' | 'rotate-key';
type UserUpdateActionItem = {
  id: string;
  type: UserUpdateActionType;
  items: string[];
};
type PsetUpdateActionType = 'add-policy' | 'remove-policy' | 'add-account' | 'remove-account';
type PsetUpdateActionItem = {
  id: string;
  type: PsetUpdateActionType;
  items: string[];
};
type TooltipScope = {
  categoryId?: string;
  requestTypeId?: string;
  requestTypeName?: string;
  action?: ActionType;
};

const roleEnvironmentOrder: RoleEnvironment[] = ['DEV', 'HML', 'PRD'];
const TooltipScopeContext = createContext<TooltipScope | null>(null);
const ROLE_UPDATE_POLICY_LIMIT = 10;
const GROUP_UPDATE_ITEM_LIMIT = 10;
const USER_UPDATE_ITEM_LIMIT = 10;
const PSET_UPDATE_ITEM_LIMIT = 10;
const AWS_INFO_MULTI_ITEM_LIMIT = 20;
const roleUpdateActionCatalog: Array<{
  value: RoleUpdateActionType;
  label: string;
  mode: 'policy-list' | 'details';
  description: string;
  placeholder?: string;
}> = [
  {
    value: 'add-policy',
    label: 'Adicionar policy',
    mode: 'policy-list',
    description: 'Informe o(s) nome(s) da(s) policy(ies) que deseja adicionar.',
  },
  {
    value: 'remove-policy',
    label: 'Remover policy',
    mode: 'policy-list',
    description: 'Informe o(s) nome(s) da(s) policy(ies) que deseja remover.',
  },
  {
    value: 'add-trusted-entity',
    label: 'Adicionar Trusted Entity',
    mode: 'details',
    description: 'Descreva qual trusted entity deve ser adicionada.',
    placeholder: 'Ex: adicionar service principal events.amazonaws.com no trust da role.',
  },
  {
    value: 'update-trusted-entity',
    label: 'Alterar Trusted Entity',
    mode: 'details',
    description: 'Descreva como o trusted entity atual deve ser alterado.',
    placeholder: 'Ex: substituir arn:aws:iam::123456789012:root por arn:aws:iam::210987654321:root.',
  },
  {
    value: 'remove-trusted-entity',
    label: 'Remover Trusted Entity',
    mode: 'details',
    description: 'Descreva qual trusted entity deve ser removida.',
    placeholder: 'Ex: remover federated principal arn:aws:iam::123456789012:saml-provider/Okta.',
  },
];
const groupUpdateActionCatalog: Array<{
  value: GroupUpdateActionType;
  label: string;
  mode: 'policy-list' | 'user-list';
  description: string;
  placeholder: string;
}> = [
  {
    value: 'add-policy',
    label: 'Adicionar policy',
    mode: 'policy-list',
    description: 'Informe o(s) nome(s) ou ARN(s) da(s) policy(ies) que deseja adicionar no grupo.',
    placeholder: 'Ex: arn:aws:iam::aws:policy/ReadOnlyAccess',
  },
  {
    value: 'remove-policy',
    label: 'Remover policy',
    mode: 'policy-list',
    description: 'Informe o(s) nome(s) ou ARN(s) da(s) policy(ies) que deseja remover do grupo.',
    placeholder: 'Ex: arn:aws:iam::aws:policy/ReadOnlyAccess',
  },
  {
    value: 'add-user',
    label: 'Adicionar usuario',
    mode: 'user-list',
    description: 'Informe o(s) usuario(s) IAM que devem ser adicionados ao grupo.',
    placeholder: 'Ex: usuario-app-batch ou arn:aws:iam::123456789012:user/usuario-app-batch',
  },
  {
    value: 'remove-user',
    label: 'Remover usuario',
    mode: 'user-list',
    description: 'Informe o(s) usuario(s) IAM que devem ser removidos do grupo.',
    placeholder: 'Ex: usuario-app-batch ou arn:aws:iam::123456789012:user/usuario-app-batch',
  },
];
const userUpdateActionCatalog: Array<{
  value: UserUpdateActionType;
  label: string;
  mode: 'policy-list' | 'group-list' | 'key-list';
  description: string;
  placeholder: string;
}> = [
  {
    value: 'add-policy',
    label: 'Adicionar policy',
    mode: 'policy-list',
    description: 'Informe o(s) nome(s) ou ARN(s) da(s) policy(ies) que deseja adicionar ao usuario.',
    placeholder: 'Ex: arn:aws:iam::aws:policy/ReadOnlyAccess',
  },
  {
    value: 'remove-policy',
    label: 'Remover policy',
    mode: 'policy-list',
    description: 'Informe o(s) nome(s) ou ARN(s) da(s) policy(ies) que deseja remover do usuario.',
    placeholder: 'Ex: arn:aws:iam::aws:policy/ReadOnlyAccess',
  },
  {
    value: 'add-group',
    label: 'Adicionar grupo',
    mode: 'group-list',
    description: 'Informe o(s) grupo(s) IAM existente(s) que devem ser adicionados ao usuario.',
    placeholder: 'Ex: IAM-Backup-Operators ou arn:aws:iam::123456789012:group/IAM-Backup-Operators',
  },
  {
    value: 'remove-group',
    label: 'Remover grupo',
    mode: 'group-list',
    description: 'Informe o(s) grupo(s) IAM existente(s) que devem ser removidos do usuario.',
    placeholder: 'Ex: IAM-Backup-Operators ou arn:aws:iam::123456789012:group/IAM-Backup-Operators',
  },
  {
    value: 'rotate-key',
    label: 'Rotacionar key',
    mode: 'key-list',
    description: 'Informe a key alvo da rotacao (Key ID). A key atual sera desativada e, apos 7 dias sem pedido de reativacao, sera excluida.',
    placeholder: 'Ex: AKIAIOSFODNN7EXAMPLE ou key ativa atual',
  },
];
const psetUpdateActionCatalog: Array<{
  value: PsetUpdateActionType;
  label: string;
  mode: 'policy-list' | 'account-list';
  description: string;
  placeholder: string;
}> = [
  {
    value: 'add-policy',
    label: 'Adicionar policy',
    mode: 'policy-list',
    description: 'Informe o(s) nome(s) ou ARN(s) da(s) policy(ies) que deve(m) ser adicionada(s) ao PSET.',
    placeholder: 'Ex: CloudWatchReadOnlyAccess ou arn:aws:iam::aws:policy/CloudWatchReadOnlyAccess',
  },
  {
    value: 'remove-policy',
    label: 'Remover policy',
    mode: 'policy-list',
    description: 'Informe o(s) nome(s) ou ARN(s) da(s) policy(ies) que deve(m) ser removida(s) do PSET.',
    placeholder: 'Ex: ReadOnlyAccess ou arn:aws:iam::aws:policy/ReadOnlyAccess',
  },
  {
    value: 'add-account',
    label: 'Adicionar conta',
    mode: 'account-list',
    description: 'Informe a(s) conta(s) AWS que devem receber atribuicao desse PSET.',
    placeholder: 'Ex: 123456789012 (prd-payment-gateway)',
  },
  {
    value: 'remove-account',
    label: 'Remover conta',
    mode: 'account-list',
    description: 'Informe a(s) conta(s) AWS cuja atribuicao desse PSET deve ser removida.',
    placeholder: 'Ex: 210987654321 (hml-payment-gateway)',
  },
];
const awsInfoSurveyTypeOptions: SelectOption[] = [
  { value: 'Conta AWS', label: 'Conta AWS' },
  { value: 'Serviços/Recursos em uso', label: 'Serviços/Recursos em uso' },
  { value: 'IAM', label: 'IAM' },
  { value: 'Rede', label: 'Rede' },
  { value: 'Segurança/Compliance', label: 'Segurança/Compliance' },
  { value: 'Custos/Quotas', label: 'Custos/Quotas' },
  { value: 'Inventário geral', label: 'Inventário geral' },
  { value: 'Outro', label: 'Outro' },
];
const awsInfoScopeOptions: SelectOption[] = [
  { value: 'Uma conta', label: 'Uma conta' },
  { value: 'Múltiplas contas', label: 'Múltiplas contas' },
  { value: 'OU inteira', label: 'OU inteira' },
  { value: 'Organização inteira', label: 'Organização inteira' },
];
const awsInfoEnvironmentOptions: SelectOption[] = [
  { value: 'DEV', label: 'DEV' },
  { value: 'HML', label: 'HML' },
  { value: 'PRD', label: 'PRD' },
  { value: 'Sandbox', label: 'Sandbox' },
  { value: 'Todos', label: 'Todos' },
];
const awsInfoRegionOptions: SelectOption[] = [
  { value: 'sa-east-1', label: 'sa-east-1' },
  { value: 'us-east-1', label: 'us-east-1' },
  { value: 'Todas', label: 'Todas' },
  { value: 'Outra', label: 'Outra' },
];
const awsInfoObjectOptions: SelectOption[] = [
  { value: 'Contas', label: 'Contas' },
  { value: 'Usuários IAM', label: 'Usuários IAM' },
  { value: 'Roles', label: 'Roles' },
  { value: 'Policies', label: 'Policies' },
  { value: 'Groups', label: 'Groups' },
  { value: 'Access Keys', label: 'Access Keys' },
  { value: 'Serviços habilitados', label: 'Serviços habilitados' },
  { value: 'Recursos provisionados', label: 'Recursos provisionados' },
  { value: 'Tags', label: 'Tags' },
  { value: 'VPCs', label: 'VPCs' },
  { value: 'Buckets S3', label: 'Buckets S3' },
  { value: 'Instâncias EC2', label: 'Instâncias EC2' },
  { value: 'Bancos de dados', label: 'Bancos de dados' },
  { value: 'Logs', label: 'Logs' },
  { value: 'Contatos da conta', label: 'Contatos da conta' },
  { value: 'Quotas', label: 'Quotas' },
  { value: 'Outro', label: 'Outro' },
];
const awsInfoDesiredTypeOptions: SelectOption[] = [
  { value: 'Existência', label: 'Existência' },
  { value: 'Inventário completo', label: 'Inventário completo' },
  { value: 'Configuração atual', label: 'Configuração atual' },
  { value: 'Histórico de mudanças', label: 'Histórico de mudanças' },
  { value: 'Último uso', label: 'Último uso' },
  { value: 'Permissões', label: 'Permissões' },
  { value: 'Relacionamentos / dependências', label: 'Relacionamentos / dependências' },
  { value: 'Tags', label: 'Tags' },
  { value: 'Status', label: 'Status' },
  { value: 'Contatos da conta', label: 'Contatos da conta' },
  { value: 'Outro', label: 'Outro' },
];
const awsInfoServiceOptions: SelectOption[] = [
  { value: 'EC2', label: 'EC2' },
  { value: 'S3', label: 'S3' },
  { value: 'IAM', label: 'IAM' },
  { value: 'RDS', label: 'RDS' },
  { value: 'Lambda', label: 'Lambda' },
  { value: 'EKS', label: 'EKS' },
  { value: 'CloudTrail', label: 'CloudTrail' },
  { value: 'Config', label: 'Config' },
  { value: 'Outro', label: 'Outro' },
];
const awsInfoReferencePeriodOptions: SelectOption[] = [
  { value: 'Últimos 7 dias', label: 'Últimos 7 dias' },
  { value: 'Últimos 30 dias', label: 'Últimos 30 dias' },
  { value: 'Últimos 90 dias', label: 'Últimos 90 dias' },
  { value: 'Período customizado', label: 'Período customizado' },
  { value: 'Não se aplica', label: 'Não se aplica' },
];
const awsInfoOutputFormatOptions: SelectOption[] = [
  { value: 'Texto no chamado', label: 'Texto no chamado' },
  { value: 'Tabela resumida', label: 'Tabela resumida' },
  { value: 'CSV/XLSX', label: 'CSV/XLSX' },
  { value: 'Relatório técnico', label: 'Relatório técnico' },
  { value: 'Relatório executivo', label: 'Relatório executivo' },
  { value: 'Evidências em anexo', label: 'Evidências em anexo' },
];
const awsInfoDetailLevelOptions: SelectOption[] = [
  { value: 'Baixo', label: 'Baixo' },
  { value: 'Médio', label: 'Médio' },
  { value: 'Alto', label: 'Alto' },
];
const awsInfoUrgencyOptions: SelectOption[] = [
  { value: 'Baixa', label: 'Baixa' },
  { value: 'Média', label: 'Média' },
  { value: 'Alta', label: 'Alta' },
  { value: 'Crítica', label: 'Crítica' },
];

function isRoleEnvironment(value: string): value is RoleEnvironment {
  return roleEnvironmentOrder.includes(value as RoleEnvironment);
}

function normalizeMatchText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function dedupeHelpLinks(links: HelpLink[]) {
  return links.filter(
    (link, index, list) => list.findIndex((candidate) => candidate.url === link.url) === index,
  );
}

function isRoleUpdatePolicyAction(actionType: RoleUpdateActionType) {
  return actionType === 'add-policy' || actionType === 'remove-policy';
}

function getRoleUpdateActionDefinition(actionType: RoleUpdateActionType) {
  return roleUpdateActionCatalog.find((item) => item.value === actionType);
}

function getGroupUpdateActionDefinition(actionType: GroupUpdateActionType) {
  return groupUpdateActionCatalog.find((item) => item.value === actionType);
}

function getUserUpdateActionDefinition(actionType: UserUpdateActionType) {
  return userUpdateActionCatalog.find((item) => item.value === actionType);
}

function getPsetUpdateActionDefinition(actionType: PsetUpdateActionType) {
  return psetUpdateActionCatalog.find((item) => item.value === actionType);
}

function getAwsInfoObjectHintsBySurveyType(surveyType: string) {
  const normalized = normalizeMatchText(surveyType);

  if (normalized === 'iam') {
    return ['Usuarios IAM', 'Roles', 'Policies', 'Groups', 'Access Keys'];
  }
  if (normalized === 'servicos/recursos em uso') {
    return ['Servicos habilitados', 'Recursos provisionados', 'Tags', 'Status'];
  }
  if (normalized === 'conta aws') {
    return ['Contas', 'Contatos da conta', 'Tags'];
  }
  if (normalized === 'custos/quotas') {
    return ['Quotas', 'Servicos habilitados'];
  }

  return [];
}

function getAwsInfoDesiredTypeHintsBySurveyType(surveyType: string) {
  const normalized = normalizeMatchText(surveyType);

  if (normalized === 'iam') {
    return ['Permissoes', 'Ultimo uso', 'Relacionamentos / dependencias'];
  }
  if (normalized === 'servicos/recursos em uso') {
    return ['Inventario completo', 'Configuracao atual', 'Status', 'Tags'];
  }
  if (normalized === 'conta aws') {
    return ['Existencia', 'Configuracao atual', 'Contatos da conta'];
  }
  if (normalized === 'custos/quotas') {
    return ['Status', 'Inventario completo', 'Configuracao atual'];
  }

  return [];
}

function getHelpExampleByLabel(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes('nome da conta aws') || normalized.includes('nome da conta')) {
    return 'Ex: AWS_AC_PAYMENT_GATEWAY_PRD';
  }
  if (normalized.includes('descricao / finalidade da conta') || normalized.includes('descrição / finalidade da conta')) {
    return 'Ex: Conta dedicada para workloads do gateway de pagamentos com isolamento de custos e segurança.';
  }
  if (normalized.includes('tipo de conta')) {
    return 'Ex: Aplicação';
  }
  if (normalized === 'ambiente') {
    return 'Ex: PRD';
  }
  if (normalized.includes('responsavel de negocio') || normalized.includes('responsável de negócio')) {
    return 'Ex: Maria Souza';
  }
  if (normalized.includes('e-mail do responsavel principal') || normalized.includes('e-mail do responsável principal')) {
    return 'Ex: maria.souza@empresa.com';
  }
  if (normalized.includes('responsavel tecnico') || normalized.includes('responsável técnico')) {
    return 'Ex: Carlos Lima';
  }
  if (normalized.includes('gestor aprovador')) {
    return 'Ex: Ana Ribeiro';
  }
  if (normalized.includes('centro de custo')) {
    return 'Ex: CC-10457';
  }
  if (normalized.includes('unidade de negocio') || normalized.includes('unidade de negócio')) {
    return 'Ex: Pagamentos';
  }
  if (normalized.includes('justificativa da criacao') || normalized.includes('justificativa da criação')) {
    return 'Ex: Criacao da conta para isolar risco operacional e separar custos do produto conforme governanca.';
  }
  if (normalized.includes('titulo da solicitacao')) {
    return 'Ex: Levantamento IAM em contas produtivas para revisao de menor privilegio';
  }
  if (normalized.includes('descricao do levantamento') || normalized.includes('descrição do levantamento')) {
    return 'Ex: Dump de roles, policies e recursos em todas as contas + detalhe de um recurso especifico.';
  }
  if (normalized.includes('justificativa do levantamento')) {
    return 'Ex: Necessario mapear acessos e ultimo uso para apoiar auditoria interna e plano de remediacao.';
  }
  if (normalized.includes('tipo de levantamento')) {
    return 'Ex: IAM';
  }
  if (normalized === 'escopo') {
    return 'Ex: Uma conta';
  }
  if (normalized.includes('conta aws alvo')) {
    return 'Ex: 123456789012 (prd-payment-gateway)';
  }
  if (normalized.includes('ou alvo')) {
    return 'Ex: OU=Plataforma';
  }
  if (normalized.includes('regiao aws')) {
    return 'Ex: sa-east-1';
  }
  if (normalized.includes('objeto do levantamento')) {
    return 'Ex: Usuarios IAM, Roles, Policies';
  }
  if (normalized.includes('tipo de informacao desejada')) {
    return 'Ex: Permissoes e Ultimo uso';
  }
  if (normalized.includes('nome do recurso')) {
    return 'Ex: bucket-logs-aplicacao-prd';
  }
  if (normalized === 'id') {
    return 'Ex: i-0abc123def4567890';
  }
  if (normalized === 'arn') {
    return 'Ex: arn:aws:s3:::bucket-logs-aplicacao-prd';
  }
  if (normalized.includes('tag chave')) {
    return 'Ex: owner';
  }
  if (normalized.includes('tag valor')) {
    return 'Ex: time-seguranca';
  }
  if (normalized.includes('nome do usuario / role / policy')) {
    return 'Ex: AWS_RL_APP_READONLY_PRD';
  }
  if (normalized.includes('servico aws')) {
    return 'Ex: IAM';
  }
  if (normalized.includes('periodo de referencia')) {
    return 'Ex: Ultimos 90 dias';
  }
  if (normalized.includes('formato de saida')) {
    return 'Ex: CSV/XLSX';
  }
  if (normalized.includes('nivel de detalhamento')) {
    return 'Ex: Alto';
  }
  if (normalized.includes('urgencia')) {
    return 'Ex: Media';
  }
  if (normalized.includes('conta aws')) {
    return 'Ex: 123456789012 (prd-payment-gateway) - Ambiente: PRD';
  }
  if (normalized.includes('usuário iam') || normalized.includes('usuario iam')) {
    return 'Ex: usuario-legado-integracao ou arn:aws:iam::123456789012:user/usuario-legado';
  }
  if (normalized.includes('grupo iam')) {
    return 'Ex: grupo-legado-suporte ou arn:aws:iam::123456789012:group/grupo-legado';
  }
  if (normalized.includes('policies do pset')) {
    return 'Ex: ReadOnlyAccess, CloudWatchReadOnlyAccess';
  }
  if (normalized.includes('nome do pset')) {
    return 'Ex: AWS_PS_FINOPS_READONLY_PRD';
  }
  if (normalized.includes('pset')) {
    return 'Ex: AWS_PS_FINOPS_READONLY_PRD ou arn:aws:sso:::permissionSet/...';
  }
  if (normalized.includes('nome da role')) {
    return 'Ex: AWS_RL_APP_READONLY_PRD';
  }
  if (normalized.includes('role alvo')) {
    return 'Ex: legacy-lambda-integration-role ou arn:aws:iam::123456789012:role/legacy-role';
  }
  if (normalized.includes('trusted entity')) {
    return 'Ex: AWS Service + lambda.amazonaws.com';
  }
  if (normalized.includes('principal(is)')) {
    return 'Ex: lambda.amazonaws.com ou arn:aws:iam::123456789012:root';
  }
  if (normalized.includes('permissoes iniciais do grupo iam')) {
    return 'Ex: Realizar attach de policies existentes';
  }
  if (normalized.includes('acoes da alteracao do grupo iam')) {
    return 'Ex: Adicionar policy + Remover usuario';
  }
  if (normalized.includes('acoes da alteracao do usuario iam')) {
    return 'Ex: Adicionar policy + Remover grupo + Rotacionar key';
  }
  if (normalized.includes('acoes da alteracao do pset')) {
    return 'Ex: Adicionar policy + Remover conta';
  }
  if (normalized.includes('permissoes iniciais do usuario iam')) {
    return 'Ex: Incluir em grupo IAM existente e attach de policies existentes';
  }
  if (normalized.includes('grupos iam existentes para inclusao')) {
    return 'Ex: IAM-Backup-Operators';
  }
  if (normalized.includes('policy') && normalized.includes('taxonomia')) {
    return 'Ex: AWS_PL_BLOCK_DELETE_CLOUDTRAIL_PRD';
  }
  if (normalized.includes('policy alvo')) {
    return 'Ex: arn:aws:iam::123456789012:policy/minha-policy';
  }
  if (normalized.includes('actions necess')) {
    return 'Ex: s3:GetObject, s3:PutObject, s3:ListBucket';
  }
  if (normalized.includes('resources')) {
    return 'Ex: bucket-logs-aplicacao-prd (nome exato) ou arn:aws:s3:::bucket-logs-aplicacao-prd/*';
  }
  if (normalized.includes('conditions')) {
    return 'Ex: StringEquals aws:SourceVpce=vpce-0123456789abcdef0';
  }
  if (normalized.includes('json da policy')) {
    return 'Ex: {"Version":"2012-10-17","Statement":[...]}';
  }
  if (normalized.includes('justificativa')) {
    return 'Ex: Necessidade de ajuste para atender requisito de auditoria e princípio de menor privilégio.';
  }
  if (normalized.includes('upload de anexos')) {
    return 'Ex: evidencias_operacao.pdf, trust-policy.json';
  }

  return undefined;
}

function getAwsDocsByLabel(label: string): HelpLink[] {
  const normalized = label.toLowerCase();
  const links: HelpLink[] = [];

  if (normalized.includes('conta aws') || normalized.includes('nome da conta')) {
    links.push({
      label: 'AWS Organizations - Criar conta',
      url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_create.html',
    });
  }

  if (normalized.includes('role') || normalized.includes('trusted entity') || normalized.includes('principal(is)')) {
    links.push(
      {
        label: 'IAM Roles',
        url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html',
      },
      {
        label: 'Trust policy de role',
        url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_update-role-trust-policy.html',
      },
    );
  }

  if (normalized.includes('policy')) {
    links.push(
      {
        label: 'IAM Policies',
        url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html',
      },
      {
        label: 'JSON policy elements',
        url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html',
      },
    );
  }

  if (normalized.includes('actions necess') || normalized.includes('resources') || normalized.includes('conditions')) {
    links.push(
      {
        label: 'IAM JSON policy elements: Action',
        url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_action.html',
      },
      {
        label: 'IAM JSON policy elements: Resource',
        url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_resource.html',
      },
      {
        label: 'IAM JSON policy elements: Condition',
        url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html',
      },
    );
  }

  if (normalized.includes('usuário iam') || normalized.includes('usuario iam')) {
    links.push({
      label: 'IAM Users',
      url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html',
    });
  }

  if (normalized.includes('grupo iam')) {
    links.push({
      label: 'IAM User groups',
      url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html',
    });
  }

  if (normalized.includes('pset')) {
    links.push({
      label: 'IAM Identity Center - Permission sets',
      url: 'https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsetsconcept.html',
    });
  }

  if (
    normalized.includes('access key')
    || normalized.includes('rotacionar key')
    || normalized.includes('rotacionar chave')
  ) {
    links.push({
      label: 'IAM access keys',
      url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html',
    });
  }

  return links;
}

function getContextualHelpByLabel(label: string, scope: TooltipScope | null) {
  if (!scope) return undefined;

  const normalizedLabel = normalizeMatchText(label);
  const { categoryId, action } = scope;

  if (normalizedLabel === 'tipo de acesso' && categoryId === 'aws-emergency') {
    return {
      text: 'Selecione o nivel de privilegio emergencial minimo necessario para resposta ao incidente ativo.',
      example: 'Administrador restrito por 1 hora durante o incidente INC-2026-0042.',
    };
  }

  if (normalizedLabel === 'conta aws') {
    if (categoryId === 'aws-roles') {
      return {
        text: 'Selecione a conta AWS onde a role sera criada/alterada/removida neste chamado. O ambiente vem da conta.',
        example: '123456789012 (prd-payment-gateway) - Ambiente: PRD',
        docs: getAwsDocsByLabel('conta aws'),
      };
    }

    if (categoryId === 'aws-policies') {
      return {
        text: 'Selecione a conta AWS alvo onde a policy sera criada, alterada ou removida neste chamado.',
        example: '123456789012 (hml-payment-gateway) - Ambiente: HML',
        docs: getAwsDocsByLabel('conta aws'),
      };
    }
  }

  if (categoryId === 'aws-accounts' && action === 'create') {
    if (normalizedLabel === 'nome da conta aws') {
      return {
        text: 'Informe o nome final da conta AWS seguindo o padrao corporativo.',
        example: 'AWS_AC_PAYMENT_GATEWAY_PRD',
        docs: getAwsDocsByLabel('nome da conta'),
      };
    }

    if (normalizedLabel === 'descricao / finalidade da conta' || normalizedLabel === 'descrição / finalidade da conta') {
      return {
        text: 'Descreva de forma objetiva o objetivo da conta, workloads esperados e fronteira de responsabilidade.',
        example: 'Conta dedicada ao produto de pagamentos para workload transacional e isolamento de custos.',
      };
    }

    if (normalizedLabel === 'tipo de conta') {
      return {
        text: 'Selecione o tipo mais aderente ao uso principal da conta.',
        example: 'Aplicação.',
      };
    }

    if (normalizedLabel === 'ambiente') {
      return {
        text: 'Selecione o ambiente operacional da conta para direcionar controles e governanca.',
        example: 'PRD.',
      };
    }
  }

  if (categoryId === 'aws-information' && action === 'create') {
    if (normalizedLabel === 'descricao do levantamento' || normalizedLabel === 'descrição do levantamento') {
      return {
        text: 'Descreva com clareza o que deve ser levantado em AWS, podendo ser um dump amplo ou consulta de item especifico.',
        example: 'Levantar roles, policies e inventario de recursos em todas as contas e detalhar o bucket bucket-logs-aplicacao-prd.',
      };
    }
  }

  if (categoryId === 'aws-policies' && action === 'create') {
    if (normalizedLabel === 'actions necessarias') {
      return {
        text: 'Informe as acoes IAM necessarias para a policy managed. Liste cada acao de forma objetiva.',
        example: 's3:GetObject, s3:PutObject, s3:ListBucket',
        docs: getAwsDocsByLabel('actions necessarias'),
      };
    }

    if (normalizedLabel.startsWith('resources')) {
      return {
        text: 'Informe o nome exato do recurso AWS (nao descricao em texto livre). Se preferir, voce pode informar ARN.',
        example: 'bucket-logs-aplicacao-prd (nome exato) ou arn:aws:s3:::bucket-logs-aplicacao-prd/*',
        docs: getAwsDocsByLabel('resources'),
      };
    }

    if (normalizedLabel === 'conditions (opcional)') {
      return {
        text: 'Opcionalmente informe condicoes para restringir a policy (context keys IAM).',
        example: 'StringEquals aws:SourceVpce=vpce-0123456789abcdef0',
        docs: getAwsDocsByLabel('conditions'),
      };
    }
  }

  if (normalizedLabel === 'justificativa' || normalizedLabel === 'justificativa da criacao' || normalizedLabel === 'justificativa da criação') {
    if (categoryId === 'aws-roles') {
      if (action === 'delete') {
        return {
          text: 'Justifique a remocao da role alvo, confirme ausencia de dependencias ativas e descreva impacto/rollback.',
          example: 'Role legada sem uso ha 90 dias; validado sem consumidores ativos e rollback previsto via role substituta.',
        };
      }

      if (action === 'update') {
        return {
          text: 'Descreva por que a role precisa ser alterada, qual risco esta sendo tratado e impacto esperado.',
          example: 'Ajuste de trust para novo servico e remocao de permissoes excessivas identificadas em auditoria.',
        };
      }

      return {
        text: 'Descreva o objetivo da role, workload atendido e como o pedido respeita menor privilegio.',
        example: 'Role para Lambda de faturamento com acesso apenas de leitura ao bucket de extratos.',
      };
    }

    if (categoryId === 'aws-policies') {
      return {
        text: 'Explique qual controle de seguranca ou necessidade tecnica esta sendo atendida por esta policy.',
        example: 'Adicionar deny para DeleteTrail em producao para atender requisito de auditoria.',
      };
    }

    if (categoryId === 'aws-accounts') {
      return {
        text: 'Descreva o motivo de negocio/tecnico da conta e o impacto esperado da solicitacao.',
        example: 'Nova conta para isolar workload PCI e separar custos do produto de pagamentos.',
      };
    }
  }

  if (normalizedLabel === 'justificativa do levantamento' && categoryId === 'aws-information') {
    return {
      text: 'Explique por que o levantamento e necessario, qual decisao ele suporta e qual resultado esperado.',
      example: 'Mapear permissoes e ultimo uso para apoiar plano de remediacao de acessos privilegiados.',
    };
  }

  if (normalizedLabel === 'justificativa emergencial') {
    return {
      text: 'Detalhe incidente, impacto atual e porque o acesso emergencial e indispensavel neste chamado.',
      example: 'INC-2026-0042 com indisponibilidade em producao; acesso emergencial para restaurar pipeline critico.',
    };
  }

  if (normalizedLabel.startsWith('alteracoes solicitadas')) {
    if (categoryId === 'aws-roles') {
      return {
        text: 'Descreva exatamente quais mudancas devem ocorrer na role alvo e o resultado esperado apos a execucao.',
        example: 'Adicionar policy SecurityAudit e incluir events.amazonaws.com no trust.',
        docs: dedupeHelpLinks([...getAwsDocsByLabel('role'), ...getAwsDocsByLabel('policy')]),
      };
    }

    if (categoryId === 'aws-policies') {
      return {
        text: 'Descreva os statements que devem ser adicionados/removidos e o impacto esperado.',
        example: 'Remover Allow * em s3:* e adicionar condicoes por prefixo de bucket.',
        docs: getAwsDocsByLabel('policy'),
      };
    }

    if (categoryId === 'aws-iam-users' || categoryId === 'aws-iam-groups' || categoryId === 'aws-psets') {
      return {
        text: 'Descreva mudancas objetivas no recurso alvo: incluir/remover permissao, vinculo ou grupo.',
        example: 'Remover PowerUserAccess e manter apenas ReadOnlyAccess.',
      };
    }
  }

  if (normalizedLabel === 'trusted entity' && categoryId === 'aws-roles') {
    return {
      text: 'Escolha o tipo de entidade que podera assumir a role neste chamado para guiar o formato do principal.',
      example: 'AWS Service para uso por Lambda ou ECS.',
      docs: getAwsDocsByLabel('trusted entity'),
    };
  }

  if (normalizedLabel.includes('principal(is)') && categoryId === 'aws-roles') {
    return {
      text: 'Informe um ou mais principals permitidos no trust da role, coerentes com o Trusted Entity selecionado.',
      example: 'lambda.amazonaws.com e arn:aws:iam::123456789012:root',
      docs: getAwsDocsByLabel('principal(is)'),
    };
  }

  if (normalizedLabel === 'permissoes iniciais da role' && categoryId === 'aws-roles') {
    return {
      text: 'Defina se a role sera criada sem permissoes ou com attach de policies existentes neste chamado.',
      example: 'Realizar attach de policies existentes.',
      docs: getAwsDocsByLabel('policy'),
    };
  }

  if (normalizedLabel === 'permissoes iniciais do usuario iam' && categoryId === 'aws-iam-users') {
    return {
      text: 'Defina se o usuario sera criado sem permissao inicial ou com vinculacoes em grupos/policies existentes.',
      example: 'Incluir em grupo IAM existente e attach de policies existentes.',
      docs: dedupeHelpLinks([...getAwsDocsByLabel('usuario iam'), ...getAwsDocsByLabel('grupo iam'), ...getAwsDocsByLabel('policy')]),
    };
  }

  if (normalizedLabel === 'permissoes iniciais do grupo iam' && categoryId === 'aws-iam-groups') {
    return {
      text: 'Defina se o grupo sera criado sem permissao inicial ou com attach de policies existentes.',
      example: 'Realizar attach de policies existentes.',
      docs: dedupeHelpLinks([...getAwsDocsByLabel('grupo iam'), ...getAwsDocsByLabel('policy')]),
    };
  }

  if (normalizedLabel === 'policies do pset' && categoryId === 'aws-psets' && action === 'create') {
    return {
      text: 'Informe uma ou mais policies para vinculo no PSET. Adicione uma policy por linha/campo para facilitar a execucao.',
      example: 'ReadOnlyAccess e CloudWatchReadOnlyAccess.',
      docs: dedupeHelpLinks([...getAwsDocsByLabel('pset'), ...getAwsDocsByLabel('policy')]),
    };
  }

  if (normalizedLabel === 'nome do pset' && categoryId === 'aws-psets') {
    if (action === 'create') {
      return {
        text: 'No create, informe a parte variavel do nome para montar o padrao AWS_PS_<NOME_DO_PSET>_<AMBIENTE>.',
        example: 'AWS_PS_FINOPS_READONLY_PRD',
        docs: getAwsDocsByLabel('pset'),
      };
    }

    return {
      text: 'Em alteracao/remocao, informe o nome existente do PSET ou ARN do recurso alvo.',
      example: 'pset-legado-readonly ou arn:aws:sso:::permissionSet/ssoins-1234567890abcdef/ps-1234567890abcdef',
      docs: getAwsDocsByLabel('pset'),
    };
  }

  if (normalizedLabel === 'grupos iam existentes para inclusao' && categoryId === 'aws-iam-users') {
    return {
      text: 'Selecione um ou mais grupos IAM existentes para incluir o usuario apos a criacao.',
      example: 'IAM-Backup-Operators',
      docs: getAwsDocsByLabel('grupo iam'),
    };
  }

  if (normalizedLabel === 'policies existentes para attach' && (categoryId === 'aws-roles' || categoryId === 'aws-iam-users' || categoryId === 'aws-iam-groups')) {
    return {
      text: categoryId === 'aws-roles'
        ? 'Informe nome ou ARN das policies existentes que devem ser anexadas no momento da criacao da role.'
        : categoryId === 'aws-iam-groups'
          ? 'Informe nome ou ARN das policies existentes que devem ser anexadas ao grupo no momento da criacao.'
        : 'Informe nome ou ARN das policies existentes que devem ser anexadas no momento da criacao do usuario IAM.',
      example: 'arn:aws:iam::aws:policy/ReadOnlyAccess',
      docs: getAwsDocsByLabel('policy'),
    };
  }

  if (normalizedLabel === 'acoes da alteracao da role' && categoryId === 'aws-roles' && action === 'update') {
    return {
      text: 'Selecione ao menos uma acao de alteracao para a role alvo. Para cada acao, detalhe exatamente o que deve ser executado.',
      example: 'Adicionar policy + Alterar Trusted Entity.',
      docs: dedupeHelpLinks([...getAwsDocsByLabel('role'), ...getAwsDocsByLabel('policy')]),
    };
  }

  if (normalizedLabel === 'acoes da alteracao do grupo iam' && categoryId === 'aws-iam-groups' && action === 'update') {
    return {
      text: 'Selecione ao menos uma acao de alteracao do grupo IAM. Para cada acao, informe usuarios/policies de forma objetiva.',
      example: 'Adicionar policy + Remover usuario.',
      docs: dedupeHelpLinks([...getAwsDocsByLabel('grupo iam'), ...getAwsDocsByLabel('policy'), ...getAwsDocsByLabel('usuario iam')]),
    };
  }

  if (normalizedLabel === 'acoes da alteracao do usuario iam' && categoryId === 'aws-iam-users' && action === 'update') {
    return {
      text: 'Selecione ao menos uma acao de alteracao do usuario IAM e detalhe os itens de execucao. Em rotacao de key, a key atual e desativada e excluida apos 7 dias sem pedido de reativacao.',
      example: 'Adicionar policy + Remover grupo + Rotacionar key.',
      docs: dedupeHelpLinks([
        ...getAwsDocsByLabel('usuario iam'),
        ...getAwsDocsByLabel('grupo iam'),
        ...getAwsDocsByLabel('policy'),
        ...getAwsDocsByLabel('access key'),
      ]),
    };
  }

  if (normalizedLabel === 'acoes da alteracao do pset' && categoryId === 'aws-psets' && action === 'update') {
    return {
      text: 'Selecione ao menos uma acao de alteracao do PSET. Para cada acao, informe policies ou contas AWS de forma objetiva.',
      example: 'Adicionar policy + Remover conta.',
      docs: dedupeHelpLinks([...getAwsDocsByLabel('pset'), ...getAwsDocsByLabel('policy'), ...getAwsDocsByLabel('conta aws')]),
    };
  }

  if (normalizedLabel === 'upload de anexos (opcional)') {
    if (categoryId === 'aws-roles') {
      return {
        text: 'Anexe evidencias e artefatos tecnicos da role (ex.: trust policy, policies customizadas, diagramas).',
        example: action === 'create' ? 'trust-policy.json, permission-policy.json' : 'diff-role-change.json, evidencia-validacao.pdf',
      };
    }

    if (categoryId === 'aws-policies') {
      return {
        text: 'Anexe JSON atual/proposto da policy, diff da alteracao e evidencias tecnicas de validacao.',
        example: action === 'delete' ? 'plano-reversao.pdf, entidades-impactadas.csv' : 'policy-before.json, policy-after.json',
      };
    }

    if (categoryId === 'aws-audit') {
      return {
        text: 'Anexe evidencias de auditoria, escopo detalhado e artefatos que sustentem o parecer.',
        example: 'inventario-recursos.csv, relatorio-auditoria.pdf',
      };
    }

    if (categoryId === 'aws-emergency') {
      return {
        text: 'Anexe evidencias do incidente e da execucao emergencial para trilha de auditoria.',
        example: 'timeline-incidente.pdf, cloudtrail-events.json',
      };
    }
  }

  return undefined;
}

function FormField({
  label,
  required,
  help,
  children,
}: {
  label: string;
  required?: boolean;
  help?: HelpContent;
  children: React.ReactNode;
}) {
  const tooltipScope = useContext(TooltipScopeContext);
  const inferredExample = getHelpExampleByLabel(label);
  const inferredDocs = getAwsDocsByLabel(label);
  const contextualHelp = getContextualHelpByLabel(label, tooltipScope);
  const helpObject = typeof help === 'string' ? { text: help } : help;
  const requestTypeContext = tooltipScope?.requestTypeName
    ? ` para o chamado "${tooltipScope.requestTypeName}"`
    : '';
  const tooltipText =
    helpObject?.text ||
    contextualHelp?.text ||
    `${required ? 'Campo obrigatorio.' : 'Campo opcional.'} Preencha somente o necessario${requestTypeContext}.`;
  const tooltipExample = helpObject?.example || contextualHelp?.example || inferredExample;
  const tooltipDocs = dedupeHelpLinks([
    ...(helpObject?.docs || []),
    ...(contextualHelp?.docs || []),
    ...inferredDocs,
  ]);

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
        <span className="group relative inline-flex">
          <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 w-80 pb-2 invisible opacity-0 pointer-events-none transition-opacity group-hover:visible group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100 group-focus-within:pointer-events-auto z-50">
            <span className="block rounded-md bg-foreground px-3 py-2 text-xs text-primary-foreground shadow-lg">
              <span className="block whitespace-normal text-left">{tooltipText}</span>
              {tooltipExample && (
                <span className="mt-2 block whitespace-normal text-left">
                  <span className="font-semibold">Exemplo:</span> {tooltipExample}
                </span>
              )}
              {tooltipDocs.length > 0 && (
                <span className="mt-2 block text-left space-y-1">
                  <span className="font-semibold">Documentação AWS:</span>
                  {tooltipDocs.map((doc) => (
                    <a
                      key={doc.url}
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block underline hover:opacity-90"
                    >
                      {doc.label}
                    </a>
                  ))}
                </span>
              )}
            </span>
          </span>
        </span>
      </label>
      {children}
    </div>
  );
}

function InputField({
  placeholder,
  type = 'text',
  value,
  onChange,
  readOnly,
  required,
}: {
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  required?: boolean;
}) {
  if (value !== undefined && onChange) {
    return (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        readOnly={readOnly}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className={`input-field w-full ${readOnly ? 'bg-muted/40 text-muted-foreground' : ''}`}
      />
    );
  }

  return (
    <input
      type={type}
      placeholder={placeholder}
      defaultValue={value}
      readOnly={readOnly}
      required={required}
      className={`input-field w-full ${readOnly ? 'bg-muted/40 text-muted-foreground' : ''}`}
    />
  );
}

function TaxonomySegmentField({
  prefix,
  suffix,
  placeholder,
  required,
  value,
  onChange,
  previewLabel,
  previewItems,
  previewEmptyText,
  hidePreview,
}: {
  prefix: string;
  suffix?: string;
  placeholder: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  previewLabel?: string;
  previewItems?: string[];
  previewEmptyText?: string;
  hidePreview?: boolean;
}) {
  const [internalSegment, setInternalSegment] = useState('');
  const segment = value !== undefined ? value : internalSegment;
  const setSegment = (nextValue: string) => {
    if (onChange) {
      onChange(nextValue);
      return;
    }

    setInternalSegment(nextValue);
  };
  const previewSegment = segment || '<parte-nao-padronizada>';
  const hasPreviewItems = Array.isArray(previewItems);

  return (
    <div className="space-y-2">
      <div className="flex w-full overflow-hidden rounded-lg border border-border bg-background focus-within:ring-2 focus-within:ring-primary/20">
        <span className="px-3 py-2 text-xs md:text-sm font-mono text-muted-foreground bg-muted/40 border-r border-border whitespace-nowrap">
          {prefix}
        </span>
        <input
          type="text"
          value={segment}
          onChange={(event) => setSegment(event.target.value)}
          placeholder={placeholder}
          required={required}
          className="flex-1 min-w-0 px-3 py-2 text-sm bg-transparent outline-none"
        />
        {suffix && (
          <span className="px-3 py-2 text-xs md:text-sm font-mono text-muted-foreground bg-muted/40 border-l border-border whitespace-nowrap">
            {suffix}
          </span>
        )}
      </div>
      {!hidePreview && hasPreviewItems ? (
        <div className="text-xs text-muted-foreground space-y-1">
          <p>{previewLabel || 'Nome padronizado:'}</p>
          {previewItems.length > 0 ? (
            <div className="space-y-1">
              {previewItems.map((previewItem) => (
                <p key={previewItem} className="font-mono text-foreground">- {previewItem}</p>
              ))}
            </div>
          ) : (
            <p>{previewEmptyText || 'Sem itens para exibir.'}</p>
          )}
        </div>
      ) : !hidePreview ? (
        <p className="text-xs text-muted-foreground">
          {previewLabel || 'Nome padronizado:'} <span className="font-mono text-foreground">{`${prefix}${previewSegment}${suffix || ''}`}</span>
        </p>
      ) : null}
    </div>
  );
}

function SelectField({
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  required,
}: {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  if (value !== undefined && onChange) {
    return (
      <select className="input-field w-full" value={value} onChange={(e) => onChange(e.target.value)} required={required}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <select className="input-field w-full" required={required}>
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function TextArea({ placeholder, rows = 3, required }: { placeholder?: string; rows?: number; required?: boolean }) {
  return <textarea placeholder={placeholder} rows={rows} required={required} className="input-field w-full resize-none" />;
}

function TextAreaField({
  placeholder,
  rows = 3,
  value,
  onChange,
  required,
}: {
  placeholder?: string;
  rows?: number;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}) {
  if (value !== undefined && onChange) {
    return (
      <textarea
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="input-field w-full resize-none"
      />
    );
  }

  return <TextArea placeholder={placeholder} rows={rows} required={required} />;
}

function getRequestAction(requestTypeId?: string): ActionType {
  if (!requestTypeId) return 'unknown';
  if (requestTypeId.includes('create')) return 'create';
  if (requestTypeId.includes('update') || requestTypeId.includes('alter') || requestTypeId.includes('change')) return 'update';
  if (requestTypeId.includes('delete') || requestTypeId.includes('remove') || requestTypeId.includes('revoke')) return 'delete';
  if (requestTypeId.includes('close')) return 'close';
  return 'unknown';
}

function toOptions(values: string[]): SelectOption[] {
  return values.map((value) => ({ value, label: value }));
}

function environmentToToken(environment?: string) {
  const normalized = (environment || '').trim().toLowerCase();
  if (normalized.startsWith('prod') || normalized.startsWith('prd')) return 'prd';
  if (normalized.startsWith('homo') || normalized.startsWith('hml')) return 'hml';
  if (normalized.startsWith('des') || normalized.startsWith('dev')) return 'dev';
  return 'env';
}

function environmentToProfileGroupSuffix(environment?: string) {
  const normalized = (environment || '').trim().toLowerCase();
  if (normalized.startsWith('prod') || normalized.startsWith('prd')) return 'PRD';
  if (normalized.startsWith('homo') || normalized.startsWith('hml')) return 'HML';
  if (normalized.startsWith('des') || normalized.startsWith('dev')) return 'DEV';
  return 'ENV';
}

function validateRoleAccountScope(accounts: (typeof awsAccounts)[number][]) {
  if (accounts.length === 0) return null;

  if (accounts.length !== 1) {
    return 'Para Role AWS, selecione exatamente uma conta/ambiente por solicitacao.';
  }

  return null;
}

function getTrustedPrincipalConfig(trustedEntity: string) {
  switch (trustedEntity) {
    case 'AWS Service':
      return {
        placeholder: 'Ex: lambda.amazonaws.com',
        example: 'lambda.amazonaws.com',
        help: 'Informe um ou mais serviços AWS que poderão assumir a role.',
      };
    case 'AWS Account':
      return {
        placeholder: 'Ex: arn:aws:iam::123456789012:root',
        example: 'arn:aws:iam::123456789012:root',
        help: 'Informe uma ou mais contas/ARNs permitidas no trust policy.',
      };
    case 'Federated':
      return {
        placeholder: 'Ex: arn:aws:iam::123456789012:saml-provider/Okta',
        example: 'arn:aws:iam::123456789012:saml-provider/Okta',
        help: 'Informe um ou mais providers federados permitidos.',
      };
    case 'Web Identity':
      return {
        placeholder: 'Ex: token.actions.githubusercontent.com',
        example: 'token.actions.githubusercontent.com',
        help: 'Informe um ou mais provedores OIDC de web identity.',
      };
    default:
      return {
        placeholder: 'Ex: arn:aws:iam::123456789012:root',
        example: 'arn:aws:iam::123456789012:root',
        help: 'Selecione o tipo de trusted entity para sugerir o formato correto.',
      };
  }
}

export default function NewTicket() {
  const { categoryId, requestTypeId } = useParams();
  const navigate = useNavigate();
  const category = catalog.find((item) => item.id === categoryId);

  const routeRequestType = category?.requestTypes.find((item) => item.id === requestTypeId);
  const [selectedRequestTypeId, setSelectedRequestTypeId] = useState(routeRequestType?.id || '');
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [roleNameSegment, setRoleNameSegment] = useState('');
  const [roleDeleteTargets, setRoleDeleteTargets] = useState<RoleDeleteTarget[]>([{ roleName: '' }]);
  const [accountCreateEnvironment, setAccountCreateEnvironment] = useState('PRD');
  const [roleTrustedEntity, setRoleTrustedEntity] = useState('');
  const [roleTrustedPrincipals, setRoleTrustedPrincipals] = useState<string[]>(['']);
  const [rolePermissionMode, setRolePermissionMode] = useState<RolePermissionMode>('none');
  const [roleAttachedPolicies, setRoleAttachedPolicies] = useState<string[]>(['']);
  const [groupPermissionMode, setGroupPermissionMode] = useState<GroupPermissionMode>('none');
  const [groupAttachedPolicies, setGroupAttachedPolicies] = useState<string[]>(['']);
  const [psetPolicies, setPsetPolicies] = useState<string[]>(['']);
  const [psetUpdatePendingAction, setPsetUpdatePendingAction] = useState<PsetUpdateActionType | ''>('');
  const [psetUpdateActions, setPsetUpdateActions] = useState<PsetUpdateActionItem[]>([]);
  const [psetUpdateValidationError, setPsetUpdateValidationError] = useState('');
  const [iamUserPermissionMode, setIamUserPermissionMode] = useState<IamUserPermissionMode>('none');
  const [iamUserTargetGroups, setIamUserTargetGroups] = useState<string[]>(['']);
  const [iamUserAttachedPolicies, setIamUserAttachedPolicies] = useState<string[]>(['']);
  const [userUpdatePendingAction, setUserUpdatePendingAction] = useState<UserUpdateActionType | ''>('');
  const [userUpdateActions, setUserUpdateActions] = useState<UserUpdateActionItem[]>([]);
  const [userUpdateValidationError, setUserUpdateValidationError] = useState('');
  const [groupUpdatePendingAction, setGroupUpdatePendingAction] = useState<GroupUpdateActionType | ''>('');
  const [groupUpdateActions, setGroupUpdateActions] = useState<GroupUpdateActionItem[]>([]);
  const [groupUpdateValidationError, setGroupUpdateValidationError] = useState('');
  const [roleUpdatePendingAction, setRoleUpdatePendingAction] = useState<RoleUpdateActionType | ''>('');
  const [roleUpdateActions, setRoleUpdateActions] = useState<RoleUpdateActionItem[]>([]);
  const [roleUpdateValidationError, setRoleUpdateValidationError] = useState('');
  const [awsInfoScopeDescription, setAwsInfoScopeDescription] = useState('');
  const [awsInfoRequestedData, setAwsInfoRequestedData] = useState('');
  const [awsInfoFilters, setAwsInfoFilters] = useState('');
  const [awsInfoSurveyType, setAwsInfoSurveyType] = useState('');
  const [awsInfoSurveyTypeOther, setAwsInfoSurveyTypeOther] = useState('');
  const [awsInfoScope, setAwsInfoScope] = useState('');
  const [awsInfoEnvironment, setAwsInfoEnvironment] = useState('');
  const [awsInfoTargetAccounts, setAwsInfoTargetAccounts] = useState<string[]>(['']);
  const [awsInfoOuTarget, setAwsInfoOuTarget] = useState('');
  const [awsInfoRegion, setAwsInfoRegion] = useState('');
  const [awsInfoRegionOther, setAwsInfoRegionOther] = useState('');
  const [awsInfoObjects, setAwsInfoObjects] = useState<string[]>(['']);
  const [awsInfoObjectOther, setAwsInfoObjectOther] = useState('');
  const [awsInfoDesiredTypes, setAwsInfoDesiredTypes] = useState<string[]>(['']);
  const [awsInfoDesiredTypeOther, setAwsInfoDesiredTypeOther] = useState('');
  const [awsInfoFilterResourceName, setAwsInfoFilterResourceName] = useState('');
  const [awsInfoFilterId, setAwsInfoFilterId] = useState('');
  const [awsInfoFilterArn, setAwsInfoFilterArn] = useState('');
  const [awsInfoFilterTagKey, setAwsInfoFilterTagKey] = useState('');
  const [awsInfoFilterTagValue, setAwsInfoFilterTagValue] = useState('');
  const [awsInfoFilterPrincipalName, setAwsInfoFilterPrincipalName] = useState('');
  const [awsInfoFilterService, setAwsInfoFilterService] = useState('');
  const [awsInfoFilterServiceOther, setAwsInfoFilterServiceOther] = useState('');
  const [awsInfoReferencePeriod, setAwsInfoReferencePeriod] = useState('');
  const [awsInfoReferencePeriodCustom, setAwsInfoReferencePeriodCustom] = useState('');
  const [awsInfoOutputFormat, setAwsInfoOutputFormat] = useState('');
  const [awsInfoDetailLevel, setAwsInfoDetailLevel] = useState('');
  const [awsInfoUrgency, setAwsInfoUrgency] = useState('');
  const [awsInfoValidationError, setAwsInfoValidationError] = useState('');
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [accountsValidationError, setAccountsValidationError] = useState('');
  const [justification, setJustification] = useState('');
  const [comments, setComments] = useState('');
  const [justificationEvidenceNames, setJustificationEvidenceNames] = useState<string[]>([]);

  if (!category) return <Layout><p>Categoria não encontrada.</p></Layout>;

  const effectiveRequestType = routeRequestType || category.requestTypes.find((item) => item.id === selectedRequestTypeId);
  const action = getRequestAction(effectiveRequestType?.id);
  const isCreateAction = action === 'create';
  const isUpdateAction = action === 'update';
  const isDeleteAction = action === 'delete' || action === 'close';
  const isAudit = category.type === 'audit';
  const isBreakingGlass = category.type === 'breaking-glass';
  const isRoleCategory = categoryId === 'aws-roles';
  const isAwsInformationCategory = categoryId === 'aws-information';

  const requiresExistingAccount = (category.id !== 'aws-accounts' || !isCreateAction) && !isAwsInformationCategory;
  const selectedAccounts = useMemo(
    () => selectedAccountIds
      .map((accountId) => awsAccounts.find((account) => account.id === accountId))
      .filter((account): account is (typeof awsAccounts)[number] => Boolean(account)),
    [selectedAccountIds],
  );
  const primarySelectedAccount = selectedAccounts[0];
  const selectedRoleEnvironment = (() => {
    const environment = environmentToProfileGroupSuffix(primarySelectedAccount?.env);
    return isRoleEnvironment(environment) ? environment : null;
  })();

  const requestTypeOptions = category.requestTypes.map((item) => ({
    value: item.id,
    label: item.name,
  }));
  const accountOptions = awsAccounts.map((account) => ({
    value: account.id,
    label: `${account.id} (${account.name}) - Ambiente: ${environmentToProfileGroupSuffix(account.env)}`,
  }));
  const accountCreationEnvironmentOptions: SelectOption[] = [
    { value: 'DEV', label: 'DEV' },
    { value: 'HML', label: 'HML' },
    { value: 'PRD', label: 'PRD' },
    { value: 'Sandbox', label: 'Sandbox' },
  ];
  const accountCreationTypeOptions: SelectOption[] = [
    { value: 'Aplicação', label: 'Aplicação' },
    { value: 'Sandbox', label: 'Sandbox' },
    { value: 'Dados', label: 'Dados' },
    { value: 'Segurança', label: 'Segurança' },
    { value: 'Shared Services', label: 'Shared Services' },
  ];
  const accountCreationBusinessUnitOptions: SelectOption[] = toOptions([
    'Pagamentos',
    'Data & Analytics',
    'Infraestrutura',
    'Segurança',
    'Plataforma',
  ]);

  const rolePermissionModeOptions: SelectOption[] = [
    { value: 'none', label: 'Criar sem nenhuma permission policy' },
    { value: 'attach-existing', label: 'Realizar attach de policies existentes' },
  ];
  const groupPermissionModeOptions: SelectOption[] = [
    { value: 'none', label: 'Criar sem permissões iniciais' },
    { value: 'attach-existing', label: 'Realizar attach de policies existentes' },
  ];
  const iamUserPermissionModeOptions: SelectOption[] = [
    { value: 'none', label: 'Criar sem permissões iniciais' },
    { value: 'group-existing', label: 'Incluir em grupo IAM existente' },
    { value: 'attach-existing', label: 'Realizar attach de policies existentes' },
    { value: 'group-and-attach-existing', label: 'Incluir em grupo IAM existente e attach de policies existentes' },
  ];
  const roleUpdateActionOptions = roleUpdateActionCatalog
    .filter((item) => !roleUpdateActions.some((selected) => selected.type === item.value))
    .map((item) => ({ value: item.value, label: item.label }));
  const groupUpdateActionOptions = groupUpdateActionCatalog
    .filter((item) => !groupUpdateActions.some((selected) => selected.type === item.value))
    .map((item) => ({ value: item.value, label: item.label }));
  const userUpdateActionOptions = userUpdateActionCatalog
    .filter((item) => !userUpdateActions.some((selected) => selected.type === item.value))
    .map((item) => ({ value: item.value, label: item.label }));
  const psetUpdateActionOptions = psetUpdateActionCatalog
    .filter((item) => !psetUpdateActions.some((selected) => selected.type === item.value))
    .map((item) => ({ value: item.value, label: item.label }));
  const accountEnvironmentToken = environmentToToken(primarySelectedAccount?.env);
  const profileGroupEnvironmentSuffix = environmentToProfileGroupSuffix(primarySelectedAccount?.env);
  const roleTaxonomySuffix = `_${profileGroupEnvironmentSuffix}`;
  const justificationEvidenceAccept = [
    '.pdf',
    '.png',
    '.jpg',
    '.jpeg',
    '.txt',
    '.csv',
    '.xls',
    '.xlsx',
    '.doc',
    '.docx',
    '.json',
  ].join(',');
  const trustedPrincipalConfig = getTrustedPrincipalConfig(roleTrustedEntity);
  const normalizedRoleAttachedPolicies = roleAttachedPolicies
    .map((policy) => policy.trim())
    .filter((policy) => policy.length > 0);
  const roleNameSegmentForReview = roleNameSegment.trim() || '<NOME_DA_ROLE>';
  const rolesToBeCreated = selectedRoleEnvironment
    ? [{ environment: selectedRoleEnvironment, roleName: `AWS_RL_${roleNameSegmentForReview}_${selectedRoleEnvironment}` }]
    : [];
  const rolesToBeTargeted = roleDeleteTargets
    .map((target) => target.roleName.trim())
    .filter((roleName) => roleName.length > 0);
  const roleTargetActionLabel = isDeleteAction ? 'remoção' : 'alteração';
  const roleTargetActionVerb = isDeleteAction ? 'remover' : 'alterar';
  const normalizedAwsInfoScope = normalizeMatchText(awsInfoScope);
  const normalizedAwsInfoSurveyType = normalizeMatchText(awsInfoSurveyType);
  const awsInfoScopeIsSingleAccount = normalizedAwsInfoScope === normalizeMatchText('Uma conta');
  const awsInfoScopeIsMultipleAccounts = normalizedAwsInfoScope === normalizeMatchText('Multiplas contas');
  const awsInfoScopeIsOu = normalizedAwsInfoScope === normalizeMatchText('OU inteira');
  const awsInfoScopeIsOrganization = normalizedAwsInfoScope === normalizeMatchText('Organizacao inteira');
  const awsInfoRequiresServiceFilter =
    normalizedAwsInfoSurveyType === normalizeMatchText('Servicos/Recursos em uso')
    || normalizedAwsInfoSurveyType === normalizeMatchText('Custos/Quotas');
  const normalizedAwsInfoTargetAccounts = awsInfoTargetAccounts
    .map((account) => account.trim())
    .filter((account) => account.length > 0);
  const normalizedAwsInfoObjects = awsInfoObjects
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
  const normalizedAwsInfoDesiredTypes = awsInfoDesiredTypes
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
  const awsInfoObjectHints = getAwsInfoObjectHintsBySurveyType(awsInfoSurveyType);
  const awsInfoDesiredTypeHints = getAwsInfoDesiredTypeHintsBySurveyType(awsInfoSurveyType);
  const awsInfoScopeSummary = awsInfoScopeIsSingleAccount || awsInfoScopeIsMultipleAccounts
    ? normalizedAwsInfoTargetAccounts.length > 0
      ? normalizedAwsInfoTargetAccounts.join(', ')
      : 'Nao informado'
    : awsInfoScopeIsOu
      ? awsInfoOuTarget.trim() || 'Nao informado'
      : awsInfoScopeIsOrganization
        ? 'Organizacao inteira'
        : 'Nao informado';
  const awsInfoRegionSummary = normalizeMatchText(awsInfoRegion) === normalizeMatchText('Outra')
    ? awsInfoRegionOther.trim() || 'Nao informado'
    : awsInfoRegion || 'Nao informado';
  const awsInfoServiceSummary = normalizeMatchText(awsInfoFilterService) === normalizeMatchText('Outro')
    ? awsInfoFilterServiceOther.trim() || 'Nao informado'
    : awsInfoFilterService || 'Nao informado';
  const awsInfoReferencePeriodSummary = normalizeMatchText(awsInfoReferencePeriod) === normalizeMatchText('Periodo customizado')
    ? awsInfoReferencePeriodCustom.trim() || 'Nao informado'
    : awsInfoReferencePeriod || 'Nao informado';
  const awsInfoFiltersForReview = [
    awsInfoFilterResourceName.trim().length > 0 ? `Nome do recurso: ${awsInfoFilterResourceName.trim()}` : null,
    awsInfoFilterId.trim().length > 0 ? `ID: ${awsInfoFilterId.trim()}` : null,
    awsInfoFilterArn.trim().length > 0 ? `ARN: ${awsInfoFilterArn.trim()}` : null,
    awsInfoFilterTagKey.trim().length > 0 ? `Tag chave: ${awsInfoFilterTagKey.trim()}` : null,
    awsInfoFilterTagValue.trim().length > 0 ? `Tag valor: ${awsInfoFilterTagValue.trim()}` : null,
    awsInfoFilterPrincipalName.trim().length > 0 ? `Nome do usuario/role/policy: ${awsInfoFilterPrincipalName.trim()}` : null,
  ].filter((entry): entry is string => Boolean(entry));
  const tooltipScope = useMemo<TooltipScope>(
    () => ({
      categoryId: category.id,
      requestTypeId: effectiveRequestType?.id,
      requestTypeName: effectiveRequestType?.name,
      action,
    }),
    [category.id, effectiveRequestType?.id, effectiveRequestType?.name, action],
  );

  const updateRoleTrustedPrincipal = (index: number, value: string) => {
    setRoleTrustedPrincipals((previous) => previous.map((principal, currentIndex) => (currentIndex === index ? value : principal)));
  };

  const addRoleTrustedPrincipal = () => {
    setRoleTrustedPrincipals((previous) => [...previous, '']);
  };

  const removeRoleTrustedPrincipal = (index: number) => {
    setRoleTrustedPrincipals((previous) => (previous.length === 1 ? previous : previous.filter((_, currentIndex) => currentIndex !== index)));
  };

  const updateRoleAttachedPolicy = (index: number, value: string) => {
    setRoleAttachedPolicies((previous) => previous.map((policy, currentIndex) => (currentIndex === index ? value : policy)));
  };

  const addRoleAttachedPolicy = () => {
    setRoleAttachedPolicies((previous) => [...previous, '']);
  };

  const removeRoleAttachedPolicy = (index: number) => {
    setRoleAttachedPolicies((previous) => (previous.length === 1 ? previous : previous.filter((_, currentIndex) => currentIndex !== index)));
  };

  const updateGroupAttachedPolicy = (index: number, value: string) => {
    setGroupAttachedPolicies((previous) => previous.map((policy, currentIndex) => (currentIndex === index ? value : policy)));
  };

  const addGroupAttachedPolicy = () => {
    setGroupAttachedPolicies((previous) => [...previous, '']);
  };

  const removeGroupAttachedPolicy = (index: number) => {
    setGroupAttachedPolicies((previous) => (previous.length === 1 ? previous : previous.filter((_, currentIndex) => currentIndex !== index)));
  };

  const updatePsetPolicy = (index: number, value: string) => {
    setPsetPolicies((previous) => previous.map((policy, currentIndex) => (currentIndex === index ? value : policy)));
  };

  const addPsetPolicy = () => {
    setPsetPolicies((previous) => [...previous, '']);
  };

  const removePsetPolicy = (index: number) => {
    setPsetPolicies((previous) => (previous.length === 1 ? previous : previous.filter((_, currentIndex) => currentIndex !== index)));
  };

  const updateAwsInfoTargetAccount = (index: number, value: string) => {
    setAwsInfoTargetAccounts((previous) =>
      previous.map((entry, currentIndex) => (currentIndex === index ? value : entry)),
    );
    setAwsInfoValidationError('');
  };

  const addAwsInfoTargetAccount = () => {
    setAwsInfoTargetAccounts((previous) => (
      previous.length >= AWS_INFO_MULTI_ITEM_LIMIT ? previous : [...previous, '']
    ));
    setAwsInfoValidationError('');
  };

  const removeAwsInfoTargetAccount = (index: number) => {
    setAwsInfoTargetAccounts((previous) => (
      previous.length === 1 ? previous : previous.filter((_, currentIndex) => currentIndex !== index)
    ));
    setAwsInfoValidationError('');
  };

  const updateAwsInfoObject = (index: number, value: string) => {
    setAwsInfoObjects((previous) =>
      previous.map((entry, currentIndex) => (currentIndex === index ? value : entry)),
    );
    setAwsInfoValidationError('');
  };

  const addAwsInfoObject = () => {
    setAwsInfoObjects((previous) => (
      previous.length >= AWS_INFO_MULTI_ITEM_LIMIT ? previous : [...previous, '']
    ));
    setAwsInfoValidationError('');
  };

  const removeAwsInfoObject = (index: number) => {
    setAwsInfoObjects((previous) => (
      previous.length === 1 ? previous : previous.filter((_, currentIndex) => currentIndex !== index)
    ));
    setAwsInfoValidationError('');
  };

  const updateAwsInfoDesiredType = (index: number, value: string) => {
    setAwsInfoDesiredTypes((previous) =>
      previous.map((entry, currentIndex) => (currentIndex === index ? value : entry)),
    );
    setAwsInfoValidationError('');
  };

  const addAwsInfoDesiredType = () => {
    setAwsInfoDesiredTypes((previous) => (
      previous.length >= AWS_INFO_MULTI_ITEM_LIMIT ? previous : [...previous, '']
    ));
    setAwsInfoValidationError('');
  };

  const removeAwsInfoDesiredType = (index: number) => {
    setAwsInfoDesiredTypes((previous) => (
      previous.length === 1 ? previous : previous.filter((_, currentIndex) => currentIndex !== index)
    ));
    setAwsInfoValidationError('');
  };

  const addPsetUpdateAction = () => {
    if (!psetUpdatePendingAction) return;

    setPsetUpdateActions((previous) => {
      if (previous.some((item) => item.type === psetUpdatePendingAction)) return previous;

      return [
        ...previous,
        {
          id: `pset-update-${psetUpdatePendingAction}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          type: psetUpdatePendingAction,
          items: [''],
        },
      ];
    });
    setPsetUpdatePendingAction('');
    setPsetUpdateValidationError('');
  };

  const removePsetUpdateAction = (id: string) => {
    setPsetUpdateActions((previous) => previous.filter((item) => item.id !== id));
    setPsetUpdateValidationError('');
  };

  const updatePsetUpdateActionItem = (id: string, index: number, value: string) => {
    setPsetUpdateActions((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          items: item.items.map((entry, currentIndex) => (currentIndex === index ? value : entry)),
        };
      }),
    );
    setPsetUpdateValidationError('');
  };

  const addPsetUpdateActionItem = (id: string) => {
    setPsetUpdateActions((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item;
        if (item.items.length >= PSET_UPDATE_ITEM_LIMIT) return item;
        return { ...item, items: [...item.items, ''] };
      }),
    );
    setPsetUpdateValidationError('');
  };

  const removePsetUpdateActionItem = (id: string, index: number) => {
    setPsetUpdateActions((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item;
        if (item.items.length === 1) return item;
        return { ...item, items: item.items.filter((_, currentIndex) => currentIndex !== index) };
      }),
    );
    setPsetUpdateValidationError('');
  };

  const updateIamUserTargetGroup = (index: number, value: string) => {
    setIamUserTargetGroups((previous) => previous.map((group, currentIndex) => (currentIndex === index ? value : group)));
  };

  const addIamUserTargetGroup = () => {
    setIamUserTargetGroups((previous) => [...previous, '']);
  };

  const removeIamUserTargetGroup = (index: number) => {
    setIamUserTargetGroups((previous) => (previous.length === 1 ? previous : previous.filter((_, currentIndex) => currentIndex !== index)));
  };

  const updateIamUserAttachedPolicy = (index: number, value: string) => {
    setIamUserAttachedPolicies((previous) => previous.map((policy, currentIndex) => (currentIndex === index ? value : policy)));
  };

  const addIamUserAttachedPolicy = () => {
    setIamUserAttachedPolicies((previous) => [...previous, '']);
  };

  const removeIamUserAttachedPolicy = (index: number) => {
    setIamUserAttachedPolicies((previous) => (previous.length === 1 ? previous : previous.filter((_, currentIndex) => currentIndex !== index)));
  };

  const addRoleUpdateAction = () => {
    if (!roleUpdatePendingAction) return;

    setRoleUpdateActions((previous) => {
      if (previous.some((item) => item.type === roleUpdatePendingAction)) return previous;

      return [
        ...previous,
        {
          id: `role-update-${roleUpdatePendingAction}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          type: roleUpdatePendingAction,
          details: '',
          policies: [''],
        },
      ];
    });
    setRoleUpdatePendingAction('');
    setRoleUpdateValidationError('');
  };

  const removeRoleUpdateAction = (id: string) => {
    setRoleUpdateActions((previous) => previous.filter((item) => item.id !== id));
    setRoleUpdateValidationError('');
  };

  const updateRoleUpdateActionDetails = (id: string, value: string) => {
    setRoleUpdateActions((previous) =>
      previous.map((item) => (item.id === id ? { ...item, details: value } : item)),
    );
    setRoleUpdateValidationError('');
  };

  const updateRoleUpdateActionPolicy = (id: string, index: number, value: string) => {
    setRoleUpdateActions((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          policies: item.policies.map((policy, currentIndex) => (currentIndex === index ? value : policy)),
        };
      }),
    );
    setRoleUpdateValidationError('');
  };

  const addRoleUpdateActionPolicy = (id: string) => {
    setRoleUpdateActions((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item;
        if (item.policies.length >= ROLE_UPDATE_POLICY_LIMIT) return item;
        return { ...item, policies: [...item.policies, ''] };
      }),
    );
    setRoleUpdateValidationError('');
  };

  const removeRoleUpdateActionPolicy = (id: string, index: number) => {
    setRoleUpdateActions((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item;
        if (item.policies.length === 1) return item;
        return { ...item, policies: item.policies.filter((_, currentIndex) => currentIndex !== index) };
      }),
    );
    setRoleUpdateValidationError('');
  };

  const addUserUpdateAction = () => {
    if (!userUpdatePendingAction) return;

    setUserUpdateActions((previous) => {
      if (previous.some((item) => item.type === userUpdatePendingAction)) return previous;

      return [
        ...previous,
        {
          id: `user-update-${userUpdatePendingAction}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          type: userUpdatePendingAction,
          items: [''],
        },
      ];
    });
    setUserUpdatePendingAction('');
    setUserUpdateValidationError('');
  };

  const removeUserUpdateAction = (id: string) => {
    setUserUpdateActions((previous) => previous.filter((item) => item.id !== id));
    setUserUpdateValidationError('');
  };

  const updateUserUpdateActionItem = (id: string, index: number, value: string) => {
    setUserUpdateActions((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          items: item.items.map((entry, currentIndex) => (currentIndex === index ? value : entry)),
        };
      }),
    );
    setUserUpdateValidationError('');
  };

  const addUserUpdateActionItem = (id: string) => {
    setUserUpdateActions((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item;
        if (item.items.length >= USER_UPDATE_ITEM_LIMIT) return item;
        return { ...item, items: [...item.items, ''] };
      }),
    );
    setUserUpdateValidationError('');
  };

  const removeUserUpdateActionItem = (id: string, index: number) => {
    setUserUpdateActions((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item;
        if (item.items.length === 1) return item;
        return { ...item, items: item.items.filter((_, currentIndex) => currentIndex !== index) };
      }),
    );
    setUserUpdateValidationError('');
  };

  const addGroupUpdateAction = () => {
    if (!groupUpdatePendingAction) return;

    setGroupUpdateActions((previous) => {
      if (previous.some((item) => item.type === groupUpdatePendingAction)) return previous;

      return [
        ...previous,
        {
          id: `group-update-${groupUpdatePendingAction}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          type: groupUpdatePendingAction,
          items: [''],
        },
      ];
    });
    setGroupUpdatePendingAction('');
    setGroupUpdateValidationError('');
  };

  const removeGroupUpdateAction = (id: string) => {
    setGroupUpdateActions((previous) => previous.filter((item) => item.id !== id));
    setGroupUpdateValidationError('');
  };

  const updateGroupUpdateActionItem = (id: string, index: number, value: string) => {
    setGroupUpdateActions((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          items: item.items.map((entry, currentIndex) => (currentIndex === index ? value : entry)),
        };
      }),
    );
    setGroupUpdateValidationError('');
  };

  const addGroupUpdateActionItem = (id: string) => {
    setGroupUpdateActions((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item;
        if (item.items.length >= GROUP_UPDATE_ITEM_LIMIT) return item;
        return { ...item, items: [...item.items, ''] };
      }),
    );
    setGroupUpdateValidationError('');
  };

  const removeGroupUpdateActionItem = (id: string, index: number) => {
    setGroupUpdateActions((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item;
        if (item.items.length === 1) return item;
        return { ...item, items: item.items.filter((_, currentIndex) => currentIndex !== index) };
      }),
    );
    setGroupUpdateValidationError('');
  };

  const updateRoleDeleteTargetName = (index: number, value: string) => {
    setRoleDeleteTargets((previous) =>
      previous.map((target, currentIndex) => (currentIndex === index ? { ...target, roleName: value } : target)),
    );
    setAccountsValidationError('');
  };

  const submitLabel = (() => {
    if (isBreakingGlass && isCreateAction) return 'Solicitar Concessão Emergencial';
    if (isBreakingGlass && isUpdateAction) return 'Solicitar Ajuste de Acesso Emergencial';
    if (isBreakingGlass && isDeleteAction) return 'Solicitar Revogação de Acesso Emergencial';
    if (isAudit && isCreateAction) return 'Solicitar Abertura de Auditoria';
    if (isAudit && isUpdateAction) return 'Solicitar Alteração de Auditoria';
    if (isAudit && isDeleteAction) return 'Solicitar Encerramento de Auditoria';
    return 'Enviar Solicitação';
  })();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isReviewMode) {
      if (requiresExistingAccount && selectedAccountIds.length !== 1) {
        setAccountsValidationError('Selecione exatamente uma conta AWS para executar a solicitacao.');
        return;
      }

      if (isAwsInformationCategory && isCreateAction) {
        if (awsInfoRequestedData.trim().length === 0) {
          setAwsInfoValidationError('Descreva o que precisa ser levantado.');
          return;
        }
      }

      if (isRoleCategory) {
        const roleScopeError = validateRoleAccountScope(selectedAccounts);
        if (roleScopeError) {
          setAccountsValidationError(roleScopeError);
          return;
        }

        if (!isCreateAction && roleDeleteTargets[0]?.roleName.trim().length === 0) {
          setAccountsValidationError(`Para ${roleTargetActionVerb} role, informe o nome da role alvo.`);
          return;
        }

        if (isUpdateAction) {
          if (roleUpdateActions.length === 0) {
            setRoleUpdateValidationError('Selecione ao menos uma acao de alteracao da role.');
            return;
          }

          for (const item of roleUpdateActions) {
            const actionDef = getRoleUpdateActionDefinition(item.type);
            const actionLabel = actionDef?.label || 'Acao selecionada';

            if (isRoleUpdatePolicyAction(item.type)) {
              const policies = item.policies.map((policy) => policy.trim()).filter((policy) => policy.length > 0);
              if (policies.length === 0) {
                setRoleUpdateValidationError(`${actionLabel}: informe ao menos uma policy.`);
                return;
              }
              if (policies.length > ROLE_UPDATE_POLICY_LIMIT) {
                setRoleUpdateValidationError(`${actionLabel}: limite de ${ROLE_UPDATE_POLICY_LIMIT} policies por solicitacao.`);
                return;
              }
            } else if (item.details.trim().length === 0) {
              setRoleUpdateValidationError(`${actionLabel}: detalhe o que deve ser executado.`);
              return;
            }
          }
        }
      }

      if (categoryId === 'aws-iam-groups' && isUpdateAction) {
        if (groupUpdateActions.length === 0) {
          setGroupUpdateValidationError('Selecione ao menos uma acao de alteracao do grupo IAM.');
          return;
        }

        for (const item of groupUpdateActions) {
          const actionDef = getGroupUpdateActionDefinition(item.type);
          const actionLabel = actionDef?.label || 'Acao selecionada';
          const entries = item.items.map((entry) => entry.trim()).filter((entry) => entry.length > 0);

          if (entries.length === 0) {
            setGroupUpdateValidationError(`${actionLabel}: informe ao menos um item.`);
            return;
          }

          if (entries.length > GROUP_UPDATE_ITEM_LIMIT) {
            setGroupUpdateValidationError(`${actionLabel}: limite de ${GROUP_UPDATE_ITEM_LIMIT} itens por solicitacao.`);
            return;
          }
        }
      }

      if (categoryId === 'aws-iam-users' && isUpdateAction) {
        if (userUpdateActions.length === 0) {
          setUserUpdateValidationError('Selecione ao menos uma acao de alteracao do usuario IAM.');
          return;
        }

        for (const item of userUpdateActions) {
          const actionDef = getUserUpdateActionDefinition(item.type);
          const actionLabel = actionDef?.label || 'Acao selecionada';
          const entries = item.items.map((entry) => entry.trim()).filter((entry) => entry.length > 0);

          if (entries.length === 0) {
            setUserUpdateValidationError(`${actionLabel}: informe ao menos um item.`);
            return;
          }

          if (entries.length > USER_UPDATE_ITEM_LIMIT) {
            setUserUpdateValidationError(`${actionLabel}: limite de ${USER_UPDATE_ITEM_LIMIT} itens por solicitacao.`);
            return;
          }
        }
      }

      if (categoryId === 'aws-psets' && isUpdateAction) {
        if (psetUpdateActions.length === 0) {
          setPsetUpdateValidationError('Selecione ao menos uma acao de alteracao do PSET.');
          return;
        }

        for (const item of psetUpdateActions) {
          const actionDef = getPsetUpdateActionDefinition(item.type);
          const actionLabel = actionDef?.label || 'Acao selecionada';
          const entries = item.items.map((entry) => entry.trim()).filter((entry) => entry.length > 0);

          if (entries.length === 0) {
            setPsetUpdateValidationError(`${actionLabel}: informe ao menos um item.`);
            return;
          }

          if (entries.length > PSET_UPDATE_ITEM_LIMIT) {
            setPsetUpdateValidationError(`${actionLabel}: limite de ${PSET_UPDATE_ITEM_LIMIT} itens por solicitacao.`);
            return;
          }
        }
      }

      setAccountsValidationError('');
      setRoleUpdateValidationError('');
      setGroupUpdateValidationError('');
      setUserUpdateValidationError('');
      setPsetUpdateValidationError('');
      setAwsInfoValidationError('');
      setIsReviewMode(true);
      return;
    }

    navigate('/tickets/AWS-REQ-84721');
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <Link to={`/catalog/${categoryId}`} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <h1>Nova Solicitação</h1>
            <p className="text-sm text-muted-foreground">
              {category.name}
              {effectiveRequestType ? ` · ${effectiveRequestType.name}` : ''}
            </p>
          </div>
        </div>

        {isBreakingGlass && (
          <div className="bg-destructive/5 border-2 border-destructive/20 rounded-xl p-4 flex items-start gap-3">
            <AlertOctagon className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-destructive">Processo Excepcional</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Acesso emergencial exige incidente, justificativa forte, aprovação reforçada e revisão obrigatória.
              </p>
            </div>
          </div>
        )}

        <TooltipScopeContext.Provider value={tooltipScope}>
        <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 card-shadow space-y-6">
          {!isReviewMode && (
            <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!routeRequestType && (
              <FormField label="Ação da Solicitação" required>
                <SelectField
                  options={requestTypeOptions}
                  value={selectedRequestTypeId}
                  onChange={setSelectedRequestTypeId}
                  placeholder="Selecione a ação..."
                  required
                />
              </FormField>
            )}

            {requiresExistingAccount && (
              <div className="md:col-span-2">
                <FormField
                  label="Conta AWS"
                  required
                  help="Selecione uma unica conta AWS alvo da solicitacao."
                >
                  <div className="space-y-3">
                    <SelectField
                      options={accountOptions}
                      value={selectedAccountIds[0] || ''}
                      onChange={(value) => {
                        setSelectedAccountIds(value ? [value] : []);
                        setAccountsValidationError('');
                      }}
                      placeholder="Selecione a conta..."
                      required
                    />

                    {isRoleCategory && (
                      <p className="text-xs text-muted-foreground">
                        Regra de Role AWS: 1 conta por solicitacao e 1 role por solicitacao.
                      </p>
                    )}

                    {accountsValidationError && (
                      <p className="text-xs text-destructive">{accountsValidationError}</p>
                    )}
                  </div>
                </FormField>
              </div>
            )}

          </div>

          {effectiveRequestType ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryId === 'aws-accounts' && isCreateAction && (
                <>
                  <FormField label="Nome da conta AWS" required help="Padrao: AWS_AC_<NOME_DA_CONTA>_<AMBIENTE>">
                    <InputField placeholder="Ex: AWS_AC_PAYMENT_GATEWAY_PRD" required />
                  </FormField>
                  <FormField label="Descrição / finalidade da conta" required>
                    <TextArea placeholder="Descreva a finalidade da conta e o tipo de workload que será hospedado." required />
                  </FormField>
                  <FormField label="Tipo de conta" required>
                    <SelectField options={accountCreationTypeOptions} required />
                  </FormField>
                  <FormField label="Ambiente" required>
                    <SelectField
                      options={accountCreationEnvironmentOptions}
                      value={accountCreateEnvironment}
                      onChange={setAccountCreateEnvironment}
                      required
                    />
                  </FormField>
                  <FormField label="Responsável de negócio" required>
                    <InputField placeholder="Ex: Maria Souza" required />
                  </FormField>
                  <FormField label="E-mail do responsável principal" required>
                    <InputField placeholder="Ex: maria.souza@empresa.com" type="email" required />
                  </FormField>
                  <FormField label="Responsável técnico" required>
                    <InputField placeholder="Ex: Carlos Lima" required />
                  </FormField>
                  <FormField label="Gestor aprovador" required>
                    <InputField placeholder="Ex: Ana Ribeiro" required />
                  </FormField>
                  <FormField label="Centro de custo" required>
                    <InputField placeholder="Ex: CC-10457" required />
                  </FormField>
                  <FormField label="Unidade de negócio" required>
                    <SelectField options={accountCreationBusinessUnitOptions} required />
                  </FormField>
                </>
              )}

              {categoryId === 'aws-accounts' && isUpdateAction && (
                <>
                  <div className="md:col-span-2">
                    <FormField
                      label="Alterações Solicitadas"
                      required
                      help="Descreva objetivamente o que deve ser alterado."
                    >
                      <TextArea placeholder="Ex: atualizar owner para time X e ajustar baseline de segurança Y." required />
                    </FormField>
                  </div>
                </>
              )}

              {categoryId === 'aws-accounts' && isDeleteAction && (
                <div className="md:col-span-2">
                  <FormField label="Plano de Descomissionamento" required>
                    <TextArea placeholder="Descreva migração de workloads, retenção de logs e encerramento financeiro." required />
                  </FormField>
                </div>
              )}

              {categoryId === 'aws-information' && isCreateAction && (
                <>
                  <div className="md:col-span-2">
                    <FormField
                      label="Descricao do levantamento"
                      required
                      help="Descreva o que precisa ser levantado. O pedido pode ser amplo (todas as contas) ou especifico (um recurso)."
                    >
                      <TextAreaField
                        placeholder="Ex: Levantar dump de todas as roles, policies e recursos utilizados em todas as contas. Tambem incluir detalhe do recurso bucket-logs-aplicacao-prd."
                        rows={6}
                        value={awsInfoRequestedData}
                        onChange={(value) => {
                          setAwsInfoRequestedData(value);
                          setAwsInfoValidationError('');
                        }}
                        required
                      />
                    </FormField>
                  </div>

                  {awsInfoValidationError && (
                    <div className="md:col-span-2">
                      <p className="text-xs text-destructive">{awsInfoValidationError}</p>
                    </div>
                  )}
                </>
              )}

              {categoryId === 'aws-profiles' && (
                <>
                  {isCreateAction ? (
                    <FormField label="Nome do Perfil Corporativo (Taxonomia)" required help="Padrão: prf-{ambiente}-{nome}">
                      <TaxonomySegmentField
                        prefix={`prf-${accountEnvironmentToken}-`}
                        placeholder="nome-do-perfil"
                        required
                      />
                    </FormField>
                  ) : (
                    <FormField label="Perfil Corporativo Alvo" required>
                      <InputField placeholder="Ex: PRF-PGW-PRD-SRE-READONLY" required />
                    </FormField>
                  )}
                  {isCreateAction && (
                    <>
                      <FormField
                        label="Grupo do Perfil de Acesso (Taxonomia)"
                        required
                        help="Padrão: AWS_GR_<NOME_DO_PERFIL>_PRD|HML|DEV."
                      >
                        <TaxonomySegmentField
                          prefix="AWS_GR_"
                          suffix={`_${profileGroupEnvironmentSuffix}`}
                          placeholder="NOME_DO_PERFIL"
                          required
                        />
                      </FormField>
                      <FormField label="PSET Associado" required>
                        <SelectField options={toOptions(psets)} required />
                      </FormField>
                    </>
                  )}
                  {isUpdateAction && (
                    <>
                      <div className="md:col-span-2">
                        <FormField
                          label="Alterações Solicitadas no Perfil"
                          required
                          help="Descreva exatamente o que deve ser alterado no perfil, grupo de acesso e/ou PSET."
                        >
                          <TextArea placeholder="Ex: alterar grupo associado para X e vincular o PSET Y." required />
                        </FormField>
                      </div>
                    </>
                  )}
                  {isDeleteAction && (
                    <div className="md:col-span-2">
                      <FormField label="Plano de Revogação e Migração" required>
                        <TextArea placeholder="Descreva como os acessos serão revogados e para onde os usuários serão migrados." required />
                      </FormField>
                    </div>
                  )}
                </>
              )}

              {categoryId === 'aws-iam-users' && (
                <>
                  {isCreateAction && (
                    <>
                      <FormField
                        label="Usuario IAM (Taxonomia)"
                        required
                        help="Padrao: AWS_US_<NOME_DO_USUARIO>_PRD|HML|DEV."
                      >
                        <TaxonomySegmentField
                          prefix="AWS_US_"
                          suffix={`_${profileGroupEnvironmentSuffix}`}
                          placeholder="NOME_DO_USUARIO"
                          hidePreview
                          required
                        />
                      </FormField>
                    </>
                  )}
                  {!isCreateAction && (
                    <FormField label="Usuário IAM Alvo (nome/ARN)" required>
                      <InputField placeholder="Ex: usuario-legado-integracao ou arn:aws:iam::123456789012:user/usuario-legado" required />
                    </FormField>
                  )}
                  {isCreateAction && (
                    <>
                      <div className="md:col-span-2 space-y-3">
                        <FormField
                          label="Permissões Iniciais do Usuário IAM"
                          required
                          help="Escolha se o usuário será criado sem permissões iniciais ou com vínculo em grupos/policies existentes."
                        >
                          <SelectField
                            options={iamUserPermissionModeOptions}
                            value={iamUserPermissionMode}
                            onChange={(value) => {
                              setIamUserPermissionMode(value as IamUserPermissionMode);
                              setIamUserTargetGroups(['']);
                              setIamUserAttachedPolicies(['']);
                            }}
                            required
                          />
                        </FormField>

                        {iamUserPermissionMode === 'none' && (
                          <div className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                            O usuário será criado sem vínculo inicial de grupo IAM e sem policy anexada.
                          </div>
                        )}

                        {(iamUserPermissionMode === 'group-existing' || iamUserPermissionMode === 'group-and-attach-existing') && (
                          <FormField
                            label="Grupos IAM Existentes para Inclusão"
                            required
                            help="Selecione um ou mais grupos IAM existentes para incluir o usuário após a criação."
                          >
                            <div className="space-y-2">
                              {iamUserTargetGroups.map((group, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <SelectField
                                    options={toOptions(iamGroups)}
                                    value={group}
                                    onChange={(value) => updateIamUserTargetGroup(index, value)}
                                    required={index === 0}
                                  />
                                  {iamUserTargetGroups.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeIamUserTargetGroup(index)}
                                      className="px-3 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted/40"
                                      aria-label={`Remover grupo ${index + 1}`}
                                      title="Remover grupo"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={addIamUserTargetGroup}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted/40"
                              >
                                <Plus className="w-4 h-4" />
                                Adicionar grupo
                              </button>
                            </div>
                          </FormField>
                        )}

                        {(iamUserPermissionMode === 'attach-existing' || iamUserPermissionMode === 'group-and-attach-existing') && (
                          <FormField
                            label="Policies Existentes para Attach"
                            required
                            help="Informe nome ou ARN de cada policy existente que deve ser anexada ao usuário."
                          >
                            <div className="space-y-2">
                              {iamUserAttachedPolicies.map((policy, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <InputField
                                    placeholder="Ex: arn:aws:iam::aws:policy/ReadOnlyAccess"
                                    value={policy}
                                    onChange={(value) => updateIamUserAttachedPolicy(index, value)}
                                    required={index === 0}
                                  />
                                  {iamUserAttachedPolicies.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeIamUserAttachedPolicy(index)}
                                      className="px-3 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted/40"
                                      aria-label={`Remover policy ${index + 1}`}
                                      title="Remover policy"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={addIamUserAttachedPolicy}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted/40"
                              >
                                <Plus className="w-4 h-4" />
                                Adicionar policy
                              </button>
                            </div>
                          </FormField>
                        )}
                      </div>
                    </>
                  )}
                  {isUpdateAction && (
                    <>
                      <div className="md:col-span-2">
                        <FormField
                          label="Acoes da Alteracao do Usuario IAM"
                          required
                          help="Selecione ao menos uma acao. Ao adicionar a acao, informe exatamente os itens envolvidos."
                        >
                          <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row gap-2">
                              <SelectField
                                options={userUpdateActionOptions}
                                value={userUpdatePendingAction}
                                onChange={(value) => setUserUpdatePendingAction(value as UserUpdateActionType)}
                                placeholder="Selecione a acao..."
                              />
                              <button
                                type="button"
                                onClick={addUserUpdateAction}
                                disabled={!userUpdatePendingAction}
                                className={`inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-border text-sm ${
                                  !userUpdatePendingAction ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted/40'
                                }`}
                              >
                                <Plus className="w-4 h-4" />
                                Adicionar acao
                              </button>
                            </div>

                            <p className="text-xs text-muted-foreground">
                              Selecione ao menos uma opcao: Adicionar policy, Remover policy, Adicionar grupo, Remover grupo ou Rotacionar key.
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Em "Rotacionar key", a key atual sera desativada e, apos 7 dias sem solicitacao de reativacao, sera excluida.
                            </p>

                            {userUpdateValidationError && (
                              <p className="text-xs text-destructive">{userUpdateValidationError}</p>
                            )}
                          </div>
                        </FormField>
                      </div>

                      {userUpdateActions.map((updateAction) => {
                        const actionDefinition = getUserUpdateActionDefinition(updateAction.type);
                        if (!actionDefinition) return null;

                        const normalizedItems = updateAction.items
                          .map((item) => item.trim())
                          .filter((item) => item.length > 0);
                        const addLabel = actionDefinition.mode === 'policy-list'
                          ? 'Adicionar policy'
                          : actionDefinition.mode === 'group-list'
                            ? 'Adicionar grupo'
                            : 'Adicionar key';
                        const itemLabel = actionDefinition.mode === 'policy-list'
                          ? 'Policies informadas'
                          : actionDefinition.mode === 'group-list'
                            ? 'Grupos informados'
                            : 'Keys informadas';

                        return (
                          <div key={updateAction.id} className="md:col-span-2 rounded-lg border border-border bg-muted/10 px-3 py-3 space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium">{actionDefinition.label}</p>
                              <button
                                type="button"
                                onClick={() => removeUserUpdateAction(updateAction.id)}
                                className="px-2 py-1 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted/40"
                              >
                                Remover acao
                              </button>
                            </div>

                            <p className="text-xs text-muted-foreground">{actionDefinition.description}</p>

                            <div className="space-y-2">
                              {updateAction.items.map((item, index) => (
                                <div key={`${updateAction.id}-item-${index}`} className="flex items-center gap-2">
                                  <InputField
                                    placeholder={actionDefinition.placeholder}
                                    value={item}
                                    onChange={(value) => updateUserUpdateActionItem(updateAction.id, index, value)}
                                    required={index === 0}
                                  />
                                  {updateAction.items.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeUserUpdateActionItem(updateAction.id, index)}
                                      className="px-3 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted/40"
                                      aria-label={`Remover item ${index + 1}`}
                                      title="Remover item"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              ))}

                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs text-muted-foreground">
                                  {itemLabel}: {normalizedItems.length}/{USER_UPDATE_ITEM_LIMIT}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => addUserUpdateActionItem(updateAction.id)}
                                  disabled={updateAction.items.length >= USER_UPDATE_ITEM_LIMIT}
                                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm ${
                                    updateAction.items.length >= USER_UPDATE_ITEM_LIMIT
                                      ? 'opacity-50 cursor-not-allowed'
                                      : 'hover:bg-muted/40'
                                  }`}
                                >
                                  <Plus className="w-4 h-4" />
                                  {addLabel}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                  {isDeleteAction && (
                    <div className="md:col-span-2">
                      <FormField label="Plano de Revogação de Credenciais" required>
                        <TextArea placeholder="Descreva revogação de chaves e senha antes da remoção do usuário IAM." required />
                      </FormField>
                    </div>
                  )}
                </>
              )}

              {categoryId === 'aws-iam-groups' && (
                <>
                  {!isCreateAction && (
                    <FormField label="Grupo IAM Alvo (nome/ARN)" required>
                      <InputField placeholder="Ex: grupo-legado-suporte ou arn:aws:iam::123456789012:group/grupo-legado" required />
                    </FormField>
                  )}
                  {isCreateAction && (
                    <FormField label="Nome do Grupo IAM (Taxonomia)" required help="Padrão: AWS_GR_<NOME_DO_GRUPO>_PRD|HML|DEV.">
                      <TaxonomySegmentField
                        prefix="AWS_GR_"
                        suffix={`_${profileGroupEnvironmentSuffix}`}
                        placeholder="NOME_DO_GRUPO"
                        hidePreview
                        required
                      />
                    </FormField>
                  )}
                  {isCreateAction && (
                    <div className="md:col-span-2 space-y-3">
                      <FormField
                        label="Permissões Iniciais do Grupo IAM"
                        required
                        help="Escolha se o grupo será criado sem permissões iniciais ou com attach de policies existentes."
                      >
                        <SelectField
                          options={groupPermissionModeOptions}
                          value={groupPermissionMode}
                          onChange={(value) => {
                            setGroupPermissionMode(value as GroupPermissionMode);
                            setGroupAttachedPolicies(['']);
                          }}
                          required
                        />
                      </FormField>

                      {groupPermissionMode === 'none' && (
                        <div className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                          O grupo será criado sem policies anexadas inicialmente.
                        </div>
                      )}

                      {groupPermissionMode === 'attach-existing' && (
                        <FormField
                          label="Policies Existentes para Attach"
                          required
                          help="Informe nome ou ARN de cada policy existente que deve ser anexada ao grupo."
                        >
                          <div className="space-y-2">
                            {groupAttachedPolicies.map((policy, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <InputField
                                  placeholder="Ex: arn:aws:iam::aws:policy/ReadOnlyAccess"
                                  value={policy}
                                  onChange={(value) => updateGroupAttachedPolicy(index, value)}
                                  required={index === 0}
                                />
                                {groupAttachedPolicies.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeGroupAttachedPolicy(index)}
                                    className="px-3 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted/40"
                                    aria-label={`Remover policy ${index + 1}`}
                                    title="Remover policy"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={addGroupAttachedPolicy}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted/40"
                            >
                              <Plus className="w-4 h-4" />
                              Adicionar policy
                            </button>
                          </div>
                        </FormField>
                      )}
                    </div>
                  )}
                  {isUpdateAction && (
                    <>
                      <div className="md:col-span-2">
                        <FormField
                          label="Acoes da Alteracao do Grupo IAM"
                          required
                          help="Selecione ao menos uma acao. Ao adicionar a acao, informe exatamente os usuarios/policies envolvidos."
                        >
                          <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row gap-2">
                              <SelectField
                                options={groupUpdateActionOptions}
                                value={groupUpdatePendingAction}
                                onChange={(value) => setGroupUpdatePendingAction(value as GroupUpdateActionType)}
                                placeholder="Selecione a acao..."
                              />
                              <button
                                type="button"
                                onClick={addGroupUpdateAction}
                                disabled={!groupUpdatePendingAction}
                                className={`inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-border text-sm ${
                                  !groupUpdatePendingAction ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted/40'
                                }`}
                              >
                                <Plus className="w-4 h-4" />
                                Adicionar acao
                              </button>
                            </div>

                            <p className="text-xs text-muted-foreground">
                              Selecione ao menos uma opcao: Adicionar policy, Remover policy, Adicionar usuario ou Remover usuario.
                            </p>

                            {groupUpdateValidationError && (
                              <p className="text-xs text-destructive">{groupUpdateValidationError}</p>
                            )}
                          </div>
                        </FormField>
                      </div>

                      {groupUpdateActions.map((updateAction) => {
                        const actionDefinition = getGroupUpdateActionDefinition(updateAction.type);
                        if (!actionDefinition) return null;

                        const normalizedItems = updateAction.items
                          .map((item) => item.trim())
                          .filter((item) => item.length > 0);
                        const addLabel = actionDefinition.mode === 'policy-list' ? 'Adicionar policy' : 'Adicionar usuario';
                        const itemLabel = actionDefinition.mode === 'policy-list' ? 'Policies informadas' : 'Usuarios informados';

                        return (
                          <div key={updateAction.id} className="md:col-span-2 rounded-lg border border-border bg-muted/10 px-3 py-3 space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium">{actionDefinition.label}</p>
                              <button
                                type="button"
                                onClick={() => removeGroupUpdateAction(updateAction.id)}
                                className="px-2 py-1 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted/40"
                              >
                                Remover acao
                              </button>
                            </div>

                            <p className="text-xs text-muted-foreground">{actionDefinition.description}</p>

                            <div className="space-y-2">
                              {updateAction.items.map((item, index) => (
                                <div key={`${updateAction.id}-item-${index}`} className="flex items-center gap-2">
                                  <InputField
                                    placeholder={actionDefinition.placeholder}
                                    value={item}
                                    onChange={(value) => updateGroupUpdateActionItem(updateAction.id, index, value)}
                                    required={index === 0}
                                  />
                                  {updateAction.items.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeGroupUpdateActionItem(updateAction.id, index)}
                                      className="px-3 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted/40"
                                      aria-label={`Remover item ${index + 1}`}
                                      title="Remover item"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              ))}

                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs text-muted-foreground">
                                  {itemLabel}: {normalizedItems.length}/{GROUP_UPDATE_ITEM_LIMIT}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => addGroupUpdateActionItem(updateAction.id)}
                                  disabled={updateAction.items.length >= GROUP_UPDATE_ITEM_LIMIT}
                                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm ${
                                    updateAction.items.length >= GROUP_UPDATE_ITEM_LIMIT
                                      ? 'opacity-50 cursor-not-allowed'
                                      : 'hover:bg-muted/40'
                                  }`}
                                >
                                  <Plus className="w-4 h-4" />
                                  {addLabel}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                  {isDeleteAction && (
                    <>
                      <div className="md:col-span-2">
                        <FormField label="Plano de Migração dos Membros" required>
                          <TextArea placeholder="Descreva como os usuários do grupo serão migrados antes da remoção." required />
                        </FormField>
                      </div>
                    </>
                  )}
                </>
              )}

              {categoryId === 'aws-psets' && (
                <>
                  {isCreateAction ? (
                    <FormField label="Nome do PSET" required help="Padrão: AWS_PS_<NOME_DO_PSET>_PRD|HML|DEV.">
                      <TaxonomySegmentField
                        prefix="AWS_PS_"
                        suffix={`_${profileGroupEnvironmentSuffix}`}
                        placeholder="NOME_DO_PSET"
                        hidePreview
                        required
                      />
                    </FormField>
                  ) : (
                    <FormField label="Nome do PSET" required>
                      <InputField placeholder="Ex: pset-legado-readonly ou arn:aws:sso:::permissionSet/ssoins-1234567890abcdef/ps-1234567890abcdef" required />
                    </FormField>
                  )}
                  {isCreateAction && (
                    <>
                      <div className="md:col-span-2">
                        <FormField
                          label="Policies do PSET"
                          required
                          help="Informe uma ou mais policies para vincular ao PSET. Adicione uma policy por campo."
                        >
                          <div className="space-y-2">
                            {psetPolicies.map((policy, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <InputField
                                  placeholder="Ex: ReadOnlyAccess"
                                  value={policy}
                                  onChange={(value) => updatePsetPolicy(index, value)}
                                  required={index === 0}
                                />
                                {psetPolicies.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removePsetPolicy(index)}
                                    className="px-3 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted/40"
                                    aria-label={`Remover policy ${index + 1}`}
                                    title="Remover policy"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={addPsetPolicy}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted/40"
                            >
                              <Plus className="w-4 h-4" />
                              Adicionar policy
                            </button>
                          </div>
                        </FormField>
                      </div>
                    </>
                  )}
                  {isUpdateAction && (
                    <>
                      <div className="md:col-span-2">
                        <FormField
                          label="Acoes da Alteracao do PSET"
                          required
                          help="Selecione ao menos uma acao. Ao adicionar a acao, informe exatamente as policies/contas envolvidas."
                        >
                          <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row gap-2">
                              <SelectField
                                options={psetUpdateActionOptions}
                                value={psetUpdatePendingAction}
                                onChange={(value) => setPsetUpdatePendingAction(value as PsetUpdateActionType)}
                                placeholder="Selecione a acao..."
                              />
                              <button
                                type="button"
                                onClick={addPsetUpdateAction}
                                disabled={!psetUpdatePendingAction}
                                className={`inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-border text-sm ${
                                  !psetUpdatePendingAction ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted/40'
                                }`}
                              >
                                <Plus className="w-4 h-4" />
                                Adicionar acao
                              </button>
                            </div>

                            <p className="text-xs text-muted-foreground">
                              Selecione ao menos uma opcao: Adicionar policy, Remover policy, Adicionar conta ou Remover conta.
                            </p>

                            {psetUpdateValidationError && (
                              <p className="text-xs text-destructive">{psetUpdateValidationError}</p>
                            )}
                          </div>
                        </FormField>
                      </div>

                      {psetUpdateActions.map((updateAction) => {
                        const actionDefinition = getPsetUpdateActionDefinition(updateAction.type);
                        if (!actionDefinition) return null;

                        const normalizedItems = updateAction.items
                          .map((item) => item.trim())
                          .filter((item) => item.length > 0);
                        const addLabel = actionDefinition.mode === 'policy-list' ? 'Adicionar policy' : 'Adicionar conta';
                        const itemLabel = actionDefinition.mode === 'policy-list' ? 'Policies informadas' : 'Contas informadas';

                        return (
                          <div key={updateAction.id} className="md:col-span-2 rounded-lg border border-border bg-muted/10 px-3 py-3 space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium">{actionDefinition.label}</p>
                              <button
                                type="button"
                                onClick={() => removePsetUpdateAction(updateAction.id)}
                                className="px-2 py-1 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted/40"
                              >
                                Remover acao
                              </button>
                            </div>

                            <p className="text-xs text-muted-foreground">{actionDefinition.description}</p>

                            <div className="space-y-2">
                              {updateAction.items.map((item, index) => (
                                <div key={`${updateAction.id}-item-${index}`} className="flex items-center gap-2">
                                  <InputField
                                    placeholder={actionDefinition.placeholder}
                                    value={item}
                                    onChange={(value) => updatePsetUpdateActionItem(updateAction.id, index, value)}
                                    required={index === 0}
                                  />
                                  {updateAction.items.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removePsetUpdateActionItem(updateAction.id, index)}
                                      className="px-3 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted/40"
                                      aria-label={`Remover item ${index + 1}`}
                                      title="Remover item"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              ))}

                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs text-muted-foreground">
                                  {itemLabel}: {normalizedItems.length}/{PSET_UPDATE_ITEM_LIMIT}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => addPsetUpdateActionItem(updateAction.id)}
                                  disabled={updateAction.items.length >= PSET_UPDATE_ITEM_LIMIT}
                                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm ${
                                    updateAction.items.length >= PSET_UPDATE_ITEM_LIMIT
                                      ? 'opacity-50 cursor-not-allowed'
                                      : 'hover:bg-muted/40'
                                  }`}
                                >
                                  <Plus className="w-4 h-4" />
                                  {addLabel}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </>
              )}

              {categoryId === 'aws-roles' && (
                <>
                  {isCreateAction ? (
                    <FormField
                      label="Nome da Role"
                      required
                      help="Padrao: AWS_RL_<NOME_DA_ROLE>_PRD|HML|DEV."
                    >
                      <TaxonomySegmentField
                        prefix="AWS_RL_"
                        suffix={roleTaxonomySuffix}
                        placeholder="NOME_DA_ROLE"
                        value={roleNameSegment}
                        onChange={setRoleNameSegment}
                        previewLabel="Role que será criada:"
                        previewItems={rolesToBeCreated.map((role) => role.roleName)}
                        previewEmptyText="Selecione a conta AWS para visualizar o nome final da role."
                        required
                      />
                    </FormField>
                  ) : (
                    <div className="md:col-span-2">
                      <FormField
                        label={`Role alvo para ${roleTargetActionLabel}`}
                        required
                        help="Informe a role em texto livre. O ambiente sera identificado automaticamente pela conta selecionada."
                      >
                        <div className="space-y-2">
                          <InputField
                            placeholder="Ex: legacy-lambda-integration-role ou arn:aws:iam::123456789012:role/legacy-role"
                            value={roleDeleteTargets[0]?.roleName || ''}
                            onChange={(value) => updateRoleDeleteTargetName(0, value)}
                            required
                          />
                          <p className="text-xs text-muted-foreground">
                            Informe somente a role alvo.
                          </p>
                        </div>
                      </FormField>
                    </div>
                  )}
                  {isCreateAction && (
                    <>
                      <FormField label="Trusted Entity" required>
                        <SelectField
                          options={toOptions(['AWS Service', 'AWS Account', 'Federated', 'Web Identity'])}
                          value={roleTrustedEntity}
                          onChange={(value) => {
                            setRoleTrustedEntity(value);
                            setRoleTrustedPrincipals(['']);
                          }}
                          required
                        />
                      </FormField>
                      <div className="md:col-span-2">
                        <FormField
                          label="Principal(is) Confiavel(is)"
                          required
                          help={trustedPrincipalConfig.help}
                        >
                          <div className="space-y-2">
                            {roleTrustedPrincipals.map((principal, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <InputField
                                  placeholder={trustedPrincipalConfig.placeholder}
                                  value={principal}
                                  onChange={(value) => updateRoleTrustedPrincipal(index, value)}
                                  required={index === 0}
                                />
                                {roleTrustedPrincipals.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeRoleTrustedPrincipal(index)}
                                    className="px-3 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted/40"
                                    aria-label={`Remover principal ${index + 1}`}
                                    title="Remover principal"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-muted-foreground">
                                Exemplo: <span className="font-mono">{trustedPrincipalConfig.example}</span>
                              </p>
                              <button
                                type="button"
                                onClick={addRoleTrustedPrincipal}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted/40"
                              >
                                <Plus className="w-4 h-4" />
                                Adicionar principal
                              </button>
                            </div>
                          </div>
                        </FormField>
                      </div>
                      <div className="md:col-span-2 space-y-3">
                        <FormField
                          label="Permissões Iniciais da Role"
                          required
                          help="Escolha se a role será criada vazia ou com attach de policies já existentes."
                        >
                          <SelectField
                            options={rolePermissionModeOptions}
                            value={rolePermissionMode}
                            onChange={(value) => {
                              setRolePermissionMode(value as RolePermissionMode);
                              setRoleAttachedPolicies(['']);
                            }}
                            required
                          />
                        </FormField>

                        {rolePermissionMode === 'none' && (
                          <div className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                            A role será criada sem nenhuma permission policy anexada.
                          </div>
                        )}

                        {rolePermissionMode === 'attach-existing' && (
                          <FormField
                            label="Policies Existentes para Attach"
                            required
                            help="Informe nome ou ARN de cada policy existente a ser anexada."
                          >
                            <div className="space-y-2">
                              {roleAttachedPolicies.map((policy, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <InputField
                                    placeholder="Ex: arn:aws:iam::aws:policy/ReadOnlyAccess"
                                    value={policy}
                                    onChange={(value) => updateRoleAttachedPolicy(index, value)}
                                    required={index === 0}
                                  />
                                  {roleAttachedPolicies.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeRoleAttachedPolicy(index)}
                                      className="px-3 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted/40"
                                      aria-label={`Remover policy ${index + 1}`}
                                      title="Remover policy"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={addRoleAttachedPolicy}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted/40"
                              >
                                <Plus className="w-4 h-4" />
                                Adicionar policy
                              </button>
                            </div>
                          </FormField>
                        )}
                      </div>
                    </>
                  )}
                  {isUpdateAction && (
                    <>
                      <div className="md:col-span-2">
                        <FormField
                          label="Acoes da Alteracao da Role"
                          required
                          help="Selecione ao menos uma acao. Ao adicionar a acao, informe exatamente o que deve ser executado."
                        >
                          <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row gap-2">
                              <SelectField
                                options={roleUpdateActionOptions}
                                value={roleUpdatePendingAction}
                                onChange={(value) => setRoleUpdatePendingAction(value as RoleUpdateActionType)}
                                placeholder="Selecione a acao..."
                              />
                              <button
                                type="button"
                                onClick={addRoleUpdateAction}
                                disabled={!roleUpdatePendingAction}
                                className={`inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-border text-sm ${
                                  !roleUpdatePendingAction ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted/40'
                                }`}
                              >
                                <Plus className="w-4 h-4" />
                                Adicionar acao
                              </button>
                            </div>

                            <p className="text-xs text-muted-foreground">
                              Selecione ao menos uma opcao: Adicionar policy, Remover policy, Adicionar Trusted Entity, Alterar Trusted Entity ou Remover Trusted Entity.
                            </p>

                            {roleUpdateValidationError && (
                              <p className="text-xs text-destructive">{roleUpdateValidationError}</p>
                            )}
                          </div>
                        </FormField>
                      </div>

                      {roleUpdateActions.map((updateAction) => {
                        const actionDefinition = getRoleUpdateActionDefinition(updateAction.type);
                        if (!actionDefinition) return null;

                        const isPolicyMode = actionDefinition.mode === 'policy-list';
                        const normalizedPolicies = updateAction.policies
                          .map((policy) => policy.trim())
                          .filter((policy) => policy.length > 0);

                        return (
                          <div key={updateAction.id} className="md:col-span-2 rounded-lg border border-border bg-muted/10 px-3 py-3 space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium">{actionDefinition.label}</p>
                              <button
                                type="button"
                                onClick={() => removeRoleUpdateAction(updateAction.id)}
                                className="px-2 py-1 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted/40"
                              >
                                Remover acao
                              </button>
                            </div>

                            <p className="text-xs text-muted-foreground">{actionDefinition.description}</p>

                            {isPolicyMode ? (
                              <div className="space-y-2">
                                {updateAction.policies.map((policy, index) => (
                                  <div key={`${updateAction.id}-policy-${index}`} className="flex items-center gap-2">
                                    <InputField
                                      placeholder="Ex: arn:aws:iam::aws:policy/ReadOnlyAccess"
                                      value={policy}
                                      onChange={(value) => updateRoleUpdateActionPolicy(updateAction.id, index, value)}
                                      required={index === 0}
                                    />
                                    {updateAction.policies.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeRoleUpdateActionPolicy(updateAction.id, index)}
                                        className="px-3 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted/40"
                                        aria-label={`Remover policy ${index + 1}`}
                                        title="Remover policy"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                ))}

                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-xs text-muted-foreground">
                                    Policies informadas: {normalizedPolicies.length}/{ROLE_UPDATE_POLICY_LIMIT}
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => addRoleUpdateActionPolicy(updateAction.id)}
                                    disabled={updateAction.policies.length >= ROLE_UPDATE_POLICY_LIMIT}
                                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm ${
                                      updateAction.policies.length >= ROLE_UPDATE_POLICY_LIMIT
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:bg-muted/40'
                                    }`}
                                  >
                                    <Plus className="w-4 h-4" />
                                    Adicionar policy
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <TextAreaField
                                placeholder={actionDefinition.placeholder || 'Descreva objetivamente a alteracao solicitada.'}
                                rows={3}
                                value={updateAction.details}
                                onChange={(value) => updateRoleUpdateActionDetails(updateAction.id, value)}
                                required
                              />
                            )}
                          </div>
                        );
                      })}
                    </>
                  )}
                </>
              )}

              {categoryId === 'aws-policies' && (
                <>
                  {isCreateAction ? (
                    <FormField label="Nome da Policy (Taxonomia)" required help="Padrao: AWS_PL_<NOME_DA_POLICY>_PRD|HML|DEV.">
                      <TaxonomySegmentField
                        prefix="AWS_PL_"
                        suffix={`_${profileGroupEnvironmentSuffix}`}
                        placeholder="NOME_DA_POLICY"
                        hidePreview
                        required
                      />
                    </FormField>
                  ) : (
                    <FormField label="Policy Alvo (nome/ARN)" required>
                      <InputField placeholder="Ex: PL-PGW-PRD-BLOCK-CLOUDTRAIL-DELETE" required />
                    </FormField>
                  )}
                  {isCreateAction && (
                    <>
                      <div className="md:col-span-2">
                        <FormField
                          label="Actions Necessarias"
                          required
                          help="Liste as actions IAM necessarias para a policy managed."
                        >
                          <TextArea placeholder="Ex: s3:GetObject, s3:PutObject, s3:ListBucket" rows={3} required />
                        </FormField>
                      </div>
                      <div className="md:col-span-2">
                        <FormField
                          label="Resources"
                          required
                          help="Informe o nome exato do recurso AWS (nao descricao em texto livre). Se preferir, voce pode informar ARN."
                        >
                          <TextArea placeholder="Ex: bucket-logs-aplicacao-prd (nome exato) ou arn:aws:s3:::bucket-logs-aplicacao-prd/*" rows={3} required />
                        </FormField>
                      </div>
                      <div className="md:col-span-2">
                        <FormField
                          label="Conditions (opcional)"
                          help="Se necessario, informe condicoes IAM para restringir a policy."
                        >
                          <TextArea placeholder="Ex: StringEquals aws:SourceVpce=vpce-0123456789abcdef0" rows={3} />
                        </FormField>
                      </div>
                    </>
                  )}
                  {isUpdateAction && (
                    <>
                      <div className="md:col-span-2">
                        <FormField
                          label="Alterações Solicitadas na Policy"
                          required
                          help="Descreva exatamente o que deve mudar na policy."
                        >
                          <TextArea placeholder="Ex: adicionar statement para permitir ação X e remover statement Y." required />
                        </FormField>
                      </div>
                    </>
                  )}
                  {isDeleteAction && (
                    <div className="md:col-span-2">
                      <FormField label="Plano de Remoção e Reversão" required>
                        <TextArea placeholder="Descreva como desanexar e restaurar a policy anterior caso necessário." required />
                      </FormField>
                    </div>
                  )}
                </>
              )}

              {categoryId === 'aws-audit' && isCreateAction && (
                <>
                  <FormField label="Escopo da Auditoria" required>
                    <SelectField options={toOptions(['Permissões IAM', 'Roles e Policies', 'Acessos privilegiados', 'Baseline de segurança'])} required />
                  </FormField>
                  <FormField label="Período de Referência" required>
                    <SelectField options={toOptions(['Últimos 30 dias', 'Últimos 90 dias', 'Últimos 6 meses'])} required />
                  </FormField>
                </>
              )}

              {categoryId === 'aws-audit' && isUpdateAction && (
                <>
                  <FormField label="ID da Auditoria" required>
                    <InputField placeholder="Ex: AWS-AUD-90001" required />
                  </FormField>
                  <div className="md:col-span-2">
                    <FormField
                      label="Alterações Solicitadas na Auditoria"
                      required
                      help="Descreva exatamente os ajustes desejados na auditoria em andamento."
                    >
                      <TextArea placeholder="Ex: ampliar escopo para roles críticas e estender prazo por 15 dias." required />
                    </FormField>
                  </div>
                </>
              )}

              {categoryId === 'aws-audit' && isDeleteAction && (
                <>
                  <FormField label="ID da Auditoria" required>
                    <InputField placeholder="Ex: AWS-AUD-90001" required />
                  </FormField>
                  <FormField label="Parecer Final" required>
                    <SelectField options={toOptions(['Conforme', 'Conforme com ressalvas', 'Não conforme'])} required />
                  </FormField>
                </>
              )}

              {categoryId === 'aws-emergency' && isCreateAction && (
                <>
                  <FormField label="Incidente Relacionado" required>
                    <InputField placeholder="Ex: INC-2026-0042" required />
                  </FormField>
                  <FormField label="Tipo de Acesso" required>
                    <SelectField options={toOptions(['Leitura', 'Operador', 'Administrador restrito', 'Administrador'])} required />
                  </FormField>
                  <FormField label="Identidade que Receberá Acesso" required>
                    <InputField placeholder="Ex: analista@corp.com" required />
                  </FormField>
                  <FormField label="Duração Máxima" required>
                    <SelectField options={toOptions(['30 minutos', '1 hora', '2 horas', '4 horas'])} required />
                  </FormField>
                </>
              )}

              {categoryId === 'aws-emergency' && isUpdateAction && (
                <>
                  <FormField label="Ticket BG em Andamento" required>
                    <InputField placeholder="Ex: AWS-BG-95001" required />
                  </FormField>
                  <div className="md:col-span-2">
                    <FormField
                      label="Alterações Solicitadas no Acesso Emergencial"
                      required
                      help="Descreva exatamente o ajuste desejado para o acesso emergencial."
                    >
                      <TextArea placeholder="Ex: estender duração para 2h e restringir ações ao escopo X." required />
                    </FormField>
                  </div>
                </>
              )}

              {categoryId === 'aws-emergency' && isDeleteAction && (
                <>
                  <FormField label="Ticket BG em Andamento" required>
                    <InputField placeholder="Ex: AWS-BG-95001" required />
                  </FormField>
                  <div className="md:col-span-2">
                    <FormField label="Evidência de Revogação" required>
                      <TextArea placeholder="Descreva evidências de encerramento e revogação do acesso emergencial." required />
                    </FormField>
                  </div>
                </>
              )}

            </div>
          ) : (
            <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
              Selecione a ação da solicitação para liberar os campos específicos.
            </div>
          )}

          <div className="space-y-2">
            <FormField
              label={
                isBreakingGlass
                  ? 'Justificativa Emergencial'
                  : (categoryId === 'aws-accounts' && isCreateAction
                    ? 'Justificativa da criação'
                    : (isAwsInformationCategory && isCreateAction
                      ? 'Justificativa do levantamento'
                      : 'Justificativa'))
              }
              required
            >
              <TextAreaField
                placeholder={
                  isBreakingGlass
                    ? 'Descreva o incidente, impacto e necessidade do acesso emergencial.'
                    : (categoryId === 'aws-accounts' && isCreateAction
                      ? 'Descreva a justificativa da criação da conta AWS.'
                      : (isAwsInformationCategory && isCreateAction
                        ? 'Descreva o objetivo do levantamento, o contexto da demanda e o resultado esperado.'
                        : 'Descreva objetivamente a necessidade da solicitação.'))
                }
                rows={4}
                value={justification}
                onChange={setJustification}
                required
              />
            </FormField>
            <FormField label="Comentários">
              <TextAreaField
                placeholder="Comentário adicional (opcional)."
                rows={3}
                value={comments}
                onChange={setComments}
              />
            </FormField>
            <FormField
              label="Upload de Anexos (opcional)"
            >
              <div className="space-y-2">
                <input
                  type="file"
                  accept={justificationEvidenceAccept}
                  multiple
                  onChange={(event) =>
                    setJustificationEvidenceNames(Array.from(event.target.files || []).map((file) => file.name))
                  }
                  className="input-field w-full cursor-pointer file:mr-3 file:rounded file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Formatos aceitos: PDF, PNG, JPG, TXT, CSV, XLS, XLSX, DOC, DOCX e JSON.
                </p>
                {justificationEvidenceNames.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {justificationEvidenceNames.length} arquivo(s) selecionado(s): {justificationEvidenceNames.join(', ')}
                  </p>
                )}
              </div>
            </FormField>
          </div>
            </>
          )}

          {isReviewMode && (
            <div className="space-y-4 rounded-xl border border-border bg-muted/10 p-4">
              <h2 className="text-base font-semibold">Revisão da Solicitação</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-border bg-background px-3 py-2">
                  <p className="text-xs text-muted-foreground">Categoria</p>
                  <p className="font-medium">{category.name}</p>
                </div>
                <div className="rounded-lg border border-border bg-background px-3 py-2">
                  <p className="text-xs text-muted-foreground">Ação</p>
                  <p className="font-medium">{effectiveRequestType?.name || 'Não definida'}</p>
                </div>
                <div className="rounded-lg border border-border bg-background px-3 py-2">
                  <p className="text-xs text-muted-foreground">Escopo</p>
                  <p className="font-medium">
                    {requiresExistingAccount
                      ? selectedAccounts.length === 1
                        ? `${selectedAccounts[0].id} - ${selectedAccounts[0].name}`
                        : 'Conta AWS não selecionada'
                      : (categoryId === 'aws-accounts' && isCreateAction
                        ? 'Criação de nova conta AWS'
                        : (isAwsInformationCategory
                          ? 'Escopo informado no formulario de levantamento'
                          : 'Escopo nao selecionado'))}
                  </p>
                </div>
              </div>

              {requiresExistingAccount && (
                <div className="rounded-lg border border-border bg-background px-3 py-2">
                  <p className="text-xs text-muted-foreground mb-2">Conta selecionada (número, nome e tipo)</p>
                  <div className="space-y-1">
                    {selectedAccounts.map((account) => (
                      <p key={account.id} className="text-sm">
                        {account.id} - {account.name}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {categoryId === 'aws-roles' && isCreateAction && (
                <div className="rounded-lg border border-border bg-background px-3 py-2">
                  <p className="text-xs text-muted-foreground mb-2">Role que será criada</p>
                  <div className="space-y-2">
                    {rolesToBeCreated.length > 0 ? (
                      rolesToBeCreated.map((role) => (
                        <div key={role.environment} className="rounded-md border border-border bg-muted/20 px-3 py-2">
                          <p className="text-sm">
                            <span className="text-muted-foreground">Role:</span>{' '}
                            <span className="font-mono">{role.roleName}</span>
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Ambiente:</span> {role.environment}
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Policies vinculadas:</span>{' '}
                            {rolePermissionMode === 'attach-existing'
                              ? normalizedRoleAttachedPolicies.length > 0
                                ? normalizedRoleAttachedPolicies.join(', ')
                                : 'Nenhuma policy informada'
                              : 'Nenhuma (criação sem permissões iniciais)'}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhuma role definida para criação.</p>
                    )}
                  </div>
                </div>
              )}

              {categoryId === 'aws-roles' && !isCreateAction && (
                <div className="rounded-lg border border-border bg-background px-3 py-2">
                  <p className="text-xs text-muted-foreground mb-2">
                    {isDeleteAction ? 'Role que será removida' : 'Role que será alterada'}
                  </p>
                  <div className="space-y-2">
                    {rolesToBeTargeted.length > 0 ? (
                      rolesToBeTargeted.map((target, index) => (
                        <div key={`${target}-${index}`} className="rounded-md border border-border bg-muted/20 px-3 py-2">
                          <p className="text-sm">
                            <span className="text-muted-foreground">Role:</span>{' '}
                            <span className="font-mono">{target}</span>
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Ambiente:</span> {profileGroupEnvironmentSuffix}
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Conta:</span>{' '}
                            {selectedAccounts[0] ? `${selectedAccounts[0].id} - ${selectedAccounts[0].name}` : 'Conta nao selecionada'}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {isDeleteAction ? 'Nenhuma role definida para remoção.' : 'Nenhuma role definida para alteração.'}
                      </p>
                    )}
                  </div>

                  {isUpdateAction && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-muted-foreground">Acoes solicitadas para alteracao</p>
                      {roleUpdateActions.length > 0 ? (
                        roleUpdateActions.map((updateAction) => {
                          const actionDefinition = getRoleUpdateActionDefinition(updateAction.type);
                          if (!actionDefinition) return null;

                          const normalizedPolicies = updateAction.policies
                            .map((policy) => policy.trim())
                            .filter((policy) => policy.length > 0);

                          return (
                            <div key={`review-${updateAction.id}`} className="rounded-md border border-border bg-muted/20 px-3 py-2">
                              <p className="text-sm">
                                <span className="text-muted-foreground">Acao:</span> {actionDefinition.label}
                              </p>
                              {actionDefinition.mode === 'policy-list' ? (
                                <p className="text-sm">
                                  <span className="text-muted-foreground">Policies:</span>{' '}
                                  {normalizedPolicies.length > 0 ? normalizedPolicies.join(', ') : 'Nenhuma policy informada'}
                                </p>
                              ) : (
                                <p className="text-sm">
                                  <span className="text-muted-foreground">Detalhamento:</span>{' '}
                                  {updateAction.details.trim() || 'Nao informado'}
                                </p>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm text-muted-foreground">Nenhuma acao de alteracao informada.</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {categoryId === 'aws-iam-groups' && isUpdateAction && (
                <div className="rounded-lg border border-border bg-background px-3 py-2">
                  <p className="text-xs text-muted-foreground mb-2">Acoes solicitadas para alteracao do grupo IAM</p>
                  {groupUpdateActions.length > 0 ? (
                    <div className="space-y-2">
                      {groupUpdateActions.map((updateAction) => {
                        const actionDefinition = getGroupUpdateActionDefinition(updateAction.type);
                        if (!actionDefinition) return null;

                        const normalizedItems = updateAction.items
                          .map((item) => item.trim())
                          .filter((item) => item.length > 0);
                        const itemLabel = actionDefinition.mode === 'policy-list' ? 'Policies' : 'Usuarios';

                        return (
                          <div key={`review-${updateAction.id}`} className="rounded-md border border-border bg-muted/20 px-3 py-2">
                            <p className="text-sm">
                              <span className="text-muted-foreground">Acao:</span> {actionDefinition.label}
                            </p>
                            <p className="text-sm">
                              <span className="text-muted-foreground">{itemLabel}:</span>{' '}
                              {normalizedItems.length > 0 ? normalizedItems.join(', ') : 'Nenhum item informado'}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma acao de alteracao informada.</p>
                  )}
                </div>
              )}

              {categoryId === 'aws-iam-users' && isUpdateAction && (
                <div className="rounded-lg border border-border bg-background px-3 py-2">
                  <p className="text-xs text-muted-foreground mb-2">Acoes solicitadas para alteracao do usuario IAM</p>
                  {userUpdateActions.length > 0 ? (
                    <div className="space-y-2">
                      {userUpdateActions.map((updateAction) => {
                        const actionDefinition = getUserUpdateActionDefinition(updateAction.type);
                        if (!actionDefinition) return null;

                        const normalizedItems = updateAction.items
                          .map((item) => item.trim())
                          .filter((item) => item.length > 0);
                        const itemLabel = actionDefinition.mode === 'policy-list'
                          ? 'Policies'
                          : actionDefinition.mode === 'group-list'
                            ? 'Grupos'
                            : 'Keys';

                        return (
                          <div key={`review-${updateAction.id}`} className="rounded-md border border-border bg-muted/20 px-3 py-2">
                            <p className="text-sm">
                              <span className="text-muted-foreground">Acao:</span> {actionDefinition.label}
                            </p>
                            <p className="text-sm">
                              <span className="text-muted-foreground">{itemLabel}:</span>{' '}
                              {normalizedItems.length > 0 ? normalizedItems.join(', ') : 'Nenhum item informado'}
                            </p>
                            {updateAction.type === 'rotate-key' && (
                              <p className="text-sm">
                                <span className="text-muted-foreground">Regra:</span> key atual desativada; exclusao automatica apos 7 dias sem solicitacao de reativacao.
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma acao de alteracao informada.</p>
                  )}
                </div>
              )}

              {categoryId === 'aws-psets' && isUpdateAction && (
                <div className="rounded-lg border border-border bg-background px-3 py-2">
                  <p className="text-xs text-muted-foreground mb-2">Acoes solicitadas para alteracao do PSET</p>
                  {psetUpdateActions.length > 0 ? (
                    <div className="space-y-2">
                      {psetUpdateActions.map((updateAction) => {
                        const actionDefinition = getPsetUpdateActionDefinition(updateAction.type);
                        if (!actionDefinition) return null;

                        const normalizedItems = updateAction.items
                          .map((item) => item.trim())
                          .filter((item) => item.length > 0);
                        const itemLabel = actionDefinition.mode === 'policy-list' ? 'Policies' : 'Contas AWS';

                        return (
                          <div key={`review-${updateAction.id}`} className="rounded-md border border-border bg-muted/20 px-3 py-2">
                            <p className="text-sm">
                              <span className="text-muted-foreground">Acao:</span> {actionDefinition.label}
                            </p>
                            <p className="text-sm">
                              <span className="text-muted-foreground">{itemLabel}:</span>{' '}
                              {normalizedItems.length > 0 ? normalizedItems.join(', ') : 'Nenhum item informado'}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma acao de alteracao informada.</p>
                  )}
                </div>
              )}

              {isAwsInformationCategory && isCreateAction && (
                <div className="rounded-lg border border-border bg-background px-3 py-2">
                  <p className="text-xs text-muted-foreground mb-2">Resumo do levantamento AWS</p>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Descricao do levantamento:</span> {awsInfoRequestedData || 'Nao informado'}</p>
                  </div>
                </div>
              )}

              <div className="rounded-lg border border-border bg-background px-3 py-2">
                <p className="text-xs text-muted-foreground mb-1">Justificativa</p>
                <p className="text-sm">{justification || 'Não informada'}</p>
              </div>
              <div className="rounded-lg border border-border bg-background px-3 py-2">
                <p className="text-xs text-muted-foreground mb-1">Comentários</p>
                <p className="text-sm">{comments || 'Nenhum comentário informado.'}</p>
              </div>
              <div className="rounded-lg border border-border bg-background px-3 py-2">
                <p className="text-xs text-muted-foreground mb-1">Anexos</p>
                {justificationEvidenceNames.length > 0 ? (
                  <div className="space-y-1">
                    {justificationEvidenceNames.map((fileName) => (
                      <p key={fileName} className="text-sm">{fileName}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum arquivo anexado.</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            {!isReviewMode && (
              <button
                type="submit"
                disabled={!effectiveRequestType}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-opacity ${
                  isBreakingGlass ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground'
                } ${!effectiveRequestType ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Revisar Solicitação
              </button>
            )}

            {isReviewMode && (
              <>
                <button
                  type="button"
                  onClick={() => setIsReviewMode(false)}
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold border border-border hover:bg-muted/40"
                >
                  Voltar para Edição
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold ${
                    isBreakingGlass ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {submitLabel}
                </button>
              </>
            )}
          </div>
        </form>
        </TooltipScopeContext.Provider>
      </div>
    </Layout>
  );
}




