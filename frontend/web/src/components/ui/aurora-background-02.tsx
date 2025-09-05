'use client';
import { cn } from '@/src/lib/utils';
import React, { ReactNode } from 'react';

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackgroundSecond = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          'transition-bg relative flex h-[100vh] flex-col bg-gradient-to-b from-background-900 via-background-800 to-background-900',
          className
        )}
        {...props}
      >
        <div
          className='absolute inset-0 overflow-hidden'
          style={
            {
              '--aurora':
                'repeating-linear-gradient(100deg,#000_10%,#111_15%,#1a1a1a_20%,#222_25%,#000_30%)',
              '--dark-gradient':
                'repeating-linear-gradient(100deg,#000_0%,#000_7%,transparent_10%,transparent_12%,#000_16%)',
              '--white-gradient':
                'repeating-linear-gradient(100deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.05)_7%,transparent_10%,transparent_12%,rgba(255,255,255,0.02)_16%)',

              '--blue-300': '#111',
              '--blue-400': '#0a0a0a',
              '--blue-500': '#000',
              '--indigo-300': '#1a1a1a',
              '--violet-200': '#222',
              '--black': '#000',
              '--white': 'rgba(255,255,255,0.02)',
              '--transparent': 'transparent',
            } as React.CSSProperties
          }
        >
          <div
            //   I'm sorry but this is what peak developer performance looks like // trigger warning
            className={cn(
              `after:animate-aurora pointer-events-none absolute -inset-[10px] [background-image:var(--white-gradient),var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%] opacity-30 blur-[8px] filter will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)] [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] after:[background-size:200%,_100%] after:[background-attachment:fixed] after:mix-blend-screen after:opacity-20 after:content-[""] dark:[background-image:var(--dark-gradient),var(--aurora)] after:dark:[background-image:var(--white-gradient),var(--aurora)]`,

              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
            )}
          ></div>
        </div>
        {children}
      </div>
    </main>
  );
};
