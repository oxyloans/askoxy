import React, { useState } from "react";
import { Check, ChevronRight, ArrowRight } from "lucide-react";

function DomainSection() {
  // State to track which domain card is being hovered or touched
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);

  const domains = [
    {
      id: "ca",
      title: "Customer Acquisition System",
      description:
        "Optimized processes for acquiring new customers and expanding your customer base.",
      features: [
        "Lead generation tools",
        "Customer profiling",
        "Targeted marketing campaigns",
        "Customer onboarding",
      ],
      icon: (
        <svg
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 3C8.134 3 5 6.134 5 10c0 2.21 1.269 4.142 3.031 5.213A6.995 6.995 0 0112 17c1.544 0 3.054-.52 4.217-1.213C17.731 14.142 19 12.21 19 10c0-3.866-3.134-7-7-7z"
          ></path>
        </svg>
      ),
    },
    {
      id: "cm",
      title: "Collections Management",
      description:
        "Streamline collection processes and improve recovery efficiency.",
      features: [
        "Automated collections",
        "Payment scheduling",
        "Debt tracking",
        "Customer reminders",
      ],
      icon: (
        <svg
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c1.657 0 3 1.343 3 3v4c0 1.657-1.343 3-3 3s-3-1.343-3-3V11c0-1.657 1.343-3 3-3z"
          ></path>
        </svg>
      ),
    },
    {
      id: "fms",
      title: "Financial Management System",
      description:
        "Manage and optimize all financial aspects of loan processing and servicing.",
      features: [
        "Payment processing",
        "Interest calculation",
        "Fee management",
        "Financial reporting",
      ],
      icon: (
        <svg
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      ),
    },
  ];

  return (
    <section className="py-10 sm:py-12 md:py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Comprehensive Domain Solutions
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
            Our Global Loan Management System provides specialized tools for
            every aspect of loan processing
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {domains.map((domain, index) => (
            <div
              key={domain.id}
              className={`relative bg-white rounded-xl shadow-md p-4 sm:p-5 md:p-6 transition-all duration-300 ${
                activeCardIndex === index
                  ? "shadow-lg border-blue-100 border"
                  : "hover:shadow-lg"
              }`}
              onMouseEnter={() => setActiveCardIndex(index)}
              onMouseLeave={() => setActiveCardIndex(null)}
              // Add touch events for mobile
              onTouchStart={() => setActiveCardIndex(index)}
              onTouchEnd={() =>
                setTimeout(() => setActiveCardIndex(null), 1000)
              }
            >
              <div className="bg-blue-50 rounded-full p-2 sm:p-3 inline-block mb-3 sm:mb-4 transition-all duration-300">
                {domain.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                {domain.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                {domain.description}
              </p>
              <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                {domain.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className={`flex items-start text-sm sm:text-base transition-all duration-300 ${
                      activeCardIndex === index
                        ? "opacity-100 translate-x-0"
                        : featureIndex > 1
                        ? "opacity-70"
                        : ""
                    }`}
                    style={{
                      transitionDelay: `${featureIndex * 100}ms`,
                    }}
                  >
                    <span className="bg-green-100 p-1 rounded-full mr-2 mt-0.5 flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className="mt-auto text-blue-600 font-medium flex items-center hover:text-blue-800 transition-colors group text-sm sm:text-base"
                aria-label={`Learn more about ${domain.title}`}
              >
                Learn more
                <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              {/* Add subtle background effect on active for mobile */}
              {activeCardIndex === index && (
                <div className="absolute inset-0 bg-blue-50 opacity-10 rounded-xl -z-10"></div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-10 md:mt-12 text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-full transition duration-300 flex items-center mx-auto text-sm sm:text-base">
            View All Solutions
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default DomainSection;
