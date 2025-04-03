
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, Scale, AlertCircle } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Helmet>
        <title>Terms of Service | GearUp</title>
        <meta name="description" content="Please read these terms of service carefully before using GearUp's website and services" />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-16 md:py-24 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">Terms of Service</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 md:p-12 mb-12">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>
                Welcome to GearUp. Please read these terms of service ("Terms") carefully before using our website. 
                These Terms set forth the legally binding terms and conditions for your use of our website.
              </p>
              
              <h2 className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Acceptance of Terms
              </h2>
              
              <p>
                By accessing or using our website, you agree to be bound by these Terms. If you disagree with any part of the terms, 
                then you may not access our website.
              </p>
              
              <h2>Content</h2>
              
              <p>
                Our website allows you to access various content, including articles, reviews, guides, and other materials 
                ("Content"). The Content is intended for informational purposes only.
              </p>
              
              <h3>User Content</h3>
              <p>
                Users may post, upload, or otherwise contribute content to the site ("User Content"). By submitting User Content, 
                you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, 
                create derivative works from, distribute, and display such content in any media.
              </p>
              
              <h3>Content Accuracy</h3>
              <p>
                We make every effort to provide accurate information, but we do not warrant that product descriptions or other 
                content is accurate, complete, reliable, current, or error-free. If a product offered by us is not as described, 
                your sole remedy is to discontinue using it.
              </p>
              
              <h2 className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Prohibited Uses
              </h2>
              
              <p>In addition to other prohibitions, you are prohibited from using the site or its content:</p>
              <ul>
                <li>For any unlawful purpose</li>
                <li>To solicit others to perform or participate in any unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
                <li>To collect or track the personal information of others</li>
                <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                <li>For any obscene or immoral purpose</li>
              </ul>
              
              <h2>Disclaimer</h2>
              <p>
                Your use of our website is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE" basis. 
                The service is provided without warranties of any kind, whether express or implied, including, but not limited to, 
                implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
              </p>
              
              <h2>Limitation of Liability</h2>
              <p>
                In no event shall GearUp, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any 
                indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, 
                use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
              </p>
              
              <h2>Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material 
                we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change 
                will be determined at our sole discretion.
              </p>
              
              <h2>Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p>
                <a href="mailto:legal@gearup.com" className="text-primary hover:underline">legal@gearup.com</a><br />
                123 Automotive Avenue<br />
                San Francisco, CA 94103
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
