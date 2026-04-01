
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "Before, I had to travel hundreds of kilometers just to see a doctor... Thanks to telehealth and having my medicines delivered to my village, I got the care I needed without leaving home—and it truly saved my life.",
      author: "Bhalu",
      location: "Bihar",
      role: "Patient",
      avatar: "👨‍🌾",
      rating: 5
    },
    {
      quote: "Most days, I'm juggling patients, scribbled notes, and frantic WhatsApps—with no system to back me up... Quantivara changed everything—just my phone, and now I have clean prescriptions, follow-ups, and patient history at my fingertips.",
      author: "Dr. Prasenjit",
      location: "Kolkata",
      role: "Surgeon",
      avatar: "👨‍⚕️",
      rating: 5
    },
    {
      quote: "I used to carry a folder full of papers for every doctor visit. Now, all my reports, prescriptions, and appointments are just a tap away.",
      author: "Priya",
      location: "Hyderabad",
      role: "Patient",
      avatar: "👩‍💼",
      rating: 5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-healthcare-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
            Real Stories from Real People
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hear how Quantivara is transforming healthcare experiences across India
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-healthcare-blue-100 to-healthcare-green-100 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
            
            {/* Quote Icon */}
            <Quote className="h-12 w-12 text-healthcare-blue-300 mb-6" />

            {/* Testimonial Content */}
            <div className="relative z-10">
              <blockquote className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-8 font-medium">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Author Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-healthcare-blue-100 to-healthcare-green-100 rounded-full flex items-center justify-center text-2xl">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div>
                  <div className="font-heading font-bold text-lg text-gray-900">
                    {testimonials[currentTestimonial].author}
                  </div>
                  <div className="text-healthcare-blue-600 font-medium">
                    {testimonials[currentTestimonial].role}
                  </div>
                  <div className="text-gray-500 text-sm">
                    📍 {testimonials[currentTestimonial].location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-healthcare-blue-600 scale-110'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: "500+", label: "Healthcare Providers" },
            { number: "10,000+", label: "Satisfied Doctors" },
            { number: "50,000+", label: "Patients Served" },
            { number: "99.9%", label: "Uptime Guarantee" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-healthcare-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
