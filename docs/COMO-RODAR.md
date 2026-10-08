# Como iniciar o projeto manualmente

Para hospedagem na Netlify, veja [NETLIFY.md](NETLIFY.md).

Este guia usa Windows e PowerShell. A porta 3001 foi escolhida porque a porta 3000 está em uso por outro projeto neste computador. O ambiente atual utiliza PostgreSQL e Storage do Supabase, com as credenciais já configuradas no arquivo privado `.env.supabase`.

## Iniciar no dia a dia

Abra um terminal PowerShell e execute:

```powershell
$env:PATH = 'C:\Program Files\nodejs;' + $env:PATH
Set-Location 'D:\Programação\Vanessa-advogada\vanessa-site'
npm.cmd run supabase:generate
npm.cmd run supabase:dev -- --port 3001
```

Mantenha esse terminal aberto enquanto usa o projeto:

- Site: http://localhost:3001
- Painel: http://localhost:3001/admin/login

Entre com o administrador cadastrado. As credenciais iniciais estão em `.env.supabase`; alterar `ADMIN_PASSWORD` nesse arquivo não troca a senha de um usuário já existente.

Para parar, pressione **Ctrl+C** no terminal. Para iniciar novamente, execute os mesmos comandos. O comando `supabase:generate` prepara o cliente Prisma para PostgreSQL; ele é especialmente necessário depois dos testes ou de usar SQLite.

## Primeiro uso em outro computador

Instale Node.js 22.12 ou superior. Abra um PowerShell novo e confirme:

```powershell
node --version
npm.cmd --version
```

Entre na pasta do projeto e instale as dependências:

```powershell
Set-Location 'D:\Programação\Vanessa-advogada\vanessa-site'
npm.cmd ci
Copy-Item .env.supabase.example .env.supabase
```

Execute a cópia somente se `.env.supabase` ainda não existir, para preservar configurações existentes. Edite esse arquivo com as conexões PostgreSQL, chave de servidor do Supabase, JWT e administrador. Veja [SUPABASE.md](SUPABASE.md) para os detalhes. Preserve `schema=vanessa` nas conexões deste projeto e mantenha `NEXT_PUBLIC_SITE_URL=http://localhost:3001` para uso local.

Na primeira configuração do banco/bucket, execute:

```powershell
npm.cmd run supabase:generate
npm.cmd run supabase:migrate
npm.cmd run supabase:seed
npm.cmd run supabase:storage
npm.cmd run supabase:dev -- --port 3001
```

O Supabase deste projeto já foi preparado. Não é necessário repetir migrações, seed ou criação do bucket a cada inicialização. O seed não substitui a senha do administrador existente.

## Executar a versão de produção localmente

Pare o servidor de desenvolvimento antes:

```powershell
$env:PATH = 'C:\Program Files\nodejs;' + $env:PATH
Set-Location 'D:\Programação\Vanessa-advogada\vanessa-site'
npm.cmd run supabase:build
npm.cmd run supabase:start -- --port 3001
```

Abra http://localhost:3001. Depois de mudar código ou variáveis utilizadas no build, pare o servidor e gere um novo build. Essa execução local não publica o site na internet. O guia de publicação está em [SUPABASE.md](SUPABASE.md).

## Resolver problemas comuns

| Sintoma | Como resolver |
| --- | --- |
| `npm` ou `node` não reconhecido | Execute a linha de PATH do primeiro bloco. Se Node estiver em outra pasta, use o caminho correto da instalação. |
| PowerShell bloqueia `npm.ps1` | Use `npm.cmd`, como nos exemplos, sem alterar a política de execução. |
| `cd vanessa-site` não encontra a pasta | Use o `Set-Location` com o caminho completo. Se já estiver em `vanessa-site`, não entre nela novamente. |
| Porta 3001 ocupada | Pare o terminal que já está executando o projeto com Ctrl+C. Se a instância já atende em localhost:3001, use essa instância. |
| Prisma informa que a URL precisa começar com `file:` | Pare os servidores, execute `npm.cmd run supabase:generate` e inicie `supabase:dev` novamente. |
| Falha de conexão com o banco | Confira internet, projeto Supabase ativo e as URLs de `.env.supabase`. A configuração local utiliza Session pooler na porta 5432, com TLS e schema `vanessa`. |
| Erro de origem ao enviar o formulário ou salvar no painel | Use exatamente `http://localhost:3001` e confira `NEXT_PUBLIC_SITE_URL` no arquivo privado. Reinicie após alterações. Não misture `127.0.0.1` com `localhost`. |
| Alterou `.env.supabase` e nada mudou | Pare e reinicie o servidor; na versão de produção, gere o build novamente. |

## Testes e retorno ao Supabase

Pare o servidor antes dos testes de navegador. Eles usam SQLite isolado na porta 3100 e geram um cliente Prisma para esse banco.

```powershell
npm.cmd run lint
npm.cmd run type-check
npm.cmd test
npx.cmd playwright install chromium
npm.cmd run test:e2e
npm.cmd run supabase:generate
npm.cmd run supabase:dev -- --port 3001
```

Não execute servidores de SQLite e Supabase simultaneamente nesta mesma pasta. Mantenha `.env` e `.env.supabase` privados; a documentação não precisa conter senhas ou chaves reais.
