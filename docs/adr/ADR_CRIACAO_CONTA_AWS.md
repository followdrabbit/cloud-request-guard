# ADR_CRIACAO_CONTA_AWS

- Status: Proposto
- Data: 2026-03-18
- Tipo de solicitacao: account-create
- Categoria: Contas AWS
- Acao registrada: Criacao de conta AWS

## 1. Contexto da Tela
Categoria com criticidade **Critica**, SLA **5 dias uteis** e tipo **standard**.
Criacao, alteracao e remocao de contas AWS na organizacao corporativa.
Quando usar: Quando um projeto precisar de isolamento em conta dedicada.
Foco deste ADR: somente a tela de **Criacao de conta AWS**.

## 2. Decisoes Arquiteturais (itens detalhados)
### 2.1 Fluxo em tela unica
**Explicacao**: Preenchimento em tela unica reduz friccao; revisao final e obrigatoria antes do envio.
**Exemplo**: Solicitante revisa categoria, acao, escopo e justificativa antes de confirmar.

### 2.2 Categoria e acao implicitas pela navegacao
**Explicacao**: A rota do catalogo define automaticamente o contexto da solicitacao.
**Exemplo**: Esta solicitacao ja nasce no contexto de "Criacao de conta AWS".

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
**Explicacao**: Nome segue AWS_AC_{NOME_DA_CONTA}_{PRD|HML|DEV}.
**Exemplo**: AWS_AC_PAYMENT_GATEWAY_PRD | Tipo: Aplicacao | Ambiente: PRD

## 3. Campos da Tela (Criacao de conta AWS)
**Objetivo da tela**: Criar nova conta com contexto completo de ownership, finalidade e governanca.
### 3.1 Campos obrigatorios
- Nome da conta AWS
- Descricao / finalidade da conta
- Tipo de conta
- Ambiente
- Responsavel de negocio
- E-mail do responsavel principal
- Responsavel tecnico
- Gestor aprovador
- Centro de custo
- Unidade de negocio
- Justificativa da criacao

### 3.2 Campos opcionais
- Comentarios
- Upload de Anexos (opcional)

## 4. Detalhamento dos Campos da Tela
### 4.1 Campos obrigatorios com explicacao
- **Nome da conta AWS**: Nome final da conta solicitado no padrao corporativo de nomenclatura.
- **Descricao / finalidade da conta**: Finalidade operacional da conta e escopo de workload esperado.
- **Tipo de conta**: Classificacao funcional da conta para aplicacao de guardrails e ownership.
- **Ambiente**: Ambiente operacional da conta (DEV/HML/PRD/Sandbox).
- **Responsavel de negocio**: Owner de negocio responsavel pelo resultado e prioridade da conta.
- **E-mail do responsavel principal**: Contato corporativo principal para comunicacao e governanca da conta.
- **Responsavel tecnico**: Owner tecnico da conta para operacao, suporte e tratativas de mudanca.
- **Gestor aprovador**: Gestor que aprova formalmente a criacao da conta.
- **Centro de custo**: Identificador financeiro para alocacao de despesas da conta.
- **Unidade de negocio**: Unidade organizacional responsavel pela conta.
- **Justificativa da criacao**: Motivacao formal da abertura da conta para aprovacao e auditoria.

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
- Nome segue AWS_AC_{NOME_DA_CONTA}_{PRD|HML|DEV}.

## 7. Exemplos da Tela
- AWS_AC_PAYMENT_GATEWAY_PRD | Tipo: Aplicacao | Ambiente: PRD

## 8. Tooltips da Tela
### 8.1 Tooltips dos campos obrigatorios
- **Nome da conta AWS**
  Tooltip: Informe o nome final da conta AWS seguindo padrao corporativo.
  Exemplo: AWS_AC_PAYMENT_GATEWAY_PRD
  Documentacao AWS: [AWS Organizations - Criar conta](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_create.html)

- **Descricao / finalidade da conta**
  Tooltip: Descreva o objetivo da conta, workload principal e limite de escopo esperado.
  Exemplo: Conta dedicada para workload transacional de pagamentos com isolamento de custos.
  Documentacao AWS: Nao aplicavel

- **Tipo de conta**
  Tooltip: Selecione o tipo de conta que melhor representa o uso principal.
  Exemplo: Aplicacao
  Documentacao AWS: Nao aplicavel

- **Ambiente**
  Tooltip: Informe o ambiente da conta a ser criada.
  Exemplo: PRD
  Documentacao AWS: [AWS Organizations - Criar conta](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_create.html)

- **Responsavel de negocio**
  Tooltip: Informe o owner de negocio responsavel pelo resultado e priorizacao da conta.
  Exemplo: Maria Souza
  Documentacao AWS: Nao aplicavel

- **E-mail do responsavel principal**
  Tooltip: Use e-mail corporativo do responsavel principal da conta.
  Exemplo: maria.souza@empresa.com
  Documentacao AWS: [AWS Organizations - Criar conta](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_create.html)

- **Responsavel tecnico**
  Tooltip: Informe o responsavel tecnico pela operacao da conta e suas configuracoes.
  Exemplo: Carlos Lima
  Documentacao AWS: Nao aplicavel

- **Gestor aprovador**
  Tooltip: Informe o gestor que aprova formalmente a criacao da conta.
  Exemplo: Ana Ribeiro
  Documentacao AWS: Nao aplicavel

- **Centro de custo**
  Tooltip: Informe o centro de custo para alocacao financeira e rastreabilidade de cobranca.
  Exemplo: CC-10457
  Documentacao AWS: Nao aplicavel

- **Unidade de negocio**
  Tooltip: Selecione a unidade de negocio responsavel pela conta/servico.
  Exemplo: Pagamentos
  Documentacao AWS: Nao aplicavel

- **Justificativa da criacao**
  Tooltip: Explique o racional da criacao da conta, risco mitigado e resultado esperado.
  Exemplo: Isolar workload critico de pagamentos e separar custos para controle de governanca.
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
