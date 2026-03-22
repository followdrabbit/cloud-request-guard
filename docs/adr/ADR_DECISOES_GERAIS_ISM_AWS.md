# ADR_DECISOES_GERAIS_ISM_AWS

- Status: Proposto
- Data: 2026-03-18
- Escopo: Sistema ISM para solicitacoes de atividades AWS por SI

## 1. Contexto
Consolida decisoes transversais de UX, governanca e seguranca do catalogo AWS.

## 2. Itens de Decisao com Secao Propria
### 2.1 Fluxo em tela unica com revisao final
**Explicacao**: Formularios em tela unica reduzem retrabalho.
**Exemplo**: Revisar escopo e justificativa antes de enviar.
### 2.2 Categoria/acao implicitas por rota
**Explicacao**: Navegacao no catalogo define o contexto da solicitacao.
**Exemplo**: /catalog/aws-roles/new/role-create.
### 2.3 Coleta minima de dados
**Explicacao**: Apenas campos essenciais ficam no formulario.
**Exemplo**: Campos variam por categoria; no levantamento AWS existe titulo da solicitacao para orientar a analise.
### 2.4 Taxonomia padronizada
**Explicacao**: Naming padrao sustenta rastreabilidade e automacao.
**Exemplo**: AWS_RL_LAMBDA_INTEGRATION_PRD.
### 2.5 Governanca IAM e excecoes
**Explicacao**: Fluxo padrao privilegia menor privilegio e identidade corporativa.
**Exemplo**: Usuario IAM pessoal local somente por fluxo de excecao.
### 2.6 Escopo especial para Role AWS
**Explicacao**: Role opera com escopo unitario por chamado: 1 conta AWS (ambiente implicito) e 1 role por solicitacao.
**Exemplo**: Criar AWS_RL_APP_READONLY_PRD na conta prd-payment-gateway.
### 2.7 Evidencia tecnica e anexos
**Explicacao**: Categorias tecnicas permitem upload opcional de JSON.
**Exemplo**: Anexar trust policy em role.
### 2.8 Evidencia visual obrigatoria
**Explicacao**: Mudanca em categoria/tela exige update de screenshots.
**Exemplo**: npm run screenshots:update no mesmo PR.

## 3. Mapa de Categorias
- **Contas AWS**: criticidade Critica, SLA 5 dias uteis, tipo standard
- **Levantamento de Informacoes AWS**: criticidade Alta, SLA 24 horas uteis, tipo standard
- **Acessos Corporativos (AD + Identity Center)**: criticidade Alta, SLA 72 horas uteis, tipo standard
- **Usuarios IAM AWS**: criticidade Alta, SLA 24 horas uteis, tipo standard
- **Grupos IAM AWS**: criticidade Alta, SLA 24 horas uteis, tipo standard
- **PSET AWS**: criticidade Alta, SLA 48 horas uteis, tipo standard
- **Role AWS**: criticidade Alta, SLA 48 horas uteis, tipo standard
- **Policy AWS**: criticidade Alta, SLA 48 horas uteis, tipo standard
- **Auditoria AWS**: criticidade Alta, SLA 5-7 dias uteis, tipo audit
- **Breaking Glass AWS**: criticidade Critica, SLA 30 min - 1 hora, tipo breaking-glass

## 4. Taxonomias Consolidadas
- Contas AWS: Conta AWS: AWS_AC_{NOME_DA_CONTA}_{PRD|HML|DEV}
- Levantamento de Informacoes AWS: Nao ha taxonomia obrigatoria de nome para este fluxo.
- Acessos Corporativos (AD + Identity Center): Perfil: prf-{ambiente}-{nome}
- Acessos Corporativos (AD + Identity Center): Grupo de acesso: AWS_GR_{NOME_DO_PERFIL}_{PRD|HML|DEV}
- Usuarios IAM AWS: Fluxo padrao: AWS_US_{NOME_DO_USUARIO}_{PRD|HML|DEV}
- Usuarios IAM AWS: US_PRS reservado para fluxo de excecao
- Grupos IAM AWS: Grupo IAM: AWS_GR_{NOME_DO_GRUPO}_{PRD|HML|DEV}
- PSET AWS: PSET: AWS_PS_{NOME_DO_PSET}_{PRD|HML|DEV}
- Role AWS: Role: AWS_RL_{NOME_DA_ROLE}_{PRD|HML|DEV}
- Policy AWS: Policy: AWS_PL_{NOME_DA_POLICY}_{PRD|HML|DEV}
- Auditoria AWS: Nao ha naming de recurso novo nessa categoria.
- Breaking Glass AWS: Nao ha naming de recurso novo nessa categoria.

## 5. Consequencias
- Padronizacao documental para todos os ADRs por solicitacao.
- Melhora de onboarding, QA e auditoria.
- Menor risco de interpretacao divergente entre times.
