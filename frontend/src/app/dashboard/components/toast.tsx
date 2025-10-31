"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info } from "lucide-react";

interface ToastProps {
  show: boolean;
  type?: "success" | "error" | "info";
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({
  show,
  type = "info",
  message,
  onClose,
  duration = 2500,
}: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const icon =
    type === "success" ? (
      <CheckCircle className="text-green-500 w-5 h-5" />
    ) : type === "error" ? (
      <XCircle className="text-red-500 w-5 h-5" />
    ) : (
      <Info className="text-blue-500 w-5 h-5" />
    );

  const bg =
    type === "success"
      ? "bg-green-50 border-green-400"
      : type === "error"
      ? "bg-red-50 border-red-400"
      : "bg-blue-50 border-blue-400";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 border px-4 py-3 rounded-xl shadow-md ${bg}`}
        >
          {icon}
          <p className="text-gray-800 text-sm font-medium">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
