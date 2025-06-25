
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organizationType: '',
    location: '',
    currentSystem: '',
    requirements: '',
    demoDate: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Demo Request Submitted!",
        description: "Thank you for your interest. Our team will contact you within 24 hours to schedule your personalized demo.",
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        organizationType: '',
        location: '',
        currentSystem: '',
        requirements: '',
        demoDate: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
          Request a Demo
        </h2>
        <p className="text-lg text-gray-600">
          Get a personalized demonstration of how Quantivara can transform your healthcare operations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Dr. Rajesh Kumar"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="rajesh@hospital.com"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+91 98765 43210"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Type *
            </label>
            <Select value={formData.organizationType} onValueChange={(value) => handleInputChange('organizationType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hospital">Hospital</SelectItem>
                <SelectItem value="clinic">Clinic</SelectItem>
                <SelectItem value="pharmacy">Pharmacy</SelectItem>
                <SelectItem value="lab">Laboratory</SelectItem>
                <SelectItem value="doctor">Individual Doctor</SelectItem>
                <SelectItem value="government">Government Health Dept</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location (State/City) *
            </label>
            <Input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Maharashtra, Mumbai"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current System Used
            </label>
            <Input
              type="text"
              value={formData.currentSystem}
              onChange={(e) => handleInputChange('currentSystem', e.target.value)}
              placeholder="Paper-based, EMR, etc."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Demo Date/Time
          </label>
          <Input
            type="text"
            value={formData.demoDate}
            onChange={(e) => handleInputChange('demoDate', e.target.value)}
            placeholder="e.g., Next week, any weekday afternoon"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specific Requirements
          </label>
          <Textarea
            value={formData.requirements}
            onChange={(e) => handleInputChange('requirements', e.target.value)}
            placeholder="Tell us about your specific needs, number of doctors, patient volume, etc."
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Message
          </label>
          <Textarea
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            placeholder="Any other questions or information you'd like to share?"
            rows={3}
          />
        </div>

        <Button 
          type="submit" 
          size="lg" 
          className="w-full bg-gradient-to-r from-healthcare-blue-600 to-healthcare-green-600 hover:from-healthcare-blue-700 hover:to-healthcare-green-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Request Demo'}
        </Button>

        <p className="text-sm text-gray-500">
          * Required fields. We'll contact you within 24 hours to schedule your demo.
        </p>
      </form>
    </div>
  );
};

export default ContactForm;
