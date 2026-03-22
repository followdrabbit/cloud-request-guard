# ServiceAIDE - Alteracao de PSET (`pset-update`)

- Categoria de origem: PSET AWS
- Fonte funcional: [ADR_ALTERACAO_PSET_AWS.md](../../adr/ADR_ALTERACAO_PSET_AWS.md)

## 1. Campos obrigatorios
- Conta AWS
- Nome do PSET
- Acoes da Alteracao do PSET
- Justificativa

## 2. Campos opcionais
- Comentarios
- Upload de Anexos (opcional)

## 3. Validacoes minimas
- Ao menos uma policy obrigatoria
- Permission boundary em producao
- Session duration definida

## 4. Aprovacao
- Gestor solicitante
- Seguranca Cloud
- IAM Admin

## 5. Regras da tela (quando houver)
- Selecionar ao menos uma acao: Adicionar policy, Remover policy, Adicionar conta ou Remover conta.
- Cada acao deve conter ao menos um item objetivo para execucao.
- Limite de ate 10 itens por acao.

## 6. Mapeamento de payload (campo -> chave tecnica)
- `conta_aws`: Conta AWS
- `nome_do_pset`: Nome do PSET
- `acoes_da_alteracao_do_pset`: Acoes da Alteracao do PSET
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
