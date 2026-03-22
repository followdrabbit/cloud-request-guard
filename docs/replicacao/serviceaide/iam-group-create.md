# ServiceAIDE - Criacao de grupo IAM (`iam-group-create`)

- Categoria de origem: Grupos IAM AWS
- Fonte funcional: [ADR_CRIACAO_GRUPO_IAM_AWS.md](../../adr/ADR_CRIACAO_GRUPO_IAM_AWS.md)

## 1. Campos obrigatorios
- Conta AWS
- Nome do Grupo IAM (Taxonomia)
- Permissoes Iniciais do Grupo IAM
- Justificativa

## 2. Campos opcionais
- Policies Existentes para Attach (quando aplicavel)
- Comentarios
- Upload de Anexos (opcional)

## 3. Validacoes minimas
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
| Item | Status | Justificativa | Adaptacao recomendada |
| --- | --- | --- | --- |
| Campos obrigatorios/opcionais | Possivel | O construtor de formulario do ServiceAIDE cobre campos de entrada e obrigatoriedade. | Configurar os campos conforme lista deste documento. |
| Regras de validacao | Parcial | Validacoes simples sao nativas; validacoes mais especificas podem exigir regra custom. | Implementar regra de validacao no formulario ou no workflow de submissao. |
| Listas dinamicas com limite (adicionar/remover itens) | Nao aplicavel | Esta tela nao depende de lista dinamica no modelo atual. | Nao aplicavel. |
| Upload de anexos | Possivel | Upload e controle de anexos sao recurso comum no chamado ITSM. | Manter upload no ticket e validar extensoes/tamanho conforme politica interna. |
| Revisao final da solicitacao (resumo) | Parcial | A experiencia de revisao visual pode variar do fluxo da aplicacao atual. | Gerar resumo no corpo do ticket antes da submissao final. |
