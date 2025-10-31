"use client";

import Sidebar from "../../components/layout/sidebar";
import Navbar from "../../components/layout/navbar";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";



export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex-1 p-6 overflow-y-auto"
            id="dashboardContent"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}


