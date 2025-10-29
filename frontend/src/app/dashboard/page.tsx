"use client";

import { useEffect, useState } from "react";
import { getDashboardData } from "../../utils/api";
import { motion } from "framer-motion";

export default function DashboardPage() {
  console.log("📡 Fetching dashboard data...");

  const [data, setData] = useState({
    totalSales: 0,
    totalProducts: 0,
    totalClients: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await getDashboardData();
      console.log(response)
      setData(response);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Resumen General</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white shadow p-6 rounded-xl text-center"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            💰 Ventas del día
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {data.totalSales}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white shadow p-6 rounded-xl text-center"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            📦 Productos en stock
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {data.totalProducts}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white shadow p-6 rounded-xl text-center"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            🧾 Clientes activos
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {data.totalClients}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
