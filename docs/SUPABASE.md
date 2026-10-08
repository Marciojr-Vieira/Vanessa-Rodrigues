# Supabase · Vanessa Rodrigues

Projeto: `xhuaolnvuijeyruonkmg`.

Estado verificado em 07/10/2026: MCP autenticado, PostgreSQL conectado pelo Session pooler e Storage configurado. As três migrações e o seed foram executados no schema exclusivo `vanessa`, preservando as 20 tabelas existentes em `public`. O build de produção, login, edição de conteúdo, reflexo no site, upload pelo painel e otimização pelo `next/image` foram testados com o banco remoto. Os registros e a sessão temporários de teste foram removidos.

O site usa **Prisma com PostgreSQL do Supabase** e **Supabase Storage para imagens**. A autenticação própria do painel permanece baseada em bcrypt, JWT e sessões no banco. A autorização OAuth do MCP é usada pelo Codex e não substitui as credenciais do site.

## 1. Credenciais da aplicação

O arquivo `.env.supabase` foi preparado, mantendo as configurações existentes de administrador e JWT. Ele é ignorado pelo Git. Preencha nele:

- `DATABASE_URL`: conexão **Transaction pooler**, porta 6543, copiada em **Dashboard → Connect**, com `pgbouncer=true&connection_limit=1&sslmode=require` para o Prisma 5 usado neste projeto.
- `DIRECT_URL`: conexão **Session pooler**, porta 5432, ou conexão direta compatível com a rede. Migrações não devem usar o transaction pooler.
- `SUPABASE_SECRET_KEY`: chave secreta de servidor, obtida em **Project Settings → API Keys**. A chave legada `service_role` também é aceita em `SUPABASE_SERVICE_ROLE_KEY`.

As credenciais reais já estão configuradas localmente. Ambas as conexões usam atualmente o Session pooler `aws-0-us-east-2.pooler.supabase.com:5432`, com TLS e `schema=vanessa`. Preserve esse parâmetro em ambas as URLs para acessar as tabelas deste site. Para hospedagem serverless, use Transaction pooler em `DATABASE_URL` conforme descrito acima, mantendo `DIRECT_URL` no Session pooler para migrações.

A senha PostgreSQL é a senha do banco, e não uma chave de API. Codifique caracteres especiais da senha para uso em URL. Copie o host real do painel, pois a região do pooler não pode ser deduzida apenas pelo identificador do projeto.

Estas configurações já estão preenchidas:

```dotenv
SUPABASE_URL="https://xhuaolnvuijeyruonkmg.supabase.co"
SUPABASE_STORAGE_BUCKET="site-media"
UPLOAD_PROVIDER="supabase"
```

Use a conexão de um usuário PostgreSQL confiável no servidor, proprietário das tabelas ou com o acesso necessário para ignorar RLS. As tabelas deste CMS não são consultadas diretamente pelo navegador. As chaves secretas e conexões PostgreSQL nunca devem usar o prefixo `NEXT_PUBLIC_`.

## 2. Preparar o banco e o bucket

Depois de preencher as credenciais:

```powershell
npm run supabase:generate
npm run supabase:migrate
npm run supabase:seed
npm run supabase:storage
npm run supabase:dev -- --port 3001
```

As migrações criam as tabelas, adicionam a localização de armazenamento da mídia e ativam RLS nas tabelas do CMS. Também revogam privilégios de `anon` e `authenticated` sobre essas tabelas, quando os papéis existem. O acesso público ao conteúdo continua sendo feito pelo servidor Next.js. As regras usam o schema da conexão e não alteram outras tabelas ou schemas do projeto. Neste Supabase, o CMS usa `vanessa`, pois `public` já contém outra estrutura de conteúdo. Esses registros anteriores não são importados automaticamente para o CMS.

O seed preserva conteúdo e usuários que já existam no banco de destino. A troca de conexão **não copia automaticamente** os registros do SQLite ou arquivos locais: o banco de desenvolvimento continua preservado em `prisma/dev.db`. Se ele contém conteúdo personalizado, planeje a transferência antes de usar o banco remoto como fonte definitiva.

O comando de Storage cria um bucket público de imagens com limite de 5 MB e tipos WebP/ICO. Nenhuma política de escrita pública é criada. A API administrativa valida sessão, origem, tipo e tamanho antes de enviar o arquivo com a chave exclusiva do servidor. O comando recusa converter um bucket privado existente em público; nesse caso, escolha outro nome em `SUPABASE_STORAGE_BUCKET`.

Os registros de mídia guardam provedor, bucket e chave do objeto. Assim, uma imagem local existente continua sendo excluída do disco local mesmo quando o provedor ativo é Supabase. Imagens em uso pelo conteúdo não podem ser excluídas.

## 3. Verificar

No PowerShell deste computador, Node.js está instalado em `C:\Program Files\nodejs`, mas pode não estar no PATH do terminal. Para iniciar a partir de qualquer pasta, execute:

```powershell
$env:PATH = 'C:\Program Files\nodejs;' + $env:PATH
Set-Location 'D:\Programação\Vanessa-advogada\vanessa-site'
npm.cmd run supabase:dev -- --port 3001
```

Abra `http://localhost:3001` e mantenha o terminal aberto. Para encerrar o servidor, use `Ctrl+C`. Se já estiver na pasta `vanessa-site`, não repita `cd vanessa-site`.

Para verificar a compilação de produção, encerre o servidor de desenvolvimento antes de executar:

```powershell
npm run supabase:build
npm run supabase:start -- --port 3001
```

No painel, envie uma imagem em **Mídia**, selecione-a no Hero ou Sobre e confira o site. O `next/image` aceita apenas a origem do projeto e o caminho do bucket configurado. Reinicie o servidor após alterar `SUPABASE_URL` ou `SUPABASE_STORAGE_BUCKET`.

Para voltar ao SQLite local:

```powershell
npm run db:generate
npm run db:migrate
npm run dev
```

O arquivo `.env` continua sendo a configuração local. Não execute servidores com clientes Prisma de provedores diferentes ao mesmo tempo na mesma pasta: regenere o cliente ao trocar de ambiente.

## 4. Publicar na Vercel

Configure no projeto Vercel os valores de `.env.supabase`, com `NEXT_PUBLIC_SITE_URL` igual à origem HTTPS definitiva. Use **`npm run db:generate && npm run build`** como comando de build. Aplique as migrações e configure o bucket antes de publicar. No ambiente de hospedagem, as variáveis são definidas no painel; não é necessário enviar `.env.supabase`.

Os uploads ficam no Supabase Storage e deixam de depender do disco temporário da Vercel. Mantenha `UPLOAD_PROVIDER=supabase`. A imagem já é otimizada pelo servidor antes do upload.

## 5. MCP do Codex

O servidor global `supabase` foi adicionado com a URL fornecida e a autenticação OAuth foi concluída. Para verificar a configuração:

```powershell
codex mcp list
codex mcp get supabase --json
```

Na interface interativa do Codex CLI, use `/mcp`. Na extensão do VS Code, reinicie a extensão para que a conversa receba as ferramentas do novo servidor. Não use `/mcp` como comando de PowerShell.

## Fontes oficiais

- [Prisma e conexões no Supabase](https://supabase.com/docs/guides/database/prisma)
- [Upload para o Supabase Storage](https://supabase.com/docs/guides/storage/uploads/standard-uploads)
- [Buckets e limites de arquivos](https://supabase.com/docs/guides/storage/buckets/creating-buckets)
- [Configuração de MCP no Codex](https://learn.chatgpt.com/docs/extend/mcp?surface=cli)
