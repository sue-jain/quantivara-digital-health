
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

const ContactInfo = () => {
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

  return (
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
            <div className="text-2xl font-bold">{"< 24 hrs"}</div>
            <p className="text-blue-100 text-sm">Demo Scheduling</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{"< 2 hrs"}</div>
            <p className="text-blue-100 text-sm">Email Response</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
