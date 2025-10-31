"use client";

import { useState } from "react";
import { Home, ShoppingCart, Package, Users, Truck, Settings, LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Menu } from "lucide-react";

const menuItems = [
  { icon: <Home size={20} />, label: "Dashboard", path: "/" },
  { icon: <ShoppingCart size={20} />, label: "Ventas", path: "/dashboard/sales" },
  { icon: <Package size={20} />, label: "Productos", path: "/dashboard/products" },
  // { icon: <Users size={20} />, label: "Clientes", path: "/dashboard/clients" },
  { icon: <Truck size={20} />, label: "Proveedores", path: "/dashboard/providers" },
  { icon: <Settings size={20} />, label: "Configuración", path: "/dashboard/settings" },
];

// export default function Sidebar() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [active, setActive] = useState(pathname);


//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     router.push("/login");
//   };

//   return (
//     <aside className="bg-[#121212] border-r border-[#1f1f1f] text-gray-300 h-screen w-64 p-5 flex flex-col justify-between shadow-[0_0_15px_rgba(0,0,0,0.4)]">
//       <div>
//         <h2 className="text-2xl font-bold text-blue-500 mb-10 tracking-wide text-center">
//           CONTROLIA
//         </h2>
  
//         <nav className="flex flex-col gap-2">
//           {menuItems.map((item) => (
//             <button
//               key={item.label}
//               onClick={() => {
//                 setActive(item.path);
//                 router.push(item.path);
//               }}
//               className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
//                 active === item.path
//                   ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.6)]"
//                   : "hover:bg-[#1a1a1a] hover:text-blue-400"
//               }`}
//             >
//               <span className="text-blue-400">{item.icon}</span>
//               <span className="font-medium">{item.label}</span>
//             </button>
//           ))}
//         </nav>
//       </div>
  
//       <button
//         onClick={handleLogout}
//         className="flex items-center justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-[#1a1a1a] py-2 rounded-xl transition-all duration-200"
//       >
//         <LogOut size={18} /> 
//         <span className="font-semibold">Cerrar sesión</span>
//       </button>
//     </aside>
//   );
  
// }


export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState(pathname);
  const [collapsed, setCollapsed] = useState(false); // 👈 nuevo estado

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <aside
      className={`bg-[#121212] border-r border-[#1f1f1f] text-gray-300 h-screen p-5 flex flex-col justify-between shadow-[0_0_15px_rgba(0,0,0,0.4)] transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div>
        {/* Header con botón de colapso */}
        <div className="flex items-center justify-between mb-10">
          {!collapsed && (
            <h2 className="text-2xl font-bold text-blue-500 tracking-wide">CONTROLIA</h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-blue-400 transition"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Menú */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setActive(item.path);
                router.push(item.path);
              }}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                active === item.path
                  ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.6)]"
                  : "hover:bg-[#1a1a1a] hover:text-blue-400"
              }`}
            >
              <span className="text-blue-400">{item.icon}</span>
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Cerrar sesión */}
      <button
        onClick={handleLogout}
        className={`flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-[#1a1a1a] py-2 rounded-xl transition-all duration-200 ${
          collapsed ? "justify-center" : "justify-center md:justify-start"
        }`}
      >
        <LogOut size={18} />
        {!collapsed && <span className="font-semibold">Cerrar sesión</span>}
      </button>
    </aside>
  );
}