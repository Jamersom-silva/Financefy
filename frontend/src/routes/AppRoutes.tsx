import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

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
import HelpPage from "../pages/HelpPage";

// 🔹 Páginas informativas
import AboutPage from "../pages/AboutPage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";

// =====================================================
// 🔹 Layout e páginas privadas
// =====================================================
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/Dashboard/Index";
import Accounts from "../pages/Dashboard/Accounts";
import Categories from "../pages/Dashboard/Categories";
import Transactions from "../pages/Dashboard/Transactions";
import Attachments from "../pages/Dashboard/Attachments";
import Books from "../pages/Books";

// =====================================================
// 🔹 Páginas educacionais
// =====================================================
import TipsPage from "../pages/TipsPage";
import GoalsPage from "../pages/GoalsPage";
import PlanningPage from "../pages/PlanningPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔹 Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/help" element={<HelpPage />} />

        {/* 🔹 Páginas institucionais */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />

        {/* 🔹 Dashboard (privado) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="categories" element={<Categories />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="attachments" element={<Attachments />} />
        </Route>

        {/* 🔹 Educacional */}
        <Route path="/tips" element={<TipsPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/planning" element={<PlanningPage />} />
        <Route path="/books" element={<Books />} />

        {/* 🔹 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
