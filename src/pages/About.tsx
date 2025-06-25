
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Target, 
  TrendingUp, 
  Users, 
  Globe, 
  Zap,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const About = () => {
  const milestones = [
    {
      year: "2023",
      title: "Company Founded",
      description: "Started with a vision to bridge India's healthcare gaps"
    },
    {
      year: "2024",
      title: "AI Platform Launch", 
      description: "Launched mobile-first AI handwriting recognition"
    },
    {
      year: "2024",
      title: "500+ Healthcare Providers",
      description: "Onboarded hospitals, clinics, and pharmacies across India"
    },
    {
      year: "2024",
      title: "ABDM Integration",
      description: "Achieved full compliance with national health standards"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Patient-Centric Care",
      description: "Every decision we make prioritizes patient outcomes and accessibility to quality healthcare across India."
    },
    {
      icon: Globe,
      title: "Universal Access",
      description: "Technology should bridge gaps, not create them. We ensure our platform works for every Indian, everywhere."
    },
    {
      icon: Zap,
      title: "Innovation with Purpose",
      description: "We leverage cutting-edge AI and mobile technology to solve real healthcare challenges in the Indian context."
    },
    {
      icon: Users,
      title: "Collaborative Healthcare",
      description: "Healthcare is a team effort. We connect all stakeholders to work together seamlessly."
    }
  ];

  const teamStats = [
    { number: "50+", label: "Healthcare Experts" },
    { number: "25+", label: "AI Engineers" },
    { number: "15+", label: "Medical Advisors" },
    { number: "4", label: "Office Locations" }
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
              Bridging India's Healthcare Gaps Through AI-Powered Technology
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
                <p className="text-lg text-gray-600 leading-relaxed">
                  To connect every corner of India with equitable, intelligent healthcare through 
                  our mobile-first platform that bridges the gap between rural and urban medical services.
                </p>
              </div>

              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Heart className="h-8 w-8 text-healthcare-green-600" />
                  <h2 className="text-3xl font-heading font-bold text-gray-900">Our Vision</h2>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  A unified digital healthcare ecosystem where every Indian, regardless of location or 
                  economic status, has access to quality medical care through seamless technology integration.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  "AI-powered handwriting recognition for instant digitization",
                  "Mobile-first design accessible on any smartphone",
                  "Offline capabilities for areas with poor connectivity",
                  "Full interoperability across healthcare stakeholders"
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-healthcare-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-healthcare-blue-100 to-healthcare-green-100 rounded-3xl p-8">
                <div className="w-full h-full bg-white rounded-2xl p-8 flex items-center justify-center">
                  <div className="text-center space-y-6">
                    <div className="text-6xl">🌐</div>
                    <h3 className="font-heading font-bold text-2xl text-gray-800">
                      Connected Healthcare
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-healthcare-blue-600">1.4B</div>
                        <p className="text-sm text-gray-600">People Served</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-healthcare-green-600">70K+</div>
                        <p className="text-sm text-gray-600">Hospitals</p>
                      </div>
                    </div>
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
              The Healthcare Challenge in India
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Despite being a technology leader globally, India's healthcare system remains fragmented and inaccessible to millions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                stat: "70%",
                label: "Rural Population",
                description: "Live in areas with limited healthcare access"
              },
              {
                stat: "75%", 
                label: "Doctors Face Violence",
                description: "Due to system failures and patient frustration"
              },
              {
                stat: "100+ km",
                label: "Average Travel",
                description: "For patients to receive basic medical care"
              },
              {
                stat: "1.3/1K",
                label: "Hospital Beds",
                description: "Far below WHO standard of 3.5 per 1000 people"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg text-center">
                <div className="text-4xl font-bold text-healthcare-orange-600 mb-2">
                  {item.stat}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.label}
                </h3>
                <p className="text-sm text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Solution Approach */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
              Our Solution Approach
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Technology that works where it matters most - on smartphones, in rural clinics, without perfect internet
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h3 className="text-2xl font-heading font-bold text-gray-900">
                Mobile-First AI Platform
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our platform is built specifically for the Indian healthcare ecosystem, where smartphones are 
                ubiquitous but laptops and reliable internet are not. We've created AI that understands Indian 
                medical handwriting, works in 20+ local languages, and functions offline.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "AI Handwriting Recognition",
                    description: "Converts doctor's prescriptions to digital records instantly"
                  },
                  {
                    title: "Multi-language Support", 
                    description: "Supports Hindi, Bengali, Tamil, Telugu, and 16+ other languages"
                  },
                  {
                    title: "Offline Capabilities",
                    description: "Works without internet, syncs when connectivity returns"
                  },
                  {
                    title: "ABDM Compliant",
                    description: "Fully integrated with India's national health standards"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-healthcare-blue-500 to-healthcare-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-healthcare-blue-100 to-healthcare-green-100 rounded-3xl p-8">
                <div className="w-full h-full bg-white rounded-2xl p-6 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">📱</div>
                    <h4 className="font-heading font-bold text-xl text-gray-800">
                      AI-Powered Mobile Platform
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Handwriting Recognition</span>
                        <span className="text-healthcare-green-600 font-semibold">99.7%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Languages Supported</span>
                        <span className="text-healthcare-blue-600 font-semibold">20+</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Offline Capability</span>
                        <span className="text-healthcare-orange-600 font-semibold">100%</span>
                      </div>
                    </div>
                  </div>
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
              India's healthcare market is experiencing unprecedented growth, driven by digital transformation needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center space-y-4">
              <TrendingUp className="h-16 w-16 text-white mx-auto" />
              <div className="text-5xl font-bold">$11B+</div>
              <p className="text-blue-100">Total Addressable Market</p>
              <p className="text-sm text-blue-200">Healthcare IT market in India</p>
            </div>
            <div className="text-center space-y-4">
              <Zap className="h-16 w-16 text-white mx-auto" />
              <div className="text-5xl font-bold">35%</div>
              <p className="text-blue-100">Annual Growth Rate</p>
              <p className="text-sm text-blue-200">Compound Annual Growth Rate (CAGR)</p>
            </div>
            <div className="text-center space-y-4">
              <Users className="h-16 w-16 text-white mx-auto" />
              <div className="text-5xl font-bold">1.4B</div>
              <p className="text-blue-100">Potential Users</p>
              <p className="text-sm text-blue-200">Indians needing healthcare access</p>
            </div>
          </div>

          <div className="bg-white/10 rounded-3xl p-8 text-center">
            <h3 className="text-2xl font-heading font-bold mb-4">Why Now?</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Government Support</h4>
                <ul className="space-y-2 text-blue-100">
                  <li>• Ayushman Bharat Digital Mission (ABDM)</li>
                  <li>• National Digital Health Blueprint</li>
                  <li>• Digital India initiative support</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Market Readiness</h4>
                <ul className="space-y-2 text-blue-100">
                  <li>• 750M+ smartphone users in India</li>
                  <li>• Increasing digital health awareness</li>
                  <li>• Post-COVID healthcare digitization push</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at Quantivara
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-healthcare-blue-100 to-healthcare-green-100 rounded-xl flex items-center justify-center">
                    <value.icon className="h-6 w-6 text-healthcare-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones in building India's most comprehensive healthcare platform
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-healthcare-blue-200"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative flex items-start space-x-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-healthcare-blue-500 to-healthcare-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg relative z-10">
                      {milestone.year.slice(-2)}
                    </div>
                    <div className="flex-1 bg-white p-6 rounded-2xl shadow-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-healthcare-blue-600">{milestone.year}</span>
                      </div>
                      <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
              Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Healthcare experts, AI engineers, and medical professionals working together to transform Indian healthcare
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {teamStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-healthcare-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-lg text-gray-600 mb-8">
              We're always looking for passionate individuals who want to make a difference in Indian healthcare.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600">
              Join Our Team
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-healthcare-blue-50 to-healthcare-green-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
              Ready to Transform Healthcare with Us?
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
                <Link to="/technology">Learn About Our Technology</Link>
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
