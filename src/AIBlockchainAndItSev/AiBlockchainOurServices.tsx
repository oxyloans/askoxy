import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import s1 from "../assets/img/s1.png";
import s2 from "../assets/img/s2.png";
import s3 from "../assets/img/s3.png";
import s4 from "../assets/img/s4.png";
import s5 from "../assets/img/s5.png";
import s6 from "../assets/img/s6.png";
import s7 from "../assets/img/s7.png";
import s8 from "../assets/img/s8.png";
import s9 from "../assets/img/s9.png";

const companies = [
  {
    logo: s1,
    name: "AI | Blockchain & IT Services",
    link: "https://www.askoxy.ai/aiblockchainanditservices",
  },
  {
    logo: s2,
    name: "AI - Blogs, Jobs and Training",
    link: "https://www.askoxy.ai/glms",
  },
  {
    logo: s3,
    name: "CA | CS Services",
    link: "https://www.askoxy.ai/caandcsservices",
  },
  {
    logo: s4,
    name: "Gold, Silver & Diamonds",
    link: "https://www.askoxy.ai/goldandsilveranddiamonds",
  },
  {
    logo: s5,
    name: "Loans & Investments",
    link: "https://www.askoxy.ai/loansinvestments",
  },
  { logo: s6, name: "Nyaya Gpt", link: "https://www.askoxy.ai/nyayagpt" },
  { logo: s7, name: "Real Estate", link: "https://www.askoxy.ai/realestate" },
  {
    logo: s8,
    name: "Rice 2 Robo ECommerce",
    link: "https://www.askoxy.ai/rice2roboecommers",
  },
  { logo: s9, name: "Study Abroad", link: "https://www.askoxy.ai/studyabroad" },
];

const OurServicesCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 900,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    pauseOnHover: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  function CustomPrevArrow(props: any) {
    const { onClick } = props;
    return (
      <div className="hidden sm:block">
        <button
          onClick={onClick}
          className="absolute left-[-30px] top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 text-3xl z-10 focus:outline-none"
          aria-label="Previous Slide"
        >
          ❮
        </button>
      </div>
    );
  }

  function CustomNextArrow(props: any) {
    const { onClick } = props;
    return (
      <div className="hidden sm:block">
        <button
          onClick={onClick}
          className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 text-3xl z-10 focus:outline-none"
          aria-label="Next Slide"
        >
          ❯
        </button>
      </div>
    );
  }
  

  return (
    <section className="min-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 py-8 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-extrabold mb-4 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600">
              ASKOXY.AI SUPERAPP
            </span>
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 mb-2">
            Our Services
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <Slider {...settings}>
            {companies.map((company, index) => (
              <div key={index} className="px-4">
                <div
                  className="relative group cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
                  onClick={() => (window.location.href = company.link)}
                >
                  {/* Logo inside a card */}
                  <div >
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="mx-auto h-40 object-contain"
                    />
                  </div>

                  {/* Hover: Show name overlay */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    {company.name}
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default OurServicesCarousel;
