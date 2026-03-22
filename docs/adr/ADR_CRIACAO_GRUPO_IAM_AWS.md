# ADR_CRIACAO_GRUPO_IAM_AWS

- Status: Proposto
- Data: 2026-03-18
- Tipo de solicitacao: iam-group-create
- Categoria: Grupos IAM AWS
- Acao registrada: Criacao de grupo IAM

## 1. Contexto da Tela
Categoria com criticidade **Alta**, SLA **24 horas uteis** e tipo **standard**.
Criacao, alteracao e remocao de grupos IAM para organizacao de permissoes.
Quando usar: Quando for necessario estruturar permissao compartilhada para usuarios IAM.
Foco deste ADR: somente a tela de **Criacao de grupo IAM**.

## 2. Decisoes Arquiteturais (itens detalhados)
### 2.1 Fluxo em tela unica
**Explicacao**: Preenchimento em tela unica reduz friccao; revisao final e obrigatoria antes do envio.
**Exemplo**: Solicitante revisa categoria, acao, escopo e justificativa antes de confirmar.

### 2.2 Categoria e acao implicitas pela navegacao
**Explicacao**: A rota do catalogo define automaticamente o contexto da solicitacao.
**Exemplo**: Esta solicitacao ja nasce no contexto de "Criacao de grupo IAM".

### 2.3 Coleta minima de dados
**Explicacao**: Somente campos que impactam execucao, risco e auditoria permanecem obrigatorios.
**Exemplo**: Campos variam por categoria; no levantamento AWS ha titulo da solicitacao para orientar a consulta.

### 2.4 Escopo e validacao operacional
**Explicacao**: A categoria define regras de escopo para evitar erro de execucao.
**Exemplo**: Criacao pode ocorrer sem permissao inicial ou com attach de policies existentes.

### 2.5 Padroes e taxonomia
**Explicacao**: Naming e padroes operacionais sao obrigatorios para consistencia e automacao.
**Exemplo**: Grupo IAM: AWS_GR_{NOME_DO_GRUPO}_{PRD|HML|DEV}

### 2.6 Requisitos e aprovacoes formais
**Explicacao**: Prerequisitos, validacoes e cadeia de aprovacao sustentam governanca e compliance.
**Exemplo**: Aprovadores: Gestor solicitante, Seguranca Cloud, IAM Admin.

### 2.7 Evidencia tecnica
**Explicacao**: A categoria aceita anexo opcional de JSON tecnico para apoiar execucao e auditoria.
**Exemplo**: Exemplo: trust-policy.json e permission-policy.json.

### 2.8 Regra especifica da acao
**Explicacao**: Nome do grupo deve seguir padrao AWS_GR_{NOME_DO_GRUPO}_{PRD|HML|DEV}. Permissoes iniciais podem ser: sem permissao ou attach de policies existentes.
**Exemplo**: AWS_GR_BACKUP_OPERATORS_HML + Criar sem permissoes iniciais

## 3. Campos da Tela (Criacao de grupo IAM)
**Objetivo da tela**: Criar grupo com permissao inicial opcional.
### 3.1 Campos obrigatorios
- Conta AWS
- Nome do Grupo IAM (Taxonomia)
- Permissoes Iniciais do Grupo IAM
- Justificativa

### 3.2 Campos opcionais
- Policies Existentes para Attach (quando aplicavel)
- Comentarios
- Upload de Anexos (opcional)

## 4. Detalhamento dos Campos da Tela
### 4.1 Campos obrigatorios com explicacao
- **Conta AWS**: Conta AWS alvo da execucao; ambiente e implicito na conta selecionada.
- **Nome do Grupo IAM (Taxonomia)**: Campo de nomenclatura padronizada para reduzir ambiguidade.
- **Permissoes Iniciais do Grupo IAM**: Campo tecnico/operacional necessario para execucao segura.
- **Justificativa**: Motivacao formal para aprovacao e auditoria.

### 4.2 Campos opcionais com explicacao
- **Policies Existentes para Attach (quando aplicavel)**: Campo tecnico/operacional necessario para execucao segura.
- **Comentarios**: Campo opcional para contexto adicional e orientacoes de execucao.
- **Upload de Anexos (opcional)**: Upload opcional unico para evidencias da justificativa e artefatos tecnicos.

## 5. Requisitos Aplicaveis a Esta Tela
### 5.1 Prerequisitos
- Conta AWS ativa
- Escopo de permissoes definido
- Matriz de acesso atualizada

### 5.2 Documentos e evidencias
- Matriz de acesso
- Lista de policies
- Plano de migracao de membros

### 5.3 Validacoes obrigatorias
- Sem wildcard critico sem justificativa
- Sem membros privilegiados indevidos
- Grupo substituto quando aplicavel

### 5.4 Cadeia de aprovacao
- Gestor solicitante
- Seguranca Cloud
- IAM Admin

## 6. Padroes Aplicaveis a Esta Tela
### 6.1 Taxonomia e nomenclatura
- Grupo IAM: AWS_GR_{NOME_DO_GRUPO}_{PRD|HML|DEV}

### 6.2 Padroes operacionais
- Tela unica com revisao final

### 6.3 Regras especificas desta acao
- Nome do grupo deve seguir padrao AWS_GR_{NOME_DO_GRUPO}_{PRD|HML|DEV}.
- Permissoes iniciais podem ser: sem permissao ou attach de policies existentes.

## 7. Exemplos da Tela
- AWS_GR_BACKUP_OPERATORS_HML + Criar sem permissoes iniciais

## 8. Tooltips da Tela
### 8.1 Tooltips dos campos obrigatorios
- **Conta AWS**
  Tooltip: Selecione a conta AWS alvo da solicitacao. O ambiente ja esta implicito na conta selecionada.
  Exemplo: 123456789012 (prd-payment-gateway) - Ambiente: PRD
  Documentacao AWS: [AWS Organizations - Criar conta](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_create.html)

- **Nome do Grupo IAM (Taxonomia)**
  Tooltip: Informe somente a parte variavel do grupo IAM seguindo padrao definido.
  Exemplo: AWS_GR_BACKUP_OPERATORS_HML
  Documentacao AWS: [IAM User groups](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html)

- **Permissoes Iniciais do Grupo IAM**
  Tooltip: Defina se o grupo sera criado sem permissao inicial ou com attach de policies existentes.
  Exemplo: Realizar attach de policies existentes
  Documentacao AWS: [IAM User groups](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html), [IAM Policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)

- **Justificativa**
  Tooltip: Justifique necessidade, risco mitigado e resultado esperado da solicitacao.
  Exemplo: Ajuste necessario para atender auditoria e principio de menor privilegio.
  Documentacao AWS: Nao aplicavel

### 8.2 Tooltips dos campos opcionais
- **Policies Existentes para Attach (quando aplicavel)**
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
