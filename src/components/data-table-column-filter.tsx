import type { Column } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";
import { type HTMLAttributes, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";

interface DataTableColumnFilterProps<
  TData,
  TValue,
> extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export function DataTableColumnFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableColumnFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            className="cursor-pointer border-dashed"
            size="sm"
            variant="outline"
          >
            <PlusCircle className="mr-1 h-4 w-4" />
            {title}
            {selectedValues?.size > 0 && (
              <>
                <Separator className="mx-2 h-4" orientation="vertical" />

                <Badge
                  className="rounded-md px-1 font-normal lg:hidden"
                  variant="secondary"
                >
                  {selectedValues.size}
                </Badge>

                <div className="hidden space-x-1 lg:flex">
                  {selectedValues.size > 2 ? (
                    <Badge
                      className="rounded-md px-1 font-normal"
                      variant="secondary"
                    >
                      {selectedValues.size} selecionados
                    </Badge>
                  ) : (
                    options
                      .filter((option) => selectedValues.has(option.value))
                      .map((option) => (
                        <Badge
                          className="rounded-sm px-1 font-normal"
                          key={option.value}
                          variant="secondary"
                        >
                          {option.label}
                        </Badge>
                      ))
                  )}
                </div>
              </>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-50 p-0">
          <Command>
            <CommandInput placeholder={title} />

            <CommandList>
              <CommandEmpty>Nenhum resultado encontrado :/</CommandEmpty>

              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValues.has(option.value);

                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        const current = Array.isArray(column.getFilterValue())
                          ? new Set(column.getFilterValue() as string[])
                          : new Set<string>();

                        if (isSelected) {
                          current.delete(option.value);
                        } else {
                          current.add(option.value);
                        }

                        const filterValues = Array.from(current);
                        column.setFilterValue(
                          filterValues.length ? filterValues : undefined,
                        );
                      }}

                      // onSelect={() => {
                      // 	if (isSelected) {
                      // 		selectedValues.delete(option.value);
                      // 	} else {
                      // 		selectedValues.add(option.value);
                      // 	}

                      // 	const filterValues = Array.from(selectedValues);

                      // 	column?.setFilterValue(
                      // 		filterValues.length ? filterValues : undefined
                      // 	);
                      // }}
                    >
                      <Checkbox checked={isSelected} className="h-4 w-4 p-0" />

                      {option.icon && (
                        <option.icon className="h-4 w-4 text-muted-foreground" />
                      )}

                      <span>{option.label}</span>
                      {facets?.get(option.value) && (
                        <span className="ml-auto flex h-4 w-4 items-center font-mono text-xs">
                          {facets.get(option.value)}
                        </span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>

              {selectedValues.size > 0 && (
                <>
                  <CommandSeparator />

                  <CommandGroup>
                    <CommandItem
                      className="justify-center text-center"
                      onSelect={() => column?.setFilterValue(undefined)}
                    >
                      Limpar filtros
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>
        <Button className="border-dashed" size="sm" variant="outline">
          <PlusCircle className="mr-1 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator className="mx-2 h-4" orientation="vertical" />

              <Badge
                className="rounded-md px-1 font-normal lg:hidden"
                variant="secondary"
              >
                {selectedValues.size}
              </Badge>

              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    className="rounded-md px-1 font-normal"
                    variant="secondary"
                  >
                    {selectedValues.size} selecionados
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        className="rounded-sm px-1 font-normal"
                        key={option.value}
                        variant="secondary"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <div className="mt-4 border-t">
          <Command>
            <CommandInput placeholder={title} />

            <CommandList>
              <CommandEmpty>Nenhum resultado encontrado :/</CommandEmpty>

              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValues.has(option.value);

                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        const current = Array.isArray(column.getFilterValue())
                          ? new Set(column.getFilterValue() as string[])
                          : new Set<string>();

                        if (isSelected) {
                          current.delete(option.value);
                        } else {
                          current.add(option.value);
                        }

                        const filterValues = Array.from(current);
                        column.setFilterValue(
                          filterValues.length ? filterValues : undefined,
                        );
                      }}
                    >
                      <Checkbox checked={isSelected} className="h-4 w-4 p-0" />

                      {option.icon && (
                        <option.icon className="h-4 w-4 text-muted-foreground" />
                      )}

                      <span>{option.label}</span>
                      {facets?.get(option.value) && (
                        <span className="ml-auto flex h-4 w-4 items-center font-mono text-xs">
                          {facets.get(option.value)}
                        </span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>

              {selectedValues.size > 0 && (
                <>
                  <CommandSeparator />

                  <CommandGroup>
                    <CommandItem
                      className="justify-center text-center"
                      onSelect={() => column?.setFilterValue(undefined)}
                    >
                      Limpar filtros
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
