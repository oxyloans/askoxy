import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  CheckCircle, 
  Star, 
  Eye, 
  CreditCard, 
  Shield, 
  Rocket, 
  Users, 
  DollarSign, 
  Handshake,
  TrendingUp,
  Coins , X
} from 'lucide-react';
import Header1 from "../Header"

// Import all testimonial images
import I1 from "../../assets/img/testimonial1.png";
import I2 from "../../assets/img/testimonial2.png";
import I3 from "../../assets/img/testimonial3.png";
import I4 from "../../assets/img/testimonial4.png";
import I5 from "../../assets/img/testimonial5.png";
import I6 from "../../assets/img/testimonial6.png";
import I7 from "../../assets/img/testimonial7.png";
import I8 from "../../assets/img/testimonial8.png";
import I9 from "../../assets/img/testimonial9.png";
import I10 from "../../assets/img/testimonial10.png";
import I11 from "../../assets/img/testimonial11.png";
import I12 from "../../assets/img/testimonial12.png";
import I13 from "../../assets/img/testimonial13.png";
import I14 from "../../assets/img/testimonial14.png";
import I15 from "../../assets/img/testimonial15.png";
import I16 from "../../assets/img/testimonial16.png";
import I17 from "../../assets/img/testimonial17.png";
import I18 from "../../assets/img/testimonial18.png";
import I19 from "../../assets/img/testimonial19.png";
import RBILicense from "../../assets/img/RBI.png";

const OxyLoans: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lend' | 'borrow' | 'lendAndEarn'>('lend');
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [showRBILicense, setShowRBILicense] = useState(false);
  const userId = localStorage.getItem('userId');

  // Comprehensive testimonials data
  const testimonials = [
    {
      id: "testimonial1",
      author: "Aruna Videla",
      quote: "Oxyloans is best P2P lending platform in India. They are exceptionally proficient and genuine. I have been Investing in Oxyloans from past couple of years and getting great returns for my Investment best in the market.",
      image: I1,
    },
    {
      id: "testimonial2",
      author: "Praveen Rayapudi",
      quote: "I am with oxyloans from past 2 years, it was a wonderful journey had earned very good return for the investment. The team is wonderful and they keep launching innovative and new deals regularly.",
      image: I2,
    },
    {
      id: "testimonial4",
      author: "Manoj Sharma",
      quote: "What I like about OXYLOANS is that customers profit is their main aim. And that too not small profit as seen on other P2P lending platforms. The OXYLOANS company try their best to make our investment safe.",
      image: I3,
    },
    {
      id: "testimonial5",
      author: "Sudheer Kumar Vakkalagadda",
      quote: "Everyone from Oxyloans team are highly transparent, professional, very responsive. I have also referred my friends and they are lending to people who are in need and getting benefited.",
      image: I4,
    },
    {
      id: "testimonial7",
      author: "Vijaykanth Kothapalli",
      quote: "Student deals are awesome. Effective teamwork and coordination makes it easy to track.",
      image: I5,
    },
    {
      id: "testimonial10",
      author: "Venu Kuchipudi",
      quote: "OXYLOANS team is very professional and responsive and mainly transparent. CEO Mr. Radha Krishna Garu is working very hard to take the company to next level.",
      image: I6,
    },
    {
      id: "testimonial11",
      author: "Ravi Rao",
      quote: "As a user of OxyLoans. I have been very satisfied and happy. It has been a very rewarding experience for me.",
      image: I7,
    },
    {
      id: "testimonial12",
      author: "Krishna Velguri",
      quote: "They provide the best interest rates in the current market and friendly customer services. I wish all the best to the team to grow much better.",
      image: I8,
    },
    {
      id: "testimonial13",
      author: "Sreenivasa Rao Yenduri",
      quote: "FinTech start-ups drive the future of World Economy. I am proud to Invest in OxyLoans.",
      image: I9,
    },
    {
      id: "testimonial16",
      author: "Sreedhar Reddy",
      quote: "I am happy to be part of FinTech start-up, OxyLoans. P2P Loans are the Future of Lending and Borrowing.",
      image: I12,
    },
    {
      id: "testimonial18",
      author: "Nalluri Subbarao",
      quote: "FinTech start-ups drive the future of World Economy. I am proud to Invest in OxyLoans.",
      image: I15,
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => 
        (prevIndex + 1) % testimonials.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Navigation handlers
  const handleNavigation = (type: 'lend' | 'borrow' | 'lendAndEarn') => {
    switch(type) {
      case 'lend':
        window.open('https://user.oxyloans.com/', '_blank');
        break;
      case 'borrow':
        window.open('https://oxyloans.com/', '_blank');
        break;
      case 'lendAndEarn':
        window.open('https://user.oxyloans.com/lend-and-earn', '_blank');
        break;
    }
  };

  // Toggle RBI License Modal
  const toggleRBILicense = () => {
    setShowRBILicense(!showRBILicense);
  };

  // Updated Impact Tiles Component
  const ImpactTiles = () => {
    const tiles = [
        { 
            icon: Handshake, 
            value: "30,000+", 
            label: "Lenders",
            description: "Trusted Investors" 
          },
    
      { 
        icon: Users, 
        value: "270,000+", 
        label: "Borrowers",
        description: "Growing Community" 
      },  { 
        icon: Coins, 
        value: "₹2,500,000,000+", 
        label: "Total Disbursal", 
        description: "In the Indian Financial Market" 
      }
      
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {tiles.map((tile, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-lg p-6 text-center transform transition hover:scale-105"
          >
            <tile.icon className="mx-auto mb-4 text-blue-600 w-12 h-12" />
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{tile.value}</h3>
            <p className="text-gray-600">{tile.label}</p>
            <p className="text-sm text-gray-500 mt-1">{tile.description}</p>
          </div>
        ))}
      </div>
    );
  };

  // Benefit Tiles Component
  const BenefitTiles = () => {
    const benefits = [
      { 
        icon: CreditCard, 
        title: "Easy Compare", 
        description: "Compare loan offers and investment opportunities effortlessly" 
      },
      { 
        icon: Shield, 
        title: "Expert Assistance", 
        description: "Get professional guidance throughout your lending journey" 
      },
      { 
        icon: Rocket, 
        title: "Save Money", 
        description: "Optimize your investments and borrowing with competitive rates" 
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {benefits.map((benefit, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-lg p-6 text-center transform transition hover:scale-105"
          >
            <benefit.icon className="mx-auto mb-4 text-blue-600 w-12 h-12" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
            <p className="text-gray-600">{benefit.description}</p>
          </div>
        ))}
      </div>
    );
  };

  // Lend and Earn Section Component
  const LendAndEarnSection = () => {
    return (
      <section className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-8 mb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
            Lend and Earn
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <TrendingUp className="mx-auto mb-4 text-green-600 w-12 h-12" />
              <h3 className="text-2xl font-semibold text-center mb-4 text-gray-800">
                Attractive Returns
              </h3>
              <div className="text-center">
                <p className="text-xl font-bold text-green-600 mb-2">
                  Lend and Earn Upto 1.75% Monthly ROI and 24% P.A.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <Coins className="mx-auto mb-4 text-blue-600 w-12 h-12" />
              <h3 className="text-2xl font-semibold text-center mb-4 text-gray-800">
                Easy Investment
              </h3>
              <div className="text-center">
                <p className="text-xl font-bold text-blue-600 mb-2">
                Start your investment journey with just ₹500
                </p>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <a 
              href="https://user.oxyloans.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition inline-flex items-center"
            >
              <TrendingUp className="mr-2" /> Register for Lend and Earn
            </a>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans bg-gradient-to-b from-blue-50 to-white min-h-screen">
       <div className="mb-4 p-2">
        {!userId ?   <Header1 />: null}
      </div>
      {/* RBI License Modal */}
      {showRBILicense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
          <button 
  onClick={toggleRBILicense} 
  className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
>
  <X size={20} />
</button>
            <img 
               src={RBILicense} 
              alt="RBI License Certificate" 
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-12 md:py-16 text-center">
        <h1 className="text-2xl md:text-2xl lg:text-4xl font-extrabold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
          OxyLoans - RBI Approved P2P NBFC
        </h1>
        <p className="max-w-xl mx-auto text-lg md:text-xl text-gray-700 leading-relaxed">
          Revolutionizing financial connections through transparent, efficient peer-to-peer lending.
        </p>
        
        {/* RBI License Button */}
        <button 
          onClick={toggleRBILicense}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center mx-auto"
        >
          <Eye className="mr-2" /> View RBI License Certificate
        </button>
      </section>

      {/* Impact Tiles Section */}
      <ImpactTiles />

      {/* New Lend and Earn Section */}
      <LendAndEarnSection />

      {/* Testimonials Carousel */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Lender Experiences
        </h3>
        <div className="relative">
          <div className="flex flex-col items-center">
            <img 
              src={testimonials[currentTestimonialIndex].image} 
              alt={testimonials[currentTestimonialIndex].author} 
              className="w-full h-full object-cover mb-4 shadow-lg"
            />
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-yellow-400 w-6 h-6 fill-current" />
              ))}
            </div>
            <blockquote className="text-center text-gray-700 italic mb-4 max-w-md">
              "{testimonials[currentTestimonialIndex].quote}"
            </blockquote>
            <p className="font-semibold text-gray-900">
              {testimonials[currentTestimonialIndex].author}
            </p>
          </div>
        </div>
      </div>
        
      {/* Benefits Tiles Section */}
      <BenefitTiles />

      {/* App Download Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl py-16 text-center mb-16">
        <h2 className="text-4xl font-bold mb-6">Download OxyLoans App</h2>
        <p className="max-w-2xl mx-auto text-xl mb-8 opacity-90">
          Start investing or borrowing right from your mobile
        </p>
        <div className="flex justify-center space-x-4">
          <a 
            href="https://play.google.com/store/apps/details?id=com.oxyloans.lender" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transform transition-transform hover:scale-105"
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png" 
              alt="Google Play Store" 
              className="h-16"
            />
          </a>
          <a 
            href="https://apps.apple.com/in/app/oxyloans-lender/id6444208708" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transform transition-transform hover:scale-105"
          >
            <img 
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
              alt="App Store" 
              className="h-16"
            />
          </a>
        </div>
      </section>
    </div>
  );
};

export default OxyLoans;