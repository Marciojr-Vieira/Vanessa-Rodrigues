# Publicar na Netlify com Supabase

O repositório contém `netlify.toml`, build PostgreSQL e função agendada. A Netlify usa seu adaptador atual para Next.js; não é necessário exportar páginas estáticas nem configurar um redirect de SPA.

## 1. Conectar o repositório

Na Netlify, escolha **Add new project → Import an existing project → GitHub** e selecione `Marciojr-Vieira/Vanessa-Rodrigues`.

Se o código estiver na raiz do repositório, deixe **Base directory** vazio. Se ele estiver em `vanessa-site/`, use essa pasta como base. As configurações são:

| Campo | Valor |
| --- | --- |
| Production branch | `main`, ou a branch principal efetivamente enviada |
| Build command | `npm run netlify:build` |
| Publish directory | `.next` |
| Functions directory | `netlify/functions` |
| Node.js | 22 |

O `netlify.toml` já define esses caminhos relativos à pasta do projeto. O build gera o cliente Prisma PostgreSQL antes de compilar. Migrações e seed não são executados automaticamente em cada deploy.

## 2. Variáveis privadas

Antes do primeiro deploy, cadastre em **Project configuration → Environment variables**, disponíveis para **Builds e Functions**:

| Variável | Configuração |
| --- | --- |
| `DATABASE_URL` | PostgreSQL do Supabase, preferencialmente Transaction pooler 6543 com `pgbouncer=true&connection_limit=1&sslmode=require&schema=vanessa` |
| `DIRECT_URL` | Session pooler 5432, TLS e `schema=vanessa`, para operações administrativas |
| `SUPABASE_URL` | `https://xhuaolnvuijeyruonkmg.supabase.co` |
| `SUPABASE_SECRET_KEY` | Chave de servidor existente, mantida privada |
| `SUPABASE_STORAGE_BUCKET` | `site-media` |
| `JWT_SECRET` | Segredo existente, com pelo menos 32 caracteres |
| `UPLOAD_PROVIDER` | `supabase` |
| `TRUST_PROXY` | `false` inicialmente; só ative após validar o proxy e seu cabeçalho de IP |

Use os valores privados de `.env.supabase`; não os publique no GitHub. Também é possível usar `SUPABASE_SERVICE_ROLE_KEY` no lugar da chave secreta atual.

Não importe `NEXT_PUBLIC_SITE_URL=http://localhost:3001` para a hospedagem. Sem essa variável, o build utiliza a URL HTTPS de produção fornecida pela Netlify em `URL`. Para um domínio próprio, configure `NEXT_PUBLIC_SITE_URL=https://seu-dominio` e faça um novo deploy. Previews usam `DEPLOY_PRIME_URL`, para que login e formulário validem a origem correta. Mantenha a mesma origem ao navegar e enviar formulários.

Não é necessário criar outro administrador: o banco remoto mantém os usuários já cadastrados. `ADMIN_EMAIL` e `ADMIN_PASSWORD` só são usados pelo seed, não pelo login normal.

## 3. Preparar a nova rotina no banco

A migração da rotina pode ser aplicada pelo PowerShell local, com as credenciais privadas já configuradas:

```powershell
$env:PATH = 'C:\Program Files\nodejs;' + $env:PATH
Set-Location 'D:\Programação\Vanessa-advogada\vanessa-site'
npm.cmd run supabase:migrate
npm.cmd run supabase:heartbeat
```

Ela cria somente `vanessa.ServiceHeartbeat`. A tabela tem RLS e não concede acesso a `anon` ou `authenticated`. O envio guarda apenas identificador operacional, data, origem e contador; não grava dados pessoais.

A função usa TLS com validação do certificado e do hostname. A CA pública do Supabase está incluída no bundle em `netlify/lib/supabase-ca.mjs`, com cópia em `.crt`. Esse certificado é público, não uma credencial. Origem: URL de certificado usada pelo próprio dashboard Supabase. Fingerprint SHA-256: `80:70:25:AD:50:D4:ED:21:9D:2C:9C:7D:29:9C:00:4F:82:4E:B0:0C:F7:F6:5A:FE:F6:07:D0:7B:72:E6:CA:FA`; validade até 26/04/2031. A função não depende de um arquivo externo no disco da hospedagem.

## 4. Como funciona o intervalo de seis dias

`supabase-heartbeat` é uma **Scheduled Function da Netlify**, verificada todos os dias às **12:00 UTC / 09:00 de São Paulo**. Um único comando atômico no PostgreSQL envia/atualiza o dado somente quando o último envio ocorreu há pelo menos **144 horas**. Nos outros dias, o resultado é `skipped`. A primeira execução cria o registro.

O intervalo usa o último envio persistido, não o dia do mês: `*/6` em um cron mensal não representa seis dias contínuos nas viradas de mês. O contador e a data só mudam quando há envio. Execuções simultâneas não duplicam o registro. Se houver falha, ela aparece nos logs e a verificação seguinte tenta novamente.

A verificação diária também faz uma consulta ao banco. Ela não depende de visitas, da página aberta ou do computador local ligado. Só funciona automaticamente depois de um deploy de **produção publicado** na Netlify. Não fica ativa apenas por enviar o código ao GitHub. Previews e `netlify dev` não executam o cron automaticamente.

Em **Functions → supabase-heartbeat**, confira o selo Scheduled, a próxima execução e os logs. Use **Run now** para testar. O endpoint não pode ser chamado publicamente por URL. O CLI local `supabase:heartbeat` respeita o intervalo e não força novos envios.

No plano gratuito, o Supabase pode pausar projetos com baixa atividade em sete dias. Essa rotina não constitui garantia de disponibilidade; a documentação recomenda um plano pago para garantir ausência de pausa por inatividade.

## 5. Conferir depois do deploy

1. Abra o domínio HTTPS e confira Home, áreas, blog e páginas legais.
2. Entre em `/admin/login` e confira o painel.
3. Cadastre uma imagem em Mídia e confira sua leitura pelo site.
4. Confira envio de contato, persistência no painel e consentimento.
5. Execute **Run now** na função e confirme `sent` ou `skipped`, sem erro.

Os uploads usam Supabase Storage. Não envie apenas a pasta `.next` por drag-and-drop: este projeto precisa das funções de servidor do Next.js.

## Validação realizada em 08/10/2026

- Build de produção com as mesmas variáveis e comando da Netlify; cliente Prisma PostgreSQL gerado corretamente.
- Função empacotada pelo CLI oficial da Netlify, com a CA pública incluída no bundle.
- 20 testes unitários, 4 testes de navegação/administrador/contato, lint e TypeScript aprovados.
- Migração aplicada ao Supabase e primeiro heartbeat confirmado no banco. Repetição imediata retornou `skipped`.
- Intervalo testado antes e depois de 144 horas, em transação revertida. RLS ativa e ausência de acesso para `anon`/`authenticated` conferidas no banco real.

Essas verificações não ativam o agendamento remoto: ele começa após publicar a aplicação de produção na Netlify, com `DATABASE_URL` também disponível para Functions.

## Fontes

- [Next.js na Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/)
- [Scheduled Functions](https://docs.netlify.com/build/functions/scheduled-functions/)
- [Pausa de projetos gratuitos do Supabase](https://supabase.com/docs/guides/platform/free-project-pausing)
