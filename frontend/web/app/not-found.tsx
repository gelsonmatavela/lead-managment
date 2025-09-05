"use client";
import { AnimatedBackground } from "@/src/components/azra-ui/floating-components/animated-background";
import { FloatingParticles } from "@/src/components/azra-ui/floating-components/floating-particles";
import { GlitchText } from "@/src/components/azra-ui/floating-components/glitch-text";
import { Button } from "@/src/components/shadcn-ui/ui/button";
import Logo from "@/src/components/ui/logo";
import { useParams, useRouter } from "next/navigation";
import { type ReactElement, useEffect, useState } from "react";
import React from "react";

const translations = {
  en: {
    pageNotFound: "Page Not Found",
    pageNotFoundDescription:
      "The page you're looking for doesn't exist or has been moved.",
    goBack: "Go Back",
    poweredBy:
      "© 2025 Lead Managment - Remote Work Aproved, All rights reserved.",
    lostInSpace: "Lost in Digital Space",
    findYourWay: "Let's find your way back home",
  },
  pt: {
    pageNotFound: "Página Não Encontrada",
    pageNotFoundDescription:
      "A página que você está procurando não existe ou foi movida.",
    goBack: "Voltar",
    goToDashboard: "Ir para o Dashboard",
    poweredBy:
      "© 2025 Gerenciamento de Líderes - Trabalho Remoto Aprovado, Todos os direitos reservados.",
    lostInSpace: "Perdido no Espaço Digital",
    findYourWay: "Vamos encontrar o caminho de volta para casa",
  },
};

export default function NotFoundPage(): ReactElement {
  const router = useRouter();
  const { locale } = useParams();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const currentLocale = (locale as string) || "en";
  const isValidLocale = currentLocale === "pt" || currentLocale === "en";
  const t =
    translations[
      isValidLocale ? (currentLocale as keyof typeof translations) : "en"
    ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGoBack = () => {
    router.back();
  };
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <FloatingParticles />
      
      <div 
        className="fixed w-96 h-96 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none z-10 transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />
      <div className="relative z-20 flex min-h-screen items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl px-8 py-12 max-w-[600px] w-full rounded-3xl text-center space-y-8 transform hover:scale-105 transition-all duration-500 hover:bg-white/15">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-ping" />
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
            <div className="relative">
              <GlitchText>404</GlitchText>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                  {t.lostInSpace}
                </h1>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-200">
                  {t.pageNotFound}
                </h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md mx-auto">
                {t.findYourWay}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                onClick={handleGoBack}
                className="group relative overflow-hidden bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-full transform transition-all duration-300 hover:scale-110 hover:shadow-2xl"
              >
                <span className="relative z-10">{t.goBack}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </div>
          </div>
          <div className="flex justify-center items-center space-x-8 text-white/60">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-white/40" />
            <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full animate-pulse" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-white/40" />
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-r from-black/80 via-orange-900/80 to-black/80 backdrop-blur-sm border-t border-white/10">
        <div className="text-center py-4 px-4">
          <small className="text-xs text-gray-300 font-medium">
            {t.poweredBy}
          </small>
        </div>
      </div>
    </div>
  );
}