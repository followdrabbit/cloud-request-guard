# SailPoint IdentityNow - Criacao de policy (`policy-create`)

- Categoria de origem: Policy AWS
- Fonte funcional: [ADR_CRIACAO_POLICY_AWS.md](../../adr/ADR_CRIACAO_POLICY_AWS.md)

## 1. Campos obrigatorios (dados de entrada do workflow)
- Conta AWS
- Nome da Policy (Taxonomia)
- Actions Necessarias
- Resources
- Justificativa

## 2. Campos opcionais (dados de entrada do workflow)
- Conditions (opcional)
- Comentarios
- Upload de Anexos (opcional)

## 3. Validacoes minimas esperadas
- Acoes e resources devem ser informados no create
- Sem wildcard critico sem justificativa
- Change window para producao
- Alteracao/remocao deve manter menor privilegio e plano de rollback

## 4. Aprovacao
- Gestor solicitante
- Seguranca Cloud
- IAM Admin
- Governanca Cloud

## 5. Regras da tela (quando houver)
- Tipo de policy e implicito no create: IAM Managed Policy (sem campo na tela).
- No create, o solicitante informa Actions, Resources e Conditions (se houver), sem montar JSON manual.
- No campo Resources, o solicitante deve informar o nome exato do recurso (nao descricao em texto livre) ou ARN.
- Naming segue AWS_PL_{NOME_DA_POLICY}_{PRD|HML|DEV}.

## 6. Mapeamento de payload (campo -> chave tecnica)
- `conta_aws`: Conta AWS
- `nome_da_policy_taxonomia`: Nome da Policy (Taxonomia)
- `actions_necessarias`: Actions Necessarias
- `resources`: Resources
- `justificativa`: Justificativa
- `conditions_opcional`: Conditions (opcional)
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
