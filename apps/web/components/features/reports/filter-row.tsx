"use client";

import { useState } from "react";
import type { ReportFilter, FilterOperator } from "@/types/reports";
import { VOTER_FIELDS_METADATA, getOperatorLabel } from "@/types/reports";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface FilterRowProps {
  filter: ReportFilter;
  onUpdate: (filter: ReportFilter) => void;
  onRemove: () => void;
  showLogicalOperator?: boolean;
}

export function FilterRow({
  filter,
  onUpdate,
  onRemove,
  showLogicalOperator = true,
}: FilterRowProps) {
  const [selectedField, setSelectedField] = useState(filter.field);
  const fieldMetadata = VOTER_FIELDS_METADATA.find((f) => f.key === selectedField);

  const handleFieldChange = (field: string) => {
    const newField = field as any;
    const newMetadata = VOTER_FIELDS_METADATA.find((f) => (f.key as string) === field);
    setSelectedField(newField);
    onUpdate({
      ...filter,
      field: newField,
      operator: newMetadata?.operators[0] || "equals",
      value: "",
    });
  };

  const handleOperatorChange = (operator: string) => {
    onUpdate({
      ...filter,
      operator: operator as FilterOperator,
      value: operator === "isEmpty" || operator === "isNotEmpty" ? null : filter.value,
    });
  };

  const handleValueChange = (value: any) => {
    onUpdate({ ...filter, value });
  };

  const handleLogicalOperatorChange = (logicalOperator: "AND" | "OR") => {
    onUpdate({ ...filter, logicalOperator });
  };

  const renderValueInput = () => {
    if (!fieldMetadata) return null;

    // Operators that don't need value input
    if (filter.operator === "isEmpty" || filter.operator === "isNotEmpty") {
      return (
        <div className="flex items-center justify-center h-10 px-3 text-sm text-muted-foreground">
          (sem valor)
        </div>
      );
    }

    // Date inputs
    if (fieldMetadata.type === "date") {
      if (filter.operator === "between") {
        return (
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filter.value?.[0] ? format(new Date(filter.value[0]), "PPP", { locale: ptBR }) : "De"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filter.value?.[0] ? new Date(filter.value[0]) : undefined}
                  onSelect={(date) => handleValueChange([date, filter.value?.[1]])}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filter.value?.[1] ? format(new Date(filter.value[1]), "PPP", { locale: ptBR }) : "Até"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filter.value?.[1] ? new Date(filter.value[1]) : undefined}
                  onSelect={(date) => handleValueChange([filter.value?.[0], date])}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        );
      }

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filter.value ? format(new Date(filter.value), "PPP", { locale: ptBR }) : "Selecione uma data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filter.value ? new Date(filter.value) : undefined}
              onSelect={(date) => handleValueChange(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      );
    }

    // Enum/Multi-select inputs
    if (fieldMetadata.type === "enum" || filter.operator === "in" || filter.operator === "notIn") {
      const values = Array.isArray(filter.value) ? filter.value : filter.value ? [filter.value] : [];
      const options = fieldMetadata.enumValues || [];

      return (
        <div className="flex flex-col gap-2">
          <Select
            onValueChange={(val) => {
              if (!values.includes(val)) {
                handleValueChange([...values, val]);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione valores..." />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {values.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {values.map((val) => (
                <Badge key={val} variant="secondary" className="gap-1">
                  {val}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleValueChange(values.filter((v) => v !== val))}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Number inputs with between
    if (fieldMetadata.type === "number" && filter.operator === "between") {
      return (
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Mínimo"
            value={filter.value?.[0] || ""}
            onChange={(e) => handleValueChange([Number(e.target.value), filter.value?.[1]])}
          />
          <Input
            type="number"
            placeholder="Máximo"
            value={filter.value?.[1] || ""}
            onChange={(e) => handleValueChange([filter.value?.[0], Number(e.target.value)])}
          />
        </div>
      );
    }

    // Number inputs
    if (fieldMetadata.type === "number") {
      return (
        <Input
          type="number"
          placeholder="Valor"
          value={filter.value || ""}
          onChange={(e) => handleValueChange(Number(e.target.value))}
        />
      );
    }

    // Boolean inputs
    if (fieldMetadata.type === "boolean") {
      return (
        <Select value={filter.value?.toString()} onValueChange={(v) => handleValueChange(v === "true")}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Sim</SelectItem>
            <SelectItem value="false">Não</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    // Default string input
    return (
      <Input
        type="text"
        placeholder="Valor"
        value={filter.value || ""}
        onChange={(e) => handleValueChange(e.target.value)}
      />
    );
  };

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-lg bg-card">
      <div className="flex items-start gap-2">
        {/* Logical Operator (AND/OR) */}
        {showLogicalOperator && (
          <Select
            value={filter.logicalOperator || "AND"}
            onValueChange={handleLogicalOperatorChange}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AND">E</SelectItem>
              <SelectItem value="OR">OU</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Field Selector */}
        <Select value={selectedField as string} onValueChange={handleFieldChange}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Selecione o campo..." />
          </SelectTrigger>
          <SelectContent>
            {VOTER_FIELDS_METADATA.map((field) => (
              <SelectItem key={field.key as string} value={field.key as string}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Operator Selector */}
        {fieldMetadata && (
          <Select value={filter.operator} onValueChange={handleOperatorChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fieldMetadata.operators.map((op) => (
                <SelectItem key={op} value={op}>
                  {getOperatorLabel(op)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Remove Button */}
        <Button variant="ghost" size="icon" onClick={onRemove}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Value Input */}
      <div className="flex-1">{renderValueInput()}</div>
    </div>
  );
}
