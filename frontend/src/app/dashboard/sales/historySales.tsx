"use client";

import { useState, useEffect } from "react";
import { getDailyCashByDate, getClosedCashDays } from "../../../utils/api";
import { ChevronDown, ChevronUp, DollarSign, FileText, ShoppingCart, TrendingUp } from "lucide-react";

interface DailySale {
  date: string;
  totalSalesAmount: number;
  totalOperations: number;
  sales: any[];
}

export default function HistorySales() {
  const [dates, setDates] = useState<any[]>([]);
  const [openDate, setOpenDate] = useState<string | null>(null);
  const [salesData, setSalesData] = useState<Record<string, DailySale>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDays = async () => {
      try {
        const days = await getClosedCashDays();
        // ordenamos por fecha descendente
        const sorted = [...days].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setDates(sorted);
      } catch (err) {
        console.error("Error al obtener días:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDays();
  }, []);

  const toggleDate = async (date: string) => {
    if (openDate === date) return setOpenDate(null);

    if (!salesData[date]) {
      try {
        const data = await getDailyCashByDate(date);
        setSalesData((prev) => ({ ...prev, [date]: data }));
      } catch (err) {
        console.error("Error al obtener ventas del día:", date, err);
      }
    }

    setOpenDate(date);
  };

  if (loading) return <p className="p-6 text-gray-500">Cargando cierres...</p>;

  if (dates.length === 0)
    return <p className="p-6 text-gray-500">No hay cierres de caja registrados.</p>;

  return (
    <div className="space-y-4">
      {dates.map((d) => {
        const date = new Date(String(d.date)).toISOString().split("T")[0];
        const daily = salesData[date];
        const isOpen = openDate === date;

        return (
          <div key={date} className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
            {/* CABECERA */}
            <button
              onClick={() => toggleDate(date)}
              className="w-full flex justify-between items-center px-5 py-4 bg-gray-50 hover:bg-gray-100 transition"
            >
              <span className="font-semibold text-gray-900 capitalize text-lg">
                {new Date(d.date).toLocaleDateString("es-AR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <ShoppingCart size={16} /> Ventas: ${d.salesTotal}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign size={16} /> Gastos: ${d.totalOut}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp size={16} /> Neto: ${d.finalExpected}
                </span>
                {isOpen ? (
                  <ChevronUp className="text-gray-500" />
                ) : (
                  <ChevronDown className="text-gray-500" />
                )}
              </div>
            </button>

            {/* CONTENIDO DESPLEGABLE */}
            {isOpen && (
              <div className="p-5 space-y-6">
                {/* RESUMEN DE CIERRE */}
                <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl border">
                    <h4 className="text-sm text-gray-500">Total ventas</h4>
                    <p className="text-lg font-semibold text-gray-800">${d.salesTotal}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border">
                    <h4 className="text-sm text-gray-500">Gastos y pagos</h4>
                    <p className="text-lg font-semibold text-gray-800">${d.totalOut}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border">
                    <h4 className="text-sm text-gray-500">Esperado</h4>
                    <p className="text-lg font-semibold text-gray-800">${d.finalExpected}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border">
                    <h4 className="text-sm text-gray-500">Diferencia</h4>
                    <p
                      className={`text-lg font-semibold ${
                        d.difference === 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ${d.difference}
                    </p>
                  </div>
                </div>

                {/* LISTADO DE GASTOS */}
                {d.extraExpenses?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <FileText size={18} /> Gastos adicionales
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1 ml-1">
                      {d.extraExpenses.map((e: any) => (
                        <li key={e._id} className="flex justify-between border-b py-1">
                          <span>{e.description}</span>
                          <span>${e.amount}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* PAGOS A PROVEEDORES */}
                {d.supplierPayments?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <FileText size={18} /> Pagos a proveedores
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1 ml-1">
                      {d.supplierPayments.map((p: any) => (
                        <li key={p._id} className="flex justify-between border-b py-1">
                          <span className="capitalize">{p.metodo}</span>
                          <span>${p.total}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* TABLA DE VENTAS */}
                {daily && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <ShoppingCart size={18} /> Ventas registradas
                    </h3>
                    <div className="overflow-x-auto rounded-xl border">
                      <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-gray-100 border-b text-gray-700">
                          <tr>
                            <th className="p-2">Hora</th>
                            <th className="p-2">Productos</th>
                            <th className="p-2">Método</th>
                            <th className="p-2 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {daily.sales.map((sale: any) => (
                            <tr key={sale._id} className="border-t hover:bg-gray-50">
                              <td className="p-2 text-gray-700">
                                {new Date(sale.createdAt).toLocaleTimeString("es-AR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </td>
                              <td className="p-2 text-gray-700">
                                {sale.products
                                  .map(
                                    (p: any) =>
                                      `${p.product?.name || "—"} x${p.quantity}`
                                  )
                                  .join(", ")}
                              </td>
                              <td className="p-2 text-gray-700 capitalize">
                                {sale.paymentMethod}
                              </td>
                              <td className="p-2 font-medium text-right text-gray-800">
                                ${sale.total}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
