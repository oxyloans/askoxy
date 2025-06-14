import React from "react";
import { ArrowRight, CheckCircle, GraduationCap, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
const CallToActionSection = () => {

  const [clicked, setClicked] = React.useState(false);
    const navigate = useNavigate();
  const handleFreeConsultation = () => {
    setClicked(true);
    navigate("/student-home");
   
  };
  
  return (
    <section className="py-16 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-snug">
              Ready to Begin Your Global Education Journey?
            </h2>
            <p className="text-purple-100 text-lg sm:text-xl mb-8">
              Join thousands of students who have successfully started their
              international education journey with our expert guidance and
              complete support.
            </p>

            {/* Benefits List */}
            <ul className="space-y-4 mb-8">
              {[
                "Free initial consultation with education experts",
                "Personalized university shortlisting",
                "Complete application assistance",
                "Visa guidance and interview preparation",
              ].map((benefit, index) => (
                <li key={index} className="flex items-start text-white">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-400 mt-1" />
                  <span className="text-sm sm:text-base">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={handleFreeConsultation}  className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-semibold py-3 px-6 sm:px-8 rounded-full shadow-lg transition transform hover:scale-105 flex items-center justify-center">
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button onClick={handleFreeConsultation} className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-700 font-semibold py-3 px-6 sm:px-8 rounded-full transition duration-300">
                Schedule Free Consultation
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 flex flex-wrap gap-4 text-purple-100 text-sm">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span>4.9/5 Student Rating</span>
              </div>
              <div className="flex items-center">• 5000+ Success Stories</div>
              <div className="flex items-center">• 95% Visa Success Rate</div>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex justify-center">
            <div className="relative inline-block max-w-sm w-full">
              <div className="bg-white p-8 rounded-2xl shadow-xl transform rotate-3 transition duration-300">
                <GraduationCap className="w-20 h-20 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  5000+ Students
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  Successfully placed in top universities worldwide
                </p>
                <div className="flex justify-center text-yellow-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-center">
                  <div>
                    <div className="font-bold text-purple-600 text-xl">
                      1000+
                    </div>
                    <div className="text-gray-600">Universities</div>
                  </div>
                  <div>
                    <div className="font-bold text-purple-600 text-xl">25+</div>
                    <div className="text-gray-600">Countries</div>
                  </div>
                </div>
              </div>

              {/* Decorative Circles */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full opacity-80 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>

              {/* Optional Floating Country Flags */}
              {/* 
              <div className="absolute -top-8 left-8 text-2xl animate-bounce">🇺🇸</div>
              <div className="absolute -right-8 top-12 text-2xl animate-bounce delay-200">🇬🇧</div>
              <div className="absolute -left-8 bottom-12 text-2xl animate-bounce delay-400">🇨🇦</div>
              <div className="absolute -bottom-8 right-8 text-2xl animate-bounce delay-600">🇦🇺</div>
              */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
