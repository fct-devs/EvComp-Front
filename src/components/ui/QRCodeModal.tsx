'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './buffer-polyfill';
// @ts-ignore
import { authenticator } from '@otplib/preset-browser';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  atividadeId: number;
  participanteId: number;
  secretSeed: string;
}

export function QRCodeModal({ isOpen, onClose, atividadeId, participanteId, secretSeed }: QRCodeModalProps) {
  const [totp, setTotp] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(15);

  useEffect(() => {
    if (!isOpen || !secretSeed) return;

    // Configurar otplib para 15 segundos
    authenticator.options = { step: 15 };

    const updateTotp = () => {
      const code = authenticator.generate(secretSeed);
      setTotp(code);
      const remaining = authenticator.timeRemaining();
      setTimeLeft(remaining);
    };

    updateTotp();
    const interval = setInterval(updateTotp, 1000);

    return () => clearInterval(interval);
  }, [isOpen, secretSeed]);

  if (!isOpen) return null;

  const qrPayload = JSON.stringify({
    a: atividadeId,
    p: participanteId,
    t: totp
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-brand-accent/50 rounded-2xl shadow-2xl shadow-brand-accent/20 w-full max-w-sm p-6 relative overflow-hidden">
        
        {/* Anti-Print Watermark/Radar Animation */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="w-[200%] h-[200%] absolute -top-[50%] -left-[50%] border-[2px] border-brand-accent rounded-full animate-[ping_3s_linear_infinite]" />
            <div className="w-[100%] h-[100%] absolute top-0 left-0 border-[1px] border-white/20 rounded-full animate-[ping_2s_linear_infinite]" />
        </div>

        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-xl font-bold text-white">Ingresso da Atividade</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex flex-col items-center justify-center relative z-10 space-y-6">
          <div className="p-4 bg-white rounded-xl relative">
            <QRCodeSVG value={qrPayload} size={200} level="H" />
            
            {/* Countdown Overlay on QR Edge */}
            <div className="absolute -inset-2 border-4 border-brand-accent/30 rounded-2xl">
               <div 
                 className="h-full bg-brand-accent/20 rounded-xl transition-all duration-1000 ease-linear"
                 style={{ height: `${(timeLeft / 15) * 100}%` }}
               />
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">Se não conseguir ler o QR Code, informe o PIN:</p>
            <div className="text-4xl font-mono font-bold tracking-widest text-brand-accent bg-black/50 py-2 px-6 rounded-lg border border-white/10 shadow-inner">
              {totp}
            </div>
            <p className="text-xs text-brand-accent mt-3 animate-pulse">Atualiza em {timeLeft}s</p>
          </div>
        </div>
      </div>
    </div>
  );
}
