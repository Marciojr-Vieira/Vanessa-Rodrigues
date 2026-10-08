# Vanessa Rodrigues · site institucional e CMS

Site em português com Next.js 16 (App Router), TypeScript, Tailwind, Prisma, SQLite em desenvolvimento e PostgreSQL em produção. O painel fica em **/admin/login**. O visual utiliza composição editorial escura, champagne e tipografia serifada.

Para iniciar manualmente o ambiente atual com Supabase no Windows, siga [docs/COMO-RODAR.md](docs/COMO-RODAR.md).

Para publicar na Netlify pelo GitHub e ativar a rotina de atividade a cada seis dias, siga [docs/NETLIFY.md](docs/NETLIFY.md). O build e o agendamento estão definidos em `netlify.toml`.

## Instalação local

Requer Node.js **22.12 ou superior**, npm e acesso à internet para instalar dependências e baixar as fontes do Google durante o build.

```powershell
cd vanessa-site
npm install
Copy-Item .env.example .env
```

Preencha `ADMIN_EMAIL`, `ADMIN_PASSWORD` (12 caracteres ou mais) e `JWT_SECRET` no arquivo `.env`. Gere o segredo:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Não há senha fixa ou segredo alternativo no código. As credenciais já existentes no banco não são substituídas pelo seed.

```powershell
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Abra http://localhost:3000. No PowerShell com restrição de scripts, use `npm.cmd` e `npx.cmd`. Se Node não estiver no PATH, adicione o diretório da instalação ao PATH da sessão.

O seed cria o administrador, conteúdo inicial, seis perguntas sobre recuperação, páginas legais e três artigos **em rascunho**. Pode ser repetido sem apagar conteúdo existente. Não execute seed automaticamente para repor um módulo que você esvaziou de propósito.

## Configuração

| Variável | Uso |
| --- | --- |
| DATABASE_URL | `file:./dev.db` em desenvolvimento; URL PostgreSQL em produção |
| DIRECT_URL | Conexão PostgreSQL direta ou pooler session para migrações |
| UPLOAD_PROVIDER | `local` para disco persistente ou `supabase` para Supabase Storage |
| SUPABASE_URL / SUPABASE_STORAGE_BUCKET | Origem do projeto Supabase e bucket de imagens |
| SUPABASE_SECRET_KEY | Chave exclusiva do servidor para Storage; nunca usar prefixo `NEXT_PUBLIC_` |
| JWT_SECRET | Segredo aleatório com 32 caracteres ou mais |
| ADMIN_EMAIL / ADMIN_PASSWORD | Credenciais iniciais para o seed |
| NEXT_PUBLIC_SITE_URL | Origem exata, sem barra final; usada em SEO e proteção CSRF |
| TRUST_PROXY | `true` somente atrás de proxy confiável que substitui X-Forwarded-For |
| POSTGRES_PASSWORD | Senha do PostgreSQL no Docker Compose; use caracteres seguros para URL |
| RESET_PASSWORD | Senha temporária usada exclusivamente na redefinição via CLI |

O provedor Prisma não pode ser trocado apenas mudando sua URL. Os comandos `db:generate` e `db:migrate` selecionam o schema correto a partir de `DATABASE_URL`. O schema principal é SQLite; o schema PostgreSQL é gerado em `prisma/postgresql/schema.prisma`, com migrações SQL versionadas em `prisma/postgresql/migrations`. Gere novamente o cliente antes do build ao mudar de banco. A troca de provedor **não transfere dados**.

## Uso do painel

- **Dashboard:** contatos novos, totais, últimos contatos e cliques no WhatsApp por tipo.
- **Leads:** busca, filtros, detalhes, status, notas internas, CSV e exclusão. A listagem retorna até 1.000 contatos; o CSV inclui todos.
- **Configurações:** identidade, OAB, WhatsApp, endereço, redes, logo, favicon e mensagens. O WhatsApp deve incluir país e DDD.
- **Conteúdo da Home:** abertura, selos, cards, biografia, pilares, autoridade, passos e chamada final.
- **Áreas, recuperação e FAQ:** criar, editar, ativar/desativar, ordenar por arraste ou pelos botões de setas.
- **Blog:** editor Tiptap, slug automático, capa, descrição alternativa, SEO, rascunho e publicação.
- **Mídia:** JPG, PNG, WebP, GIF e ICO de até 5 MB. Fotos são validadas e convertidas para WebP com limite de 2.000 px; GIFs são convertidos para imagem estática. SVG enviado por usuário é recusado. Logo pode ser PNG transparente. Uma imagem em uso não pode ser excluída.
- **SEO:** cadastre o caminho exato da página, por exemplo `/`, `/blog` ou `/areas/direito-digital`.
- **Páginas legais:** editor para privacidade e termos.
- **Usuários e segurança:** atualizar perfil, trocar senha, listar e encerrar sessões. Administradores podem criar usuários e mudar seu perfil. Editores gerenciam conteúdo e mídia; não acessam contatos, configurações gerais, usuários de terceiros ou auditoria.
- **Depoimentos:** armazenados como conteúdo opcional, desativados e sem exibição pública.
- **Pré-visualizar:** mostra os textos atuais do formulário e o conteúdo rico em ambiente isolado antes de salvar. A prévia é do conteúdo editado; a composição final pode ser vista pelo botão **Ver site**.

Salvar atualiza o banco e revalida o layout público. No blog, escolha Rascunho para guardar sem publicar. Nos demais módulos, salvar torna a alteração pública imediatamente.

Enquanto o WhatsApp não estiver configurado, os botões levam ao formulário e preservam o tipo de atendimento escolhido. A triagem só é persistida com consentimento verdadeiro; após salvar, a confirmação permanece visível e o visitante pode escolher abrir o WhatsApp configurado. A contagem de cliques registra o acionamento do link e não confirma uma conversa iniciada.

## Fotos, logo e dados da cliente

Envie as fotos reais em **Mídia**, depois selecione a foto em **Conteúdo da Home → Abertura / Sobre**. Selecione logo e favicon em **Configurações**. Os placeholders de apresentação estão em `public/images`; não são fotos reais da cliente.

Antes de publicar, preencher: WhatsApp, e-mail, Instagram, OAB/UF, endereço/cidade, Linktree, fotos, logo definitivo e domínio. Os números de seguidores e visualizações iniciais vêm do briefing e devem ser confirmados e atualizados no painel. Revise os textos e as páginas legais com a responsável.

## Segurança e recuperação de senha

Senha com bcrypt (custo 12), cookie httpOnly, SameSite=Lax e Secure em produção. JWT de sete dias com sessão verificável no banco; encerramento e troca de perfil revogam o acesso. A sessão é renovada durante o uso do painel. Senha nova encerra as outras sessões. Login e formulário têm limite persistido no banco, compartilhado entre instâncias. Em instalações sem proxy confiável, o limite de IP usa uma chave comum; o login também limita por e-mail.

Mutações exigem Origin igual a `NEXT_PUBLIC_SITE_URL`. APIs validam entradas com Zod. HTML recebe sanitização com lista de permissões. CSV neutraliza fórmulas de planilha. Há cabeçalhos CSP, anti-frame, nosniff e política de referência. O CSP permite scripts inline necessários à hidratação do Next.js. HTTPS deve ser configurado na infraestrutura. O formulário possui honeypot e consentimento explícito. Não há cookies de marketing.

A recuperação de senha está disponível **via CLI**, sem depender de SMTP:

```powershell
$env:RESET_PASSWORD = 'coloque-aqui-uma-nova-senha-forte'
npm run db:reset-password
Remove-Item Env:RESET_PASSWORD
```

O comando usa `ADMIN_EMAIL`, altera a senha e encerra todas as sessões desse usuário. Para outro usuário, defina seu e-mail nessa variável para a execução. As variáveis SMTP não são utilizadas.

## Verificação

```powershell
npm run lint
npm run type-check
npm test
npx playwright install chromium
npm run test:e2e
npm run build
npm start
```

Vitest cobre sanitização, LGPD, CSRF, CSV e WhatsApp sem configuração. Playwright cobre páginas públicas, menu móvel, login, proteção de API, CRUD e ordenação de FAQ, publicação de artigos, upload e exclusão de mídia, WhatsApp, permissões de editor, revogação de sessão e triagem. Usa banco isolado em `.test-data/e2e.db` e porta 3100. Não execute os testes de navegador junto com outro `next dev` na mesma pasta.

A auditoria Lighthouse da Home no build de produção local (mobile simulado, 07/10/2026) atingiu **92 em desempenho e 100 em acessibilidade, boas práticas e SEO**. São resultados do ambiente local com placeholders; repita a medição no domínio final e após inserir fotos reais. Veja `docs/VALIDACAO.md`.

## Docker / PostgreSQL

Configure no `.env` um segredo JWT, credenciais de admin, `POSTGRES_PASSWORD` e a origem pública HTTPS. Instale Docker com Compose.

```bash
docker compose up --build -d
docker compose logs -f site
```

O container aplica as migrações PostgreSQL e executa o seed antes de iniciar. O banco e os uploads ficam em volumes persistentes. Publique atrás de um proxy HTTPS que preserve a origem e sanitize o cabeçalho de IP. O projeto usa saída standalone.

Faça backups do PostgreSQL e do volume de uploads. Nunca use `docker compose down -v` se quiser preservar esses dados. Para alterações futuras no schema PostgreSQL, crie e versione uma nova migração em ambiente de desenvolvimento antes de aplicar `migrate deploy`.

O Dockerfile e as migrações estão preparados; executar uma implantação real depende de Docker, infraestrutura e credenciais do ambiente escolhido.

## Supabase e Vercel

O projeto integra PostgreSQL e Storage do Supabase. A configuração, as conexões necessárias e os comandos estão em [docs/SUPABASE.md](docs/SUPABASE.md). Use `.env.supabase.example` como referência e mantenha os valores privados em `.env.supabase`.

Na Vercel, configure as variáveis pelo painel, selecione `UPLOAD_PROVIDER=supabase` e use `npm run db:generate && npm run build` como build command. Aplique as migrações e configure o bucket antes da publicação. As imagens são otimizadas no servidor e enviadas ao Storage; o CMS e `next/image` aceitam apenas imagens do projeto e bucket configurados. O adaptador local continua disponível para Docker com disco persistente.

## Organização

```text
src/app/                  páginas públicas, admin e APIs
src/components/admin/     formulários CMS, editor, mídia e segurança
src/components/sections/  seções do site existente
src/lib/                  autenticação, validação, CMS, SEO, upload
src/proxy.ts              proteção inicial de rotas e cabeçalhos
prisma/schema.prisma      modelos e SQLite
prisma/seed.ts            conteúdo inicial e administrador
prisma/postgresql/        schema de produção e migrações
scripts/                  seleção do banco, recuperação e servidor de teste
tests/                    testes unitários e de navegador
```
