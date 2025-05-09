import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BarChart2,
  Users,
  FileText,
  DollarSign,
  Lock,
  Database,
  Menu,
  X,
  Play,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

// Types definition
interface VideoItem {
  id: number;
  title: string;
  thumbnail: string;
  url: string;
  description: string;
}

interface DomainFeature {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Testimonial {
  id: number;
  name: string;
  company: string;
  role: string;
  avatar: string;
  quote: string;
}

const LoanManagementLandingPage = () => {
  // Sample videos data for the carousel
  const videos: VideoItem[] = [
    {
      id: 1,
      title: "Loan Management Overview",
      thumbnail: "/api/placeholder/640/360",
      url: "#video1",
      description: "Learn about our comprehensive loan management solution",
    },
    {
      id: 2,
      title: "ACS Collection Management",
      thumbnail: "/api/placeholder/640/360",
      url: "#video2",
      description:
        "See how our ACS collection management streamlines processes",
    },
    {
      id: 3,
      title: "Financial Management System",
      thumbnail: "/api/placeholder/640/360",
      url: "#video3",
      description: "Discover our integrated financial management tools",
    },
    {
      id: 4,
      title: "Customer Success Stories",
      thumbnail: "/api/placeholder/640/360",
      url: "#video4",
      description:
        "Hear from our satisfied clients about implementation success",
    },
    {
      id: 5,
      title: "Security Features",
      thumbnail: "/api/placeholder/640/360",
      url: "#video5",
      description: "Learn about our enterprise-grade security measures",
    },
    {
      id: 6,
      title: "Getting Started Guide",
      thumbnail: "/api/placeholder/640/360",
      url: "#video6",
      description: "Quick tutorial on setting up your loan management system",
    },
  ];

  // Domain features
  const domainFeatures: DomainFeature[] = [
    {
      id: 1,
      title: "ACS Collection Management",
      description:
        "Streamline collection processes with automated workflows, customer communication tools, and compliance tracking.",
      icon: <Database className="h-12 w-12 text-blue-600" />,
    },
    {
      id: 2,
      title: "Financial Management System (FMS)",
      description:
        "Integrated financial tools for accounting, reporting, and portfolio management with real-time analytics.",
      icon: <BarChart2 className="h-12 w-12 text-blue-600" />,
    },
    {
      id: 3,
      title: "Customer Relationship Management",
      description:
        "Centralized customer information, interaction history, and personalized communication tools.",
      icon: <Users className="h-12 w-12 text-blue-600" />,
    },
    {
      id: 4,
      title: "Loan Origination",
      description:
        "End-to-end loan application processing with automated underwriting and approval workflows.",
      icon: <FileText className="h-12 w-12 text-blue-600" />,
    },
    {
      id: 5,
      title: "Payment Processing",
      description:
        "Secure and flexible payment options with automated reconciliation and payment tracking.",
      icon: <DollarSign className="h-12 w-12 text-blue-600" />,
    },
    {
      id: 6,
      title: "Security & Compliance",
      description:
        "Enterprise-grade security with regulatory compliance tools and comprehensive audit trails.",
      icon: <Lock className="h-12 w-12 text-blue-600" />,
    },
  ];

  // Testimonials data
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      company: "First National Bank",
      role: "VP of Operations",
      avatar: "/api/placeholder/80/80",
      quote:
        "LoanMaster has transformed our lending operations. What used to take days now takes minutes, and our customer satisfaction scores have improved by 40%.",
    },
    {
      id: 2,
      name: "Michael Chen",
      company: "Pacific Credit Union",
      role: "CTO",
      avatar: "/api/placeholder/80/80",
      quote:
        "The security features and compliance tools have made our audits significantly easier. Integration was smooth and the support team has been exceptional.",
    },
    {
      id: 3,
      name: "Jessica Taylor",
      company: "Metro Lending Group",
      role: "Director of Finance",
      avatar: "/api/placeholder/80/80",
      quote:
        "We've seen a 35% increase in efficiency and a 28% reduction in processing costs since implementing LoanMaster's platform.",
    },
  ];

  // Stats
  const stats = [
    { id: 1, value: "97%", label: "Customer Satisfaction" },
    { id: 2, value: "500+", label: "Financial Institutions" },
    { id: 3, value: "$50B+", label: "Loans Processed" },
    { id: 4, value: "30%", label: "Average Efficiency Gain" },
  ];

  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State for video carousel
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videosPerPage = 3;

  // State for testimonial carousel
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  // For auto-rotating testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) =>
        prevIndex + 1 >= testimonials.length ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Calculate total pages for video carousel
  const totalPages = Math.ceil(videos.length / videosPerPage);

  const nextVideos = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex + videosPerPage >= videos.length ? 0 : prevIndex + videosPerPage
    );
  };

  const prevVideos = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex - videosPerPage < 0
        ? Math.max(0, videos.length - videosPerPage)
        : prevIndex - videosPerPage
    );
  };

  // Get current videos to display
  const currentVideos = videos.slice(
    currentVideoIndex,
    currentVideoIndex + videosPerPage
  );

  // Header animation on scroll
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Smooth scroll function
  const scrollToSection = (id:any) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  // Animation references
  const featureRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);
  featureRefs.current = Array(domainFeatures.length)
    .fill(null)
    .map((_, i) => featureRefs.current[i] || React.createRef<HTMLDivElement>());

  // Animation on scroll for features
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeIn");
          }
        });
      },
      { threshold: 0.1 }
    );

    featureRefs.current.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      featureRefs.current.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  return (
    <div className="font-sans antialiased bg-gray-50">
      {/* Sticky Header */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-xl">L</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  LoanMaster
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex">
              <ul className="flex space-x-8">
                <li>
                  <button
                    onClick={() => scrollToSection("intro")}
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("videos")}
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Resources
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("testimonials")}
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Testimonials
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </nav>

            <div className="flex items-center">
              <button className="hidden md:block bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors">
                Request Demo
              </button>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden ml-4 text-gray-700 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white shadow-lg animate-fadeIn">
            <nav className="container mx-auto px-4 py-4">
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => scrollToSection("intro")}
                    className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 font-medium"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("videos")}
                    className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Resources
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("testimonials")}
                    className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Testimonials
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors mt-2">
                    Request Demo
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 z-10">
              <div className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                Trusted by 500+ Financial Institutions
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-800 leading-tight">
                Streamline Your{" "}
                <span className="text-blue-600">Loan Management</span> System
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                From origination to collection, manage your entire loan
                lifecycle with efficiency and precision on our all-in-one
                platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors flex items-center justify-center">
                  Watch Demo
                  <Play className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              {/* Decorative elements */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-300 rounded-full opacity-20 blur-2xl"></div>

              <div className="relative bg-white p-2 rounded-2xl shadow-2xl rotate-1 transform transition hover:rotate-0">
                <img
                  src="/api/placeholder/640/480"
                  alt="Loan Management System Dashboard"
                  className="rounded-xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-3 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">
                      Real-time Analytics
                    </span>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 bg-white p-3 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">
                      Smart Automation
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.id} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Introduction Text Section */}
      <section className="py-16 bg-white" id="intro">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col md:flex-row items-center mb-12">
            <div className="md:w-1/3 flex justify-center mb-8 md:mb-0">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-100 rounded-full scale-150 blur-3xl opacity-30"></div>
                <div className="relative bg-blue-600 text-white p-6 rounded-full w-24 h-24 flex items-center justify-center">
                  <Database className="h-12 w-12" />
                </div>
              </div>
            </div>
            <div className="md:w-2/3 md:pl-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">
                Transforming Loan Management
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our loan management system combines powerful technology with
                user-friendly interfaces to deliver a seamless experience for
                both lenders and borrowers. With automated workflows, real-time
                analytics, and comprehensive reporting, we help financial
                institutions streamline operations, ensure compliance, and
                improve customer satisfaction.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Enterprise-grade security & reliability</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Scalable for institutions of all sizes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Domain Features Section */}
      <section className="py-16 bg-gray-50" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              Comprehensive Solutions
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              All-in-One Loan Management
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to streamline lending operations, from
              application to servicing and collections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {domainFeatures.map((feature, index) => (
              <div
                key={feature.id}
                ref={featureRefs.current[index]}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 opacity-0"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="bg-blue-50 rounded-lg p-3 inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
                <div className="mt-4">
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                  >
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 bg-white" id="videos">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              Resource Library
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Learn How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our collection of demos, tutorials, and success stories to
              see LoanMaster in action.
            </p>
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={prevVideos}
                className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
                aria-label="Previous videos"
              >
                <ChevronLeft className="h-6 w-6 text-blue-600" />
              </button>
              <div className="text-gray-500">
                Page {Math.floor(currentVideoIndex / videosPerPage) + 1} of{" "}
                {totalPages}
              </div>
              <button
                onClick={nextVideos}
                className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
                aria-label="Next videos"
              >
                <ChevronRight className="h-6 w-6 text-blue-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
                >
                  <div className="relative pb-[56.25%]">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="absolute w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-blue-600 bg-opacity-80 rounded-full p-3 cursor-pointer hover:bg-opacity-100 transition-all">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">
                      {video.title}
                    </h3>
                    <p className="text-gray-600">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors">
                View All Resources
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-blue-50" id="testimonials">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              Client Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Trusted by Industry Leaders
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what our clients are saying about their experience with
              LoanMaster.
            </p>
          </div>

          <div className="relative">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="flex justify-center mb-6">
                <img
                  src={testimonials[currentTestimonialIndex].avatar}
                  alt={testimonials[currentTestimonialIndex].name}
                  className="w-20 h-20 rounded-full border-4 border-blue-100"
                />
              </div>
              <div className="text-center">
                <p className="text-lg md:text-xl text-gray-600 italic mb-6">
                  "{testimonials[currentTestimonialIndex].quote}"
                </p>
                <h4 className="text-xl font-bold text-gray-800">
                  {testimonials[currentTestimonialIndex].name}
                </h4>
                <p className="text-gray-600">
                  {testimonials[currentTestimonialIndex].role},{" "}
                  {testimonials[currentTestimonialIndex].company}
                </p>
              </div>

              <div className="flex justify-center mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonialIndex(index)}
                    className={`mx-1 w-3 h-3 rounded-full ${
                      currentTestimonialIndex === index
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        className="py-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white"
        id="contact"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-lg">
              <div className="md:w-2/3 mb-8 md:mb-0">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Transform Your Loan Management?
                </h2>
                <p className="text-lg mb-0 text-blue-100">
                  Join hundreds of financial institutions that have improved
                  efficiency and customer satisfaction with our platform.
                </p>
              </div>
              <div className="md:w-1/3 flex flex-col gap-4">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors w-full">
                  Schedule a Demo
                </button>
                <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white hover:bg-opacity-10 transition-colors w-full">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
    
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} LoanMaster. All rights reserved.
            </p>
          </div>
       
      </footer>
    </div>
  );
};

export default LoanManagementLandingPage;
