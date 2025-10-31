import axios from "axios";
import Cookies from "js-cookie";

// 🌍 URL base de tu backend (ajustala si usás otro puerto o dominio)
const API_URL = "http://localhost:5000/api";

// ✅ Instancia base de Axios
export const api = axios.create({
  baseURL: API_URL,
});

// ✅ Interceptor para incluir token automáticamente (si existiera)
api.interceptors.request.use((config) => {
  const token = Cookies.get("token") || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🧭 Obtener datos del dashboard principal
export async function getDashboardData() {
  try {
    const [latestDaily, products, clients] = await Promise.allSettled([
      api.get("/daily-sales/latest"),
      api.get("/products"),
      api.get("/clients"),
    ]);

    // 🧾 Manejar resultado seguro
    const dailyData =
      latestDaily.status === "fulfilled" && latestDaily.value.data
        ? latestDaily.value.data
        : null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      totalSales: dailyData?.totalSalesAmount || 0,
      totalOperations: dailyData?.totalOperations || 0,
      sales: dailyData?.sales || [],
      totalProducts:
        products.status === "fulfilled" ? products.value.data.length : 0,
      totalClients:
        clients.status === "fulfilled" ? clients.value.data.length : 0,
      date: dailyData?.date || today.toISOString(),
    };
  } catch (error: any) {
    console.error("❌ Error al obtener datos del dashboard:", error);
    return {
      totalSales: 0,
      totalOperations: 0,
      sales: [],
      totalProducts: 0,
      totalClients: 0,
      date: new Date().toISOString(),
    };
  }
}

// 📊 Obtener caja del día (equivale a daily sales)
export const getTodayDailySales = async () => {
  const res = await api.get("/daily-cash/today");
  return res.data;
};


// 🧾 Obtener caja diaria (por fecha específica)
export const getDailyCashByDate = async (date: string) => {
  const res = await api.get(`/daily-cash/${date}`);
  return res.data;
};


// 🧾 Cerrar caja del día
export async function closeDailyCash(data: {
  extraExpenses: { description: string; amount: number }[];
  supplierPayments: { metodo: string; total: number }[];
  finalReal?: number;
}) {
  try {
    const res = await api.post("/daily-cash/close", data);

    return {
      success: true, // 👈 clave para que el overlay sea verde
      status: res.status,
      message: res.data?.message || "Caja cerrada correctamente.",
      data: res.data || null,
    };
  } catch (error: any) {
    console.error("❌ Error al cerrar caja:", error);

    const message =
      error?.response?.data?.message ||
      (typeof error?.response?.data === "string"
        ? error.response.data
        : null) ||
      error?.message ||
      "Error desconocido al cerrar caja.";

    return {
      success: false,
      status: error?.response?.status || 500,
      message,
      data: null,
    };
  }
}


export const createSale = async (data: any) => {
  const res = await axios.post(`${API_URL}/sales`, data, {
    withCredentials: true,
  });
  return res.data;
};


export const getClosedCashDays = async () => {
  const res = await fetch(`${API_URL}/daily-cash/days`);
  if (!res.ok) throw new Error("Error al obtener días con cierres de caja");
  return res.json();
};




/* ==========================================================
   📦 PRODUCTOS - CRUD COMPLETO
========================================================== */

// 🟢 Obtener todos los productos del usuario
export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

// 🟢 Crear un nuevo producto
export const createProduct = async (data: {
  name: string;
  category?: string;
  price: number;
  cost?: number;
  stock?: number;
  barcode?: string;
  description?: string;
  supplier?:string;
}) => {
  const res = await api.post("/products", data);
  return res.data;
};

// 🟢 Obtener un producto por ID
export const getProductById = async (id: string) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const updateProduct = async (id: string, data: any) => {
  const cleanData = { ...data };
  if (!cleanData.supplier) delete cleanData.supplier; // ✅ evita error de cast
  const res = await api.put(`/products/${id}`, cleanData);
  return res.data;
};

// 🔴 Eliminar un producto
export const deleteProduct = async (id: string) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};



// Crud para proveedores
export const getSuppliers = async () => {
  const res = await api.get("/suppliers");
  return res.data;
};

export const createSupplier = async (data: any) => {
  const res = await api.post("/suppliers", data);
  return res.data;
};

export const updateSupplier = async (id: string, data: any) => {
  const res = await api.put(`/suppliers/${id}`, data);
  return res.data;
};

export const deleteSupplier = async (id: string) => {
  const res = await api.delete(`/suppliers/${id}`);
  return res.data;
};
