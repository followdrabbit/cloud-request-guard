import { spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const HOST = process.env.SCREENSHOT_HOST || '127.0.0.1';
const PORT = process.env.SCREENSHOT_PORT || '4173';
const BASE_URL = process.env.SCREENSHOT_BASE_URL || `http://${HOST}:${PORT}`;
const SCREENSHOT_ROOT = path.resolve('docs', 'screenshots', 'categories');
const MANIFEST_PATH = path.join(SCREENSHOT_ROOT, 'manifest.json');
const MOCK_JSON_ATTACHMENT_PATH = path.join(SCREENSHOT_ROOT, '_mock-request.json');
const STARTUP_TIMEOUT_MS = 120_000;
const FORM_WAIT_MS = 600;
const ROLE_UPDATE_POLICY_MOCKS = [
  'arn:aws:iam::aws:policy/SecurityAudit',
  'arn:aws:iam::123456789012:policy/AWS_PL_APP_LOG_READ_PRD',
  'arn:aws:iam::aws:policy/PowerUserAccess',
  'arn:aws:iam::123456789012:policy/AWS_PL_LEGACY_ADMIN_PRD',
];
const GROUP_UPDATE_POLICY_MOCKS = [
  'arn:aws:iam::aws:policy/SecurityAudit',
  'arn:aws:iam::123456789012:policy/AWS_PL_APP_LOG_READ_PRD',
  'arn:aws:iam::aws:policy/ReadOnlyAccess',
  'arn:aws:iam::123456789012:policy/AWS_PL_SUPPORT_BASE_PRD',
];
const GROUP_UPDATE_USER_MOCKS = [
  'usuario-batch-integracao',
  'arn:aws:iam::123456789012:user/usuario-batch-integracao',
  'usuario-app-monitoramento',
  'arn:aws:iam::123456789012:user/usuario-app-monitoramento',
];
const PSET_CREATE_POLICY_MOCKS = [
  'ReadOnlyAccess',
  'CloudWatchReadOnlyAccess',
  'SecurityAudit',
];
const PSET_UPDATE_POLICY_MOCKS = [
  'CloudWatchReadOnlyAccess',
  'ReadOnlyAccess',
  'SecurityAudit',
  'IAMReadOnlyAccess',
];
const PSET_UPDATE_ACCOUNT_MOCKS = [
  '123456789012 (prd-payment-gateway)',
  '210987654321 (hml-payment-gateway)',
  '345678901234 (dev-payment-gateway)',
  '987654321098 (prd-billing-gateway)',
];
const ROLE_UPDATE_DETAIL_MOCKS = [
  {
    placeholder: 'Ex: adicionar service principal events.amazonaws.com no trust da role.',
    value: 'Adicionar service principal events.amazonaws.com para permitir execucao do EventBridge Scheduler na role alvo.',
  },
  {
    placeholder: 'Ex: substituir arn:aws:iam::123456789012:root por arn:aws:iam::210987654321:root.',
    value: 'Substituir principal arn:aws:iam::123456789012:root por arn:aws:iam::210987654321:root para alinhar com a nova conta de automacao.',
  },
  {
    placeholder: 'Ex: remover federated principal arn:aws:iam::123456789012:saml-provider/Okta.',
    value: 'Remover federated principal arn:aws:iam::123456789012:saml-provider/Okta legado apos migracao para IAM Identity Center.',
  },
];
const REQUEST_JUSTIFICATION_BY_TYPE = {
  'account-create': 'Criacao de conta AWS dedicada para novo workload de pagamentos, com isolamento de custos, baseline de seguranca e rastreabilidade corporativa.',
  'account-update': 'Ajuste de guardrails e ownership da conta para manter conformidade com requisitos de seguranca e governanca cloud.',
  'account-delete': 'Descomissionamento controlado da conta apos migracao de workloads, com retencao de evidencias e plano de reversao validado.',
  'info-create': 'Levantamento solicitado para consolidar dump de roles, policies e recursos AWS, com foco em risco, compliance e planejamento de remediacao.',
  'profile-create': 'Criacao de perfil corporativo para equipe operacional com acesso padronizado via AD e Identity Center em contas alvo.',
  'profile-update': 'Atualizacao do perfil corporativo para refletir novo escopo de contas e permissoes, mantendo menor privilegio.',
  'profile-delete': 'Remocao de perfil corporativo legado apos migracao dos usuarios para perfil substituto aprovado pela governanca.',
  'iam-user-create': 'Criacao excepcional de usuario IAM de servico para integracao legada sem suporte a federacao corporativa, com acesso programatico implicito.',
  'iam-user-update': 'Ajuste estruturado no usuario IAM para adicionar/remover policy e grupo, com rotacao de key seguindo janela de reativacao de 7 dias.',
  'iam-user-delete': 'Remocao de usuario IAM obsoleto apos revogacao de access keys e validacao de ausencia de dependencias ativas.',
  'iam-group-create': 'Criacao de grupo IAM para consolidar permissoes de operacao, iniciando sem permissao ou com attach de policies existentes.',
  'iam-group-update': 'Ajuste de policies e membership do grupo IAM para alinhar acessos ao menor privilegio exigido pelo processo.',
  'iam-group-delete': 'Remocao de grupo IAM legado com migracao planejada de membros para grupo substituto controlado.',
  'pset-create': 'Criacao de PSET para padronizar acesso da equipe no Identity Center com trilha de aprovacao formal.',
  'pset-update': 'Alteracao estruturada do PSET para adicionar/remover policies e adicionar/remover atribuicoes por conta AWS.',
  'pset-delete': 'Remocao de PSET descontinuado apos migracao das atribuicoes para conjunto de permissoes vigente.',
  'role-create': 'Criacao de role para workload de aplicacao, com trust policy definida e escopo minimo de permissao.',
  'role-update': 'Alteracao da role para ajustar trust e policies conforme nova arquitetura e achados de auditoria.',
  'role-delete': 'Remocao de role sem uso operacional, com validacao de impactos e plano de contingencia registrado.',
  'policy-create': 'Criacao de policy para reforcar controle preventivo em ambiente critico, com actions/resources/conditions revisados pelo time de seguranca.',
  'policy-update': 'Atualizacao de statements da policy para corrigir excesso de privilegios e adequar a regras de conformidade.',
  'policy-delete': 'Remocao de policy substituida por versao consolidada, com desanexacao planejada e rollback definido.',
  'audit-create': 'Abertura de auditoria para revisar permissoes privilegiadas e aderencia ao baseline de seguranca no periodo informado.',
  'audit-update': 'Ajuste de escopo da auditoria para incluir novas contas e controles criticos identificados durante a analise.',
  'audit-close': 'Encerramento da auditoria com consolidacao de evidencias, parecer final e plano de remediacao aprovado.',
  'bg-create': 'Incidente critico ativo em producao; acesso emergencial temporario necessario para restaurar servico com rastreabilidade completa.',
  'bg-update': 'Ajuste emergencial de escopo e tempo de acesso para concluir estabilizacao do incidente sem ampliar privilegios alem do necessario.',
  'bg-revoke': 'Revogacao imediata do acesso emergencial apos contencao do incidente e coleta de evidencias de encerramento.',
};
const REQUEST_COMMENT_BY_TYPE = {
  'account-create': 'Executar provisioning com baseline corporativa e confirmar tags obrigatorias de custo e compliance.',
  'account-update': 'Aplicar mudanca em janela de menor impacto e registrar validacao de controles apos execucao.',
  'account-delete': 'Concluir checklist de descomissionamento antes do fechamento definitivo do chamado.',
  'info-create': 'Executar o levantamento no escopo amplo solicitado e destacar no retorno os itens criticos e inconsistencias encontradas.',
  'profile-create': 'Validar associacao com grupo AD e testes de acesso em ambiente de homologacao.',
  'profile-update': 'Comunicar equipes impactadas sobre alteracao de perfil e horario da mudanca.',
  'profile-delete': 'Confirmar migracao dos usuarios antes de remover o perfil legado.',
  'iam-user-create': 'Definir rotacao de credenciais e monitoramento de uso desde a ativacao.',
  'iam-user-update': 'Registrar as acoes de policy/grupo e garantir que a key antiga seja desativada; se nao houver reativacao em 7 dias, a exclusao deve ser executada.',
  'iam-user-delete': 'Registrar evidencia de revogacao de credenciais no anexo do chamado.',
  'iam-group-create': 'Se optar por attach, adicionar somente policies previamente aprovadas pela seguranca.',
  'iam-group-update': 'Executar revisao cruzada de policies e usuarios afetados antes da aplicacao em producao.',
  'iam-group-delete': 'Validar usuarios remanescentes no grupo antes da exclusao definitiva.',
  'pset-create': 'Confirmar policies do PSET e executar teste de acesso apos sincronizacao no Identity Center.',
  'pset-update': 'Executar as acoes por etapa (policy e conta) e validar atribuicoes finais do PSET apos a mudanca.',
  'pset-delete': 'Remover atribuicoes do PSET antes de excluir definicao no Identity Center.',
  'role-create': 'Anexar evidencias de trust e permission policy aprovadas para execucao.',
  'role-update': 'Priorizar remocao de privilegios excessivos antes de incluir novos acessos.',
  'role-delete': 'Confirmar inexistencia de workloads consumindo a role alvo.',
  'policy-create': 'Validar actions/resources/conditions com seguranca antes de publicar a policy em producao.',
  'policy-update': 'Registrar diff da policy e resultado de validacao em ambiente nao produtivo.',
  'policy-delete': 'Executar remocao gradativa para evitar impacto em entidades dependentes.',
  'audit-create': 'Compartilhar cronograma e escopo com os responsaveis tecnicos das contas alvo.',
  'audit-update': 'Atualizar stakeholders sobre novo escopo e prazo estimado de conclusao.',
  'audit-close': 'Publicar resumo executivo com achados e recomendacoes de remediacao.',
  'bg-create': 'Manter monitoramento em tempo real durante toda a janela emergencial.',
  'bg-update': 'Revalidar necessidade de extensao com time de seguranca antes da aprovacao.',
  'bg-revoke': 'Encerrar sessoes ativas e confirmar retorno ao baseline de privilegios.',
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Server is not ready yet.
    }

    await sleep(1_000);
  }

  throw new Error(`Tempo limite ao aguardar servidor em ${url}`);
}

function dedupe(values) {
  return [...new Set(values)];
}

function normalizeText(value = '') {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function getDevServerCommand() {
  if (process.platform === 'win32') {
    return {
      command: 'cmd.exe',
      args: ['/c', 'npm', 'run', 'dev', '--', '--host', HOST, '--port', PORT],
    };
  }

  return {
    command: 'npm',
    args: ['run', 'dev', '--', '--host', HOST, '--port', PORT],
  };
}

async function stopProcessTree(childProcess) {
  if (process.platform === 'win32' && childProcess.pid) {
    const killer = spawn('taskkill', ['/PID', String(childProcess.pid), '/T', '/F'], {
      stdio: 'ignore',
      shell: false,
    });

    await new Promise((resolve) => {
      killer.once('exit', resolve);
      killer.once('error', resolve);
    });
    return;
  }

  childProcess.kill('SIGTERM');
}

function getCategoryIdFromPath(routePath) {
  const parts = routePath.split('/').filter(Boolean);
  return parts[1] || 'unknown-category';
}

function getRequestTypeIdFromPath(routePath) {
  const parts = routePath.split('/').filter(Boolean);
  return parts[3] || 'unknown-request-type';
}

function normalizeProductName(accountName) {
  return accountName
    .trim()
    .toLowerCase()
    .replace(/^(prd|prod|hml|homo|homolog|dev|des)[-_]/, '');
}

function getEnvironmentTokenFromAccountName(accountName) {
  const normalized = accountName.trim().toLowerCase();
  if (normalized.startsWith('prd') || normalized.startsWith('prod')) return 'prd';
  if (normalized.startsWith('hml') || normalized.startsWith('homo') || normalized.startsWith('homolog')) return 'hml';
  if (normalized.startsWith('dev') || normalized.startsWith('des')) return 'dev';
  return 'unknown';
}

function extractAccountNameFromOptionLabel(label) {
  const match = label.match(/\(([^)]+)\)/);
  if (!match) return null;
  return match[1];
}

async function getSelectOptions(selectLocator) {
  const optionLocators = selectLocator.locator('option');
  const count = await optionLocators.count();
  const options = [];

  for (let i = 0; i < count; i += 1) {
    const option = optionLocators.nth(i);
    const value = await option.getAttribute('value');
    const disabled = (await option.getAttribute('disabled')) !== null;
    const label = ((await option.textContent()) || '').trim();

    options.push({ value: value || '', label, disabled });
  }

  return options;
}

async function selectFirstNonEmptyOption(selectLocator) {
  const options = await getSelectOptions(selectLocator);
  const targetOption = options.find((option) => option.value && !option.disabled);
  if (!targetOption) return false;

  await selectLocator.selectOption(targetOption.value);
  return true;
}

async function addAccountsForThreeEnvironments(page) {
  const addButton = page.getByRole('button', { name: /Adicionar conta/i }).first();
  if ((await addButton.count()) === 0 || !await addButton.isVisible()) return [];

  const accountSelect = page.locator('form select').first();
  const options = await getSelectOptions(accountSelect);
  const validOptions = options.filter((option) => option.value && !option.disabled);

  const productMap = new Map();
  for (const option of validOptions) {
    const accountName = extractAccountNameFromOptionLabel(option.label);
    if (!accountName) continue;

    const productName = normalizeProductName(accountName);
    const environment = getEnvironmentTokenFromAccountName(accountName);

    if (!productMap.has(productName)) {
      productMap.set(productName, new Map());
    }

    productMap.get(productName).set(environment, option);
  }

  const productEntry = [...productMap.entries()].find(([, envMap]) =>
    envMap.has('prd') && envMap.has('hml') && envMap.has('dev'),
  );

  let selectedOptions = [];
  if (productEntry) {
    const [, envMap] = productEntry;
    selectedOptions = [envMap.get('prd'), envMap.get('hml'), envMap.get('dev')].filter(Boolean);
  } else {
    const fallbackEntry = [...productMap.values()].find((envMap) => envMap.size > 0);
    if (!fallbackEntry) {
      throw new Error('Nao foi encontrada uma conta/produto valido para preencher os formularios.');
    }
    selectedOptions = [...fallbackEntry.values()].slice(0, 3);
    console.warn('[screenshots] Nenhum produto com DEV/HML/PRD encontrado; usando fallback com ambientes disponiveis.');
  }

  const addedLabels = [];
  for (const option of selectedOptions) {
    await accountSelect.selectOption(option.value);
    await addButton.click();
    await page.waitForTimeout(120);
    addedLabels.push(option.label);
  }

  return addedLabels;
}

async function selectRoleProductWithThreeEnvironments(page) {
  const productSelect = page.locator('form select').first();
  const options = await getSelectOptions(productSelect);
  const validOptions = options.filter((option) => option.value && !option.disabled);

  const productMap = new Map();
  for (const option of validOptions) {
    const accountName = extractAccountNameFromOptionLabel(option.label);
    if (!accountName) continue;

    const productName = normalizeProductName(accountName);
    const environment = getEnvironmentTokenFromAccountName(accountName);

    if (!productMap.has(productName)) {
      productMap.set(productName, new Map());
    }

    productMap.get(productName).set(environment, option);
  }

  const productEntry = [...productMap.entries()].find(([, envMap]) =>
    envMap.has('prd') && envMap.has('hml') && envMap.has('dev'),
  );

  let preferredOption;
  if (productEntry) {
    const [, envMap] = productEntry;
    preferredOption = envMap.get('prd') || envMap.get('hml') || envMap.get('dev');
  } else {
    preferredOption = validOptions[0];
    console.warn('[screenshots] Nenhum produto com DEV/HML/PRD encontrado em Role AWS; usando primeira opcao disponivel.');
  }
  if (!preferredOption) {
    throw new Error('Nao foi possivel selecionar conta alvo de Role AWS para captura.');
  }

  await productSelect.selectOption(preferredOption.value);
  await page.waitForTimeout(200);
}

function getMockValueForInput(type, placeholder) {
  const normalizedPlaceholder = normalizeText(placeholder || '');

  if (normalizedPlaceholder.includes('aws_ac_payment_gateway_prd')) return 'AWS_AC_PAYMENT_GATEWAY_PRD';
  if (normalizedPlaceholder.includes('maria souza')) return 'Maria Souza';
  if (normalizedPlaceholder.includes('carlos lima')) return 'Carlos Lima';
  if (normalizedPlaceholder.includes('ana ribeiro')) return 'Ana Ribeiro';
  if (normalizedPlaceholder.includes('levantamento iam em contas produtivas')) return 'Levantamento IAM e inventario de recursos criticos em producao';
  if (normalizedPlaceholder.includes('ou=plataforma')) return 'OU=Plataforma';
  if (normalizedPlaceholder.includes('eu-west-1')) return 'eu-west-1';
  if (normalizedPlaceholder.includes('mapeamento de relacionamentos entre contas')) return 'Levantamento de relacionamentos entre contas e principals federados';
  if (normalizedPlaceholder.includes('organizacoes de backup em contas legadas')) return 'Recursos de backup cross-account para workloads legados';
  if (normalizedPlaceholder.includes('relacao entre principals federados')) return 'Correlacao entre principals federados e policies efetivas';
  if (normalizedPlaceholder.includes('i-0abc123def4567890')) return 'i-0abc123def4567890';
  if (normalizedPlaceholder.includes('bucket-logs-aplicacao-prd')) return 'bucket-logs-aplicacao-prd';
  if (normalizedPlaceholder.includes('owner')) return 'owner';
  if (normalizedPlaceholder.includes('time-seguranca')) return 'time-seguranca';
  if (normalizedPlaceholder.includes('2026-01-01 a 2026-03-01')) return '2026-01-01 a 2026-03-01';
  if (normalizedPlaceholder.includes('cc-10457')) return 'CC-10457';
  if (normalizedPlaceholder.includes('empresa.com')) return 'maria.souza@empresa.com';
  if (normalizedPlaceholder.includes('nome da conta aws')) return 'AWS_AC_PAYMENT_GATEWAY_PRD';
  if (normalizedPlaceholder.includes('responsavel de negocio')) return 'Maria Souza';
  if (normalizedPlaceholder.includes('responsavel tecnico')) return 'Carlos Lima';
  if (normalizedPlaceholder.includes('gestor aprovador')) return 'Ana Ribeiro';
  if (normalizedPlaceholder.includes('centro de custo')) return 'CC-10457';
  if (normalizedPlaceholder.includes('responsavel principal')) return 'maria.souza@empresa.com';
  if (type === 'email') return 'analista.soc@corp.com';
  if (normalizedPlaceholder.includes('nome_da_conta') || normalizedPlaceholder.includes('nome-da-conta')) return 'AWS_AC_PAYMENT_GATEWAY_PRD';
  if (normalizedPlaceholder.includes('nome-do-perfil')) return 'sre-readonly';
  if (normalizedPlaceholder.includes('nome_do_perfil')) return 'SRE_READONLY';
  if (normalizedPlaceholder.includes('nome_do_usuario')) return 'INTEGRACAO_ETL';
  if (normalizedPlaceholder.includes('nome_do_grupo')) return 'BACKUP_OPERATORS';
  if (normalizedPlaceholder.includes('nome_do_pset')) return 'SRE_READONLY';
  if (normalizedPlaceholder.includes('readonlyaccess') && !normalizedPlaceholder.includes('arn:')) return 'ReadOnlyAccess';
  if (normalizedPlaceholder.includes('cloudwatchreadonlyaccess')) return 'ReadOnlyAccess, CloudWatchReadOnlyAccess';
  if (normalizedPlaceholder.includes('nome_da_role')) return 'LAMBDA_INTEGRATION';
  if (normalizedPlaceholder.includes('legacy-lambda-integration-role')) return 'legacy-billing-export-role';
  if (normalizedPlaceholder.includes('nome_da_policy') || normalizedPlaceholder.includes('nome da policy')) {
    return 'APP_LOG_READ';
  }
  if (normalizedPlaceholder.includes('aws-prd-payment@corp.com')) return 'aws-prd-observability@corp.com';
  if (normalizedPlaceholder.includes('usuario-legado-integracao')) return 'usuario-batch-integracao';
  if (normalizedPlaceholder.includes('usuario-app-batch')) return 'usuario-batch-integracao';
  if (normalizedPlaceholder.includes('akia') || normalizedPlaceholder.includes('key ativa atual')) return 'AKIAIOSFODNN7EXAMPLE';
  if (normalizedPlaceholder.includes(':user/')) return 'arn:aws:iam::123456789012:user/usuario-batch-integracao';
  if (normalizedPlaceholder.includes('grupo-legado-suporte')) return 'grupo-operacao-sre';
  if (normalizedPlaceholder.includes(':group/')) return 'arn:aws:iam::123456789012:group/grupo-operacao-sre';
  if (normalizedPlaceholder.includes('prd-payment-gateway') || normalizedPlaceholder.includes('hml-payment-gateway') || normalizedPlaceholder.includes('dev-payment-gateway')) {
    return '123456789012 (prd-payment-gateway)';
  }
  if (normalizedPlaceholder.includes('pset-legado-readonly') || normalizedPlaceholder.includes('permissionset')) {
    return 'arn:aws:sso:::permissionSet/ssoins-1234567890abcdef/ps-1234567890abcdef';
  }
  if (normalizedPlaceholder.includes('pl-pgw-prd-block-cloudtrail-delete')) return 'AWS_PL_APP_LOG_READ_PRD';
  if (normalizedPlaceholder.includes('arn:aws:iam::aws:policy')) return 'arn:aws:iam::aws:policy/ReadOnlyAccess';
  if (normalizedPlaceholder.includes('arn:aws:iam') && normalizedPlaceholder.includes(':policy/')) {
    return 'arn:aws:iam::123456789012:policy/AWS_PL_APP_LOG_READ_PRD';
  }
  if (normalizedPlaceholder.includes('arn:aws:iam') && normalizedPlaceholder.includes('role')) return 'arn:aws:iam::123456789012:role/DEMO_ROLE';
  if (normalizedPlaceholder.includes('arn')) return 'arn:aws:iam::123456789012:root';
  if (normalizedPlaceholder.includes('inc-')) return 'INC-2026-0042';
  if (normalizedPlaceholder.includes('aws-aud')) return 'AWS-AUD-90001';
  if (normalizedPlaceholder.includes('aws-bg')) return 'AWS-BG-95001';
  if (normalizedPlaceholder.includes('token.actions')) return 'token.actions.githubusercontent.com';
  if (normalizedPlaceholder.includes('lambda.amazonaws.com')) return 'lambda.amazonaws.com';
  if (normalizedPlaceholder.includes('root')) return 'arn:aws:iam::123456789012:root';
  if (normalizedPlaceholder.includes('nome') || normalizedPlaceholder.includes('name')) return 'DEMO_RECURSO';

  return 'demo-valor';
}

async function fillRequiredSelects(page) {
  const selectLocators = page.locator('form select[required]');
  const count = await selectLocators.count();

  for (let i = 0; i < count; i += 1) {
    const select = selectLocators.nth(i);
    if (!await select.isVisible()) continue;

    const currentValue = await select.inputValue();
    if (currentValue) continue;

    await selectFirstNonEmptyOption(select);
    await page.waitForTimeout(60);
  }
}

async function fillRequiredInputs(page) {
  const inputLocators = page.locator('form input[required]');
  const count = await inputLocators.count();

  for (let i = 0; i < count; i += 1) {
    const input = inputLocators.nth(i);
    if (!await input.isVisible()) continue;
    if (!await input.isEditable()) continue;

    const type = ((await input.getAttribute('type')) || 'text').toLowerCase();
    if (['checkbox', 'radio', 'file', 'hidden', 'submit', 'button'].includes(type)) continue;

    const value = await input.inputValue();
    if (value) continue;

    const placeholder = await input.getAttribute('placeholder');
    await input.fill(getMockValueForInput(type, placeholder || ''));
    await page.waitForTimeout(60);
  }
}

function getMockValueForTextarea(placeholder, context = {}) {
  const normalizedPlaceholder = normalizeText(placeholder || '');
  const requestTypeId = context.requestTypeId || '';

  if (normalizedPlaceholder.includes('descreva objetivamente a necessidade da solicitacao')) {
    return REQUEST_JUSTIFICATION_BY_TYPE[requestTypeId]
      || 'Solicitacao preenchida automaticamente com justificativa coerente ao fluxo selecionado.';
  }

  if (normalizedPlaceholder.includes('descreva o objetivo do levantamento')) {
    return REQUEST_JUSTIFICATION_BY_TYPE[requestTypeId]
      || 'Levantamento solicitado para consolidar inventario e configuracoes AWS com foco em risco e compliance.';
  }

  if (normalizedPlaceholder.includes('dump completo de roles, policies e recursos em todas as contas')) {
    return 'Escopo organizacional completo: coletar dados de todas as contas AWS, contemplando ambientes DEV, HML, PRD e Sandbox.';
  }

  if (normalizedPlaceholder.includes('levantar dump de todas as roles, policies e recursos utilizados em todas as contas')) {
    return 'Levantar dump completo de roles, policies e recursos em todas as contas da organizacao, incluindo detalhe do bucket bucket-logs-aplicacao-prd.';
  }

  if (normalizedPlaceholder.includes('1) todas as roles e policies em todas as contas')) {
    return '1) Dump de todas as roles e policies em todas as contas. 2) Inventario dos recursos utilizados por conta. 3) Detalhar recurso especifico bucket-logs-aplicacao-prd.';
  }

  if (normalizedPlaceholder.includes('conta 123456789012, regiao sa-east-1')) {
    return 'Recorte adicional: priorizar conta 123456789012, regiao sa-east-1, servicos IAM/S3 e periodo dos ultimos 90 dias.';
  }

  if (normalizedPlaceholder.includes('descreva a justificativa da criacao da conta aws')) {
    return REQUEST_JUSTIFICATION_BY_TYPE[requestTypeId]
      || 'Criacao de conta AWS justificada por necessidade de isolamento de workload e rastreabilidade corporativa.';
  }

  if (normalizedPlaceholder.includes('descreva a finalidade da conta e o tipo de workload')) {
    return 'Conta dedicada para workloads transacionais do gateway de pagamentos, com isolamento de custos e controles de seguranca.';
  }

  if (normalizedPlaceholder.includes('descreva o incidente, impacto e necessidade do acesso emergencial')) {
    return REQUEST_JUSTIFICATION_BY_TYPE[requestTypeId]
      || 'Incidente critico ativo exige acesso emergencial temporario com rastreabilidade completa.';
  }

  if (normalizedPlaceholder.includes('comentario adicional')) {
    return REQUEST_COMMENT_BY_TYPE[requestTypeId]
      || 'Preenchimento automatico para captura visual com contexto tecnico do chamado.';
  }

  if (normalizedPlaceholder.includes('atualizar owner para time x')) {
    return 'Atualizar owner tecnico para time CloudOps, revisar baseline CIS e ajustar trilhas de auditoria da conta.';
  }

  if (normalizedPlaceholder.includes('migracao de workloads, retencao de logs')) {
    return 'Migrar workloads restantes para conta substituta, reter logs por 180 dias e encerrar cobranca apos validacao financeira.';
  }

  if (normalizedPlaceholder.includes('alterar grupo associado para x')) {
    return 'Trocar grupo associado para AWS_GR_SRE_READONLY_PRD e vincular PSET AWS_PS_SRE_READONLY_PRD.';
  }

  if (normalizedPlaceholder.includes('acessos serao revogados e para onde os usuarios serao migrados')) {
    return 'Revogar atribuicoes do perfil atual e migrar usuarios para perfil corporativo sucessor aprovado pela governanca.';
  }

  if (normalizedPlaceholder.includes('ajustar policies anexadas, trocar grupo principal e rotacionar access keys')) {
    return 'Remover policy excessiva, manter apenas ReadOnlyAccess e concluir rotacao de access keys apos a mudanca.';
  }

  if (normalizedPlaceholder.includes('revogacao de chaves e senha antes da remocao do usuario iam')) {
    return 'Desativar e remover access keys ativas, invalidar senha de console e confirmar ausencia de uso recente no CloudTrail.';
  }

  if (normalizedPlaceholder.includes('adicionar policy x, remover policy y e ajustar permission boundary')) {
    return 'Adicionar SecurityAudit, remover PowerUserAccess legado e manter boundary alinhada ao escopo operacional.';
  }

  if (normalizedPlaceholder.includes('usuarios do grupo serao migrados antes da remocao')) {
    return 'Migrar membros para AWS_GR_OPERACAO_SRE_PRD, validar acesso minimo e remover grupo antigo apos confirmacao.';
  }

  if (normalizedPlaceholder.includes('adicionar securityaudit, remover readonlyaccess e trocar grupo ad vinculado')) {
    return 'Adicionar CloudWatchReadOnlyAccess, remover policy obsoleta e atualizar grupo AD para BR-AD-SRE-READONLY.';
  }

  if (normalizedPlaceholder.includes('adicionar statement para permitir acao x e remover statement y')) {
    return 'Adicionar statement restrito para s3:GetObject por prefixo e remover allow amplo em s3:* sem condicao.';
  }

  if (normalizedPlaceholder.includes('descreva como desanexar e restaurar a policy anterior caso necessario')) {
    return 'Desanexar policy das entidades alvo em ordem controlada e reanexar versao anterior em caso de regressao.';
  }

  if (normalizedPlaceholder.includes('ampliar escopo para roles criticas e estender prazo por 15 dias')) {
    return 'Incluir roles privilegiadas do dominio financeiro e estender prazo da auditoria por 15 dias para consolidar evidencias.';
  }

  if (normalizedPlaceholder.includes('estender duracao para 2h e restringir acoes ao escopo x')) {
    return 'Estender janela para 2 horas e limitar a atuacao apenas ao servico impactado pelo incidente em producao.';
  }

  if (normalizedPlaceholder.includes('evidencias de encerramento e revogacao do acesso emergencial')) {
    return 'Anexadas evidencias de encerramento do incidente, revogacao do acesso e retorno ao baseline de privilegios.';
  }

  if (normalizedPlaceholder.includes('s3:getobject') || normalizedPlaceholder.includes('actions necessarias')) {
    return 's3:GetObject, s3:PutObject, s3:ListBucket';
  }

  if (normalizedPlaceholder.includes('arn:aws:s3:::') || normalizedPlaceholder.includes('resources')) {
    return 'bucket-logs-aplicacao-prd';
  }

  if (normalizedPlaceholder.includes('aws:sourcevpce') || normalizedPlaceholder.includes('conditions')) {
    return 'StringEquals aws:SourceVpce=vpce-0123456789abcdef0';
  }

  if (normalizedPlaceholder.includes('{"version"') || normalizedPlaceholder.includes('json')) {
    return '{"Version":"2012-10-17","Statement":[]}';
  }

  return 'Preenchimento automatico para captura de tela com dados mockados e coerentes ao contexto.';
}

async function fillRequiredTextareas(page, context = {}) {
  const textareaLocators = page.locator('form textarea[required]');
  const count = await textareaLocators.count();

  for (let i = 0; i < count; i += 1) {
    const textarea = textareaLocators.nth(i);
    if (!await textarea.isVisible()) continue;
    if (!await textarea.isEditable()) continue;

    const value = await textarea.inputValue();
    if (value) continue;

    const placeholder = await textarea.getAttribute('placeholder');
    await textarea.fill(getMockValueForTextarea(placeholder || '', context));
    await page.waitForTimeout(60);
  }
}

async function setRoleCreateAttachExistingMode(page, requestTypeId) {
  if (requestTypeId !== 'role-create') return;

  const selectLocators = page.locator('form select');
  const count = await selectLocators.count();

  for (let i = 0; i < count; i += 1) {
    const select = selectLocators.nth(i);
    if (!await select.isVisible()) continue;

    const options = await getSelectOptions(select);
    if (!options.some((option) => option.value === 'attach-existing')) continue;

    await select.selectOption('attach-existing');
    await page.waitForTimeout(120);
    return;
  }
}

async function setIamUserCreatePermissionMode(page, requestTypeId) {
  if (requestTypeId !== 'iam-user-create') return;

  const selectLocators = page.locator('form select');
  const count = await selectLocators.count();

  for (let i = 0; i < count; i += 1) {
    const select = selectLocators.nth(i);
    if (!await select.isVisible()) continue;

    const options = await getSelectOptions(select);
    if (!options.some((option) => option.value === 'group-and-attach-existing')) continue;

    await select.selectOption('group-and-attach-existing');
    await page.waitForTimeout(120);
    return;
  }
}

async function setIamGroupCreatePermissionMode(page, requestTypeId) {
  if (requestTypeId !== 'iam-group-create') return;

  const selectLocators = page.locator('form select');
  const count = await selectLocators.count();

  for (let i = 0; i < count; i += 1) {
    const select = selectLocators.nth(i);
    if (!await select.isVisible()) continue;

    const options = await getSelectOptions(select);
    if (!options.some((option) => option.value === 'attach-existing')) continue;

    await select.selectOption('attach-existing');
    await page.waitForTimeout(120);
    return;
  }
}

async function populateRoleUpdateActions(page, requestTypeId) {
  if (requestTypeId !== 'role-update') return;

  const actionValues = [
    'add-policy',
    'remove-policy',
    'add-trusted-entity',
    'update-trusted-entity',
    'remove-trusted-entity',
  ];

  const selectLocators = page.locator('form select');
  const count = await selectLocators.count();

  let actionSelect = null;
  for (let i = 0; i < count; i += 1) {
    const select = selectLocators.nth(i);
    if (!await select.isVisible()) continue;

    const options = await getSelectOptions(select);
    if (options.some((option) => actionValues.includes(option.value))) {
      actionSelect = select;
      break;
    }
  }

  if (!actionSelect) {
    throw new Error('Nao foi encontrado o dropdown de acoes da alteracao de Role AWS.');
  }

  const addActionButton = page.getByRole('button', { name: /Adicionar acao/i }).first();
  if ((await addActionButton.count()) === 0 || !await addActionButton.isVisible()) {
    throw new Error('Nao foi encontrado o botao para adicionar acao de alteracao de Role AWS.');
  }

  for (const actionValue of actionValues) {
    const options = await getSelectOptions(actionSelect);
    const isAvailable = options.some((option) => option.value === actionValue && !option.disabled);
    if (!isAvailable) continue;

    await actionSelect.selectOption(actionValue);
    await page.waitForTimeout(80);
    await addActionButton.click();
    await page.waitForTimeout(120);
  }

  const addPolicyButtons = page.getByRole('button', { name: /Adicionar policy/i });
  const addPolicyButtonsCount = await addPolicyButtons.count();
  for (let i = 0; i < addPolicyButtonsCount; i += 1) {
    const button = addPolicyButtons.nth(i);
    if (!await button.isVisible()) continue;

    await button.click();
    await page.waitForTimeout(80);
  }
}

async function populateGroupUpdateActions(page, requestTypeId) {
  if (requestTypeId !== 'iam-group-update') return;

  const actionValues = ['add-policy', 'remove-policy', 'add-user', 'remove-user'];

  const selectLocators = page.locator('form select');
  const count = await selectLocators.count();

  let actionSelect = null;
  for (let i = 0; i < count; i += 1) {
    const select = selectLocators.nth(i);
    if (!await select.isVisible()) continue;

    const options = await getSelectOptions(select);
    if (options.some((option) => actionValues.includes(option.value))) {
      actionSelect = select;
      break;
    }
  }

  if (!actionSelect) {
    throw new Error('Nao foi encontrado o dropdown de acoes da alteracao de Grupo IAM.');
  }

  const addActionButton = page.getByRole('button', { name: /Adicionar acao/i }).first();
  if ((await addActionButton.count()) === 0 || !await addActionButton.isVisible()) {
    throw new Error('Nao foi encontrado o botao para adicionar acao de alteracao de Grupo IAM.');
  }

  for (const actionValue of actionValues) {
    const options = await getSelectOptions(actionSelect);
    const isAvailable = options.some((option) => option.value === actionValue && !option.disabled);
    if (!isAvailable) continue;

    await actionSelect.selectOption(actionValue);
    await page.waitForTimeout(80);
    await addActionButton.click();
    await page.waitForTimeout(120);
  }

  const addPolicyButtons = page.getByRole('button', { name: /Adicionar policy/i });
  const addPolicyButtonsCount = await addPolicyButtons.count();
  for (let i = 0; i < addPolicyButtonsCount; i += 1) {
    const button = addPolicyButtons.nth(i);
    if (!await button.isVisible()) continue;

    await button.click();
    await page.waitForTimeout(80);
  }

  const addUserButtons = page.getByRole('button', { name: /Adicionar usuario/i });
  const addUserButtonsCount = await addUserButtons.count();
  for (let i = 0; i < addUserButtonsCount; i += 1) {
    const button = addUserButtons.nth(i);
    if (!await button.isVisible()) continue;

    await button.click();
    await page.waitForTimeout(80);
  }
}

async function populateUserUpdateActions(page, requestTypeId) {
  if (requestTypeId !== 'iam-user-update') return;

  const actionValues = ['add-policy', 'remove-policy', 'add-group', 'remove-group', 'rotate-key'];

  const selectLocators = page.locator('form select');
  const count = await selectLocators.count();

  let actionSelect = null;
  for (let i = 0; i < count; i += 1) {
    const select = selectLocators.nth(i);
    if (!await select.isVisible()) continue;

    const options = await getSelectOptions(select);
    if (options.some((option) => actionValues.includes(option.value))) {
      actionSelect = select;
      break;
    }
  }

  if (!actionSelect) {
    throw new Error('Nao foi encontrado o dropdown de acoes da alteracao de Usuario IAM.');
  }

  const addActionButton = page.getByRole('button', { name: /Adicionar acao/i }).first();
  if ((await addActionButton.count()) === 0 || !await addActionButton.isVisible()) {
    throw new Error('Nao foi encontrado o botao para adicionar acao de alteracao de Usuario IAM.');
  }

  for (const actionValue of actionValues) {
    const options = await getSelectOptions(actionSelect);
    const isAvailable = options.some((option) => option.value === actionValue && !option.disabled);
    if (!isAvailable) continue;

    await actionSelect.selectOption(actionValue);
    await page.waitForTimeout(80);
    await addActionButton.click();
    await page.waitForTimeout(120);
  }

  const addPolicyButtons = page.getByRole('button', { name: /Adicionar policy/i });
  const addPolicyButtonsCount = await addPolicyButtons.count();
  for (let i = 0; i < addPolicyButtonsCount; i += 1) {
    const button = addPolicyButtons.nth(i);
    if (!await button.isVisible()) continue;

    await button.click();
    await page.waitForTimeout(80);
  }

  const addGroupButtons = page.getByRole('button', { name: /Adicionar grupo/i });
  const addGroupButtonsCount = await addGroupButtons.count();
  for (let i = 0; i < addGroupButtonsCount; i += 1) {
    const button = addGroupButtons.nth(i);
    if (!await button.isVisible()) continue;

    await button.click();
    await page.waitForTimeout(80);
  }

  const addKeyButtons = page.getByRole('button', { name: /Adicionar key|Adicionar chave/i });
  const addKeyButtonsCount = await addKeyButtons.count();
  for (let i = 0; i < addKeyButtonsCount; i += 1) {
    const button = addKeyButtons.nth(i);
    if (!await button.isVisible()) continue;

    await button.click();
    await page.waitForTimeout(80);
  }
}

async function populatePsetCreatePolicies(page, requestTypeId) {
  if (requestTypeId !== 'pset-create') return;

  const addPolicyButton = page.getByRole('button', { name: /Adicionar policy/i }).first();
  if ((await addPolicyButton.count()) === 0 || !await addPolicyButton.isVisible()) return;

  await addPolicyButton.click();
  await page.waitForTimeout(120);
}

async function populatePsetUpdateActions(page, requestTypeId) {
  if (requestTypeId !== 'pset-update') return;

  const actionValues = ['add-policy', 'remove-policy', 'add-account', 'remove-account'];

  const selectLocators = page.locator('form select');
  const count = await selectLocators.count();

  let actionSelect = null;
  for (let i = 0; i < count; i += 1) {
    const select = selectLocators.nth(i);
    if (!await select.isVisible()) continue;

    const options = await getSelectOptions(select);
    if (options.some((option) => actionValues.includes(option.value))) {
      actionSelect = select;
      break;
    }
  }

  if (!actionSelect) {
    throw new Error('Nao foi encontrado o dropdown de acoes da alteracao de PSET.');
  }

  const addActionButton = page.getByRole('button', { name: /Adicionar acao/i }).first();
  if ((await addActionButton.count()) === 0 || !await addActionButton.isVisible()) {
    throw new Error('Nao foi encontrado o botao para adicionar acao de alteracao de PSET.');
  }

  for (const actionValue of actionValues) {
    const options = await getSelectOptions(actionSelect);
    const isAvailable = options.some((option) => option.value === actionValue && !option.disabled);
    if (!isAvailable) continue;

    await actionSelect.selectOption(actionValue);
    await page.waitForTimeout(80);
    await addActionButton.click();
    await page.waitForTimeout(120);
  }

  const addPolicyButtons = page.getByRole('button', { name: /Adicionar policy/i });
  const addPolicyButtonsCount = await addPolicyButtons.count();
  for (let i = 0; i < addPolicyButtonsCount; i += 1) {
    const button = addPolicyButtons.nth(i);
    if (!await button.isVisible()) continue;

    await button.click();
    await page.waitForTimeout(80);
  }

  const addAccountButtons = page.getByRole('button', { name: /Adicionar conta/i });
  const addAccountButtonsCount = await addAccountButtons.count();
  for (let i = 0; i < addAccountButtonsCount; i += 1) {
    const button = addAccountButtons.nth(i);
    if (!await button.isVisible()) continue;

    await button.click();
    await page.waitForTimeout(80);
  }
}

async function enrichRoleUpdateCaptureTexts(page, requestTypeId) {
  if (requestTypeId !== 'role-update') return;

  const policyInputs = page.locator('form input[placeholder="Ex: arn:aws:iam::aws:policy/ReadOnlyAccess"]');
  const policyInputCount = await policyInputs.count();
  for (let i = 0; i < policyInputCount; i += 1) {
    const input = policyInputs.nth(i);
    if (!await input.isVisible()) continue;
    if (!await input.isEditable()) continue;

    const currentValue = await input.inputValue();
    if (currentValue) continue;

    const fallbackPolicy = ROLE_UPDATE_POLICY_MOCKS[ROLE_UPDATE_POLICY_MOCKS.length - 1];
    await input.fill(ROLE_UPDATE_POLICY_MOCKS[i] || fallbackPolicy);
    await page.waitForTimeout(60);
  }

  for (const detailMock of ROLE_UPDATE_DETAIL_MOCKS) {
    const textarea = page.locator(`form textarea[placeholder="${detailMock.placeholder}"]`).first();
    if ((await textarea.count()) === 0) continue;
    if (!await textarea.isVisible()) continue;
    if (!await textarea.isEditable()) continue;

    const currentValue = await textarea.inputValue();
    if (currentValue) continue;

    await textarea.fill(detailMock.value);
    await page.waitForTimeout(60);
  }
}

async function fillInputsWithDistinctValuesByPlaceholder(page, placeholder, values) {
  const inputs = page.locator(`form input[placeholder="${placeholder}"]`);
  const count = await inputs.count();
  let valueIndex = 0;

  for (let i = 0; i < count; i += 1) {
    const input = inputs.nth(i);
    if (!await input.isVisible()) continue;
    if (!await input.isEditable()) continue;

    const fallbackValue = values[values.length - 1];
    await input.fill(values[valueIndex] || fallbackValue);
    valueIndex += 1;
    await page.waitForTimeout(60);
  }
}

async function enrichGroupUpdateCaptureTexts(page, requestTypeId) {
  if (requestTypeId !== 'iam-group-update') return;

  await fillInputsWithDistinctValuesByPlaceholder(
    page,
    'Ex: arn:aws:iam::aws:policy/ReadOnlyAccess',
    GROUP_UPDATE_POLICY_MOCKS,
  );
  await fillInputsWithDistinctValuesByPlaceholder(
    page,
    'Ex: usuario-app-batch ou arn:aws:iam::123456789012:user/usuario-app-batch',
    GROUP_UPDATE_USER_MOCKS,
  );
}

async function enrichPsetCreateCaptureTexts(page, requestTypeId) {
  if (requestTypeId !== 'pset-create') return;

  await fillInputsWithDistinctValuesByPlaceholder(
    page,
    'Ex: ReadOnlyAccess',
    PSET_CREATE_POLICY_MOCKS,
  );
}

async function enrichPsetUpdateCaptureTexts(page, requestTypeId) {
  if (requestTypeId !== 'pset-update') return;

  await fillInputsWithDistinctValuesByPlaceholder(
    page,
    'Ex: CloudWatchReadOnlyAccess ou arn:aws:iam::aws:policy/CloudWatchReadOnlyAccess',
    PSET_UPDATE_POLICY_MOCKS,
  );
  await fillInputsWithDistinctValuesByPlaceholder(
    page,
    'Ex: ReadOnlyAccess ou arn:aws:iam::aws:policy/ReadOnlyAccess',
    PSET_UPDATE_POLICY_MOCKS,
  );
  await fillInputsWithDistinctValuesByPlaceholder(
    page,
    'Ex: 123456789012 (prd-payment-gateway)',
    PSET_UPDATE_ACCOUNT_MOCKS,
  );
  await fillInputsWithDistinctValuesByPlaceholder(
    page,
    'Ex: 210987654321 (hml-payment-gateway)',
    PSET_UPDATE_ACCOUNT_MOCKS,
  );
}

async function fillOptionalSelects(page) {
  const selectLocators = page.locator('form select:not([required])');
  const count = await selectLocators.count();

  for (let i = 0; i < count; i += 1) {
    const select = selectLocators.nth(i);
    if (!await select.isVisible()) continue;

    const currentValue = await select.inputValue();
    if (currentValue) continue;

    await selectFirstNonEmptyOption(select);
    await page.waitForTimeout(60);
  }
}

async function fillOptionalInputs(page) {
  const inputLocators = page.locator('form input:not([required])');
  const count = await inputLocators.count();

  for (let i = 0; i < count; i += 1) {
    const input = inputLocators.nth(i);
    if (!await input.isVisible()) continue;
    if (!await input.isEditable()) continue;

    const type = ((await input.getAttribute('type')) || 'text').toLowerCase();
    if (['checkbox', 'radio', 'file', 'hidden', 'submit', 'button'].includes(type)) continue;

    const value = await input.inputValue();
    if (value) continue;

    const placeholder = await input.getAttribute('placeholder');
    await input.fill(getMockValueForInput(type, placeholder || ''));
    await page.waitForTimeout(60);
  }
}

async function fillOptionalTextareas(page, context = {}) {
  const textareaLocators = page.locator('form textarea:not([required])');
  const count = await textareaLocators.count();

  for (let i = 0; i < count; i += 1) {
    const textarea = textareaLocators.nth(i);
    if (!await textarea.isVisible()) continue;
    if (!await textarea.isEditable()) continue;

    const value = await textarea.inputValue();
    if (value) continue;

    const placeholder = await textarea.getAttribute('placeholder');
    await textarea.fill(getMockValueForTextarea(placeholder || '', context));
    await page.waitForTimeout(60);
  }
}

async function attachOptionalJsonFiles(page) {
  const fileInputs = page.locator('form input[type="file"]');
  const count = await fileInputs.count();

  for (let i = 0; i < count; i += 1) {
    const input = fileInputs.nth(i);
    if (!await input.isVisible()) continue;

    await input.setInputFiles(MOCK_JSON_ATTACHMENT_PATH);
    await page.waitForTimeout(80);
  }
}

async function populateRequestForm(page, categoryId, requestTypeId) {
  const context = { categoryId, requestTypeId };

  if (categoryId === 'aws-roles') {
    await selectRoleProductWithThreeEnvironments(page);
  } else if (!(categoryId === 'aws-accounts' && requestTypeId === 'account-create')) {
    await addAccountsForThreeEnvironments(page);
  }

  await setRoleCreateAttachExistingMode(page, requestTypeId);
  await setIamUserCreatePermissionMode(page, requestTypeId);
  await setIamGroupCreatePermissionMode(page, requestTypeId);
  await populateRoleUpdateActions(page, requestTypeId);
  await populateGroupUpdateActions(page, requestTypeId);
  await populateUserUpdateActions(page, requestTypeId);
  await populatePsetCreatePolicies(page, requestTypeId);
  await populatePsetUpdateActions(page, requestTypeId);
  await enrichRoleUpdateCaptureTexts(page, requestTypeId);

  await fillRequiredSelects(page);
  await fillRequiredInputs(page);
  await fillRequiredTextareas(page, context);
  await fillRequiredSelects(page);
  await fillOptionalSelects(page);
  await fillOptionalInputs(page);
  await fillOptionalTextareas(page, context);
  await attachOptionalJsonFiles(page);
  await fillRequiredInputs(page);
  await fillRequiredTextareas(page, context);
  await fillRequiredSelects(page);
  await enrichGroupUpdateCaptureTexts(page, requestTypeId);
  await enrichPsetCreateCaptureTexts(page, requestTypeId);
  await enrichPsetUpdateCaptureTexts(page, requestTypeId);

  await page.waitForTimeout(FORM_WAIT_MS);
}

async function openReview(page) {
  const reviewButton = page.getByRole('button', { name: /Revisar/i }).first();
  await reviewButton.click();
  await page.getByRole('button', { name: /Voltar/i }).first().waitFor({ state: 'visible', timeout: 10_000 });
  await page.waitForTimeout(FORM_WAIT_MS);
}

async function captureRequestTypeScreenshots(page, categoryId, requestTypePath, categoryDir) {
  const requestTypeId = getRequestTypeIdFromPath(requestTypePath);

  await page.goto(`${BASE_URL}${requestTypePath}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(FORM_WAIT_MS);

  const emptyPath = path.join(categoryDir, `${requestTypeId}-empty.png`);
  await page.screenshot({ path: emptyPath, fullPage: true });

  await populateRequestForm(page, categoryId, requestTypeId);

  const filledPath = path.join(categoryDir, `${requestTypeId}-filled.png`);
  await page.screenshot({ path: filledPath, fullPage: true });

  await openReview(page);

  const reviewPath = path.join(categoryDir, `${requestTypeId}-review.png`);
  await page.screenshot({ path: reviewPath, fullPage: true });

  return {
    requestTypeId,
    states: {
      empty: path.posix.join('docs', 'screenshots', 'categories', categoryId, `${requestTypeId}-empty.png`),
      filled: path.posix.join('docs', 'screenshots', 'categories', categoryId, `${requestTypeId}-filled.png`),
      review: path.posix.join('docs', 'screenshots', 'categories', categoryId, `${requestTypeId}-review.png`),
    },
  };
}

async function captureScreenshots(page) {
  const manifest = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    screenshotMode: 'empty-filled-review',
    categories: [],
  };

  await page.goto(`${BASE_URL}/catalog`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(FORM_WAIT_MS);

  const categoryPaths = dedupe(
    await page.$$eval('a[href^="/catalog/"]', (anchors) =>
      anchors
        .map((anchor) => anchor.getAttribute('href') || '')
        .filter((href) => /^\/catalog\/[^/]+$/.test(href)),
    ),
  );

  for (const categoryPath of categoryPaths) {
    const categoryId = getCategoryIdFromPath(categoryPath);
    const categoryDir = path.join(SCREENSHOT_ROOT, categoryId);

    await mkdir(categoryDir, { recursive: true });

    await page.goto(`${BASE_URL}${categoryPath}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(FORM_WAIT_MS);

    await page.screenshot({
      path: path.join(categoryDir, 'overview.png'),
      fullPage: true,
    });

    const requestTypePaths = dedupe(
      await page.$$eval('a[href*="/new/"]', (anchors) =>
        anchors
          .map((anchor) => anchor.getAttribute('href') || '')
          .filter((href) => /^\/catalog\/[^/]+\/new\/[^/]+$/.test(href)),
      ),
    );

    const requestTypeEntries = [];
    for (const requestTypePath of requestTypePaths) {
      const entry = await captureRequestTypeScreenshots(page, categoryId, requestTypePath, categoryDir);
      requestTypeEntries.push(entry);
    }

    manifest.categories.push({
      categoryId,
      overview: path.posix.join('docs', 'screenshots', 'categories', categoryId, 'overview.png'),
      requestTypes: requestTypeEntries,
    });
  }

  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf-8');
}

async function main() {
  await rm(SCREENSHOT_ROOT, { recursive: true, force: true });
  await mkdir(SCREENSHOT_ROOT, { recursive: true });
  await writeFile(
    MOCK_JSON_ATTACHMENT_PATH,
    `${JSON.stringify({ Version: '2012-10-17', Statement: [] }, null, 2)}\n`,
    'utf-8',
  );

  const { command, args } = getDevServerCommand();
  const server = spawn(command, args, {
    stdio: 'inherit',
    shell: false,
  });

  let serverClosed = false;
  let stoppingServer = false;
  server.once('exit', (code) => {
    serverClosed = true;
    if (!stoppingServer && code && code !== 0) {
      console.error(`Servidor finalizou com codigo ${code}.`);
    }
  });

  try {
    await waitForServer(`${BASE_URL}/catalog`, STARTUP_TIMEOUT_MS);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1512, height: 982 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    await captureScreenshots(page);

    await browser.close();
    console.log(`Screenshots atualizados em: ${SCREENSHOT_ROOT}`);
  } finally {
    if (!serverClosed) {
      stoppingServer = true;
      await stopProcessTree(server);
      await sleep(1_000);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
