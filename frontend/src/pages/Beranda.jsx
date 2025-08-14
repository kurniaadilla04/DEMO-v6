import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Footer from "../components/Footer";

function Navbar() {
  const location = useLocation();
}

function Beranda() {
  const faqData = [
    {
      question: "Apa fungsi dari website ini?",
      answer:
        "Website ini berfungsi sebagai alat bantu digital bagi petani atau pelaku industri teh untuk memprediksi tingkat kematangan daun teh berdasarkan citra digital (gambar).",
    },
    {
      question: "Bagaimana cara kerja sistem ini?",
      answer:
        "Sistem akan menganalisis gambar daun teh menggunakan algoritma KNN.",
    },
    {
      question: "Bagaimana cara mengunggah gambar daun teh?",
      answer:
        "Anda dapat mengunggah gambar melalui tombol 'Pilih Gambar' yang akan membuka file explorer di perangkat Anda.",
    },
    {
      question: "Apakah metode KNN akurat untuk prediksi ini?",
      answer:
        "Akurasi metode KNN bergantung pada kualitas dataset training dan parameter model. Evaluasi akurasi biasanya dilakukan saat pengembangan model.",
    },
    {
      question: "Apa saja kategori kematangan daun teh yang diprediksi?",
      answer:
        "Kategori kematangan yang diprediksi bergantung pada bagaimana model dilatih, contohnya bisa 'Daun Muda' atau 'Daun Tua'.",
    },
    {
      question: "Apakah website ini bisa digunakan di perangkat mobile?",
      answer:
        "Ya, website ini dirancang agar responsif dan dapat diakses melalui perangkat mobile.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-poppins">
      <Navbar />
      {/* Hero Section */}
      <section
        id="beranda"
        className="relative bg-white px-4 sm:px-6 md:px-16 pt-28 sm:pt-16 pb-24 min-h-[60vh] md:min-h-[70vh] overflow-hidden"
      >
        {/* Gambar daun sebagai background di mobile */}
        <div
          className="absolute inset-0 md:hidden bg-[url('/assets/daun-teh.png')] bg-no-repeat bg-contain bg-bottom bg-center opacity-20 pointer-events-none"
          aria-hidden="true"
        ></div>

        {/* Konten Utama */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 h-full">
          {/* Kiri: Teks */}
          <div className="flex-1 flex flex-col gap-3 md:gap-5 text-center md:text-left">
            <span className="text-gray-700 text-base md:text-lg">
              Halo! Selamat Datang
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              <span className="text-gradient block">Pemetikan Daun</span>
              <span className="text-gradient block">Teh dengan Citra</span>
            </h1>
            <p className="italic text-gray-600 text-base sm:text-lg md:text-xl mt-2">
              "Membantu Pemetikan Daun Teh secara Efisien"
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 sm:gap-6 mt-10 sm:mt-4">
              <button
                onClick={() => {
                  document.getElementById('tentang-website').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
                className="px-8 py-3 rounded-xl font-semibold text-base sm:text-lg border-2 border-[#10b981] text-[#10b981] bg-white hover:bg-[#f0fdf4] hover:shadow-lg text-center cursor-pointer"
              >
                Ayo Jelajahi
              </button>
              <Link
                to="/prediksi"
                className="px-8 py-3 rounded-xl font-semibold text-base sm:text-lg text-white text-center"
                style={{
                  background:
                    "linear-gradient(90deg, #61BC43 0%, #10ACC6 100%)",
                  boxShadow: "0 4px 16px rgba(16,185,129,0.15)",
                }}
              >
                Coba Sekarang
              </Link>
            </div>
          </div>

          {/* Kanan: Gambar hanya di desktop */}
          <div className="hidden md:flex flex-1 justify-end">
            <img
              src="/assets/daun-teh.png"
              className="w-[480px] lg:w-[520px] h-auto"
              alt="Daun Teh"
            />
          </div>
        </div>

        {/* Panah ke bawah */}
        <div className="absolute left-1/2 -bottom-8 transform -translate-x-1/2 z-20">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
            <path
              d="M12 5v14m0 0l-7-7m7 7l7-7"
              stroke="#61BC43"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      {/* Tentang Website */}
      <section
        id="tentang-website"
        className="py-12 px-6 md:px-16"
        style={{ background: "#61BC43" }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
            Tentang Website
          </h2>
          <p className="text-green-50 mb-4 text-lg">
            Website ini dirancang untuk memberikan rekomendasi pemetikan daun
            teh dengan
            <br />
            memanfaatkan data dari citra, menghasilkan hasil analisis yang
            praktis bagi petani teh.
          </p>
          <div className="w-24 h-1 bg-white rounded mx-auto"></div>
        </div>
      </section>

      {/* Cara Kerja */}
      <section className="py-12 px-4 sm:px-6 md:px-16 bg-white">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-[#6FC24A]">
          Bagaimana Cara Kerjanya?
        </h2>
        <p className="text-center text-gray-700 mb-10 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
          Karena kita membuat website ini untuk petani, berikut panduan
          penggunaannya:
        </p>

        {/* Kontainer langkah-langkah */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] md:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible px-1 py-5">
          {/* Langkah 1 */}
          <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 sm:p-8 min-w-[260px] md:w-auto transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl cursor-pointer">
            <img
              src="/assets/1.png"
              alt="Upload Gambar"
              className="w-20 h-20 mb-4 sm:w-24 sm:h-24 sm:mb-6 object-contain"
            />
            <p className="text-gray-800 text-center font-bold text-base sm:text-lg">
              Klik "Upload Gambar"
            </p>
          </div>

          {/* Langkah 2 */}
          <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 sm:p-8 min-w-[260px] md:w-auto transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl cursor-pointer">
            <img
              src="/assets/2.png"
              alt="Pilih Gambar"
              className="w-20 h-20 mb-4 sm:w-24 sm:h-24 sm:mb-6 object-contain"
            />
            <p className="text-gray-800 text-center font-bold text-base sm:text-lg">
              Pilih Gambar Daun Teh di perangkat Anda
            </p>
          </div>

          {/* Langkah 3 */}
          <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 sm:p-8 min-w-[260px] md:w-auto transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl cursor-pointer">
            <img
              src="/assets/3.png"
              alt="Mulai Prediksi"
              className="w-20 h-20 mb-4 sm:w-24 sm:h-24 sm:mb-6 object-contain"
            />
            <p className="text-gray-800 text-center font-bold text-base sm:text-lg">
              Klik Proses Untuk Memulai Prediksi
            </p>
          </div>

          {/* Langkah 4 */}
          <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 sm:p-8 min-w-[260px] md:w-auto transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl cursor-pointer">
            <img
              src="/assets/4.png"
              alt="Lihat Hasil"
              className="w-20 h-20 mb-4 sm:w-24 sm:h-24 sm:mb-6 object-contain"
            />
            <p className="text-gray-800 text-center font-bold text-base sm:text-lg">
              Lihat Hasil Prediksi di Layar
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="py-12 px-6 md:px-16"
        style={{ background: "#ECF9E5" }}
      >
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-extrabold text-center mb-10"
            style={{ color: "#6FC24A" }}
          >
            FAQ – Sistem Prediksi Kematangan Daun Teh
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {faqData.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow p-6 flex flex-col transition-all"
                style={{ minHeight: "80px" }}
              >
                <button
                  className="flex items-center justify-between w-full focus:outline-none"
                  onClick={() => handleToggle(idx)}
                >
                  <span className="font-semibold text-lg text-gray-900 text-left">
                    {item.question}
                  </span>
                  {openIndex === idx ? (
                    <span className="ml-4 text-2xl text-[#6FC24A]">
                      &#x25BC;
                    </span> // panah bawah
                  ) : (
                    <span className="ml-4">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                      >
                        <circle cx="16" cy="16" r="16" fill="#6FC24A" />
                        <path
                          d="M10 17.5L14 21.5L22 13.5"
                          stroke="white"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                </button>
                {openIndex === idx && (
                  <div className="mt-4 text-gray-700 text-left border-t pt-4">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Beranda;
