# ADR_TAXONOMIA_NOMENCLATURA_AWS

- Status: Proposto
- Data: 2026-03-19
- Escopo: Taxonomia e nomenclatura de recursos para fluxos de criacao no ISM AWS
- Relacao: Complementa ADR_DECISOES_GERAIS_ISM_AWS e ADRs por tipo de solicitacao

## 1. Contexto
O projeto possui multiplos fluxos de criacao de recursos AWS (conta, perfil, usuario, grupo, pset, role e policy).
Para reduzir ambiguidade operacional e melhorar rastreabilidade, e necessario consolidar a taxonomia em um ADR dedicado.

## 2. Decisao
Padronizar a nomenclatura de recursos de criacao conforme os formatos abaixo.
Esta decisao vale para os fluxos de criacao; em alteracao/remocao, o alvo pode ser informado por nome livre ou ARN.

## 3. Taxonomias Consolidadas
### 3.1 Conta AWS
- Formato: `AWS_AC_{NOME_DA_CONTA}_{AMBIENTE}`
- Ambientes aceitos: `DEV`, `HML`, `PRD`, `SANDBOX`
- Exemplo: `AWS_AC_PAYMENT_GATEWAY_PRD`

### 3.2 Perfil Corporativo (AD + Identity Center)
- Formato: `prf-{ambiente}-{nome}`
- Ambientes aceitos: `dev`, `hml`, `prd`
- Exemplo: `prf-prd-sre-readonly`

### 3.3 Grupo do Perfil de Acesso / Grupo IAM
- Formato: `AWS_GR_{NOME_DO_GRUPO}_{PRD|HML|DEV}`
- Exemplo: `AWS_GR_SRE_READONLY_PRD`

### 3.4 Usuario IAM de Servico
- Formato: `AWS_US_{NOME_DO_USUARIO}_{PRD|HML|DEV}`
- Exemplo: `AWS_US_INTEGRACAO_ETL_HML`

### 3.5 PSET
- Formato: `AWS_PS_{NOME_DO_PSET}_{PRD|HML|DEV}`
- Exemplo: `AWS_PS_FINOPS_READONLY_PRD`

### 3.6 Role
- Formato: `AWS_RL_{NOME_DA_ROLE}_{PRD|HML|DEV}`
- Exemplo: `AWS_RL_APP_READONLY_PRD`

### 3.7 Policy
- Formato: `AWS_PL_{NOME_DA_POLICY}_{PRD|HML|DEV}`
- Exemplo: `AWS_PL_BLOCK_DELETE_CLOUDTRAIL_PRD`

## 4. Regras de Composicao
- Usar somente letras sem acento, numeros e `_` (underscore) nos segmentos em caixa alta.
- Evitar espacos, caracteres especiais e duplicidade de prefixos.
- A parte variavel (`NOME_*`) deve ser objetiva e alinhada ao dominio do recurso.
- O sufixo de ambiente deve refletir o ambiente operacional alvo.

## 5. Fora de Escopo desta Decisao
- O item `US_PRS` **nao faz parte** desta taxonomia consolidada.
- Fluxos de excecao para usuario pessoal local sao tratados por governanca especifica e nao por este ADR.

## 6. Consequencias
### 6.1 Positivas
- Maior consistencia na abertura e execucao de chamados.
- Melhor rastreabilidade para auditoria e operacao.
- Menor retrabalho por ambiguidades de nomenclatura.

### 6.2 Trade-offs
- Requer disciplina de preenchimento dos nomes nos fluxos de criacao.
- Pode exigir ajuste em registros legados fora do padrao.

## 7. Criterios de Conformidade
- Chamados de criacao devem respeitar o padrao da taxonomia correspondente.
- Desvios devem ser tratados como excecao formal com aprovacao de SI/IAM.

