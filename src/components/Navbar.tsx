
import { useState } from "react";
import { Link } from "react-router-dom";
import { Car, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="backdrop-blur-md bg-white/70 dark:bg-black/50 sticky top-0 z-50 transition-colors duration-300 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 hover-scale">
              <Car className="w-6 h-6 text-primary" />
              <span className="text-xl font-semibold text-gray-900 dark:text-white">GearUp</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-10">
            <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">
              Home
            </Link>
            <Link to="/reviews" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">
              Reviews
            </Link>
            <Link to="/guides" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">
              Guides
            </Link>
            <Link to="/news" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">
              News
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="sm:hidden animate-fade-in">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-xl"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/reviews"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-xl"
                onClick={() => setIsOpen(false)}
              >
                Reviews
              </Link>
              <Link
                to="/guides"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-xl"
                onClick={() => setIsOpen(false)}
              >
                Guides
              </Link>
              <Link
                to="/news"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-xl"
                onClick={() => setIsOpen(false)}
              >
                News
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
