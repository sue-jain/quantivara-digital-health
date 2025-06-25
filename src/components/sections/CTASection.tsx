
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

interface CTASectionProps {
  title: string;
  subtitle: string;
  primaryCTA: {
    text: string;
    link: string;
  };
  secondaryCTA?: {
    text: string;
    link: string;
  };
  background?: 'white' | 'gradient' | 'gray';
}

const CTASection = ({ 
  title, 
  subtitle, 
  primaryCTA, 
  secondaryCTA, 
  background = 'white' 
}: CTASectionProps) => {
  const backgroundClasses = {
    white: 'bg-white',
    gradient: 'bg-gradient-to-r from-healthcare-blue-900 to-healthcare-green-900 text-white',
    gray: 'bg-gray-50'
  };

  const textClasses = {
    white: 'text-gray-900',
    gradient: 'text-white',
    gray: 'text-gray-900'
  };

  const subtitleClasses = {
    white: 'text-gray-600',
    gradient: 'text-blue-100',
    gray: 'text-gray-600'
  };

  return (
    <section className={`py-20 ${backgroundClasses[background]}`}>
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className={`text-3xl md:text-4xl font-heading font-bold ${textClasses[background]}`}>
            {title}
          </h2>
          <p className={`text-xl ${subtitleClasses[background]}`}>
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className={
                background === 'gradient' 
                  ? "bg-white text-healthcare-blue-900 hover:bg-gray-100" 
                  : "bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600 hover:from-healthcare-blue-700 hover:to-healthcare-green-700"
              } 
              asChild
            >
              <Link to={primaryCTA.link}>
                {primaryCTA.text}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {secondaryCTA && (
              <Button 
                size="lg" 
                variant="outline" 
                className={
                  background === 'gradient'
                    ? "border-white text-white hover:bg-white hover:text-healthcare-blue-900"
                    : ""
                }
                asChild
              >
                <Link to={secondaryCTA.link}>
                  {secondaryCTA.text}
                  {secondaryCTA.text.includes('Demo') && <Play className="ml-2 h-4 w-4" />}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
