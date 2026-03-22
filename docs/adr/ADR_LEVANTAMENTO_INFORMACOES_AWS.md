# ADR_LEVANTAMENTO_INFORMACOES_AWS

- Status: Proposto
- Data: 2026-03-18
- Tipo de solicitacao: info-create
- Categoria: Levantamento de Informacoes AWS
- Acao registrada: Levantamento de informacoes AWS

## 1. Contexto da Tela
Categoria com criticidade **Alta**, SLA **24 horas uteis** e tipo **standard**.
Solicitacao de consultas, inventarios e extracoes de informacoes sobre contas, recursos, servicos e identidades AWS.
Quando usar: Quando o solicitante precisar de dados de AWS para analise operacional, seguranca, compliance ou governanca.
Foco deste ADR: somente a tela de **Levantamento de informacoes AWS**.

## 2. Decisoes Arquiteturais (itens detalhados)
### 2.1 Fluxo em tela unica
**Explicacao**: Preenchimento em tela unica reduz friccao; revisao final e obrigatoria antes do envio.
**Exemplo**: Solicitante revisa categoria, acao, escopo e justificativa antes de confirmar.

### 2.2 Categoria e acao implicitas pela navegacao
**Explicacao**: A rota do catalogo define automaticamente o contexto da solicitacao.
**Exemplo**: Esta solicitacao ja nasce no contexto de "Levantamento de informacoes AWS".

### 2.3 Coleta minima de dados
**Explicacao**: Somente campos que impactam execucao, risco e auditoria permanecem obrigatorios.
**Exemplo**: Campos variam por categoria; no levantamento AWS ha titulo da solicitacao para orientar a consulta.

### 2.4 Escopo e validacao operacional
**Explicacao**: A categoria define regras de escopo para evitar erro de execucao.
**Exemplo**: O formulario aceita escopo amplo (todas as contas/organizacao inteira) ou escopo especifico (conta, recurso ou identidade unica).

### 2.5 Padroes e taxonomia
**Explicacao**: Naming e padroes operacionais sao obrigatorios para consistencia e automacao.
**Exemplo**: Nao ha taxonomia obrigatoria de nome para este fluxo.

### 2.6 Requisitos e aprovacoes formais
**Explicacao**: Prerequisitos, validacoes e cadeia de aprovacao sustentam governanca e compliance.
**Exemplo**: Aprovadores: Gestor solicitante, Seguranca Cloud, Governanca Cloud.

### 2.7 Evidencia tecnica
**Explicacao**: A categoria aceita anexo opcional de JSON tecnico para apoiar execucao e auditoria.
**Exemplo**: Exemplo: trust-policy.json e permission-policy.json.

### 2.8 Regra especifica da acao
**Explicacao**: A solicitacao pode cobrir dump amplo (ex.: todas as roles/policies/recursos) ou alvo especifico. O conteudo do levantamento e informado em texto livre para reduzir friccao de abertura. No mesmo campo, o solicitante pode combinar escopo amplo e alvos especificos.
**Exemplo**: Descricao: dump de roles e policies em todas as contas + inventario de recursos em uso + detalhe do bucket bucket-logs-aplicacao-prd

## 3. Campos da Tela (Levantamento de informacoes AWS)
**Objetivo da tela**: Registrar solicitacao de levantamento AWS em formato simplificado, com foco em um campo unico de descricao livre.
### 3.1 Campos obrigatorios
- Descricao do levantamento
- Justificativa do levantamento

### 3.2 Campos opcionais
- Comentarios
- Upload de Anexos (opcional)

## 4. Detalhamento dos Campos da Tela
### 4.1 Campos obrigatorios com explicacao
- **Descricao do levantamento**: Campo livre para o solicitante descrever exatamente o que precisa levantar, incluindo escopo amplo e/ou alvos especificos.
- **Justificativa do levantamento**: Motivacao formal da consulta e resultado esperado para aprovacao e rastreabilidade.

### 4.2 Campos opcionais com explicacao
- **Comentarios**: Campo opcional para contexto adicional e orientacoes de execucao.
- **Upload de Anexos (opcional)**: Upload opcional unico para evidencias da justificativa e artefatos tecnicos.

## 5. Requisitos Aplicaveis a Esta Tela
### 5.1 Prerequisitos
- Objetivo do levantamento definido
- Descricao do levantamento informada
- Resultado esperado claro

### 5.2 Documentos e evidencias
- Descricao do levantamento
- Anexos de apoio (quando houver)

### 5.3 Validacoes obrigatorias
- Descricao do levantamento obrigatoria
- Justificativa obrigatoria

### 5.4 Cadeia de aprovacao
- Gestor solicitante
- Seguranca Cloud
- Governanca Cloud

## 6. Padroes Aplicaveis a Esta Tela
### 6.1 Taxonomia e nomenclatura
- Nao ha taxonomia obrigatoria de nome para este fluxo.

### 6.2 Padroes operacionais
- Fluxo em tela unica com revisao final
- Formulario simplificado com foco em texto livre

### 6.3 Regras especificas desta acao
- A solicitacao pode cobrir dump amplo (ex.: todas as roles/policies/recursos) ou alvo especifico.
- O conteudo do levantamento e informado em texto livre para reduzir friccao de abertura.
- No mesmo campo, o solicitante pode combinar escopo amplo e alvos especificos.

## 7. Exemplos da Tela
- Descricao: dump de roles e policies em todas as contas + inventario de recursos em uso + detalhe do bucket bucket-logs-aplicacao-prd

## 8. Tooltips da Tela
### 8.1 Tooltips dos campos obrigatorios
- **Descricao do levantamento**
  Tooltip: Descreva de forma livre o que precisa ser levantado, podendo combinar escopo amplo e itens especificos.
  Exemplo: Dump de roles/policies/recursos em todas as contas + detalhe do bucket bucket-logs-aplicacao-prd.
  Documentacao AWS: Nao aplicavel

- **Justificativa do levantamento**
  Tooltip: Explique por que o levantamento e necessario, qual risco/decisao ele suporta e resultado esperado.
  Exemplo: Mapear permissoes e ultimo uso para preparar remediacao de acessos privilegiados.
  Documentacao AWS: Nao aplicavel

### 8.2 Tooltips dos campos opcionais
- **Comentarios**
  Tooltip: Campo opcional para contexto adicional que nao cabe nos demais campos.
  Exemplo: Executar fora do horario comercial para reduzir impacto.
  Documentacao AWS: Nao aplicavel

- **Upload de Anexos (opcional)**
  Tooltip: Upload opcional unico para evidencias da justificativa e arquivos tecnicos (incluindo JSON).
  Exemplo: evidencias_operacao.pdf, trust-policy.json
  Documentacao AWS: Nao aplicavel

## 9. Consequencias
- Reduz ambiguidade de preenchimento e melhora consistencia operacional.
- Facilita implementacao backend, QA e auditoria.
- Serve como base de treinamento para solicitantes e aprovadores.
