/** biome-ignore-all lint/suspicious/noExplicitAny: required by @TanStack-Table */

import type { Column } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { type HTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

interface DataTableColumnSearchProps<
  TData,
  TValue,
> extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  placeholder: string;
}

export function DataTableColumnSearch<TData, TValue>({
  column,
  title,
  placeholder,
  className,
}: DataTableColumnSearchProps<TData, TValue>) {
  const [searchInputValue, setSearchInputValue] = useState("");

  const applySearch = (searchValue: string) => {
    column.setFilterValue(searchValue || undefined);
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      applySearch(searchInputValue);
    }
  };

  if (!column.getCanFilter()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="-ml-3 h-8 cursor-pointer data-[state=open]:bg-accent"
            size="sm"
            variant="ghost"
          >
            <span>{title}</span>
            <Search />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          <div className="flex flex-col gap-2">
            <InputGroup className="w-full lg:max-w-xs">
              <InputGroupInput
                className="w-full lg:max-w-xs"
                onChange={(event) => setSearchInputValue(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder={placeholder}
                value={searchInputValue}
              />

              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>

            <div className="flex flex-row items-center justify-between pt-2">
              <Button onClick={() => applySearch("")} size="sm" variant="ghost">
                Limpar
              </Button>

              <Button
                onClick={() => applySearch(searchInputValue)}
                size="sm"
                variant="default"
              >
                OK
              </Button>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
