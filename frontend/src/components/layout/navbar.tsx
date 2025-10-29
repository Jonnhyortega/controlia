"use client";

export default function Navbar() {
  return (
    <header className="bg-white shadow flex justify-between items-center px-6 py-3">
      <h1 className="text-lg font-semibold text-gray-800">Panel de Controlia</h1>
      <div className="text-gray-600 text-sm">Bienvenido, <span className="font-semibold">Admin</span></div>
    </header>
  );
}
