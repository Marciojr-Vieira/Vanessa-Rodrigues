import { ArrowLeft } from 'lucide-react'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Logo } from '@/components/shared/Logo'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-24 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex justify-center mb-6">
          <Logo href="/" />
        </div>

        <p className="eyebrow">Erro 404</p>
        <h1 className="heading-serif text-4xl sm:text-5xl text-[#F4EFEA]">
          Página não encontrada
        </h1>

        <p className="text-sm text-[#A8A19A] leading-relaxed">
          O endereço acessado não existe ou foi modificado. Utilize os links de navegação para retornar ao site.
        </p>

        <div className="pt-4 flex justify-center">
          <ButtonLink href="/" variant="primary" size="md" icon={<ArrowLeft className="w-4 h-4" />}>
              Retornar à página inicial
            </ButtonLink>
        </div>
      </div>
    </div>
  )
}
