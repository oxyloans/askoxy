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
  const [activeShort, setActiveShort] = useState<string | null>(null);
  const videos = [
    { src: "https://www.youtube.com/embed/zyMV0Qj0lPU" },
    {
      src: "https://drive.google.com/file/d/1vFxflNUzjZpuQjBnG3wX1tS_dhwTkTcL/preview",
    },
    { src: "https://www.youtube.com/embed/gp4F5Z1ZdUg" },
  ];

  const shortVideos = [
    { id: "8gkNQi7ctTo" },
    { id: "RFB-2j6i78c" },
    { id: "PMGw8WhgD7A" },
    { id: "0JXSmy8at_8" },
    { id: "0pwepM5MbE8" },
    { id: "429Cq97jxOQ" },
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
    <div className="min-h-screen">
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {videos.map((video, idx) => (
              <article
                key={idx}
                className="w-full min-w-0"
              >
                <div
                  className="relative w-full overflow-hidden rounded-lg bg-black"
                  style={{ aspectRatio: "16 / 9.5" }}
                >
                  <iframe
                    src={`${video.src}?rel=0&modestbranding=1`}
                    title={`Featured Video ${idx + 1}`}
                    className="absolute inset-0 block h-full w-full border-0"
                    width="560"
                    height="332"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3 lg:gap-8">
            {shortVideos.map((video, idx) => (
              <article key={video.id} className="w-full min-w-0">
                <div
                  className="relative w-full overflow-hidden rounded-lg bg-black"
                  style={{ aspectRatio: "16 / 9.5" }}
                >
                  {activeShort === video.id ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                      title={`Video Highlight ${idx + 1}`}
                      className="absolute inset-0 block h-full w-full border-0"
                      width="560"
                      height="332"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveShort(video.id)}
                      className="group absolute inset-0 h-full w-full cursor-pointer border-0 bg-black p-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-500/70"
                      aria-label={`Play video highlight ${idx + 1}`}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                        alt={`Video highlight ${idx + 1} thumbnail`}
                        loading="lazy"
                        decoding="async"
                        onError={(event) => {
                          if (!event.currentTarget.src.includes("hqdefault")) {
                            event.currentTarget.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                          }
                        }}
                        className="h-full w-full object-contain"
                      />
                      <span className="absolute inset-0 bg-black/10 transition group-hover:bg-black/20" aria-hidden="true" />
                      <span className="absolute left-1/2 top-1/2 grid h-14 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl bg-red-600 text-2xl text-white shadow-lg transition group-hover:scale-105" aria-hidden="true">▶</span>
                    </button>
                  )}
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {awards.map((award, idx) => (
              <article
                key={idx}
                className="group overflow-hidden rounded-xl"
              >
                <div className="relative flex h-72 w-full items-center justify-center sm:h-80">
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
