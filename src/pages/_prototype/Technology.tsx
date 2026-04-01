
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Smartphone, 
  Bot, 
  Wifi, 
  Link as LinkIcon, 
  Languages, 
  Shield,
  Zap,
  Cloud,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const Technology = () => {
  const coreFeatures = [
    {
      icon: Bot,
      title: "AI Handwriting Recognition",
      description: "Doctor scribbles → AI transforms → Clean digital record",
      details: [
        "Advanced OCR technology trained on Indian medical handwriting",
        "20+ Indian languages and medical terminology support",
        "99.7% accuracy rate for prescription recognition",
        "Real-time conversion and validation"
      ],
      gradient: "from-healthcare-blue-500 to-healthcare-blue-600"
    },
    {
      icon: Wifi,
      title: "Offline Intelligence", 
      description: "Works without internet, syncs when connected",
      details: [
        "Complete offline functionality on mobile devices",
        "Local AI processing and data storage",
        "Intelligent sync when connectivity returns",
        "Edge computing for real-time responses"
      ],
      gradient: "from-healthcare-green-500 to-healthcare-green-600"
    },
    {
      icon: Languages,
      title: "Multi-language Support",
      description: "20+ Indian languages supported",
      details: [
        "Hindi, Bengali, Tamil, Telugu, Marathi and more",
        "Regional medical terminology recognition",
        "Voice-to-text in local languages",
        "Cultural context understanding"
      ],
      gradient: "from-healthcare-orange-500 to-healthcare-orange-600"
    },
    {
      icon: Shield,
      title: "ABDM Integration",
      description: "Compliant with national health standards",
      details: [
        "Full Ayushman Bharat Digital Mission compliance",
        "National health ID integration",
        "Secure patient data exchange",
        "Government-approved interoperability"
      ],
      gradient: "from-purple-500 to-purple-600"
    }
  ];

  const techStack = [
    {
      category: "Mobile-First Architecture",
      icon: Smartphone,
      technologies: [
        "React Native for cross-platform mobile",
        "Progressive Web App (PWA) capabilities",
        "Offline-first data synchronization",
        "Touch-optimized user interface"
      ]
    },
    {
      category: "AI & Machine Learning",
      icon: Bot,
      technologies: [
        "TensorFlow Lite for mobile AI",
        "Custom OCR models for medical text",
        "Natural Language Processing (NLP)",
        "Computer Vision for document analysis"
      ]
    },
    {
      category: "Backend & Infrastructure",
      icon: Cloud,
      technologies: [
        "Node.js with Express framework",
        "MongoDB for flexible data storage",
        "Redis for caching and session management",
        "AWS/Azure cloud infrastructure"
      ]
    },
    {
      category: "Security & Compliance",
      icon: Shield,
      technologies: [
        "End-to-end encryption (AES-256)",
        "FHIR standard compliance",
        "HIPAA-equivalent data protection",
        "Blockchain for audit trails"
      ]
    },
    {
      category: "Integration & APIs",
      icon: LinkIcon,
      technologies: [
        "RESTful API architecture",
        "WhatsApp Business API integration",
        "Payment gateway integrations",
        "Third-party EHR connections"
      ]
    },
    {
      category: "Performance & Scalability",
      icon: Zap,
      technologies: [
        "Microservices architecture",
        "Auto-scaling infrastructure",
        "CDN for global content delivery",
        "Load balancing and fault tolerance"
      ]
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Capture",
      description: "Doctor writes prescription on paper and takes photo with smartphone",
      icon: "📝"
    },
    {
      step: "2", 
      title: "Process",
      description: "AI analyzes handwriting and converts to structured digital data",
      icon: "🤖"
    },
    {
      step: "3",
      title: "Validate",
      description: "System checks for drug interactions and dosage accuracy",
      icon: "✅"
    },
    {
      step: "4",
      title: "Distribute",
      description: "Digital prescription sent to pharmacy, lab, or patient instantly",
      icon: "📤"
    },
    {
      step: "5",
      title: "Track",
      description: "Complete audit trail and follow-up reminders automated",
      icon: "📊"
    },
    {
      step: "6",
      title: "Sync",
      description: "All data syncs across healthcare ecosystem for continuity",
      icon: "🔄"
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
              AI Healthcare Technology
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Handwriting Recognition & Mobile-First Platform Built for India
            </p>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Core AI Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
              AI Core Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced AI technology designed specifically for India's healthcare challenges
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {coreFeatures.map((feature, index) => (
              <div 
                key={index}
                className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="font-heading font-bold text-2xl text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-healthcare-blue-600 font-medium mb-6">
                  {feature.description}
                </p>

                <ul className="space-y-3">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-healthcare-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-healthcare-blue-50 to-healthcare-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From handwritten prescription to digital healthcare ecosystem in seconds
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 text-center shadow-lg animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-healthcare-blue-100 to-healthcare-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <div className="text-sm font-bold text-healthcare-blue-600 mb-2">
                  Step {step.step}
                </div>
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Demo Video Placeholder */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-healthcare-blue-100 to-healthcare-green-100 rounded-3xl p-8 flex items-center justify-center">
              <div className="text-center space-y-6">
                <div className="text-6xl">📱</div>
                <h3 className="font-heading font-bold text-2xl text-gray-800">
                  Interactive Demo
                </h3>
                <p className="text-gray-600 max-w-md">
                  See our AI handwriting recognition in action - converting doctor's notes to digital records in real-time
                </p>
                <Button size="lg" className="bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600">
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
              Technology Stack
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with cutting-edge technologies for scalability, security, and performance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {techStack.map((category, index) => (
              <div 
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-healthcare-blue-100 to-healthcare-green-100 rounded-xl flex items-center justify-center">
                    <category.icon className="h-6 w-6 text-healthcare-blue-600" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-gray-900">
                    {category.category}
                  </h3>
                </div>

                <ul className="space-y-3">
                  {category.technologies.map((tech, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-healthcare-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{tech}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance & Security */}
      <section className="py-20 bg-gradient-to-r from-healthcare-blue-900 to-healthcare-green-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Performance & Security
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Enterprise-grade performance with healthcare-compliant security
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold">99.9%</div>
              <p className="text-blue-100">Uptime Guarantee</p>
            </div>
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold">&lt;200ms</div>
              <p className="text-blue-100">API Response Time</p>
            </div>
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold">99.7%</div>
              <p className="text-blue-100">AI Accuracy Rate</p>
            </div>
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold">256-bit</div>
              <p className="text-blue-100">Encryption Standard</p>
            </div>
          </div>

          <div className="mt-16 grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-heading font-bold mb-6">Performance Optimizations</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Edge computing for reduced latency</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Intelligent caching mechanisms</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Auto-scaling cloud infrastructure</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Optimized for low-bandwidth networks</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-heading font-bold mb-6">Security & Compliance</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>HIPAA-equivalent data protection</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>End-to-end encryption for all data</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Regular security audits and penetration testing</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>ISO 27001 and SOC 2 Type II compliant</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
              Ready to Experience the Technology?
            </h2>
            <p className="text-xl text-gray-600">
              See how our AI-powered platform can transform your healthcare operations with a personalized demo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600" asChild>
                <Link to="/contact">
                  Request Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/solutions">View Solutions</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Technology;
