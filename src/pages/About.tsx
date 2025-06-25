
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Target, Eye, TrendingUp, Users, MapPin, Award } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Users, value: "1.4B", label: "People in Target Market" },
    { icon: TrendingUp, value: "$11B+", label: "Total Addressable Market" },
    { icon: Award, value: "35%", label: "Market Growth Rate (CAGR)" },
    { icon: MapPin, value: "70K+", label: "Hospitals to Connect" }
  ];

  const timeline = [
    {
      year: "2024",
      title: "Foundation & Vision",
      description: "Quantivara founded with mission to bridge India's healthcare divide through AI-powered mobile technology."
    },
    {
      year: "2024",
      title: "Technology Development",
      description: "Advanced AI handwriting recognition and offline-capable mobile platform developed and tested."
    },
    {
      year: "2025",
      title: "Market Launch",
      description: "Rolling out across pilot regions in rural India, connecting first 500 healthcare providers."
    },
    {
      year: "2025-26",
      title: "Scale & Expansion",
      description: "Expanding to major cities and rural areas across all Indian states with full ecosystem integration."
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
              About Quantivara
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              We're on a mission to connect every corner of India with equitable, intelligent healthcare through our AI-powered platform.
            </p>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="h-8 w-8 text-healthcare-blue-600" />
                  <h2 className="text-3xl font-heading font-bold text-gray-900">Our Mission</h2>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To connect every corner of India with equitable, intelligent healthcare by breaking down barriers between rural and urban medical care through innovative AI-powered technology.
                </p>
              </div>

              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Eye className="h-8 w-8 text-healthcare-green-600" />
                  <h2 className="text-3xl font-heading font-bold text-gray-900">Our Vision</h2>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  A unified digital platform where every doctor, patient, pharmacy, and lab in India is seamlessly connected, enabling quality healthcare delivery regardless of location or economic status.
                </p>
              </div>

              <Button size="lg" className="bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600" asChild>
                <Link to="/contact">Join Our Mission</Link>
              </Button>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-healthcare-blue-100 to-healthcare-green-100 rounded-3xl p-8">
                <div className="w-full h-full bg-white rounded-2xl p-6 flex items-center justify-center">
                  <div className="text-center space-y-6">
                    <div className="text-6xl">🌐</div>
                    <h3 className="font-heading font-bold text-xl text-gray-800">
                      Healthcare Unity
                    </h3>
                    <p className="text-gray-600">
                      Connecting 1.4 billion Indians through technology
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem We're Solving */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
              The Healthcare Fragmentation Problem
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              India's healthcare system is broken into isolated islands, leaving millions without access to quality care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="font-heading font-bold text-xl text-gray-900 mb-4">Paper-Based Records</h3>
              <p className="text-gray-600">
                70% of Indian hospitals still rely on paper records, making patient history inaccessible across providers.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">🏚️</div>
              <h3 className="font-heading font-bold text-xl text-gray-900 mb-4">Rural-Urban Divide</h3>
              <p className="text-gray-600">
                70% of Indians live rurally, but most advanced healthcare infrastructure is concentrated in cities.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-heading font-bold text-xl text-gray-900 mb-4">Mobile-Only Reality</h3>
              <p className="text-gray-600">
                Rural doctors only have smartphones, but most health tech requires laptops and stable internet.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">🔀</div>
              <h3 className="font-heading font-bold text-xl text-gray-900 mb-4">No Interoperability</h3>
              <p className="text-gray-600">
                Healthcare providers can't communicate effectively, leading to fragmented patient care.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-heading font-bold text-xl text-gray-900 mb-4">Poor Connectivity</h3>
              <p className="text-gray-600">
                Rural areas have unreliable internet, making cloud-dependent solutions impractical.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">💸</div>
              <h3 className="font-heading font-bold text-xl text-gray-900 mb-4">High Costs</h3>
              <p className="text-gray-600">
                Patients travel hundreds of kilometers for basic care, incurring huge travel and opportunity costs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
              Our Technology Approach
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've built solutions specifically for India's unique challenges - mobile-first, offline-capable, and AI-powered.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">Mobile-First Architecture</h3>
                <p className="text-gray-700 mb-4">
                  Designed specifically for smartphones - the only device rural healthcare providers have access to. No laptops, printers, or complex setups required.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Works on any Android smartphone</li>
                  <li>• Intuitive touch-based interface</li>
                  <li>• Optimized for low-end devices</li>
                  <li>• Minimal data usage</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">AI-Powered Intelligence</h3>
                <p className="text-gray-700 mb-4">
                  Advanced AI converts handwritten prescriptions to digital records, enabling seamless communication across the healthcare ecosystem.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Handwriting recognition in 20+ languages</li>
                  <li>• Medical terminology understanding</li>
                  <li>• Drug interaction checking</li>
                  <li>• Diagnostic assistance</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">Offline-Capable Design</h3>
                <p className="text-gray-700 mb-4">
                  Functions seamlessly without internet connectivity, automatically syncing when connection is available.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Complete offline functionality</li>
                  <li>• Local data storage and processing</li>
                  <li>• Intelligent sync when online</li>
                  <li>• Edge computing capabilities</li>
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-healthcare-blue-50 to-healthcare-green-50 rounded-3xl p-8">
                <div className="text-center space-y-6">
                  <div className="text-6xl">🤖</div>
                  <h4 className="font-heading font-bold text-xl text-gray-800">
                    AI at the Core
                  </h4>
                  <p className="text-gray-600">
                    Machine learning models trained specifically on Indian medical practices and handwriting patterns
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-healthcare-green-50 to-healthcare-blue-50 rounded-3xl p-8">
                <div className="text-center space-y-6">
                  <div className="text-6xl">🌐</div>
                  <h4 className="font-heading font-bold text-xl text-gray-800">
                    ABDM Compliant
                  </h4>
                  <p className="text-gray-600">
                    Fully integrated with India's Ayushman Bharat Digital Mission for nationwide interoperability
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-20 bg-gradient-to-r from-healthcare-blue-900 to-healthcare-green-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Market Opportunity
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              India's healthcare digitization represents one of the largest untapped markets globally
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold">{stat.value}</div>
                <p className="text-blue-100 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-heading font-bold mb-8 text-center">Key Market Insights</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-bold text-lg">🎯 Target Segments</h4>
                <ul className="space-y-2 text-blue-100">
                  <li>• 10+ Lakh practicing doctors</li>
                  <li>• 1.5+ Lakh pharmacies</li>
                  <li>• 70K+ hospitals and clinics</li>
                  <li>• 1.4B potential patients</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-lg">📈 Growth Drivers</h4>
                <ul className="space-y-2 text-blue-100">
                  <li>• Government digital health initiatives</li>
                  <li>• Rising smartphone penetration</li>
                  <li>• COVID-driven telemedicine adoption</li>
                  <li>• Need for healthcare accessibility</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From vision to transforming healthcare across India
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-healthcare-blue-600 to-healthcare-green-600"></div>

              {timeline.map((item, index) => (
                <div key={index} className="relative flex items-start space-x-8 pb-12">
                  {/* Year marker */}
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600 rounded-full flex items-center justify-center text-white font-bold relative z-10">
                    {item.year.slice(-2)}
                  </div>

                  {/* Content */}
                  <div className="flex-grow pt-2">
                    <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-healthcare-blue-50 to-healthcare-green-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
              Join Us in Transforming Healthcare
            </h2>
            <p className="text-xl text-gray-600">
              Whether you're a healthcare provider, investor, or partner, we'd love to discuss how we can work together to revolutionize healthcare in India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600" asChild>
                <Link to="/contact">Get in Touch</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/technology">Explore Technology</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
