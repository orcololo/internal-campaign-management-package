import { toast } from "sonner";

export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string, error?: unknown) => {
    console.error(error);
    toast.error(message);
  },
  promise: <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) => toast.promise(promise, messages),
};
