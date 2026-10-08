import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed do banco de dados...')

  // 1. Administrador Inicial
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminEmail || !adminPassword || adminPassword.length < 12 || adminPassword.startsWith('CHANGE_ME')) throw new Error('Configure ADMIN_EMAIL e ADMIN_PASSWORD (mínimo 12 caracteres) antes do seed.')
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: 'Vanessa Rodrigues',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    })
    console.log(`✓ Administrador criado: ${adminEmail}`)
  } else {
    console.log(`✓ Administrador já existe: ${adminEmail}`)
  }

  // 2. Configurações Gerais
  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      siteName: 'Vanessa Rodrigues | Advogada',
      oab: '[OAB/UF]',
      whatsapp: '[WHATSAPP]',
      email: '[EMAIL]',
      address: '[ENDEREÇO]',
      city: '[CIDADE/UF]',
      instagram: '[INSTAGRAM]',
      linktree: '[LINKTREE]',
      whatsappMsgEmpresa: 'Olá, Dra. Vanessa! Sou empresa e gostaria de falar sobre assessoria preventiva e estratégica.',
      whatsappMsgTrabalhador: 'Olá, Dra. Vanessa! Sou trabalhador(a) e gostaria de apresentar meu caso para análise.',
      whatsappMsgConta: 'Olá, Dra. Vanessa! Preciso de assessoria jurídica especializada para recuperar o acesso à minha conta de rede social.',
    },
  })
  console.log('✓ Configurações gerais inseridas.')

  await prisma.recoveryContent.upsert({where:{id:'singleton'},create:{id:'singleton'},update:{}})

  // 3. Hero Content
  await prisma.heroContent.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      eyebrow: 'DIREITO TRABALHISTA E DIGITAL',
      title: 'Orientação jurídica para empresas, trabalhadores e questões digitais.',
      subtitle: 'Atuação estratégica, atendimento humanizado e foco na segurança jurídica de cada caso.',
      ctaText: 'Falar no WhatsApp',
      ctaLink: '#contato',
      secondaryCta: 'Conheça minha atuação →',
      verticalPhrase: 'Segurança jurídica para o que realmente importa.',
      seals: JSON.stringify([
        { icon: 'ShieldCheck', text: 'Atendimento personalizado' },
        { icon: 'Lock', text: 'Sigilo e ética profissional' },
        { icon: 'Target', text: 'Atuação estratégica' },
      ]),
    },
  })
  console.log('✓ Conteúdo do Hero inserido.')

  // 4. Cards de Atendimento (Como posso te ajudar?)
  const countServiceCards = await prisma.serviceCard.count()
  if (countServiceCards === 0) {
    await prisma.serviceCard.createMany({
      data: [
        {
          title: 'Sou empresa',
          type: 'EMPRESA',
          subtitle: 'Quero falar sobre minha empresa',
          icon: 'Building2',
          ctaText: 'Falar com a advogada',
          whatsappMessage: 'Olá, Dra. Vanessa! Sou empresário(a) e busco assessoria trabalhista preventiva e consultoria jurídica para minha empresa.',
          highlight: false,
          order: 1,
        },
        {
          title: 'Sou trabalhador',
          type: 'TRABALHADOR',
          subtitle: 'Quero explicar meu caso',
          icon: 'UserCheck',
          ctaText: 'Explicar meu caso',
          whatsappMessage: 'Olá, Dra. Vanessa! Gostaria de orientação jurídica sobre meus direitos trabalhistas e análise do meu caso.',
          highlight: false,
          order: 2,
        },
        {
          title: 'Preciso recuperar uma conta',
          type: 'CONTA',
          subtitle: 'Quero recuperar minha conta',
          icon: 'ShieldAlert',
          ctaText: 'Recuperar minha conta agora',
          whatsappMessage: 'Olá, Dra. Vanessa! Perdi o acesso à minha conta (Instagram/rede social) e preciso de suporte jurídico imediato.',
          highlight: true,
          order: 3,
        },
      ],
    })
    console.log('✓ Cards de atendimento inseridos.')
  }

  // 5. Áreas de Atuação
  const countAreas = await prisma.practiceArea.count()
  if (countAreas === 0) {
    await prisma.practiceArea.createMany({
      data: [
        {
          title: 'Direito Trabalhista para Empresas',
          slug: 'direito-trabalhista-empresas',
          summary: 'Assessoria jurídica preventiva, consultoria em compliance trabalhista, redução de passivo e defesa em reclamatórias para empresas de diversos segmentos.',
          content: `
            <h2>Assessoria Preventiva e Defesa Corporativa</h2>
            <p>A atuação preventiva no Direito do Trabalho é indispensável para proteger a saúde financeira e a reputação da sua empresa. Atuamos com análise de contratos, adequação de rotinas, consultoria em rescisões e mitigação de riscos de passivo trabalhista.</p>
            <h3>Serviços prestados:</h3>
            <ul>
              <li>Auditoria e compliance de rotinas trabalhistas;</li>
              <li>Elaboração e revisão de contratos de trabalho e termos de confidencialidade;</li>
              <li>Defesa em reclamatórias trabalhistas e negociações sindicais;</li>
              <li>Treinamento de lideranças e adequação de jornadas e benefícios.</li>
            </ul>
          `,
          icon: 'Briefcase',
          order: 1,
          seoTitle: 'Direito Trabalhista para Empresas | Vanessa Rodrigues Advogada',
          seoDesc: 'Assessoria jurídica trabalhista para empresas. Compliance, prevenção de passivos e defesa contenciosa com excelência.',
        },
        {
          title: 'Direito Trabalhista para Trabalhadores',
          slug: 'direito-trabalhista-trabalhadores',
          summary: 'Análise detalhada de verbas rescisórias, horas extras, assédio, vínculo empregatício e garantia dos direitos fundamentais do trabalhador.',
          content: `
            <h2>Defesa dos Direitos do Trabalhador</h2>
            <p>Atendimento humanizado para quem busca esclarecer dúvidas ou reivindicar direitos decorrentes do contrato de trabalho. Todo caso é analisado com rigor técnico e transparência.</p>
            <h3>Principais situações atendidas:</h3>
            <ul>
              <li>Reconhecimento de vínculo empregatício;</li>
              <li>Cobrança de horas extras, adicional noturno, insalubridade e periculosidade;</li>
              <li>Rescisão indireta por descumprimento das obrigações pelo empregador;</li>
              <li>Indenizações por danos morais, assédio moral ou acidentes de trabalho.</li>
            </ul>
          `,
          icon: 'Users',
          order: 2,
          seoTitle: 'Direito Trabalhista para Trabalhadores | Vanessa Rodrigues Advogada',
          seoDesc: 'Orientação jurídica completa e atendimento humanizado para trabalhadores e ex-trabalhadores.',
        },
        {
          title: 'Direito Digital & Recuperação de Contas',
          slug: 'direito-digital-recuperacao-de-contas',
          summary: 'Medidas judiciais e extrajudiciais para restabelecimento de perfis invadidos, contas desativadas, bloqueadas ou clonadas no Instagram e outras plataformas.',
          content: `
            <h2>Especialista em Recuperação de Contas em Redes Sociais</h2>
            <p>A perda de acesso a um perfil no Instagram, seja por invasão de terceiros, desativação injustificada da plataforma ou golpe do perfil clonado, causa prejuízos imediatos à imagem e aos negócios.</p>
            <h3>Atuação especializada:</h3>
            <ul>
              <li>Notificação extrajudicial célere aos provedores de aplicação (Meta/Instagram, Google, etc.);</li>
              <li>Ações judiciais de obrigação de fazer com pedido de tutela de urgência (liminar);</li>
              <li>Proteção contra fraudes decorrentes de invasão (golpes aplicados a seguidores);</li>
              <li>Preservação e produção de provas digitais em conformidade com o Marco Civil da Internet.</li>
            </ul>
          `,
          icon: 'KeyRound',
          order: 3,
          seoTitle: 'Recuperação de Contas do Instagram e Direito Digital | Vanessa Rodrigues Advogada',
          seoDesc: 'Recupere sua conta invadida, desativada ou suspensa no Instagram e redes sociais com assessoria jurídica especializada.',
        },
      ],
    })
    console.log('✓ Áreas de atuação inseridas.')
  }

  // 6. Tipos de Problemas de Recuperação de Contas
  const countRecovery = await prisma.accountRecoveryType.count()
  if (countRecovery === 0) {
    await prisma.accountRecoveryType.createMany({
      data: [
        {
          title: 'Conta Invadida / Hackeada',
          description: 'Alteração indevida de senha, e-mail de recuperação, telefone e autenticação em dois fatores por invasores.',
          icon: 'ShieldAlert',
          order: 1,
        },
        {
          title: 'Conta Desativada Indevidamente',
          description: 'Bloqueio arbitrário ou desativação súbita sob alegação genérica de violação dos termos de uso da plataforma.',
          icon: 'Ban',
          order: 2,
        },
        {
          title: 'Conta Suspensa sem Justificativa',
          description: 'Suspensão temporária que se estende sem canal efetivo de suporte para contestação ou envio de documentos.',
          icon: 'AlertTriangle',
          order: 3,
        },
        {
          title: 'Perfil Clonado ou Falso',
          description: 'Criação de contas fakes com fotos e nomes da vítima para aplicação de golpes e venda de produtos falsos.',
          icon: 'UserX',
          order: 4,
        },
        {
          title: 'Perda de Acesso ao E-mail / Telefone',
          description: 'Impossibilidade de recuperação pelos métodos convencionais automatizados do aplicativo.',
          icon: 'MailWarning',
          order: 5,
        },
        {
          title: 'Conta Comercial ou Verificada',
          description: 'Perfis de empresas, influenciadores e profissionais liberais com prejuízo econômico e risco à reputação.',
          icon: 'Building',
          order: 6,
        },
      ],
    })
    console.log('✓ Tipos de recuperação inseridos.')
  }

  // 7. Sobre
  await prisma.aboutContent.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      name: 'Vanessa Rodrigues',
      title: 'Advogada',
      bio: 'Advogada com destacada atuação nas áreas de Direito Trabalhista e Direito Digital. Dedica-se a oferecer assessoria jurídica estratégica e preventiva para empresas de diversos segmentos, além de prestar suporte a trabalhadores e liderar defesas especializadas em litígios do ambiente digital, com ênfase no restabelecimento de contas de redes sociais. Sua atuação é pautada pelo atendimento humanizado, rigor técnico e estrito respeito às normas éticas da advocacia.',
      ctaText: 'Falar no WhatsApp',
      pillars: JSON.stringify([
        { icon: 'Scale', title: 'Atuação ética e responsável' },
        { icon: 'HeartHandshake', title: 'Atendimento humanizado' },
        { icon: 'SearchCheck', title: 'Análise individual de cada caso' },
        { icon: 'Lock', title: 'Seu caso com sigilo e segurança' },
      ]),
    },
  })
  console.log('✓ Conteúdo Sobre inserido.')

  // 8. Números de Autoridade (Instagram & Carreira)
  const countStats = await prisma.authorityStat.count()
  if (countStats === 0) {
    await prisma.authorityStat.createMany({
      data: [
        {
          label: 'Seguidores no Instagram',
          value: '+8.000',
          icon: 'Users',
          order: 1,
        },
        {
          label: 'Visualizações em Reels',
          value: '+1 Milhão',
          icon: 'Eye',
          order: 2,
        },
        {
          label: 'Dedicação e Análise Individual',
          value: '100%',
          icon: 'Award',
          order: 3,
        },
      ],
    })
    console.log('✓ Números de autoridade inseridos.')
  }

  // 9. Como Funciona (Passos)
  const countSteps = await prisma.howItWorksStep.count()
  if (countSteps === 0) {
    await prisma.howItWorksStep.createMany({
      data: [
        {
          step: 1,
          title: 'Você informa sua situação',
          description: 'Envie um resumo do ocorrido através do WhatsApp ou formulário de contato com as principais informações.',
          order: 1,
        },
        {
          step: 2,
          title: 'As informações passam por uma triagem',
          description: 'Avaliamos a viabilidade inicial da demanda e quais documentos serão necessários para instrução.',
          order: 2,
        },
        {
          step: 3,
          title: 'O caso poderá ser analisado individualmente',
          description: 'Estudo das medidas extrajudiciais ou judiciais cabíveis, sempre com clareza sobre riscos e procedimentos.',
          order: 3,
        },
        {
          step: 4,
          title: 'Havendo possibilidade de atendimento, o contato segue pelos canais oficiais',
          description: 'Formalização da contratação e início dos trâmites com acompanhamento transparente e direto.',
          order: 4,
        },
      ],
    })
    console.log('✓ Passos de Como Funciona inseridos.')
  }

  // 10. CTA Final
  await prisma.ctaFinalContent.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      title: 'Estou à disposição para entender o seu caso.',
      subtitle: 'Escolha o tipo de atendimento e fale comigo diretamente.',
      buttonText: 'Falar no WhatsApp',
      phrase: 'Direito é mais do que lei. É sobre pessoas.',
    },
  })
  console.log('✓ CTA Final inserido.')

  // 11. FAQ (Focado em Recuperação de Contas e Atuação)
  const countFaq = await prisma.faqItem.count()
  if (countFaq === 0) {
    await prisma.faqItem.createMany({
      data: [
        {
          question: 'Minha conta do Instagram foi invadida e os criminosos mudaram o e-mail e telefone. Ainda é possível recuperar?',
          answer: 'Sim, a jurisprudência brasileira reconhece a responsabilidade dos provedores de aplicação pela segurança dos dados e pela restituição de contas legítimas. Quando os meios automatizados de recuperação falham, é possível notificar a plataforma extrajudicialmente ou ajuizar ação com pedido de tutela de urgência (liminar) para restabelecimento imediato do perfil.',
          category: 'recuperacao',
          order: 1,
        },
        {
          question: 'Quanto tempo costuma levar o processo de recuperação de uma conta?',
          answer: 'O tempo varia conforme a via adotada e a celeridade do Poder Judiciário ou da resposta da plataforma. Em medidas com pedido de liminar urgente, o juiz costuma apreciar o pedido em poucos dias úteis após a distribuição da ação.',
          category: 'recuperacao',
          order: 2,
        },
        {
          question: 'Existe garantia de que a conta será recuperada?',
          answer: 'Por estrito dever ético profissional determinado pela OAB, nenhum advogado pode prometer ou garantir o resultado de uma demanda judicial ou extrajudicial. O que garantimos é a atuação técnica mais combativa, ágil e fundamentada na melhor jurisprudência aplicável ao seu caso.',
          category: 'recuperacao',
          order: 3,
        },
        {
          question: 'Quais documentos e provas devo reunir imediatamente após a invasão ou bloqueio?',
          answer: 'Prints dos e-mails de segurança da plataforma informando troca de endereço/senha, comprovante de que a conta pertencia a você (fotos antigas, documentos com foto, comprovante de CNPJ se for conta comercial), prints de mensagens dos invasores e eventuais tentativas de golpe aplicadas.',
          category: 'recuperacao',
          order: 4,
        },
        {
          question: 'A assessoria jurídica para empresas pode ser contratada de forma preventiva mensal?',
          answer: 'Sim, prestamos consultoria e assessoria jurídica continuada para empresas, com foco na adequação de contratos, mitigação de riscos de passivo trabalhista e suporte consultivo contínuo aos gestores e setor de RH.',
          category: 'geral',
          order: 5,
        },
        {
          question: 'Como funciona o primeiro contato e a triagem do caso?',
          answer: 'Você entra em contato pelo WhatsApp selecionando o tipo de atendimento. Realizamos uma triagem das informações iniciais para checar a viabilidade do atendimento e, caso haja possibilidade, agendamos uma conversa aprofundada.',
          category: 'geral',
          order: 6,
        },
      ],
    })
    console.log('✓ Perguntas frequentes (FAQ) inseridas.')
  }

  // 12. Blog (3 Artigos de Exemplo em Rascunho)
  const countPosts = await prisma.blogPost.count()
  if (countPosts === 0) {
    await prisma.blogPost.createMany({
      data: [
        {
          title: 'Conta do Instagram hackeada: o que fazer nas primeiras 24 horas?',
          slug: 'conta-instagram-hackeada-o-que-fazer',
          excerpt: 'Passo a passo com as medidas urgentes para proteger seus contatos, preservar provas digitais e viabilizar a recuperação jurídica do perfil.',
          content: `
            <p>Ter a conta do Instagram invadida é uma situação de extrema urgência, especialmente quando o perfil é utilizado para fins profissionais ou comerciais.</p>
            <h2>1. Não tente negociar com os invasores</h2>
            <p>Golpistas comumente exigem pagamentos via Pix prometendo devolver a conta. Quase sempre trata-se de um novo golpe, sem qualquer devolução.</p>
            <h2>2. Avise amigos, clientes e seguidores</h2>
            <p>Utilize outros canais para alertar que a conta foi comprometida e que nenhuma solicitação financeira ou venda de produtos é legítima.</p>
            <h2>3. Preserve todas as provas</h2>
            <p>Guarde prints das notificações de alteração de e-mail, telefone e senha enviadas pela Meta, além de histórico de conversas e mensagens de golpe.</p>
            <h2>4. Procure orientação jurídica especializada</h2>
            <p>Com as provas em mãos, um advogado especialista em Direito Digital poderá acionar os mecanismos legais para compelir a plataforma a devolver o acesso.</p>
          `,
          status: 'DRAFT',
          seoTitle: 'Conta do Instagram hackeada: medidas urgentes | Artigo',
          seoDesc: 'Descubra quais passos tomar imediatamente após ter sua conta do Instagram invadida.',
        },
        {
          title: 'Direito Trabalhista Preventivo: por que empresas devem auditar seus contratos?',
          slug: 'direito-trabalhista-preventivo-auditoria-de-contratos',
          excerpt: 'Como a assessoria trabalhista estratégica reduz custos operacionais, previne litígios e resguarda a saúde financeira da empresa.',
          content: `
            <p>A judicialização no ambiente corporativo brasileiro representa um dos maiores custos ocultos para pequenas e médias empresas.</p>
            <h2>A importância da prevenção</h2>
            <p>Mais do que defender a empresa em processos já abertos, a advocacia moderna atua preventivamente, identificando gargalos na jornada de trabalho, cálculo de horas e termos de confidencialidade.</p>
            <h2>Benefícios do compliance trabalhista</h2>
            <ul>
              <li>Redução drástica de passivo oculto;</li>
              <li>Maior segurança jurídica na contratação de prestadores e CLT;</li>
              <li>Melhoria do clima organizacional e alinhamento com a legislação vigente.</li>
            </ul>
          `,
          status: 'DRAFT',
          seoTitle: 'Auditoria Trabalhista Preventiva para Empresas | Artigo',
          seoDesc: 'Entenda os benefícios do Direito Trabalhista preventivo para a longevidade dos negócios.',
        },
        {
          title: 'Conta do Instagram desativada por engano: quais os meus direitos?',
          slug: 'conta-instagram-desativada-por-engano-direitos',
          excerpt: 'Entenda como o Código de Defesa do Consumidor e o Marco Civil da Internet protegem usuários contra bloqueios arbitrários das redes sociais.',
          content: `
            <p>Milhares de usuários sofrem bloqueios e desativações sumárias todos os dias, frequentemente com mensagens genéricas alegando violação de diretrizes.</p>
            <h2>O direito à ampla defesa e ao devido processo</h2>
            <p>Os tribunais brasileiros têm firmado entendimento de que as grandes plataformas de tecnologia não podem simplesmente banir perfis sem apresentar a fundamentação clara e específica da violação, concedendo ao usuário o direito de resposta.</p>
            <h2>Ação com pedido liminar</h2>
            <p>Quando a notificação administrativa não surte efeito, a ação judicial com pedido de liminar surge como remédio cabível para determinar a reativação do perfil sob pena de multa diária.</p>
          `,
          status: 'DRAFT',
          seoTitle: 'Conta do Instagram desativada: direitos e soluções legais',
          seoDesc: 'Saiba como agir perante a desativação injusta de perfis em redes sociais.',
        },
      ],
    })
    console.log('✓ Artigos de exemplo inseridos.')
  }

  // 13. Páginas Legais (Política de Privacidade e Termos de Uso)
  await prisma.legalPage.upsert({
    where: { slug: 'politica-de-privacidade' },
    update: {},
    create: {
      slug: 'politica-de-privacidade',
      title: 'Política de Privacidade',
      content: `
        <h2>1. Informações Gerais</h2>
        <p>A presente Política de Privacidade contém informações sobre a coleta, uso, armazenamento, tratamento e proteção dos dados pessoais dos usuários do site de <strong>Vanessa Rodrigues Advogada</strong>, com a finalidade de demonstrar absoluta transparência quanto ao assunto e esclarecer a todos os interessados sobre os tipos de dados que são coletados, os motivos da coleta e a forma como os usuários podem gerenciar ou solicitar a exclusão de suas informações.</p>
        <h2>2. Coleta de Dados e Finalidade</h2>
        <p>Os dados coletados neste site (nome, número de WhatsApp e descrição da mensagem) são fornecidos voluntariamente pelo usuário através dos formulários de contato e triagem. Essas informações destinam-se exclusivamente para:</p>
        <ul>
          <li>Possibilitar o primeiro contato e a triagem inicial da situação jurídica relatada;</li>
          <li>Direcionamento do atendimento via canal oficial de WhatsApp;</li>
          <li>Cumprimento de obrigações legais e regulatórias da advocacia.</li>
        </ul>
        <h2>3. Consentimento e LGPD</h2>
        <p>Em estrita conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD), o envio de informações através deste website requer a manifestação livre, informada e inequívoca do titular ao concordar com o tratamento de seus dados para as finalidades acima descritas.</p>
        <h2>4. Não Compartilhamento com Terceiros</h2>
        <p>As informações recebidas não são vendidas, alugadas ou compartilhadas com empresas de publicidade ou quaisquer terceiros sem autorização prévia e expressa do titular.</p>
        <h2>5. Direitos do Titular</h2>
        <p>O usuário pode, a qualquer momento, solicitar a confirmação da existência de tratamento, o acesso aos dados, a correção de dados incompletos ou a eliminação dos dados tratados com seu consentimento, através dos canais de contato disponibilizados neste site.</p>
      `,
    },
  })

  await prisma.legalPage.upsert({
    where: { slug: 'termos-de-uso' },
    update: {},
    create: {
      slug: 'termos-de-uso',
      title: 'Termos de Uso',
      content: `
        <h2>1. Caráter Informativo</h2>
        <p>O conteúdo disponibilizado neste website tem caráter meramente informativo, institucional e educacional, não constituindo orientação, parecer ou aconselhamento jurídico formal. A contratação dos serviços advocatícios dar-se-á apenas mediante instrumento contratual próprio e específico.</p>
        <h2>2. Observância ao Código de Ética da OAB</h2>
        <p>A atuação profissional e a comunicação deste website observam rigorosamente os preceitos do Código de Ética e Disciplina da Ordem dos Advogados do Brasil (OAB) e do Provimento nº 205/2021 do Conselho Federal da OAB. Não há garantia ou promessa de êxito em quaisquer demandas ou procedimentos.</p>
        <h2>3. Propriedade Intelectual</h2>
        <p>Todo o conteúdo textual, logotipos, elementos visuais e estrutura gráfica deste site são de titularidade de Vanessa Rodrigues Advogada, sendo vedada a reprodução total ou parcial sem autorização expressa prévia.</p>
        <h2>4. Contato</h2>
        <p>Para dúvidas a respeito destes Termos de Uso, utilize os canais de atendimento disponibilizados no rodapé deste website.</p>
      `,
    },
  })
  console.log('✓ Páginas legais inseridas.')

  console.log('--- SEED CONCLUÍDO COM SUCESSO! ---')
}

main()
  .catch((e) => {
    console.error('Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

