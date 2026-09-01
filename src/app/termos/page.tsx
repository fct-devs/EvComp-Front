import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { GlassCard } from '@/components/ui/Core';

export const metadata = {
  title: 'Termos de Serviço e Uso · SECOMPP 2026',
  description: 'Termos de Serviço, Regras de Inscrição e Conduta da 23ª Semana da Computação da FCT/UNESP.',
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto py-12 px-6 relative z-10">
        <GlassCard className="p-8 sm:p-12 bg-slate-900/80 border border-white/10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-xs font-semibold mb-3">
              Documento Oficial
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Termos de Serviço e Uso
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              Última atualização: Setembro de 2026 · 23ª SECOMPP (FCT/UNESP)
            </p>
          </div>

          <div className="space-y-6 text-sm sm:text-base text-gray-300 leading-relaxed font-light">
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-white border-b border-white/10 pb-2">
                1. Disposições Gerais
              </h2>
              <p>
                A <strong>23ª Semana do Curso de Ciência da Computação da FCT/UNESP (SECOMPP 2026)</strong> é um evento acadêmico-científico organizado pela Comissão Organizadora da SECOMPP em conjunto com o Departamento de Matemática e Computação (DMC) da Faculdade de Ciências e Tecnologia da Universidade Estadual Paulista (FCT/UNESP), campus de Presidente Prudente - SP.
              </p>
              <p>
                Ao criar uma conta ou se inscrever em qualquer atividade por meio da plataforma <strong>EvComp</strong>, você concorda expressamente com os presentes Termos de Serviço.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-white border-b border-white/10 pb-2">
                2. Inscrições e Vagas em Minicursos
              </h2>
              <p>
                2.1. O participante é responsável pela exatidão dos dados fornecidos no cadastro, em especial o <strong>Nome Completo</strong>, que constará no Certificado Oficial emitido pela UNESP.
              </p>
              <p>
                2.2. As vagas para minicursos nos laboratórios e salas são estritamente limitadas para garantir a qualidade pedagógica. A confirmação da vaga no minicurso está condicionada à aprovação do pagamento da modalidade correspondente.
              </p>
              <p>
                2.3. O sistema EvComp impede a inscrição em minicursos com choque de horários. Caso o participante deseje alterar de minicurso, a troca dependerá da disponibilidade de vagas no momento da solicitação.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-white border-b border-white/10 pb-2">
                3. Pagamento e Confirmação
              </h2>
              <p>
                3.1. Os pagamentos das inscrições são recolhidos diretamente pela <strong>FUNDACTE (Fundação de Ciência Tecnologia e Ensino)</strong> por meio de chave PIX oficial.
              </p>
              <p>
                3.2. A confirmação da inscrição ocorre mediante conferência do comprovante enviado pelo participante no sistema. Não nos responsabilizamos por comprovantes ilegíveis ou com dados divergentes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-white border-b border-white/10 pb-2">
                4. Emissão de Certificados e Presença
              </h2>
              <p>
                4.1. A emissão do certificado digital com carga horária oficial da UNESP exige a validação da presença do participante pelo coletor oficial do evento (via QR Code/RA).
              </p>
              <p>
                4.2. Os certificados estarão disponíveis para download na Área do Participante após a conclusão do evento e encerramento das atas de presença.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-white border-b border-white/10 pb-2">
                5. Código de Conduta e Convivência
              </h2>
              <p>
                A SECOMPP é um ambiente inclusivo, acadêmico e respeitoso. Não será tolerada qualquer forma de discriminação, assédio moral ou desrespeito a colegas, ministrantes, palestrantes ou membros da comissão organizadora. A organização reserva-se o direito de revogar a inscrição do participante em caso de infração grave.
              </p>
            </section>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/"
              className="text-sm font-semibold text-gray-400 hover:text-white transition-colors"
            >
              ← Voltar para a Página Inicial
            </Link>
            <Link
              href="/privacidade"
              className="text-sm font-semibold text-brand-accent hover:underline"
            >
              Ver Política de Privacidade & LGPD →
            </Link>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
