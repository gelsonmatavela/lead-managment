"use client";

import React, { useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import CreateDataLogicComponent from "./create-data-logic-component";
import { AppContext } from "@/src/utils/contexts/app.context";

type CreateDataPageProps = {
  id?: string;
  name: string;
  Form: (props: any) => React.JSX.Element;
  createMutation?: string;
  title?: string;
  description?: string;
  keepIsLoading?: boolean;
  requiredData?: Record<string, any>;
  showAlertAfterSuccessCreate?: boolean;
  doAfterSuccessCreate?: (x: any) => Promise<any> | void;
  cleanDataBeforeCreate?: (data: any) => void;
  className?: string;
  schema: any;
  topButtons?: any;
  formProps: {
    buttonLabel: string;
    className?: string;
  };
};

export default function CreateDataPage<DataType>({
  name,
  title,
  description,
  keepIsLoading,
  requiredData,
  schema,
  formProps,
  topButtons,
  ...props
}: CreateDataPageProps) {
  const pathname = usePathname();

  const listHref = pathname.split("/");
  listHref.pop();

  const { dispatch } = useContext(AppContext);

  // Setting up the current page title on the navbar
  useEffect(() => {
    dispatch({ type: "set-page-title", payload: { title } });
  }, [title]);

  return (
    <div className="">
      <div className="flex justify-between items-center"></div>
      <div className="main-container lg:h-[calc(100vh-84px)] h-[calc(100vh-86px)] md:p-4 p-2">
        <div className="main-container-content">
          <CreateDataLogicComponent
            {...props}
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
