
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Check, 
  Star, 
  ArrowRight, 
  Users, 
  Building2, 
  Crown,
  Zap,
  Shield,
  Headphones,
  CheckCircle2
} from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Basic',
      price: '₹57,000',
      period: 'per year',
      description: 'Perfect for small clinics and individual practitioners',
      icon: Users,
      color: 'from-healthcare-blue-500 to-healthcare-blue-600',
      popular: false,
      features: [
        'Core AI handwriting recognition',
        'Basic analytics and reporting',
        'Mobile app access',
        'Email support',
        'Up to 5 users',
        'Digital prescription generation',
        'Patient history access',
        'Basic inventory management'
      ],
      limits: [
        '500 prescriptions/month',
        '10GB storage',
        'Basic integrations'
      ]
    },
    {
      name: 'Silver',
      price: '₹1,71,000',
      period: 'per year',
      description: 'Ideal for medium-sized hospitals and clinic chains',
      icon: Building2,
      color: 'from-healthcare-green-500 to-healthcare-green-600',
      popular: true,
      features: [
        'Everything in Basic',
        'Advanced analytics and insights',
        'API integrations',
        'Priority support',
        'Up to 25 users',
        'Telemedicine capabilities',
        'Lab integration',
        'Advanced inventory management',
        'Custom workflows',
        'Patient engagement tools'
      ],
      limits: [
        '2,500 prescriptions/month',
        '50GB storage',
        'Advanced integrations'
      ]
    },
    {
      name: 'Gold',
      price: '₹3,42,000',
      period: 'per year',
      description: 'Comprehensive solution for large hospitals and healthcare networks',
      icon: Crown,
      color: 'from-healthcare-orange-500 to-healthcare-orange-600',
      popular: false,
      features: [
        'Everything in Silver',
        'Custom workflows and processes',
        'Advanced reporting and business intelligence',
        'Dedicated account manager',
        'Up to 100 users',
        'Multi-location support',
        'Advanced AI features',
        'Custom integrations',
        'Training and onboarding',
        'White-label options'
      ],
      limits: [
        '10,000 prescriptions/month',
        '200GB storage',
        'Enterprise integrations'
      ]
    },
    {
      name: 'Platinum',
      price: '₹6,84,000',
      period: 'per year',
      description: 'Enterprise-grade solution with full customization',
      icon: Star,
      color: 'from-purple-500 to-purple-600',
      popular: false,
      features: [
        'Everything in Gold',
        'Enterprise features and compliance',
        'Custom integrations and APIs',
        '24/7 phone support',
        'Unlimited users',
        'Advanced security features',
        'Custom AI model training',
        'Dedicated infrastructure',
        'SLA guarantees',
        'Regulatory compliance support'
      ],
      limits: [
        'Unlimited prescriptions',
        'Unlimited storage',
        'Full customization'
      ]
    }
  ];

  const enterpriseFeatures = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Advanced security, compliance, and audit capabilities'
    },
    {
      icon: Zap,
      title: 'Custom AI Models',
      description: 'Tailored AI training for your specific use cases'
    },
    {
      icon: Headphones,
      title: 'Dedicated Support',
      description: '24/7 dedicated support team and account management'
    }
  ];

  const addOnServices = [
    {
      name: 'Implementation & Training',
      price: '₹50,000 - ₹2,00,000',
      description: 'Complete setup, data migration, and staff training'
    },
    {
      name: 'Custom Integration',
      price: '₹1,00,000 - ₹5,00,000',
      description: 'Integration with existing hospital management systems'
    },
    {
      name: 'Ongoing Consulting',
      price: '₹25,000/month',
      description: 'Monthly consulting and optimization services'
    }
  ];

  const faqs = [
    {
      question: 'Is there a free trial available?',
      answer: 'Yes, we offer a 30-day free trial for all plans. You can test all features with up to 100 prescriptions during the trial period.'
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Absolutely. You can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept bank transfers, UPI, credit/debit cards, and can set up annual invoicing for enterprise customers.'
    },
    {
      question: 'Is the pricing inclusive of taxes?',
      answer: 'All prices are exclusive of GST. 18% GST will be added to all invoices as per Indian tax regulations.'
    },
    {
      question: 'Do you offer volume discounts?',
      answer: 'Yes, we offer volume discounts for large healthcare networks and government institutions. Contact our sales team for custom pricing.'
    },
    {
      question: 'What is included in implementation?',
      answer: 'Implementation includes system setup, data migration, staff training, and go-live support. Timeline varies from 2-8 weeks based on complexity.'
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
              Affordable Healthcare Platform Pricing
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Choose the perfect plan for your healthcare organization. All plans include our core AI features and mobile-first design.
            </p>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`relative bg-white border-2 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 ${
                  plan.popular ? 'border-healthcare-green-500 scale-105' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-healthcare-green-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <plan.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    {plan.price}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {plan.period}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold text-gray-900">Features included:</h4>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-healthcare-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-8">
                  <h4 className="font-semibold text-gray-900 text-sm">Usage limits:</h4>
                  {plan.limits.map((limit, idx) => (
                    <div key={idx} className="text-gray-600 text-sm">
                      • {limit}
                    </div>
                  ))}
                </div>

                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-healthcare-green-600 to-healthcare-green-700 hover:from-healthcare-green-700 hover:to-healthcare-green-800' 
                      : `bg-gradient-to-r ${plan.color} hover:opacity-90`
                  }`}
                  asChild
                >
                  <Link to="/contact">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>

          {/* Enterprise Solution */}
          <div className="bg-gradient-to-r from-healthcare-blue-900 to-healthcare-green-900 rounded-3xl p-8 md:p-12 text-white">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Enterprise & Consulting
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Custom solutions for large healthcare networks, government institutions, and enterprise clients
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div>
                  <div className="text-4xl font-bold mb-2">₹1-2 Lakhs</div>
                  <p className="text-blue-100">Custom pricing based on requirements</p>
                </div>

                <div className="space-y-4">
                  {enterpriseFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <feature.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{feature.title}</h4>
                        <p className="text-blue-100 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button size="lg" variant="outline" className="bg-white text-gray-900 hover:bg-gray-100" asChild>
                  <Link to="/contact">
                    Contact Sales
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="bg-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-heading font-bold mb-4">Enterprise Features</h3>
                <ul className="space-y-3 text-blue-100">
                  <li>• Unlimited users and locations</li>
                  <li>• Custom AI model training</li>
                  <li>• Dedicated infrastructure</li>
                  <li>• Advanced security & compliance</li>
                  <li>• 24/7 dedicated support</li>
                  <li>• SLA guarantees (99.9% uptime)</li>
                  <li>• Custom integrations</li>
                  <li>• Regulatory compliance support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add-on Services */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
              Professional Services & Add-ons
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Additional services to ensure successful implementation and ongoing optimization
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {addOnServices.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                  {service.name}
                </h3>
                <div className="text-2xl font-bold text-healthcare-blue-600 mb-4">
                  {service.price}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
                Calculate Your ROI
              </h2>
              <p className="text-xl text-gray-600">
                See how much you can save with Quantivara's digital healthcare platform
              </p>
            </div>

            <div className="bg-gradient-to-r from-healthcare-blue-50 to-healthcare-green-50 rounded-3xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-heading font-bold text-gray-900 mb-6">
                    Annual Savings Potential
                  </h3>
                  <div className="space-y-6">
                    {[
                      { item: 'Reduced prescription errors', saving: '₹2,50,000' },
                      { item: 'Time saved on documentation', saving: '₹1,80,000' },
                      { item: 'Improved inventory management', saving: '₹1,20,000' },
                      { item: 'Reduced patient travel costs', saving: '₹90,000' },
                      { item: 'Insurance claim automation', saving: '₹70,000' }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-700">{item.item}</span>
                        <span className="font-bold text-healthcare-green-600">{item.saving}</span>
                      </div>
                    ))}
                    <div className="border-t pt-4 flex justify-between items-center">
                      <span className="font-bold text-lg text-gray-900">Total Annual Savings</span>
                      <span className="font-bold text-2xl text-healthcare-green-600">₹7,10,000</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h4 className="text-xl font-heading font-bold text-gray-900 mb-6 text-center">
                    ROI Summary
                  </h4>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-healthcare-blue-600">320%</div>
                      <p className="text-gray-600">Average ROI in Year 1</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-healthcare-green-600">6 months</div>
                      <p className="text-gray-600">Typical Payback Period</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-healthcare-orange-600">₹5,40,000</div>
                      <p className="text-gray-600">Net Savings (Year 1)</p>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <Button className="bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600" asChild>
                      <Link to="/contact">Get Custom ROI Analysis</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to know about our pricing and plans
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="font-heading font-bold text-lg text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
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
              Start your 30-day free trial today. No credit card required. Full access to all features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600" asChild>
                <Link to="/contact">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Schedule Demo</Link>
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              30-day free trial • No setup fees • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
