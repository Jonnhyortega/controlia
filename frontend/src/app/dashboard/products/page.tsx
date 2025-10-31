"use client";
import { scrollToTop } from "../../../utils/scrollToTop";
import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSuppliers,
} from "../../../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit3, Package, XCircle } from "lucide-react";
import { Button } from "../components/button";
import { Toast } from "../components/toast";
import { ConfirmDialog } from "../components/confirmDialog";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [toast, setToast] = useState<{
    show: boolean;
    type?: "success" | "error" | "info";
    message: string;
  }>({ show: false, type: "success", message: "" });

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: 0,
    cost: 0,
    stock: 0,
    barcode: "",
    description: "",
    supplier: "",
  });

  // 🔹 Cargar productos y proveedores
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, suppliersData] = await Promise.all([
          getProducts(),
          getSuppliers(),
        ]);
        setProducts(productsData);
        setSuppliers(suppliersData);
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔹 Manejo de inputs
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Crear o editar producto
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updated = await updateProduct(editingId, form);
        setProducts((prev) =>
          prev.map((p) => (p._id === editingId ? updated : p))
        );
        setToast({
          show: true,
          type: "success",
          message: "Producto actualizado correctamente",
        });
      } else {
        const newProduct = await createProduct(form);
        setProducts((prev) => [...prev, newProduct]);
        setToast({
          show: true,
          type: "success",
          message: "Producto agregado correctamente",
        });
      }

      setEditingId(null);
      setForm({
        name: "",
        category: "",
        price: 0,
        cost: 0,
        stock: 0,
        barcode: "",
        description: "",
        supplier: "",
      });
      setShowForm(false);
    } catch (err) {
      console.error("Error al guardar producto:", err);
      setToast({
        show: true,
        type: "error",
        message: "Error al guardar producto",
      });
    }
  };

  // 🔹 Editar producto
  const handleEdit = (product: any) => {
    scrollToTop();
    setEditingId(product._id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      cost: product.cost,
      stock: product.stock,
      barcode: product.barcode || "",
      description: product.description || "",
      supplier: product.supplier?._id || "",
    });
    setShowForm(true);
  };

  // 🔹 Preparar borrado
  const handleDeleteClick = (id: string) => {
    setDeleteTarget(id);
    setShowDeleteDialog(true);
  };

  // 🔹 Confirmar borrado
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget);
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget));
      setToast({
        show: true,
        type: "success",
        message: "Producto eliminado correctamente",
      });
    } catch {
      setToast({
        show: true,
        type: "error",
        message: "Error al eliminar el producto",
      });
    } finally {
      setShowDeleteDialog(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Cargando productos...</p>;

  return (
    <section className="p-6 space-y-8">
      {/* 🔹 Encabezado */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <Package className="text-blue-600 w-7 h-7" />
          Productos
        </h1>
        <Button
          onClick={() => {
            setEditingId(null);
            setForm({
              name: "",
              category: "",
              price: 0,
              cost: 0,
              stock: 0,
              barcode: "",
              description: "",
              supplier: "",
            });
            setShowForm((prev) => !prev);
          }}
          className={`${
            showForm
              ? "bg-gray-500 hover:bg-gray-600"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white rounded-xl px-4 py-2 shadow-sm transition flex items-center gap-2`}
        >
          {showForm ? (
            <>
              <XCircle className="w-4 h-4" /> Cerrar formulario
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" /> Nuevo producto
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
              {editingId ? "Editar producto" : "Agregar producto"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nombre del producto"
                className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Categoría"
                className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Precio"
                className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <select
                name="supplier"
                value={form.supplier}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Sin proveedor</option>
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock"
                className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="number"
                name="cost"
                value={form.cost}
                onChange={handleChange}
                placeholder="Costo"
                className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <input
              name="barcode"
              value={form.barcode}
              onChange={handleChange}
              placeholder="Código de barras"
              className="border border-gray-300 rounded-xl px-3 py-2 w-full mt-4 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Descripción (opcional)"
              className="border border-gray-300 rounded-xl px-3 py-2 w-full mt-4 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6 py-3 rounded-xl shadow-md transition"
            >
              {editingId ? "Guardar cambios" : "Agregar producto"}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* 🔹 Tabla de productos */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h2 className="text-lg font-semibold text-blue-600 mb-4">
          Lista de productos
        </h2>

        <table className="w-full border-collapse text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Proveedor</th>
              <th className="p-3 text-left">Categoría</th>
              <th className="p-3 text-left">Precio</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Costo</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p._id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.supplier?.name || "—"}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">${p.price}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">${p.cost}</td>
                <td className="p-3 flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-blue-500 hover:text-blue-700 transition"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(p._id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 ConfirmDialog y Toast */}
      <ConfirmDialog
        open={showDeleteDialog}
        title="Eliminar producto"
        message="¿Seguro que querés eliminar este producto?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </section>
  );
}
