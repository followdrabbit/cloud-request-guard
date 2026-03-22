# BDSM - Criacao de perfil corporativo (`profile-create`)

- Categoria: Acessos Corporativos (AD + Identity Center)
- Fonte funcional: [ADR_CRIACAO_PERFIL_ACESSO_AWS.md](../adr/ADR_CRIACAO_PERFIL_ACESSO_AWS.md)

## 1. Objetivo do processo
Definir o fluxo proposto de execucao do chamado `profile-create` com controles de qualidade, governanca, seguranca e rastreabilidade.

## 2. Entradas do processo
### 2.1 Prerequisitos
- PSET existente
- Grupo AD definido
- Conta(s) AWS definidas

### 2.2 Campos obrigatorios da tela
- Conta AWS
- Nome do Perfil Corporativo (Taxonomia)
- Grupo do Perfil de Acesso (Taxonomia)
- PSET Associado
- Justificativa

### 2.3 Campos opcionais da tela
- Comentarios
- Upload de Anexos (opcional)

### 2.4 Documentos/evidencias esperadas
- Justificativa de negocio
- Matriz de acesso

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
| Gate 1 - Intake | Campos obrigatorios preenchidos | Conta AWS; Nome do Perfil Corporativo (Taxonomia); Grupo do Perfil de Acesso (Taxonomia); PSET Associado; Justificativa |
| Gate 2 - Qualidade | Validacoes obrigatorias satisfeitas | Grupo AD obrigatorio; PSET vinculado obrigatorio; Ao menos uma conta AWS; Menor privilegio |
| Gate 3 - Governanca | Aprovacoes registradas | Gestor solicitante; Seguranca Cloud; IAM Admin |
| Gate 4 - Execucao | Executar criacao conforme padrao, menor privilegio e rastreabilidade | Grupo segue AWS_GR_{NOME_DO_PERFIL}_{PRD|HML|DEV}. |
| Gate 5 - Encerramento | Evidencias anexadas e comunicacao de conclusao | Historico do chamado atualizado + anexos + resultado final |

## 5. Boas praticas aplicaveis
- Executar validacao de completude e consistencia antes de iniciar qualquer acao tecnica.
- Aplicar principio do menor privilegio e segregacao de funcao durante aprovacao e execucao.
- Registrar evidencias tecnicas no chamado (logs, IDs, prints, diffs ou anexos).
- Atualizar status do chamado por etapa para manter rastreabilidade operacional.
- Planejar rollback e janela de mudanca quando houver risco de impacto em producao.
- Realizar validacao funcional/tecnica apos execucao antes de encerrar o chamado.

## 6. Regras especificas da tela
- Grupo segue AWS_GR_{NOME_DO_PERFIL}_{PRD|HML|DEV}.

## 7. Criterios de conclusao
- Todas as validacoes obrigatorias atendidas.
- Aprovacoes registradas conforme cadeia da categoria.
- Execucao tecnica concluida sem pendencias abertas.
- Evidencias anexadas e comunicacao final registrada no chamado.
