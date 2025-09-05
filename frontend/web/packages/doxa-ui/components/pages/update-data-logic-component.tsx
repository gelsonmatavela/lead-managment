'use client';

import { camelCase } from 'change-case-all';
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import QueryBaseComponent from '@/packages/doxa-ui/components/pages/components/query-base-component';
import { singular } from 'pluralize';
import api from '@/src/utils/hooks/api.hooks';
import { useState } from 'react';

/**
 * Props for the form component rendered by UpdateDataComponent
 */
type FormComponentProps = {
  /** Initial values for the form fields */
  defaultValues?: any;
  /** Form submission handler */
  onSubmit: (data: any, form: UseFormReturn) => void;
  /** Label for the submit button */
  buttonLabel: string;
  /** Optional CSS class name */
  className?: string;
  /** Loading state for the form */
  isLoading?: boolean;
  /** Zod schema for form validation */
  schema: z.ZodObject<any> | z.ZodEffects<z.ZodObject<any>>;
};

/**
 * Props for the UpdateDataComponent
 */
type UpdateDataComponentProps = {
  /** ID of the record to update */
  id?: string | number;
  /** Name identifier used to generate API mutation name if not provided */
  name: string;
  /** Form component to render for data updating */
  Form: (props: FormComponentProps) => React.JSX.Element;
  /**
   * Redux API mutation name (e.g., 'useUpdateProductMutation')
   * If not provided, will be generated as `useUpdate${pascalCase(name)}Mutation`
   */
  updateMutation?: string;
  /** Flag to show alert after successful update */
  showAlertAfterSuccessUpdate?: boolean;
  /** Callback function executed after successful data update */
  doAfterSuccessUpdate?: (x: {
    response: any;
    data: any;
    form: UseFormReturn;
  }) => Promise<any> | void;
  /** Function to transform form data before submission */
  cleanDataBeforeUpdate?: (data: any) => any;
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
  /** Additional parameters passed to QueryBaseComponent for data fetching */
  params?: Record<string, any>;
};

/**
 * A generic component for updating data with form validation and optimized API updates
 *
 * Features:
 * - Integrates with QueryBaseComponent for initial data fetching
 * - Only sends changed form values to the API
 * - Supports custom mutation names and callbacks
 * - Handles form validation with Zod
 * - Ignores timestamp fields (createdAt, updatedAt, deletedAt) in change detection
 *
 * @example
 * ```tsx
 * <UpdateDataComponent
 *   id="648339adsf043c8ed"
 *   name="product"
 *   Form={ProductForm}
 *   formProps={{
 *     buttonLabel: "Update Product",
 *     schema: productSchema
 *   }}
 * />
 * ```
 */
export default function UpdateDataComponent({
  id,
  name,
  Form,
  updateMutation,
  doAfterSuccessUpdate,
  cleanDataBeforeUpdate = (data) => data,
  formProps,
  params,
}: UpdateDataComponentProps) {
  // Dynamically access the update mutation from the API slice
  const { mutateAsync: updateData, ...state } = api[camelCase(singular(name))].useUpdateOne();

  const [fetchedData, setFetchedData] = useState<any>(null);
  const [dataForm, setDataForm] = useState<UseFormReturn | null>(null);

  useEffect(() => {
    dataForm?.reset(fetchedData);
  }, [fetchedData, dataForm]);

  /**
   * Handles form submission and data update
   * Only sends changed fields to the API by comparing with initial values
   *
   * @param data Current form data
   * @param form React Hook Form instance
   */
  function handleUpdateData(
    data: z.infer<typeof formProps.schema>,
    form: UseFormReturn,
    onError: any
  ) {
    // Get only changed values by comparing with initial form values
    // const cleanedData =

    // cleanDataBeforeUpdate(
    //   getFormChangedValues(
    //     formProps.schema.optional().nullable().safeParse(form.formState.defaultValues)
    //       .data,
    //     data
    //   )
    // );

    // Submit update with ID in path and changed data in body
    updateData({ id: id as string, body: data })
      .then(async (response: any) => {
        doAfterSuccessUpdate && (await doAfterSuccessUpdate({ response, data: data, form }));

        setDataForm(form);
      })
      .catch(onError);
  }

  return (
    <QueryBaseComponent
      name={camelCase(name)}
      successComponentProps={{
        formProps: { ...state, ...formProps, onSubmit: handleUpdateData },
        Form: Form,
        fetchedData,
        setFetchedData,
      }}
      SuccessComponent={SuccessComponent}
      query={'useGetOne'}
      params={{ id, ...params }}
      showReloadAgainButton={false}
    />
  );
}

/**
 * Renders the form with fetched data
 */
function SuccessComponent({
  data,
  Form,
  formProps,
  fetchedData,
  setFetchedData,
}: {
  data: any;
  Form: (props: FormComponentProps) => React.JSX.Element;
  formProps: any;
  fetchedData: any;
  setFetchedData: any;
}) {
  useEffect(() => {
    setFetchedData(data.data);
  }, [data]);

  return <Form {...formProps} defaultValues={data.data} source={data.data} />;
}
