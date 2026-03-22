# ServiceAIDE - Encerramento de auditoria (`audit-close`)

- Categoria de origem: Auditoria AWS
- Fonte funcional: [ADR_ENCERRAMENTO_AUDITORIA_AWS.md](../../adr/ADR_ENCERRAMENTO_AUDITORIA_AWS.md)

## 1. Campos obrigatorios
- Conta AWS
- ID da Auditoria
- Parecer Final
- Justificativa

## 2. Campos opcionais
- Comentarios
- Upload de Anexos (opcional)

## 3. Validacoes minimas
- Escopo obrigatorio
- Justificativa obrigatoria
- Conta AWS obrigatoria

## 4. Aprovacao
- Gestor solicitante
- Cloud Audit Specialist
- Seguranca Cloud

## 5. Regras da tela (quando houver)
- Encerrar apenas com evidencias e parecer consolidado.

## 6. Mapeamento de payload (campo -> chave tecnica)
- `conta_aws`: Conta AWS
- `id_da_auditoria`: ID da Auditoria
- `parecer_final`: Parecer Final
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
