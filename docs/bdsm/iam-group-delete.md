# BDSM - Remocao de grupo IAM (`iam-group-delete`)

- Categoria: Grupos IAM AWS
- Fonte funcional: [ADR_REMOCAO_GRUPO_IAM_AWS.md](../adr/ADR_REMOCAO_GRUPO_IAM_AWS.md)

## 1. Objetivo do processo
Definir o fluxo proposto de execucao do chamado `iam-group-delete` com controles de qualidade, governanca, seguranca e rastreabilidade.

## 2. Entradas do processo
### 2.1 Prerequisitos
- Conta AWS ativa
- Escopo de permissoes definido
- Matriz de acesso atualizada

### 2.2 Campos obrigatorios da tela
- Conta AWS
- Grupo IAM Alvo (nome/ARN)
- Plano de Migracao dos Membros
- Justificativa

### 2.3 Campos opcionais da tela
- Comentarios
- Upload de Anexos (opcional)

### 2.4 Documentos/evidencias esperadas
- Matriz de acesso
- Lista de policies
- Plano de migracao de membros

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
  F --> G[Executar remocao/revogacao controlada e validar dependencias]
  G --> H[Validar resultado tecnico e controles de seguranca]
  H --> I[Anexar evidencias e atualizar historico do chamado]
  I --> J[Comunicacao final ao solicitante]
  J --> K[Encerrar chamado]
  K --> Z[Fim]
```

## 4. Gates de controle para execucao
| Gate | Verificacao obrigatoria | Referencia da tela |
| --- | --- | --- |
| Gate 1 - Intake | Campos obrigatorios preenchidos | Conta AWS; Grupo IAM Alvo (nome/ARN); Plano de Migracao dos Membros; Justificativa |
| Gate 2 - Qualidade | Validacoes obrigatorias satisfeitas | Sem wildcard critico sem justificativa; Sem membros privilegiados indevidos; Grupo substituto quando aplicavel |
| Gate 3 - Governanca | Aprovacoes registradas | Gestor solicitante; Seguranca Cloud; IAM Admin |
| Gate 4 - Execucao | Executar remocao/revogacao controlada e validar dependencias | Plano de migracao deve cobrir como os membros serao realocados antes da remocao. |
| Gate 5 - Encerramento | Evidencias anexadas e comunicacao de conclusao | Historico do chamado atualizado + anexos + resultado final |

## 5. Boas praticas aplicaveis
- Executar validacao de completude e consistencia antes de iniciar qualquer acao tecnica.
- Aplicar principio do menor privilegio e segregacao de funcao durante aprovacao e execucao.
- Registrar evidencias tecnicas no chamado (logs, IDs, prints, diffs ou anexos).
- Atualizar status do chamado por etapa para manter rastreabilidade operacional.
- Confirmar dependencias e impacto antes da remocao/revogacao definitiva.
- Executar desativacao gradativa quando aplicavel para reduzir risco operacional.

## 6. Regras especificas da tela
- Plano de migracao deve cobrir como os membros serao realocados antes da remocao.

## 7. Criterios de conclusao
- Todas as validacoes obrigatorias atendidas.
- Aprovacoes registradas conforme cadeia da categoria.
- Execucao tecnica concluida sem pendencias abertas.
- Evidencias anexadas e comunicacao final registrada no chamado.
