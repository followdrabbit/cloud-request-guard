# ADR_ALTERACAO_USUARIO_IAM_AWS

- Status: Proposto
- Data: 2026-03-18
- Tipo de solicitacao: iam-user-update
- Categoria: Usuarios IAM AWS
- Acao registrada: Alteracao de usuario IAM

## 1. Contexto da Tela
Categoria com criticidade **Alta**, SLA **24 horas uteis** e tipo **standard**.
Criacao, alteracao e remocao de usuarios IAM locais em contas AWS.
Quando usar: Quando houver necessidade excepcional de usuario IAM local de servico.
Foco deste ADR: somente a tela de **Alteracao de usuario IAM**.

## 2. Decisoes Arquiteturais (itens detalhados)
### 2.1 Fluxo em tela unica
**Explicacao**: Preenchimento em tela unica reduz friccao; revisao final e obrigatoria antes do envio.
**Exemplo**: Solicitante revisa categoria, acao, escopo e justificativa antes de confirmar.

### 2.2 Categoria e acao implicitas pela navegacao
**Explicacao**: A rota do catalogo define automaticamente o contexto da solicitacao.
**Exemplo**: Esta solicitacao ja nasce no contexto de "Alteracao de usuario IAM".

### 2.3 Coleta minima de dados
**Explicacao**: Somente campos que impactam execucao, risco e auditoria permanecem obrigatorios.
**Exemplo**: Campos variam por categoria; no levantamento AWS ha titulo da solicitacao para orientar a consulta.

### 2.4 Escopo e validacao operacional
**Explicacao**: A categoria define regras de escopo para evitar erro de execucao.
**Exemplo**: Fluxo padrao nao inclui criacao de usuario IAM pessoal local.

### 2.5 Padroes e taxonomia
**Explicacao**: Naming e padroes operacionais sao obrigatorios para consistencia e automacao.
**Exemplo**: Fluxo padrao: AWS_US_{NOME_DO_USUARIO}_{PRD|HML|DEV}

### 2.6 Requisitos e aprovacoes formais
**Explicacao**: Prerequisitos, validacoes e cadeia de aprovacao sustentam governanca e compliance.
**Exemplo**: Aprovadores: Gestor solicitante, Seguranca Cloud, IAM Admin.

### 2.7 Evidencia tecnica
**Explicacao**: A categoria aceita anexo opcional de JSON tecnico para apoiar execucao e auditoria.
**Exemplo**: Exemplo: trust-policy.json e permission-policy.json.

### 2.8 Regra especifica da acao
**Explicacao**: Selecionar ao menos uma acao: Adicionar policy, Remover policy, Adicionar grupo, Remover grupo ou Rotacionar key. Cada acao deve conter ao menos um item objetivo para execucao. Limite de ate 10 itens por acao. Na acao Rotacionar key, a key atual e desativada e, apos 7 dias sem solicitacao de reativacao, e excluida.
**Exemplo**: Adicionar policy ReadOnlyAccess + Remover grupo IAM-Legado + Rotacionar key AKIAIOSFODNN7EXAMPLE

## 3. Campos da Tela (Alteracao de usuario IAM)
**Objetivo da tela**: Ajustar usuario IAM existente com acoes explicitas de policy, grupo e access key.
### 3.1 Campos obrigatorios
- Conta AWS
- Usuario IAM Alvo (nome/ARN)
- Acoes da Alteracao do Usuario IAM
- Justificativa

### 3.2 Campos opcionais
- Comentarios
- Upload de Anexos (opcional)

## 4. Detalhamento dos Campos da Tela
### 4.1 Campos obrigatorios com explicacao
- **Conta AWS**: Conta AWS alvo da execucao; ambiente e implicito na conta selecionada.
- **Usuario IAM Alvo (nome/ARN)**: Identificador livre do recurso existente (nome legado ou ARN), sem exigir taxonomia nova.
- **Acoes da Alteracao do Usuario IAM**: Dropdown com acoes padronizadas (policy, grupo e rotacao de key); ao menos uma acao obrigatoria com detalhamento por item. Em rotacao de key, a key atual e desativada e excluida apos 7 dias sem reativacao.
- **Justificativa**: Motivacao formal para aprovacao e auditoria.

### 4.2 Campos opcionais com explicacao
- **Comentarios**: Campo opcional para contexto adicional e orientacoes de execucao.
- **Upload de Anexos (opcional)**: Upload opcional unico para evidencias da justificativa e artefatos tecnicos.

## 5. Requisitos Aplicaveis a Esta Tela
### 5.1 Prerequisitos
- Conta AWS ativa
- Justificativa de excecao para usuario local
- Owner tecnico definido

### 5.2 Documentos e evidencias
- Justificativa de negocio
- Escopo de permissoes
- Plano de desativacao (remocao)

### 5.3 Validacoes obrigatorias
- Acesso de usuario de servico somente Programatico (sem console)
- Sem privilegio admin sem justificativa
- Rotacao de access keys
- Producao com aprovacao reforcada

### 5.4 Cadeia de aprovacao
- Gestor solicitante
- Seguranca Cloud
- IAM Admin

## 6. Padroes Aplicaveis a Esta Tela
### 6.1 Taxonomia e nomenclatura
- Fluxo padrao: AWS_US_{NOME_DO_USUARIO}_{PRD|HML|DEV}
- US_PRS reservado para fluxo de excecao

### 6.2 Padroes operacionais
- Criacao padrao somente para usuario de servico local
- Usuario pessoal local somente por fluxo de excecao

### 6.3 Regras especificas desta acao
- Selecionar ao menos uma acao: Adicionar policy, Remover policy, Adicionar grupo, Remover grupo ou Rotacionar key.
- Cada acao deve conter ao menos um item objetivo para execucao.
- Limite de ate 10 itens por acao.
- Na acao Rotacionar key, a key atual e desativada e, apos 7 dias sem solicitacao de reativacao, e excluida.

## 7. Exemplos da Tela
- Adicionar policy ReadOnlyAccess + Remover grupo IAM-Legado + Rotacionar key AKIAIOSFODNN7EXAMPLE

## 8. Tooltips da Tela
### 8.1 Tooltips dos campos obrigatorios
- **Conta AWS**
  Tooltip: Selecione a conta AWS alvo da solicitacao. O ambiente ja esta implicito na conta selecionada.
  Exemplo: 123456789012 (prd-payment-gateway) - Ambiente: PRD
  Documentacao AWS: [AWS Organizations - Criar conta](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_create.html)

- **Usuario IAM Alvo (nome/ARN)**
  Tooltip: Informe nome ou ARN de usuario IAM existente para alteracao/remocao.
  Exemplo: arn:aws:iam::123456789012:user/usuario-legado
  Documentacao AWS: [IAM Users](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html)

- **Acoes da Alteracao do Usuario IAM**
  Tooltip: Selecione ao menos uma acao de alteracao para o usuario IAM e detalhe os itens envolvidos. Em rotacao de key, a key atual e desativada e excluida apos 7 dias sem solicitacao de reativacao.
  Exemplo: Adicionar policy + Remover grupo + Rotacionar key
  Documentacao AWS: [IAM Users](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html), [IAM User groups](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html), [IAM Policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html), [IAM access keys](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html)

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
