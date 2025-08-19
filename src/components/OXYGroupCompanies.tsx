import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Importing the logos
import oxyloansLogo from "../assets/img/image1.png";
import oxybricksLogo from "../assets/img/image2.png";
import bmvcoinLogo from "../assets/img/image4.png";
import oxyfoundationLogo from "../assets/img/image5.png";

// Custom arrow components with responsive visibility
const CustomPrevArrow = (props: any) => (
  <button
    {...props}
    className="hidden md:block absolute left-[-40px] top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 text-3xl z-10"
  >
    ❮
  </button>
);

const CustomNextArrow = (props: any) => (
  <button
    {...props}
    className="hidden md:block absolute right-[-40px] top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 text-3xl z-10"
  >
    ❯
  </button>
);

const OXYGroupCompanies = () => {
  const companies = [
    { logo: oxyloansLogo, name: "OXY Loans", link: "https://oxyloans.com/" },
    {
      logo: oxybricksLogo,
      name: "OXY Bricks",
      link: "https://oxybricks.world/",
    },
    { logo: bmvcoinLogo, name: "BMV Money", link: "https://bmv.money/" },
    {
      logo: oxyfoundationLogo,
      name: "OXY Foundation",
      link: "https://www.xperthomez.com/",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 900,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    pauseOnHover: false,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          arrows: false, // disable arrows on mobile
        },
      },
    ],
  };

  return (
    <section className="py-10 px-6 bg-gradient-to-br from-cyan-50 via-white to-purple-50 text-center">
      {/* Gradient Colored Heading */}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-10">
        <span className="text-blue-800">OXY</span>
        <span className="text-green-600">GROUP</span>{" "}
        <span className="text-gray-800">COMPANIES</span>
      </h2>

      <div className="max-w-6xl mx-auto relative">
        <Slider {...settings}>
          {companies.map((company, index) => (
            <div key={index} className="flex flex-col items-center px-4">
              <a
                href={company.link}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform transform hover:scale-105"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="mb-3 w-full h-auto max-w-full object-contain"
                />
              </a>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default OXYGroupCompanies;
