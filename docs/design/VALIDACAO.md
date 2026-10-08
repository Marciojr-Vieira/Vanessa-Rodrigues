# Redesign e validação · 08/10/2026

## Entrega

Foram instaladas 38 skills adicionais do repositório solicitado `openai/skills`, preservando as existentes, e a skill local `frontend-app-builder` em `C:\Users\Destinator\.codex\skills\frontend-app-builder\SKILL.md`. A direção visual foi extraída de conceitos gerados antes da implementação; a especificação está em [ESPECIFICACAO.md](ESPECIFICACAO.md).

O site ganhou composição editorial, botões e links semânticos compartilhados, navegação acessível, serviços em colunas abertas, áreas em linhas, fotografia arquitetônica decorativa, formulário com confirmação persistente e busca no blog. O conteúdo cadastrado continua vindo do CMS.

## Conceitos e briefs de geração

Referência principal: [concepts/hero.png](concepts/hero.png), nativa de 1487 × 1058 px. As referências complementares estão em `concepts/`.

Base dos briefs: site jurídico em português, fundo quase preto, champagne, texto claro, Playfair Display e Inter, composição editorial aberta, linhas finas, controles legíveis, sem neon ou brilho. Preservar marca, navegação, textos e dados reais; não representar uma pessoa fictícia como Vanessa. Os conceitos orientam o visual; o CMS e a especificação escrita resolvem as diferenças de conteúdo produzidas pela geração.

| Arquivo | Composição pedida |
| --- | --- |
| hero.png | Título e subtítulo existentes à esquerda, dois caminhos de atendimento, três selos e arquitetura iluminada à direita. |
| services.png | Três colunas abertas, números, ícones e chamadas para cada tipo de atendimento. |
| areas.png | Três linhas horizontais com número, ícone, título, resumo e seta para a página da área. |
| recovery.png | Problemas de acesso em duas colunas, explicação da análise e dois caminhos de continuação. |
| about.png | Imagem arquitetônica ao lado da biografia, pilares e ação de contato. |
| authority.png | Métricas existentes em colunas abertas, sem inventar novos números. |
| steps.png | Quatro etapas numeradas com linhas finas e textos existentes. |
| faq.png | Título assimétrico e respostas em acordeão à direita. |
| contact.png | Chamada e formulário em duas colunas, campos acessíveis e consentimento. |
| footer.png | Marca, listas de navegação, atendimento e informações legais. |
| blog.png | Cabeçalho, busca e estado vazio, sem inventar artigos publicados. |

A foto de colunas foi gerada separadamente a partir da referência e otimizada para WebP em `public/images/architecture.webp`. É decorativa, não uma foto do escritório; imagens reais cadastradas têm prioridade. A marca SVG original foi preservada.

## Método e evidências

Browser/IAB não estava disponível na sessão; a verificação usou Chromium real com Playwright. Os conceitos e capturas da implementação foram abertos com `view_image` para comparação. Foram capturadas a dimensão nativa do Hero (1487 × 1058), celular (390 × 844) e tablet (1024 × 768). As evidências finais estão em [screenshots/](screenshots/), incluindo Home, menu, seções e blog; medições estão em `screenshots/checks.json`.

## Comparação visual

| Ponto | Referência | Implementação e decisão |
| --- | --- | --- |
| Paleta | Fundo escuro e champagne nos conceitos | Tokens compartilhados, sem neon, filtro sobre a foto ou brilho nos botões. |
| Hero | Duas colunas e título serifado dominante | Grade responsiva, título de 64 px no desktop e 35 px no celular; foto depois do texto no celular. |
| Marca e navegação | Identidade e links do site existente | SVG e sete destinos preservados. Menu também disponível no tablet, com Escape, foco e bloqueio do scroll de fundo. |
| Botões | Ação principal champagne, secundária discreta | Componente compartilhado, cantos de 12 px, alturas mínimas de 44–56 px e setas Lucide. Links internos continuam na mesma aba. |
| Serviços e áreas | Colunas abertas e linhas com separadores | Modelo preservado, com escala mais compacta que a imagem gerada para acomodar o conteúdo real. Ícones usam a família Lucide e o cadastro existente. |
| Recuperação | Lista em duas colunas e faixa de análise | Preservados os resumos reais e FAQ cadastrados; removida ilustração decorativa inventada pelo conceito. |
| Imagem | Arquitetura iluminada sem sobreposição de cor | Asset separado, proporção estável e legenda externa para leitura; foto real do CMS substitui o asset decorativo. |
| Contato | Formulário e chamada lado a lado | Campos de nome e telefone dividem uma linha no desktop e empilham no celular. Confirmação continua visível após envio. |
| Rodapé | Listas e informações existentes | Contatos não configurados ficam ocultos em vez de exibir placeholders ou links inválidos. Aviso legal preservado. |
| Movimento | Superfície sóbria | WhatsApp estático, sem pulse/ping. Reveal respeita movimento reduzido sem alterar o HTML inicial da hidratação. |

## Auditoria do texto da primeira tela

Lista permitida: marca, nome, links existentes, título e subtítulo do CMS, ações de WhatsApp/atuação, três selos e identificação da advogada. Não foi acrescentado um pretitle ao Hero. A seta textual da ação secundária passou a ícone SVG, mantendo o rótulo. A legenda foi movida para fora da imagem. O título e os textos reais não foram substituídos por paráfrases dos conceitos. Dados de OAB, contato, números e conteúdo publicado não foram inventados.

## Desvios deliberados

Não há equivalência pixel a pixel com os PNGs gerados: foram mantidos os textos do CMS, a marca original, os ícones cadastrados e a navegação existente. Títulos de seções, ícones e campos têm escala mais compacta conforme a especificação escrita; o formulário usa nome/telefone lado a lado no desktop. A legenda fica abaixo da foto. Desenhos decorativos e informações inventadas pela geração foram omitidos. Esses desvios mantêm a direção visual e a funcionalidade do projeto.

A implementação foi verificada contra a direção selecionada e a especificação escrita, com comparação visual de texto, grade, tipografia, cores, botões, imagens, espaçamento e comportamento responsivo. Não foram encontrados conteúdo cortado, rolagem horizontal ou botões aninhados nas três larguras verificadas.

## Funcionalidades e checks

- ESLint e TypeScript: passaram.
- Vitest: 12 testes passaram.
- Playwright: 4 testes passaram, incluindo páginas públicas, triagem contextual, confirmação sem redirecionamento, menu no tablet, login, proteção de API, CRUD, publicação, mídia, permissões e revogação de sessão.
- Build com cliente Prisma PostgreSQL e configurações Supabase: passou.
- Testes de navegador usam SQLite isolado; o cliente PostgreSQL foi restaurado antes de iniciar o ambiente Supabase.
- O servidor de testes agora gera explicitamente o cliente SQLite, evitando falha quando o último ambiente usado foi Supabase.

O projeto ficou disponível em http://localhost:3001 porque a porta 3000 pertence a outro projeto. O guia [COMO-RODAR.md](../COMO-RODAR.md) explica a inicialização manual e a configuração da origem. Não houve publicação externa.
