"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";

type AdminDataTableProps<T> = {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  minWidthClassName?: string;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  /** true ise siralama sadece disaridan (API) yonetilir */
  manualSorting?: boolean;
};

export function AdminDataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "Kayıt bulunamadı.",
  minWidthClassName = "min-w-[640px]",
  sorting: controlledSorting,
  onSortingChange,
  manualSorting = false,
}: AdminDataTableProps<T>) {
  const [uncontrolledSorting, setUncontrolledSorting] = useState<SortingState>([]);
  const isControlled = controlledSorting !== undefined;
  const sorting = isControlled ? controlledSorting : uncontrolledSorting;

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table API
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: isControlled ? onSortingChange : setUncontrolledSorting,
    manualSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
  });

  const columnCount = columns.length;

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-900">
      <table className={`w-full ${minWidthClassName} text-left text-sm`}>
        <thead className="bg-[#18151c] text-xs uppercase tracking-wide text-zinc-400">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sorted = header.column.getIsSorted();

                return (
                  <th key={header.id} className="px-4 py-3 font-medium">
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="inline-flex cursor-pointer items-center gap-1.5 transition hover:text-white"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <span className="text-[10px] text-zinc-500">
                          {sorted === "asc" ? "▲" : sorted === "desc" ? "▼" : "⇅"}
                        </span>
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-zinc-900">
          {isLoading && (
            <tr>
              <td colSpan={columnCount} className="px-4 py-8 text-center text-zinc-500">
                Yükleniyor...
              </td>
            </tr>
          )}

          {!isLoading && data.length === 0 && (
            <tr>
              <td colSpan={columnCount} className="px-4 py-8 text-center text-zinc-500">
                {emptyMessage}
              </td>
            </tr>
          )}

          {!isLoading &&
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="text-zinc-200">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
