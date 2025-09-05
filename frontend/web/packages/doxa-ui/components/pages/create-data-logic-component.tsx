'use client';

import { camelCase } from 'change-case-all';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { usePathname } from 'next/navigation';
import api from '@/src/utils/hooks/api.hooks';
import { singular } from 'pluralize';
// import { useSelector } from "react-redux";

/**
 * Props for the CreateDataLogicComponent
 */
type CreateDataLogicComponentProps = {
  /** Optional ID for the component */
  id?: string;
  /** Name identifier used to generate the API mutation name if not provided */
  name: string;
  /** Form component to render for data creation */
  Form: (props: any) => React.JSX.Element;
  /**
   * Redux API mutation name (e.g., 'useCreateProductMutation')
   * If not provided, will be generated as `useCreate${pascalCase(name)}Mutation`
   */
  createMutation?: string;
  /** Flag to show alert after successful creation */
  showAlertAfterSuccessCreate?: boolean;
  /** Callback function executed after successful data creation */
  doAfterSuccessCreate?: (x: {
    response: any;
    data: any;
    form: UseFormReturn;
  }) => Promise<any> | void;
  /** Function to transform form data before submission */
  cleanDataBeforeCreate?: (data: any) => void;
  /** CSS class name for the component */
  className?: string;
  /** Buttons to be displayed in the top-right corner */
  topButtons?: React.ReactNode;
  /** Props specific to the form component */
  formProps: {
    /** Label for the form's submit button */
    buttonLabel: string;
    /** Optional CSS class name for the form */
    className?: string;
    /** Flag to maintain loading state after submission */
    keepIsLoading?: boolean;
    /** Additional data to be passed to the form */
    requiredData?: Record<string, any>;
    /** Zod schema for form validation */
    schema: z.ZodObject<any> | z.ZodEffects<z.ZodObject<any>>;
  };
};

/**
 * A generic component that handles data creation logic using Redux API mutations
 * Manages form submission, data transformation, and post-creation callbacks
 * Also supports template-based default values from Redux state
 *
 * @param props Component props
 * @returns A form component with data creation capabilities
 *
 * @example
 * ```tsx
 * <CreateDataLogicComponent
 *   name="product"
 *   Form={ProductForm}
 *   formProps={{
 *     buttonLabel: "Create Product",
 *     schema: productSchema
 *   }}
 * />
 * ```
 */
export default function CreateDataLogicComponent({
  name,
  Form,
  createMutation,
  doAfterSuccessCreate,
  cleanDataBeforeCreate = (data) => data,
  formProps,
}: CreateDataLogicComponentProps) {
  // Dynamically access the create mutation from the API slice
  const { mutateAsync: createData, ...state } = api[camelCase(singular(name))].useCreateOne();
  const pathname = usePathname();

  /**
   * Handles form submission and data creation
   * @param data The form data to be submitted
   * @param form The react-hook-form form instance
   * @returns The API response or error
   */
  async function handleCreateData(data: z.infer<typeof formProps.schema>, form: UseFormReturn) {
    const cleanedData = cleanDataBeforeCreate(data);

    try {
      const response = await createData(cleanedData);

      doAfterSuccessCreate && (await doAfterSuccessCreate({ response, data: cleanedData, form }));

      form.reset();
      return response;
    } catch (err) {
      return err;
    }
  }

  const listHref = pathname.split('/');
  listHref.pop();

  return <Form {...state} {...formProps} onSubmit={handleCreateData} />;
}
