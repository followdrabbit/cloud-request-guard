# SailPoint IdentityNow - Alteracao de role (`role-update`)

- Categoria de origem: Role AWS
- Fonte funcional: [ADR_ALTERACAO_ROLE_AWS.md](../../adr/ADR_ALTERACAO_ROLE_AWS.md)

## 1. Campos obrigatorios (dados de entrada do workflow)
- Conta AWS
- Role alvo para alteracao
- Acoes da Alteracao da Role
- Justificativa

## 2. Campos opcionais (dados de entrada do workflow)
- Comentarios
- Upload de Anexos (opcional)

## 3. Validacoes minimas esperadas
- Escopo por conta AWS obrigatorio
- Nome padronizado obrigatorio no create
- Role alvo obrigatoria no update/delete
- Acoes de alteracao obrigatorias no role-update
- Policy JSON valido quando anexado

## 4. Aprovacao
- Gestor solicitante
- Seguranca Cloud
- IAM Admin

## 5. Regras da tela (quando houver)
- Selecionar ao menos uma acao no dropdown: Adicionar policy, Remover policy, Adicionar Trusted Entity, Alterar Trusted Entity, Remover Trusted Entity.
- Acoes de policy permitem ate 10 policies por solicitacao.
- Cada acao selecionada deve conter detalhamento objetivo para execucao.

## 6. Mapeamento de payload (campo -> chave tecnica)
- `conta_aws`: Conta AWS
- `role_alvo_para_alteracao`: Role alvo para alteracao
- `acoes_da_alteracao_da_role`: Acoes da Alteracao da Role
- `justificativa`: Justificativa
- `comentarios`: Comentarios
- `upload_de_anexos_opcional`: Upload de Anexos (opcional)

## 7. Itens nao 1:1 e adaptacao
| Item | Status em IdentityNow (nativo) | Justificativa | Adaptacao recomendada |
| --- | --- | --- | --- |
| Formulario livre por tela de chamado | Nao possivel 1:1 | IdentityNow e focado em governanca de identidade e nao em catalogo ITSM completo por formulario custom por processo. | Manter intake no ServiceAIDE e enviar payload para workflow no IdentityNow via API/webhook. |
| Campos obrigatorios/opcionais | Parcial | Campos podem ser representados em variaveis de workflow, mas a UX de formulario completo varia por recurso usado. | Capturar campos no sistema de intake e repassar para workflow IdentityNow como input estruturado. |
| Aprovacao multipapel custom por tela | Parcial | IdentityNow suporta etapas de aprovacao, mas o modelo nativo nao replica todo fluxo de ticket ITSM sozinho. | Implementar aprovacao no workflow IdentityNow ou manter aprovacao primaria no ServiceAIDE. |
| Listas dinamicas com limite (adicionar/remover itens) | Nao possivel 1:1 | Controles dinamicos de formulario com comportamento identico nao sao padrao no fluxo nativo. | Usar campo textual estruturado (JSON/lista por linha) e validar no workflow. |
| Upload de anexos do chamado | Nao possivel 1:1 | Anexo de ticket nao e o foco do request nativo do IdentityNow. | Armazenar anexo no ServiceAIDE/ECM e enviar apenas URL/ID de referencia ao workflow. |

## 8. Padrao recomendado de implementacao
1. Receber o formulario no ServiceAIDE.
2. Publicar payload estruturado para um workflow no IdentityNow.
3. Executar validacoes de negocio e aprovacao no workflow.
4. Acionar conectores/provisionamento IdentityNow quando aplicavel.
5. Devolver status de execucao para o ticket de origem.
