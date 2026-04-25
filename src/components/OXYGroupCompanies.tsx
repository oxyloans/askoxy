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
      desktopClass: "h-[42px] md:h-[52px] lg:h-[60px]",
      mobileClass: "h-[70px]",
    },
    {
      logo: "https://i.ibb.co/B5xsVChY/l2.png",
      name: "OXYLOANS",
      link: "https://oxyloans.com/",
      desktopClass: "h-[46px] md:h-[56px] lg:h-[66px]",
      mobileClass: "h-[74px]",
    },
    {
      logo: "https://i.ibb.co/k2snG0YW/l3.png",
      name: "OXYBRICKS.WORLD",
      link: "https://oxybricks.world/",
      desktopClass: "h-[38px] md:h-[48px] lg:h-[56px]",
      mobileClass: "h-[66px]",
    },
    {
      logo: "https://i.ibb.co/PGYYDvL9/l4.png",
      name: "OXYGOLD.AI",
      link: "https://www.oxygold.ai/",
      desktopClass: "h-[34px] md:h-[42px] lg:h-[50px]",
      mobileClass: "h-[62px]",
    },
    {
      logo: "https://i.ibb.co/B2NcQ7Nj/l5.png",
      name: "OXYCHAIN",
      link: "http://bmv.money:2750/",
      desktopClass: "h-[36px] md:h-[46px] lg:h-[54px]",
      mobileClass: "h-[64px]",
    },
  ];

  const mobileLogoSettings = {
    dots: false,
    infinite: true,
    speed: 900,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
    pauseOnHover: false,
    centerMode: true,
    centerPadding: "10px",
  };

  return (
    <section className="w-full bg-white py-5 sm:py-6 md:py-6 shadow-[0_2px_10px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] border-t border-[rgba(0,0,0,0.05)]">
      <div className="mx-auto max-w-[1800px] px-3 sm:px-5 md:px-8 lg:px-10">
        {/* Desktop / Tablet */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-2 items-center gap-x-8 gap-y-6 md:grid-cols-5 md:gap-x-8 lg:gap-x-10 xl:gap-x-12">
            {bottomLogos.map((item) => (
              <a
                key={item.name}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[92px] items-center justify-center"
              >
                <img
                  src={item.logo}
                  alt={item.name}
                  className={`${item.desktopClass} w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]`}
                />
              </a>
            ))}
          </div>
        </div>

        {/* Mobile */}
        <div className="block sm:hidden">
          <Slider {...mobileLogoSettings}>
            {bottomLogos.map((item) => (
              <div key={item.name}>
                <div className="flex justify-center">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[110px] w-full items-center justify-center"
                  >
                    <img
                      src={item.logo}
                      alt={item.name}
                      className={`${item.mobileClass} mx-auto w-auto max-w-[95%] object-contain`}
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