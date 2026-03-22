# ADR_ALTERACAO_ROLE_AWS

- Status: Proposto
- Data: 2026-03-18
- Tipo de solicitacao: role-update
- Categoria: Role AWS
- Acao registrada: Alteracao de role

## 1. Contexto da Tela
Categoria com criticidade **Alta**, SLA **48 horas uteis** e tipo **standard**.
Criacao, alteracao e remocao de IAM Roles para workloads e servicos AWS.
Quando usar: Quando uma entidade precisar assumir permissoes especificas via role.
Foco deste ADR: somente a tela de **Alteracao de role**.

## 2. Decisoes Arquiteturais (itens detalhados)
### 2.1 Fluxo em tela unica
**Explicacao**: Preenchimento em tela unica reduz friccao; revisao final e obrigatoria antes do envio.
**Exemplo**: Solicitante revisa categoria, acao, escopo e justificativa antes de confirmar.

### 2.2 Categoria e acao implicitas pela navegacao
**Explicacao**: A rota do catalogo define automaticamente o contexto da solicitacao.
**Exemplo**: Esta solicitacao ja nasce no contexto de "Alteracao de role".

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
**Explicacao**: Selecionar ao menos uma acao no dropdown: Adicionar policy, Remover policy, Adicionar Trusted Entity, Alterar Trusted Entity, Remover Trusted Entity. Acoes de policy permitem ate 10 policies por solicitacao. Cada acao selecionada deve conter detalhamento objetivo para execucao.
**Exemplo**: Adicionar policy: arn:aws:iam::aws:policy/SecurityAudit + Alterar Trusted Entity: trocar principal da conta origem

## 3. Campos da Tela (Alteracao de role)
**Objetivo da tela**: Alterar role existente com acoes explicitas de policy/trusted entity.
### 3.1 Campos obrigatorios
- Conta AWS
- Role alvo para alteracao
- Acoes da Alteracao da Role
- Justificativa

### 3.2 Campos opcionais
- Comentarios
- Upload de Anexos (opcional)

## 4. Detalhamento dos Campos da Tela
### 4.1 Campos obrigatorios com explicacao
- **Conta AWS**: Conta AWS alvo da execucao; ambiente e implicito na conta selecionada.
- **Role alvo para alteracao**: Nome livre ou ARN da role existente que sera alterada.
- **Acoes da Alteracao da Role**: Dropdown com acoes padronizadas; ao menos uma acao obrigatoria com detalhamento por item.
- **Justificativa**: Motivacao formal para aprovacao e auditoria.

### 4.2 Campos opcionais com explicacao
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
- Selecionar ao menos uma acao no dropdown: Adicionar policy, Remover policy, Adicionar Trusted Entity, Alterar Trusted Entity, Remover Trusted Entity.
- Acoes de policy permitem ate 10 policies por solicitacao.
- Cada acao selecionada deve conter detalhamento objetivo para execucao.

## 7. Exemplos da Tela
- Adicionar policy: arn:aws:iam::aws:policy/SecurityAudit + Alterar Trusted Entity: trocar principal da conta origem

## 8. Tooltips da Tela
### 8.1 Tooltips dos campos obrigatorios
- **Conta AWS**
  Tooltip: Selecione a conta AWS alvo da solicitacao. O ambiente ja esta implicito na conta selecionada.
  Exemplo: 123456789012 (prd-payment-gateway) - Ambiente: PRD
  Documentacao AWS: [AWS Organizations - Criar conta](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_create.html)

- **Role alvo para alteracao**
  Tooltip: Informe nome ou ARN da role existente, sem forcar taxonomia nova.
  Exemplo: legacy-lambda-integration-role
  Documentacao AWS: [IAM Roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)

- **Acoes da Alteracao da Role**
  Tooltip: Selecione ao menos uma acao de alteracao; cada acao exige detalhamento objetivo para execucao.
  Exemplo: Adicionar policy + Alterar Trusted Entity
  Documentacao AWS: [IAM Roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html), [IAM Policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html), [Trust policy de role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_update-role-trust-policy.html)

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
