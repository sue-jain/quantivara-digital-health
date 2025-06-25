
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
  Smartphone,
  Brain,
  Shield,
  Clock,
  CheckCircle2,
  ArrowRight,
  Heart,
  FileText,
  Calendar,
  MessageSquare
} from 'lucide-react';

const Solutions = () => {
  const solutions = [
    {
      id: 'doctors',
      icon: Stethoscope,
      title: 'For Doctors',
      subtitle: 'Digital Practice Management',
      description: 'Transform your practice with AI-powered tools that work on your smartphone',
      color: 'from-healthcare-blue-500 to-healthcare-blue-600',
      features: [
        'AI handwriting recognition for instant digital prescriptions',
        'Patient history access across all healthcare providers', 
        'AI-assisted diagnosis support and drug interaction alerts',
        'Legal protection with tamper-proof digital records',
        'No laptop or printer required - works entirely on mobile',
        'Offline capability for areas with poor connectivity',
        'Multi-language support for patient communication',
        'Integrated billing and insurance claim processing'
      ],
      benefits: [
        { metric: '75%', label: 'Time Saved on Documentation' },
        { metric: '90%', label: 'Reduction in Prescription Errors' },
        { metric: '99.9%', label: 'Uptime Guarantee' },
        { metric: '20+', label: 'Languages Supported' }
      ]
    },
    {
      id: 'patients',
      icon: Users,
      title: 'For Patients',
      subtitle: 'Unified Health Records',
      description: 'Access your complete health information anytime, anywhere on your phone',
      color: 'from-healthcare-green-500 to-healthcare-green-600',
      features: [
        'Unified health records accessible on smartphone',
        'Telemedicine consultations with doctors across India',
        'Medicine home delivery to your doorstep',
        'Price comparison for medications across pharmacies',
        'Appointment scheduling with preferred doctors',
        'Lab report access and sharing capabilities',
        'Health reminders and medication alerts',
        'Emergency medical information readily available'
      ],
      benefits: [
        { metric: '100km', label: 'Average Travel Distance Saved' },
        { metric: '50%', label: 'Reduction in Healthcare Costs' },
        { metric: '24/7', label: 'Access to Health Records' },
        { metric: '30%', label: 'Faster Prescription Delivery' }
      ]
    },
    {
      id: 'pharmacies',
      icon: Pill,
      title: 'For Pharmacies',
      subtitle: 'Smart Inventory Management',
      description: 'Streamline operations with digital prescription management and inventory optimization',
      color: 'from-healthcare-orange-500 to-healthcare-orange-600',
      features: [
        'Digital prescription receipt and verification',
        'Smart inventory management with demand forecasting',
        'Significant reduction in errors from handwriting misinterpretation',
        'Stock optimization based on prescription patterns',
        'Patient medication history for better counseling',
        'Integration with insurance providers for claims',
        'Automated reorder alerts for low-stock medicines',
        'Analytics dashboard for business insights'
      ],
      benefits: [
        { metric: '95%', label: 'Reduction in Prescription Errors' },
        { metric: '40%', label: 'Inventory Optimization' },
        { metric: '60%', label: 'Faster Prescription Processing' },
        { metric: '25%', label: 'Increase in Customer Satisfaction' }
      ]
    },
    {
      id: 'labs',
      icon: FlaskConical,
      title: 'For Labs',
      subtitle: 'Digital Result Management',
      description: 'Seamless integration for test ordering, processing, and result delivery',
      color: 'from-purple-500 to-purple-600',
      features: [
        'Seamless digital test ordering from doctors',
        'Automated result sharing with patients and doctors',
        'Quality tracking and compliance monitoring',
        'Integrated report generation and distribution',
        'Real-time status updates for patients',
        'Integration with hospital and clinic systems',
        'Automated billing and insurance processing',
        'Analytics for operational efficiency'
      ],
      benefits: [
        { metric: '80%', label: 'Faster Report Delivery' },
        { metric: '99.5%', label: 'Accuracy in Test Results' },
        { metric: '70%', label: 'Reduction in Manual Work' },
        { metric: '45%', label: 'Improvement in Turnaround Time' }
      ]
    },
    {
      id: 'rural',
      icon: MapPin,
      title: 'For Rural Healthcare',
      subtitle: 'Bridging the Healthcare Gap',
      description: 'Specially designed for rural areas with limited infrastructure and connectivity',
      color: 'from-teal-500 to-teal-600',
      features: [
        'Offline-first design that works without internet',
        'Mobile-only operation - no computers required',
        'Multi-language interface in local dialects',
        'Low-bandwidth optimization for slow networks',
        'Village-level healthcare worker support',
        'Telemedicine connections to urban specialists',
        'Medicine delivery to remote locations',
        'Health education and awareness programs'
      ],
      benefits: [
        { metric: '100%', label: 'Offline Functionality' },
        { metric: '20+', label: 'Regional Languages' },
        { metric: '90%', label: 'Reduction in Specialist Travel' },
        { metric: '85%', label: 'Improvement in Rural Care Access' }
      ]
    }
  ];

  const integrationFeatures = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Advanced machine learning for handwriting recognition, diagnosis support, and predictive analytics'
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Optimized for smartphones - the primary digital device for most healthcare providers in India'
    },
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'HIPAA-equivalent protection, ABDM compliance, and end-to-end encryption for all data'
    },
    {
      icon: Clock,
      title: 'Real-Time Sync',
      description: 'Instant synchronization across all healthcare stakeholders when connectivity is available'
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
              Healthcare Solutions for Every Stakeholder
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Comprehensive digital healthcare platform designed for doctors, patients, pharmacies, labs, and rural healthcare providers across India
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
              Tailored Solutions for Every Healthcare Need
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform adapts to serve all participants in India's healthcare ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {solutions.slice(0, 3).map((solution) => (
              <div key={solution.id} className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-r ${solution.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <solution.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-gray-900 mb-2">
                  {solution.title}
                </h3>
                <p className="text-healthcare-blue-600 font-medium mb-4">
                  {solution.subtitle}
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {solution.description}
                </p>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {solutions.slice(3).map((solution) => (
              <div key={solution.id} className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-r ${solution.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <solution.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-gray-900 mb-2">
                  {solution.title}
                </h3>
                <p className="text-healthcare-blue-600 font-medium mb-4">
                  {solution.subtitle}
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {solution.description}
                </p>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Solutions */}
      {solutions.map((solution, index) => (
        <section key={solution.id} className={`py-20 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className={`space-y-8 ${index % 2 === 1 ? 'order-2' : ''}`}>
                  <div>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${solution.color} rounded-2xl flex items-center justify-center`}>
                        <solution.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
                          {solution.title}
                        </h2>
                        <p className="text-xl text-gray-600">{solution.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-lg text-gray-600 leading-relaxed mb-8">
                      {solution.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-heading font-bold text-gray-900 mb-6">Key Features</h3>
                    <div className="space-y-3">
                      {solution.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <CheckCircle2 className="h-5 w-5 text-healthcare-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button size="lg" className={`bg-gradient-to-r ${solution.color} text-white hover:opacity-90`} asChild>
                      <Link to="/contact">
                        Request Demo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className={`${index % 2 === 1 ? 'order-1' : ''}`}>
                  <div className="bg-white rounded-3xl p-8 shadow-2xl">
                    <h4 className="text-xl font-heading font-bold text-gray-900 mb-6 text-center">
                      Impact Metrics
                    </h4>
                    <div className="grid grid-cols-2 gap-6">
                      {solution.benefits.map((benefit, idx) => (
                        <div key={idx} className="text-center">
                          <div className={`text-3xl font-bold bg-gradient-to-r ${solution.color} bg-clip-text text-transparent`}>
                            {benefit.metric}
                          </div>
                          <p className="text-gray-600 text-sm mt-1">
                            {benefit.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Integration Features */}
      <section className="py-20 bg-gradient-to-r from-healthcare-blue-900 to-healthcare-green-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Seamless Integration Across All Solutions
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Our platform ensures all healthcare stakeholders work together seamlessly
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {integrationFeatures.map((feature, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-heading font-bold text-lg">
                  {feature.title}
                </h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-white/10 rounded-3xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-heading font-bold mb-4">Complete Healthcare Ecosystem</h3>
              <p className="text-blue-100 mb-6">
                From prescription creation to medicine delivery, lab tests to insurance claims - 
                everything connected through one intelligent platform.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>Doctor Prescribes</span>
                </div>
                <ArrowRight className="h-4 w-4" />
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>AI Digitizes</span>
                </div>
                <ArrowRight className="h-4 w-4" />
                <div className="flex items-center space-x-2">
                  <Pill className="h-4 w-4" />
                  <span>Pharmacy Fulfills</span>
                </div>
                <ArrowRight className="h-4 w-4" />
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Patient Receives</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
              Success Stories from Our Users
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real impact across different healthcare stakeholders
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Quantivara transformed my rural practice. I can now serve patients with the same efficiency as urban hospitals, all from my smartphone.",
                author: "Dr. Prasenjit",
                role: "Surgeon, Kolkata",
                avatar: "👨‍⚕️"
              },
              {
                quote: "No more carrying folders of medical records. Everything is accessible on my phone, and my family can access it during emergencies.",
                author: "Priya",
                role: "Patient, Hyderabad", 
                avatar: "👩‍💼"
              },
              {
                quote: "Prescription errors dropped by 95% after implementing Quantivara. Our customers are much more satisfied with our service.",
                author: "Raj Pharmacy",
                role: "Pharmacy Chain Owner",
                avatar: "💊"
              }
            ].map((story, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
                <div className="text-4xl mb-4">{story.avatar}</div>
                <blockquote className="text-gray-700 leading-relaxed mb-6">
                  "{story.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-gray-900">{story.author}</div>
                  <div className="text-healthcare-blue-600 text-sm">{story.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-healthcare-blue-50 to-healthcare-green-50">
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
