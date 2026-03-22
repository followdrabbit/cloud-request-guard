# Cloud Request Guard

Sistema web no modelo ISM/ITSM para solicitação de atividades AWS executadas por Segurança da Informação (SI).

## Objetivo

Centralizar e padronizar solicitações de governança e segurança cloud, com:

- catálogo de serviços por domínio técnico;
- validações e cadeia de aprovação;
- visão de chamados e SLA;
- trilha para demandas de auditoria e acesso emergencial (breaking glass).

## Catálogo de serviços

Categorias disponíveis no catálogo:

- Contas AWS
- Levantamento de Informações AWS
- Acessos Corporativos (AD + Identity Center)
- Usuários IAM AWS
- Grupos IAM AWS
- PSET AWS
- Role AWS
- Policy AWS
- Auditoria AWS
- Breaking Glass AWS

Cada categoria possui telas separadas por ação:

- Criação
- Alteração
- Remoção (ou Encerramento/Revogação, quando aplicável)

Cobertura IAM contemplada no catálogo:

- Usuários IAM AWS
- Grupos IAM AWS
- PSET AWS (Identity Center)
- Role AWS
- Policy AWS

## Fluxo funcional

O fluxo de abertura de solicitação é em tela única (single screen), com etapa final de revisão antes do envio definitivo.

## Pressupostos de uso

- os usuários do catálogo são profissionais de T.I.;
- os usuários devem conhecer minimamente as terminologias utilizadas nos formulários;
- os usuários devem ser capazes de consultar a documentação oficial da AWS quando necessário;
- cada tela de solicitação foi desenhada para reduzir erros de abertura de chamados;
- cada tela garante a coleta dos requisitos mínimos necessários para execução da tarefa.

Princípios do formulário:

- ação e categoria são definidas pelo catálogo (não exigem preenchimento manual);
- o solicitante informa apenas os campos essenciais para execução da atividade;
- campos automáticos não são exibidos quando não agregam decisão operacional.
- o solicitante pode selecionar múltiplas contas AWS para execução da atividade.
- em solicitações de Role AWS, o usuário seleciona o nome da conta/produto e os ambientes (DEV, HML e PRD) onde a role será criada.
- em solicitações de Role AWS, o escopo por chamado é limitado a 1 produto e até 3 contas (no máximo 1 por ambiente).
- na revisão da criação de Role AWS, o sistema exibe os nomes das roles por ambiente e as policies vinculadas (quando houver).
- nos fluxos de alteração e remoção, o alvo do recurso é informado em nome livre/ARN; a taxonomia padronizada é aplicada no fluxo de criação.
- em alteração e remoção de Role AWS, cada role alvo deve informar também o ambiente correspondente.
- solicitações técnicas aplicáveis (Role, Policy, PSET, IAM e correlatas) permitem anexo opcional de um ou mais arquivos JSON.
- em solicitações de Role, o campo de principal confiável aceita múltiplos valores vinculados ao tipo de Trusted Entity.
- em criação de Role, o solicitante pode escolher entre criar sem permission policy ou realizar attach de policies existentes.
- em criação, alteração e remoção de Policy AWS, o tipo é implícito como IAM Managed Policy (sem campo de seleção nesta fase); demais tipos não estão cobertos no momento.
- em criação de Policy AWS, o solicitante informa Actions e Resources (obrigatórios) e Conditions (opcional); em Resources, deve informar o nome exato dos recursos ou ARN. O JSON final é montado pelo time executor.
- em criação de PSET, o solicitante pode informar uma ou mais policies para vínculo (lista dinâmica com múltiplos itens).
- em alteração de PSET, as ações disponíveis são: adicionar policy, remover policy, adicionar conta e remover conta.
- em criacao de Usuario IAM, o fluxo padrao permite apenas usuario de servico local.
- em criacao de Usuario IAM, o solicitante pode escolher criar sem permissao inicial, incluir em grupo IAM existente, realizar attach de policies existentes ou combinar grupo + policies.
- em Usuario IAM de servico, o acesso e sempre Programatico e o campo "Tipo de Acesso" nao e exibido no formulario.
- em alteracao de Usuario IAM, as acoes disponiveis sao: adicionar policy, remover policy, adicionar grupo, remover grupo e rotacionar key.
- na acao de rotacionar key em Usuario IAM, a key atual e desativada e, apos 7 dias sem solicitacao de reativacao, e excluida.
- em criacao de Grupo IAM, o solicitante pode escolher criar sem permissao inicial ou realizar attach de policies existentes.
- em alteracao de Grupo IAM, as acoes disponiveis sao: adicionar policy, remover policy, adicionar usuario e remover usuario.
- solicitacoes de usuario IAM pessoal local devem seguir fluxo de excecao com justificativa formal e aprovacao reforcada.

## Taxonomia de nomes (criação de recursos)

Os formulários de criação exibem prefixo/sufixo já preenchidos.  
O usuário informa somente a parte não padronizada do nome.

Regras de nomenclatura:

- Conta AWS: `AWS_AC_{NOME_DA_CONTA}_{PRD|HML|DEV}`
- Perfil corporativo: `prf-{ambiente}-{nome}`
- Grupo referente ao perfil de acesso (AD): `AWS_GR_{NOME_DO_PERFIL}_{PRD|HML|DEV}`
- Usuário IAM (serviço): `AWS_US_{NOME_DO_USUARIO}_{PRD|HML|DEV}`
- Usuario IAM (pessoal local): somente via fluxo de excecao (fora do fluxo padrao do catalogo)
- Grupo IAM: `AWS_GR_{NOME_DO_GRUPO}_{PRD|HML|DEV}`
- PSET: `AWS_PS_{NOME_DO_PSET}_{PRD|HML|DEV}`
- Role: `AWS_RL_{NOME_DA_ROLE}_{PRD|HML|DEV}`
- Policy: `AWS_PL_{NOME_DA_POLICY}_{PRD|HML|DEV}`

Prefixos de recurso após `AWS_`:

- `RL`: role
- `PL`: policy
- `GR`: group
- `PS`: pset
- `US`: user
- `US_PRS`: reservado para fluxo de excecao de usuario pessoal local

Convenções:

- `ambiente`: `prd`, `hml` ou `dev`
- `nome`: trecho livre informado pelo solicitante (parte não padronizada)

## Stack técnica

- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Framer Motion
- React Router
- Vitest

## Execução local

Pré-requisitos:

- Node.js 18+ (recomendado 20+)
- npm

Instalação e execução:

```bash
npm install
npm run dev
```

Aplicação disponível em:

`http://localhost:5173`

## Scripts

- `npm run dev`: inicia ambiente local
- `npm run build`: gera build de produção
- `npm run build:dev`: build em modo development
- `npm run preview`: publica build localmente
- `npm run lint`: valida código com ESLint
- `npm run test`: executa testes com Vitest
- `npm run test:watch`: testes em modo watch

## Estrutura do projeto

```text
src/
  components/     # Layout, navegação e componentes UI
  data/           # Base mock do catálogo e chamados
  pages/          # Dashboard, catálogo, abertura e detalhe de chamados
  hooks/          # Hooks utilitários
  test/           # Testes
```

Arquivo-chave de domínio:

- `src/data/mockData.ts`: categorias, tipos de solicitação, tickets, aprovações e dados auxiliares.

## Status atual

- Front-end funcional com dados mockados.
- Sem integração com backend persistente.
- Sem autenticação/autorização real (simulada em UI).

## Próximos passos recomendados

1. Integrar backend (API + banco) para persistência e auditoria real.
2. Implementar RBAC por perfil (Solicitante, Aprovador, SI, Auditor, Admin).
3. Integrar Identity Provider corporativo (SSO) e trilha de auditoria imutável.
4. Adicionar testes E2E para fluxos críticos (SCP, breaking glass, aprovação em produção).

## Documentacao visual de categorias

- Script de atualizacao: `npm run screenshots:update`.
- Saida versionada: `docs/screenshots/categories/**` e `docs/screenshots/categories/manifest.json`.
- Cada acao gera 3 imagens: formulario vazio (`-empty`), formulario preenchido (`-filled`) e tela de revisao (`-review`).
- Nas capturas preenchidas, sempre deve ser usada conta/produto com os 3 ambientes (`DEV`, `HML`, `PRD`).
- Regra: toda criacao, alteracao ou remocao de categoria, e toda mudanca em tela de solicitacao, exige nova execucao do script e commit dos screenshots atualizados no mesmo PR.
- Guia operacional: `docs/screenshots/README.md`.
