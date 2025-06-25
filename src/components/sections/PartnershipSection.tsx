
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, Calendar } from 'lucide-react';

const PartnershipSection = () => {
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

  const officeLocations = [
    { city: 'Mumbai', region: 'Western India', focus: 'Corporate Headquarters' },
    { city: 'Delhi NCR', region: 'Northern India', focus: 'Government Relations' },
    { city: 'Bangalore', region: 'Southern India', focus: 'Technology Center' },
    { city: 'Kolkata', region: 'Eastern India', focus: 'Rural Healthcare Hub' }
  ];

  return (
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
            {officeLocations.map((office, index) => (
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
  );
};

export default PartnershipSection;
