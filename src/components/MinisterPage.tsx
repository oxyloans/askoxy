import React from "react";
import { motion } from "framer-motion";
import { PlayCircle, LandmarkIcon, ArrowUpRight } from "lucide-react";

const videos = [
  {
    id: 1,
    title: "A Strong Start Toward AI-Driven Opportunities in Telangana",
    description:
      "A promising moment highlighting the vision for AI-led growth, innovation, and new opportunities in Telangana.",
    embedLink:
      "https://drive.google.com/file/d/1GGajBE2JjTTDLQNIc2MeoDObt0H11nL-/preview",
    driveLink:
      "https://drive.google.com/file/d/1GGajBE2JjTTDLQNIc2MeoDObt0H11nL-/view?usp=sharing",
  },
  {
    id: 2,
    title: "Thanks to Our Hon’ble Chief Minister for Joining TOI HYD @25",
    description:
      "A proud moment as the Hon’ble Chief Minister joined TOI HYD @25 and witnessed ASKOXY.AI, OXYLOANS, and the launch of Bharat AI Store.",
    embedLink:
      "https://drive.google.com/file/d/1RLN5EMzkSEsk81H9yl2GbTUTx4wNAU5Q/preview",
    driveLink:
      "https://drive.google.com/file/d/1RLN5EMzkSEsk81H9yl2GbTUTx4wNAU5Q/view?usp=sharing",
  },
  {
    id: 3,
    title: "Hon’ble IT Minister Appreciates Our CEO’s Rotary AI Hub Initiative",
    description:
      "A meaningful recognition as the Hon’ble IT Minister appreciated the thought behind our CEO’s Rotary AI Hub initiative.",
    embedLink:
      "https://drive.google.com/file/d/19xrKXbjAAQr7hSwxyJ0w6uUG7ixiKw0a/preview",
    driveLink:
      "https://drive.google.com/file/d/19xrKXbjAAQr7hSwxyJ0w6uUG7ixiKw0a/view?usp=sharing",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const MinisterMeetingPage: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fcfaff] via-[#f7f2ff] to-white py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8">
      {/* soft background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute top-20 right-0 h-80 w-80 rounded-full bg-fuchsia-100/60 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-100/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* HERO */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mx-auto max-w-5xl text-center mb-10 sm:mb-12 lg:mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-xs sm:text-sm font-semibold text-violet-700 shadow-sm">
            <LandmarkIcon className="h-4 w-4" />
            Leadership Moment
          </div>

          <h1 className="mt-5 text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-snug text-slate-900">
            Our CEO{" "}
            <span className="bg-gradient-to-r from-purple-800 via-indigo-800 to-violet-700 bg-clip-text text-transparent">
              Radhakrishna Thatavarti
            </span>{" "}
            Meets Telangana IT Minister{" "}
            <span className="bg-gradient-to-r from-violet-700 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
              D. Sridhar Babu
            </span>
          </h1>

          <p className="mt-4 mx-auto max-w-3xl text-sm sm:text-base lg:text-[17px] text-slate-600 leading-7">
            A proud leadership moment reflecting a shared vision for innovation,
            AI-driven progress, and future-ready growth.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <div className="rounded-full bg-gradient-to-r from-violet-700 to-indigo-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200">
              Leadership. Vision. Innovation.
            </div>
            <div className="rounded-full border border-violet-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm">
              AI-led progress in Telangana
            </div>
          </div>
        </motion.div>

        {/* VIDEO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.15 + index * 0.08}
              whileHover={{ y: -6 }}
              className="flex h-full flex-col rounded-[30px] border border-violet-100 bg-white/90 backdrop-blur-sm shadow-[0_16px_50px_rgba(109,40,217,0.08)] overflow-hidden transition-all"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-500" />

              {/* Video */}
              <div className="p-4 sm:p-5">
                <div className="rounded-[22px] overflow-hidden bg-black border border-slate-200 shadow-sm">
                  <div className="relative w-full aspect-[9/16]">
                    <iframe
                      src={video.embedLink}
                      title={video.title}
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                      style={{ border: "none" }}
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col px-4 sm:px-5 pb-5 sm:pb-6">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                  <PlayCircle className="h-4 w-4" />
                  Video {video.id}
                </div>

                <h3 className="mt-4 min-h-[72px] text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                  {video.title}
                </h3>

                <p className="mt-3 flex-1 min-h-[88px] text-sm text-slate-600 leading-6">
                  {video.description}
                </p>

                <a
                  href={video.driveLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-700 to-indigo-700 px-4 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
                >
                  Open Video
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FOOT NOTE */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
          className="mt-8 sm:mt-10"
        >
          <div className="rounded-[24px] border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-indigo-50 px-5 py-4 text-center shadow-sm">
            <p className="text-sm sm:text-base text-slate-600 leading-7 max-w-4xl mx-auto">
              These videos capture key moments of leadership, recognition, and
              AI-focused progress shaping new opportunities in Telangana.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MinisterMeetingPage;