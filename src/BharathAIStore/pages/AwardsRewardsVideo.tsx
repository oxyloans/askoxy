"use client";

import React, { useState } from "react";

// ✅ Import images from assets
import A1 from "../../assets/img/award1.jpg";
import A2 from "../../assets/img/award2.jpg";
import A3 from "../../assets/img/award3.jpg";
import A4 from "../../assets/img/award4.jpg";
import A5 from "../../assets/img/award5.jpg";
import A6 from "../../assets/img/award6.jpg";
import A7 from "../../assets/img/award7.jpg";
import A8 from "../../assets/img/award8.jpg";
import A9 from "../../assets/img/award9.jpg";
import A10 from "../../assets/img/award10.jpg";
import A11 from "../../assets/img/award11.jpg";
import A12 from "../../assets/img/award12.jpg";
import A14 from "../../assets/img/award14.jpg";
import A15 from "../../assets/img/award16.jpg";
import A16 from "../../assets/img/award17.jpg";

/** SafeImage Component */
function SafeImage({
  src,
  alt,
  className = "",
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {!loaded && !errored && (
        <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100" />
      )}
      {!errored ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          sizes={sizes}
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center rounded-2xl bg-slate-100 text-slate-500">
          <div className="text-center px-4">
            <div className="mb-1.5 text-sm font-semibold">
              Image not available
            </div>
            <div className="text-xs opacity-80">{alt}</div>
          </div>
        </div>
      )}
    </div>
  );
}

const AwardsRewardsVideo: React.FC = () => {
  const videos = [
    { src: "https://www.youtube.com/embed/zyMV0Qj0lPU" },
    {
      src: "https://drive.google.com/file/d/1vFxflNUzjZpuQjBnG3wX1tS_dhwTkTcL/preview",
    },
    { src: "https://www.youtube.com/embed/gp4F5Z1ZdUg" },
   
  ];

  const awards = [
    { image: A1 as unknown as string },
    { image: A2 as unknown as string },
    { image: A11 as unknown as string },
    { image: A12 as unknown as string },
    { image: A3 as unknown as string },
    { image: A4 as unknown as string },
    { image: A5 as unknown as string },

    { image: A10 as unknown as string },

    { image: A14 as unknown as string },
    { image: A15 as unknown as string },
    { image: A16 as unknown as string },
    { image: A7 as unknown as string },
    { image: A8 as unknown as string },
    { image: A9 as unknown as string },
    { image: A6 as unknown as string },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        {/* Header */}
        <header className="mb-8 sm:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            Awards & Rewards
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Celebrating our milestones, teams, and the community behind them.
          </p>
        </header>
        {/* Videos */}
        <section className="mb-12">
         
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
            {videos.map((video, idx) => (
              <article
                key={idx}
                className="group overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-lg hover:shadow-2xl transition-shadow w-full max-w-[500px]"
              >
                {/* Video container */}
                <div className="relative aspect-video w-full">
                  <iframe
                    src={`${video.src}?rel=0&modestbranding=1`}
                    title={`Featured Video ${idx + 1}`}
                    className="w-full h-full rounded-t-3xl"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
               
              </article>
            ))}
          </div>
        </section>

        {/* Awards */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 text-center">
            Our Achievements
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {awards.map((award, idx) => (
              <article
                key={idx}
                className="group overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="relative aspect-[4/3] p-4 bg-slate-50">
                  <SafeImage
                    src={award.image}
                    alt={`Award ${idx + 1}`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="rounded-2xl"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 via-black/10 to-transparent rounded-b-2xl" />
                  <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-1 group-hover:ring-slate-300 transition-all" />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AwardsRewardsVideo;
