# ServiceAIDE - Levantamento de informacoes AWS (`info-create`)

- Categoria de origem: Levantamento de Informacoes AWS
- Fonte funcional: [ADR_LEVANTAMENTO_INFORMACOES_AWS.md](../../adr/ADR_LEVANTAMENTO_INFORMACOES_AWS.md)

## 1. Campos obrigatorios
- Descricao do levantamento
- Justificativa do levantamento

## 2. Campos opcionais
- Comentarios
- Upload de Anexos (opcional)

## 3. Validacoes minimas
- Descricao do levantamento obrigatoria
- Justificativa obrigatoria

## 4. Aprovacao
- Gestor solicitante
- Seguranca Cloud
- Governanca Cloud

## 5. Regras da tela (quando houver)
- A solicitacao pode cobrir dump amplo (ex.: todas as roles/policies/recursos) ou alvo especifico.
- O conteudo do levantamento e informado em texto livre para reduzir friccao de abertura.
- No mesmo campo, o solicitante pode combinar escopo amplo e alvos especificos.

## 6. Mapeamento de payload (campo -> chave tecnica)
- `descricao_do_levantamento`: Descricao do levantamento
- `justificativa_do_levantamento`: Justificativa do levantamento
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
