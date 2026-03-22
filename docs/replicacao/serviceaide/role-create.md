# ServiceAIDE - Criacao de role (`role-create`)

- Categoria de origem: Role AWS
- Fonte funcional: [ADR_CRIACAO_ROLE_AWS.md](../../adr/ADR_CRIACAO_ROLE_AWS.md)

## 1. Campos obrigatorios
- Conta AWS
- Nome da Role
- Trusted Entity
- Principal(is) Confiavel(is)
- Permissoes Iniciais da Role
- Justificativa

## 2. Campos opcionais
- Policies Existentes para Attach (quando modo attach-existing)
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
- Revisao deve exibir nome final da role, ambiente e policies vinculadas.

## 6. Mapeamento de payload (campo -> chave tecnica)
- `conta_aws`: Conta AWS
- `nome_da_role`: Nome da Role
- `trusted_entity`: Trusted Entity
- `principal_is_confiavel_is`: Principal(is) Confiavel(is)
- `permissoes_iniciais_da_role`: Permissoes Iniciais da Role
- `justificativa`: Justificativa
- `policies_existentes_para_attach_quando_modo_attach_existing`: Policies Existentes para Attach (quando modo attach-existing)
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
