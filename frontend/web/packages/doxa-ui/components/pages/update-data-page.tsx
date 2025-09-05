'use client';

import React, { useContext, useEffect } from 'react';
import { z } from 'zod';
import { useParams, usePathname } from 'next/navigation';
import UpdateDataComponent from './update-data-logic-component';
import { AppContext } from '@/src/utils/contexts/app.context';

type UpdateDataComponentProps<DataType> = {
  id?: string | number;
  name: string;
  Form: (props: any) => React.JSX.Element;
  updateMutation?: string;
  title?: string;
  description?: string;
  keepIsLoading?: boolean;
  requiredData?: Record<string, any>;
  showAlertAfterSuccessUpdate?: boolean;
  doAfterSuccessUpdate?: (x: any) => Promise<any> | any;
  cleanDataBeforeUpdate?: (data: any) => any;
  className?: string;
  schema: z.ZodObject<any> | z.ZodEffects<z.ZodObject<any>>;
  topButtons?: any;
  formProps: {
    buttonLabel: string;
    className?: string;
  };
};

export default function UpdateDataPage<DataType>({
  name,
  title,
  description,
  keepIsLoading,
  requiredData,
  schema,
  formProps,
  topButtons,
  ...props
}: UpdateDataComponentProps<DataType>) {
  const { id } = useParams();
  const pathname = usePathname();
  const listHref = pathname.split('/');
  listHref.pop();
  listHref.pop();

  const { dispatch } = useContext(AppContext);

  // Setting up the current page title on the navbar
  useEffect(() => {
    dispatch({ type: 'set-page-title', payload: { title } });
  }, [title]);

  return (
    <div className=''>
      <div className='flex justify-between items-center'>
        {/* <div>
          <h2 className='font-bold text-2xl'>{title}</h2>
          <p className='text-zinc-600'>{description}</p>
        </div> */}
        {/* <div className='ml-auto'>
          {!topButtons ? (
            <Button href={`${listHref.join('/')}`}>
              <ListIcon size={18} />
              <span>Listar {plural(kebabCase(name))}</span>
            </Button>
          ) : (
            topButtons.map((button: React.ReactNode, i: number) => <div key={i}>{button}</div>)
          )}
        </div> */}
      </div>
      <div className='main-container md:h-[calc(100vh-104px)] h-[calc(100vh-86px)]'>
        <div className='main-container-content'>
          <UpdateDataComponent
            {...props}
            id={id as string}
            name={name}
            formProps={{
              ...formProps,
              keepIsLoading: keepIsLoading,
              requiredData: requiredData,
              schema: schema,
            }}
          />
        </div>
      </div>
    </div>
  );
}
