import React from 'react';
import { landingData } from '@/data/landingData';
import { Cabecalho } from '@/components/landing/Cabecalho';
import { Heroi } from '@/components/landing/Heroi';
import { Sobre } from '@/components/landing/Sobre';
import { Programacao } from '@/components/landing/Programacao';
import { Informacoes } from '@/components/landing/Informacoes';
import { Localizacao } from '@/components/landing/Localizacao';
import { Duvidas } from '@/components/landing/Duvidas';
import { Rodape } from '@/components/landing/Rodape';

export const metadata = {
  title: 'SECOMPP 2026 · 23ª Semana da Computação da FCT/UNESP',
  description: 'A 23ª Semana do Curso de Ciência da Computação da FCT/UNESP Presidente Prudente. Minicursos práticos, palestras magnas e certificação oficial.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-brand-accent selection:text-black">
      <Cabecalho config={landingData.config} />
      <main className="flex-1">
        <Heroi config={landingData.config} marcas={landingData.marcas} />
        <Sobre cartoes={landingData.sobre} />
        <Programacao conteudo={landingData} />
        <Informacoes lotes={landingData.lotes} config={landingData.config} />
        <Localizacao config={landingData.config} />
        <Duvidas duvidas={landingData.duvidas} config={landingData.config} />
      </main>
      <Rodape marcas={landingData.marcas} config={landingData.config} />
    </div>
  );
}
