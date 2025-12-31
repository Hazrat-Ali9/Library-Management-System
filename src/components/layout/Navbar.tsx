import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiBook, FiPlusCircle, FiList, FiHome, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import { ModeToggle } from "../mode-toggle";

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", name: "Home", icon: <FiHome className="mr-1" /> },
    { path: "/books", name: "All Books", icon: <FiBook className="mr-1" /> },
    { path: "/create-book", name: "Add Book", icon: <FiPlusCircle className="mr-1" /> },
    { path: "/borrow-summary", name: "Borrow Summary", icon: <FiList className="mr-1" /> }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="fixed top-0 left-0 right-0 bg-gradient-to-r from-sky-900 to-sky-800 text-white shadow-lg z-50"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo with floating letters animation */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold"
          >
            <Link to="/" className="flex items-center">
              {"LibroVault".split("").map((letter, index) => (
                <motion.span
                  key={index}
                  className="bg-gradient-to-r from-sky-400 to-sky-300 bg-clip-text text-transparent"
                  animate={{
                    y: [0, -4, 0],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: index * 0.1,
                    ease: "easeInOut"
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            {navLinks.map((link) => (
              <motion.div
                key={link.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={link.path}
                  className={`flex items-center px-3 py-2 rounded-lg transition-all ${
                    location.pathname === link.path
                      ? "bg-sky-700 shadow-inner"
                      : "hover:bg-sky-700/50"
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-sky-700/50 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          
        {/* <ModeToggle>
          
          </ModeToggle> */}
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden mt-2"
            >
              <div className="flex flex-col space-y-2 py-2">
                {navLinks.map((link) => (
                  <motion.div
                    key={link.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-3 py-3 rounded-lg transition-all ${
                        location.pathname === link.path
                          ? "bg-sky-700 shadow-inner"
                          : "hover:bg-sky-700/50"
                      }`}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.nav>
  );
};

export default Navbar;