import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { GlassCard } from '@/components/ui/Core';

export const metadata = {
  title: 'Política de Privacidade & LGPD · SECOMPP 2026',
  description: 'Política de Privacidade, Proteção de Dados e Conformidade com a Lei Geral de Proteção de Dados (LGPD) da 23ª SECOMPP / FCT UNESP.',
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto py-12 px-6 relative z-10">
        <GlassCard className="p-8 sm:p-12 bg-slate-900/80 border border-white/10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
              Conformidade LGPD (Lei nº 13.709/2018)
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Política de Privacidade e Proteção de Dados
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              SECOMPP 2026 · Faculdade de Ciências e Tecnologia (FCT/UNESP)
            </p>
          </div>

          <div className="space-y-6 text-sm sm:text-base text-gray-300 leading-relaxed font-light">
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-white border-b border-white/10 pb-2">
                1. Compromisso com a sua Privacidade
              </h2>
              <p>
                A Comissão Organizadora da <strong>23ª SECOMPP</strong> e o Departamento de Matemática e Computação (DMC) da FCT/UNESP prezam pela segurança, transparência e privacidade dos dados de todos os participantes. Esta política descreve como tratamos suas informações em total consonância com a <strong>Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018)</strong>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-white border-b border-white/10 pb-2">
                2. Princípio da Minimização: Quais Dados Coletamos?
              </h2>
              <p>
                Seguindo o princípio da necessidade e minimização de dados (Art. 6º, III da LGPD), coletamos <strong>estritamente as informações indispensáveis</strong> para a realização do evento:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>
                  <strong className="text-white">Nome Completo:</strong> Utilizado exclusivamente para identificar o participante na lista de presença e confeccionar o Certificado Oficial de Participação emitido pela UNESP.
                </li>
                <li>
                  <strong className="text-white">E-mail:</strong> Utilizado como chave de login no sistema, comunicação de avisos importantes da grade e envio de notificações sobre sua inscrição.
                </li>
                <li>
                  <strong className="text-white">Senha:</strong> Criptografada no banco de dados através de algoritmo de hash irreversível (BCrypt). Ninguém da organização tem acesso à sua senha.
                </li>
                <li>
                  <strong className="text-white">Registro Acadêmico (RA):</strong> Opcional, utilizado apenas para vincular a participação de discentes da UNESP aos registros de extensão da faculdade.
                </li>
                <li>
                  <strong className="text-white">Comprovante de Pagamento:</strong> Arquivo de imagem enviado voluntariamente pelo participante para validação manual da modalidade de inscrição junto ao extrato da FUNDACTE.
                </li>
              </ul>
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs sm:text-sm">
                🔒 <strong>Importante:</strong> O EvComp <strong>NÃO coleta CPF, dados bancários, números de cartão de crédito nem dados sensíveis de rastreamento</strong>.
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-white border-b border-white/10 pb-2">
                3. Finalidade e Base Legal do Tratamento
              </h2>
              <p>
                O tratamento de seus dados pessoais ocorre com base no <strong>Art. 7º, V (execução de contrato/serviço acadêmico)</strong> e <strong>Art. 7º, I (consentimento expresso do titular)</strong> da LGPD, destinando-se unicamente a:
              </p>
              <ol className="list-decimal pl-6 space-y-1 text-gray-300">
                <li>Gerenciar o controle de vagas nos laboratórios e salas;</li>
                <li>Registrar presença durante os minicursos e palestras;</li>
                <li>Gerar e autenticar os certificados digitais da UNESP;</li>
                <li>Prestar suporte ao participante em caso de dúvidas.</li>
              </ol>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-white border-b border-white/10 pb-2">
                4. Compartilhamento de Dados com Terceiros
              </h2>
              <p>
                Seus dados pessoais <strong>NUNCA são vendidos, alugados ou compartilhados com empresas parceiras, patrocinadores ou quaisquer terceiros com fins comerciais</strong>. Os dados de inscrição permanecem restritos aos servidores seguros da infraestrutura FCT-DTI da UNESP.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-white border-b border-white/10 pb-2">
                5. Armazenamento e Segurança da Informação
              </h2>
              <p>
                Todos os dados são transmitidos com criptografia SSL/TLS (HTTPS) de ponta a ponta e armazenados em containers isolados no servidor institucional da FCT/UNESP, com proteção ativa de firewall e mitigação de acessos não autorizados.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-white border-b border-white/10 pb-2">
                6. Direitos do Titular dos Dados
              </h2>
              <p>
                Nos termos do Art. 18 da LGPD, você tem direito a solicitar a qualquer momento a confirmação da existência de tratamento, acesso aos seus dados, correção de dados incompletos ou a exclusão de sua conta após o término e validação dos certificados da edição vigente.
              </p>
              <p>
                Para exercer seus direitos ou tirar dúvidas de privacidade, entre em contato com o canal oficial da organização:
                <br />
                <a href="mailto:secompp.fct@unesp.br" className="text-brand-accent font-semibold hover:underline">
                  secompp.fct@unesp.br
                </a>
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
              href="/termos"
              className="text-sm font-semibold text-brand-accent hover:underline"
            >
              Ver Termos de Serviço →
            </Link>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
