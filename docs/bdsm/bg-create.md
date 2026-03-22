# BDSM - Concessao de acesso emergencial (`bg-create`)

- Categoria: Breaking Glass AWS
- Fonte funcional: [ADR_CONCESSAO_BREAKING_GLASS_AWS.md](../adr/ADR_CONCESSAO_BREAKING_GLASS_AWS.md)

## 1. Objetivo do processo
Definir o fluxo proposto de execucao do chamado `bg-create` com controles de qualidade, governanca, seguranca e rastreabilidade.

## 2. Entradas do processo
### 2.1 Prerequisitos
- Incidente registrado e ativo
- Justificativa emergencial
- Aprovacao de seguranca

### 2.2 Campos obrigatorios da tela
- Conta AWS
- Incidente Relacionado
- Tipo de Acesso
- Identidade que Recebera Acesso
- Duracao Maxima
- Justificativa Emergencial

### 2.3 Campos opcionais da tela
- Comentarios
- Upload de Anexos (opcional)

### 2.4 Documentos/evidencias esperadas
- Evidencia do incidente
- Plano de acao
- Justificativa emergencial

## 3. BDSM do processo proposto
```mermaid
flowchart TD
  A[Solicitante abre chamado] --> B[Validacao automatica de campos e regras basicas]
  B --> C{Campos validos?}
  C -- Nao --> C1[Retornar para ajuste do solicitante] --> B
  C -- Sim --> D[Priorizacao emergencial e designacao do executor]
  D --> E{Aprovacoes obrigatorias obtidas?}
  E -- Nao --> E1[Encerrar como rejeitado ou pendente] --> Z[Fim]
  E -- Sim --> F[Planejar execucao: impacto, janela, risco, rollback]
  F --> G[Conceder acesso emergencial com janela e escopo minimo]
  G --> H[Validar retorno ao baseline e registrar pos-uso]
  H --> I[Anexar evidencias e atualizar historico do chamado]
  I --> J[Comunicacao final ao solicitante]
  J --> K[Encerrar chamado]
  K --> Z[Fim]
```

## 4. Gates de controle para execucao
| Gate | Verificacao obrigatoria | Referencia da tela |
| --- | --- | --- |
| Gate 1 - Intake | Campos obrigatorios preenchidos | Conta AWS; Incidente Relacionado; Tipo de Acesso; Identidade que Recebera Acesso; Duracao Maxima; Justificativa Emergencial |
| Gate 2 - Qualidade | Validacoes obrigatorias satisfeitas | Incidente obrigatorio; Justificativa obrigatoria; Conta AWS obrigatoria; Duracao maxima obrigatoria; Revisao pos-uso obrigatoria |
| Gate 3 - Governanca | Aprovacoes registradas | Gestor solicitante; Seguranca Cloud; Incident Response; CISO |
| Gate 4 - Execucao | Conceder acesso emergencial com janela e escopo minimo | Somente para incidente ativo com aprovacao reforcada. |
| Gate 5 - Encerramento | Evidencias anexadas e comunicacao de conclusao | Historico do chamado atualizado + anexos + resultado final |

## 5. Boas praticas aplicaveis
- Executar validacao de completude e consistencia antes de iniciar qualquer acao tecnica.
- Aplicar principio do menor privilegio e segregacao de funcao durante aprovacao e execucao.
- Registrar evidencias tecnicas no chamado (logs, IDs, prints, diffs ou anexos).
- Atualizar status do chamado por etapa para manter rastreabilidade operacional.
- Planejar rollback e janela de mudanca quando houver risco de impacto em producao.
- Realizar validacao funcional/tecnica apos execucao antes de encerrar o chamado.
- Definir timebox, escopo minimo e monitoramento continuo durante todo o periodo emergencial.
- Executar revisao pos-uso obrigatoria com evidencias de revogacao e normalizacao.

## 6. Regras especificas da tela
- Somente para incidente ativo com aprovacao reforcada.

## 7. Criterios de conclusao
- Todas as validacoes obrigatorias atendidas.
- Aprovacoes registradas conforme cadeia da categoria.
- Execucao tecnica concluida sem pendencias abertas.
- Evidencias anexadas e comunicacao final registrada no chamado.
