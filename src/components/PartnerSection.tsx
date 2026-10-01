import React from "react";
import { Link } from "react-router-dom";

const PartnerSection: React.FC = () => {
  return (
    <section className="relative w-full bg-white py-6 sm:py-8 lg:py-10">
      <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div
          className="
            relative
            overflow-hidden
            rounded-[22px]
            border
            border-[#cfc4ea]/70
            bg-gradient-to-r
            from-[#ddd6f4]
            via-[#cbbde7]
            to-[#b8a6d7]
            shadow-[0_16px_45px_rgba(63,46,110,0.13)]
          "
        >
          {/* Background Decorations */}
          <div
            className="
              pointer-events-none
              absolute
              -left-16
              -top-20
              h-[230px]
              w-[230px]
              rounded-full
              bg-white/25
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-24
              right-[20%]
              h-[250px]
              w-[250px]
              rounded-full
              bg-violet-500/10
              blur-3xl
            "
          />

          <div
            className="
              relative
              z-[2]
              grid
              grid-cols-1
              items-center
              gap-6
              px-5
              py-6
              sm:px-7
              sm:py-7
              md:grid-cols-[0.9fr_1.1fr]
              md:gap-8
              md:px-9
              lg:grid-cols-[0.82fr_1.18fr]
              lg:gap-10
              lg:px-12
              lg:py-8
              xl:px-14
            "
          >
            {/* LEFT IMAGE */}
            <div className="flex w-full items-center justify-center md:justify-start">
              <Link
                to="/oxyloans-partner"
                aria-label="Explore OXY Partner Opportunities"
                className="
                  group
                  block
                  w-full
                  max-w-[360px]
                  sm:max-w-[420px]
                  md:max-w-[390px]
                  lg:max-w-[450px]
                  xl:max-w-[500px]
                "
              >
                <img
                  src="https://i.ibb.co/kVzGCHFb/partner-card.png"
                  alt="OXY Partner Network"
                  loading="lazy"
                  draggable={false}
                  className="
                    block
                    h-auto
                    w-full
                    object-contain
                    object-center
                    bg-transparent
                    select-none
                    transition-transform
                    duration-300
                    ease-out
                    group-hover:scale-[1.02]
                  "
                />
              </Link>
            </div>

            {/* RIGHT CONTENT */}
            <div className="text-center md:text-left">

              <h2
                className="
                  mt-4
                  text-[30px]
                  font-black
                  leading-[1.04]
                  tracking-[-0.04em]
                  text-[#211849]
                  sm:text-[36px]
                  md:text-[40px]
                  lg:text-[46px]
                  xl:text-[52px]
                "
              >
                Start Your Partner Journey

                <span
                  className="
                    mt-1
                    block
                    bg-gradient-to-r
                    from-[#493087]
                    via-[#663ca8]
                    to-[#7c3aed]
                    bg-clip-text
                    text-transparent
                  "
                >
                  & Earn Money
                </span>
              </h2>

              <p
                className="
                  mx-auto
                  mt-4
                  max-w-[720px]
                  text-[14px]
                  font-medium
                  leading-6
                  text-[#504766]
                  sm:text-[15px]
                  sm:leading-7
                  md:mx-0
                  lg:text-[16px]
                "
              >
                Build partnerships, expand your network and unlock new business
                and earning opportunities across the OXY ecosystem.
              </p>

              {/* Tags */}
              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  items-center
                  justify-center
                  gap-2.5
                  md:justify-start
                "
              >
                {["Partner", "Connect", "Earn"].map((item) => (
                  <span
                    key={item}
                    className="
                      inline-flex
                      items-center
                      rounded-full
                      border
                      border-white/60
                      bg-white/55
                      px-5
                      py-2
                      text-xs
                      font-bold
                      text-[#352960]
                      backdrop-blur-md
                      sm:text-sm
                    "
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-6 flex justify-center md:justify-start">
                <Link
                  to="/oxyloans-partner"
                  className="
                    group
                    inline-flex
                    min-h-[46px]
                    items-center
                    justify-center
                    rounded-full
                    bg-[#24194f]
                    px-6
                    py-3
                    text-sm
                    font-bold
                    text-white
                    shadow-[0_10px_28px_rgba(36,25,79,0.25)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#35226f]
                    hover:shadow-[0_15px_35px_rgba(36,25,79,0.32)]
                    active:scale-[0.98]
                    sm:text-[15px]
                  "
                >
                  Explore Partner Opportunities

                  <span
                    className="
                      ml-2
                      text-lg
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  >
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;