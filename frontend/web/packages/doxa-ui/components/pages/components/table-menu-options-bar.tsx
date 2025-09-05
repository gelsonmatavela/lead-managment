import React from "react";
import { SquareMousePointerIcon, EllipsisVerticalIcon } from "lucide-react";
import VerticalResizeHandle from "./list-page-table/components/vertical-resize-handle";
import TableMenuOptions from "./table-menu-options";
import uuid4 from "uuid4";
import { BaseData, TableItemMenuOption } from "./list-page-table"; // Import from your eain component
import { FilteringField } from "../../ui/filter-builder/types";

export type TableMenuOptionsBarProps<T extends BaseData> = {
  data: T[];
  setHoveredRow: React.Dispatch<React.SetStateAction<T | null | undefined>>;
  hoveredRow: T | null | undefined;
  getRowHeight: (index: number) => number;
  filteringFields: FilteringField[] | undefined;
  optionsMenuTrigger: React.RefObject<any>;
  menuOptionsProps: {
    hoveredRow: T | null | undefined;
    resource: string;
    setSelectedItemToOpen: React.Dispatch<
      React.SetStateAction<T | null | undefined>
    >;
    menuPosition: { top: boolean; left: boolean };
    tableItemMenuOptions?: TableItemMenuOption<T>[];
    optionTabRef: React.RefObject<any>;
    onClickUpdate?: (e: any, item: T) => void;
    onDeleteSuccess?: (item: T) => void;
  };
  // Additional props needed for the component to work
  selectedItemToOpen: T | null | undefined;
  setSelectedItemToOpen: React.Dispatch<
    React.SetStateAction<T | null | undefined>
  >;
  handleMenuOpen: (event: React.MouseEvent, item: T) => void;
  handleRowResize: (rowIndex: number, deltaY: number) => void;
  name: string;
  deleteData: any; // UseMutateAsyncFunction type from your main component
  onClickUpdate?: (e: any, item: T) => void;
  onDeleteSuccess?: (item: T) => void;
  tableItemMenuOptions?: TableItemMenuOption<T>[];
  menuPosition: { top: boolean; left: boolean };
  optionTabRef: React.RefObject<any>;
};

export default function TableMenuOptionsBar<T extends BaseData>({
  data,
  setHoveredRow,
  hoveredRow,
  getRowHeight,
  filteringFields,
  optionsMenuTrigger,
  selectedItemToOpen,
  setSelectedItemToOpen,
  handleMenuOpen,
  handleRowResize,
  name,
  deleteData,
  onClickUpdate,
  onDeleteSuccess,
  tableItemMenuOptions,
  menuPosition,
  optionTabRef,
}: TableMenuOptionsBarProps<T>) {
  return (
    <div className=" sm:right-4 right-2">
      <div className="bg-zinc-100 text-zinc-500 border-t border-l rounded-tr-sm rounded-b-none overflow-hidden flex items-center gap- border-r">
        <div className="truncate text-left font-bold flex items-center border-l p-2 py-[9.5px] px-3">
          <SquareMousePointerIcon size={18} />
        </div>
      </div>
      {data.map((item, i) => (
        <div
          data-selected={
            selectedItemToOpen?.id === item.id || hoveredRow?.id === item.id
          }
          onMouseEnter={() => setHoveredRow(item)}
          onMouseLeave={() => setHoveredRow(null)}
          key={uuid4()}
          data-is-last={i === data.length - 1}
          className="text-zinc-700 font- overflow-hidden flex px-2 items-center gap- border data-[is-last=true]:rounded-br-md hover:bg-sky-100 py-0 border-r data-[selected=true]:bg-sky-100 relative bg-white"
          style={{ height: `${getRowHeight(i)}px` }}
        >
          {filteringFields?.map((field, j: number) => {
            if (j === 0)
              return (
                <div key={uuid4()} className="right-0">
                  <button
                    id={item.id}
                    ref={optionsMenuTrigger}
                    data-selected={
                      selectedItemToOpen?.id === item.id ||
                      hoveredRow?.id === item.id
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuOpen(e, item);
                    }}
                    className="px-2 py-2 my-[1.5px] text-zinc-700 active:opacity-50 h-auto rounded-full data-[selected=true]:bg-zinc-10 option-menu-trigger"
                  >
                    <EllipsisVerticalIcon size={18} />
                  </button>
                  {selectedItemToOpen?.id === item.id && (
                    <TableMenuOptions<T>
                      hoveredRow={hoveredRow}
                      resource={name}
                      item={item}
                      setSelectedItemToOpen={setSelectedItemToOpen}
                      selectedItemToOpen={selectedItemToOpen}
                      menuPosition={menuPosition}
                      tableItemMenuOptions={tableItemMenuOptions}
                      ref={optionTabRef}
                      onClickUpdate={onClickUpdate}
                      deleteData={deleteData}
                      onDeleteSuccess={onDeleteSuccess}
                    />
                  )}
                </div>
              );
          })}
          <VerticalResizeHandle
            onResize={(deltaY) => handleRowResize(i, deltaY)}
            className="z-10"
          />
        </div>
      ))}
    </div>
  );
}
