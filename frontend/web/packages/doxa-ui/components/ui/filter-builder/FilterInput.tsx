import BetweenFilterInput from "./BetweeFilterInput";
import FilterBuilder from "./filter-builder";
import { Condition } from "./types";
import { filterTypes } from "./utils/filter-builder.helpers";

export type FilterInputProps = {
  condition: Condition;
  level: number;
  updateCondition: (conditionId: number, updates: Partial<Condition>) => void;
  removeCondition: (conditionId: number) => void;
  onConditionsChange?: (conditions: Condition[]) => void;
};

export default function FilterInput({
  level,
  condition,
  updateCondition,
}: FilterInputProps) {
  const { field, operator, value } = condition;
  const { component, type } = filterTypes[field.type];

  // if (!operator) return;

  if (operator === "entre") {
    return (
      <BetweenFilterInput
        type={type}
        disabled={!condition.operator}
        value={value}
        onChange={(newValue: string) =>
          updateCondition(condition.id, { value: newValue })
        }
      />
    );
  }

  switch (component) {
    case "select":
      return (
        <select
          className="border rounded px-2 py-[2px]"
          value={value}
          disabled={!condition.operator}
          onChange={(e) =>
            updateCondition(condition.id, { value: e.target.value })
          }
        >
          <option value="">Selecionar...</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );

    case "multi-select":
      return (
        <select
          className="border rounded px-2 py-[2px]"
          multiple
          value={Array.isArray(value) ? value : [value]}
          disabled={!condition.operator}
          onChange={(e) =>
            updateCondition(condition.id, {
              value: Array.from(
                e.target.selectedOptions,
                (option) => option.value
              ),
            })
          }
        >
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );

    case "checkbox":
      return (
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={value}
          disabled={!condition.operator}
          onChange={(e) =>
            updateCondition(condition.id, { value: e.target.checked })
          }
        />
      );

    case "relation-picker":
      return (
        <div className="">
          <FilterBuilder
            disabled={!condition.operator}
            level={level + 1}
            onFilterChange={(filter) =>
              updateCondition(condition.id, { value: filter })
            }
            parentField={field}
            // onConditionsChange={onConditionsChange}
          />
        </div>
      );

    default:
      return (
        <input
          type={type}
          className="border rounded px-2 py-[2px]"
          value={value}
          disabled={!condition.operator}
          placeholder="Digitar..."
          onChange={(e) =>
            updateCondition(condition.id, { value: e.target.value })
          }
        />
      );
  }
}
