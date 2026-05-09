import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToasterProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

export const Toaster: React.FC<ToasterProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-8 right-8 z-[10001] flex flex-col gap-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{ toast: Toast; onRemove: () => void }> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(onRemove, toast.duration || 5000);
    return () => clearTimeout(timer);
  }, [onRemove, toast.duration]);

  const icons = {
    success: <CheckCircle2 className="text-green-400" size={20} />,
    error: <AlertCircle className="text-red-400" size={20} />,
    info: <Info className="text-brand-primary" size={20} />,
    warning: <AlertCircle className="text-yellow-400" size={20} />,
  };

  const colors = {
    success: "border-green-500/20 bg-green-500/5",
    error: "border-red-500/20 bg-red-500/5",
    info: "border-brand-primary/20 bg-brand-primary/5",
    warning: "border-yellow-500/20 bg-yellow-500/5",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={cn(
        "pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-[24px] border backdrop-blur-xl shadow-2xl min-w-[320px] max-w-md",
        colors[toast.type]
      )}
    >
      <div className="shrink-0">{icons[toast.type]}</div>
      <p className="flex-1 text-sm font-medium text-white/90 leading-snug">{toast.message}</p>
      <button 
        onClick={onRemove}
        className="shrink-0 p-1 rounded-lg hover:bg-white/5 text-white/20 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};
