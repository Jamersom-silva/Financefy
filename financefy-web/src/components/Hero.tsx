// src/components/Hero.tsx
import heroImg from "../assets/hero-illustration.svg";

interface HeroProps {
  onStartClick: () => void;
  onDemoClick: () => void;
}

export default function Hero({ onStartClick, onDemoClick }: HeroProps) {
  return (
    <section className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between px-6 pt-32 md:flex-row md:pt-40">
      {/* 🔹 Texto principal */}
      <div className="text-center md:w-1/2 md:text-left">
        <h1 className="text-4xl leading-tight font-extrabold text-gray-900 md:text-5xl">
          Controle total das suas{" "}
          <span className="text-[--color-primary]">finanças pessoais</span>
        </h1>

        <p className="mx-auto mt-4 max-w-md text-lg text-gray-600 md:mx-0">
          Organize receitas, despesas e tenha clareza sobre para onde seu dinheiro vai — tudo em um
          só lugar.
        </p>

        {/* 🔹 Botões de ação */}
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
          {/* 🟢 Botão principal */}
          <button
            onClick={onStartClick}
            className="transform rounded-lg border-2 border-black bg-black px-7 py-3 font-semibold text-white shadow-lg transition-all duration-300 ease-out hover:scale-105 hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(0,0,0,0.25)]"
          >
            Começar agora
          </button>

          {/* ⚪ Botão secundário */}
          <button
            onClick={onDemoClick}
            className="rounded-lg border-2 border-black bg-white px-7 py-3 font-semibold text-black transition-all duration-300 ease-out hover:scale-105 hover:bg-black hover:text-white hover:shadow-[0_0_10px_rgba(0,0,0,0.25)]"
          >
            Ver demonstração
          </button>
        </div>
      </div>

      {/* 🔹 Ilustração */}
      <div className="mb-10 flex justify-center md:mb-0 md:w-1/2">
        <img
          src={heroImg}
          alt="Ilustração Financefy"
          className="w-80 drop-shadow-xl md:w-md"
        />
      </div>
    </section>
  );
}
