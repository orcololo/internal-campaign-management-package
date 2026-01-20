"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Users,
  BarChart3,
  MapPin,
  Home,
  FileText,
  Plus,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

const commands = [
  {
    group: "Navegação",
    items: [
      { icon: Home, label: "Dashboard", value: "dashboard", href: "/" },
      { icon: Users, label: "Eleitores", value: "voters", href: "/voters" },
      {
        icon: BarChart3,
        label: "Análises",
        value: "analytics",
        href: "/analytics",
      },
      {
        icon: Calendar,
        label: "Calendário",
        value: "calendar",
        href: "/calendar",
      },
      { icon: MapPin, label: "Mapas", value: "maps", href: "/maps" },
    ],
  },
  {
    group: "Ações Rápidas",
    items: [
      {
        icon: Plus,
        label: "Novo Eleitor",
        value: "new-voter",
        href: "/voters/new",
      },
      {
        icon: Calendar,
        label: "Novo Evento",
        value: "new-event",
        href: "/calendar?new=true",
      },
    ],
  },
  {
    group: "Configurações",
    items: [
      { icon: User, label: "Perfil", value: "profile", href: "/profile" },
      {
        icon: Settings,
        label: "Configurações",
        value: "settings",
        href: "/settings",
      },
    ],
  },
];

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();

  const handleSelect = React.useCallback(
    (href: string) => {
      onOpenChange(false);
      router.push(href);
    },
    [onOpenChange, router]
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Digite um comando ou busque..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

        {commands.map((group) => (
          <React.Fragment key={group.group}>
            <CommandGroup heading={group.group}>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => handleSelect(item.href)}
                  >
                    <Icon className="mr-2 size-4" />
                    <span>{item.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
          </React.Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

// Hook to manage search dialog state
export function useSearchDialog() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return { open, setOpen };
}
