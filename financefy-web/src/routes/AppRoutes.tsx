import type { ReactNode, ReactElement } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// =====================================================
// 🔹 Páginas públicas
// =====================================================
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ResourcesPage from "../pages/ResourcesPage";
import PlansPage from "../pages/PlansPage";
import ContactPage from "../pages/ContactPage";
import DemoPage from "../pages/DemoPage";
import HelpPage from "../pages/HelpPage"; // ✅ Nova página de ajuda

// =====================================================
// 🔹 Layout e páginas privadas (após login)
// =====================================================
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/Dashboard/Index";
import Accounts from "../pages/Dashboard/Accounts";
import Categories from "../pages/Dashboard/Categories";
import Transactions from "../pages/Dashboard/Transactions";
import Attachments from "../pages/Attachments"; // ✅ Novo módulo de anexos

// =====================================================
// 🔹 Páginas educacionais / complementares
// =====================================================
import TipsPage from "../pages/TipsPage";
import GoalsPage from "../pages/GoalsPage";
import PlanningPage from "../pages/PlanningPage";

// =====================================================
// 🔹 Proteção de rotas privadas
// =====================================================
function PrivateRoute({ children }: { children: ReactNode }): ReactElement {
  const { token } = useAuth();
  return token ? (children as ReactElement) : <Navigate to="/login" replace />;
}

// =====================================================
// 🔹 Definição principal das rotas
// =====================================================
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =====================================================
            🔹 Rotas públicas (sem necessidade de login)
        ===================================================== */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/help" element={<HelpPage />} /> {/* ✅ Nova rota de Ajuda */}

        {/* =====================================================
            🔹 Rotas privadas (usuário autenticado)
        ===================================================== */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="categories" element={<Categories />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="attachments" element={<Attachments />} /> {/* ✅ NOVO módulo */}
        </Route>

        {/* =====================================================
            🔹 Páginas educacionais e informativas
        ===================================================== */}
        <Route path="/tips" element={<TipsPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/planning" element={<PlanningPage />} />

        {/* =====================================================
            🔹 Fallback (404 → Redireciona para Home)
        ===================================================== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
