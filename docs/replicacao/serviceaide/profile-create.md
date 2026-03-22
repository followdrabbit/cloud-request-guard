# ServiceAIDE - Criacao de perfil corporativo (`profile-create`)

- Categoria de origem: Acessos Corporativos (AD + Identity Center)
- Fonte funcional: [ADR_CRIACAO_PERFIL_ACESSO_AWS.md](../../adr/ADR_CRIACAO_PERFIL_ACESSO_AWS.md)

## 1. Campos obrigatorios
- Conta AWS
- Nome do Perfil Corporativo (Taxonomia)
- Grupo do Perfil de Acesso (Taxonomia)
- PSET Associado
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
- Grupo segue AWS_GR_{NOME_DO_PERFIL}_{PRD|HML|DEV}.

## 6. Mapeamento de payload (campo -> chave tecnica)
- `conta_aws`: Conta AWS
- `nome_do_perfil_corporativo_taxonomia`: Nome do Perfil Corporativo (Taxonomia)
- `grupo_do_perfil_de_acesso_taxonomia`: Grupo do Perfil de Acesso (Taxonomia)
- `pset_associado`: PSET Associado
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
