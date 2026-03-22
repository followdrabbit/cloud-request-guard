# ServiceAIDE - Alteracao de grupo IAM (`iam-group-update`)

- Categoria de origem: Grupos IAM AWS
- Fonte funcional: [ADR_ALTERACAO_GRUPO_IAM_AWS.md](../../adr/ADR_ALTERACAO_GRUPO_IAM_AWS.md)

## 1. Campos obrigatorios
- Conta AWS
- Grupo IAM Alvo (nome/ARN)
- Acoes da Alteracao do Grupo IAM
- Justificativa

## 2. Campos opcionais
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
- Selecionar ao menos uma acao: Adicionar policy, Remover policy, Adicionar usuario ou Remover usuario.
- Cada acao deve conter ao menos um item objetivo para execucao.
- Limite de ate 10 itens por acao.

## 6. Mapeamento de payload (campo -> chave tecnica)
- `conta_aws`: Conta AWS
- `grupo_iam_alvo_nome_arn`: Grupo IAM Alvo (nome/ARN)
- `acoes_da_alteracao_do_grupo_iam`: Acoes da Alteracao do Grupo IAM
- `justificativa`: Justificativa
- `comentarios`: Comentarios
- `upload_de_anexos_opcional`: Upload de Anexos (opcional)

## 7. Itens nao 1:1 e adaptacao
| Item | Status | Justificativa | Adaptacao recomendada |
| --- | --- | --- | --- |
| Campos obrigatorios/opcionais | Possivel | O construtor de formulario do ServiceAIDE cobre campos de entrada e obrigatoriedade. | Configurar os campos conforme lista deste documento. |
| Regras de validacao | Parcial | Validacoes simples sao nativas; validacoes mais especificas podem exigir regra custom. | Implementar regra de validacao no formulario ou no workflow de submissao. |
| Listas dinamicas com limite (adicionar/remover itens) | Parcial | Nem todo padrao de lista dinamica tem equivalente 1:1 no formulario padrao. | Substituir por campo multiline (1 item por linha) + validacao de quantidade no backend. |
| Upload de anexos | Possivel | Upload e controle de anexos sao recurso comum no chamado ITSM. | Manter upload no ticket e validar extensoes/tamanho conforme politica interna. |
| Revisao final da solicitacao (resumo) | Parcial | A experiencia de revisao visual pode variar do fluxo da aplicacao atual. | Gerar resumo no corpo do ticket antes da submissao final. |
