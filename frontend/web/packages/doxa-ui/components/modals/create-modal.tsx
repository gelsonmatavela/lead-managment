"use client";

import React from "react";
import { z } from "zod";
import { Modal, ModalProps } from "../../../doxa-ui/components/ui/modal";
import CreateDataPage from "../pages/create-data-logic-component";

/**
 * Props for the CreateDataModal component
 * @template DataType The type of data being created
 */
type CreateDataModalProps<DataType> = {
  /** Optional ID for the modal */
  id?: string;
  /** Name identifier for the form/modal - used to generate API mutation name if not provided */
  name: string;
  /** Form component to be rendered inside the modal for data creation */
  Form: (props: any) => React.JSX.Element;
  /**
   * Redux API mutation name (e.g., 'useCreateProductMutation')
   * If not provided, will be generated as `useCreate${pascalCase(name)}Mutation`
   */
  createMutation?: string;
  /** Title displayed in the modal header */
  title: string;
  /** Optional description text for the modal */
  description?: string;
  /**
   * When true, maintains the form button's loading state after submission
   * Useful when additional processing is needed after data creation
   */
  keepIsLoading?: boolean;
  /** Additional data to be passed to the form component */
  requiredData?: Record<string, any>;
  /** Flag to show alert after successful creation */
  showAlertAfterSuccessCreate?: boolean;
  /**
   * Callback function executed after successful data creation
   * Receives the created data and can perform additional operations
   */
  doAfterSuccessCreate?: (x: any) => Promise<any> | void;
  /** Function to transform form data before submission */
  cleanDataBeforeCreate?: (data: any) => void;
  /** CSS class name for the modal */
  className?: string;
  /** CSS class name for the modal dialog content */
  dialogContentClassName?: string;
  /** Zod schema for form validation */
  schema: z.ZodObject<any> | z.ZodEffects<z.ZodObject<any>>;
  /** Buttons to be displayed in the top-right corner of the modal, next to the title */
  topButtons?: React.ReactNode;
  /** Props specific to the form component */
  formProps: {
    /** Label for the form's submit button */
    buttonLabel: string;
    /** Optional CSS class name for the form */
    className?: string;
  };
};

/**
 * A generic modal component for creating data with form validation
 * @template DataType The type of data being created
 * @param props Component props combining CreateDataModalProps and partial ModalProps
 * @returns A Modal component containing a form for data creation
 *
 * @example
 * ```tsx
 * <CreateDataModal<UserData>
 *   name="user"
 *   title="Create New User"
 *   schema={userSchema}
 *   formProps={{ buttonLabel: "Create User" }}
 *   Form={UserForm}
 *   isOpen={isOpen}
 *   setIsOpen={setIsOpen}
 * />
 * ```
 */
export default function CreateDataModal<DataType>({
  name,
  title,
  description,
  keepIsLoading,
  requiredData,
  schema,
  formProps,
  topButtons,
  isOpen,
  setIsOpen,
  showConfirmButton,
  doAfterSuccessCreate = () => {},
  dialogContentClassName,
  ...props
}: CreateDataModalProps<DataType> & Partial<ModalProps>) {
  /**
   * Handles modal closure and executes post-creation callback
   * @param data The created data
   */
  function handleCloseModal(data: any) {
    setIsOpen!(false);
    doAfterSuccessCreate!(data);
  }

  return (
    <Modal
      title={title}
      setIsOpen={setIsOpen}
      isOpen={isOpen}
      showConfirmButton={showConfirmButton}
      dialogContentClassName={dialogContentClassName}
    >
      <CreateDataPage
        {...props}
        name={name}
        doAfterSuccessCreate={handleCloseModal}
        formProps={{
          ...formProps,
          keepIsLoading: keepIsLoading,
          requiredData: requiredData,
          schema: schema,
        }}
      />
    </Modal>
  );
}
