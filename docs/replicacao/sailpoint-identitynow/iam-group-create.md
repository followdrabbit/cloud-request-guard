# SailPoint IdentityNow - Criacao de grupo IAM (`iam-group-create`)

- Categoria de origem: Grupos IAM AWS
- Fonte funcional: [ADR_CRIACAO_GRUPO_IAM_AWS.md](../../adr/ADR_CRIACAO_GRUPO_IAM_AWS.md)

## 1. Campos obrigatorios (dados de entrada do workflow)
- Conta AWS
- Nome do Grupo IAM (Taxonomia)
- Permissoes Iniciais do Grupo IAM
- Justificativa

## 2. Campos opcionais (dados de entrada do workflow)
- Policies Existentes para Attach (quando aplicavel)
- Comentarios
- Upload de Anexos (opcional)

## 3. Validacoes minimas esperadas
- Sem wildcard critico sem justificativa
- Sem membros privilegiados indevidos
- Grupo substituto quando aplicavel

## 4. Aprovacao
- Gestor solicitante
- Seguranca Cloud
- IAM Admin

## 5. Regras da tela (quando houver)
- Nome do grupo deve seguir padrao AWS_GR_{NOME_DO_GRUPO}_{PRD|HML|DEV}.
- Permissoes iniciais podem ser: sem permissao ou attach de policies existentes.

## 6. Mapeamento de payload (campo -> chave tecnica)
- `conta_aws`: Conta AWS
- `nome_do_grupo_iam_taxonomia`: Nome do Grupo IAM (Taxonomia)
- `permissoes_iniciais_do_grupo_iam`: Permissoes Iniciais do Grupo IAM
- `justificativa`: Justificativa
- `policies_existentes_para_attach_quando_aplicavel`: Policies Existentes para Attach (quando aplicavel)
- `comentarios`: Comentarios
- `upload_de_anexos_opcional`: Upload de Anexos (opcional)

## 7. Itens nao 1:1 e adaptacao
| Item | Status em IdentityNow (nativo) | Justificativa | Adaptacao recomendada |
| --- | --- | --- | --- |
| Formulario livre por tela de chamado | Nao possivel 1:1 | IdentityNow e focado em governanca de identidade e nao em catalogo ITSM completo por formulario custom por processo. | Manter intake no ServiceAIDE e enviar payload para workflow no IdentityNow via API/webhook. |
| Campos obrigatorios/opcionais | Parcial | Campos podem ser representados em variaveis de workflow, mas a UX de formulario completo varia por recurso usado. | Capturar campos no sistema de intake e repassar para workflow IdentityNow como input estruturado. |
| Aprovacao multipapel custom por tela | Parcial | IdentityNow suporta etapas de aprovacao, mas o modelo nativo nao replica todo fluxo de ticket ITSM sozinho. | Implementar aprovacao no workflow IdentityNow ou manter aprovacao primaria no ServiceAIDE. |
| Listas dinamicas com limite (adicionar/remover itens) | Nao aplicavel | Esta tela nao exige lista dinamica no modelo atual. | Nao aplicavel. |
| Upload de anexos do chamado | Nao possivel 1:1 | Anexo de ticket nao e o foco do request nativo do IdentityNow. | Armazenar anexo no ServiceAIDE/ECM e enviar apenas URL/ID de referencia ao workflow. |

## 8. Padrao recomendado de implementacao
1. Receber o formulario no ServiceAIDE.
2. Publicar payload estruturado para um workflow no IdentityNow.
3. Executar validacoes de negocio e aprovacao no workflow.
4. Acionar conectores/provisionamento IdentityNow quando aplicavel.
5. Devolver status de execucao para o ticket de origem.
