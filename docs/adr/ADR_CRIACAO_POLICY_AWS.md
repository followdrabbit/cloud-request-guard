# ADR_CRIACAO_POLICY_AWS

- Status: Proposto
- Data: 2026-03-18
- Tipo de solicitacao: policy-create
- Categoria: Policy AWS
- Acao registrada: Criacao de policy

## 1. Contexto da Tela
Categoria com criticidade **Alta**, SLA **48 horas uteis** e tipo **standard**.
Criacao, alteracao e remocao de IAM Managed Policies.
Quando usar: Quando for necessario controlar permissao com rastreabilidade e aprovacao formal.
Foco deste ADR: somente a tela de **Criacao de policy**.

## 2. Decisoes Arquiteturais (itens detalhados)
### 2.1 Fluxo em tela unica
**Explicacao**: Preenchimento em tela unica reduz friccao; revisao final e obrigatoria antes do envio.
**Exemplo**: Solicitante revisa categoria, acao, escopo e justificativa antes de confirmar.

### 2.2 Categoria e acao implicitas pela navegacao
**Explicacao**: A rota do catalogo define automaticamente o contexto da solicitacao.
**Exemplo**: Esta solicitacao ja nasce no contexto de "Criacao de policy".

### 2.3 Coleta minima de dados
**Explicacao**: Somente campos que impactam execucao, risco e auditoria permanecem obrigatorios.
**Exemplo**: Campos variam por categoria; no levantamento AWS ha titulo da solicitacao para orientar a consulta.

### 2.4 Escopo e validacao operacional
**Explicacao**: A categoria define regras de escopo para evitar erro de execucao.
**Exemplo**: Criacao coleta Actions e Resources obrigatorios + Conditions opcional; JSON final e montado pelo time executor.

### 2.5 Padroes e taxonomia
**Explicacao**: Naming e padroes operacionais sao obrigatorios para consistencia e automacao.
**Exemplo**: Policy: AWS_PL_{NOME_DA_POLICY}_{PRD|HML|DEV}

### 2.6 Requisitos e aprovacoes formais
**Explicacao**: Prerequisitos, validacoes e cadeia de aprovacao sustentam governanca e compliance.
**Exemplo**: Aprovadores: Gestor solicitante, Seguranca Cloud, IAM Admin, Governanca Cloud.

### 2.7 Evidencia tecnica
**Explicacao**: A categoria aceita anexo opcional de JSON tecnico para apoiar execucao e auditoria.
**Exemplo**: Exemplo: trust-policy.json e permission-policy.json.

### 2.8 Regra especifica da acao
**Explicacao**: Tipo de policy e implicito no create: IAM Managed Policy (sem campo na tela). No create, o solicitante informa Actions, Resources e Conditions (se houver), sem montar JSON manual. No campo Resources, o solicitante deve informar o nome exato do recurso (nao descricao em texto livre) ou ARN. Naming segue AWS_PL_{NOME_DA_POLICY}_{PRD|HML|DEV}.
**Exemplo**: Actions: s3:GetObject, s3:PutObject | Resources: bucket-logs-aplicacao-prd (nome exato) ou arn:aws:s3:::bucket-logs-aplicacao-prd/*

## 3. Campos da Tela (Criacao de policy)
**Objetivo da tela**: Criar IAM Managed Policy nova com Actions/Resources/Conditions estruturados.
### 3.1 Campos obrigatorios
- Conta AWS
- Nome da Policy (Taxonomia)
- Actions Necessarias
- Resources
- Justificativa

### 3.2 Campos opcionais
- Conditions (opcional)
- Comentarios
- Upload de Anexos (opcional)

## 4. Detalhamento dos Campos da Tela
### 4.1 Campos obrigatorios com explicacao
- **Conta AWS**: Conta AWS alvo da execucao; ambiente e implicito na conta selecionada.
- **Nome da Policy (Taxonomia)**: Campo de nomenclatura padronizada para reduzir ambiguidade.
- **Actions Necessarias**: Campo tecnico/operacional necessario para execucao segura.
- **Resources**: Campo tecnico/operacional necessario para execucao segura.
- **Justificativa**: Motivacao formal para aprovacao e auditoria.

### 4.2 Campos opcionais com explicacao
- **Conditions (opcional)**: Campo tecnico/operacional necessario para execucao segura.
- **Comentarios**: Campo opcional para contexto adicional e orientacoes de execucao.
- **Upload de Anexos (opcional)**: Upload opcional unico para evidencias da justificativa e artefatos tecnicos.

## 5. Requisitos Aplicaveis a Esta Tela
### 5.1 Prerequisitos
- Conta ou OU alvo definida
- Owner tecnico identificado
- Escopo da policy detalhado

### 5.2 Documentos e evidencias
- Actions/Resources/Conditions esperados (create)
- JSON atual e JSON proposto (update/remove)
- Justificativa de negocio e risco
- Plano de rollback

### 5.3 Validacoes obrigatorias
- Acoes e resources devem ser informados no create
- Sem wildcard critico sem justificativa
- Change window para producao
- Alteracao/remocao deve manter menor privilegio e plano de rollback

### 5.4 Cadeia de aprovacao
- Gestor solicitante
- Seguranca Cloud
- IAM Admin
- Governanca Cloud

## 6. Padroes Aplicaveis a Esta Tela
### 6.1 Taxonomia e nomenclatura
- Policy: AWS_PL_{NOME_DA_POLICY}_{PRD|HML|DEV}

### 6.2 Padroes operacionais
- Nesta fase, criacao/alteracao/remocao aceitam somente IAM Managed Policy (sem campo de tipo na tela)
- No create, formulario coleta Actions/Resources/Conditions em vez de JSON bruto
- Em alteracao/remocao, informar diff/plano com impacto e rollback

### 6.3 Regras especificas desta acao
- Tipo de policy e implicito no create: IAM Managed Policy (sem campo na tela).
- No create, o solicitante informa Actions, Resources e Conditions (se houver), sem montar JSON manual.
- No campo Resources, o solicitante deve informar o nome exato do recurso (nao descricao em texto livre) ou ARN.
- Naming segue AWS_PL_{NOME_DA_POLICY}_{PRD|HML|DEV}.

## 7. Exemplos da Tela
- Actions: s3:GetObject, s3:PutObject | Resources: bucket-logs-aplicacao-prd (nome exato) ou arn:aws:s3:::bucket-logs-aplicacao-prd/*

## 8. Tooltips da Tela
### 8.1 Tooltips dos campos obrigatorios
- **Conta AWS**
  Tooltip: Selecione a conta AWS alvo da solicitacao. O ambiente ja esta implicito na conta selecionada.
  Exemplo: 123456789012 (prd-payment-gateway) - Ambiente: PRD
  Documentacao AWS: [AWS Organizations - Criar conta](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_create.html)

- **Nome da Policy (Taxonomia)**
  Tooltip: Informe somente a parte variavel da policy; prefixo/sufixo seguem padrao corporativo.
  Exemplo: AWS_PL_BLOCK_TRAIL_DELETE_PRD
  Documentacao AWS: [IAM Policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)

- **Actions Necessarias**
  Tooltip: No create de policy managed, informe as actions IAM necessarias para o caso de uso.
  Exemplo: s3:GetObject, s3:PutObject, s3:ListBucket
  Documentacao AWS: [IAM Policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html), [JSON policy elements](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html)

- **Resources**
  Tooltip: No create, informe o nome exato do recurso AWS (nao descricao em texto livre). ARN tambem e aceito.
  Exemplo: bucket-logs-aplicacao-prd (nome exato) ou arn:aws:s3:::bucket-logs-aplicacao-prd/*
  Documentacao AWS: [IAM Policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html), [JSON policy elements](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html)

- **Justificativa**
  Tooltip: Justifique necessidade, risco mitigado e resultado esperado da solicitacao.
  Exemplo: Ajuste necessario para atender auditoria e principio de menor privilegio.
  Documentacao AWS: Nao aplicavel

### 8.2 Tooltips dos campos opcionais
- **Conditions (opcional)**
  Tooltip: Opcional no create: informe conditions para restringir ainda mais a policy.
  Exemplo: StringEquals aws:SourceVpce=vpce-0123456789abcdef0
  Documentacao AWS: [IAM Policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html), [JSON policy elements](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html)

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
