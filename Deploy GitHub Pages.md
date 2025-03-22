# Configuração para Deploy no GitHub Pages

Este guia explica como configurar seu projeto Flask para ser publicado como um site estático no GitHub Pages usando GitHub Actions.

## Preparação

1. **Crie um repositório no GitHub** (ou use um existente)
2. **Adicione os arquivos do seu projeto** ao repositório
3. **Adicione os dois arquivos criados:**
   - `freeze.py` - Script para gerar o site estático
   - `.github/workflows/deploy.yml` - Configuração do GitHub Actions

## Estrutura do Repositório

Seu repositório deve ter esta estrutura:

```
seu-repositorio/
├── app.py
├── freeze.py
├── static/
├── templates/
├── Animes/
│   └── *.md
└── .github/
    └── workflows/
        └── deploy.yml
```

## Como Funciona

1. Quando você faz um push para a branch principal (main/master), o GitHub Actions é acionado
2. O workflow instala Python e as dependências necessárias
3. Executa `freeze.py` para gerar o site estático
4. Publica os arquivos gerados na branch `gh-pages`
5. GitHub Pages serve automaticamente o conteúdo dessa branch

## Configurações no GitHub

Depois do primeiro deploy bem-sucedido:

1. Vá para **Settings > Pages** no seu repositório
2. Em **Source**, selecione a branch `gh-pages`
3. Clique em **Save**

GitHub fornecerá uma URL onde seu site está publicado (geralmente `https://seu-usuario.github.io/seu-repositorio/`).

## Personalização do Site

Se quiser usar um domínio personalizado:

1. Vá para **Settings > Pages** no seu repositório
2. Em **Custom domain**, insira seu domínio
3. Siga as instruções para configurar os registros DNS

## Resolução de Problemas

- **Problemas com caminhos relativos**: Se os links e recursos não carregarem corretamente, verifique se você está usando caminhos relativos em seu código HTML
- **Erro 404 para páginas**: Certifique-se de que as URLs geradas pelo Flask correspondem à estrutura esperada pelo GitHub Pages
- **Dependências faltando**: Atualize o arquivo `deploy.yml` para incluir todas as dependências necessárias

Se precisar de ajuda para diagnosticar problemas, consulte a aba "Actions" no GitHub para ver os logs de execução do workflow.