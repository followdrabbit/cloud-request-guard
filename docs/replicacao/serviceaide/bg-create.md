# ServiceAIDE - Concessao de acesso emergencial (`bg-create`)

- Categoria de origem: Breaking Glass AWS
- Fonte funcional: [ADR_CONCESSAO_BREAKING_GLASS_AWS.md](../../adr/ADR_CONCESSAO_BREAKING_GLASS_AWS.md)

## 1. Campos obrigatorios
- Conta AWS
- Incidente Relacionado
- Tipo de Acesso
- Identidade que Recebera Acesso
- Duracao Maxima
- Justificativa Emergencial

## 2. Campos opcionais
- Comentarios
- Upload de Anexos (opcional)

## 3. Validacoes minimas
- Incidente obrigatorio
- Justificativa obrigatoria
- Conta AWS obrigatoria
- Duracao maxima obrigatoria
- Revisao pos-uso obrigatoria

## 4. Aprovacao
- Gestor solicitante
- Seguranca Cloud
- Incident Response
- CISO

## 5. Regras da tela (quando houver)
- Somente para incidente ativo com aprovacao reforcada.

## 6. Mapeamento de payload (campo -> chave tecnica)
- `conta_aws`: Conta AWS
- `incidente_relacionado`: Incidente Relacionado
- `tipo_de_acesso`: Tipo de Acesso
- `identidade_que_recebera_acesso`: Identidade que Recebera Acesso
- `duracao_maxima`: Duracao Maxima
- `justificativa_emergencial`: Justificativa Emergencial
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
