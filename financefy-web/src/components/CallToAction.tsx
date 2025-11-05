export default function CallToAction() {
  return (
    <section className="relative bg-white py-24 text-center text-black">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-3xl leading-tight font-extrabold md:text-5xl">
          Comece a controlar suas finanças hoje mesmo 💸
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-gray-700 md:text-xl">
          Organize suas despesas, acompanhe seus ganhos e alcance seus objetivos financeiros com
          praticidade e clareza.
        </p>

        <button
          onClick={() => (window.location.href = "/login")}
          className="mt-10 transform rounded-full bg-black px-10 py-4 font-semibold text-white shadow-md transition-transform hover:-translate-y-1 hover:bg-gray-900"
        >
          Criar conta gratuita
        </button>
      </div>
    </section>
  );
}
