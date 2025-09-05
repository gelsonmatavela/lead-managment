'use client';

import { LoaderIcon } from 'lucide-react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import React, { RefObject, useRef, useState } from 'react';

const buttonVariants = {
  variant: {
    default: 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-400',
    reverse: 'bg-white hover:bg-zinc-100 data-[selected=true]:bg-zinc-100 text-primary-500',
    destructive: 'bg-red-500 hover:bg-red-600 data-[selected=true]:bg-red-600 text-white',
    outline:
      'border border-primary-500 bg-transparent hover:bg-primary-50 data-[selected=true]:bg-primary-50 text-primary-500',
    flat: 'bg-transparent hover:bg-primary-50 data-[selected=true]:bg-primary-50 text-primary-500',
    secondary:
      'bg-secondary-600 hover:bg-secondary-700 data-[selected=true]:bg-secondary-700 text-white',
    simple: 'bg-white hover:bg-zinc-100 data-[selected=true]:bg-zinc-100 text-zinc-700',
    ghost: 'hover:bg-primary-50 data-[selected=true]:bg-primary-50 text-primary-500',
    link: 'text-primary-500 hover:underline p-0',
  },
  size: {
    default: 'min-h-8 px-4 py-2',
    sm: 'min-h-8 rounded-md px-3 text-xs',
    lg: 'min-h-10 rounded-md px-8',
    icon: 'min-h-9 w-9 p-0',
  },
};

type ButtonVariant = keyof typeof buttonVariants.variant;
type ButtonSize = keyof typeof buttonVariants.size;

export type ButtonProps = {
  isLoading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  ref?: React.RefObject<any>;
  selected?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function Button({
  className,
  onClick = () => {},
  children,
  isLoading = false,
  href,
  type = 'button',
  variant = 'default',
  size = 'default',
  ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null),
  selected,
  ...props
}: ButtonProps) {
  const baseStyles =
    'rounded-md active:opacity-80 items-center justify-center flex gap-2 disabled:bg-zinc-400 disabled:active:opacity-100 transition-colors disabled:text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 relative cursor-pointer ';

  const variantStyles = buttonVariants.variant[variant];
  const sizeStyles = buttonVariants.size[size];

  const [buttonWidth, setButtonWidth] = useState<number>();

  if (href)
    return (
      <Link
        data-selected={selected}
        href={href}
        ref={ref as RefObject<HTMLAnchorElement>}
        onClick={onClick}
        {...props}
        style={{ width: isLoading ? buttonWidth! : '' }}
        className={twMerge(baseStyles, variantStyles, sizeStyles, className)}
      >
        {isLoading ? <LoaderIcon className='animate-spin w-4' /> : children}
      </Link>
    );

  return (
    <button
      data-selected={selected}
      type={type}
      ref={ref as RefObject<HTMLButtonElement>}
      onClick={onClick}
      {...props}
      style={{ width: isLoading ? buttonWidth! : '' }}
      disabled={isLoading || props.disabled}
      className={twMerge(baseStyles, variantStyles, sizeStyles, className)}
    >
      {isLoading ? <LoaderIcon className='animate-spin w-4' /> : children}
    </button>
  );
}
