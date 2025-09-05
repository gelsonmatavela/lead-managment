import React from "react";
import "./[locale]/globals.css";
import { Metadata } from "next";
import GlobalAnimatedBackground from "@/src/components/azra-ui/floating-components/layout-animated-background";

export const metadata: Metadata = {
  title: {
    default: "Lead Managment System",
    template: "%s |Lead Managment System",
  },
  description: "Gerenciamento de Conteúdos",

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-32x32.png",
  },
  manifest: "/site.webmanifest",

  openGraph: {
    title: "Lead Managment System",
    description: "Gerenciamento de Conteúdos",
    url: "http://leadmanagment.local",
    type: "website",
    images: [
      {
        url: "http://leadmanagment.local/images/logo.webp",
        width: 1200,
        height: 630,
        alt: "Lead Managment System | SimplicitY",
      },
    ],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <html lang={locale} className="">
      <head>
        <title>Pedizani</title>
        <link rel="icon" href="favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        
        {/* CSS das animações */}
        <style>{`
          @keyframes subtle-drift {
            0% { transform: translateX(0px) translateY(0px) rotate(0deg); }
            33% { transform: translateX(10px) translateY(-5px) rotate(1deg); }
            66% { transform: translateX(-5px) translateY(10px) rotate(-0.5deg); }
            100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
          }
          
          @keyframes gentle-glow {
            0% { 
              opacity: 0.3; 
              transform: scale(1) translateX(0px); 
            }
            50% { 
              opacity: 0.6; 
              transform: scale(1.1) translateX(20px); 
            }
            100% { 
              opacity: 0.3; 
              transform: scale(1) translateX(0px); 
            }
          }
          
          .bg-gradient-radial {
            background: radial-gradient(circle, var(--tw-gradient-stops));
          }
          
          /* Smooth transitions para todos os elementos */
          * {
            transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
          }
        `}</style>
      </head>
      <body className="overflow-x-hidden relative">
        <GlobalAnimatedBackground />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}