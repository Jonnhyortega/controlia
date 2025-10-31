"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  BadgePlus,
  BookOpenCheck,
  XCircle,
} from "lucide-react";

import SalesForm from "./components/salesForm";
import CloseCashForm from "./components/CloseCashForm";
import { getTodayDailySales, api } from "../../utils/api";
import { Toast } from "../dashboard/components/toast";
import { ConfirmDialog } from "../dashboard/components/confirmDialog";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSale, setExpandedSale] = useState<number | null>(null);
  const [showSalesForm, setShowSalesForm] = useState(false);
  const [showCloseCashForm, setShowCloseCashForm] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  // 🔹 Toast & ConfirmDialog
  const [toast, setToast] = useState({
    show: false,
    type: "info" as "success" | "error" | "info",
    message: "",
  });

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // ⏰ Reloj en tiempo real
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("es-AR", {
          timeZone: "America/Argentina/Buenos_Aires",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 📊 Cargar ventas del día actual
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTodayDailySales();
        setData(response);
      } catch (err: any) {
        console.error("❌ Error cargando ventas del día:", err);
        setToast({
          show: true,
          type: "error",
          message:
            err?.response?.data?.message ||
            "No se encontraron operaciones del día.",
        });
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 📅 Fecha actual
  const today = new Date();
  const formattedDate = today.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const totalSales = data?.totalSalesAmount || data?.totalSales || 0;
  const salesList = data?.sales || [];

  // 🧾 Revertir venta
  const handleRevertSale = (saleId: string) => {
    setConfirmDialog({
      open: true,
      title: "¿Anular venta?",
      message:
        "Esta acción revertirá la venta y devolverá el stock de los productos involucrados.",
      onConfirm: async () => {
        try {
          const res = await api.post(`/sales/${saleId}/revert`);
          setToast({
            show: true,
            type: "success",
            message: res.data?.message || "Venta anulada correctamente.",
          });
          const updated = await getTodayDailySales();
          setData(updated);
        } catch (error: any) {
          console.error("Error al anular venta:", error);
          setToast({
            show: true,
            type: "error",
            message:
              error?.response?.data?.message || "Error al anular la venta.",
          });
        } finally {
          setConfirmDialog({ ...confirmDialog, open: false });
        }
      },
    });
  };

  // 🔄 Estado de carga
  if (loading)
    return (
      <section className="p-10 text-center text-gray-500">
        <p className="text-lg">Cargando ventas del día...</p>
      </section>
    );

  // 📉 Si no hay datos ni ventas
  if (!data || salesList.length === 0) {
    return (
      <section className="p-10 text-center bg-white rounded-2xl border border-gray-200 shadow-md">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          No hay operaciones registradas hoy 💤
        </h2>
        <p className="text-gray-500 mb-6">
          Aún no se registraron ventas ni cierres de caja para el día{" "}
          <span className="font-semibold text-blue-600">{formattedDate}</span>.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowSalesForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-md transition-all flex items-center gap-2"
          >
            <BadgePlus /> Nueva venta
          </button>
          <button
            onClick={() => setShowCloseCashForm(true)}
            className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg shadow-md transition-all flex items-center gap-2"
          >
            <BookOpenCheck /> Cerrar caja
          </button>
        </div>

        {/* Formularios replegables */}
        <AnimatePresence>
          {showSalesForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 overflow-hidden"
            >
              <SalesForm
                onBack={() => setShowSalesForm(false)}
                onCreated={setData}
              />
            </motion.div>
          )}

          {showCloseCashForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 overflow-hidden"
            >
              <CloseCashForm onBack={() => setShowCloseCashForm(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        <Toast
          show={toast.show}
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ ...toast, show: false })}
        />
      </section>
    );
  }

  // ✅ Si hay datos del día
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* 🔹 Encabezado */}
      <div className="flex flex-wrap flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Ventas del día
          </h2>
          <p className="text-sm opacity-90 mt-1">
            Panel general de actividad y recaudación
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <span className="px-4 py-2 rounded-lg text-lg font-semibold">
            {formattedDate}
          </span>
          <span className="px-4 py-2 rounded-lg text-lg font-semibold">
            {currentTime}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => setShowSalesForm((prev) => !prev)}
            className={`${
              showSalesForm
                ? "bg-gray-500 hover:bg-gray-600"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white px-6 py-2.5 rounded-lg shadow-md transition-all flex justify-between gap-2`}
          >
            {showSalesForm ? <XCircle /> : <BadgePlus />}
            {showSalesForm ? "Cerrar formulario" : "Nueva venta"}
          </button>

          <button
            onClick={() => setShowCloseCashForm((prev) => !prev)}
            className={`${
              showCloseCashForm
                ? "bg-gray-500 hover:bg-gray-600"
                : "bg-gray-800 hover:bg-gray-900"
            } text-white px-6 py-2.5 rounded-lg shadow-md transition-all flex justify-center gap-2`}
          >
            {showCloseCashForm ? <XCircle /> : <BookOpenCheck />}
            {showCloseCashForm ? "Cerrar formulario" : "Cerrar caja"}
          </button>
        </div>
      </div>

      {/* 🔹 Formularios animados */}
      <AnimatePresence>
        {showSalesForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SalesForm
              onBack={() => setShowSalesForm(false)}
              onCreated={setData}
            />
          </motion.div>
        )}

        {showCloseCashForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CloseCashForm onBack={() => setShowCloseCashForm(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Total del día */}
      <motion.div
        key="summary"
        className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-md rounded-2xl p-8 text-center mt-6"
      >
        <h3 className="text-lg font-semibold text-gray-700 mb-2 uppercase tracking-wide">
          Total del día
        </h3>
        <p className="text-5xl font-extrabold text-blue-600 drop-shadow-sm">
          {totalSales.toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          })}
        </p>

        {/* 🧾 Listado de ventas */}
      <div className="mt-8 overflow-x-auto min-h-[89vh]">
        <table className="w-full border border-gray-200 rounded-2xl overflow-hidden text-sm">
           <thead className="bg-linear-to-r from-blue-50 to-blue-100 text-gray-700 border-b">
              <tr>
                <th className="py-3 px-4 text-left font-semibold">#</th>
                <th className="py-3 px-4 text-left font-semibold">Hora</th>
                <th className="py-3 px-4 text-left font-semibold">Método</th>
                <th className="py-3 px-4 text-left font-semibold">Productos</th>
                <th className="py-3 px-4 text-right font-semibold">Total</th>
                <th className="py-3 px-4 text-center font-semibold">Acciones</th>
              </tr>
            </thead>

    <tbody className="divide-y divide-gray-100">
      {salesList.map((sale: any, i: number) => (
        <tr
          key={sale._id}
          className="hover:bg-blue-300 transition-colors duration-200 cursor-pointer"
          onClick={() => setExpandedSale(expandedSale === i ? null : i)}
        >
          <td className="py-3 px-4 font-semibold text-gray-700">#{i + 1}</td>
          <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
            {new Date(sale.createdAt).toLocaleString("es-AR", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </td>

          <td className="py-3 px-4 capitalize font-medium text-blue-700">
            {sale.paymentMethod || "—"}
          </td>
          <td className="py-3 px-4 text-gray-700">
            <div className="truncate max-w-xs text-left">
              {sale.products
                ?.map((p: any) => `${p.product?.name || p.name} ×${p.quantity}`)
                .join(", ")}
            </div>
          </td>
          <td className="py-3 px-4 text-right font-semibold text-gray-900">
            {sale.total.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </td>
          <td className="py-3 px-4 text-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRevertSale(sale._id);
              }}
              className="text-red-600 hover:text-red-800 font-semibold transition-colors"
            >
              Anular
            </button>
          </td>
        </tr>
      ))}

      {/* 🔽 Fila expandida con detalle */}
      {expandedSale !== null && salesList[expandedSale] && (
        <tr className="bg-gray-50">
          <td colSpan={6} className="px-6 py-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border border-gray-200 bg-white shadow-sm p-4"
            >
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                Operacion {expandedSale+1}
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                {salesList[expandedSale].products?.map((p: any, j: number) => (
                  <li
                    key={j}
                    className="flex justify-between border-b border-gray-100 py-1 hover:bg-gray-50 rounded-md px-2 transition-all"
                  >
                    <small>#{j+1}</small>
                    <span className="font-medium text-gray-900">
                      {p.product?.name || p.name}
                    </span>
                    <span className="text-gray-600">
                      {p.quantity} ×{" "}
                      {p.price.toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </td>
        </tr>
      )}
    </tbody>
        </table>
      </div>

      </motion.div>

      {/* 🔹 Toast & ConfirmDialog */}
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, show: false })}
        duration={3000}
      />
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
      />
    </motion.div>
  );
}
