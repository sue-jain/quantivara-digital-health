
import { Smartphone, Shield, Globe, Zap, Users, BarChart3 } from 'lucide-react';

const FeaturesShowcase = () => {
  const features = [
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Built specifically for smartphones - the only device rural doctors have access to.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "ABDM compliant with end-to-end encryption and secure data handling.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Globe,
      title: "Offline Capable",
      description: "Works seamlessly without internet, syncing when connection is available.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Zap,
      title: "AI-Powered",
      description: "Advanced AI converts handwritten prescriptions to clean digital records.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Users,
      title: "Multi-Stakeholder",
      description: "Connects doctors, patients, pharmacies, labs, and insurance providers.",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive insights and reporting for better healthcare management.",
      color: "from-pink-500 to-pink-600"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
            Powerful Features for Modern Healthcare
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to deliver exceptional healthcare across India
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-heading font-bold text-xl text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;
