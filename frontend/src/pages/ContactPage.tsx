import { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Mail, Phone, MessageSquare, Loader2 } from "lucide-react";
import emailjs from "emailjs-com";
import toast, { Toaster } from "react-hot-toast";

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);

  // ⚙️ Envio do formulário via EmailJS
  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const result = await emailjs.sendForm(
        "service_q4bgcgp", // ✅ seu Service ID
        "template_contact", // ✅ seu Template ID
        formRef.current!,
        "2Hmq2F4qvHPrlHq_f" // ✅ sua Public Key
      );

      if (result.text === "OK") {
        toast.success("Mensagem enviada com sucesso! 🚀");
        formRef.current?.reset();
      }
    } catch (error) {
      toast.error("Erro ao enviar mensagem. Tente novamente.");

      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.error("Erro no envio de e-mail:", error);
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-28 pb-20 px-6">
        <section className="text-center mx-auto max-w-4xl mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Entre em Contato 💬
          </h1>
          <p className="text-gray-600 text-lg">
            Tem dúvidas, sugestões ou quer conversar com nossa equipe?
            Estamos prontos para te ajudar.
          </p>
        </section>

        <div className="mx-auto max-w-3xl bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                name="name"
                placeholder="Seu nome completo"
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                placeholder="seuemail@exemplo.com"
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Mensagem
              </label>
              <textarea
                name="message"
                rows={4}
                placeholder="Digite sua mensagem..."
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full rounded-lg bg-[--color-primary] text-white py-3 font-medium hover:opacity-90 transition flex justify-center items-center"
            >
              {isSending ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} /> Enviando...
                </>
              ) : (
                "Enviar mensagem"
              )}
            </button>
          </form>

          {/* Informações de contato diretas */}
          <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Mail size={18} />
              <span>contato@financefy.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={18} />
              <span>(11) 99999-9999</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare size={18} />
              <span>Suporte online</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Toaster position="top-center" />
    </>
  );
}
