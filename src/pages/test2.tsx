'use client'; // Adicione isso se estiver usando Next.js App Router

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WaterfallHero: React.FC = () => {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const riverPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. Configura o SVG inicial (escondido)
      if (riverPathRef.current) {
        const length = riverPathRef.current.getTotalLength();
        gsap.set(riverPathRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      }

      // 2. Animação com ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinSectionRef.current, // O elemento que será fixado
          start: "top top",
          end: "+=2000", // Define explicitamente quanto tempo dura o scroll (2000px)
          scrub: 1,      // Suavidade
          pin: true,     // Fixa a seção na tela
          markers: true, // DEBUGER: Se ver linhas verdes/vermelhas, o GSAP carregou
        }
      });

      tl.to(riverPathRef.current, {
        strokeDashoffset: 0,
        ease: "none",
      });

    }, mainContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    // WRAPPER PRINCIPAL:
    // Se o scroll não aparecer, verifique se o arquivo index.css/globals.css 
    // não tem "overflow: hidden" no body ou html.
    <div ref={mainContainerRef} className="w-full bg-slate-900">
      
      {/* SEÇÃO PINADA (Fica fixa enquanto a animação ocorre) */}
      <div 
        ref={pinSectionRef} 
        className="w-full h-screen relative overflow-hidden bg-[#2d3436] flex items-center justify-center"
      >
        <h1 className="absolute top-10 text-white text-3xl z-20">
          Role para ver a água descer
        </h1>

        {/* --- CAMADA DA ÁGUA --- */}
        <svg 
          className="absolute top-0 left-0 w-full h-full z-10"
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
        >
          {/* Caminho da água */}
          <path
            ref={riverPathRef}
            d="M 50,0 C 50,0 20,40 50,60 S 80,100 50,100" 
            fill="none"
            stroke="#4FA4F4"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Elemento de fundo para dar contraste */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black opacity-50 z-0"></div>
      </div>

      {/* ESPAÇO EXTRA EMBAIXO */}
      {/* Esta div existe apenas para garantir que haja espaço para rolar depois que a animação acabar */}
      <div className="w-full h-screen bg-white flex items-center justify-center">
        <p className="text-black text-2xl font-bold">Conteúdo do restante do site...</p>
      </div>

    </div>
  );
};

export default WaterfallHero;