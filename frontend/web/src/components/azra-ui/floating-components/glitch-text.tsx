"use client"

export const GlitchText = ({ children }: { children: string }) => (
  <div className="relative inline-block">
    <span className="text-8xl md:text-9xl font-black bg-gradient-to-r from-pink-400 via-orange-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
      {children}
    </span>
    <span className="absolute top-0 left-0 text-8xl md:text-9xl font-black text-red-500 opacity-70 animate-ping" style={{ animationDelay: '0.1s', clipPath: 'inset(0 0 95% 0)' }}>
      {children}
    </span>
    <span className="absolute top-0 left-0 text-8xl md:text-9xl font-black text-cyan-400 opacity-70 animate-ping" style={{ animationDelay: '0.2s', clipPath: 'inset(85% 0 0 0)' }}>
      {children}
    </span>
  </div>
);

export const GlowingInputWrapper = ({
  children,
  isFocused,
}: {
  children: React.ReactNode;
  isFocused: boolean;
}) => (
  <div className={`relative transition-all duration-300 ${isFocused ? 'transform scale-105' : ''}`}>
    {isFocused && (
      <div className='absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-lg blur opacity-75 animate-pulse' />
    )}
    <div className='relative'>{children}</div>
  </div>
);