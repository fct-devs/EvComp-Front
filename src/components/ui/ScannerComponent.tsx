'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScannerProps {
  onScan: (decodedText: string) => void;
  paused: boolean;
}

export function ScannerComponent({ onScan, paused }: ScannerProps) {
  const [error, setError] = useState('');
  const html5QrCodeRef = useRef<any>(null);
  const pausedRef = useRef(paused);

  // Mantém a ref sincronizada com a prop para o callback do scanner ter sempre a versão mais recente
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isMounted = true;
    const { Html5Qrcode } = require('html5-qrcode');

    // Timeout de 300ms para evitar o problema de concorrência do React Strict Mode
    // (Onde ele monta e desmonta instantaneamente)
    const timeoutId = setTimeout(async () => {
      if (!isMounted) return;

      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode("qr-reader");
      }

      try {
        await html5QrCodeRef.current.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText: string) => {
            if (!pausedRef.current && isMounted) {
              onScan(decodedText);
            }
          },
          () => {} // Ignora erros de frame vazio
        );
      } catch (err) {
        console.error("Camera falhou", err);
        if (isMounted) setError("Não foi possível acessar a câmera. Verifique as permissões do navegador.");
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="relative w-full max-w-sm mx-auto flex flex-col items-center">
      {error && (
        <div className="bg-red-500/20 text-red-200 p-2 mb-4 rounded text-sm text-center">
          {error}
        </div>
      )}
      
      {/* Scanner container */}
      <div 
        id="qr-reader" 
        className={`w-full overflow-hidden rounded-2xl border-4 ${paused ? 'border-amber-500/50' : 'border-brand-accent/50'} shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-colors duration-300`}
        style={{ minHeight: '300px', backgroundColor: 'black' }}
      ></div>

      {paused && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl">
          <p className="text-amber-400 font-bold tracking-widest animate-pulse">PROCESSANDO...</p>
        </div>
      )}

      {/* Decorative overlay when not paused */}
      {!paused && (
        <div className="absolute inset-0 pointer-events-none opacity-50 z-10">
          <div className="w-full h-1 bg-brand-accent shadow-[0_0_10px_#3b82f6] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ top: '50%', position: 'absolute' }}></div>
        </div>
      )}
    </div>
  );
}
