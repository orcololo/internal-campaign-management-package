"use client";

import { useState } from "react";
import type { Voter } from "@/types/voters";
import { VOTER_FIELDS_METADATA, VOTER_FIELD_CATEGORIES } from "@/types/reports";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface ColumnSelectorProps {
  selectedColumns: Array<keyof Voter>;
  onChange: (columns: Array<keyof Voter>) => void;
}

export function ColumnSelector({ selectedColumns, onChange }: ColumnSelectorProps) {
  const [expanded, setExpanded] = useState<string[]>(["basic", "contact"]);

  const toggleColumn = (column: keyof Voter) => {
    if (selectedColumns.includes(column)) {
      onChange(selectedColumns.filter((c) => c !== column));
    } else {
      onChange([...selectedColumns, column]);
    }
  };

  const selectAllInCategory = (category: string) => {
    const categoryFields = VOTER_FIELDS_METADATA.filter((f) => f.category === category).map(
      (f) => f.key
    );
    const newColumns = [...selectedColumns];
    categoryFields.forEach((field) => {
      if (!newColumns.includes(field)) {
        newColumns.push(field);
      }
    });
    onChange(newColumns);
  };

  const clearAllInCategory = (category: string) => {
    const categoryFields = VOTER_FIELDS_METADATA.filter((f) => f.category === category).map(
      (f) => f.key
    );
    onChange(selectedColumns.filter((c) => !categoryFields.includes(c)));
  };

  const selectAll = () => {
    onChange(VOTER_FIELDS_METADATA.map((f) => f.key));
  };

  const clearAll = () => {
    onChange([]);
  };

  const getCategoryCount = (category: string) => {
    const categoryFields = VOTER_FIELDS_METADATA.filter((f) => f.category === category).map(
      (f) => f.key
    );
    return selectedColumns.filter((c) => categoryFields.includes(c)).length;
  };

  const categories = Object.entries(VOTER_FIELD_CATEGORIES);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Colunas Selecionadas</h3>
          <Badge variant="secondary">{selectedColumns.length}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={selectAll}>
            Selecionar Todas
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll}>
            Limpar
          </Button>
        </div>
      </div>

      <Accordion type="multiple" value={expanded} onValueChange={setExpanded} className="w-full">
        {categories.map(([key, label]) => {
          const categoryFields = VOTER_FIELDS_METADATA.filter((f) => f.category === key);
          const selectedCount = getCategoryCount(key);

          return (
            <AccordionItem key={key} value={key}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="text-sm font-medium">{label}</span>
                  <Badge variant={selectedCount > 0 ? "default" : "outline"} className="text-xs">
                    {selectedCount}/{categoryFields.length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <div className="flex gap-2 pb-2 border-b">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => selectAllInCategory(key)}
                    >
                      Todos
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => clearAllInCategory(key)}
                    >
                      Nenhum
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {categoryFields.map((field) => (
                      <div key={field.key as string} className="flex items-center space-x-2">
                        <Checkbox
                          id={field.key as string}
                          checked={selectedColumns.includes(field.key)}
                          onCheckedChange={() => toggleColumn(field.key)}
                        />
                        <Label
                          htmlFor={field.key as string}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {field.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
