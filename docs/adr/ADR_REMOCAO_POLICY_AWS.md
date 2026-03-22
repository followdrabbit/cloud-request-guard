# ADR_REMOCAO_POLICY_AWS

- Status: Proposto
- Data: 2026-03-18
- Tipo de solicitacao: policy-delete
- Categoria: Policy AWS
- Acao registrada: Remocao de policy

## 1. Contexto da Tela
Categoria com criticidade **Alta**, SLA **48 horas uteis** e tipo **standard**.
Criacao, alteracao e remocao de IAM Managed Policies.
Quando usar: Quando for necessario controlar permissao com rastreabilidade e aprovacao formal.
Foco deste ADR: somente a tela de **Remocao de policy**.

## 2. Decisoes Arquiteturais (itens detalhados)
### 2.1 Fluxo em tela unica
**Explicacao**: Preenchimento em tela unica reduz friccao; revisao final e obrigatoria antes do envio.
**Exemplo**: Solicitante revisa categoria, acao, escopo e justificativa antes de confirmar.

### 2.2 Categoria e acao implicitas pela navegacao
**Explicacao**: A rota do catalogo define automaticamente o contexto da solicitacao.
**Exemplo**: Esta solicitacao ja nasce no contexto de "Remocao de policy".

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
**Explicacao**: Fluxo cobre somente IAM Managed Policy (tipo implicito, sem selecao). Atualizar entidades dependentes antes da exclusao.
**Exemplo**: Desanexar de roles e aplicar policy substituta

## 3. Campos da Tela (Remocao de policy)
**Objetivo da tela**: Remover IAM Managed Policy com plano de remocao/reversao.
### 3.1 Campos obrigatorios
- Conta AWS
- Policy Alvo (nome/ARN)
- Plano de Remocao e Reversao
- Justificativa

### 3.2 Campos opcionais
- Comentarios
- Upload de Anexos (opcional)

## 4. Detalhamento dos Campos da Tela
### 4.1 Campos obrigatorios com explicacao
- **Conta AWS**: Conta AWS alvo da execucao; ambiente e implicito na conta selecionada.
- **Policy Alvo (nome/ARN)**: Identificador livre do recurso existente (nome legado ou ARN), sem exigir taxonomia nova.
- **Plano de Remocao e Reversao**: Plano de execucao controlada e, quando aplicavel, reversao.
- **Justificativa**: Motivacao formal para aprovacao e auditoria.

### 4.2 Campos opcionais com explicacao
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
- Fluxo cobre somente IAM Managed Policy (tipo implicito, sem selecao).
- Atualizar entidades dependentes antes da exclusao.

## 7. Exemplos da Tela
- Desanexar de roles e aplicar policy substituta

## 8. Tooltips da Tela
### 8.1 Tooltips dos campos obrigatorios
- **Conta AWS**
  Tooltip: Selecione a conta AWS alvo da solicitacao. O ambiente ja esta implicito na conta selecionada.
  Exemplo: 123456789012 (prd-payment-gateway) - Ambiente: PRD
  Documentacao AWS: [AWS Organizations - Criar conta](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_create.html)

- **Policy Alvo (nome/ARN)**
  Tooltip: Informe nome ou ARN de IAM Managed Policy existente para alteracao/remocao.
  Exemplo: arn:aws:iam::123456789012:policy/minha-policy
  Documentacao AWS: [IAM Policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)

- **Plano de Remocao e Reversao**
  Tooltip: Descreva plano passo a passo de execucao e reversao quando aplicavel.
  Exemplo: Revogar acesso atual, aplicar substituto e validar sem impacto.
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
