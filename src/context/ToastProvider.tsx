"use client";

import React, { createContext, useContext, useCallback, useRef, useState } from "react";
import { CheckCircle2, XCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => dismiss(id), 3500);
    },
    [dismiss]
  );

  const value: ToastContextValue = {
    toast,
    success: (m) => toast(m, "success"),
    error: (m) => toast(m, "error"),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map((t) => {
          const border =
            t.type === "success"
              ? "border-black/5"
              : t.type === "error"
                ? "border-rose-200"
                : "border-black/5";
          const iconColor =
            t.type === "success"
              ? "text-black/60"
              : t.type === "error"
                ? "text-rose-600"
                : "text-black/60";
          const textColor =
            t.type === "success"
              ? "text-black"
              : t.type === "error"
                ? "text-black"
                : "text-black";
          const Icon =
            t.type === "success" ? CheckCircle2 : t.type === "error" ? XCircle : Info;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => dismiss(t.id)}
              className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl border ${border} bg-white shadow-2xl backdrop-blur text-sm font-medium`}
            >
              <Icon className={`w-4 h-4 ${iconColor}`} />
              <span className={textColor}>{t.message}</span>
            </button>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
