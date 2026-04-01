
import { AlertTriangle, MapPin, TrendingDown, Users } from 'lucide-react';

const ProblemSection = () => {
  const problems = [
    {
      icon: Users,
      stat: "75%",
      description: "of doctors face workplace violence",
      context: "Due to system failures and patient frustration"
    },
    {
      icon: MapPin,
      stat: "70%",
      description: "of Indians live in rural areas",
      context: "Yet most healthcare infrastructure is urban-focused"
    },
    {
      icon: TrendingDown,
      stat: "100+ km",
      description: "average travel for basic care",
      context: "Patients often travel hundreds of kilometers for treatment"
    },
    {
      icon: AlertTriangle,
      stat: "1.3/1K",
      description: "hospital beds per 1000 people",
      context: "Far below WHO standard of 3.5 beds per 1000"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
            India's Healthcare Crisis 
            <span className="block text-healthcare-orange-600">Hidden in Plain Sight</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            While India leads the world in technology, our healthcare system remains fragmented, 
            leaving millions without access to quality care.
          </p>
        </div>

        {/* Problem Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {problems.map((problem, index) => (
            <div 
              key={index} 
              className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-healthcare-orange-100 to-healthcare-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <problem.icon className="h-8 w-8 text-healthcare-orange-600" />
              </div>
              <div className="text-4xl font-bold text-healthcare-orange-600 mb-2">
                {problem.stat}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {problem.description}
              </h3>
              <p className="text-sm text-gray-600">
                {problem.context}
              </p>
            </div>
          ))}
        </div>

        {/* Split Visual */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Rural Healthcare */}
          <div className="space-y-6">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🏚️</div>
                  <h3 className="font-heading font-bold text-xl text-gray-800">Rural Healthcare</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Paper-based records</li>
                    <li>• Limited specialist access</li>
                    <li>• Poor connectivity</li>
                    <li>• Long travel distances</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Urban Healthcare */}
          <div className="space-y-6">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🏥</div>
                  <h3 className="font-heading font-bold text-xl text-gray-800">Urban Healthcare</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Advanced technology</li>
                    <li>• Specialist availability</li>
                    <li>• Digital systems</li>
                    <li>• But overcrowded & expensive</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-4">
            What if there was a bridge?
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A platform that could connect rural and urban healthcare, making quality care accessible to every Indian, regardless of location.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
