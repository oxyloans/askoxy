import React from "react";
import { ArrowRight, CheckCircle, GraduationCap, Star } from "lucide-react";

const CallToActionSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Begin Your Global Education Journey?
            </h2>
            <p className="text-purple-100 text-lg mb-8">
              Join thousands of students who have successfully started their
              international education journey with our expert guidance and
              comprehensive support.
            </p>

            {/* Benefits List */}
            <div className="space-y-4 mb-8">
              {[
                "Free initial consultation with education experts",
                "Personalized university shortlisting",
                "Complete application assistance",
                "Visa guidance and interview preparation",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-bold py-3 px-8 rounded-full  hover:from-yellow-500 hover:via-amber-500 hover:to-yellow-600 shadow-lg transition duration-300 transform hover:scale-105 flex items-center justify-center">
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-700 font-bold py-3 px-8 rounded-full transition duration-300">
                Schedule Free Consultation
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 flex items-center gap-6 text-purple-100">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="text-sm">4.9/5 Student Rating</span>
              </div>
              <div className="text-sm">• 5000+ Success Stories</div>
              <div className="text-sm">• 95% Visa Success Rate</div>
            </div>
          </div>

          {/* Right Content - Visual Element */}
          <div className="text-center">
            <div className="relative inline-block">
              {/* Main Card */}
              <div className="bg-white p-8 rounded-xl shadow-xl transform rotate-3 transition-transform duration-300">
                <GraduationCap className="w-20 h-20 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  5000+ Students
                </h3>
                <p className="text-gray-600 mb-4">
                  Successfully placed in top universities worldwide
                </p>
                <div className="flex justify-center text-yellow-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-bold text-purple-600">1000+</div>
                    <div className="text-gray-600">Universities</div>
                  </div>
                  <div>
                    <div className="font-bold text-purple-600">25+</div>
                    <div className="text-gray-600">Countries</div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full opacity-80 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>

              {/* Floating Country Flags */}
              {/* <div className="absolute -top-8 left-8 text-2xl animate-bounce" style={{animationDelay: '0s'}}>🇺🇸</div>
              <div className="absolute -right-8 top-12 text-2xl animate-bounce" style={{animationDelay: '0.5s'}}>🇬🇧</div>
              <div className="absolute -left-8 bottom-12 text-2xl animate-bounce" style={{animationDelay: '1s'}}>🇨🇦</div>
              <div className="absolute -bottom-8 right-8 text-2xl animate-bounce" style={{animationDelay: '1.5s'}}>🇦🇺</div> */}
            </div>
          </div>
        </div>

        {/* Bottom Section - Urgency/Scarcity */}
        {/* <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-2">
              Limited Time Offer
            </h3>
            <p className="text-purple-100 mb-4">
              Book your free consultation this month and get a complimentary application review worth $200
            </p>
            <div className="flex justify-center items-center gap-4 text-white">
              <div className="text-center">
                <div className="text-2xl font-bold">150+</div>
                <div className="text-sm">Consultations this month</div>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">25</div>
                <div className="text-sm">Spots remaining</div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default CallToActionSection;
