import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Garis hijau tipis */}
      <div className="w-full h-2 bg-[#61BC43]" />
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/assets/logononbg.png" alt="LeafScan Logo" className="w-14 h-14" />
        </div>
        {/* Menu rata kanan */}
        <ul className="flex gap-12 text-lg font-semibold">
          <li>
            <Link
              to="/"
              className={`pb-1 ${location.pathname === '/' ? 'text-[#61BC43] border-b-2 border-[#61BC43]' : 'text-gray-800 hover:text-[#61BC43]'}`}
            >
              Beranda
            </Link>
          </li>
          <li>
            <Link
              to="/prediksi"
              className={`pb-1 ${location.pathname === '/prediksi' ? 'text-[#61BC43] border-b-2 border-[#61BC43]' : 'text-gray-800 hover:text-[#61BC43]'}`}
            >
              Prediksi
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
