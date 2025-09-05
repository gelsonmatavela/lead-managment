'use client';

import React from 'react';

export default function GlobalAnimatedBackground() {
  return (
    <>
      <div className="fixed inset-0 bg-black z-[-100]" />
      
      <div className="fixed inset-0 z-[-99]">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-orange-900/5 via-black to-yellow-900/5 animate-pulse" 
          style={{ animationDuration: '8s' }} 
        />
        
        <div 
          className="absolute inset-0 bg-gradient-to-tl from-amber-900/3 via-transparent to-orange-800/3 opacity-70"
          style={{ 
            animation: 'subtle-drift 15s ease-in-out infinite alternate',
          }} 
        />
        
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-orange-500/2 to-transparent rounded-full blur-3xl"
          style={{ 
            animation: 'gentle-glow 12s ease-in-out infinite alternate',
          }} 
        />
        
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-yellow-500/2 to-transparent rounded-full blur-3xl"
          style={{ 
            animation: 'gentle-glow 10s ease-in-out infinite alternate-reverse',
            animationDelay: '3s'
          }} 
        />
        
        <div 
          className="absolute top-1/3 right-1/3 w-2 h-2 bg-orange-400/20 rounded-full animate-ping"
          style={{ animationDuration: '6s' }} 
        />
        
        <div 
          className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-yellow-400/30 rounded-full animate-ping"
          style={{ animationDuration: '8s', animationDelay: '2s' }} 
        />
        
        <div 
          className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-amber-400/15 rounded-full animate-ping"
          style={{ animationDuration: '10s', animationDelay: '5s' }} 
        />
        
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }} 
        />
      </div>
    </>
  );
}