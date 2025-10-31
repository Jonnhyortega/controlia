"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isLogin
        ? "http://localhost:5000/api/users/login"
        : "http://localhost:5000/api/users/register";

      const res = await axios.post(endpoint, formData);

      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        router.push("/dashboard");
      } else {
        setIsLogin(true);
      }
    } catch (err: any) {
      setError("Error al procesar la solicitud. Verificá tus datos.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0b0b0b] text-white px-4">
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-between">
        {/* Imagen izquierda */}
        <div className="hidden md:block w-1/2">
          <img
            src="/login-dashboard-preview.png"
            alt="Vista previa del panel"
            className="rounded-2xl shadow-lg"
          />
        </div>

        {/* Panel derecho */}
        <div className="w-full md:w-1/2 flex flex-col gap-6 bg-[#121212] p-8 rounded-2xl border border-gray-800 relative overflow-hidden">
          <div className="text-center">
            <h1 className="text-sm tracking-[0.3em] text-gray-400 mb-2">
              CONTROLIA
            </h1>
            <h2 className="text-2xl font-bold">
              {isLogin ? "Inicia sesión en tu cuenta" : "Crea tu cuenta"}
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              {isLogin
                ? "Accedé a tu panel de gestión y mantené el control de tu negocio."
                : "Registrate para empezar a usar el sistema de gestión."}
            </p>
          </div>

          {/* Toggle botones */}
          <div className="relative flex bg-[#1c1c1c] rounded-lg overflow-hidden">
            {/* Slider animado */}
            <motion.div
              className="absolute top-0 left-0 h-full w-1/2 bg-blue-600 rounded-lg"
              animate={{ x: isLogin ? "0%" : "100%" }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
            />
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`relative z-10 w-1/2 py-2 font-semibold transition ${
                isLogin ? "text-white" : "text-gray-400"
              }`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`relative z-10 w-1/2 py-2 font-semibold transition ${
                !isLogin ? "text-white" : "text-gray-400"
              }`}
            >
              Crear cuenta
            </button>
          </div>

          {/* Formulario animado */}
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col gap-4"
              >
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-[#1e1e1e] border border-gray-700 focus:border-blue-500 outline-none"
                    placeholder="tucorreo@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-[#1e1e1e] border border-gray-700 focus:border-blue-500 outline-none"
                    placeholder="********"
                  />
                </div>

                <div className="flex justify-between text-sm text-gray-400">
                  <label>
                    <input type="checkbox" className="mr-2" /> Mantener sesión iniciada
                  </label>
                  <a href="#" className="text-blue-500 hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  type="submit"
                  className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                >
                  Iniciar sesión
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col gap-4"
              >
                <div>
                  <label className="block text-sm mb-1">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-[#1e1e1e] border border-gray-700 focus:border-blue-500 outline-none"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Apellido</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-[#1e1e1e] border border-gray-700 focus:border-blue-500 outline-none"
                    placeholder="Tu apellido"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-[#1e1e1e] border border-gray-700 focus:border-blue-500 outline-none"
                    placeholder="tucorreo@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-[#1e1e1e] border border-gray-700 focus:border-blue-500 outline-none"
                    placeholder="********"
                  />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  type="submit"
                  className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                >
                  Registrarme
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
