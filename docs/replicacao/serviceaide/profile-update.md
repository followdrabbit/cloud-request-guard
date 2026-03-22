# ServiceAIDE - Alteracao de perfil corporativo (`profile-update`)

- Categoria de origem: Acessos Corporativos (AD + Identity Center)
- Fonte funcional: [ADR_ALTERACAO_PERFIL_ACESSO_AWS.md](../../adr/ADR_ALTERACAO_PERFIL_ACESSO_AWS.md)

## 1. Campos obrigatorios
- Conta AWS
- Perfil Corporativo Alvo
- Grupo do Perfil de Acesso (nome livre)
- PSET Associado (nome/ARN)
- Justificativa

## 2. Campos opcionais
- Comentarios
- Upload de Anexos (opcional)

## 3. Validacoes minimas
- Grupo AD obrigatorio
- PSET vinculado obrigatorio
- Ao menos uma conta AWS
- Menor privilegio

## 4. Aprovacao
- Gestor solicitante
- Seguranca Cloud
- IAM Admin

## 5. Regras da tela (quando houver)
- Preservar segregacao de funcao e menor privilegio.

## 6. Mapeamento de payload (campo -> chave tecnica)
- `conta_aws`: Conta AWS
- `perfil_corporativo_alvo`: Perfil Corporativo Alvo
- `grupo_do_perfil_de_acesso_nome_livre`: Grupo do Perfil de Acesso (nome livre)
- `pset_associado_nome_arn`: PSET Associado (nome/ARN)
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
