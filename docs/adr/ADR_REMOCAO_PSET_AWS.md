# ADR_REMOCAO_PSET_AWS

- Status: Proposto
- Data: 2026-03-18
- Tipo de solicitacao: pset-delete
- Categoria: PSET AWS
- Acao registrada: Remocao de PSET

## 1. Contexto da Tela
Categoria com criticidade **Alta**, SLA **48 horas uteis** e tipo **standard**.
Criacao, alteracao e remocao de Permission Sets no IAM Identity Center.
Quando usar: Para padronizar perfis de permissao distribuidos via Identity Center.
Foco deste ADR: somente a tela de **Remocao de PSET**.

## 2. Decisoes Arquiteturais (itens detalhados)
### 2.1 Fluxo em tela unica
**Explicacao**: Preenchimento em tela unica reduz friccao; revisao final e obrigatoria antes do envio.
**Exemplo**: Solicitante revisa categoria, acao, escopo e justificativa antes de confirmar.

### 2.2 Categoria e acao implicitas pela navegacao
**Explicacao**: A rota do catalogo define automaticamente o contexto da solicitacao.
**Exemplo**: Esta solicitacao ja nasce no contexto de "Remocao de PSET".

### 2.3 Coleta minima de dados
**Explicacao**: Somente campos que impactam execucao, risco e auditoria permanecem obrigatorios.
**Exemplo**: Campos variam por categoria; no levantamento AWS ha titulo da solicitacao para orientar a consulta.

### 2.4 Escopo e validacao operacional
**Explicacao**: A categoria define regras de escopo para evitar erro de execucao.
**Exemplo**: Manter coerencia entre policies e grupos vinculados.

### 2.5 Padroes e taxonomia
**Explicacao**: Naming e padroes operacionais sao obrigatorios para consistencia e automacao.
**Exemplo**: PSET: AWS_PS_{NOME_DO_PSET}_{PRD|HML|DEV}

### 2.6 Requisitos e aprovacoes formais
**Explicacao**: Prerequisitos, validacoes e cadeia de aprovacao sustentam governanca e compliance.
**Exemplo**: Aprovadores: Gestor solicitante, Seguranca Cloud, IAM Admin.

### 2.7 Evidencia tecnica
**Explicacao**: A categoria aceita anexo opcional de JSON tecnico para apoiar execucao e auditoria.
**Exemplo**: Exemplo: trust-policy.json e permission-policy.json.

### 2.8 Regra especifica da acao
**Explicacao**: Validar impacto em grupos e contas antes de remover.
**Exemplo**: Remover PSET legado apos migracao

## 3. Campos da Tela (Remocao de PSET)
**Objetivo da tela**: Remover PSET com controle de impacto.
### 3.1 Campos obrigatorios
- Conta AWS
- Nome do PSET
- Justificativa

### 3.2 Campos opcionais
- Comentarios
- Upload de Anexos (opcional)

## 4. Detalhamento dos Campos da Tela
### 4.1 Campos obrigatorios com explicacao
- **Conta AWS**: Conta AWS alvo da execucao; ambiente e implicito na conta selecionada.
- **Nome do PSET**: No create, usa nomenclatura padronizada; em alteracao/remocao, identifica o PSET alvo por nome existente ou ARN.
- **Justificativa**: Motivacao formal para aprovacao e auditoria.

### 4.2 Campos opcionais com explicacao
- **Comentarios**: Campo opcional para contexto adicional e orientacoes de execucao.
- **Upload de Anexos (opcional)**: Upload opcional unico para evidencias da justificativa e artefatos tecnicos.

## 5. Requisitos Aplicaveis a Esta Tela
### 5.1 Prerequisitos
- Identity Center configurado

### 5.2 Documentos e evidencias
- Justificativa tecnica
- Lista de policies pretendidas

### 5.3 Validacoes obrigatorias
- Ao menos uma policy obrigatoria
- Permission boundary em producao
- Session duration definida

### 5.4 Cadeia de aprovacao
- Gestor solicitante
- Seguranca Cloud
- IAM Admin

## 6. Padroes Aplicaveis a Esta Tela
### 6.1 Taxonomia e nomenclatura
- PSET: AWS_PS_{NOME_DO_PSET}_{PRD|HML|DEV}

### 6.2 Padroes operacionais
- Associacao com Grupo AD tratada em alteracoes quando aplicavel

### 6.3 Regras especificas desta acao
- Validar impacto em grupos e contas antes de remover.

## 7. Exemplos da Tela
- Remover PSET legado apos migracao

## 8. Tooltips da Tela
### 8.1 Tooltips dos campos obrigatorios
- **Conta AWS**
  Tooltip: Selecione a conta AWS alvo da solicitacao. O ambiente ja esta implicito na conta selecionada.
  Exemplo: 123456789012 (prd-payment-gateway) - Ambiente: PRD
  Documentacao AWS: [AWS Organizations - Criar conta](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_create.html)

- **Nome do PSET**
  Tooltip: No create, informe a parte variavel para gerar o padrao do PSET. Em alteracao/remocao, informe nome existente ou ARN do recurso alvo.
  Exemplo: AWS_PS_FINOPS_READONLY_PRD ou arn:aws:sso:::permissionSet/ssoins-1234567890abcdef/ps-1234567890abcdef
  Documentacao AWS: [IAM Identity Center - Permission sets](https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsetsconcept.html)

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
