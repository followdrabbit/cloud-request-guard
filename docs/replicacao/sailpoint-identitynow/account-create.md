# SailPoint IdentityNow - Criacao de conta AWS (`account-create`)

- Categoria de origem: Contas AWS
- Fonte funcional: [ADR_CRIACAO_CONTA_AWS.md](../../adr/ADR_CRIACAO_CONTA_AWS.md)

## 1. Campos obrigatorios (dados de entrada do workflow)
- Nome da conta AWS
- Descricao / finalidade da conta
- Tipo de conta
- Ambiente
- Responsavel de negocio
- E-mail do responsavel principal
- Responsavel tecnico
- Gestor aprovador
- Centro de custo
- Unidade de negocio
- Justificativa da criacao

## 2. Campos opcionais (dados de entrada do workflow)
- Comentarios
- Upload de Anexos (opcional)

## 3. Validacoes minimas esperadas
- Nome padronizado
- Baseline obrigatoria
- Centro de custo valido

## 4. Aprovacao
- Gestor solicitante
- Arquiteto Cloud
- Seguranca Cloud
- Governanca Cloud

## 5. Regras da tela (quando houver)
- Nome segue AWS_AC_{NOME_DA_CONTA}_{PRD|HML|DEV}.

## 6. Mapeamento de payload (campo -> chave tecnica)
- `nome_da_conta_aws`: Nome da conta AWS
- `descricao_finalidade_da_conta`: Descricao / finalidade da conta
- `tipo_de_conta`: Tipo de conta
- `ambiente`: Ambiente
- `responsavel_de_negocio`: Responsavel de negocio
- `e_mail_do_responsavel_principal`: E-mail do responsavel principal
- `responsavel_tecnico`: Responsavel tecnico
- `gestor_aprovador`: Gestor aprovador
- `centro_de_custo`: Centro de custo
- `unidade_de_negocio`: Unidade de negocio
- `justificativa_da_criacao`: Justificativa da criacao
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
