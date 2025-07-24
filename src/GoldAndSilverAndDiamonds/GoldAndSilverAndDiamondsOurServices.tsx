import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Company data
const companies = [
  {
    logo: "https://i.ibb.co/0yGwYp5n/a1.png",
    name: "AI | Blockchain & IT Services",
    link: "https://www.askoxy.ai/aiblockchainanditservices",
  },
  {
    logo: "https://i.ibb.co/KczYBVnt/a2.png",
    name: "AI - Blogs, Jobs and Training",
    link: "https://www.askoxy.ai/glms",
  },
  {
    logo: "https://i.ibb.co/934hDrxH/a3.png",
    name: "CA | CS Services",
    link: "https://www.askoxy.ai/caandcsservices",
  },
  {
    logo: "https://i.ibb.co/gpr9XDj/a4.png",
    name: "Nyaya Gpt",
    link: "https://www.askoxy.ai/nyayagpt",
  },
  {
    logo: "https://i.ibb.co/jvzPFYKQ/a5.png",
    name: "Gold, Silver & Diamonds",
    link: "https://www.askoxy.ai/goldandsilveranddiamonds",
  },
  {
    logo: "https://i.ibb.co/Cs8trQLZ/a6.png",
    name: " Loans & Investments",
    link: "https://www.askoxy.ai/loansinvestments",
  },
  {
    logo: "https://i.ibb.co/7xGFvBVW/a7.png",
    name: "Rice 2 Robo ECommerce",
    link: "https://www.askoxy.ai/rice2roboecommers",
  },
  {
    logo: "https://i.ibb.co/ynYWxzZr/a8.png",
    name: "Real Estate",
    link: "https://www.askoxy.ai/realestate",
  },
  {
    logo: "https://i.ibb.co/NgRVq7fJ/a9.png",
    name: "Study Abroad",
    link: "https://www.askoxy.ai/studyabroad",
  },
];
const GoldAndSilverAndOurServicesCarousel = () => {
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

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Slider {...settings}>
            {companies.map((company, index) => (
              <div key={index} className="px-2 sm:px-4">
                <div
                  className="relative group cursor-pointer rounded-lg overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105"
                  onClick={() => window.open(company.link, "_blank")}
                  aria-label={`Visit ${company.name}`}
                >
                  <img
                    src={company.logo}
                    alt={company.name || "Company Logo"}
                    className="mx-auto h-32 sm:h-40 md:h-48 object-contain w-full max-w-xs transition duration-300"
                  />

                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 whitespace-nowrap">
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

export default GoldAndSilverAndOurServicesCarousel;
