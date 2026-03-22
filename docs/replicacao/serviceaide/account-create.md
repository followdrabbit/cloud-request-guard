# ServiceAIDE - Criacao de conta AWS (`account-create`)

- Categoria de origem: Contas AWS
- Fonte funcional: [ADR_CRIACAO_CONTA_AWS.md](../../adr/ADR_CRIACAO_CONTA_AWS.md)

## 1. Campos obrigatorios
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

## 2. Campos opcionais
- Comentarios
- Upload de Anexos (opcional)

## 3. Validacoes minimas
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
| Item | Status | Justificativa | Adaptacao recomendada |
| --- | --- | --- | --- |
| Campos obrigatorios/opcionais | Possivel | O construtor de formulario do ServiceAIDE cobre campos de entrada e obrigatoriedade. | Configurar os campos conforme lista deste documento. |
| Regras de validacao | Parcial | Validacoes simples sao nativas; validacoes mais especificas podem exigir regra custom. | Implementar regra de validacao no formulario ou no workflow de submissao. |
| Listas dinamicas com limite (adicionar/remover itens) | Nao aplicavel | Esta tela nao depende de lista dinamica no modelo atual. | Nao aplicavel. |
| Upload de anexos | Possivel | Upload e controle de anexos sao recurso comum no chamado ITSM. | Manter upload no ticket e validar extensoes/tamanho conforme politica interna. |
| Revisao final da solicitacao (resumo) | Parcial | A experiencia de revisao visual pode variar do fluxo da aplicacao atual. | Gerar resumo no corpo do ticket antes da submissao final. |
