import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

interface ProductSearchInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
  toggleFilters: () => void;
}

export function ProductSearchInput({
  inputValue,
  setInputValue,
  handleKeyDown,
  handleSearch,
  toggleFilters,
}: ProductSearchInputProps) {
  return (
    <Field className="flex items-center gap-2 md:w-80" orientation="horizontal">
      <InputGroup>
        <InputGroupInput
          id="inline-start-input"
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Procurar por produtos..."
          type="search"
          value={inputValue}
        />

        <InputGroupAddon align="inline-start">
          <Search className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>

      <Button
        className="cursor-pointer bg-amber-900 hover:bg-amber-900/90"
        onClick={handleSearch}
      >
        <Search />
      </Button>

      <Button
        className="cursor-pointer bg-black text-white hover:bg-black/80"
        onClick={toggleFilters}
        variant="secondary"
      >
        <Filter />
      </Button>
    </Field>
  );
}
