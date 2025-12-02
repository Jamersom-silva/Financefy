import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-6 py-20">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Política de Privacidade</h1>

          <p className="text-gray-700 leading-relaxed mb-4">
            A sua privacidade é muito importante para nós. Esta política de privacidade explica como 
            coletamos, usamos e protegemos as informações fornecidas durante o uso do 
            <strong> Financefy</strong>.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">1. Coleta de informações</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Coletamos apenas informações essenciais para o funcionamento da aplicação, como dados 
            de autenticação e preferências do usuário. Nenhuma informação pessoal é compartilhada 
            com terceiros sem consentimento.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">2. Uso das informações</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            As informações são utilizadas para personalizar sua experiência e garantir a segurança 
            da conta. Não utilizamos seus dados para fins comerciais ou publicitários.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">3. Segurança</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Empregamos boas práticas de segurança para proteger seus dados, incluindo autenticação 
            segura e comunicação criptografada sempre que possível.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">4. Alterações</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Esta política pode ser atualizada periodicamente. Alterações significativas serão 
            comunicadas diretamente no site.
          </p>

          <p className="text-gray-700 leading-relaxed mt-6">
            Última atualização: <strong>{new Date().toLocaleDateString("pt-BR")}</strong>
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
