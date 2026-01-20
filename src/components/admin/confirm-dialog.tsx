"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Trash2, RefreshCw, Send, UserX, Ban } from "lucide-react";
import { cn } from "@/lib/utils";

export type ConfirmDialogVariant = "danger" | "warning" | "info";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  variant?: ConfirmDialogVariant;
  loading?: boolean;
  icon?: "trash" | "warning" | "refresh" | "send" | "user" | "ban";
}

const iconMap = {
  trash: Trash2,
  warning: AlertTriangle,
  refresh: RefreshCw,
  send: Send,
  user: UserX,
  ban: Ban,
};

const variantStyles = {
  danger: {
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    buttonClass: "bg-red-600 hover:bg-red-700 focus:ring-red-600",
  },
  warning: {
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    buttonClass: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-600",
  },
  info: {
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    buttonClass: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-600",
  },
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  variant = "danger",
  loading = false,
  icon = "warning",
}: ConfirmDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const Icon = iconMap[icon];
  const styles = variantStyles[variant];

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  const isProcessing = loading || isLoading;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            <div className={cn("p-3 rounded-full", styles.iconBg)}>
              <Icon className={cn("w-6 h-6", styles.iconColor)} />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-lg font-semibold text-gray-900">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-2 text-sm text-gray-600">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={isProcessing}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isProcessing}
            className={cn(
              "text-white",
              styles.buttonClass,
              isProcessing && "opacity-50 cursor-not-allowed"
            )}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Hook for easier usage
export function useConfirmDialog() {
  const [state, setState] = React.useState<{
    open: boolean;
    title: string;
    description: string;
    confirmText: string;
    variant: ConfirmDialogVariant;
    icon: keyof typeof iconMap;
    onConfirm: () => void | Promise<void>;
  }>({
    open: false,
    title: "",
    description: "",
    confirmText: "Confirm",
    variant: "danger",
    icon: "warning",
    onConfirm: () => {},
  });

  const confirm = React.useCallback(
    (options: {
      title: string;
      description: string;
      confirmText?: string;
      variant?: ConfirmDialogVariant;
      icon?: keyof typeof iconMap;
    }): Promise<boolean> => {
      return new Promise((resolve) => {
        setState({
          open: true,
          title: options.title,
          description: options.description,
          confirmText: options.confirmText || "Confirm",
          variant: options.variant || "danger",
          icon: options.icon || "warning",
          onConfirm: () => {
            setState((prev) => ({ ...prev, open: false }));
            resolve(true);
          },
        });
      });
    },
    []
  );

  const close = React.useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const DialogComponent = React.useMemo(
    () => (
      <ConfirmDialog
        open={state.open}
        onOpenChange={(open) => {
          if (!open) close();
        }}
        title={state.title}
        description={state.description}
        confirmText={state.confirmText}
        variant={state.variant}
        icon={state.icon}
        onConfirm={state.onConfirm}
      />
    ),
    [state, close]
  );

  return { confirm, DialogComponent };
}
