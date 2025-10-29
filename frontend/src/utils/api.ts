import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
});

// ✅ Interceptor para adjuntar el token en cada request
api.interceptors.request.use((config) => {
  const token = Cookies.get("token") || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("🔑 Token enviado en headers:", token.slice(0, 20) + "..."); // solo una parte para no mostrar todo
  } else {
    console.warn("⚠️ No se encontró token para enviar");
  }
  return config;
});

export async function getDashboardData() {
  try {
    const [sales, products, clients] = await Promise.all([
      api.get("/sales"),
      api.get("/products"),
      api.get("/clients"),
    ]);

    return {
      totalSales: sales.data.length || 0,
      totalProducts: products.data.length || 0,
      totalClients: clients.data.length || 0,
    };
  } catch (error: any) {
    console.error("❌ Error al obtener datos del dashboard:", error);
    if (error.response?.status === 401) {
      console.warn("⚠️ Token inválido o expirado. Redirigiendo al login...");
    }
    return {
      totalSales: 0,
      totalProducts: 0,
      totalClients: 0,
    };
  }
}
