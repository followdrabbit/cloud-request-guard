# BDSM - Criacao de role (`role-create`)

- Categoria: Role AWS
- Fonte funcional: [ADR_CRIACAO_ROLE_AWS.md](../adr/ADR_CRIACAO_ROLE_AWS.md)

## 1. Objetivo do processo
Definir o fluxo proposto de execucao do chamado `role-create` com controles de qualidade, governanca, seguranca e rastreabilidade.

## 2. Entradas do processo
### 2.1 Prerequisitos
- Conta AWS ativa
- Role alvo ou nome padronizado definido conforme acao

### 2.2 Campos obrigatorios da tela
- Conta AWS
- Nome da Role
- Trusted Entity
- Principal(is) Confiavel(is)
- Permissoes Iniciais da Role
- Justificativa

### 2.3 Campos opcionais da tela
- Policies Existentes para Attach (quando modo attach-existing)
- Comentarios
- Upload de Anexos (opcional)

### 2.4 Documentos/evidencias esperadas
- Justificativa de menor privilegio
- Evidencias tecnicas da alteracao/remocao quando aplicavel

## 3. BDSM do processo proposto
```mermaid
flowchart TD
  A[Solicitante abre chamado] --> B[Validacao automatica de campos e regras basicas]
  B --> C{Campos validos?}
  C -- Nao --> C1[Retornar para ajuste do solicitante] --> B
  C -- Sim --> D[Triagem SI/IAM e classificacao de risco/impacto]
  D --> E{Aprovacoes obrigatorias obtidas?}
  E -- Nao --> E1[Encerrar como rejeitado ou pendente] --> Z[Fim]
  E -- Sim --> F[Planejar execucao: impacto, janela, risco, rollback]
  F --> G[Executar criacao conforme padrao, menor privilegio e rastreabilidade]
  G --> H[Validar resultado tecnico e controles de seguranca]
  H --> I[Anexar evidencias e atualizar historico do chamado]
  I --> J[Comunicacao final ao solicitante]
  J --> K[Encerrar chamado]
  K --> Z[Fim]
```

## 4. Gates de controle para execucao
| Gate | Verificacao obrigatoria | Referencia da tela |
| --- | --- | --- |
| Gate 1 - Intake | Campos obrigatorios preenchidos | Conta AWS; Nome da Role; Trusted Entity; Principal(is) Confiavel(is); Permissoes Iniciais da Role; Justificativa |
| Gate 2 - Qualidade | Validacoes obrigatorias satisfeitas | Escopo por conta AWS obrigatorio; Nome padronizado obrigatorio no create; Role alvo obrigatoria no update/delete; Acoes de alteracao obrigatorias no role-update; Policy JSON valido quando anexado |
| Gate 3 - Governanca | Aprovacoes registradas | Gestor solicitante; Seguranca Cloud; IAM Admin |
| Gate 4 - Execucao | Executar criacao conforme padrao, menor privilegio e rastreabilidade | Revisao deve exibir nome final da role, ambiente e policies vinculadas. |
| Gate 5 - Encerramento | Evidencias anexadas e comunicacao de conclusao | Historico do chamado atualizado + anexos + resultado final |

## 5. Boas praticas aplicaveis
- Executar validacao de completude e consistencia antes de iniciar qualquer acao tecnica.
- Aplicar principio do menor privilegio e segregacao de funcao durante aprovacao e execucao.
- Registrar evidencias tecnicas no chamado (logs, IDs, prints, diffs ou anexos).
- Atualizar status do chamado por etapa para manter rastreabilidade operacional.
- Planejar rollback e janela de mudanca quando houver risco de impacto em producao.
- Realizar validacao funcional/tecnica apos execucao antes de encerrar o chamado.

## 6. Regras especificas da tela
- Revisao deve exibir nome final da role, ambiente e policies vinculadas.

## 7. Criterios de conclusao
- Todas as validacoes obrigatorias atendidas.
- Aprovacoes registradas conforme cadeia da categoria.
- Execucao tecnica concluida sem pendencias abertas.
- Evidencias anexadas e comunicacao final registrada no chamado.
