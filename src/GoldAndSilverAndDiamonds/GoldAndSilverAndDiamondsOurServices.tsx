import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import oxyloansLogo from "../assets/img/image1.png";
import oxybricksLogo from "../assets/img/image2.png";
import bmvcoinLogo from "../assets/img/image4.png";
import oxyfoundationLogo from "../assets/img/image5.png";

const companies = [
  { logo: oxyloansLogo, name: "OXY Loans", link: "https://oxyloans.com/" },
  { logo: oxybricksLogo, name: "OXY Bricks", link: "https://oxybricks.world/" },
  { logo: bmvcoinLogo, name: "BMV Money", link: "https://bmv.money/" },
  {
    logo: oxyfoundationLogo,
    name: "OXY Foundation",
    link: "https://www.xperthomez.com/",
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

        <div className="relative max-w-6xl mx-auto">
          <Slider {...settings}>
            {companies.map((company, index) => (
              <div key={index} className="px-4">
                <a
                  href={company.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform duration-300 ease-in-out hover:scale-105"
                >
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="mx-auto h-40 object-contain mb-4"
                  />
                  {/* <p className="text-lg font-semibold text-gray-700">
                    {company.name}
                  </p> */}
                </a>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default GoldAndSilverAndOurServicesCarousel;
