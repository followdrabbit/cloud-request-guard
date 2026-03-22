# ADR_CONCESSAO_BREAKING_GLASS_AWS

- Status: Proposto
- Data: 2026-03-18
- Tipo de solicitacao: bg-create
- Categoria: Breaking Glass AWS
- Acao registrada: Concessao de acesso emergencial

## 1. Contexto da Tela
Categoria com criticidade **Critica**, SLA **30 min - 1 hora** e tipo **breaking-glass**.
Concessao, alteracao e revogacao de acesso emergencial para incidentes criticos.
Quando usar: Quando houver incidente critico que exija atuacao imediata fora do fluxo padrao.
Foco deste ADR: somente a tela de **Concessao de acesso emergencial**.

## 2. Decisoes Arquiteturais (itens detalhados)
### 2.1 Fluxo em tela unica
**Explicacao**: Preenchimento em tela unica reduz friccao; revisao final e obrigatoria antes do envio.
**Exemplo**: Solicitante revisa categoria, acao, escopo e justificativa antes de confirmar.

### 2.2 Categoria e acao implicitas pela navegacao
**Explicacao**: A rota do catalogo define automaticamente o contexto da solicitacao.
**Exemplo**: Esta solicitacao ja nasce no contexto de "Concessao de acesso emergencial".

### 2.3 Coleta minima de dados
**Explicacao**: Somente campos que impactam execucao, risco e auditoria permanecem obrigatorios.
**Exemplo**: Campos variam por categoria; no levantamento AWS ha titulo da solicitacao para orientar a consulta.

### 2.4 Escopo e validacao operacional
**Explicacao**: A categoria define regras de escopo para evitar erro de execucao.
**Exemplo**: Concessao exige incidente ativo.

### 2.5 Padroes e taxonomia
**Explicacao**: Naming e padroes operacionais sao obrigatorios para consistencia e automacao.
**Exemplo**: Nao ha naming de recurso novo nessa categoria.

### 2.6 Requisitos e aprovacoes formais
**Explicacao**: Prerequisitos, validacoes e cadeia de aprovacao sustentam governanca e compliance.
**Exemplo**: Aprovadores: Gestor solicitante, Seguranca Cloud, Incident Response, CISO.

### 2.7 Evidencia tecnica
**Explicacao**: A categoria nao usa anexo JSON no fluxo padrao.
**Exemplo**: Evidencia registrada no proprio formulario.

### 2.8 Regra especifica da acao
**Explicacao**: Somente para incidente ativo com aprovacao reforcada.
**Exemplo**: INC-2026-0042 | Administrador restrito | 1 hora

## 3. Campos da Tela (Concessao de acesso emergencial)
**Objetivo da tela**: Conceder acesso temporario para resposta a incidente critico.
### 3.1 Campos obrigatorios
- Conta AWS
- Incidente Relacionado
- Tipo de Acesso
- Identidade que Recebera Acesso
- Duracao Maxima
- Justificativa Emergencial

### 3.2 Campos opcionais
- Comentarios
- Upload de Anexos (opcional)

## 4. Detalhamento dos Campos da Tela
### 4.1 Campos obrigatorios com explicacao
- **Conta AWS**: Conta AWS alvo da execucao; ambiente e implicito na conta selecionada.
- **Incidente Relacionado**: Campo tecnico/operacional necessario para execucao segura.
- **Tipo de Acesso**: Campo tecnico/operacional necessario para execucao segura.
- **Identidade que Recebera Acesso**: Campo tecnico/operacional necessario para execucao segura.
- **Duracao Maxima**: Campo tecnico/operacional necessario para execucao segura.
- **Justificativa Emergencial**: Motivacao formal para aprovacao e auditoria.

### 4.2 Campos opcionais com explicacao
- **Comentarios**: Campo opcional para contexto adicional e orientacoes de execucao.
- **Upload de Anexos (opcional)**: Upload opcional unico para evidencias da justificativa e artefatos tecnicos.

## 5. Requisitos Aplicaveis a Esta Tela
### 5.1 Prerequisitos
- Incidente registrado e ativo
- Justificativa emergencial
- Aprovacao de seguranca

### 5.2 Documentos e evidencias
- Evidencia do incidente
- Plano de acao
- Justificativa emergencial

### 5.3 Validacoes obrigatorias
- Incidente obrigatorio
- Justificativa obrigatoria
- Conta AWS obrigatoria
- Duracao maxima obrigatoria
- Revisao pos-uso obrigatoria

### 5.4 Cadeia de aprovacao
- Gestor solicitante
- Seguranca Cloud
- Incident Response
- CISO

## 6. Padroes Aplicaveis a Esta Tela
### 6.1 Taxonomia e nomenclatura
- Nao ha naming de recurso novo nessa categoria.

### 6.2 Padroes operacionais
- Processo excepcional com aprovacao reforcada
- Justificativa Emergencial obrigatoria

### 6.3 Regras especificas desta acao
- Somente para incidente ativo com aprovacao reforcada.

## 7. Exemplos da Tela
- INC-2026-0042 | Administrador restrito | 1 hora

## 8. Tooltips da Tela
### 8.1 Tooltips dos campos obrigatorios
- **Conta AWS**
  Tooltip: Selecione a conta AWS alvo da solicitacao. O ambiente ja esta implicito na conta selecionada.
  Exemplo: 123456789012 (prd-payment-gateway) - Ambiente: PRD
  Documentacao AWS: [AWS Organizations - Criar conta](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_create.html)

- **Incidente Relacionado**
  Tooltip: Informe o ID do incidente ativo que justifica o fluxo emergencial.
  Exemplo: INC-2026-0042
  Documentacao AWS: Nao aplicavel

- **Tipo de Acesso**
  Tooltip: Selecione o tipo de acesso permitido para o fluxo selecionado, mantendo menor privilegio.
  Exemplo: Administrador restrito (breaking glass) ou Programatico (usuario IAM de servico)
  Documentacao AWS: [IAM Users](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html), [IAM Roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)

- **Identidade que Recebera Acesso**
  Tooltip: Informe a identidade corporativa que recebera o acesso emergencial.
  Exemplo: analista@corp.com
  Documentacao AWS: Nao aplicavel

- **Duracao Maxima**
  Tooltip: Defina o menor tempo necessario para o acesso emergencial.
  Exemplo: 1 hora
  Documentacao AWS: Nao aplicavel

- **Justificativa Emergencial**
  Tooltip: Explique incidente, impacto e por que o fluxo emergencial e indispensavel.
  Exemplo: Incidente critico em producao com risco de indisponibilidade.
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
