'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { type Marca, type Config } from '@/data/landingData';

export function Rodape({ marcas, config }: { marcas: Marca[]; config: Config }) {
  const apoios = marcas.filter((m) => m.categoria === 'apoio');
  const patrocinios = marcas.filter((m) => m.categoria === 'patrocinio');

  return (
    <footer id="apoio" className="bg-black border-t border-white/10 pt-16 pb-12 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Seção de Patrocínio e Apoio */}
        <div className="space-y-16 pb-16 border-b border-white/10">
          {/* Patrocínio */}
          {patrocinios.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-center text-gray-400 mb-8">
                Patrocínio
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 max-w-6xl mx-auto">
                {patrocinios.map((m) => (
                  <a
                    key={m.id}
                    href={m.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-85 hover:opacity-100 transition-all transform hover:scale-105 flex items-center justify-center p-1 shrink-0"
                    title={m.nome}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.logoSrc}
                      alt={m.nome}
                      loading="lazy"
                      className={`object-contain h-9 sm:h-11 w-auto transition-all ${
                        m.tamanho === 'lg' ? 'max-w-[150px]' : m.tamanho === 'md' ? 'max-w-[120px]' : 'max-w-[90px]'
                      }`}
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Apoio */}
          {apoios.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-center text-gray-400 mb-8">
                Apoio
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 md:gap-x-9 gap-y-6 max-w-6xl mx-auto">
                {apoios.map((m) => (
                  <a
                    key={m.id}
                    href={m.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-85 hover:opacity-100 transition-all transform hover:scale-105 flex items-center justify-center p-1 shrink-0"
                    title={m.nome}
                  >
                    {m.logoSrc ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={m.logoSrc}
                        alt={m.nome}
                        loading="lazy"
                        className={`object-contain h-8 sm:h-10 w-auto transition-all ${
                          m.tamanho === 'lg' ? 'max-w-[140px]' : m.tamanho === 'md' ? 'max-w-[110px]' : 'max-w-[80px]'
                        }`}
                      />
                    ) : (
                      <span className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/15 text-gray-200 font-medium text-xs hover:border-brand-accent transition-colors">
                        {m.nome}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Informações Institucionais & Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 border-b border-white/10 text-sm">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/secompp26-logo.png"
                alt="SECOMPP 2026"
                className="h-9 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-gray-400 max-w-md leading-relaxed">
              {config.nomeCompleto}. Realização conjunta entre Comissão Organizadora da SECOMPP, Departamento de Matemática e Computação (DMC) e FCT/UNESP.
            </p>
            <p className="text-xs text-gray-500">
              {config.endereco.join(', ')}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Navegação</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#sobre" className="hover:text-brand-accent transition-colors">Sobre o Evento</a></li>
              <li><a href="#programacao" className="hover:text-brand-accent transition-colors">Programação dos 5 Dias</a></li>
              <li><a href="#ingressos" className="hover:text-brand-accent transition-colors">Passes e Inscrições</a></li>
              <li><a href="#localizacao" className="hover:text-brand-accent transition-colors">Localização & Mapa</a></li>
              <li><a href="#duvidas" className="hover:text-brand-accent transition-colors">Perguntas Frequentes</a></li>
              <li><Link href="/login" className="hover:text-brand-accent transition-colors">Área do Participante</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Legal & LGPD</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/termos" className="hover:text-brand-accent transition-colors font-medium text-gray-300">
                  Termos de Serviço e Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="hover:text-brand-accent transition-colors font-medium text-gray-300">
                  Política de Privacidade & LGPD
                </Link>
              </li>
              <li>
                <span className="text-gray-500">Contato Oficial / DPO:</span><br />
                <a href={`mailto:${config.contatoEmail}`} className="text-brand-accent font-semibold hover:underline">
                  {config.contatoEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha Final de Copyright & Créditos */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {config.ano} SECOMPP · FCT/UNESP Presidente Prudente. Todos os direitos reservados.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-gray-400">
            <span>
              Homepage baseada no projeto open-source{' '}
              <a
                href="https://github.com/cacic-fct/secompp-site"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-brand-accent underline transition-colors"
              >
                secompp-site
              </a>{' '}
              (CACiC FCT)
            </span>
            <span className="hidden sm:inline">·</span>
            <span>
              Sistema de inscrições powered by{' '}
              <a
                href="https://github.com/fct-devs/EvComp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-accent font-semibold hover:underline"
              >
                EvComp
              </a>{' '}
              (fct-devs)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
