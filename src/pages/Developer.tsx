
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

const Developer = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-300">
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Developer</h1>
            
            <div className="space-y-6 text-gray-700 dark:text-gray-300">
              <p className="text-lg">
                GearUp is developed and maintained by passionate automotive enthusiasts with expertise in web development.
              </p>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Main Developer</h2>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    VC
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Vishwas Chakilam</h3>
                    <p className="text-gray-600 dark:text-gray-400">Lead Developer</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => window.open('https://github.com/vishwas-chakilam', '_blank')}
                  >
                    <Github size={18} />
                    github.com/vishwas-chakilam
                  </Button>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">About This Project</h2>
                <p>
                  GearUp is built with modern web technologies to provide car enthusiasts with a seamless experience 
                  for discovering automotive content. The tech stack includes React, TypeScript, TailwindCSS, 
                  and Supabase for backend functionality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Developer;
