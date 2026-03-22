# ADR_ABERTURA_AUDITORIA_AWS

- Status: Proposto
- Data: 2026-03-18
- Tipo de solicitacao: audit-create
- Categoria: Auditoria AWS
- Acao registrada: Abertura de auditoria

## 1. Contexto da Tela
Categoria com criticidade **Alta**, SLA **5-7 dias uteis** e tipo **audit**.
Abertura, alteracao e encerramento de auditorias de seguranca em ambientes AWS.
Quando usar: Para levantamentos e revisoes de conformidade em contas e recursos AWS.
Foco deste ADR: somente a tela de **Abertura de auditoria**.

## 2. Decisoes Arquiteturais (itens detalhados)
### 2.1 Fluxo em tela unica
**Explicacao**: Preenchimento em tela unica reduz friccao; revisao final e obrigatoria antes do envio.
**Exemplo**: Solicitante revisa categoria, acao, escopo e justificativa antes de confirmar.

### 2.2 Categoria e acao implicitas pela navegacao
**Explicacao**: A rota do catalogo define automaticamente o contexto da solicitacao.
**Exemplo**: Esta solicitacao ja nasce no contexto de "Abertura de auditoria".

### 2.3 Coleta minima de dados
**Explicacao**: Somente campos que impactam execucao, risco e auditoria permanecem obrigatorios.
**Exemplo**: Campos variam por categoria; no levantamento AWS ha titulo da solicitacao para orientar a consulta.

### 2.4 Escopo e validacao operacional
**Explicacao**: A categoria define regras de escopo para evitar erro de execucao.
**Exemplo**: Abertura define escopo e periodo.

### 2.5 Padroes e taxonomia
**Explicacao**: Naming e padroes operacionais sao obrigatorios para consistencia e automacao.
**Exemplo**: Nao ha naming de recurso novo nessa categoria.

### 2.6 Requisitos e aprovacoes formais
**Explicacao**: Prerequisitos, validacoes e cadeia de aprovacao sustentam governanca e compliance.
**Exemplo**: Aprovadores: Gestor solicitante, Cloud Audit Specialist, Seguranca Cloud.

### 2.7 Evidencia tecnica
**Explicacao**: A categoria nao usa anexo JSON no fluxo padrao.
**Exemplo**: Evidencia registrada no proprio formulario.

### 2.8 Regra especifica da acao
**Explicacao**: Definir escopo inicial claro para reduzir retrabalho.
**Exemplo**: Escopo: Permissoes IAM | Periodo: Ultimos 90 dias

## 3. Campos da Tela (Abertura de auditoria)
**Objetivo da tela**: Abrir auditoria com escopo e periodo de referencia.
### 3.1 Campos obrigatorios
- Conta AWS
- Escopo da Auditoria
- Periodo de Referencia
- Justificativa

### 3.2 Campos opcionais
- Comentarios
- Upload de Anexos (opcional)

## 4. Detalhamento dos Campos da Tela
### 4.1 Campos obrigatorios com explicacao
- **Conta AWS**: Conta AWS alvo da execucao; ambiente e implicito na conta selecionada.
- **Escopo da Auditoria**: Campo tecnico/operacional necessario para execucao segura.
- **Periodo de Referencia**: Campo tecnico/operacional necessario para execucao segura.
- **Justificativa**: Motivacao formal para aprovacao e auditoria.

### 4.2 Campos opcionais com explicacao
- **Comentarios**: Campo opcional para contexto adicional e orientacoes de execucao.
- **Upload de Anexos (opcional)**: Upload opcional unico para evidencias da justificativa e artefatos tecnicos.

## 5. Requisitos Aplicaveis a Esta Tela
### 5.1 Prerequisitos
- Conta(s) AWS alvo definidas
- Escopo de analise claro

### 5.2 Documentos e evidencias
- Escopo da auditoria
- Justificativa e base regulatoria

### 5.3 Validacoes obrigatorias
- Escopo obrigatorio
- Justificativa obrigatoria
- Conta AWS obrigatoria

### 5.4 Cadeia de aprovacao
- Gestor solicitante
- Cloud Audit Specialist
- Seguranca Cloud

## 6. Padroes Aplicaveis a Esta Tela
### 6.1 Taxonomia e nomenclatura
- Nao ha naming de recurso novo nessa categoria.

### 6.2 Padroes operacionais
- Fluxo de auditoria orientado a escopo, periodo e parecer final.

### 6.3 Regras especificas desta acao
- Definir escopo inicial claro para reduzir retrabalho.

## 7. Exemplos da Tela
- Escopo: Permissoes IAM | Periodo: Ultimos 90 dias

## 8. Tooltips da Tela
### 8.1 Tooltips dos campos obrigatorios
- **Conta AWS**
  Tooltip: Selecione a conta AWS alvo da solicitacao. O ambiente ja esta implicito na conta selecionada.
  Exemplo: 123456789012 (prd-payment-gateway) - Ambiente: PRD
  Documentacao AWS: [AWS Organizations - Criar conta](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_create.html)

- **Escopo da Auditoria**
  Tooltip: Defina exatamente o escopo tecnico/funcional que sera auditado.
  Exemplo: Permissoes IAM
  Documentacao AWS: Nao aplicavel

- **Periodo de Referencia**
  Tooltip: Defina a janela temporal para consultas de uso, historico ou mudancas.
  Exemplo: Ultimos 90 dias
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
