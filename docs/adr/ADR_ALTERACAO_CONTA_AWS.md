# ADR_ALTERACAO_CONTA_AWS

- Status: Proposto
- Data: 2026-03-18
- Tipo de solicitacao: account-update
- Categoria: Contas AWS
- Acao registrada: Alteracao de conta AWS

## 1. Contexto da Tela
Categoria com criticidade **Critica**, SLA **5 dias uteis** e tipo **standard**.
Criacao, alteracao e remocao de contas AWS na organizacao corporativa.
Quando usar: Quando um projeto precisar de isolamento em conta dedicada.
Foco deste ADR: somente a tela de **Alteracao de conta AWS**.

## 2. Decisoes Arquiteturais (itens detalhados)
### 2.1 Fluxo em tela unica
**Explicacao**: Preenchimento em tela unica reduz friccao; revisao final e obrigatoria antes do envio.
**Exemplo**: Solicitante revisa categoria, acao, escopo e justificativa antes de confirmar.

### 2.2 Categoria e acao implicitas pela navegacao
**Explicacao**: A rota do catalogo define automaticamente o contexto da solicitacao.
**Exemplo**: Esta solicitacao ja nasce no contexto de "Alteracao de conta AWS".

### 2.3 Coleta minima de dados
**Explicacao**: Somente campos que impactam execucao, risco e auditoria permanecem obrigatorios.
**Exemplo**: Campos variam por categoria; no levantamento AWS ha titulo da solicitacao para orientar a consulta.

### 2.4 Escopo e validacao operacional
**Explicacao**: A categoria define regras de escopo para evitar erro de execucao.
**Exemplo**: Criacao nao exige conta preexistente.

### 2.5 Padroes e taxonomia
**Explicacao**: Naming e padroes operacionais sao obrigatorios para consistencia e automacao.
**Exemplo**: Conta AWS: AWS_AC_{NOME_DA_CONTA}_{PRD|HML|DEV}

### 2.6 Requisitos e aprovacoes formais
**Explicacao**: Prerequisitos, validacoes e cadeia de aprovacao sustentam governanca e compliance.
**Exemplo**: Aprovadores: Gestor solicitante, Arquiteto Cloud, Seguranca Cloud, Governanca Cloud.

### 2.7 Evidencia tecnica
**Explicacao**: A categoria aceita anexo opcional de JSON tecnico para apoiar execucao e auditoria.
**Exemplo**: Exemplo: trust-policy.json e permission-policy.json.

### 2.8 Regra especifica da acao
**Explicacao**: Descrever impacto e reversao quando aplicavel.
**Exemplo**: Ajuste de owner tecnico e guardrails de rede

## 3. Campos da Tela (Alteracao de conta AWS)
**Objetivo da tela**: Ajustar baseline e configuracoes de conta existente.
### 3.1 Campos obrigatorios
- Conta AWS
- Alteracoes Solicitadas
- Justificativa

### 3.2 Campos opcionais
- Comentarios
- Upload de Anexos (opcional)

## 4. Detalhamento dos Campos da Tela
### 4.1 Campos obrigatorios com explicacao
- **Conta AWS**: Conta AWS alvo da execucao; ambiente e implicito na conta selecionada.
- **Alteracoes Solicitadas**: Campo tecnico/operacional necessario para execucao segura.
- **Justificativa**: Motivacao formal para aprovacao e auditoria.

### 4.2 Campos opcionais com explicacao
- **Comentarios**: Campo opcional para contexto adicional e orientacoes de execucao.
- **Upload de Anexos (opcional)**: Upload opcional unico para evidencias da justificativa e artefatos tecnicos.

## 5. Requisitos Aplicaveis a Esta Tela
### 5.1 Prerequisitos
- Aprovacao executiva
- Centro de custo definido
- Owner tecnico designado

### 5.2 Documentos e evidencias
- Business case
- Classificacao de dados
- Plano de compliance

### 5.3 Validacoes obrigatorias
- Nome padronizado
- Baseline obrigatoria
- Centro de custo valido

### 5.4 Cadeia de aprovacao
- Gestor solicitante
- Arquiteto Cloud
- Seguranca Cloud
- Governanca Cloud

## 6. Padroes Aplicaveis a Esta Tela
### 6.1 Taxonomia e nomenclatura
- Conta AWS: AWS_AC_{NOME_DA_CONTA}_{PRD|HML|DEV}

### 6.2 Padroes operacionais
- Tela unica com revisao final
- Escopo por conta AWS quando alteracao/remocao

### 6.3 Regras especificas desta acao
- Descrever impacto e reversao quando aplicavel.

## 7. Exemplos da Tela
- Ajuste de owner tecnico e guardrails de rede

## 8. Tooltips da Tela
### 8.1 Tooltips dos campos obrigatorios
- **Conta AWS**
  Tooltip: Selecione a conta AWS alvo da solicitacao. O ambiente ja esta implicito na conta selecionada.
  Exemplo: 123456789012 (prd-payment-gateway) - Ambiente: PRD
  Documentacao AWS: [AWS Organizations - Criar conta](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_create.html)

- **Alteracoes Solicitadas**
  Tooltip: Descreva objetivamente o que deve mudar, com acao esperada, impacto e criterio de sucesso.
  Exemplo: Adicionar policy X, remover policy Y e ajustar trust para incluir service Z.
  Documentacao AWS: Nao aplicavel

- **Justificativa**
  Tooltip: Justifique necessidade, risco mitigado e resultado esperado da solicitacao.
  Exemplo: Ajuste necessario para atender auditoria e principio de menor privilegio.
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
