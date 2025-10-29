"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Home, ShoppingCart, Package, Users, Truck, Settings, LogOut } from "lucide-react";

const menuItems = [
  { icon: <Home size={20} />, label: "Dashboard", path: "/" },
  { icon: <ShoppingCart size={20} />, label: "Ventas", path: "/sales" },
  { icon: <Package size={20} />, label: "Productos", path: "/products" },
  { icon: <Users size={20} />, label: "Clientes", path: "/clients" },
  { icon: <Truck size={20} />, label: "Proveedores", path: "/providers" },
  { icon: <Settings size={20} />, label: "Configuración", path: "/settings" },
];

export default function Sidebar() {
  const router = useRouter();
  const [active, setActive] = useState("/");

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <aside className="bg-white shadow-md h-screen w-64 p-5 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold text-blue-700 mb-8">Controlia</h2>
        <nav className="flex flex-col gap-3">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setActive(item.path);
                router.push(item.path);
              }}
              className={`flex items-center gap-3 text-gray-700 p-2 rounded-md hover:bg-blue-100 transition ${
                active === item.path ? "bg-blue-50 text-blue-700 font-semibold" : ""
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-red-500 hover:bg-red-100 p-2 rounded-md transition"
      >
        <LogOut size={18} /> Cerrar sesión
      </button>
    </aside>
  );
}
