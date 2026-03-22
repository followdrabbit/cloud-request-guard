# ServiceAIDE - Criacao de policy (`policy-create`)

- Categoria de origem: Policy AWS
- Fonte funcional: [ADR_CRIACAO_POLICY_AWS.md](../../adr/ADR_CRIACAO_POLICY_AWS.md)

## 1. Campos obrigatorios
- Conta AWS
- Nome da Policy (Taxonomia)
- Actions Necessarias
- Resources
- Justificativa

## 2. Campos opcionais
- Conditions (opcional)
- Comentarios
- Upload de Anexos (opcional)

## 3. Validacoes minimas
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
| Item | Status | Justificativa | Adaptacao recomendada |
| --- | --- | --- | --- |
| Campos obrigatorios/opcionais | Possivel | O construtor de formulario do ServiceAIDE cobre campos de entrada e obrigatoriedade. | Configurar os campos conforme lista deste documento. |
| Regras de validacao | Parcial | Validacoes simples sao nativas; validacoes mais especificas podem exigir regra custom. | Implementar regra de validacao no formulario ou no workflow de submissao. |
| Listas dinamicas com limite (adicionar/remover itens) | Nao aplicavel | Esta tela nao depende de lista dinamica no modelo atual. | Nao aplicavel. |
| Upload de anexos | Possivel | Upload e controle de anexos sao recurso comum no chamado ITSM. | Manter upload no ticket e validar extensoes/tamanho conforme politica interna. |
| Revisao final da solicitacao (resumo) | Parcial | A experiencia de revisao visual pode variar do fluxo da aplicacao atual. | Gerar resumo no corpo do ticket antes da submissao final. |
