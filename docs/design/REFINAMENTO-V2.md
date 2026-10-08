# Refinamento visual · versão 2

Referência principal: `concepts/hero-v2.png` (1487 × 1058). Serviços: `concepts/services-v2.png`. As demais seções continuam seguindo suas referências anteriores, com os mesmos tokens refinados.

## Especificação antes da implementação

- Paleta preservada: preto quente, champagne, branco suave e cinza. Sem gradiente ou filtro sobre a foto.
- Conteúdo até 1360 px, abertura com duas colunas e título até 74 px. Destaque itálico em champagne apenas na expressão existente “questões digitais”. Textos do CMS preservados.
- Foto arquitetônica existente, borda fina deslocada, cantos de 6 px, legenda externa. Foto real cadastrada continua tendo prioridade.
- Botões públicos com cantos de 6 px, estados de foco/hover/pressionado e setas de deslocamento discreto. Nada de animação repetitiva no WhatsApp.
- Serviços em três colunas abertas; números, ícone junto ao título, CTA alinhada e destaque plano na coluna de recuperação.
- Títulos de seção até 56 px; resumos legíveis, linhas e espaçamentos consistentes nas áreas, etapas, FAQ, contato e rodapé.
- Celular: título de 40 px, texto antes da imagem, imagem compacta, serviços empilhados e alvos de toque adequados. Tablet mantém o menu acessível.

Texto permitido na primeira tela: marca, sete links existentes, título/subtítulo do CMS, duas ações existentes, três selos existentes e legenda. Sem novos números, promessas, rótulos ou dados fictícios. A marca SVG original permanece; a ilustração de monograma gerada não a substitui.

Os conceitos foram gerados com esses briefs. A referência dos serviços incluiu também uma abertura; somente sua região de serviços orienta essa seção. Textos gerados diferentes do cadastro não são usados.

## Comparação e verificação final

Browser/IAB indisponível nesta sessão; foi utilizado Chromium real com Playwright. `view_image` foi usado nos conceitos e nas capturas da implementação. Capturas finais do build de produção estão em `screenshots/v2/`, com medições em `checks.json`. Verificação na dimensão nativa 1487 × 1058 e nas larguras 1024, 390 e 360 px. Capturas isoladas de seções ocultam temporariamente cabeçalho e WhatsApp fixos para permitir comparar o conteúdo inteiro; capturas do Hero mantêm os controles reais.

| Ponto comparado | Evidência e resultado |
| --- | --- |
| Texto e hierarquia | Título do CMS preservado integralmente, 74 px no desktop; itálico champagne na expressão existente. No celular, 38–40 px, sem overflow. |
| Grade | Texto dominante à esquerda, foto à direita e serviços abaixo. Grade empilha no celular; tablet mantém o menu. |
| Paleta | Fundo e champagne preservados, sem gradientes, brilho ou overlay na foto. |
| Botões | Cantos de 6 px, CTA dos serviços com 56 px e foco visível. Setas Lucide com hover discreto e movimento reduzido respeitado. |
| Foto e legenda | Borda fina externa, crop estável e legenda em duas linhas abaixo da imagem; qualidade de otimização aumentada para 85. |
| Serviços | Colunas abertas, ícone junto ao título, números e CTAs alinhados. Coluna de recuperação com destaque plano. |
| Formulário | Labels de 13 px, entradas de 16 px, foco em champagne. WhatsApp oculto enquanto o formulário está em foco. |
| Interações | Menu abre e fecha com Escape; caminho “Sou empresa” mantém EMPRESA selecionado na triagem. WhatsApp continua sem animação repetitiva. |

Auditoria da primeira tela: nenhum texto novo adicionado ao Hero. A expressão “questões digitais” recebeu apenas formatação. Marca, navegação, ações, selos e legenda permanecem. Não foram criadas informações pessoais ou métricas.

Desvios deliberados: marca SVG original e família Lucide existentes prevalecem sobre desenhos gerados; proporções e tamanhos dos controles seguem a especificação escrita e o conteúdo real. A moldura é deslocada em vez de sobreposta à foto. As seções posteriores mantêm sua composição anterior e recebem o refinamento dos tokens. A comparação confirma fidelidade à direção visual e à especificação, sem prometer equivalência pixel a pixel aos PNGs gerados.

Lint, TypeScript e build Supabase passaram. A inspeção do build de produção encontrou Home HTTP 200 em todas as larguras, foto inicial carregada, nenhuma rolagem horizontal e nenhum erro de console ou hidratação. Nenhum bloqueio visual material foi identificado nas superfícies verificadas. O site ficou rodando em http://localhost:3001, agora na versão de produção local.
