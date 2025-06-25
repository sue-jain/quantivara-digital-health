
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Stethoscope, 
  Users, 
  Pill, 
  FlaskConical, 
  MapPin,
  CheckCircle2,
  ArrowRight,
  Shield,
  Clock,
  TrendingUp
} from 'lucide-react';

const Solutions = () => {
  const solutions = [
    {
      id: 'doctors',
      icon: Stethoscope,
      title: 'For Doctors',
      subtitle: 'Digital prescription generation & patient management',
      description: 'Transform your practice with AI-powered tools that work on just your smartphone',
      gradient: 'from-healthcare-blue-500 to-healthcare-blue-600',
      features: [
        'Digital prescription generation from handwritten notes',
        'Complete patient history access across visits',
        'AI-assisted diagnosis support and recommendations',
        'Legal protection with digital audit trails',
        'No laptop or printer required - mobile-only',
        'Offline capability for areas with poor connectivity',
        'Integration with labs and pharmacies',
        'Automatic follow-up reminders'
      ],
      benefits: [
        { icon: Clock, text: '70% reduction in prescription time' },
        { icon: Shield, text: 'Legal protection with digital records' },
        { icon: TrendingUp, text: 'Better patient outcomes tracking' }
      ]
    },
    {
      id: 'patients',
      icon: Users,
      title: 'For Patients',
      subtitle: 'Unified health records & telemedicine access',
      description: 'Access quality healthcare anywhere in India through your smartphone',
      gradient: 'from-healthcare-green-500 to-healthcare-green-600',
      features: [
        'Unified health records accessible on phone',
        'Telemedicine consultations with specialists',
        'Medicine home delivery to rural areas',
        'Price comparison for medications',
        'Appointment scheduling across providers',
        'Health reminders and follow-up alerts',
        'Insurance claim assistance',
        'Multi-language support'
      ],
      benefits: [
        { icon: MapPin, text: 'No travel required for consultations' },
        { icon: TrendingUp, text: '50% cost reduction in healthcare' },
        { icon: Clock, text: '24/7 access to health records' }
      ]
    },
    {
      id: 'pharmacies',
      icon: Pill,
      title: 'For Pharmacies',
      subtitle: 'Digital prescription receipt & inventory management',
      description: 'Streamline operations with digital prescriptions and smart inventory',
      gradient: 'from-healthcare-orange-500 to-healthcare-orange-600',
      features: [
        'Digital prescription receipt and processing',
        'Automated inventory management and alerts',
        'Reduced errors from handwriting interpretation',
        'Stock optimization based on demand patterns',
        'Patient medication history tracking',
        'Integration with doctor and lab systems',
        'Automated insurance claim processing',
        'Real-time drug interaction warnings'
      ],
      benefits: [
        { icon: CheckCircle2, text: '90% reduction in prescription errors' },
        { icon: TrendingUp, text: '30% increase in operational efficiency' },
        { icon: Shield, text: 'Compliance with regulatory requirements' }
      ]
    },
    {
      id: 'labs',
      icon: FlaskConical,
      title: 'For Labs',
      subtitle: 'Seamless result sharing & digital reporting',
      description: 'Connect with the entire healthcare ecosystem for better patient care',
      gradient: 'from-purple-500 to-purple-600',
      features: [
        'Seamless result sharing with doctors and patients',
        'Digital order processing and tracking',
        'Quality control and result validation',
        'Automated report distribution',
        'Integration with hospital management systems',
        'Real-time status updates for patients',
        'Historical data analysis and trends',
        'Regulatory compliance reporting'
      ],
      benefits: [
        { icon: Clock, text: '60% faster result delivery' },
        { icon: CheckCircle2, text: 'Zero manual report distribution' },
        { icon: TrendingUp, text: 'Improved patient satisfaction' }
      ]
    },
    {
      id: 'rural',
      icon: MapPin,
      title: 'Rural Healthcare',
      subtitle: 'Offline-first design for remote areas',
      description: 'Bringing advanced healthcare technology to every village in India',
      gradient: 'from-emerald-500 to-emerald-600',
      features: [
        'Offline-first design for poor connectivity areas',
        'Mobile-only operation - no laptops needed',
        'Multi-language interface in regional languages',
        'Low-bandwidth optimization for slow networks',
        'Village-level healthcare worker support',
        'Telemedicine connections to urban specialists',
        'Local health data storage and sync',
        'Community health program integration'
      ],
      benefits: [
        { icon: MapPin, text: 'Reaches remote villages effectively' },
        { icon: Users, text: 'Connects rural patients to specialists' },
        { icon: Shield, text: 'Works without internet connectivity' }
      ]
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
              Healthcare Solutions for Everyone
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Tailored solutions for doctors, patients, pharmacies, labs, and rural healthcare providers across India
            </p>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
              Complete Healthcare Ecosystem
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform connects every stakeholder in the healthcare system, creating seamless experiences for all
            </p>
          </div>

          {/* Solutions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {solutions.slice(0, 3).map((solution, index) => (
              <div 
                key={solution.id}
                className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                onClick={() => document.getElementById(solution.id)?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${solution.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <solution.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="font-heading font-bold text-2xl text-gray-900 mb-3">
                  {solution.title}
                </h3>
                <p className="text-healthcare-blue-600 font-medium mb-4">
                  {solution.subtitle}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {solution.description}
                </p>

                <div className="flex items-center text-healthcare-blue-600 font-medium">
                  <span>Learn More</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            ))}
          </div>

          {/* Rural Healthcare & Labs */}
          <div className="grid md:grid-cols-2 gap-8">
            {solutions.slice(3).map((solution, index) => (
              <div 
                key={solution.id}
                className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                onClick={() => document.getElementById(solution.id)?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${solution.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <solution.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="font-heading font-bold text-2xl text-gray-900 mb-3">
                  {solution.title}
                </h3>
                <p className="text-healthcare-blue-600 font-medium mb-4">
                  {solution.subtitle}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {solution.description}
                </p>

                <div className="flex items-center text-healthcare-blue-600 font-medium">
                  <span>Learn More</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Solutions */}
      {solutions.map((solution, index) => (
        <section 
          key={solution.id}
          id={solution.id}
          className={`py-20 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
        >
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className={`space-y-8 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${solution.gradient} rounded-2xl flex items-center justify-center`}>
                      <solution.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
                        {solution.title}
                      </h2>
                      <p className="text-lg text-healthcare-blue-600 font-medium">
                        {solution.subtitle}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {solution.description}
                  </p>
                </div>

                {/* Key Benefits */}
                <div>
                  <h3 className="font-heading font-bold text-xl text-gray-900 mb-4">
                    Key Benefits
                  </h3>
                  <div className="grid gap-4">
                    {solution.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-healthcare-green-100 rounded-full flex items-center justify-center">
                          <benefit.icon className="h-5 w-5 text-healthcare-green-600" />
                        </div>
                        <span className="text-gray-700 font-medium">{benefit.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button size="lg" className={`bg-gradient-to-r ${solution.gradient} hover:opacity-90`} asChild>
                  <Link to="/contact">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="bg-white rounded-3xl p-8 shadow-lg">
                  <h3 className="font-heading font-bold text-xl text-gray-900 mb-6">
                    Complete Feature Set
                  </h3>
                  <ul className="space-y-4">
                    {solution.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-healthcare-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Integration Overview */}
      <section className="py-20 bg-gradient-to-r from-healthcare-blue-900 to-healthcare-green-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Seamless Integration Across All Stakeholders
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Our platform creates a unified ecosystem where all healthcare providers work together seamlessly
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto">
                <Stethoscope className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-heading font-bold text-lg">Doctors</h3>
              <p className="text-blue-100 text-sm">
                Digital prescriptions and patient management
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-heading font-bold text-lg">Patients</h3>
              <p className="text-blue-100 text-sm">
                Unified health records and telemedicine access
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto">
                <Pill className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-heading font-bold text-lg">Pharmacies</h3>
              <p className="text-blue-100 text-sm">
                Digital prescription processing and inventory
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto">
                <FlaskConical className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-heading font-bold text-lg">Labs</h3>
              <p className="text-blue-100 text-sm">
                Seamless result sharing and reporting
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button size="lg" variant="outline" className="bg-white text-healthcare-blue-900 hover:bg-gray-100" asChild>
              <Link to="/technology">
                Explore Integration Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
              Ready to Transform Your Healthcare Operations?
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of healthcare providers already using Quantivara to deliver better care across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600" asChild>
                <Link to="/contact">
                  Request Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Solutions;
