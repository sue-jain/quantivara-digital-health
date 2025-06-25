
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle2, X, Star, Users, Building, Crown, Diamond } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Basic',
      icon: Users,
      price: '₹57,000',
      period: '/year',
      description: 'Perfect for small clinics and individual practitioners',
      features: [
        'Core AI handwriting recognition',
        'Basic patient management',
        'Mobile app access',
        'Basic analytics dashboard',
        'Email support',
        'Up to 1,000 prescriptions/month',
        'Standard security features',
        'Mobile-only access'
      ],
      notIncluded: [
        'Advanced analytics',
        'API integrations',
        'Priority support',
        'Custom workflows'
      ],
      gradient: 'from-healthcare-blue-500 to-healthcare-blue-600',
      popular: false,
      buttonText: 'Start Basic Plan'
    },
    {
      name: 'Silver',
      icon: Star,
      price: '₹1,71,000',
      period: '/year',
      description: 'Ideal for medium healthcare facilities and multi-doctor practices',
      features: [
        'Everything in Basic plan',
        'Advanced analytics and reporting',
        'API integrations (5 connections)',
        'Priority email support',
        'Up to 5,000 prescriptions/month',
        'Advanced patient insights',
        'Bulk prescription processing',
        'Custom report generation'
      ],
      notIncluded: [
        'Custom workflows',
        'Dedicated account manager',
        'Phone support'
      ],
      gradient: 'from-healthcare-green-500 to-healthcare-green-600',
      popular: true,
      buttonText: 'Choose Silver'
    },
    {
      name: 'Gold',
      icon: Crown,
      price: '₹3,42,000',
      period: '/year',
      description: 'Comprehensive solution for hospitals and large healthcare networks',
      features: [
        'Everything in Silver plan',
        'Custom workflows and automation',
        'Advanced reporting and dashboards',
        'Unlimited API integrations',
        'Dedicated account manager',
        'Up to 20,000 prescriptions/month',
        'White-label options',
        'Advanced security features'
      ],
      notIncluded: [
        'Enterprise-level customization',
        '24/7 phone support'
      ],
      gradient: 'from-healthcare-orange-500 to-healthcare-orange-600',
      popular: false,
      buttonText: 'Upgrade to Gold'
    },
    {
      name: 'Platinum',
      icon: Diamond,
      price: '₹6,84,000',
      period: '/year',
      description: 'Enterprise-grade solution for large hospital chains and government',
      features: [
        'Everything in Gold plan',
        'Enterprise-level customization',
        '24/7 phone and chat support',
        'Unlimited prescriptions',
        'Advanced compliance features',
        'Multi-location management',
        'Custom integrations',
        'Dedicated customer success team'
      ],
      notIncluded: [],
      gradient: 'from-purple-500 to-purple-600',
      popular: false,
      buttonText: 'Go Platinum'
    }
  ];

  const enterprise = {
    title: 'Enterprise/Consulting',
    price: '₹1-2 Lakhs',
    description: 'Custom pricing for specialized requirements',
    features: [
      'Fully customized solution',
      'On-premise deployment options',
      'Custom AI model training',
      'Dedicated development team',
      'Government compliance certifications',
      'Unlimited everything',
      'White-label complete platform',
      'Strategic consulting services'
    ]
  };

  const faqs = [
    {
      question: 'What is included in the AI handwriting recognition?',
      answer: 'Our AI can recognize medical handwriting in 20+ Indian languages, convert prescriptions to digital format, validate drug interactions, and provide dosage recommendations.'
    },
    {
      question: 'Can I upgrade or downgrade my plan anytime?',
      answer: 'Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.'
    },
    {
      question: 'Is there a free trial available?',
      answer: 'We offer a 30-day free trial for all plans so you can experience the full capabilities of our platform before committing.'
    },
    {
      question: 'What kind of support do you provide?',
      answer: 'Support varies by plan - from email support in Basic to 24/7 phone support in Platinum. All plans include comprehensive documentation and video tutorials.'
    },
    {
      question: 'How does billing work for multiple locations?',
      answer: 'Each location requires a separate subscription. We offer volume discounts for multiple locations - contact us for custom pricing.'
    },
    {
      question: 'Is the platform ABDM compliant?',
      answer: 'Yes, all our plans are fully compliant with Ayushman Bharat Digital Mission (ABDM) standards and integrate seamlessly with national health infrastructure.'
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
              Choose the perfect plan for your healthcare practice. All plans include our core AI technology and mobile-first platform.
            </p>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
              SaaS Pricing Tiers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparent pricing designed for Indian healthcare providers, from individual doctors to large hospital chains
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-4 gap-8 mb-16">
            {plans.map((plan, index) => (
              <div 
                key={plan.name}
                className={`relative bg-white border-2 rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl ${
                  plan.popular 
                    ? 'border-healthcare-green-500 shadow-xl scale-105' 
                    : 'border-gray-200 hover:border-healthcare-blue-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-healthcare-green-500 to-healthcare-green-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <plan.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="space-y-1">
                    <div className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </div>
                    <div className="text-gray-500">
                      {plan.period}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-healthcare-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature, idx) => (
                    <div key={`not-${idx}`} className="flex items-start space-x-3 opacity-50">
                      <X className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-500 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-healthcare-green-600 to-healthcare-green-700 hover:from-healthcare-green-700 hover:to-healthcare-green-800' 
                      : `bg-gradient-to-r ${plan.gradient} hover:opacity-90`
                  }`}
                  size="lg"
                  asChild
                >
                  <Link to="/contact">
                    {plan.buttonText}
                  </Link>
                </Button>
              </div>
            ))}
          </div>

          {/* Enterprise Plan */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-gray-900 to-healthcare-blue-900 text-white rounded-3xl p-8 md:p-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-heading font-bold text-3xl mb-2">
                      {enterprise.title}
                    </h3>
                    <p className="text-blue-100 mb-4">
                      {enterprise.description}
                    </p>
                    <div className="text-4xl font-bold">
                      {enterprise.price}
                    </div>
                  </div>

                  <Button size="lg" variant="outline" className="bg-white text-gray-900 hover:bg-gray-100" asChild>
                    <Link to="/contact">
                      Contact Sales
                    </Link>
                  </Button>
                </div>

                <div className="space-y-4">
                  {enterprise.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-100 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
              Why Choose Quantivara?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our pricing reflects the value we deliver to Indian healthcare providers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">
                Cost Effective
              </h3>
              <p className="text-gray-600 text-sm">
                Pricing designed for Indian healthcare economics with maximum ROI
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">
                Mobile-First
              </h3>
              <p className="text-gray-600 text-sm">
                No additional hardware or software purchases required
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">
                AI-Powered
              </h3>
              <p className="text-gray-600 text-sm">
                Advanced AI capabilities included in all plans at no extra cost
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">
                ABDM Compliant
              </h3>
              <p className="text-gray-600 text-sm">
                Full compliance with national health standards included
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
                Calculate Your ROI
              </h2>
              <p className="text-xl text-gray-600">
                See how much time and money you can save with Quantivara
              </p>
            </div>

            <div className="bg-gradient-to-br from-healthcare-blue-50 to-healthcare-green-50 rounded-3xl p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="space-y-4">
                  <div className="text-4xl font-bold text-healthcare-blue-600">70%</div>
                  <h3 className="font-heading font-bold text-lg text-gray-900">Time Saved</h3>
                  <p className="text-gray-600 text-sm">
                    Reduction in prescription writing and patient management time
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="text-4xl font-bold text-healthcare-green-600">₹50K+</div>
                  <h3 className="font-heading font-bold text-lg text-gray-900">Monthly Savings</h3>
                  <p className="text-gray-600 text-sm">
                    Average cost savings from reduced errors and improved efficiency
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="text-4xl font-bold text-healthcare-orange-600">300%</div>
                  <h3 className="font-heading font-bold text-lg text-gray-900">ROI</h3>
                  <p className="text-gray-600 text-sm">
                    Return on investment within the first year of implementation
                  </p>
                </div>
              </div>

              <div className="text-center mt-8">
                <Button size="lg" className="bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600" asChild>
                  <Link to="/contact">
                    Get Detailed ROI Analysis
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Common questions about our pricing and platform
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
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
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of healthcare providers already transforming their practice with Quantivara. Try any plan risk-free for 30 days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600" asChild>
                <Link to="/contact">
                  Start Free Trial
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

export default Pricing;
