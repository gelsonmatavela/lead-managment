import React from 'react';

export default function PageTitleAndDescription({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className='flex justify-between items-center'>
      <div>
        <h2 className='font-bold md:text-2xl text-xl text-zinc-700 line-clamp-1'>{title}</h2>
        {description && <p className='text-zinc-600 line-clamp-1'>{description}</p>}{' '}
      </div>
    </div>
  );
}
