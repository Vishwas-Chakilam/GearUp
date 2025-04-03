
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Car, Fuel, Wrench, CarFront, Mail, Info, FileText, Shield, Code } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1A1F2C] dark:bg-gray-900 text-gray-300 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 animate-enter">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Car className="w-6 h-6" />
              GearUp
            </h3>
            <p className="text-sm">
              Your premier destination for automotive news, reviews, and expert insights. 
              From classic cars to cutting-edge EVs, we've got you covered.
            </p>
          </div>
          
          <div className="animate-enter" style={{animationDelay: "100ms"}}>
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <CarFront className="w-5 h-5" />
              Categories
            </h4>
            <ul className="space-y-2">
              <li><Link to="/reviews" className="hover:text-white transition-colors duration-300 flex items-center gap-2"><Car className="w-4 h-4" />Car Reviews</Link></li>
              <li><Link to="/news" className="hover:text-white transition-colors duration-300 flex items-center gap-2"><Fuel className="w-4 h-4" />Automotive News</Link></li>
              <li><Link to="/guides" className="hover:text-white transition-colors duration-300 flex items-center gap-2"><Wrench className="w-4 h-4" />Maintenance Tips</Link></li>
            </ul>
          </div>
          
          <div className="animate-enter" style={{animationDelay: "200ms"}}>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-white transition-colors duration-300 flex items-center gap-2"><Info className="w-4 h-4" />About GearUp</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors duration-300 flex items-center gap-2"><Mail className="w-4 h-4" />Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors duration-300 flex items-center gap-2"><Shield className="w-4 h-4" />Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors duration-300 flex items-center gap-2"><FileText className="w-4 h-4" />Terms of Service</Link></li>
              <li><Link to="/developer" className="hover:text-white transition-colors duration-300 flex items-center gap-2"><Code className="w-4 h-4" />Developer</Link></li>
            </ul>
          </div>
          
          <div className="animate-enter" style={{animationDelay: "300ms"}}>
            <h4 className="font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300 p-2 hover:bg-gray-800 rounded-full hover-scale">
                <Github size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300 p-2 hover:bg-gray-800 rounded-full hover-scale">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300 p-2 hover:bg-gray-800 rounded-full hover-scale">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-sm text-center transition-colors duration-300">
          <p>&copy; {new Date().getFullYear()} GearUp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
