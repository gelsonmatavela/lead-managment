import React, { SetStateAction, useEffect, useState } from "react";
import { Trash2Icon, SearchCheckIcon, SearchIcon } from "lucide-react";
import {
  filterTypes,
  incompatibleOperators,
} from "./utils/filter-builder.helpers";
import { Condition, FilteringField, FilterType } from "./types";
import AddFilterSelect from "./AddFilterSelect";
import FilterInput from "./FilterInput";
import Button from "@/packages/doxa-ui/components/ui/button";
import { buildPrismaFilterFromConditions } from "./utils/filter-builder.helpers";
import { useDocumentEventListener } from "@/packages/doxa-ui/hooks/use-document-event-listener";
import { useUpdateSearchParams } from "@/packages/doxa-ui/hooks/use-update-search-params";

const getAvailableFields = (fields: any) => {
  if (typeof fields === "function") {
    return fields();
  }
  return fields;
};

type FilterBuilderProps = {
  level: number;
  initialConditions?: Condition[];
  onFilterChange?: ((filter: Record<string, any>) => void) | null;
  parentField?: FilteringField | null;
  onConditionsChange?: (conditions: Condition[]) => void;
  filteringFields?: FilteringField[];
  disabled?: boolean;
  setQueryParams?: React.Dispatch<
    SetStateAction<Record<string, any> | undefined>
  >;
};

export default function FilterBuilder({
  level = 0,
  onFilterChange = null,
  parentField = null,
  disabled = false,
  onConditionsChange,
  setQueryParams,
  filteringFields = [],
  initialConditions = [],
}: Partial<HTMLDivElement> & FilterBuilderProps) {
  const [conditions, setConditions] = useState<Condition[]>(initialConditions);
  const [prismaFilter, setPrismaFilter] = useState<object>({});
  const [isApplied, setIsApplied] = useState(false);

  const addCondition = (newConditionFields: Partial<Condition> | undefined) => {
    const availableFields = getAvailableFields(
      parentField?.relationFilteringFields || filteringFields
    );

    // if (availableFields?.length === 0) return;

    const newCondition = {
      id: Date.now(),
      field: availableFields![0],
      value: "",
      operator: "",
      ...newConditionFields,
    };

    setConditions([...conditions, newCondition]);
    setIsApplied(false);
    return newCondition;
  };

  const updateCondition = (
    conditionId: number,
    updates: Partial<Condition>
  ) => {
    const newConditions = conditions.map((condition) =>
      condition.id === conditionId ? { ...condition, ...updates } : condition
    );
    setConditions(newConditions);
    if (onConditionsChange) onConditionsChange(newConditions);
    setIsApplied(false);
    buildPrismaFilter(newConditions);
  };

  const removeCondition = (conditionId: number) => {
    const newConditions = conditions.filter((c) => c.id !== conditionId);
    setConditions(newConditions);
    if (onConditionsChange) onConditionsChange(newConditions);
    if (newConditions.length > 0) setIsApplied(false);
    buildPrismaFilter(newConditions);
    if (newConditions.length === 0) setQueryParams!({});
  };

  /// ddsfd

  function buildPrismaFilter(currentConditions: Condition[]) {
    const filter = buildPrismaFilterFromConditions(currentConditions) || {};
    setPrismaFilter(filter);
    if (onFilterChange) {
      onFilterChange(filter);
    }
  }

  const availableFields = getAvailableFields(
    parentField?.relationFilteringFields || filteringFields
  );

  const getUsedOperatorsByField = (condition: Condition) => {
    return conditions
      .filter(
        (c) =>
          c?.field?.name === condition.field.name &&
          c.id !== condition.id &&
          c.operator
      )
      .map((c) => c.operator);
  };

  const isOperatorDisabled = (operator: string, condition: Condition) => {
    const usedOperators = getUsedOperatorsByField(condition);
    return usedOperators.some((usedOp) =>
      incompatibleOperators[condition.field.type as FilterType]?.[
        usedOp
      ]?.includes(operator)
    );
  };

  const updateSearchParams = useUpdateSearchParams();

  function applyFilters() {
    setIsApplied(true);
    conditions.length > 0
      ? setQueryParams && setQueryParams(prismaFilter)
      : setQueryParams && setQueryParams({});
    onConditionsChange && onConditionsChange(conditions);

    updateSearchParams([{ name: "page", value: String(1) }]);
  }

  useEffect(() => {
    if (conditions.length === 0) applyFilters();
  }, [conditions]);

  useDocumentEventListener(
    "keydown",
    (e) => {
      if (e.key === "Enter") setQueryParams && setQueryParams(prismaFilter);
    },
    { capture: level === 0 }
  );

  return (
    <>
      <div
        style={{
          padding: conditions.length === 0 ? "0px" : "",
          boxShadow: level > 0 ? "0px 0px 5px rgb(0 0 0 / 0.1)" : "",
          borderWidth: level > 0 ? "1px" : "",
          borderColor: " rgb(228 228 231 / #e4e4e7 )",
        }}
        data-is-first-level={level === 0}
        className="p-2 rounded-md h-fit w-fit text-[0.875rem] bg-black z-[999]"
      >
        <div className="flex gap-2 flex-col">
          {conditions.map((condition) => (
            <div
              key={condition.id}
              data-parent={!!parentField}
              data-relation={condition.field.type === "RELATION"}
              style={{
                flexDirection:
                  condition.field.type === "RELATION" ? "column" : "row",
              }}
              className="flex data-[relation=true]:flex-col items-start -pt-8 gap-2 "
            >
              <div className="flex items-center gap-2">
                <select
                  className="border rounded px-2 py-[2px]"
                  value={condition.field.name}
                  onChange={(e) => {
                    const newField = availableFields.find(
                      (f: FilteringField) => f.name === e.target.value
                    );

                    if (newField)
                      updateCondition(condition.id, {
                        field: newField,
                        operator:
                          filterTypes[newField.type as FilterType].operators[0],
                        value: "",
                      });
                  }}
                >
                  {availableFields.map((field: FilteringField) => (
                    <option key={field.name} value={field.name}>
                      {field.label}
                    </option>
                  ))}
                </select>

                {/* <Select
                    value={condition.field.name}
                    onChange={(selectedValue) => {
                      const newField = availableFields.find(
                        (f) => f.name === selectedValue
                      );

                      if (newField) {
                        updateCondition(condition.id, {
                          field: newField,
                          operator:
                            filterTypes[newField.type as FilterType]
                              .operators[0],
                          value: "",
                        });
                      }
                    }}
                    placeholder="Selecione uma opção..."
                    selectClassName="rounded px-2 py-[2px]"
                    options={availableFields.map((field: FilteringField) => ({
                      label: field.label,
                      value: field.name,
                    }))}
                  /> */}

                <select
                  className="border rounded px-2 py-[2px]"
                  value={condition.operator}
                  onChange={(e) =>
                    updateCondition(condition.id, {
                      operator: e.target.value,
                    })
                  }
                >
                  <option value="">Selecionar operador</option>
                  {filterTypes[
                    condition.field.type as FilterType
                  ]?.operators.map((op) => {
                    if (
                      (condition.field.relationType === "manyToOne" &&
                        op === "tem") ||
                      (condition.field?.relationType !== "manyToOne" &&
                        op !== "tem")
                    )
                      return (
                        <option
                          key={op}
                          value={op}
                          disabled={isOperatorDisabled(op, condition)}
                        >
                          {op} {isOperatorDisabled(op, condition) && "(-)"}
                        </option>
                      );
                  })}
                </select>
              </div>

              {FilterInput({
                level,
                condition,
                updateCondition,
                removeCondition,
                onConditionsChange,
              })}

              <Button
                variant="flat"
                onClick={() => removeCondition(condition.id)}
                className=" hover:bg-red-400 rounded p-0 px- py-1 size-4 aspect-square text-red-500"
              >
                <Trash2Icon className="w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{ paddingInline: level === 0 ? "4px" : "" }}
        className="flex justify-between items-center gap-4"
      >
        <div className="flex flex-col items-center w-fit ">
          {conditions.length > 0 && (
            <div
              style={{ width: "2px", opacity: level > 0 ? 1 : 0 }}
              className="h-2 w-[1px] bg-blackground"
            />
          )}
          <AddFilterSelect
            disabled={disabled}
            className=" border-zinc-200 px-2 py-[2px]"
            parentField={parentField}
            addCondition={addCondition}
            availableFields={availableFields}
          />
        </div>
        {level === 0 && (
          <Button
            disabled={isApplied}
            className="mt-2 h-8"
            onClick={applyFilters}
          >
            {isApplied ? (
              <>
                <SearchIcon size={16} /> Filtros Aplicados
              </>
            ) : (
              <>
                <SearchCheckIcon size={16} /> Aplicar Fitros
              </>
            )}
          </Button>
        )}
      </div>
      {/* 
        {level === 0 && Object.keys(prismaFilter).length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">Generated Prisma Filter:</h3>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(prismaFilter, null, 2)}
            </pre>
          </div>
        )} */}
    </>
  );
}
