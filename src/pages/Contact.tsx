
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ContactForm from '@/components/forms/ContactForm';
import ContactInfo from '@/components/sections/ContactInfo';
import PartnershipSection from '@/components/sections/PartnershipSection';
import { Button } from '@/components/ui/button';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-healthcare-blue-50 via-white to-healthcare-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900">
              Contact Quantivara
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Healthcare Platform Demo & Partnership Inquiries
            </p>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </section>

      {/* Partnership Opportunities */}
      <PartnershipSection />

      {/* FAQ Quick Access */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
              Have Questions Before Reaching Out?
            </h2>
            <p className="text-xl text-gray-600">
              Check our comprehensive documentation and frequently asked questions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="border-healthcare-blue-200 text-healthcare-blue-700 hover:bg-healthcare-blue-50">
                View Documentation
              </Button>
              <Button size="lg" variant="outline" className="border-healthcare-green-200 text-healthcare-green-700 hover:bg-healthcare-green-50">
                Read FAQ
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
