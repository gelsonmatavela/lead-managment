"use client";

import React from "react";
import { z } from "zod";
import { Modal, ModalProps } from "../../../doxa-ui/components/ui/modal";
import UpdateDataComponent from "../pages/update-data-logic-component";

type UpdateDataModalProps<DataType> = {
  id: string;
  name: string;
  Form: (props: any) => React.JSX.Element;
  updateMutation?: string;
  title: string;
  description?: string;
  keepIsLoading?: boolean;
  requiredData?: Record<string, any>;
  showAlertAfterSuccessUpdate?: boolean;
  doAfterSuccessUpdate?: (x: any) => Promise<any> | void;
  cleanDataBeforeUpdate?: (data: any) => void;
  className?: string;
  schema: z.ZodObject<any> | z.ZodEffects<z.ZodObject<any>>;
  topButtons?: any;
  formProps: {
    buttonLabel: string;
    className?: string;
  };
};

export default function UpdateDataModal<DataType>({
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
  doAfterSuccessUpdate = () => {},
  dialogContentClassName,
  ...props
}: UpdateDataModalProps<DataType> & Partial<ModalProps>) {
  function handleCloseModal(data: any) {
    setIsOpen!(false);
    doAfterSuccessUpdate!(data);
  }

  return (
    <Modal
      title={title}
      setIsOpen={setIsOpen}
      isOpen={isOpen}
      showConfirmButton={showConfirmButton}
      dialogContentClassName={dialogContentClassName}
    >
      <UpdateDataComponent
        {...props}
        name={name}
        doAfterSuccessUpdate={handleCloseModal}
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
