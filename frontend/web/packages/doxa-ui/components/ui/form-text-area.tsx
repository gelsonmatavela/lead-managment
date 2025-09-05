"use client";

import { Controller, UseFormReturn } from "react-hook-form";
import TextArea from "./text-area";
import React from "react";

/**
 * Props for the `FormTextArea` component
 */
type FormTextAreaProps = {
  /** React Hook Form instance */
  form: UseFormReturn<any>;
  /** The name of the field (should match the form schema) */
  name: string;
  /** Default value of the textarea */
  defaultValue?: string;
} & Omit<
  React.ComponentProps<typeof TextArea>,
  "value" | "onChange" | "error" | "form"
>;

/**
 * A form textarea component that adds form functionality to the base TextArea component.
 * Designed to integrate with React Hook Form.
 *
 * @component
 * @example
 * ```tsx
 * <FormTextArea
 *   form={form}
 *   name="description"
 *   label="Description"
 *   placeholder="Enter detailed description"
 *   required
 *   tip="Provide as much detail as possible"
 *   rows={10}
 * />
 * ```
 */
export default function FormTextArea({
  form,
  name,
  defaultValue = "",
  required = true,
  ...props
}: FormTextAreaProps) {
  return (
    <Controller
      control={form.control}
      name={name}
      rules={{ required: required ? "Este campo é obrigatório" : false }}
      render={({
        field: { onChange, value = defaultValue },
        fieldState: { error },
      }) => (
        <TextArea
          id={`form-textarea-${name}`}
          value={value}
          onChange={onChange}
          required={required}
          error={error?.message}
          {...props}
        />
      )}
    />
  );
}
