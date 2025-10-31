"use client";

import { BarChart3, ShoppingCart, Package, Users } from "lucide-react";
import Image from "next/image";
import { Button } from "../dashboard/components/button";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center bg-gray-50 text-gray-800">
      {/* 🟦 1. HERO */}
      <section className="w-full max-w-6xl px-6 py-24 text-center">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">
          Controlá tu negocio con <span className="text-blue-600">Controlia</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Gestión integral de ventas, stock, proveedores y cierre de caja — 
          todo en una sola plataforma intuitiva y moderna.
        </p>
        <Button className="bg-blue-600 text-white px-6 py-3 text-lg rounded-xl shadow hover:bg-blue-700 transition">
          Comenzar ahora
        </Button>
      </section>

      {/* 🧩 2. CARACTERÍSTICAS */}
      <section className="w-full bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-12">Todo lo que necesitás</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: <ShoppingCart className="h-10 w-10 text-blue-600 mx-auto" />,
                title: "Ventas diarias",
                desc: "Registrá y controlá todas tus operaciones en segundos.",
              },
              {
                icon: <Package className="h-10 w-10 text-blue-600 mx-auto" />,
                title: "Gestión de stock",
                desc: "Monitoreá tus productos y recibí alertas de bajo inventario.",
              },
              {
                icon: <Users className="h-10 w-10 text-blue-600 mx-auto" />,
                title: "Clientes y proveedores",
                desc: "Administrá contactos y mantené relaciones fluidas.",
              },
              {
                icon: <BarChart3 className="h-10 w-10 text-blue-600 mx-auto" />,
                title: "Cierre de caja",
                desc: "Visualizá ingresos, gastos y diferenciales en tiempo real.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-gray-50 hover:bg-gray-100 rounded-2xl shadow p-6 transition"
              >
                {f.icon}
                <h3 className="text-xl font-semibold mt-4 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 💼 3. BENEFICIOS */}
      <section className="w-full py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 px-6">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-semibold mb-6">
              Todo bajo control, en un solo lugar
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Controlia te permite automatizar tareas y tomar decisiones informadas. 
              Diseñada para kioscos, ferreterías, almacenes y cualquier negocio 
              que quiera crecer sin perder el control.
            </p>
            <Button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
              Ver demo
            </Button>
          </div>
          <div className="md:w-1/2">
            <Image
              src="https://cdn-icons-png.flaticon.com/512/7856/7856117.png"
              alt="Dashboard Controlia"
              width={500}
              height={400}
              className="rounded-2xl shadow"
            />
          </div>
        </div>
      </section>

      {/* 🧾 4. CTA FINAL */}
      <section className="w-full py-20 bg-blue-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">
          Simplificá tu gestión hoy mismo
        </h2>
        <p className="mb-8 text-lg text-blue-100">
          Probá Controlia gratis y descubrí una nueva forma de administrar tu negocio.
        </p>
        <button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-xl text-lg">
          Crear cuenta gratis
        </button>
      </section>

      {/* ⚙️ 5. FOOTER */}
      <footer className="w-full bg-gray-900 text-gray-300 py-8 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Controlia — Astral Vision Estudio
        </p>
      </footer>
    </main>
  );
}
