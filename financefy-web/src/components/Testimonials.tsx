import { useEffect, useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

type Testimonial = {
  name: string;
  text: string;
  rating: number;
  role?: string;
};

const QUOTES: Testimonial[] = [
  {
    name: "Ana",
    text: "Finalmente entendi pra onde meu dinheiro vai. Simples e direto.",
    rating: 5,
    role: "Designer",
  },
  {
    name: "Carlos",
    text: "Relatórios mensais me ajudam muito a decidir gastos e planejar o mês.",
    rating: 4,
    role: "Empreendedor",
  },
  {
    name: "Bianca",
    text: "Categorias e saldo automático: menos planilha, mais controle e tranquilidade.",
    rating: 5,
    role: "Analista Financeira",
  },
  {
    name: "Eduardo",
    text: "O fluxo de cadastro é rápido e o saldo bate certinho. Curti a experiência.",
    rating: 5,
    role: "Dev Front-end",
  },
  {
    name: "Marina",
    text: "Finalmente uma interface limpa para registrar despesas do dia a dia.",
    rating: 4,
    role: "Gerente de Projetos",
  },
  {
    name: "Rafael",
    text: "Dashboard objetivo e sem enrolação. Perfeito pra rotina corrida.",
    rating: 5,
    role: "Consultor",
  },
  {
    name: "Lívia",
    text: "Comecei com metas simples e em 2 meses já senti o resultado.",
    rating: 5,
    role: "Autônoma",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<number | null>(null);
  const total = QUOTES.length;
  const visible = 3;

  // autoplay suave a cada 4s
  useEffect(() => {
    if (isHovering) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 2000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovering, total]);

  const getVisibleItems = () => {
    const items: Testimonial[] = [];
    for (let i = 0; i < visible; i++) {
      items.push(QUOTES[(index + i) % total]);
    }
    return items;
  };

  const prev = () => setIndex((prev) => (prev - 1 + total) % total);
  const next = () => setIndex((prev) => (prev + 1) % total);

  const Stars = ({ rating }: { rating: number }) => (
    <div className="mb-3 flex gap-1 text-yellow-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={18}
          fill={i < rating ? "currentColor" : "none"}
          className={i < rating ? "" : "opacity-40"}
        />
      ))}
    </div>
  );

  return (
    <section
      className="relative overflow-hidden bg-gray-50 py-20"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative mx-auto max-w-6xl px-6">
        {/* 🔹 Cabeçalho */}
        <h2 className="text-center text-3xl font-bold text-black">
          Quem usa, <span className="text-[--color-primary]">aprova</span> 💬
        </h2>
        <p className="mt-2 text-center text-lg text-gray-600">
          Veja o que nossos usuários dizem sobre o Financefy.
        </p>

        {/* 🔹 Carrossel fixo (fade effect) */}
        <div className="relative mt-12 transition-all duration-700 ease-in-out">
          <div className="grid gap-8 md:grid-cols-3">
            {getVisibleItems().map((q) => (
              <div
                key={q.name}
                className="rounded-2xl border border-gray-200 bg-white p-6 opacity-100 shadow-sm transition-all duration-500 ease-in-out hover:shadow-md"
              >
                <Stars rating={q.rating} />
                <p className="text-lg leading-relaxed text-gray-700 italic">“{q.text}”</p>
                <div className="mt-4">
                  <p className="font-medium text-black">— {q.name}</p>
                  {q.role && <p className="text-sm text-gray-500">{q.role}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* 🔹 Efeito blur lateral (para suavizar o fim do carrossel) */}
          <div className="pointer-events-none absolute top-0 left-0 h-full w-24 bg-linear-to-r from-gray-50 to-transparent" />
          <div className="pointer-events-none absolute top-0 right-0 h-full w-24 bg-linear-to-l from-gray-50 to-transparent" />

          {/* 🔹 Setas (fade + blur + mais afastadas) */}
          <button
            onClick={prev}
            aria-label="Anterior"
            className={`absolute top-1/2 -left-24 -translate-y-1/2 rounded-full border border-gray-300 bg-white/70 p-3 shadow-md backdrop-blur-md transition-all duration-500 hover:bg-white ${
              isHovering
                ? "translate-x-0 scale-100 opacity-100"
                : "pointer-events-none -translate-x-3 scale-90 opacity-0"
            }`}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={next}
            aria-label="Próximo"
            className={`absolute top-1/2 -right-24 -translate-y-1/2 rounded-full border border-gray-300 bg-white/70 p-3 shadow-md backdrop-blur-md transition-all duration-500 hover:bg-white ${
              isHovering
                ? "translate-x-0 scale-100 opacity-100"
                : "pointer-events-none translate-x-3 scale-90 opacity-0"
            }`}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* 🔹 Indicadores */}
        <div className="mt-8 flex justify-center gap-2">
          {QUOTES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Ir para ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-black" : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
