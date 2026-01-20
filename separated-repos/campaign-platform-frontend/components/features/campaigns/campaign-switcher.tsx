"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Mock campaigns data
const campaigns = [
  {
    id: "1",
    name: "Campanha Prefeito 2026",
    role: "Candidato",
    status: "active",
  },
  {
    id: "2",
    name: "Campanha Vereador 2026",
    role: "Estrategista",
    status: "active",
  },
  {
    id: "3",
    name: "Campanha Deputado 2024",
    role: "Liderança",
    status: "archived",
  },
];

export function CampaignSwitcher() {
  const [open, setOpen] = React.useState(false);
  const [selectedCampaign, setSelectedCampaign] = React.useState(campaigns[0]);

  const activeCampaigns = campaigns.filter((c) => c.status === "active");
  const archivedCampaigns = campaigns.filter((c) => c.status === "archived");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[280px] justify-between"
        >
          <div className="flex flex-col items-start">
            <span className="font-semibold text-sm">
              {selectedCampaign.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {selectedCampaign.role}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <Command>
          <CommandInput placeholder="Buscar campanha..." />
          <CommandList>
            <CommandEmpty>Nenhuma campanha encontrada.</CommandEmpty>

            {activeCampaigns.length > 0 && (
              <CommandGroup heading="Campanhas Ativas">
                {activeCampaigns.map((campaign) => (
                  <CommandItem
                    key={campaign.id}
                    onSelect={() => {
                      setSelectedCampaign(campaign);
                      setOpen(false);
                    }}
                    className="flex flex-col items-start"
                  >
                    <div className="flex items-center w-full">
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          selectedCampaign.id === campaign.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {campaign.role}
                        </div>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {archivedCampaigns.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Arquivadas">
                  {archivedCampaigns.map((campaign) => (
                    <CommandItem
                      key={campaign.id}
                      onSelect={() => {
                        setSelectedCampaign(campaign);
                        setOpen(false);
                      }}
                      className="flex flex-col items-start"
                    >
                      <div className="flex items-center w-full">
                        <Check
                          className={cn(
                            "mr-2 size-4",
                            selectedCampaign.id === campaign.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {campaign.role}
                          </div>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  // TODO: Open create campaign dialog
                  alert("Criar nova campanha - Em desenvolvimento");
                }}
              >
                <Plus className="mr-2 size-4" />
                <span>Nova Campanha</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
