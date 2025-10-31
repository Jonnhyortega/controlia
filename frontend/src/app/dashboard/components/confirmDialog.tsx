"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title = "Confirmar acción",
  message = "¿Estás seguro de continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e)=> e.stopPropagation()}
            className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-3"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {title}
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>

            <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className=" p-[15px_10px] rounded-md bg-gray-300 text-black hover:bg-gray-400"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="p-[15px_10px] rounded-md bg-red-600 text-white hover:bg-red-700"
            >
              {confirmText}
            </button>
          </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
