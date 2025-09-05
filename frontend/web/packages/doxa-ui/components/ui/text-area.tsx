"use client";

import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { AsteriskIcon } from "lucide-react";
import React from "react";

/**
 * Props for the base `TextArea` component
 */
type TextAreaProps = {
  /** Additional class name for the textarea element */
  textareaClassName?: string;
  /** Additional class name for the container */
  className?: string;
  /** Placeholder text for the textarea */
  placeholder?: string;
  /** Label text for the textarea */
  label?: string;
  /** Additional class name for the label */
  labelClassName?: string;
  /** Additional class name for the textarea container */
  textareaContainerClassName?: string;
  /** Whether the textarea is disabled */
  disabled?: boolean;
  /** Whether to trim input value before calling onChange */
  trim?: boolean;
  /** Current value of the textarea */
  value?: string;
  /** Callback fired when textarea value changes */
  onChange?: (value: string) => void;
  /** Whether the field is required */
  required?: boolean;
  /** Whether to show an asterisk for required fields */
  showRequiredSign?: boolean;
  /** Tooltip text providing additional information */
  tip?: string;
  /** Error message to display */
  error?: string;
  /** Number of rows for the textarea */
  rows?: number;
  /** Textarea resize behavior */
  resize?: "none" | "vertical" | "horizontal" | "both";

  ref?: any;
  textareaRef?: any;
};

/**
 * A textarea component with built-in support for labels, tooltips,
 * focus states, and value trimming.
 *
 * @component
 * @example
 * ```tsx
 * <TextArea
 *   label="Description"
 *   placeholder="Enter description"
 *   required
 *   tip="Provide a detailed description"
 *   onChange={(value) => console.info(value)}
 *   rows={10}
 * />
 * ```
 *
 * @param {TextAreaProps} props - Component props
 * @returns {JSX.Element} A styled textarea component
 */
export default function TextArea({
  textareaClassName,
  className,
  placeholder,
  label,
  labelClassName,
  disabled = false,
  trim = false,
  value = "",
  onChange,
  required = false,
  showRequiredSign = false,
  tip,
  error,
  textareaContainerClassName,
  rows = 10,
  resize = "vertical",
  ref,
  textareaRef,
  ...props
}: TextAreaProps &
  Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    keyof TextAreaProps
  >) {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  function handleOnChange(text: string) {
    if (disabled || !onChange) return;
    const processedValue = trim ? text.trim() : text;
    onChange(processedValue);
  }

  return (
    <div ref={ref} className={twMerge("gap-1 grid", className)}>
      {label && (
        <div className="flex flex-row items-center gap-1">
          <label
            htmlFor={props.id}
            className={twMerge("font-bold text-zinc-900", labelClassName)}
          >
            {label}
          </label>
          {required && showRequiredSign && (
            <AsteriskIcon size={12} color="red" />
          )}
        </div>
      )}
      <div
        data-focus={isFocused}
        className={twMerge(
          "flex w-full rounded-md border border-zinc-300 bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white flex-1 placeholder:text-zinc-300 placeholder:font-normal flex-row data-[focus=true]:outline-primary-500 data-[focus=true]:outline-2 data-[focus=true]:outline",
          textareaContainerClassName
        )}
      >
        <textarea
          disabled={disabled}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => handleOnChange(e.currentTarget.value)}
          value={value}
          placeholder={placeholder}
          rows={rows}
          className={twMerge(
            "flex-1 w-full p-2 rounded-md disabled:bg-zinc-100",
            `resize-${resize}`,
            textareaClassName
          )}
          ref={textareaRef}
          {...props}
        />
      </div>
      {error && <div className="text-red-500 text-xs">*{error}</div>}
    </div>
  );
}
