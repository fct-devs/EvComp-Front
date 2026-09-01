'use client';

import React from 'react';
import { type Config } from '@/data/landingData';

export function Localizacao({ config }: { config: Config }) {
  return (
    <section id="localizacao" className="py-20 md:py-28 bg-slate-950/80 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-accent mb-3">
            Onde Acontece
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Localização e Como Chegar
          </p>
          <p className="mt-4 text-sm sm:text-base text-gray-400">
            A 23ª SECOMPP acontecerá no campus da FCT/UNESP em Presidente Prudente - SP.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Informações de Acesso */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-3xl bg-slate-900 border border-white/10 shadow-xl space-y-6">
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-xs font-semibold mb-3">
                  <span className="w-2 h-2 rounded-full bg-brand-accent"></span>
                  Campus Universitário
                </div>
                <h3 className="text-2xl font-bold text-white">
                  FCT – Faculdade de Ciências e Tecnologia
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Universidade Estadual Paulista "Júlio de Mesquita Filho" (UNESP)
                </p>
              </div>

              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-brand-accent mt-0.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-white block">Endereço Oficial:</strong>
                    <span>Rua Roberto Simonsen, 305</span><br />
                    <span>Centro Educacional, Pres. Prudente - SP</span><br />
                    <span className="text-xs text-gray-400">CEP: 19060-900</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-brand-accent mt-0.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-white block">Espaços do Evento:</strong>
                    <ul className="text-xs text-gray-400 space-y-1 mt-1 list-disc pl-4">
                      <li><strong className="text-gray-200">Auditório do Bloco V:</strong> Palestras Magnas e Mesa-Redonda</li>
                      <li><strong className="text-gray-200">Discente I (Lab. 06 e Lab. 10):</strong> Minicursos práticos em computadores</li>
                      <li><strong className="text-gray-200">Prédio Central (Salas 5B e 6B):</strong> Workshops e minicursos</li>
                      <li><strong className="text-gray-200">Anfiteatro 1:</strong> Workshop Sebrae</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-brand-accent mt-0.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-white block">Contato da Organização:</strong>
                    <a href={`mailto:${config.contatoEmail}`} className="text-brand-accent hover:underline text-xs">
                      {config.contatoEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <a
                href="https://maps.app.goo.gl/3qwZ91QkczUBv19w9"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Abrir no Google Maps</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* Iframe do Mapa */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-white/10 shadow-2xl min-h-[380px] bg-slate-900 relative">
            <iframe
              src={config.mapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa do Campus FCT/UNESP Presidente Prudente"
              className="w-full h-full rounded-3xl grayscale-[30%] hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
