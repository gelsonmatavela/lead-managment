import { SuccessComponentProps } from "@/packages/doxa-ui/components/pages/components/query-base-component";
import { ListPageTemplateProps } from "./list-page-template";
import { useSearchParams } from "next/navigation";
import LoadingSpinner from "@/packages/doxa-ui/components/ui/loading-spinner";
import { LoaderCircleIcon, LucideProps } from "lucide-react";
import FilteringFieldsTableData from "./filtering-fields-table-data";
import React, { useEffect, useRef, useState, useCallback } from "react";
import uuid4 from "uuid4";
import { twMerge } from "tailwind-merge";
import { useDocumentEventListener } from "@/packages/doxa-ui/hooks/use-document-event-listener";
import { getGenericTableHeadersLabelsFromFilteringFields } from "@/packages/doxa-ui/utils/main.helpers";
import { UseMutateAsyncFunction, useMutation } from "@tanstack/react-query";
import { extractFilteringFieldsData } from "./utils/filtering-fields-data-table.helpers";
import { isColumnLabelSelected } from "./utils/helpers/list-page-table.helpers";
import TableMenuOptionsBar from "./table-menu-options-bar";
import VerticalResizeHandle from "./list-page-table/components/vertical-resize-handle";

export type TableItemMenuOption<T> = {
  onClick?: (data: T) => void;
  setHref?: (data: T) => string;
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  text: string;
  resource: string;
  action: string;
};

export type ListPageTableProps<T> = {
  name: string;
  handleDelete: () => void;
  selectedItem: BaseData;
  setSelectedItem: React.Dispatch<React.SetStateAction<BaseData>>;
  isDeleting: boolean;
  deleteMutationResult: Partial<
    ReturnType<
      typeof useMutation<
        any | null | undefined,
        Error,
        number | string,
        unknown
      >
    >
  >;
  selectedOptions: any[];
  setResponseData: React.Dispatch<
    React.SetStateAction<
      | {
          total: number;
          data: Record<string, any>[];
          results: number;
        }
      | undefined
    >
  >;
  setTriggerReloadAgain?: React.Dispatch<
    React.SetStateAction<(() => void) | undefined>
  >;
  deleteData: UseMutateAsyncFunction<any, any, any, any>;
  csvData: Record<string, string | number | boolean>[];
  setCsvData: React.Dispatch<
    React.SetStateAction<Record<string, string | number | boolean>[]>
  >;
  hideEditButton?: boolean;
  tableItemMenuOptions?: TableItemMenuOption<T>[];
} & Partial<ListPageTemplateProps<T>>;

export type BaseData = {
  id?: string;
  [x: string]: any;
};

// ResizeHandle component for column resizing (horizontal)
const HorizontalResizeHandle: React.FC<{
  onResize: (deltaX: number) => void;
  className?: string;
}> = ({ onResize, className }) => {
  const [isResizing, setIsResizing] = useState(false);
  const startX = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startX.current = e.clientX;
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      const deltaX = e.clientX - startX.current;
      onResize(deltaX);
      startX.current = e.clientX;
    },
    [isResizing, onResize]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      className={twMerge(
        "absolute top-0 right-0 bottom-0 w-1 cursor-col-resize opacity-0 hover:opacity-100 bg-green-500 hover:bg-green-600 transition-opacity",
        isResizing && "opacity-100",
        className
      )}
      onMouseDown={handleMouseDown}
    />
  );
};

export default function ListPageTable<T extends BaseData>({
  data: responseData,
  onClickUpdate,
  onClickCreate,
  filteringFields,
  selectedItem,
  setSelectedItem,
  deleteMutationResult,
  selectedOptions,
  setCsvData,
  setResponseData,
  onDeleteSuccess,
  deleteData,
  tableItemMenuOptions,
  name,
}: SuccessComponentProps<T[], ListPageTableProps<T>>) {
  const { data, total } = responseData;

  // State for row heights and column widths
  const [rowHeights, setRowHeights] = useState<Record<number, number>>({});
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const defaultRowHeight = 40; // Default row height in pixels
  const defaultColumnWidth = 160; // Default column width in pixels
  const defaultFirstColumnWidth = 384;

  // const dispatch = useDispatch();

  useEffect(() => {
    setResponseData(
      responseData as {
        total: number;
        data: Record<string, any>[];
        results: number;
      }
    );
  }, [responseData]);

  useEffect(() => {
    if (filteringFields) {
      setCsvData(
        extractFilteringFieldsData({
          fields: filteringFields,
          items: data,
          selectedOptions,
        })
      );
    }
  }, [selectedOptions]);

  const [selectedItemToOpen, setSelectedItemToOpen] = useState<T | null>();
  const [hoveredRow, setHoveredRow] = useState<any>();
  const optionTabRef = useRef<any>(null);
  const optionsMenuTrigger = useRef<any>(null);

  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 30);

  useDocumentEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setSelectedItemToOpen(null);
    }
  });

  useDocumentEventListener("mousedown", (event: MouseEvent) => {
    if (
      optionTabRef.current &&
      !optionTabRef.current.contains(event.target as Node) &&
      !Array.from(document.querySelectorAll(".option-menu-trigger")).some(
        (trigger) => trigger.contains(event.target as Node)
      )
    ) {
      setSelectedItemToOpen(null);
    }
  });

  const [menuPosition, setMenuPosition] = useState({ top: false, left: false });

  const handleMenuOpen = (event: React.MouseEvent, item: T) => {
    event.stopPropagation();

    // Get the button position
    const button = event.currentTarget;
    const buttonRect = button.getBoundingClientRect();

    // Get viewport dimensions
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Calculate available space
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;
    const spaceRight = viewportWidth - buttonRect.right;

    // Menu dimensions (approximate)
    const menuHeight = 210; // Adjust based on your menu's height
    const menuWidth = 104; // w-48 = 12rem = 192px

    // Determine position
    const shouldShowOnTop = spaceBelow < menuHeight && spaceAbove > menuHeight;
    const shouldShowOnLeft = spaceRight < menuWidth;

    setMenuPosition({ top: shouldShowOnTop, left: shouldShowOnLeft });
    selectedItemToOpen?.id === item.id
      ? setSelectedItemToOpen(null)
      : setSelectedItemToOpen(item);
  };

  // Handle row resizing (vertical)
  const handleRowResize = useCallback((rowIndex: number, deltaY: number) => {
    setRowHeights((prev) => {
      const currentHeight = prev[rowIndex] || defaultRowHeight;
      const newHeight = Math.max(30, currentHeight + deltaY); // Minimum height of 30px
      return {
        ...prev,
        [rowIndex]: newHeight,
      };
    });
  }, []);

  // Handle column resizing (horizontal)
  const handleColumnResize = useCallback(
    (columnKey: string, deltaX: number) => {
      // alert(columnKey);
      setColumnWidths((prev) => {
        const currentWidth = prev[columnKey] || defaultColumnWidth;
        const newWidth = Math.max(80, currentWidth + deltaX); // Minimum width of 80px
        return {
          ...prev,
          [columnKey]: newWidth,
        };
      });
    },
    []
  );

  // Get row height
  const getRowHeight = (index: number) => rowHeights[index] || defaultRowHeight;

  // Get column width
  const getColumnWidth = (columnKey: string) => {
    if (filteringFields?.[0].label === columnKey)
      return columnWidths[columnKey] || defaultFirstColumnWidth;

    return columnWidths[columnKey] || defaultColumnWidth;
  };

  return (
    <div className=" overflow-x-hidden lex flex">
      <div className="flex w-[calc(100%-50px)] relative bg-white pb- rounded-md">
        <div className="">
          <div className="bg-zinc-100 text-zinc-500 border-t border-l  rounded-tl-sm rounded-b-none overflow-hidden flex items-center gap- pl-4 border-r ">
            <>
              <div className="w-8 p-2 flex items-center justify-center">
                <input
                  disabled
                  type="checkbox"
                  name=""
                  id=""
                  className="size-4  cursor-pointer"
                />
              </div>
              <div className={`text-left w-9 font-bold p-2`}>N°</div>
            </>
            {filteringFields?.map((field, i: number) => {
              if (i === 0) {
                const columnKey = `${field.label}`;
                return (
                  <div
                    key={i}
                    className="truncate text-left font-bold flex items-center border-l px-2 gird gap-1 relative"
                    style={{ width: `${getColumnWidth(columnKey)}px` }}
                  >
                    {field.label} <span className="text-sm"> ({total})</span>
                    <HorizontalResizeHandle
                      onResize={(deltaX) =>
                        handleColumnResize(columnKey, deltaX)
                      }
                      className="z-20"
                    />
                  </div>
                );
              }
            })}
          </div>
          {data.map((item, i) => (
            <div
              key={i}
              data-selected={
                selectedItemToOpen?.id === item.id || hoveredRow?.id === item.id
              }
              onMouseEnter={() => setHoveredRow(item)}
              onMouseLeave={() => setHoveredRow(null)}
              data-is-last={i === data.length - 1}
              className="text-zinc-700 font-base overflow-hidden flex items-center gap- border pl-4 data-[is-last=true]:rounded-bl-md hover:bg-sky-100 bg-white border-r data-[selected=true]:bg-sky-100 relative "
              style={{ height: `${getRowHeight(i)}px` }}
            >
              <>
                <div className="w-8 px-2 flex items-center justify-center py-2">
                  {deleteMutationResult.isPending &&
                  deleteMutationResult.variables === item.id ? (
                    <LoadingSpinner
                      Icon={LoaderCircleIcon}
                      className="text-red-500"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      disabled
                      value={selectedItem.id}
                      onChange={(e) =>
                        setSelectedItem(e.target.checked ? item : {})
                      }
                      checked={selectedItem.id === item.id}
                      name="item-to-take-action"
                      className="size-4 cursor-pointer"
                    />
                  )}
                </div>
                <div className="text-center w-9 p-2 ">
                  {i + 1 + (page * limit - limit)}
                </div>
              </>
              {filteringFields?.map((field, j: number) => {
                if (j === 0) {
                  return (
                    <div key={j} className="relative">
                      <FilteringFieldsTableData
                        index={j}
                        field={field}
                        selectedOptions={selectedOptions}
                        availableFields={filteringFields}
                        item={item}
                        className="w-full border-l border-r-0 p-2"
                        getColumnWidth={getColumnWidth}
                      />
                    </div>
                  );
                }
              })}
              <VerticalResizeHandle
                onResize={(deltaY) => handleRowResize(i, deltaY)}
                className="z-10"
              />
            </div>
          ))}
        </div>
        <div className="overflow-x-auto flex-1 md:min-w-[unset] min-w-[50vw]">
          <div className="bg-zinc-100 text-zinc-500 rounded-b-none overflow-hidden flex border-t border-r   min-w-fit  ">
            {getGenericTableHeadersLabelsFromFilteringFields(
              filteringFields!
            ).map(
              (label, i) =>
                i > 0 &&
                selectedOptions.includes(label) && (
                  <div
                    key={`${label}`}
                    className="truncate text-left font-bold flex items-center border-l p-2 border-r flex-shrink-0 relative"
                    style={{ width: `${getColumnWidth(label)}px` }}
                  >
                    {label}
                    <HorizontalResizeHandle
                      onResize={(deltaX) => handleColumnResize(label, deltaX)}
                      className="z-20"
                    />
                  </div>
                )
            )}
          </div>
          {data.map((item, i) => (
            <div
              key={item.id}
              data-selected={
                selectedItemToOpen?.id === item.id || hoveredRow?.id === item.id
              }
              onMouseEnter={() => setHoveredRow(item)}
              onMouseLeave={() => setHoveredRow(null)}
              className={`text-zinc-700 overflow-hidden flex items-center gap- ${
                selectedOptions.length > 0 && "border"
              } border-l-0 data-[is-last=true]:rounded-br-md min-w-fit hover:bg-sky-100 even:bg-white data-[selected=true]:bg-sky-100 relative`}
              style={{ height: `${getRowHeight(i)}px` }}
            >
              {filteringFields?.map((field, j: number) => {
                if (j > 0 && isColumnLabelSelected(selectedOptions, field)) {
                  return (
                    <FilteringFieldsTableData
                      key={uuid4()}
                      index={j}
                      field={field}
                      availableFields={filteringFields}
                      item={item}
                      selectedOptions={selectedOptions}
                      getColumnWidth={getColumnWidth}
                    />
                  );
                }
              })}
              <VerticalResizeHandle
                onResize={(deltaY) => handleRowResize(i, deltaY)}
                className="z-10"
              />
            </div>
          ))}
        </div>
      </div>
      <TableMenuOptionsBar<T>
        data={data}
        setHoveredRow={setHoveredRow}
        hoveredRow={hoveredRow}
        getRowHeight={getRowHeight}
        filteringFields={filteringFields}
        optionsMenuTrigger={optionsMenuTrigger}
        selectedItemToOpen={selectedItemToOpen}
        setSelectedItemToOpen={setSelectedItemToOpen}
        handleMenuOpen={handleMenuOpen}
        handleRowResize={handleRowResize}
        name={name}
        deleteData={deleteData}
        onClickUpdate={onClickUpdate}
        onDeleteSuccess={onDeleteSuccess}
        tableItemMenuOptions={tableItemMenuOptions}
        menuPosition={menuPosition}
        optionTabRef={optionTabRef}
        menuOptionsProps={{
          hoveredRow,
          resource: name,
          setSelectedItemToOpen,
          menuPosition,
          tableItemMenuOptions,
          optionTabRef,
          onClickUpdate,
          onDeleteSuccess,
        }}
      />{" "}
    </div>
  );
}
