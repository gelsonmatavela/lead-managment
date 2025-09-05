"use client"
import { useEffect, useState } from "react";

export  const FloatingParticles = () => {
  const [particles, setParticles] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const generatedParticles = Array.from({ length: 15 }, (_, i) => (
      <div
        key={i}
        className='absolute w-1 h-1 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full opacity-40 animate-bounce'
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 4}s`,
          animationDuration: `${3 + Math.random() * 4}s`,
        }}
      />
    ));
    setParticles(generatedParticles);
  }, []);

  return <div className='absolute inset-0 overflow-hidden pointer-events-none'>{particles}</div>;
};