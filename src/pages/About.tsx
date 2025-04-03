
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Info, Car, Users, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Helmet>
        <title>About GearUp | Your Automotive Guide</title>
        <meta name="description" content="Learn about GearUp, your premier automotive news and review platform" />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-16 md:py-24 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Info className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">About GearUp</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">Your premier destination for automotive news, reviews, and expert insights.</p>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
            <p>
              Founded in 2023, GearUp was created by a team of automotive enthusiasts who saw a need for honest, 
              in-depth coverage of the rapidly evolving automotive landscape. From classic car preservation to the 
              latest in electric vehicle technology, our goal is to provide our readers with content that is both 
              informative and engaging.
            </p>
            
            <p>
              What sets GearUp apart is our commitment to thorough, unbiased reporting. Our team includes former 
              automotive engineers, professional drivers, and industry veterans who bring their expertise to 
              every article we publish. Whether you're a casual car enthusiast or a dedicated gearhead, 
              we strive to deliver content that matters to you.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                <Car className="w-6 h-6 text-primary dark:text-blue-300" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Expert Reviews</h3>
              <p className="text-gray-600 dark:text-gray-300">Our team tests and reviews the latest vehicles with a critical eye for detail and performance.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                <Users className="w-6 h-6 text-primary dark:text-blue-300" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Community Focused</h3>
              <p className="text-gray-600 dark:text-gray-300">We build content around what our readers care about most in the automotive world.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                <Award className="w-6 h-6 text-primary dark:text-blue-300" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Industry Recognition</h3>
              <p className="text-gray-600 dark:text-gray-300">Our content has been recognized for its quality, depth, and automotive expertise.</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 md:p-12 shadow-md">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 dark:text-white">Our Mission</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              At GearUp, our mission is to provide comprehensive, accurate, and engaging automotive content 
              that helps our readers make informed decisions and deepen their appreciation for all things automotive. 
              We believe in the power of honest journalism and technical expertise to elevate the conversation around 
              cars, trucks, and the future of transportation.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              As the automotive landscape continues to evolve with new technologies and approaches to mobility, 
              GearUp will be there every step of the way, bringing you the insights and analysis you need to 
              stay informed and engaged.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
