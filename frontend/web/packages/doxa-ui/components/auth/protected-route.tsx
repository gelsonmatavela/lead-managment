import { AuroraBackgroundSecond } from '@/src/components/ui/aurora-background-02';
import Logo from '@/src/components/ui/Logo';
import { useState, useEffect } from 'react';

export function LoadingUserScreen({ isLoading }: { isLoading: boolean }) {
  const [width, setWidth] = useState(5);
  useEffect(() => {
    const interval = setInterval(() => {
      setWidth((prevWidth) => Math.min(prevWidth + 0.5, 100));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuroraBackgroundSecond>
      <div className='h-screen w-full flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4 -mt-40'>
          <Logo
            style={{
              animation: width == 100 ? 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' : '',
            }}
            data-width={width == 100}
            className='md:w-72 h-auto mb-2 '
          />
          <div className='bg-gray-600 rounded-full h-[6px] md:h-[8px] w-[240px]'>
            <div
              className='bg-primary h-full rounded-full transition-all'
              style={{ width: isLoading ? `${width}%` : '100%' }}
            ></div>
          </div>
        </div>
      </div>
    </AuroraBackgroundSecond>
  );
}
