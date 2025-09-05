"use client";

import { Controller, UseFormReturn } from "react-hook-form";
import Input from "./input";
import React from "react";

/**
 * Props for the `FormInput` component
 */
type FormInputProps = {
  /** React Hook Form instance */
  // form: any;
  form: UseFormReturn<any>;
  /** The name of the field (should match the form schema) */
  name: string;
  /** Default value of the input */
  defaultValue?: string;
} & Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange" | "error" | "form"
>;

/**
 * A form input component that adds form functionality to the base Input component.
 * Designed to integrate with React Hook Form.
 *
 * @component
 * @example
 * ```tsx
 * <FormInput
 *   form={form}
 *   name="email"
 *   label="Email"
 *   placeholder="Enter your email"
 *   required
 *   tip="Enter a valid email address"
 * />
 * ```
 */
export default function FormInput({
  form,
  name,
  defaultValue = "",
  required = true,
  ...props
}: FormInputProps) {
  return (
    <Controller
      control={form.control}
      name={name}
      rules={{ required: required ? "Este campo é obrigatório" : false }}
      render={({
        field: { onChange, value = defaultValue },
        fieldState: { error },
      }) => (
        <Input
          id={`form-input-${name}`}
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