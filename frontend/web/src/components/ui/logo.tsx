import Image from 'next/image';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export default function Logo({
  width =600,
  height =600,
  theme = 'light',
  className,
  ...props
}: {
  width?: number;
  height?: number;
  className?: string;
  theme?: 'light' | 'dark';
} & React.HTMLAttributes<HTMLImageElement>) {
  return (
    <Image
      className={twMerge('h-[50px] object-contain ', className)}
      src={theme === 'light' ? '/logotipo/Leader Manangment Full.png' : '/logotipo/Leader Manangment Full.png'}
      width={width}
      height={height}
      {...props}
      alt='logo'
    />
  );
}
