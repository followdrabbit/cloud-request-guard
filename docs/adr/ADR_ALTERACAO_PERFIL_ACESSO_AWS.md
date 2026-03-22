# ADR_ALTERACAO_PERFIL_ACESSO_AWS

- Status: Proposto
- Data: 2026-03-18
- Tipo de solicitacao: profile-update
- Categoria: Acessos Corporativos (AD + Identity Center)
- Acao registrada: Alteracao de perfil corporativo

## 1. Contexto da Tela
Categoria com criticidade **Alta**, SLA **72 horas uteis** e tipo **standard**.
Criacao, alteracao e remocao de perfis corporativos com AD e Identity Center.
Quando usar: Quando for necessario ajustar perfil completo de acesso corporativo.
Foco deste ADR: somente a tela de **Alteracao de perfil corporativo**.

## 2. Decisoes Arquiteturais (itens detalhados)
### 2.1 Fluxo em tela unica
**Explicacao**: Preenchimento em tela unica reduz friccao; revisao final e obrigatoria antes do envio.
**Exemplo**: Solicitante revisa categoria, acao, escopo e justificativa antes de confirmar.

### 2.2 Categoria e acao implicitas pela navegacao
**Explicacao**: A rota do catalogo define automaticamente o contexto da solicitacao.
**Exemplo**: Esta solicitacao ja nasce no contexto de "Alteracao de perfil corporativo".

### 2.3 Coleta minima de dados
**Explicacao**: Somente campos que impactam execucao, risco e auditoria permanecem obrigatorios.
**Exemplo**: Campos variam por categoria; no levantamento AWS ha titulo da solicitacao para orientar a consulta.

### 2.4 Escopo e validacao operacional
**Explicacao**: A categoria define regras de escopo para evitar erro de execucao.
**Exemplo**: Manter coerencia entre perfil, grupo AD, PSET e contas alvo.

### 2.5 Padroes e taxonomia
**Explicacao**: Naming e padroes operacionais sao obrigatorios para consistencia e automacao.
**Exemplo**: Perfil: prf-{ambiente}-{nome}

### 2.6 Requisitos e aprovacoes formais
**Explicacao**: Prerequisitos, validacoes e cadeia de aprovacao sustentam governanca e compliance.
**Exemplo**: Aprovadores: Gestor solicitante, Seguranca Cloud, IAM Admin.

### 2.7 Evidencia tecnica
**Explicacao**: A categoria aceita anexo opcional de JSON tecnico para apoiar execucao e auditoria.
**Exemplo**: Exemplo: trust-policy.json e permission-policy.json.

### 2.8 Regra especifica da acao
**Explicacao**: Preservar segregacao de funcao e menor privilegio.
**Exemplo**: Troca de PSET de PowerUser para ReadOnly em PRD

## 3. Campos da Tela (Alteracao de perfil corporativo)
**Objetivo da tela**: Ajustar perfil, grupo e PSET existentes.
### 3.1 Campos obrigatorios
- Conta AWS
- Perfil Corporativo Alvo
- Grupo do Perfil de Acesso (nome livre)
- PSET Associado (nome/ARN)
- Justificativa

### 3.2 Campos opcionais
- Comentarios
- Upload de Anexos (opcional)

## 4. Detalhamento dos Campos da Tela
### 4.1 Campos obrigatorios com explicacao
- **Conta AWS**: Conta AWS alvo da execucao; ambiente e implicito na conta selecionada.
- **Perfil Corporativo Alvo**: Campo tecnico/operacional necessario para execucao segura.
- **Grupo do Perfil de Acesso (nome livre)**: Nome existente do recurso, sem imposicao de taxonomia de criacao.
- **PSET Associado (nome/ARN)**: Campo tecnico/operacional necessario para execucao segura.
- **Justificativa**: Motivacao formal para aprovacao e auditoria.

### 4.2 Campos opcionais com explicacao
- **Comentarios**: Campo opcional para contexto adicional e orientacoes de execucao.
- **Upload de Anexos (opcional)**: Upload opcional unico para evidencias da justificativa e artefatos tecnicos.

## 5. Requisitos Aplicaveis a Esta Tela
### 5.1 Prerequisitos
- PSET existente
- Grupo AD definido
- Conta(s) AWS definidas

### 5.2 Documentos e evidencias
- Justificativa de negocio
- Matriz de acesso

### 5.3 Validacoes obrigatorias
- Grupo AD obrigatorio
- PSET vinculado obrigatorio
- Ao menos uma conta AWS
- Menor privilegio

### 5.4 Cadeia de aprovacao
- Gestor solicitante
- Seguranca Cloud
- IAM Admin

## 6. Padroes Aplicaveis a Esta Tela
### 6.1 Taxonomia e nomenclatura
- Perfil: prf-{ambiente}-{nome}
- Grupo de acesso: AWS_GR_{NOME_DO_PERFIL}_{PRD|HML|DEV}

### 6.2 Padroes operacionais
- Tela unica com revisao final

### 6.3 Regras especificas desta acao
- Preservar segregacao de funcao e menor privilegio.

## 7. Exemplos da Tela
- Troca de PSET de PowerUser para ReadOnly em PRD

## 8. Tooltips da Tela
### 8.1 Tooltips dos campos obrigatorios
- **Conta AWS**
  Tooltip: Selecione a conta AWS alvo da solicitacao. O ambiente ja esta implicito na conta selecionada.
  Exemplo: 123456789012 (prd-payment-gateway) - Ambiente: PRD
  Documentacao AWS: [AWS Organizations - Criar conta](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_create.html)

- **Perfil Corporativo Alvo**
  Tooltip: Informe nome ou identificador existente do perfil corporativo.
  Exemplo: PRF-PGW-PRD-SRE-READONLY
  Documentacao AWS: Nao aplicavel

- **Grupo do Perfil de Acesso (nome livre)**
  Tooltip: Preencha somente com informacoes necessarias para execucao segura da atividade.
  Exemplo: Nao aplicavel
  Documentacao AWS: Nao aplicavel

- **PSET Associado (nome/ARN)**
  Tooltip: Selecione o Permission Set que sera associado ao perfil.
  Exemplo: AWS_PS_SRE_READONLY_PRD
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
