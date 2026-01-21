"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, MapPin, Users, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  CalendarEvent,
  CreateEventInput,
  EventCategory,
  EventPriority,
} from "@/types/calendar";

const eventFormSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  category: z.enum([
    "meeting",
    "rally",
    "door-to-door",
    "phone-bank",
    "fundraiser",
    "debate",
    "media",
    "volunteer",
    "training",
    "other",
  ]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  startDate: z.date(),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato: HH:MM"),
  endDate: z.date(),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato: HH:MM"),
  allDay: z.boolean().default(false),
  isVirtual: z.boolean().default(false),
  meetingLink: z.string().url("URL inválida").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2, "Sigla do estado (2 letras)").optional(),
  expectedAttendance: z.coerce.number().int().min(1).optional(),
  tags: z.string().optional(),
  notes: z.string().optional(),
});

type EventFormData = z.infer<typeof eventFormSchema>;

interface EventFormDialogProps {
  open: boolean;
  onClose: () => void;
  event?: CalendarEvent | null;
  defaultDate?: Date;
  onSubmit: (data: CreateEventInput) => Promise<void>;
}

const categories: { value: EventCategory; label: string }[] = [
  { value: "meeting", label: "Reunião" },
  { value: "rally", label: "Comício" },
  { value: "door-to-door", label: "Corpo a Corpo" },
  { value: "phone-bank", label: "Ligações" },
  { value: "fundraiser", label: "Arrecadação" },
  { value: "debate", label: "Debate" },
  { value: "media", label: "Mídia" },
  { value: "volunteer", label: "Voluntários" },
  { value: "training", label: "Treinamento" },
  { value: "other", label: "Outros" },
];

const priorities: { value: EventPriority; label: string }[] = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
  { value: "urgent", label: "Urgente" },
];

export function EventFormDialog({
  open,
  onClose,
  event,
  defaultDate,
  onSubmit,
}: EventFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Use defaultDate if provided, otherwise use current date
  const initialDate = defaultDate || new Date();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema) as any,
    defaultValues: event
      ? {
        title: event.title,
        description: event.description || "",
        category: event.category,
        priority: event.priority,
        startDate: new Date(event.startDate),
        startTime: format(new Date(event.startDate), "HH:mm"),
        endDate: new Date(event.endDate),
        endTime: format(new Date(event.endDate), "HH:mm"),
        allDay: event.allDay,
        isVirtual: event.isVirtual,
        meetingLink: event.meetingLink || "",
        address: event.location?.address || "",
        city: event.location?.city || "",
        state: event.location?.state || "",
        expectedAttendance: event.expectedAttendance,
        tags: event.tags.join(", "),
        notes: event.notes || "",
      }
      : {
        title: "",
        description: "",
        category: "meeting",
        priority: "medium",
        startDate: initialDate,
        startTime: "09:00",
        endDate: initialDate,
        endTime: "10:00",
        allDay: false,
        isVirtual: false,
        meetingLink: "",
        address: "",
        city: "",
        state: "AP",
        tags: "",
        notes: "",
      },
  });

  // Reset form when dialog opens with event or default date
  React.useEffect(() => {
    if (open) {
      if (event) {
        // Editing existing event - pre-fill with event data
        form.reset({
          title: event.title,
          description: event.description || "",
          category: event.category,
          priority: event.priority,
          startDate: new Date(event.startDate),
          startTime: format(new Date(event.startDate), "HH:mm"),
          endDate: new Date(event.endDate),
          endTime: format(new Date(event.endDate), "HH:mm"),
          allDay: event.allDay,
          isVirtual: event.isVirtual,
          meetingLink: event.meetingLink || "",
          address: event.location?.address || "",
          city: event.location?.city || "",
          state: event.location?.state || "",
          expectedAttendance: event.expectedAttendance,
          tags: Array.isArray(event.tags) ? event.tags.join(", ") : "",
          notes: event.notes || "",
        });
      } else {
        // Creating new event - always reset to empty values
        const dateToUse = defaultDate || new Date();
        form.reset({
          title: "",
          description: "",
          category: "meeting",
          priority: "medium",
          startDate: dateToUse,
          startTime: "09:00",
          endDate: dateToUse,
          endTime: "10:00",
          allDay: false,
          isVirtual: false,
          meetingLink: "",
          address: "",
          city: "",
          state: "AP",
          tags: "",
          notes: "",
        });
      }
    }
  }, [open, event, defaultDate, form]);

  const handleSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    try {
      // Combine date and time
      const [startHour, startMinute] = data.startTime.split(":").map(Number);
      const [endHour, endMinute] = data.endTime.split(":").map(Number);

      const startDateTime = new Date(data.startDate);
      startDateTime.setHours(startHour, startMinute, 0, 0);

      const endDateTime = new Date(data.endDate);
      endDateTime.setHours(endHour, endMinute, 0, 0);

      const input: CreateEventInput = {
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        allDay: data.allDay,
        isVirtual: data.isVirtual,
        meetingLink: data.meetingLink || undefined,
        location:
          data.address || data.city
            ? {
              address: data.address || "",
              city: data.city || "",
              state: data.state || "AP",
            }
            : undefined,
        expectedAttendance: data.expectedAttendance,
        tags: data.tags
          ? data.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
          : [],
        notes: data.notes,
      };

      await onSubmit(input);
      form.reset();
    } catch (error) {
      console.error("Failed to submit form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? "Editar Evento" : "Novo Evento"}</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do evento de campanha
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do evento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o evento..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorities.map((pri) => (
                          <SelectItem key={pri.value} value={pri.value}>
                            {pri.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date & Time */}
            <div className="space-y-2">
              <FormLabel>Data e Horário *</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 size-4" />
                              {field.value
                                ? format(field.value, "PPP")
                                : "Selecione"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 size-4" />
                              {field.value
                                ? format(field.value, "PPP")
                                : "Selecione"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* All Day & Virtual */}
            <div className="flex gap-6">
              <FormField
                control={form.control}
                name="allDay"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Dia inteiro</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isVirtual"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Evento virtual</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {/* Meeting Link */}
            {form.watch("isVirtual") && (
              <FormField
                control={form.control}
                name="meetingLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link da Reunião</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://meet.google.com/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Location */}
            {!form.watch("isVirtual") && (
              <div className="space-y-4">
                <FormLabel className="flex items-center gap-2">
                  <MapPin className="size-4" />
                  Localização
                </FormLabel>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Endereço completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Cidade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="UF" maxLength={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Expected Attendance */}
            <FormField
              control={form.control}
              name="expectedAttendance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Users className="size-4" />
                    Público Esperado
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Número de participantes"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="campanha2024, macapá, prioritário (separadas por vírgula)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Separe as tags por vírgula</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações internas sobre o evento..."
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                {event ? "Salvar Alterações" : "Criar Evento"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
