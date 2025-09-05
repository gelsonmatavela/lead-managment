import {
  parseQueryString,
  reverseEngineerConditions,
} from "@/packages/doxa-ui/components/ui/filter-builder/utils/filter-builder.helpers";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Condition } from "@/packages/doxa-ui/components/ui/filter-builder/types";
import { buildPrismaFilterFromConditions } from "@/packages/doxa-ui/components/ui/filter-builder/utils/filter-builder.helpers";
import { FilterBuilderContainerProps } from "../components/pages/components/filter-builder-container";
import { useDocumentEventListener } from "./use-document-event-listener";

type useSetupFiltersParams = {
  filtersBuilderRef: React.RefObject<HTMLDivElement | null>;
  filtersButtonRef: React.RefObject<HTMLElement | null>;
  setConditions: React.Dispatch<React.SetStateAction<Condition[]>>;
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
} & Partial<FilterBuilderContainerProps>;

export function useSetupFilters({
  filtersBuilderRef,
  filtersButtonRef,
  showFilters,
  setShowFilters,
  setConditions,
  queryParams,
  setQueryParams,
  availableFilteringFields,
}: useSetupFiltersParams) {
  const searchParams = useSearchParams();

  function handleOutsideInteraction(event: MouseEvent | any | TouchEvent) {
    if (
      !filtersBuilderRef?.current?.contains(event.target) &&
      !filtersButtonRef?.current?.contains(event.target)
    )
      setShowFilters(false);
  }

  function handleKeydownInteration(e: KeyboardEvent) {
    if ((e.key === "Escape" || e.key === "Enter") && showFilters)
      setShowFilters(false);
  }
  useDocumentEventListener("click", handleOutsideInteraction, {
    once: !showFilters,
  });
  useDocumentEventListener("keydown", handleKeydownInteration, {
    once: !showFilters,
  });

  useEffect(() => {
    if (!searchParams.get("q")) return;
    const currentConditions = reverseEngineerConditions(
      parseQueryString(searchParams.get("q")),
      availableFilteringFields || []
    );

    setQueryParams!(buildPrismaFilterFromConditions(currentConditions));
  }, []);
}
