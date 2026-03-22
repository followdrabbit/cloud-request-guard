import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ADR_DIR = path.resolve('docs', 'adr');
const OUT_DIR = path.resolve('docs', 'bdsm');
const ADR_SKIP = new Set(['ADR_DECISOES_GERAIS_ISM_AWS.md']);

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function findMeta(text, label) {
  const pattern = new RegExp(`^- ${label}:\\s*(.+)$`, 'm');
  const match = text.match(pattern);
  return match ? match[1].trim() : '';
}

function sectionBullets(text, startHeading, endHeading) {
  const startIndex = text.indexOf(startHeading);
  if (startIndex < 0) return [];

  const searchStart = startIndex + startHeading.length;
  const endIndex = endHeading ? text.indexOf(endHeading, searchStart) : -1;
  const chunk = endIndex >= 0 ? text.slice(searchStart, endIndex) : text.slice(searchStart);

  return chunk
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim())
    .filter((line) => line.length > 0 && normalizeText(line) !== 'nao aplicavel');
}

function bullets(items) {
  if (!items || items.length === 0) return '- Nao aplicavel';
  return items.map((item) => `- ${item}`).join('\n');
}

function hasKeyword(value, keyword) {
  return normalizeText(value).includes(keyword);
}

function processLabels(requestType, actionName) {
  const normalizedReq = normalizeText(requestType);
  const normalizedAction = normalizeText(actionName);

  const isEmergency = normalizedReq.startsWith('bg-');
  const isRemoval = normalizedReq.includes('delete') || normalizedReq.includes('close') || normalizedReq.includes('revoke');
  const isUpdate = normalizedReq.includes('update');
  const isCreate = normalizedReq.includes('create');
  const isAudit = normalizedReq.startsWith('audit-');
  const isInfo = normalizedReq === 'info-create';

  const triage = isEmergency
    ? 'Priorizacao emergencial e designacao do executor'
    : 'Triagem SI/IAM e classificacao de risco/impacto';

  let execution = 'Executar atividade tecnica conforme escopo aprovado';
  if (isCreate) execution = 'Executar criacao conforme padrao, menor privilegio e rastreabilidade';
  if (isUpdate) execution = 'Executar alteracao controlada com validacao de impacto';
  if (isRemoval) execution = 'Executar remocao/revogacao controlada e validar dependencias';
  if (isAudit) execution = 'Executar coleta de evidencias e analise de auditoria';
  if (isInfo) execution = 'Executar levantamento e consolidar resultado solicitado';
  if (isEmergency && hasKeyword(normalizedAction, 'concessao')) execution = 'Conceder acesso emergencial com janela e escopo minimo';
  if (isEmergency && hasKeyword(normalizedAction, 'alteracao')) execution = 'Ajustar acesso emergencial mantendo escopo minimo necessario';
  if (isEmergency && hasKeyword(normalizedAction, 'revogacao')) execution = 'Revogar acesso emergencial e encerrar sessoes associadas';

  const postValidation = isEmergency
    ? 'Validar retorno ao baseline e registrar pos-uso'
    : 'Validar resultado tecnico e controles de seguranca';

  return { triage, execution, postValidation, isEmergency, isRemoval, isUpdate, isCreate, isAudit, isInfo };
}

function bestPractices(requestType, actionName) {
  const labels = processLabels(requestType, actionName);
  const items = [
    'Executar validacao de completude e consistencia antes de iniciar qualquer acao tecnica.',
    'Aplicar principio do menor privilegio e segregacao de funcao durante aprovacao e execucao.',
    'Registrar evidencias tecnicas no chamado (logs, IDs, prints, diffs ou anexos).',
    'Atualizar status do chamado por etapa para manter rastreabilidade operacional.',
  ];

  if (labels.isCreate || labels.isUpdate) {
    items.push('Planejar rollback e janela de mudanca quando houver risco de impacto em producao.');
    items.push('Realizar validacao funcional/tecnica apos execucao antes de encerrar o chamado.');
  }

  if (labels.isRemoval) {
    items.push('Confirmar dependencias e impacto antes da remocao/revogacao definitiva.');
    items.push('Executar desativacao gradativa quando aplicavel para reduzir risco operacional.');
  }

  if (labels.isEmergency) {
    items.push('Definir timebox, escopo minimo e monitoramento continuo durante todo o periodo emergencial.');
    items.push('Executar revisao pos-uso obrigatoria com evidencias de revogacao e normalizacao.');
  }

  if (labels.isAudit || labels.isInfo) {
    items.push('Garantir integridade dos dados coletados e registrar origem/periodo de referencia.');
    items.push('Entregar resultado em formato rastreavel e reproduzivel para auditoria futura.');
  }

  return items;
}

function processMermaid(requestType, actionName) {
  const labels = processLabels(requestType, actionName);

  return [
    '```mermaid',
    'flowchart TD',
    '  A[Solicitante abre chamado] --> B[Validacao automatica de campos e regras basicas]',
    '  B --> C{Campos validos?}',
    '  C -- Nao --> C1[Retornar para ajuste do solicitante] --> B',
    `  C -- Sim --> D[${labels.triage}]`,
    '  D --> E{Aprovacoes obrigatorias obtidas?}',
    '  E -- Nao --> E1[Encerrar como rejeitado ou pendente] --> Z[Fim]',
    '  E -- Sim --> F[Planejar execucao: impacto, janela, risco, rollback]',
    `  F --> G[${labels.execution}]`,
    `  G --> H[${labels.postValidation}]`,
    '  H --> I[Anexar evidencias e atualizar historico do chamado]',
    '  I --> J[Comunicacao final ao solicitante]',
    '  J --> K[Encerrar chamado]',
    '  K --> Z[Fim]',
    '```',
  ].join('\n');
}

function executionChecklist(required, validations, approvals, rules, requestType, actionName) {
  const labels = processLabels(requestType, actionName);
  const checkpoints = [
    { gate: 'Gate 1 - Intake', check: 'Campos obrigatorios preenchidos', source: required.length > 0 ? required.join('; ') : 'Nao aplicavel' },
    { gate: 'Gate 2 - Qualidade', check: 'Validacoes obrigatorias satisfeitas', source: validations.length > 0 ? validations.join('; ') : 'Nao aplicavel' },
    { gate: 'Gate 3 - Governanca', check: 'Aprovacoes registradas', source: approvals.length > 0 ? approvals.join('; ') : 'Nao aplicavel' },
    { gate: 'Gate 4 - Execucao', check: labels.execution, source: rules.length > 0 ? rules.join('; ') : 'Seguir padrao tecnico da acao' },
    { gate: 'Gate 5 - Encerramento', check: 'Evidencias anexadas e comunicacao de conclusao', source: 'Historico do chamado atualizado + anexos + resultado final' },
  ];

  const header = '| Gate | Verificacao obrigatoria | Referencia da tela |';
  const separator = '| --- | --- | --- |';
  const rows = checkpoints.map((item) => `| ${item.gate} | ${item.check} | ${item.source} |`);
  return [header, separator, ...rows].join('\n');
}

function docForScreen({
  requestType,
  category,
  actionName,
  adrFile,
  required,
  optional,
  validations,
  approvals,
  rules,
  prerequisites,
  documents,
}) {
  return [
    `# BDSM - ${actionName} (\`${requestType}\`)`,
    '',
    `- Categoria: ${category}`,
    `- Fonte funcional: [${adrFile}](../adr/${adrFile})`,
    '',
    '## 1. Objetivo do processo',
    `Definir o fluxo proposto de execucao do chamado \`${requestType}\` com controles de qualidade, governanca, seguranca e rastreabilidade.`,
    '',
    '## 2. Entradas do processo',
    '### 2.1 Prerequisitos',
    bullets(prerequisites),
    '',
    '### 2.2 Campos obrigatorios da tela',
    bullets(required),
    '',
    '### 2.3 Campos opcionais da tela',
    bullets(optional),
    '',
    '### 2.4 Documentos/evidencias esperadas',
    bullets(documents),
    '',
    '## 3. BDSM do processo proposto',
    processMermaid(requestType, actionName),
    '',
    '## 4. Gates de controle para execucao',
    executionChecklist(required, validations, approvals, rules, requestType, actionName),
    '',
    '## 5. Boas praticas aplicaveis',
    bullets(bestPractices(requestType, actionName)),
    '',
    '## 6. Regras especificas da tela',
    bullets(rules),
    '',
    '## 7. Criterios de conclusao',
    '- Todas as validacoes obrigatorias atendidas.',
    '- Aprovacoes registradas conforme cadeia da categoria.',
    '- Execucao tecnica concluida sem pendencias abertas.',
    '- Evidencias anexadas e comunicacao final registrada no chamado.',
    '',
  ].join('\n');
}

async function generate() {
  const files = await readdir(ADR_DIR);
  const adrFiles = files
    .filter((file) => file.startsWith('ADR_') && file.endsWith('.md'))
    .filter((file) => !ADR_SKIP.has(file))
    .sort();

  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const indexRows = [];

  for (const adrFile of adrFiles) {
    const fullPath = path.join(ADR_DIR, adrFile);
    const text = await readFile(fullPath, 'utf-8');

    const requestType = findMeta(text, 'Tipo de solicitacao');
    const category = findMeta(text, 'Categoria');
    const actionName = findMeta(text, 'Acao registrada');
    if (!requestType || !category || !actionName) continue;

    const prerequisites = sectionBullets(text, '### 5.1 Prerequisitos', '### 5.2 Documentos e evidencias');
    const documents = sectionBullets(text, '### 5.2 Documentos e evidencias', '### 5.3 Validacoes obrigatorias');
    const validations = sectionBullets(text, '### 5.3 Validacoes obrigatorias', '### 5.4 Cadeia de aprovacao');
    const approvals = sectionBullets(text, '### 5.4 Cadeia de aprovacao', '## 6. Padroes Aplicaveis a Esta Tela');
    const required = sectionBullets(text, '### 3.1 Campos obrigatorios', '### 3.2 Campos opcionais');
    const optional = sectionBullets(text, '### 3.2 Campos opcionais', '## 4. Detalhamento dos Campos da Tela');
    const rules = sectionBullets(text, '### 6.3 Regras especificas desta acao', '## 7. Exemplos da Tela');

    const content = docForScreen({
      requestType,
      category,
      actionName,
      adrFile,
      required,
      optional,
      validations,
      approvals,
      rules,
      prerequisites,
      documents,
    });

    const outFile = `${requestType}.md`;
    await writeFile(path.join(OUT_DIR, outFile), content, 'utf-8');
    indexRows.push(`| \`${requestType}\` | ${category} | ${actionName} | [Abrir](./${outFile}) |`);
  }

  const readme = [
    '# BDSM por Tela (Processo de Execucao do Chamado)',
    '',
    'Documentacao de processo proposta para cada tela/request type, com foco em melhores praticas de execucao e governanca.',
    '',
    '| Tela (request type) | Categoria | Acao | Documento BDSM |',
    '| --- | --- | --- | --- |',
    ...(indexRows.length > 0 ? indexRows : ['| Nao aplicavel | Nao aplicavel | Nao aplicavel | Nao aplicavel |']),
    '',
    `Total de processos documentados: ${indexRows.length}`,
    '',
  ].join('\n');

  await writeFile(path.join(OUT_DIR, 'README.md'), readme, 'utf-8');
  console.log(`BDSM gerados: ${indexRows.length} processos em docs/bdsm`);
}

generate().catch((error) => {
  console.error(error);
  process.exit(1);
});

