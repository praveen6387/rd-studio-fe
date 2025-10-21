"use client";
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export function LoadingToaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastProvider duration={4000}>
      {toasts.map(function ({ id, title, description, action, loader = "bg-slate-200", ...props }) {
        return (
          <Toast key={id} {...props}>
            {loader && (
              <div className={cn("absolute bottom-0 left-0 right-0 h-1 animate-toast-progress 2s z-50", loader)}></div>
            )}

            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>

            {action ? (
              action
            ) : (
              <ToastAction altText="Dismiss Toast" onClick={dismiss}>
                Dismiss
              </ToastAction>
            )}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
