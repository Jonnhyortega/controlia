"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api, getDashboardData } from "../../../utils/api";
import { Undo2 } from "lucide-react";
import { Toast } from "../../dashboard/components/toast";
import { ConfirmDialog } from "../../dashboard/components/confirmDialog";

export default function SalesForm({
  onBack,
  onCreated,
}: {
  onBack: () => void;
  onCreated: (data: any) => void;
}) {
  const [productsDB, setProductsDB] = useState<any[]>([]);
  const [newSale, setNewSale] = useState({
    paymentMethod: "efectivo",
    products: [{ productId: "", name: "", quantity: 1, price: 0 }],
  });
  const [loading, setLoading] = useState(false);

  // 🟩 Estados UI globales
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
    onCancel: () => {},
  });

  // 🟢 Obtener productos disponibles en stock
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProductsDB(res.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setToast({
          show: true,
          type: "error",
          message: "Error al cargar productos.",
        });
      }
    };
    fetchProducts();
  }, []);

  // 📦 Manejar cambios
  const handleProductChange = (index: number, field: string, value: any) => {
    const updated = [...newSale.products];
    (updated[index] as any)[field] = value;

    // Si selecciona producto del stock
    if (field === "productId") {
      const selected = productsDB.find((p) => p._id === value);
      if (selected) {
        updated[index].name = selected.name;
        updated[index].price = selected.price;
      } else {
        updated[index].name = "";
        updated[index].price = 0;
      }
    }

    setNewSale({ ...newSale, products: updated });
  };

  const addProductField = () => {
    setNewSale({
      ...newSale,
      products: [
        ...newSale.products,
        { productId: "", name: "", quantity: 1, price: 0 },
      ],
    });
  };

  const removeProductField = (index: number) => {
    const updated = newSale.products.filter((_, i) => i !== index);
    setNewSale({ ...newSale, products: updated });
  };

  // 💾 Registrar venta
  const handleSubmit = async () => {
    setConfirmDialog({
      open: true,
      title: "Confirmar registro de venta",
      message: "¿Deseás registrar esta venta?",
      onConfirm: async () => {
        try {
          setLoading(true);

          // Validar stock antes de guardar
          for (const item of newSale.products) {
            const found = productsDB.find((p) => p._id === item.productId);
            if (found && item.quantity > found.stock) {
              setToast({
                show: true,
                type: "error",
                message: `⚠️ No hay stock suficiente para "${found.name}". Disponible: ${found.stock}`,
              });
              setLoading(false);
              return;
            }
          }

          const products = newSale.products.map((p) => {
            const isManual = p.productId === "otro" || !p.productId;
            return {
              product: isManual ? null : p.productId,
              name: isManual ? (p.name?.trim() || "Otro") : "",
              quantity: Number(p.quantity),
              price: Number(p.price),
            };
          });
          
          const total = products.reduce(
            (sum, p) => sum + p.price * p.quantity,
            0
          );

          const payload = {
            products,
            total,
            paymentMethod: newSale.paymentMethod,
          };

          await api.post("/sales", payload);

          setToast({
            show: true,
            type: "success",
            message: "✅ Venta registrada correctamente.",
          });

          const updated = await getDashboardData();
          onCreated(updated);
          onBack();
        } catch (error) {
          console.error(error);
          setToast({
            show: true,
            type: "error",
            message: "❌ Error al registrar la venta.",
          });
        } finally {
          setLoading(false);
          setConfirmDialog({ ...confirmDialog, open: false });
        }
      },
      onCancel: () => setConfirmDialog({ ...confirmDialog, open: false }),
    });
  };

  return (
    <motion.div
      key="add-sale"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-white border border-gray-200 shadow-md rounded-2xl p-8 w-full"
    >
      <div className="flex justify-between items-center mb-6 ">
        <h3 className="text-xl font-semibold text-gray-800">
          Registrar nueva venta
        </h3>
        <button
          onClick={onBack}
          className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
        >
          <Undo2 />
        </button>
      </div>

      <div className="space-y-6">
        {newSale.products.map((p, i) => {
          const isOther = p.productId === "otro";
          const selectedProduct = productsDB.find(
            (item) => item._id === p.productId
          );

          return (
            <div
              key={i}
              className="bg-gray-50 p-4 rounded-lg border space-y-3 shadow-sm"
            >
              {/* Select de producto */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <select
                  value={p.productId}
                  onChange={(e) =>
                    handleProductChange(i, "productId", e.target.value)
                  }
                  className="border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
                >
                  <option value="">Seleccionar producto</option>
                  {productsDB.map((prod) => (
                    <option key={prod._id} value={prod._id}>
                      {prod.name} — Stock: {prod.stock}
                    </option>
                  ))}
                  <option value="otro">Otro (manual)</option>
                </select>

                {isOther && (
                  <input
                    type="text"
                    placeholder="Nombre del producto"
                    value={p.name}
                    onChange={(e) =>
                      handleProductChange(i, "name", e.target.value)
                    }
                    className="border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200 sm:col-span-3"
                  />
                )}
              </div>

              {/* Inputs cantidad / precio */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={p.quantity}
                  onChange={(e) =>
                    handleProductChange(i, "quantity", e.target.value)
                  }
                  className="border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={p.price}
                  disabled={!isOther && !!selectedProduct}
                  onChange={(e) =>
                    handleProductChange(i, "price", e.target.value)
                  }
                  className={`border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200 ${
                    !isOther && !!selectedProduct
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                />

                {i > 0 && (
                  <button
                    onClick={() => removeProductField(i)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          );
        })}

        <button
          onClick={addProductField}
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          + Agregar producto
        </button>

        <div className="mt-4">
          <label className="block text-gray-700 font-medium mb-2">
            Método de pago
          </label>
          <select
            value={newSale.paymentMethod}
            onChange={(e) =>
              setNewSale({ ...newSale, paymentMethod: e.target.value })
            }
            className="border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-blue-200"
          >
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
            <option value="mercado pago">Mercado Pago</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <button
          disabled={loading}
          onClick={handleSubmit}
          className={`mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Guardando..." : "Registrar venta"}
        </button>
      </div>

      {/* 🔹 Toast & ConfirmDialog */}
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, show: false })}
        duration={2500}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={confirmDialog.onConfirm}
        onCancel={confirmDialog.onCancel}
      />
    </motion.div>
  );
}
