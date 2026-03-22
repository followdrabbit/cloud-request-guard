# ADR_CRIACAO_ROLE_AWS

- Status: Proposto
- Data: 2026-03-18
- Tipo de solicitacao: role-create
- Categoria: Role AWS
- Acao registrada: Criacao de role

## 1. Contexto da Tela
Categoria com criticidade **Alta**, SLA **48 horas uteis** e tipo **standard**.
Criacao, alteracao e remocao de IAM Roles para workloads e servicos AWS.
Quando usar: Quando uma entidade precisar assumir permissoes especificas via role.
Foco deste ADR: somente a tela de **Criacao de role**.

## 2. Decisoes Arquiteturais (itens detalhados)
### 2.1 Fluxo em tela unica
**Explicacao**: Preenchimento em tela unica reduz friccao; revisao final e obrigatoria antes do envio.
**Exemplo**: Solicitante revisa categoria, acao, escopo e justificativa antes de confirmar.

### 2.2 Categoria e acao implicitas pela navegacao
**Explicacao**: A rota do catalogo define automaticamente o contexto da solicitacao.
**Exemplo**: Esta solicitacao ja nasce no contexto de "Criacao de role".

### 2.3 Coleta minima de dados
**Explicacao**: Somente campos que impactam execucao, risco e auditoria permanecem obrigatorios.
**Exemplo**: Campos variam por categoria; no levantamento AWS ha titulo da solicitacao para orientar a consulta.

### 2.4 Escopo e validacao operacional
**Explicacao**: A categoria define regras de escopo para evitar erro de execucao.
**Exemplo**: Uma conta AWS por solicitacao; ambiente e implicito na conta selecionada.

### 2.5 Padroes e taxonomia
**Explicacao**: Naming e padroes operacionais sao obrigatorios para consistencia e automacao.
**Exemplo**: Role: AWS_RL_{NOME_DA_ROLE}_{PRD|HML|DEV}

### 2.6 Requisitos e aprovacoes formais
**Explicacao**: Prerequisitos, validacoes e cadeia de aprovacao sustentam governanca e compliance.
**Exemplo**: Aprovadores: Gestor solicitante, Seguranca Cloud, IAM Admin.

### 2.7 Evidencia tecnica
**Explicacao**: A categoria aceita anexo opcional de JSON tecnico para apoiar execucao e auditoria.
**Exemplo**: Exemplo: trust-policy.json e permission-policy.json.

### 2.8 Regra especifica da acao
**Explicacao**: Revisao deve exibir nome final da role, ambiente e policies vinculadas.
**Exemplo**: AWS_RL_LAMBDA_INTEGRATION_PRD

## 3. Campos da Tela (Criacao de role)
**Objetivo da tela**: Criar role padronizada no ambiente da conta selecionada.
### 3.1 Campos obrigatorios
- Conta AWS
- Nome da Role
- Trusted Entity
- Principal(is) Confiavel(is)
- Permissoes Iniciais da Role
- Justificativa

### 3.2 Campos opcionais
- Policies Existentes para Attach (quando modo attach-existing)
- Comentarios
- Upload de Anexos (opcional)

## 4. Detalhamento dos Campos da Tela
### 4.1 Campos obrigatorios com explicacao
- **Conta AWS**: Conta AWS alvo da execucao; ambiente e implicito na conta selecionada.
- **Nome da Role**: No create, usa nomenclatura padronizada para gerar o nome final da role no ambiente da conta selecionada.
- **Trusted Entity**: Campo tecnico/operacional necessario para execucao segura.
- **Principal(is) Confiavel(is)**: Campo tecnico/operacional necessario para execucao segura.
- **Permissoes Iniciais da Role**: Campo tecnico/operacional necessario para execucao segura.
- **Justificativa**: Motivacao formal para aprovacao e auditoria.

### 4.2 Campos opcionais com explicacao
- **Policies Existentes para Attach (quando modo attach-existing)**: Campo tecnico/operacional necessario para execucao segura.
- **Comentarios**: Campo opcional para contexto adicional e orientacoes de execucao.
- **Upload de Anexos (opcional)**: Upload opcional unico para evidencias da justificativa e artefatos tecnicos.

## 5. Requisitos Aplicaveis a Esta Tela
### 5.1 Prerequisitos
- Conta AWS ativa
- Role alvo ou nome padronizado definido conforme acao

### 5.2 Documentos e evidencias
- Justificativa de menor privilegio
- Evidencias tecnicas da alteracao/remocao quando aplicavel

### 5.3 Validacoes obrigatorias
- Escopo por conta AWS obrigatorio
- Nome padronizado obrigatorio no create
- Role alvo obrigatoria no update/delete
- Acoes de alteracao obrigatorias no role-update
- Policy JSON valido quando anexado

### 5.4 Cadeia de aprovacao
- Gestor solicitante
- Seguranca Cloud
- IAM Admin

## 6. Padroes Aplicaveis a Esta Tela
### 6.1 Taxonomia e nomenclatura
- Role: AWS_RL_{NOME_DA_ROLE}_{PRD|HML|DEV}

### 6.2 Padroes operacionais
- Escopo por chamado: 1 role por solicitacao
- Escopo por conta AWS: 1 conta por solicitacao (ambiente implicito pela conta)

### 6.3 Regras especificas desta acao
- Revisao deve exibir nome final da role, ambiente e policies vinculadas.

## 7. Exemplos da Tela
- AWS_RL_LAMBDA_INTEGRATION_PRD

## 8. Tooltips da Tela
### 8.1 Tooltips dos campos obrigatorios
- **Conta AWS**
  Tooltip: Selecione a conta AWS alvo da solicitacao. O ambiente ja esta implicito na conta selecionada.
  Exemplo: 123456789012 (prd-payment-gateway) - Ambiente: PRD
  Documentacao AWS: [AWS Organizations - Criar conta](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_create.html)

- **Nome da Role**
  Tooltip: Informe somente a parte variavel da role. O padrao final e montado automaticamente.
  Exemplo: AWS_RL_LAMBDA_INTEGRATION_PRD
  Documentacao AWS: [IAM Roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)

- **Trusted Entity**
  Tooltip: Selecione o tipo de entidade confiavel para guiar o formato de principal.
  Exemplo: AWS Service
  Documentacao AWS: [IAM Roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html), [Trust policy de role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_update-role-trust-policy.html)

- **Principal(is) Confiavel(is)**
  Tooltip: Informe um ou mais principals coerentes com o Trusted Entity selecionado.
  Exemplo: lambda.amazonaws.com ou arn:aws:iam::123456789012:root
  Documentacao AWS: [IAM Roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html), [Trust policy de role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_update-role-trust-policy.html)

- **Permissoes Iniciais da Role**
  Tooltip: Escolha se a role sera criada sem permissao inicial ou com attach de policies existentes.
  Exemplo: Realizar attach de policies existentes
  Documentacao AWS: [IAM Roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html), [IAM Policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)

- **Justificativa**
  Tooltip: Justifique necessidade, risco mitigado e resultado esperado da solicitacao.
  Exemplo: Ajuste necessario para atender auditoria e principio de menor privilegio.
  Documentacao AWS: Nao aplicavel

### 8.2 Tooltips dos campos opcionais
- **Policies Existentes para Attach (quando modo attach-existing)**
  Tooltip: Informe nome ou ARN das policies existentes que devem ser anexadas no momento da criacao.
  Exemplo: arn:aws:iam::aws:policy/ReadOnlyAccess
  Documentacao AWS: [IAM Policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)

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
