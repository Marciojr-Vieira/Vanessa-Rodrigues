# Verificação da entrega · 07/10/2026

- `npm run lint`: aprovado, sem erros ou avisos.
- `npm run type-check`: aprovado.
- `npm test`: 11 testes unitários aprovados, incluindo o adaptador Supabase.
- `npm run test:e2e`: 3 cenários aprovados, com banco isolado.
- `npm run build`: compilação de produção aprovada.
- `npm start -- --port 3200`: aplicação de produção iniciada e páginas verificadas.
- Navegador: nenhum erro JavaScript na Home; viewport de 390 px sem rolagem horizontal.
- SQLite: schema atualizado e seed executado preservando conteúdo e administrador existentes.
- PostgreSQL Supabase: conexão pelo Session pooler aprovada, três migrações aplicadas e seed executado no schema `vanessa`. Docker não executado neste ambiente.

Os cenários de navegador cobrem páginas públicas, menu móvel, login inválido e válido, acesso sem autenticação, CSRF, CRUD e ordenação de FAQ, reflexo no site, rascunho e publicação de artigo, sitemap, upload e exclusão de imagem otimizada, configuração do WhatsApp, redirecionamento, permissões de editor, sessão revogada e consentimento da triagem.

## Lighthouse

Home em produção local, Chromium headless, configuração mobile padrão do Lighthouse:

| Categoria | Pontuação |
| --- | ---: |
| Desempenho | 92 |
| Acessibilidade | 100 |
| Boas práticas | 100 |
| SEO | 100 |

Relatório completo da execução disponível em `.test-data/lighthouse.json`. As capturas de tela de desktop e celular estão nessa mesma pasta. Esses arquivos são locais e ignorados pelo controle de versão. O teste usa os placeholders atuais, sem representar uma auditoria de todas as páginas ou da infraestrutura final.

## Dados e publicação

Faltam os dados oficiais da cliente: WhatsApp, e-mail, Instagram, OAB/UF, cidade/endereço, Linktree, fotos e identidade visual definitiva. O domínio e as credenciais de hospedagem também precisam ser definidos para publicar. Todos os dados do site são editáveis pelo painel.

Docker e a hospedagem final precisam ser verificados na infraestrutura de destino. PostgreSQL e Storage do Supabase foram verificados no projeto real. A redefinição de senha implementada é via CLI.

## Integração Supabase

- MCP configurado para `xhuaolnvuijeyruonkmg` e autenticação OAuth concluída. A extensão precisa ser reiniciada para disponibilizar as ferramentas nesta conversa.
- Bucket público `site-media` configurado no projeto real, com limite de 5 MB e tipos WebP/ICO.
- Upload de WebP, leitura pública com comparação dos bytes e exclusão confirmada no Storage real. O objeto temporário de verificação foi removido.
- Tentativa de upload com a chave pública recusada pelas regras de acesso do Storage.
- Build final aprovado; chave secreta, senha do administrador e segredo JWT ausentes dos 33 arquivos estáticos destinados ao navegador.
- Schema PostgreSQL atualizado e validado pelo Prisma, incluindo a localização da mídia e `DIRECT_URL`.
- Conexões Session pooler configuradas em `DATABASE_URL` e `DIRECT_URL`, com TLS e `schema=vanessa`. Autenticação aprovada com a senha corrigida.
- Três migrações aplicadas e seed concluído no banco remoto. As 23 tabelas do CMS, incluindo controle de migrações, têm RLS ativo e não permitem leitura por `anon` ou `authenticated`.
- As 20 tabelas anteriores de `public` foram preservadas. Nenhuma tabela de controle deste CMS permaneceu em `public`; nenhum conteúdo anterior foi importado para o novo CMS.
- `npm run supabase:build`: aprovado. Ajustado o carregamento de ambiente para evitar que `--env-file` fosse repassado aos workers do Next.js por `NODE_OPTIONS`.
- Produção com Supabase: login, sessão, painel, criação e edição de FAQ, reflexo na Home, upload otimizado no Storage, registro de mídia PostgreSQL e `next/image` aprovados. Registros temporários removidos e sessão encerrada.
- Chromium com viewport de 390 px: Home com banco remoto sem erros JavaScript ou rolagem horizontal. Captura local em `.test-data/supabase-mobile.png`.
- Credenciais fornecidas salvas apenas em `.env.supabase`, ignorado pelo controle de versão. A chave de servidor não é exposta ao navegador.
