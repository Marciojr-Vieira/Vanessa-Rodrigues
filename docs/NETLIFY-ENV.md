# Arquivo .env para importar na Netlify

O arquivo local `.env.netlify`, na raiz do projeto, contém os valores reais preparados para esta hospedagem. O documento local `docs/NETLIFY-ENV-PRIVADO.md` mostra exatamente o mesmo conteúdo em um bloco de código. Ambos ficam fora do GitHub porque contêm credenciais.

## Importar os valores

1. Abra `.env.netlify` e copie seu conteúdo completo.
2. Na Netlify, entre em **Project configuration → Environment variables → Add a variable → Import from a .env file**.
3. Cole o conteúdo, selecione **Production** e os escopos **Builds e Functions**. Se houver conflitos, selecione **Update conflicts**.
4. Conclua a importação. Confira os escopos das variáveis existentes: a importação pode preservar seus escopos anteriores.
5. Marque **Contains secret values** nas conexões de banco, `JWT_SECRET` e `SUPABASE_SECRET_KEY`. As demais variáveis deste arquivo são configurações públicas.
6. Faça um novo deploy em **Deploys → Trigger deploy → Deploy project**.

## Conteúdo preparado

| Variável | Valor utilizado |
| --- | --- |
| `DATABASE_URL` | Credenciais atuais do banco, Transaction pooler **6543**, `schema=vanessa`, `pgbouncer=true`, `connection_limit=1` e TLS |
| `DIRECT_URL` | Conexão administrativa atual pelo Session pooler **5432**, `schema=vanessa` e TLS |
| `SUPABASE_URL` | `https://xhuaolnvuijeyruonkmg.supabase.co` |
| `SUPABASE_SECRET_KEY` | Chave privada existente em `.env.supabase` |
| `SUPABASE_STORAGE_BUCKET` | `site-media` |
| `JWT_SECRET` | Mesmo segredo existente em `.env.supabase` |
| `UPLOAD_PROVIDER` | `supabase` |
| `TRUST_PROXY` | `false` |
| `NODE_ENV` | `production` |

As conexões e chaves aparecem completas apenas nos dois arquivos privados locais. Nenhuma senha nova de administrador é criada por esta importação: o painel continua usando os usuários cadastrados no Supabase.

O Transaction pooler 6543 foi testado com consultas reais pelo PostgreSQL e pelo Prisma, com validação TLS. A chave de servidor foi usada para confirmar acesso à configuração do bucket. O ambiente gerado também foi conferido pelo validador de build do projeto.

`NODE_VERSION` e `SECRETS_SCAN_OMIT_KEYS` já estão definidos no `netlify.toml`; não é necessário importá-los. Mantenha `SECRETS_SCAN_OMIT_KEYS` como configuração pública se já existir no painel.

## Limpar configurações antigas

O formulário de importação atualiza as variáveis presentes no arquivo e não exclui as demais. Para usar a URL automática da Netlify, remova `NEXT_PUBLIC_SITE_URL` se ela já estiver cadastrada. O build determina a origem HTTPS pelo valor `URL` fornecido pela hospedagem. Se tiver domínio próprio, cadastre sua origem HTTPS em `NEXT_PUBLIC_SITE_URL` e faça um novo deploy.

O código atual não usa `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` nem variáveis `SMTP_*`; elas não são necessárias para esta configuração. `ADMIN_EMAIL` e `ADMIN_PASSWORD` são usados somente pelo seed e também não são necessários na hospedagem.

Não cadastre manualmente `URL`, `DEPLOY_PRIME_URL` ou `CONTEXT`: são valores fornecidos pela Netlify. O arquivo `.env.supabase` continua sendo o ambiente de desenvolvimento local, com sua URL local preservada.

Depois de publicar, confira o site, `/admin/login`, o envio de um contato, os uploads de mídia e **Functions → supabase-heartbeat → Run now**. A função precisa de `DATABASE_URL` no escopo **Functions** e só executa o agendamento automaticamente no deploy de produção publicado.

Fonte: [Importar variáveis de um arquivo .env na Netlify](https://docs.netlify.com/build/environment-variables/get-started/#import-variables-with-the-netlify-ui).
