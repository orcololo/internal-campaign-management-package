import { useState, useEffect } from "react";
import { settingsApi } from "@/lib/api/settings";
import { toast } from "sonner";

export function useSetting<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const setting = await settingsApi.getByKey(key);
        if (setting) {
          setValue(setting.value as T);
        }
      } catch (error) {
        console.error(`Failed to load setting ${key}`, error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [key]);

  const save = async (newValue: T) => {
    try {
      setValue(newValue); // Optimistic update
      await settingsApi.update(key, newValue);
      toast.success("Configuração salva");
    } catch (error) {
      console.error(`Failed to save setting ${key}`, error);
      toast.error("Erro ao salvar configuração");
      // Revert could be implemented here if needed
    }
  };

  return { value, save, loading };
}
