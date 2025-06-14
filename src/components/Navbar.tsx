import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isClient) {
    return (
      <nav className="fixed w-full z-50 bg-[#4A102A] py-2 shadow-xl">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[#C5172E] rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <span className="text-white text-xl font-bold">
              Karachi Bus Tracker
            </span>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#4A102A] py-2 shadow-xl' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <motion.div 
            whileHover={{ rotate: 10 }}
            className="w-10 h-10 bg-[#C5172E] rounded-full flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </motion.div>
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white text-xl font-bold"
          >
            Karachi Bus Tracker
          </motion.span>
        </Link>

        <div className="hidden md:flex space-x-8">
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#map">Live Map</NavLink>
          <NavLink href="/plan">Plan Journey</NavLink>
          <NavLink href="#routes">Routes</NavLink>
          <NavLink href="#download">Download</NavLink>
          <Link href="/login" className="bg-[#C5172E] text-white px-4 py-2 rounded-lg hover:bg-[#b01529] transition-colors">
            Driver Login
          </Link>
        </div>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#4A102A] overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <NavLink href="#features" onClick={() => setIsMenuOpen(false)}>Features</NavLink>
              <NavLink href="#map" onClick={() => setIsMenuOpen(false)}>Live Map</NavLink>
              <NavLink href="/plan" onClick={() => setIsMenuOpen(false)}>Plan Journey</NavLink>
              <NavLink href="#routes" onClick={() => setIsMenuOpen(false)}>Routes</NavLink>
              <NavLink href="#download" onClick={() => setIsMenuOpen(false)}>Download</NavLink>
              <Link href="/login" className="bg-[#C5172E] text-white px-4 py-2 rounded-lg text-center hover:bg-[#b01529] transition-colors">
                Driver Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link href={href} passHref legacyBehavior>
      <motion.a 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="text-white hover:text-[#FCF259] transition-colors font-medium"
      >
        {children}
      </motion.a>
    </Link>
  );
}