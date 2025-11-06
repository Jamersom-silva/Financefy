import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import { Book, ExternalLink } from "lucide-react";

interface BookItem {
  id: number;
  title: string;
  author: string;
  image: string;
  amazonLink?: string;
}

export default function Books() {
  const [books] = useState<BookItem[]>([
    {
      id: 1,
      title: "O Homem Mais Rico da Babilônia",
      author: "George S. Clason",
      image: "https://m.media-amazon.com/images/I/81-Oy0jvQML._SY466_.jpg",
      amazonLink: "",
    },
    {
      id: 2,
      title: "Pai Rico, Pai Pobre",
      author: "Robert T. Kiyosaki",
      image: "https://m.media-amazon.com/images/I/81aY1lxk+VL._SY466_.jpg",
      amazonLink: "",
    },
    {
      id: 3,
      title: "Do Mil ao Milhão",
      author: "Thiago Nigro",
      image: "https://m.media-amazon.com/images/I/81zR5UzRwkL._SY466_.jpg",
      amazonLink: "",
    },
  ]);

  return (
    <>
      <Navbar />

      <main className="w-full min-h-screen bg-white px-8 pt-28 pb-16">
  <div className="max-w-6xl mx-auto space-y-10">

    {/* TÍTULO */}
    <header className="space-y-2">
      <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
        <Book size={32} className="text-indigo-600" /> Livros Recomendados
      </h1>

      <p className="text-gray-500 text-sm max-w-2xl">
        Selecionados para ajudar no desenvolvimento financeiro e mentalidade de crescimento.
      </p>
    </header>


          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {books.map((book) => (
              <div
                key={book.id}
                className="rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1"
              >
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-40 h-56 object-cover rounded-xl shadow mb-4"
                />

                <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                  {book.title}
                </h3>

                <p className="text-sm text-gray-500 mb-6">{book.author}</p>

                <a
                  href={book.amazonLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-auto w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition
                    ${
                      book.amazonLink
                        ? "bg-indigo-600 text-white hover:bg-indigo-500"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  Ver na Amazon
                  <ExternalLink size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
