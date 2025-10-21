import React, { useState } from "react";
import { Menu, X, History, MessageCircleQuestionMark, SearchSlash  } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from 'next/link';

interface NavItem {
  label?: string;
  href?: string;
  icon?: React.ReactNode;
  className?: string;
}

const navItems: NavItem[] = [
  { label: "Riwayat", href: "/dashboard/history", icon: <History size={20}/> },
  { label: "Tentang", href: "/about", icon: <SearchSlash size={20} />},
  { label: "Bantuan", href: "/contact", icon: <MessageCircleQuestionMark size={20}/> },
];

const MobileHeader: React.FC<NavItem> = ({
  className = "md:hidden"
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <header className={`bg-white shadow-md px-5 py-4 flex justify-between items-center md:hidden relative z-50 ${className}`}>
      <Link href={'/dashboard'} className="font-bold text-xl text-[#1192e8]">buyMe</Link>

      <button
        className="text-gray-800 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={28} color="#003366" className="cursor-pointer"/> : <Menu size={28} color="#003366" className="cursor-pointer"/>}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-xl py-4"
          >
            <ul className="flex flex-col space-y-2 px-6">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="flex justify-between items-center py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    onClick={() => setIsOpen(false)} 
                  >
                    {item.label}
                    <span className="border border-gray-300 w-full mx-3"></span>
                    {item.icon}
                  </a>
                </li>
              ))}
              <li><button className="text-red-500 hover:text-red-600 block py-2 font-medium cursor-pointer" onClick={handleLogout}>Keluar</button></li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default MobileHeader;
