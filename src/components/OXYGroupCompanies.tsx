import React from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const OXYGroupCompanies: React.FC = () => {
  const bottomLogos = [
    {
      logo: "https://i.ibb.co/s4CW2mg/l1.png",
      name: "OXYGLOBAL.TECH",
      link: "https://www.oxyglobal.tech/",
      desktopClass: "h-[42px] md:h-[50px] lg:h-[58px]",
      mobileClass: "h-[70px]",
    },
    {
      logo: "https://i.ibb.co/B5xsVChY/l2.png",
      name: "OXYLOANS",
      link: "https://oxyloans.com/",
      desktopClass: "h-[46px] md:h-[54px] lg:h-[64px]",
      mobileClass: "h-[74px]",
    },
    {
      logo: "https://i.ibb.co/k2snG0YW/l3.png",
      name: "OXYBRICKS.WORLD",
      link: "https://oxybricks.world/",
      desktopClass: "h-[38px] md:h-[46px] lg:h-[54px]",
      mobileClass: "h-[66px]",
    },
    {
      logo: "https://i.ibb.co/PGYYDvL9/l4.png",
      name: "OXYGOLD.AI",
      link: "https://www.oxygold.ai/",
      desktopClass: "h-[34px] md:h-[40px] lg:h-[48px]",
      mobileClass: "h-[62px]",
    },
    {
      logo: "https://i.ibb.co/B2NcQ7Nj/l5.png",
      name: "OXYCHAIN",
      link: "http://bmv.money:2750/",
      desktopClass: "h-[36px] md:h-[44px] lg:h-[52px]",
      mobileClass: "h-[64px]",
    },
    {
      logo: "https://i.ibb.co/Swx6RWXM/oxyfinservlogo-Cpr9-A3-NT.png",
      name: "OXYFINSERV",
      link: "https://www.oxyfinserv.com/",
      desktopClass: "h-[40px] md:h-[48px] lg:h-[56px]",
      mobileClass: "h-[68px]",
    },
  ];

  const mobileLogoSettings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2300,
    arrows: false,
    pauseOnHover: false,
    pauseOnFocus: false,
    swipeToSlide: true,
    centerMode: true,
    centerPadding: "12px",
  };

  return (
    <section className="w-full bg-white py-5 sm:py-6 md:py-7">
      <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {/* Desktop / Tablet */}
        <div className="hidden sm:block">
          <div
            className="
              grid
              grid-cols-2
              items-center
              gap-x-6
              gap-y-5
              md:grid-cols-3
              md:gap-x-8
              md:gap-y-6
              lg:grid-cols-6
              lg:gap-x-7
              xl:gap-x-10
            "
          >
            {bottomLogos.map((item) => (
              <a
                key={item.name}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${item.name}`}
                title={item.name}
                className="
                  group
                  flex
                  min-h-[100px]
                  w-full
                  items-center
                  justify-center
                  rounded-2xl
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#5543C8]
                  focus-visible:ring-offset-2
                "
              >
                <img
                  src={item.logo}
                  alt={`${item.name} logo`}
                  loading="lazy"
                  draggable={false}
                  className={`
                    ${item.desktopClass}
                    w-auto
                    max-w-[92%]
                    object-contain
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  `}
                />
              </a>
            ))}
          </div>
        </div>

        {/* Mobile */}
        <div className="block sm:hidden">
          <Slider {...mobileLogoSettings}>
            {bottomLogos.map((item) => (
              <div key={item.name} className="px-2">
                <div className="flex justify-center">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${item.name}`}
                    title={item.name}
                    className="
                      flex
                      min-h-[108px]
                      w-full
                      items-center
                      justify-center
                      focus-visible:outline-none
                    "
                  >
                    <img
                      src={item.logo}
                      alt={`${item.name} logo`}
                      loading="lazy"
                      draggable={false}
                      className={`
                        ${item.mobileClass}
                        mx-auto
                        w-auto
                        max-w-[90%]
                        object-contain
                      `}
                    />
                  </a>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default OXYGroupCompanies;