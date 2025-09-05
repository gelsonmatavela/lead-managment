import React from "react";
import { Condition, FilteringField, FilteringFieldFunction } from "./types";
import { twMerge } from "tailwind-merge";

type AddFilterSelectProps = {
  availableFields: FilteringField[];
  addCondition: (
    newConditionFields?: Partial<Condition> | undefined
  ) => Partial<Condition> | undefined;
  parentField: FilteringField | null;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export default function AddFilterSelect({
  availableFields = [],
  addCondition,
  parentField,
  className,
  ...props
}: AddFilterSelectProps) {
  const fields: FilteringField[] = Array.isArray(availableFields)
    ? availableFields
    : (availableFields as FilteringFieldFunction)();
  return (
    <select
      {...props}
      className={twMerge("border rounded px-1 py-[2px] w-fit", className)}
      value=""
      onChange={(e) => {
        const newField = fields.find((f) => f.name === e.target?.value);

        if (newField)
          addCondition({
            field: newField,
            value: "",
          });
      }}
    >
      <option value="" className="bg-background text-zinc-200">
     
        Adicionar filtro
      </option>

      {fields.map((field) => (
        <option
          className="bg-background text-zinc-200"
          key={field.name}
          value={field.name}
        >
          {field.label}
        </option>
      ))}
    </select>
  );
}
