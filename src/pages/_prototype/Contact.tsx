
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, MessageSquare, Calendar, Users } from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organizationType: '',
    location: '',
    currentSystem: '',
    requirements: '',
    demoDate: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Demo Request Submitted!",
        description: "Thank you for your interest. Our team will contact you within 24 hours to schedule your personalized demo.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        organizationType: '',
        location: '',
        currentSystem: '',
        requirements: '',
        demoDate: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'hello@quantivara.com',
      description: 'Send us an email anytime'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+91 98765 43210',
      description: 'Mon-Fri from 8am to 6pm IST'
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp',
      details: '+91 98765 43210',
      description: 'Chat with us on WhatsApp'
    },
    {
      icon: MapPin,
      title: 'Locations',
      details: 'Pan-India Operations',
      description: 'Mumbai • Delhi • Bangalore • Kolkata'
    }
  ];

  const partnershipOptions = [
    {
      icon: Users,
      title: 'Healthcare Providers',
      description: 'Join our network of hospitals, clinics, and healthcare professionals',
      action: 'Become a Partner'
    },
    {
      icon: MessageSquare,
      title: 'Technology Partners',
      description: 'Integrate with our platform and expand your healthcare solutions',
      action: 'Partner with Us'
    },
    {
      icon: Calendar,
      title: 'Investors',
      description: 'Interested in investing in India\'s healthcare transformation?',
      action: 'Investment Inquiry'
    }
  ];

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
            {/* Contact Form */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                  Request a Demo
                </h2>
                <p className="text-lg text-gray-600">
                  Get a personalized demonstration of how Quantivara can transform your healthcare operations.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Dr. Rajesh Kumar"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="rajesh@hospital.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Type *
                    </label>
                    <Select value={formData.organizationType} onValueChange={(value) => handleInputChange('organizationType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hospital">Hospital</SelectItem>
                        <SelectItem value="clinic">Clinic</SelectItem>
                        <SelectItem value="pharmacy">Pharmacy</SelectItem>
                        <SelectItem value="lab">Laboratory</SelectItem>
                        <SelectItem value="doctor">Individual Doctor</SelectItem>
                        <SelectItem value="government">Government Health Dept</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location (State/City) *
                    </label>
                    <Input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Maharashtra, Mumbai"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current System Used
                    </label>
                    <Input
                      type="text"
                      value={formData.currentSystem}
                      onChange={(e) => handleInputChange('currentSystem', e.target.value)}
                      placeholder="Paper-based, EMR, etc."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Demo Date/Time
                  </label>
                  <Input
                    type="text"
                    value={formData.demoDate}
                    onChange={(e) => handleInputChange('demoDate', e.target.value)}
                    placeholder="e.g., Next week, any weekday afternoon"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Requirements
                  </label>
                  <Textarea
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    placeholder="Tell us about your specific needs, number of doctors, patient volume, etc."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Message
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Any other questions or information you'd like to share?"
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600 hover:from-healthcare-blue-700 hover:to-healthcare-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Request Demo'}
                </Button>

                <p className="text-sm text-gray-500">
                  * Required fields. We'll contact you within 24 hours to schedule your demo.
                </p>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                  Get in Touch
                </h2>
                <p className="text-lg text-gray-600">
                  Multiple ways to reach our team. We're here to help transform your healthcare operations.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-2xl">
                    <div className="w-12 h-12 bg-gradient-to-r from-healthcare-blue-100 to-healthcare-green-100 rounded-xl flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-healthcare-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="font-medium text-healthcare-blue-600 mb-1">
                        {item.details}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-r from-healthcare-blue-900 to-healthcare-green-900 text-white rounded-2xl p-6">
                <h3 className="font-heading font-bold text-xl mb-4">Response Time</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">&lt; 24 hrs</div>
                    <p className="text-blue-100 text-sm">Demo Scheduling</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">&lt; 2 hrs</div>
                    <p className="text-blue-100 text-sm">Email Response</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Opportunities */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
              Partnership Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join us in transforming healthcare across India through strategic partnerships
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {partnershipOptions.map((option, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-healthcare-blue-100 to-healthcare-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <option.icon className="h-8 w-8 text-healthcare-blue-600" />
                </div>
                <h3 className="font-heading font-bold text-xl text-gray-900 mb-4">
                  {option.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {option.description}
                </p>
                <Button variant="outline" className="border-healthcare-blue-200 text-healthcare-blue-700 hover:bg-healthcare-blue-50">
                  {option.action}
                </Button>
              </div>
            ))}
          </div>

          {/* Office Locations */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-4">
                Our Presence Across India
              </h3>
              <p className="text-lg text-gray-600">
                Regional offices and operations spanning urban and rural India
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { city: 'Mumbai', region: 'Western India', focus: 'Corporate Headquarters' },
                { city: 'Delhi NCR', region: 'Northern India', focus: 'Government Relations' },
                { city: 'Bangalore', region: 'Southern India', focus: 'Technology Center' },
                { city: 'Kolkata', region: 'Eastern India', focus: 'Rural Healthcare Hub' }
              ].map((office, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-healthcare-blue-500 to-healthcare-green-500 rounded-full flex items-center justify-center mx-auto text-white font-bold">
                    {office.city.slice(0, 1)}
                  </div>
                  <h4 className="font-heading font-bold text-lg text-gray-900">
                    {office.city}
                  </h4>
                  <p className="text-healthcare-blue-600 font-medium text-sm">
                    {office.region}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {office.focus}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
