"use client";

import type { ReportSort } from "@/types/reports";
import type { Voter } from "@/types/voters";
import { VOTER_FIELDS_METADATA } from "@/types/reports";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, GripVertical, X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SortConfiguratorProps {
  sorting: ReportSort[];
  onChange: (sorting: ReportSort[]) => void;
}

export function SortConfigurator({ sorting, onChange }: SortConfiguratorProps) {
  const addSort = () => {
    const newSort: ReportSort = {
      field: "name",
      direction: "asc",
    };
    onChange([...sorting, newSort]);
  };

  const removeSort = (index: number) => {
    onChange(sorting.filter((_, i) => i !== index));
  };

  const updateSort = (index: number, updates: Partial<ReportSort>) => {
    const newSorting = [...sorting];
    newSorting[index] = { ...newSorting[index], ...updates };
    onChange(newSorting);
  };

  const toggleDirection = (index: number) => {
    const current = sorting[index];
    updateSort(index, {
      direction: current.direction === "asc" ? "desc" : "asc",
    });
  };

  const moveSort = (index: number, direction: "up" | "down") => {
    const newSorting = [...sorting];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorting.length) return;

    [newSorting[index], newSorting[targetIndex]] = [
      newSorting[targetIndex],
      newSorting[index],
    ];
    onChange(newSorting);
  };

  const getFieldLabel = (field: keyof Voter) => {
    return VOTER_FIELDS_METADATA.find((f) => f.key === field)?.label || field;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Ordenação</h3>
          {sorting.length > 0 && (
            <Badge variant="secondary">{sorting.length} níveis</Badge>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={addSort}>
          <Plus className="h-4 w-4 mr-1" />
          Adicionar
        </Button>
      </div>

      {sorting.length === 0 ? (
        <div className="border border-dashed rounded-lg p-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Nenhuma ordenação definida. Os dados serão exibidos na ordem padrão.
          </p>
          <Button variant="outline" size="sm" onClick={addSort}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Ordenação
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {sorting.map((sort, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 border rounded-lg bg-card"
            >
              {/* Drag Handle */}
              <div className="flex flex-col gap-0.5 cursor-move">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => moveSort(index, "up")}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => moveSort(index, "down")}
                  disabled={index === sorting.length - 1}
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
              </div>

              {/* Order Badge */}
              <Badge variant="outline" className="w-8 justify-center">
                {index + 1}
              </Badge>

              {/* Field Selector */}
              <Select
                value={sort.field as string}
                onValueChange={(value) =>
                  updateSort(index, { field: value as keyof Voter })
                }
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VOTER_FIELDS_METADATA.map((field) => (
                    <SelectItem
                      key={field.key as string}
                      value={field.key as string}
                    >
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Direction Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleDirection(index)}
                className="gap-2"
              >
                {sort.direction === "asc" ? (
                  <>
                    <ArrowUp className="h-4 w-4" />
                    Crescente
                  </>
                ) : (
                  <>
                    <ArrowDown className="h-4 w-4" />
                    Decrescente
                  </>
                )}
              </Button>

              {/* Remove Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSort(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {sorting.length > 1 && (
        <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
          <strong>Ordem de prioridade:</strong> Os dados serão ordenados
          primeiro por <strong>{getFieldLabel(sorting[0].field)}</strong>
          {sorting.length > 1 && (
            <>
              , depois por <strong>{getFieldLabel(sorting[1].field)}</strong>
              {sorting.length > 2 && `, e assim por diante`}
            </>
          )}
          .
        </div>
      )}
    </div>
  );
}
