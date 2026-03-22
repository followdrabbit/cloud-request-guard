import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ADR_DIR = path.resolve('docs', 'adr');
const OUT_ROOT = path.resolve('docs', 'replicacao');
const SERVICEAIDE_DIR = path.join(OUT_ROOT, 'serviceaide');
const IDN_DIR = path.join(OUT_ROOT, 'sailpoint-identitynow');
const ADR_SKIP = new Set(['ADR_DECISOES_GERAIS_ISM_AWS.md']);

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
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
    .filter((line) => line.length > 0 && line.toLowerCase() !== 'nao aplicavel');
}

function bullets(items) {
  if (!items || items.length === 0) return '- Nao aplicavel';
  return items.map((item) => `- ${item}`).join('\n');
}

function payloadMap(required, optional) {
  const fields = [...required, ...optional];
  if (fields.length === 0) return '- Nao aplicavel';

  return fields
    .map((field) => `- \`${slugify(field)}\`: ${field}`)
    .join('\n');
}

function looksDynamic(rules, validations, required, optional) {
  const entries = [...rules, ...validations, ...required, ...optional].join(' | ').toLowerCase();
  return entries.includes('limite')
    || entries.includes('ao menos uma acao')
    || entries.includes('acoes da alteracao')
    || entries.includes('multipl');
}

function supportsAttachment(optional) {
  return optional.some((item) => item.toLowerCase().includes('upload de anexos'));
}

function serviceAideDoc({
  requestType,
  category,
  actionName,
  adrFile,
  required,
  optional,
  validations,
  approvals,
  rules,
}) {
  const hasDynamic = looksDynamic(rules, validations, required, optional);
  const hasAttachment = supportsAttachment(optional);

  const limitationRows = [
    '| Item | Status | Justificativa | Adaptacao recomendada |',
    '| --- | --- | --- | --- |',
    '| Campos obrigatorios/opcionais | Possivel | O construtor de formulario do ServiceAIDE cobre campos de entrada e obrigatoriedade. | Configurar os campos conforme lista deste documento. |',
    '| Regras de validacao | Parcial | Validacoes simples sao nativas; validacoes mais especificas podem exigir regra custom. | Implementar regra de validacao no formulario ou no workflow de submissao. |',
    hasDynamic
      ? '| Listas dinamicas com limite (adicionar/remover itens) | Parcial | Nem todo padrao de lista dinamica tem equivalente 1:1 no formulario padrao. | Substituir por campo multiline (1 item por linha) + validacao de quantidade no backend. |'
      : '| Listas dinamicas com limite (adicionar/remover itens) | Nao aplicavel | Esta tela nao depende de lista dinamica no modelo atual. | Nao aplicavel. |',
    hasAttachment
      ? '| Upload de anexos | Possivel | Upload e controle de anexos sao recurso comum no chamado ITSM. | Manter upload no ticket e validar extensoes/tamanho conforme politica interna. |'
      : '| Upload de anexos | Nao aplicavel | Esta tela nao exige anexo no modelo atual. | Nao aplicavel. |',
    '| Revisao final da solicitacao (resumo) | Parcial | A experiencia de revisao visual pode variar do fluxo da aplicacao atual. | Gerar resumo no corpo do ticket antes da submissao final. |',
  ].join('\n');

  return [
    `# ServiceAIDE - ${actionName} (\`${requestType}\`)`,
    '',
    `- Categoria de origem: ${category}`,
    `- Fonte funcional: [${adrFile}](../../adr/${adrFile})`,
    '',
    '## 1. Campos obrigatorios',
    bullets(required),
    '',
    '## 2. Campos opcionais',
    bullets(optional),
    '',
    '## 3. Validacoes minimas',
    bullets(validations),
    '',
    '## 4. Aprovacao',
    bullets(approvals),
    '',
    '## 5. Regras da tela (quando houver)',
    bullets(rules),
    '',
    '## 6. Mapeamento de payload (campo -> chave tecnica)',
    payloadMap(required, optional),
    '',
    '## 7. Itens nao 1:1 e adaptacao',
    limitationRows,
    '',
  ].join('\n');
}

function identityNowDoc({
  requestType,
  category,
  actionName,
  adrFile,
  required,
  optional,
  validations,
  approvals,
  rules,
}) {
  const hasDynamic = looksDynamic(rules, validations, required, optional);
  const hasAttachment = supportsAttachment(optional);

  const limitationRows = [
    '| Item | Status em IdentityNow (nativo) | Justificativa | Adaptacao recomendada |',
    '| --- | --- | --- | --- |',
    '| Formulario livre por tela de chamado | Nao possivel 1:1 | IdentityNow e focado em governanca de identidade e nao em catalogo ITSM completo por formulario custom por processo. | Manter intake no ServiceAIDE e enviar payload para workflow no IdentityNow via API/webhook. |',
    '| Campos obrigatorios/opcionais | Parcial | Campos podem ser representados em variaveis de workflow, mas a UX de formulario completo varia por recurso usado. | Capturar campos no sistema de intake e repassar para workflow IdentityNow como input estruturado. |',
    '| Aprovacao multipapel custom por tela | Parcial | IdentityNow suporta etapas de aprovacao, mas o modelo nativo nao replica todo fluxo de ticket ITSM sozinho. | Implementar aprovacao no workflow IdentityNow ou manter aprovacao primaria no ServiceAIDE. |',
    hasDynamic
      ? '| Listas dinamicas com limite (adicionar/remover itens) | Nao possivel 1:1 | Controles dinamicos de formulario com comportamento identico nao sao padrao no fluxo nativo. | Usar campo textual estruturado (JSON/lista por linha) e validar no workflow. |'
      : '| Listas dinamicas com limite (adicionar/remover itens) | Nao aplicavel | Esta tela nao exige lista dinamica no modelo atual. | Nao aplicavel. |',
    hasAttachment
      ? '| Upload de anexos do chamado | Nao possivel 1:1 | Anexo de ticket nao e o foco do request nativo do IdentityNow. | Armazenar anexo no ServiceAIDE/ECM e enviar apenas URL/ID de referencia ao workflow. |'
      : '| Upload de anexos do chamado | Nao aplicavel | Esta tela nao exige anexo no modelo atual. | Nao aplicavel. |',
  ].join('\n');

  return [
    `# SailPoint IdentityNow - ${actionName} (\`${requestType}\`)`,
    '',
    `- Categoria de origem: ${category}`,
    `- Fonte funcional: [${adrFile}](../../adr/${adrFile})`,
    '',
    '## 1. Campos obrigatorios (dados de entrada do workflow)',
    bullets(required),
    '',
    '## 2. Campos opcionais (dados de entrada do workflow)',
    bullets(optional),
    '',
    '## 3. Validacoes minimas esperadas',
    bullets(validations),
    '',
    '## 4. Aprovacao',
    bullets(approvals),
    '',
    '## 5. Regras da tela (quando houver)',
    bullets(rules),
    '',
    '## 6. Mapeamento de payload (campo -> chave tecnica)',
    payloadMap(required, optional),
    '',
    '## 7. Itens nao 1:1 e adaptacao',
    limitationRows,
    '',
    '## 8. Padrao recomendado de implementacao',
    '1. Receber o formulario no ServiceAIDE.',
    '2. Publicar payload estruturado para um workflow no IdentityNow.',
    '3. Executar validacoes de negocio e aprovacao no workflow.',
    '4. Acionar conectores/provisionamento IdentityNow quando aplicavel.',
    '5. Devolver status de execucao para o ticket de origem.',
    '',
  ].join('\n');
}

function sortByRequestType(items) {
  return [...items].sort((a, b) => a.requestType.localeCompare(b.requestType));
}

async function generate() {
  const files = await readdir(ADR_DIR);
  const adrFiles = files
    .filter((file) => file.startsWith('ADR_') && file.endsWith('.md'))
    .filter((file) => !ADR_SKIP.has(file));

  await rm(OUT_ROOT, { recursive: true, force: true });
  await mkdir(SERVICEAIDE_DIR, { recursive: true });
  await mkdir(IDN_DIR, { recursive: true });

  const screens = [];

  for (const adrFile of adrFiles) {
    const fullPath = path.join(ADR_DIR, adrFile);
    const text = await readFile(fullPath, 'utf-8');
    const requestType = findMeta(text, 'Tipo de solicitacao');
    const category = findMeta(text, 'Categoria');
    const actionName = findMeta(text, 'Acao registrada');
    if (!requestType || !category || !actionName) continue;

    const required = sectionBullets(text, '### 3.1 Campos obrigatorios', '### 3.2 Campos opcionais');
    const optional = sectionBullets(text, '### 3.2 Campos opcionais', '## 4. Detalhamento dos Campos da Tela');
    const validations = sectionBullets(text, '### 5.3 Validacoes obrigatorias', '### 5.4 Cadeia de aprovacao');
    const approvals = sectionBullets(text, '### 5.4 Cadeia de aprovacao', '## 6. Padroes Aplicaveis a Esta Tela');
    const rules = sectionBullets(text, '### 6.3 Regras especificas desta acao', '## 7. Exemplos da Tela');

    const common = {
      requestType,
      category,
      actionName,
      adrFile,
      required,
      optional,
      validations,
      approvals,
      rules,
    };

    const serviceAideContent = serviceAideDoc(common);
    const idnContent = identityNowDoc(common);

    const outFile = `${requestType}.md`;
    await writeFile(path.join(SERVICEAIDE_DIR, outFile), serviceAideContent, 'utf-8');
    await writeFile(path.join(IDN_DIR, outFile), idnContent, 'utf-8');

    screens.push({
      requestType,
      actionName,
      category,
      serviceAidePath: `serviceaide/${outFile}`,
      idnPath: `sailpoint-identitynow/${outFile}`,
    });
  }

  const sortedScreens = sortByRequestType(screens);

  const indexRows = sortedScreens
    .map((screen) => `| \`${screen.requestType}\` | ${screen.category} | ${screen.actionName} | [ServiceAIDE](${screen.serviceAidePath}) | [SailPoint IdentityNow](${screen.idnPath}) |`)
    .join('\n');

  const rootReadme = [
    '# Replicacao de Formularios (ServiceAIDE e SailPoint IdentityNow)',
    '',
    'Documentos gerados a partir dos ADRs de cada tela, contendo somente o necessario para replicacao do formulario em cada sistema.',
    '',
    '| Tela (request type) | Categoria | Acao | Documento ServiceAIDE | Documento IdentityNow |',
    '| --- | --- | --- | --- | --- |',
    indexRows || '| Nao aplicavel | Nao aplicavel | Nao aplicavel | Nao aplicavel | Nao aplicavel |',
    '',
    `Total de telas documentadas: ${sortedScreens.length}`,
    '',
  ].join('\n');

  await writeFile(path.join(OUT_ROOT, 'README.md'), rootReadme, 'utf-8');

  const serviceAideReadme = [
    '# ServiceAIDE - Formularios por Tela',
    '',
    'Cada arquivo desta pasta define campos, validacoes, aprovacoes e adaptacoes para replicacao da tela no ServiceAIDE.',
    '',
    ...sortedScreens.map((screen) => `- [${screen.requestType} - ${screen.actionName}](./${screen.requestType}.md)`),
    '',
  ].join('\n');

  await writeFile(path.join(SERVICEAIDE_DIR, 'README.md'), serviceAideReadme, 'utf-8');

  const idnReadme = [
    '# SailPoint IdentityNow - Formularios por Tela',
    '',
    'Cada arquivo desta pasta define os dados de entrada, limites de replicacao nativa e adaptacoes recomendadas para IdentityNow.',
    '',
    ...sortedScreens.map((screen) => `- [${screen.requestType} - ${screen.actionName}](./${screen.requestType}.md)`),
    '',
  ].join('\n');

  await writeFile(path.join(IDN_DIR, 'README.md'), idnReadme, 'utf-8');

  console.log(`Documentos gerados: ${sortedScreens.length * 2 + 3} arquivos em docs/replicacao`);
  console.log(`Telas cobertas: ${sortedScreens.length}`);
}

generate().catch((error) => {
  console.error(error);
  process.exit(1);
});

