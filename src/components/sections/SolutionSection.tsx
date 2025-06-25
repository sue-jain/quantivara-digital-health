
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Smartphone, Bot, Wifi, Link as LinkIcon, CheckCircle2 } from 'lucide-react';

const SolutionSection = () => {
  const features = [
    {
      icon: Smartphone,
      title: "Mobile-First",
      subtitle: "No laptops, just phones",
      description: "Designed specifically for smartphones - the only device rural doctors have access to.",
      gradient: "from-healthcare-blue-500 to-healthcare-blue-600"
    },
    {
      icon: Bot,
      title: "AI-Powered",
      subtitle: "Handwriting to digital records",
      description: "Advanced AI converts doctor's handwritten prescriptions into clean digital records instantly.",
      gradient: "from-healthcare-green-500 to-healthcare-green-600"
    },
    {
      icon: Wifi,
      title: "Offline-Capable",
      subtitle: "Works without internet",
      description: "Functions seamlessly in areas with poor connectivity, syncing when internet is available.",
      gradient: "from-healthcare-orange-500 to-healthcare-orange-600"
    },
    {
      icon: LinkIcon,
      title: "Interoperable",
      subtitle: "Connects all healthcare stakeholders",
      description: "Seamlessly links doctors, patients, pharmacies, labs, and insurance providers.",
      gradient: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
            What if India's entire healthcare system 
            <span className="block text-healthcare-blue-600">could speak the same language?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Quantivara bridges the gap with AI-powered technology that works where it matters most - 
            on mobile phones, in rural clinics, without requiring perfect internet connectivity.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="relative group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="font-medium text-healthcare-blue-600 mb-3">
                {feature.subtitle}
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-healthcare-blue-50 to-healthcare-green-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-healthcare-blue-50 to-healthcare-green-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-4">
              How It Works
            </h3>
            <p className="text-lg text-gray-600">
              Simple steps that transform healthcare delivery across India
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { step: "1", icon: "🩺", text: "Doctor writes prescription" },
              { step: "2", icon: "📱", text: "Snap photo with phone" },
              { step: "3", icon: "🤖", text: "AI converts to digital" },
              { step: "4", icon: "🧪", text: "Lab/pharmacy receives order" },
              { step: "5", icon: "📊", text: "Patient gets results" },
              { step: "6", icon: "🛡️", text: "Insurance processes automatically" }
            ].map((item, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <div className="text-sm font-medium text-healthcare-blue-600">
                  Step {item.step}
                </div>
                <p className="text-sm text-gray-700 leading-tight">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Summary */}
        <div className="mt-16 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
              The Result? Healthcare That Actually Works for India
            </h3>
            
            <div className="space-y-4">
              {[
                "Rural doctors get the same tools as urban specialists",
                "Patients receive consistent care regardless of location", 
                "Pharmacies and labs work seamlessly with all providers",
                "Insurance claims process automatically and transparently",
                "Healthcare data follows patients across the entire system"
              ].map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-healthcare-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button size="lg" className="bg-gradient-to-r from-healthcare-green-600 to-healthcare-green-700 hover:from-healthcare-green-700 hover:to-healthcare-green-800" asChild>
                <Link to="/technology">
                  Explore Our Technology
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-healthcare-blue-100 to-healthcare-green-100 rounded-3xl p-8">
              <div className="w-full h-full bg-white rounded-2xl p-6 flex items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="text-6xl">🌐</div>
                  <h4 className="font-heading font-bold text-xl text-gray-800">
                    Connected Healthcare Ecosystem
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="w-8 h-8 bg-healthcare-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-xs">👨‍⚕️</span>
                      </div>
                      <span className="text-gray-600">Doctors</span>
                    </div>
                    <div className="space-y-2">
                      <div className="w-8 h-8 bg-healthcare-green-100 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-xs">👥</span>
                      </div>
                      <span className="text-gray-600">Patients</span>
                    </div>
                    <div className="space-y-2">
                      <div className="w-8 h-8 bg-healthcare-orange-100 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-xs">💊</span>
                      </div>
                      <span className="text-gray-600">Pharmacies</span>
                    </div>
                    <div className="space-y-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-xs">🧪</span>
                      </div>
                      <span className="text-gray-600">Labs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
