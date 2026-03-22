# SailPoint IdentityNow - Remocao de usuario IAM (`iam-user-delete`)

- Categoria de origem: Usuarios IAM AWS
- Fonte funcional: [ADR_REMOCAO_USUARIO_IAM_AWS.md](../../adr/ADR_REMOCAO_USUARIO_IAM_AWS.md)

## 1. Campos obrigatorios (dados de entrada do workflow)
- Conta AWS
- Usuario IAM Alvo (nome/ARN)
- Plano de Revogacao de Credenciais
- Justificativa

## 2. Campos opcionais (dados de entrada do workflow)
- Comentarios
- Upload de Anexos (opcional)

## 3. Validacoes minimas esperadas
- Acesso de usuario de servico somente Programatico (sem console)
- Sem privilegio admin sem justificativa
- Rotacao de access keys
- Producao com aprovacao reforcada

## 4. Aprovacao
- Gestor solicitante
- Seguranca Cloud
- IAM Admin

## 5. Regras da tela (quando houver)
- Revogar access keys/senha antes da exclusao.

## 6. Mapeamento de payload (campo -> chave tecnica)
- `conta_aws`: Conta AWS
- `usuario_iam_alvo_nome_arn`: Usuario IAM Alvo (nome/ARN)
- `plano_de_revogacao_de_credenciais`: Plano de Revogacao de Credenciais
- `justificativa`: Justificativa
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
