import type { Column } from "@tanstack/react-table";
import { format } from "date-fns";
import { CalendarDays, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface DataTableDateFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableDateFilter<TData, TValue>({
  column,
  title,
}: DataTableDateFilterProps<TData, TValue>) {
  const value = column.getFilterValue() as
    | [Date | null, Date | null]
    | undefined;

  const [open, setOpen] = useState(false);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          className="cursor-pointer border-dashed"
          size="sm"
          variant="outline"
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          {title}
          {/** biome-ignore lint/complexity/useOptionalChain: not important... */}
          {value && value[0] && value[1] && (
            <span className="ml-2 font-normal text-xs">
              {format(value[0], "dd/MM/yyyy")} -{" "}
              {format(value[1], "dd/MM/yyyy")}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <div className="flex flex-col gap-2 p-4">
          <Calendar
            mode="range"
            onSelect={(range) => column.setFilterValue(range)}
            selected={
              value
                ? { from: value[0] ?? undefined, to: value[1] ?? undefined }
                : undefined
            }
          />

          <div className="flex items-center justify-between">
            <Button
              className="cursor-pointer"
              onClick={() => column.setFilterValue(undefined)}
              size="sm"
              variant="ghost"
            >
              <X className="mr-1 h-4 w-4" />
              Limpar
            </Button>
            <Button
              className="cursor-pointer"
              onClick={() => setOpen(false)}
              size="sm"
              variant="default"
            >
              OK
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
