# Documentacao visual de categorias

Este diretorio guarda screenshots das telas de categoria e das telas de solicitacao por acao.

## Objetivo

Registrar a versao visual atual do catalogo para auditoria funcional e revisao de mudancas.

## Escopo

Para cada categoria devem existir:

- `overview.png`: tela da categoria no catalogo.
- `<requestTypeId>-empty.png`: formulario sem preenchimento.
- `<requestTypeId>-filled.png`: formulario preenchido com dados mockados.
- `<requestTypeId>-review.png`: tela de revisao antes do envio.
- `manifest.json`: inventario dos arquivos gerados.

## Regra de preenchimento para captura

- Nas capturas com dados mockados, deve ser usada uma conta/produto com os 3 ambientes (`DEV`, `HML` e `PRD`).
- Para Role AWS, a captura preenchida e de revisao deve sempre selecionar os 3 ambientes do mesmo produto.

## Como atualizar

1. Instale o navegador do Playwright (apenas na primeira execucao):
   - `npx playwright install chromium`
2. Gere novamente todas as imagens:
   - `npm run screenshots:update`
3. Commit dos arquivos alterados em `docs/screenshots/categories/**`.

## Regra obrigatoria

Sempre que houver criacao, alteracao ou remocao de categoria, ou qualquer mudanca nas telas de solicitacao, o comando `npm run screenshots:update` deve ser executado e os screenshots devem ser versionados no mesmo commit da mudanca.
