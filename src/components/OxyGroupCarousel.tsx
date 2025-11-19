import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import oxyloansLogo from "../assets/img/image1.png";
import oxybricksLogo from "../assets/img/image2.png";



// Custom Arrows - Hidden on mobile using Tailwind
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


const OxyGroupCarousel = () => {
  const companies = [
    { logo: oxyloansLogo, name: "OXY Loans", link: "https://oxyloans.com/" },
    {
      logo: oxybricksLogo,
      name: "OXY Bricks",
      link: "https://oxybricks.world/",
    },
   
   
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    pauseOnHover: false,
    arrows: true, // Keep this true to enable your custom arrows
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, arrows: true } },
      { breakpoint: 768, settings: { slidesToShow: 2, arrows: false } }, // ❌ Hide arrows on tablets
      { breakpoint: 480, settings: { slidesToShow: 1, arrows: false } }, // ❌ Hide arrows on mobile
    ],
  };

  return (
    <section className="py-10 px-6 bg-white text-center">
      <h3 className="text-2xl font-extrabold mb-10">
        <span className="text-blue-800">OXY</span>{" "}
        <span className="text-green-600">GROUP</span>{" "}
        <span className="text-gray-800">COMPANIES</span>
      </h3>

      <div className="max-w-7xl mx-auto relative">
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
                  alt={`${company.name} Logo`}
                  className="mb-3 w-full h-auto max-w-full object-contain"
                  loading="lazy"
                />
              </a>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default OxyGroupCarousel;
