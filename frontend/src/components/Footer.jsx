import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-8">
      {/* Bagian atas */}
      <div className="bg-white shadow rounded-t-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-8 py-8 gap-8">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start">
            <img src="/assets/logononbg.png" alt="LeafScan Logo" className="w-20 h-20" />
          </div>
          {/* Menu */}
          <div className="flex gap-12 text-lg font-semibold text-black">
            <Link to="/" className="hover:text-[#6FC24A] transition">Beranda</Link>
            <Link to="/prediksi" className="hover:text-[#6FC24A] transition">Prediksi</Link>
          </div>
          {/* Sosmed */}
          <div className="flex gap-6">
            <a href="#" className="rounded-full border-2 border-[#6FC24A] p-2 text-[#6FC24A] bg-white shadow-md hover:bg-[#6FC24A] hover:text-white transition-all duration-200">
              <i className="fab fa-tiktok"></i>
            </a>
            <a href="#" className="rounded-full border-2 border-[#6FC24A] p-2 text-[#6FC24A] bg-white shadow-md hover:bg-[#6FC24A] hover:text-white transition-all duration-200">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="rounded-full border-2 border-[#6FC24A] p-2 text-[#6FC24A] bg-white shadow-md hover:bg-[#6FC24A] hover:text-white transition-all duration-200">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="#" className="rounded-full border-2 border-[#6FC24A] p-2 text-[#6FC24A] bg-white shadow-md hover:bg-[#6FC24A] hover:text-white transition-all duration-200">
              <i className="fab fa-facebook"></i>
            </a>
          </div>
        </div>
      </div>
      {/* Bagian bawah */}
      <div className="bg-[#6FC24A] text-center py-3 text-white font-bold text-base tracking-wide">
        © 2025 KURNIA ADILLA
      </div>
    </footer>
  );
};

export default Footer; 