"use client";
import React, { useState } from "react";

// ✅ Import images
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

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = "",
  sizes,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {!loaded && !errored && (
        <div className="absolute inset-0 animate-pulse rounded-xl bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100" />
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
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          <div className="text-sm font-semibold">Image not available</div>
          <div className="text-xs opacity-80">{alt}</div>
        </div>
      )}
    </div>
  );
};

const AwardsRewardsVideo: React.FC = () => {
  const videos = [
    { src: "https://www.youtube.com/embed/zyMV0Qj0lPU" },
    {
      src: "https://drive.google.com/file/d/1vFxflNUzjZpuQjBnG3wX1tS_dhwTkTcL/preview",
    },
    { src: "https://www.youtube.com/embed/gp4F5Z1ZdUg" },
  ];

  const awards = [
    { image: A1 as string },
    { image: A2 as string },
    { image: A3 as string },
    { image: A4 as string },
    { image: A5 as string },
    { image: A11 as string },
    { image: A12 as string },
    { image: A6 as string },
    { image: A7 as string },
    { image: A8 as string },
    { image: A9 as string },
    { image: A10 as string },
    { image: A16 as string },
    { image: A14 as string },
    { image: A15 as string },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900">
            🏆 Awards & Rewards
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Celebrating our milestones, teamwork, and the incredible community
            behind our success.
          </p>
        </header>

        {/* 🎥 Videos Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {videos.map((video, idx) => (
              <article
                key={idx}
                className="group overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 shadow-md hover:shadow-2xl transition-shadow w-full max-w-[500px]"
              >
                <div className="relative aspect-video w-full">
                  <iframe
                    src={`${video.src}?rel=0&modestbranding=1`}
                    title={`Featured Video ${idx + 1}`}
                    className="w-full h-full rounded-2xl"
                    frameBorder={0}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 🏅 Awards Section */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 text-center">
            Our Achievements
          </h2>

          {/* 🖼️ 3-column grid for awards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {awards.map((award, idx) => (
              <article
                key={idx}
                className="group overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative w-full h-80 flex items-center justify-center bg-white">
                  <SafeImage
                    src={award.image}
                    alt={`Award ${idx + 1}`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="rounded-2xl"
                  />
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
