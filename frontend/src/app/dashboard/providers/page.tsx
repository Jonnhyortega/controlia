"use client";

import { useEffect, useState } from "react";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  ChevronDown,
  ChevronUp,
  Plus,
  Edit3,
  Trash2,
  XCircle,
} from "lucide-react";
import { Button } from "../components/button";
import { Toast } from "../components/toast";
import { ConfirmDialog } from "../components/confirmDialog";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Estados UI globales
  const [toast, setToast] = useState({
    show: false,
    type: "info",
    message: "",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    debt: 0,
  });

  // 🔹 Cargar proveedores
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSuppliers();
        setSuppliers(res);
      } catch (err) {
        console.error("Error al cargar proveedores:", err);
        setToast({
          show: true,
          type: "error",
          message: "Error al obtener proveedores.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔹 Manejar inputs del formulario
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Guardar proveedor (crear o actualizar)
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updated = await updateSupplier(editingId, form);
        setSuppliers((prev) =>
          prev.map((s) => (s._id === editingId ? updated : s))
        );
        setToast({
          show: true,
          type: "success",
          message: "Proveedor actualizado correctamente.",
        });
      } else {
        const created = await createSupplier(form);
        setSuppliers((prev) => [created, ...prev]);
        setToast({
          show: true,
          type: "success",
          message: "Proveedor agregado correctamente.",
        });
      }

      setEditingId(null);
      setForm({
        name: "",
        phone: "",
        email: "",
        address: "",
        debt: 0,
      });
      setShowForm(false);
    } catch (err) {
      console.error("Error al guardar proveedor:", err);
      setToast({
        show: true,
        type: "error",
        message: "Error al guardar proveedor.",
      });
    }
  };

  // 🔹 Editar proveedor
  const handleEdit = (supplier: any) => {
    setEditingId(supplier._id);
    setForm({
      name: supplier.name,
      phone: supplier.phone || "",
      email: supplier.email || "",
      address: supplier.address || "",
      debt: supplier.debt || 0,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔹 Eliminar proveedor
  const handleDelete = (id: string) => {
    setConfirmDialog({
      open: true,
      title: "¿Eliminar proveedor?",
      message: "Esta acción no se puede deshacer.",
      onConfirm: async () => {
        try {
          await deleteSupplier(id);
          setSuppliers((prev) => prev.filter((s) => s._id !== id));
          setToast({
            show: true,
            type: "success",
            message: "Proveedor eliminado correctamente.",
          });
        } catch (err) {
          console.error("Error al eliminar proveedor:", err);
          setToast({
            show: true,
            type: "error",
            message: "Error al eliminar proveedor.",
          });
        } finally {
          setConfirmDialog({ ...confirmDialog, open: false });
        }
      },
    });
  };

  if (loading)
    return <p className="p-6 text-gray-500">Cargando proveedores...</p>;

  return (
    <section className="p-6 space-y-8">
      {/* 🔹 Encabezado */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <Building2 className="text-blue-600 w-7 h-7" />
          Proveedores
        </h1>
        <Button
          onClick={() => {
            setEditingId(null);
            setForm({ name: "", phone: "", email: "", address: "", debt: 0 });
            setShowForm((prev) => !prev);
          }}
          className={`${
            showForm ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
          } text-white rounded-xl px-4 py-2 shadow-sm transition flex items-center gap-2`}
        >
          {showForm ? (
            <>
              <XCircle className="w-4 h-4" /> Cerrar formulario
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" /> Nuevo proveedor
            </>
          )}
        </Button>
      </div>

      {/* 🔹 Formulario animado */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            key="form"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            onSubmit={handleSubmit}
            className="overflow-hidden bg-white p-6 rounded-2xl shadow-md border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-blue-600 mb-4">
              {editingId ? "Editar proveedor" : "Agregar proveedor"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nombre"
                className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Teléfono"
                className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Dirección"
                className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="number"
                name="debt"
                value={form.debt}
                onChange={handleChange}
                placeholder="Deuda actual"
                className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6 py-3 rounded-xl shadow-md transition"
            >
              {editingId ? "Guardar cambios" : "Agregar proveedor"}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* 🔹 Lista de proveedores */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h2 className="text-lg font-semibold text-blue-600 mb-4">
          Lista de proveedores
        </h2>

        <AnimatePresence>
          {suppliers.map((s, i) => {
            const isOpen = expanded === i;
            return (
              <motion.div
                key={s._id}
                layout
                className={`rounded-xl border mb-3 overflow-hidden transition ${
                  isOpen ? "bg-white shadow-md" : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div
                  className="flex justify-between items-center p-4 cursor-pointer"
                  onClick={() => setExpanded(isOpen ? null : i)}
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {s.name || "Sin nombre"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {s.email || "Sin email"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">
                      Deuda:{" "}
                      <span
                        className={`${
                          s.debt > 0 ? "text-red-500" : "text-green-600"
                        }`}
                      >
                        ${s.debt || 0}
                      </span>
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-4 space-y-2 text-sm text-gray-700"
                    >
                      <p>📞 Teléfono: {s.phone || "—"}</p>
                      <p>📍 Dirección: {s.address || "—"}</p>
                      <div className="flex gap-3 mt-3">
                        <Button
                          onClick={() => handleEdit(s)}
                          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                        >
                          <Edit3 className="w-4 h-4" /> Editar
                        </Button>
                        <Button
                          onClick={() => handleDelete(s._id)}
                          className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Eliminar
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 🔹 Componentes globales */}
      <Toast
        show={toast.show}
        type={toast.type as any}
        message={toast.message}
        onClose={() => setToast({ ...toast, show: false })}
      />
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
        confirmText="Confirmar"
        cancelText="Cancelar"
      />
    </section>
  );
}
