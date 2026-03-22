# ServiceAIDE - Alteracao de role (`role-update`)

- Categoria de origem: Role AWS
- Fonte funcional: [ADR_ALTERACAO_ROLE_AWS.md](../../adr/ADR_ALTERACAO_ROLE_AWS.md)

## 1. Campos obrigatorios
- Conta AWS
- Role alvo para alteracao
- Acoes da Alteracao da Role
- Justificativa

## 2. Campos opcionais
- Comentarios
- Upload de Anexos (opcional)

## 3. Validacoes minimas
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
| Item | Status | Justificativa | Adaptacao recomendada |
| --- | --- | --- | --- |
| Campos obrigatorios/opcionais | Possivel | O construtor de formulario do ServiceAIDE cobre campos de entrada e obrigatoriedade. | Configurar os campos conforme lista deste documento. |
| Regras de validacao | Parcial | Validacoes simples sao nativas; validacoes mais especificas podem exigir regra custom. | Implementar regra de validacao no formulario ou no workflow de submissao. |
| Listas dinamicas com limite (adicionar/remover itens) | Parcial | Nem todo padrao de lista dinamica tem equivalente 1:1 no formulario padrao. | Substituir por campo multiline (1 item por linha) + validacao de quantidade no backend. |
| Upload de anexos | Possivel | Upload e controle de anexos sao recurso comum no chamado ITSM. | Manter upload no ticket e validar extensoes/tamanho conforme politica interna. |
| Revisao final da solicitacao (resumo) | Parcial | A experiencia de revisao visual pode variar do fluxo da aplicacao atual. | Gerar resumo no corpo do ticket antes da submissao final. |
