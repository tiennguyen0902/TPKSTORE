import React, { createContext, useContext, useState, ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastItem {
  id: string;
  message: string;
  type?: "success" | "error" | "info";
}

interface ToastContextType {
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  hideToast: (id?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = { id, message, type };

    setToasts(prev => [...prev.slice(-2), newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const hideToast = (id?: string) => {
    if (id) {
      setToasts(prev => prev.filter(t => t.id !== id));
    } else {
      setToasts([]);
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {/* Floating Popup Notifications ở góc trái dưới (Bottom-Left), responsive cho mobile */}
      <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:right-auto sm:left-6 z-[100] flex flex-col gap-2.5 max-w-sm sm:max-w-md pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="p-4 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700/80 animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                t.type === "success"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : t.type === "error"
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              }`}
            >
              {t.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {t.type === "error" && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {t.type === "info" && <Info className="w-5 h-5 text-blue-400" />}
            </div>

            <p className="text-xs font-semibold leading-relaxed text-slate-100 flex-1">
              {t.message}
            </p>

            <button
              onClick={() => hideToast(t.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors text-sm shrink-0 cursor-pointer"
              title="Đóng thông báo"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
