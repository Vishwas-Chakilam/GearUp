
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Helmet>
        <title>Privacy Policy | GearUp</title>
        <meta name="description" content="GearUp's privacy policy explains how we collect, use, and protect your personal information" />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-16 md:py-24 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">Privacy Policy</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 md:p-12 mb-12">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>
                At GearUp, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
                and safeguard your information when you visit our website, including any other media form, media channel, 
                mobile website, or mobile application related or connected to GearUp.
              </p>
              
              <h2 className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Information We Collect
              </h2>
              
              <h3>Personal Data</h3>
              <p>
                When you register on our site, subscribe to our newsletter, or fill out a form, we may collect personal 
                information such as your name, email address, mailing address, and phone number. This information is used 
                to personalize your experience, improve our website, and send periodic emails if you opt in to receive them.
              </p>
              
              <h3>Usage Data</h3>
              <p>
                We may also collect information on how the website is accessed and used. This usage data may include your 
                computer's Internet Protocol address (IP address), browser type, browser version, the pages of our website 
                that you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data.
              </p>
              
              <h2 className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                How We Use Your Information
              </h2>
              
              <p>We may use the information we collect from you in the following ways:</p>
              <ul>
                <li>To personalize your experience and deliver content relevant to your interests</li>
                <li>To improve our website based on the feedback and information we receive from you</li>
                <li>To process transactions and send related information including confirmations and invoices</li>
                <li>To send periodic emails regarding your order or other products and services</li>
                <li>To follow up after correspondence (email or phone inquiries)</li>
              </ul>
              
              <h2>Third-Party Disclosure</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties unless 
                we provide users with advance notice. This does not include website hosting partners and other parties who assist 
                us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep 
                this information confidential.
              </p>
              
              <h2>Cookies</h2>
              <p>
                We use cookies to understand and save user's preferences for future visits, compile aggregate data about site traffic 
                and site interactions, and to enhance other services we provide. You can choose to have your computer warn you each 
                time a cookie is being sent, or you can choose to turn off all cookies through your browser settings.
              </p>
              
              <h2>Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy 
                on this page and updating the "Last Updated" date at the top of this page. You are advised to review this Privacy Policy 
                periodically for any changes.
              </p>
              
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p>
                <a href="mailto:privacy@gearup.com" className="text-primary hover:underline">privacy@gearup.com</a><br />
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

export default Privacy;
