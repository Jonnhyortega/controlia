"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Si ya hay token, redirige al dashboard
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0b0b0b] text-white">
      <h1 className="text-2xl font-semibold animate-pulse">
        Cargando Controlia...
      </h1>
    </section>
  );
}
