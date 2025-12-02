import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { AnimatePresence, motion } from "framer-motion";

export default function DashboardLayout() {
  useAuth(); // apenas valida sessão, sem pegar variáveis
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      setIsSidebarOpen(desktop);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 overflow-hidden">
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div
        className={`flex flex-1 flex-col min-h-screen transition-all duration-300 ${
          isSidebarOpen && isDesktop ? "ml-64" : "ml-0"
        }`}
      >
        <Navbar />

        <main className="flex-1 px-6 pb-8 pt-2 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="border-t border-gray-200 py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Financefy. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
}
