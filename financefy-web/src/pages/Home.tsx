import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero"; // ✅ Hero reintegrado
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-gray-800">
      {/* 🔹 Barra de navegação */}
      <Navbar />

      {/* 🔹 Conteúdo principal */}
      <main className="pt-28">
        {/* =========================================================
            🏠 Seção inicial (Hero / Banner)
           ========================================================= */}
        <Hero
          onStartClick={() => navigate("/register")}
          onDemoClick={() => navigate("/demo")}
        />

        {/* =========================================================
            💡 Benefícios principais
           ========================================================= */}
        <Features />

        {/* =========================================================
            🗣️ Depoimentos reais de usuários
           ========================================================= */}
        <Testimonials />

        {/* =========================================================
            ❓ Perguntas frequentes
           ========================================================= */}
        <FAQ />

        {/* =========================================================
            🚀 Chamada final para ação
           ========================================================= */}
        <CallToAction />
      </main>

      {/* 🔹 Rodapé */}
      <Footer />
    </div>
  );
}
