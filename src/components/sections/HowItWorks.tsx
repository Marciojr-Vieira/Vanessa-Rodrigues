'use client'

import React from 'react'

interface StepItem {
  id: string
  step: number
  title: string
  description: string
}

interface HowItWorksProps {
  steps?: StepItem[]
}

export function HowItWorks({ steps }: HowItWorksProps) {
  const defaultSteps = [
    {
      id: '1',
      step: 1,
      title: 'Você informa sua situação',
      description: 'Envie um resumo do ocorrido através do WhatsApp ou formulário de contato com as principais informações do seu caso.',
    },
    {
      id: '2',
      step: 2,
      title: 'As informações passam por uma triagem',
      description: 'Avaliamos a viabilidade técnica inicial da demanda e quais documentos essenciais serão necessários para instrução.',
    },
    {
      id: '3',
      step: 3,
      title: 'O caso poderá ser analisado individualmente',
      description: 'Estudo das medidas judiciais ou extrajudiciais cabíveis, sempre com transparência e clareza sobre riscos e procedimentos.',
    },
    {
      id: '4',
      step: 4,
      title: 'Havendo possibilidade de atendimento, o contato segue pelos canais oficiais',
      description: 'Formalização de contrato de prestação de serviços advocatícios e início dos trâmites com acompanhamento direto.',
    },
  ]

  const displaySteps = steps ?? defaultSteps


  return <section id="como-funciona" className="section-space"><div className="site-container">
    <div className="section-heading"><p className="eyebrow">Etapas transparentes</p><h2 className="heading-serif section-title">Como funciona o atendimento</h2><p>Processo sóbrio, transparente e em total conformidade com as diretrizes éticas da advocacia.</p></div>
    <ol className="steps-list">{displaySteps.map((item,index)=><li key={item.id}><span className="heading-serif">{String(item.step || index+1).padStart(2,'0')}</span><h3 className="heading-serif">{item.title}</h3><p>{item.description}</p></li>)}</ol>
  </div></section>
}
