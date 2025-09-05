import React, { useState, useRef } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { X } from "lucide-react";

export type FormMultipleInputProps = {
  form: UseFormReturn<any>;
  name: string;
  placeholder?: string;
  label?: string;
  className?: string;
  selectContainerClassName?: string;
  labelClassName?: string;
  required?: boolean;
  showRequiredSign?: boolean;
  disabled?: boolean;
  selectClassName?: string;
};

export default function FormMultipleInput({
  form,
  name,
  placeholder = "Digite e Pressione Enter...",
  label,
  className,
  selectContainerClassName,
  labelClassName,
  required = true,
  showRequiredSign = false,
  disabled = false,
  selectClassName,
}: FormMultipleInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={twMerge("gap-1 inline-grid w-full", className)}>
      {label && (
        <div className="flex flex-row items-center gap-1">
          <label
            htmlFor={`select-${name}`}
            className={twMerge("font-bold text-zinc-900", labelClassName)}
          >
            {label}
          </label>
        </div>
      )}
      <Controller
        control={form.control}
        name={name}
        rules={{ required: required ? "Este campo é obrigatório" : false }}
        render={({ field: { onChange, value = [], onBlur } }) => {
          const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (
              e.key === "Enter" ||
              (e.key === "," && e.currentTarget.value.trim())
            ) {
              e.preventDefault();
              const newTag = e.currentTarget.value.trim();
              if (newTag && !value.includes(newTag)) {
                onChange([...value, newTag]);
              }
              e.currentTarget.value = "";
            }
          };

          const handleRemoveTag = (tag: string) => {
            onChange(value.filter((t: string) => t !== tag));
          };

          return (
            <div className={twMerge("relative", selectContainerClassName)}>
              <div
                data-focus={isFocused}
                className={twMerge(
                  "flex min-w-fit rounded-md border border-zinc-300 bg-background p-2  ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm bg-white flex-1 placeholder:text-zinc-300 placeholder:font-normal flex-row flex-wrap gap-2 data-[focus=true]:outline-primary-500 data-[focus=true]:outline-2 data-[focus=true]:outline",
                  selectClassName
                )}
              >
                {value.map((tag: string) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md"
                  >
                    {tag}
                    <X
                      size={14}
                      className="cursor-pointer hover:text-blue-600"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </div>
                ))}
                <input
                  ref={inputRef}
                  type="text"
                  className="flex-1 focus:outline-none bg-transparent"
                  onKeyDown={handleAddTag}
                  onFocus={() => {
                    setIsFocused(true);
                  }}
                  onBlur={() => setIsFocused(false)}
                  disabled={disabled}
                  placeholder={value.length ? "" : placeholder}
                />
              </div>
            </div>
          );
        }}
      />
      {form.formState.errors[name] && (
        <div className="text-red-500 text-xs">
          {form.formState.errors[name]?.message as string}
        </div>
      )}
    </div>
  );
}
