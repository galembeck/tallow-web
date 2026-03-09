/** biome-ignore-all lint/suspicious/noExplicitAny: required by @TanStack-Router */
/** biome-ignore-all lint/performance/useTopLevelRegex: required by @TanStack-Table */
/** biome-ignore-all lint/style/noNonNullAssertion: required by @TanStack-Table */
/** biome-ignore-all lint/complexity/useOptionalChain: required by @TanStack-Table */

"use client";

import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { isSameOrBetweenDays } from "@/utils/is-same-or-between-days";
import { DataTableColumnFilter } from "../data-table-column-filter";
import { DataTableColumnSearch } from "../data-table-column-search";
import { DataTableDateFilter } from "../data-table-date-filter";
import { DataTablePagination } from "../data-table-pagination";
import { DataTableViewOptions } from "../data-table-view-options";
import { Button } from "./button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

interface FilterOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

type ColumnFilter =
  | {
      columnKey: string;
      title: string;
      type?: "select";
      options: FilterOption[];
    }
  | {
      columnKey: string;
      title: string;
      type: "date";
    }
  | {
      columnKey: string;
      title: string;
      type: "search";
    };

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchableColumn?: {
    key: string;
    placeholder: string;
  };
  filterableColumns?: ColumnFilter[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchableColumn,
  filterableColumns,
}: DataTableProps<TData, TValue>) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as any;

  const stableFilterableColumns = useMemo(
    () => filterableColumns ?? [],
    [filterableColumns],
  );

  const [sorting, setSorting] = useState<SortingState>([]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [rowSelection, setRowSelection] = useState({});

  const [searchInputValue, setSearchInputValue] = useState("");

  const multiValueFilter = (
    row: { getValue: (columnId: string) => any },
    columnId: string,
    filterValue: any,
  ) => {
    if (!Array.isArray(filterValue)) {
      return true;
    }

    return filterValue.includes(row.getValue(columnId));
  };

  const updateURL = (updates: Record<string, any>) => {
    const newSearch = { ...search, ...updates };

    for (const key of Object.keys(newSearch)) {
      if (
        newSearch[key] === "" ||
        newSearch[key] === undefined ||
        newSearch[key] === null
      ) {
        delete newSearch[key];
      }
    }

    navigate({
      search: newSearch,
      replace: true,
    });
  };

  const applySearch = (searchValue: string) => {
    if (searchableColumn) {
      table
        .getColumn(searchableColumn.key)
        ?.setFilterValue(searchValue || undefined);
    }
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      applySearch(searchInputValue);
    }
  };

  const clearAllFilters = () => {
    table.resetColumnFilters();
    table.resetSorting();

    setSearchInputValue("");

    const filterReset =
      stableFilterableColumns && stableFilterableColumns.length > 0
        ? stableFilterableColumns.reduce(
            (acc, column) => ({
              // biome-ignore lint/performance/noAccumulatingSpread: required by @TanStack-Table
              ...acc,
              [column.columnKey]: undefined,
            }),
            {},
          )
        : {};

    updateURL({
      search: undefined,
      sortBy: undefined,
      sortOrder: undefined,
      ...filterReset,
    });
  };

  const hasActiveFilters =
    columnFilters.length > 0 || sorting.length > 0 || searchInputValue;

  useEffect(() => {
    if (search.search && searchableColumn) {
      setSearchInputValue(search.search);
    }
  }, [search.search, searchableColumn]);

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: required by @TanStack-Table
  useEffect(() => {
    const initialFilters: ColumnFiltersState = [];

    if (search.search && searchableColumn) {
      initialFilters.push({
        id: searchableColumn.key,
        value: search.search,
      });
    }

    if (stableFilterableColumns.length > 0) {
      for (const filterColumn of stableFilterableColumns) {
        const filterValue = search[`${filterColumn.columnKey}`];

        if (filterValue) {
          let values: any[];
          if (filterColumn.type === "date") {
            if (
              typeof filterValue === "object" &&
              filterValue !== null &&
              ("from" in filterValue || "to" in filterValue)
            ) {
              values = [
                filterValue.from ? new Date(filterValue.from) : null,
                filterValue.to ? new Date(filterValue.to) : null,
              ];
            } else if (Array.isArray(filterValue)) {
              values = filterValue.map((v) => (v ? new Date(v) : null));
            } else {
              values = [filterValue ? new Date(filterValue) : null, null];
            }
          } else {
            values = Array.isArray(filterValue) ? filterValue : [filterValue];
          }
          initialFilters.push({
            id: filterColumn.columnKey,
            value: values,
          });
        }
      }
    }

    if (search.sortBy && search.sortOrder) {
      setSorting([
        {
          id: search.sortBy,
          desc: search.sortOrder === "desc",
        },
      ]);
    }

    setColumnFilters(initialFilters);
  }, [search, searchableColumn, stableFilterableColumns]);

  const dateRangeFilter = (
    row: { getValue: (columnId: string) => any },
    columnId: string,
    filterValue: [Date | null, Date | null] | undefined,
  ) => {
    if (!(filterValue && filterValue[0] && filterValue[1])) {
      return true;
    }

    const value = row.getValue(columnId);
    if (!value) {
      return false;
    }

    let date: Date;
    if (value instanceof Date) {
      date = value;
    } else if (typeof value === "string") {
      if (/^\d{4}-\d{2}-\d{2}T/.test(value)) {
        date = new Date(value);
      } else if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
        const [day, month, year] = value.split("-");
        date = new Date(Number(year), Number(month) - 1, Number(day));
      } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
        const [day, month, year] = value.split("/");
        date = new Date(Number(year), Number(month) - 1, Number(day));
      } else {
        date = new Date(value);
      }
    } else {
      return false;
    }

    return isSameOrBetweenDays(date, filterValue[0]!, filterValue[1]!);
  };

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      multiValue: multiValueFilter,
      dateRange: dateRangeFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);

      if (newSorting.length > 0) {
        updateURL({
          sortBy: newSorting[0].id,
          sortOrder: newSorting[0].desc ? "desc" : "asc",
        });
      } else {
        updateURL({
          sortBy: undefined,
          sortOrder: undefined,
        });
      }
    },
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: (updater) => {
      const newFilters =
        typeof updater === "function" ? updater(columnFilters) : updater;
      setColumnFilters(newFilters);

      const updates: Record<string, any> = {};

      const searchFilter = newFilters.find(
        (f) => f.id === searchableColumn?.key,
      );
      updates.search = searchFilter?.value || undefined;

      for (const filterColumn of stableFilterableColumns) {
        const filter = newFilters.find((f) => f.id === filterColumn.columnKey);
        updates[`${filterColumn.columnKey}`] = filter?.value || undefined;
      }

      updateURL(updates);
    },
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start gap-2 pt-4 lg:flex-row lg:items-center">
        {searchableColumn && (
          <InputGroup className="w-full lg:max-w-xs">
            <InputGroupInput
              className="w-full lg:max-w-xs"
              onChange={(event) => setSearchInputValue(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder={searchableColumn.placeholder}
              value={searchInputValue}
            />

            <InputGroupAddon>
              <Search />
            </InputGroupAddon>

            <InputGroupAddon align="inline-end">
              {table.getFilteredRowModel().rows.length} resultados
            </InputGroupAddon>
          </InputGroup>
        )}

        {stableFilterableColumns && stableFilterableColumns.length > 0 && (
          <div className="flex items-center gap-2">
            {stableFilterableColumns.map((filterCol) => {
              const column = table.getColumn(filterCol.columnKey);

              if (!column) {
                return null;
              }

              if (filterCol.type === "date") {
                return (
                  <DataTableDateFilter
                    column={column}
                    key={filterCol.columnKey}
                    title={filterCol.title}
                  />
                );
              }

              if (filterCol.type === "search") {
                return (
                  <DataTableColumnSearch
                    column={column}
                    key={filterCol.columnKey}
                    placeholder={filterCol.title}
                    title={filterCol.title}
                  />
                );
              }

              return (
                <DataTableColumnFilter
                  column={column}
                  key={filterCol.columnKey}
                  options={filterCol.options}
                  title={filterCol.title}
                />
              );
            })}
          </div>
        )}

        <div className="ml-auto flex gap-2">
          {hasActiveFilters && (
            <Button
              className="hidden h-8 px-2 lg:flex lg:px-3"
              onClick={clearAllFilters}
              variant="ghost"
            >
              <X />
              Limpar filtros
            </Button>
          )}

          <DataTableViewOptions table={table} />
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  Sem resultados para exibir :/
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
