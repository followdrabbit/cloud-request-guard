# ServiceAIDE - Remocao de usuario IAM (`iam-user-delete`)

- Categoria de origem: Usuarios IAM AWS
- Fonte funcional: [ADR_REMOCAO_USUARIO_IAM_AWS.md](../../adr/ADR_REMOCAO_USUARIO_IAM_AWS.md)

## 1. Campos obrigatorios
- Conta AWS
- Usuario IAM Alvo (nome/ARN)
- Plano de Revogacao de Credenciais
- Justificativa

## 2. Campos opcionais
- Comentarios
- Upload de Anexos (opcional)

## 3. Validacoes minimas
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
| Item | Status | Justificativa | Adaptacao recomendada |
| --- | --- | --- | --- |
| Campos obrigatorios/opcionais | Possivel | O construtor de formulario do ServiceAIDE cobre campos de entrada e obrigatoriedade. | Configurar os campos conforme lista deste documento. |
| Regras de validacao | Parcial | Validacoes simples sao nativas; validacoes mais especificas podem exigir regra custom. | Implementar regra de validacao no formulario ou no workflow de submissao. |
| Listas dinamicas com limite (adicionar/remover itens) | Nao aplicavel | Esta tela nao depende de lista dinamica no modelo atual. | Nao aplicavel. |
| Upload de anexos | Possivel | Upload e controle de anexos sao recurso comum no chamado ITSM. | Manter upload no ticket e validar extensoes/tamanho conforme politica interna. |
| Revisao final da solicitacao (resumo) | Parcial | A experiencia de revisao visual pode variar do fluxo da aplicacao atual. | Gerar resumo no corpo do ticket antes da submissao final. |
