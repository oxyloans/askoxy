import React, { useEffect, useState } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

type Presentation = {
  id: number;
  subtitle: string;
  title: string;
  description: string;
  points: string[];
  image: string;
  imageAlt: string;
  buttonText: string;
  driveLink: string;
  embedLink: string;
};

const presentations: Presentation[] = [
  {
    id: 1,
    subtitle: "ACCENTURE | 2 PAGER PDF",
    title: "Accenture Global Talent Landscape",
    description:
      "A focused 2-pager covering Accenture’s location distribution, area of interest distribution, and our AI-powered talent sourcing and fulfillment workflow.",
    points: [
      "Location distribution and hiring landscape",
      "Area of interest distribution insights",
      "AI-powered sourcing, assessment, and fulfillment process",
    ],
    image: "https://i.ibb.co/PZ2vN4Tw/accenture1.png",
    imageAlt: "Accenture 2 pager PDF preview",
    buttonText: "View 2 Pager",
    driveLink:
      "https://drive.google.com/file/d/1b3uJndmO73bfCmkt_7Q-Vbn-bmdvfO36/view",
    embedLink:
      "https://drive.google.com/file/d/1b3uJndmO73bfCmkt_7Q-Vbn-bmdvfO36/preview",
  },
  {
    id: 2,
    subtitle: "ACCENTURE | PPT PDF",
    title: "Accenture Presentation Deck",
    description:
      "A presentation-led overview of OXYGLOBAL.TECH’s 4P model, technology ecosystem, sourcing strengths, and strategic partnership approach for enterprise-scale talent delivery.",
    points: [
      "4P partnership model and company overview",
      "People, Platforms, Products, and Capital strengths",
      "Enterprise partnership and scale delivery capability",
    ],
    image: "https://i.ibb.co/7J12ygy0/accenture2.png",
    imageAlt: "Accenture PPT PDF preview",
    buttonText: "View PPT",
    driveLink:
      "https://drive.google.com/file/d/1zsNEKiSn36w4LjS5URSgflWDROAPUG_C/view",
    embedLink:
      "https://drive.google.com/file/d/1zsNEKiSn36w4LjS5URSgflWDROAPUG_C/preview",
  },
];

const ACCENTURE_JOBS_URL = "https://www.askoxy.ai/accenture/jobs";

// Accenture Theme Colors
const THEME = {
  purple: "#A100FF",
  black: "#000000",
  white: "#FFFFFF",
  lightBg: "#F5F5F7",
  border: "#E5E7EB",
  textGray: "#4B5563",
  softGray: "#6B7280",
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -36 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: "easeOut" },
  },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 36 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14 },
  },
};

const itemFade: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalContent: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: 18,
    scale: 0.97,
    transition: { duration: 0.22, ease: "easeInOut" },
  },
};

const previewSwapVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 18,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    y: -12,
    transition: {
      duration: 0.28,
      ease: "easeInOut",
    },
  },
};

const AccenturePresentation: React.FC = () => {
  const [selectedPresentation, setSelectedPresentation] =
    useState<Presentation | null>(null);

  const [openedPreviewId, setOpenedPreviewId] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (selectedPresentation) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedPresentation]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPresentation(null);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleOpenJobs = () => {
    window.open(ACCENTURE_JOBS_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Header />

      <main
        className="w-full pt-10 sm:pt-8 lg:pt-10"
        style={{ backgroundColor: THEME.white }}
      >
        <section className="w-full px-4 py-10 sm:px-6 sm:py-12 md:px-8 lg:px-12 lg:py-16 xl:px-16">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
              className="mx-auto mb-12 max-w-3xl text-center sm:mb-14 lg:mb-16"
            >
              <motion.p
                variants={fadeUp}
                className="text-sm font-semibold uppercase tracking-[0.18em]"
                style={{ color: THEME.purple }}
              >
                ACCENTURE PRESENTATIONS
              </motion.p>

              <motion.h2
                variants={fadeUp}
                className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl"
                style={{ color: THEME.black }}
              >
                Explore Accenture Presentations
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="mx-auto mt-4 max-w-2xl text-sm leading-7 sm:text-base"
                style={{ color: THEME.textGray }}
              >
                View the Accenture 2-pager and presentation deck covering talent
                landscape, sourcing workflow, and OXYGLOBAL.TECH’s strategic
                partnership model.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-7 flex flex-wrap items-center justify-center gap-4"
              >
                <motion.button
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleOpenJobs}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition duration-300"
                  style={{
                    backgroundColor: THEME.purple,
                    color: THEME.white,
                  }}
                >
                  View Accenture Jobs Here
                  <ExternalLink size={16} />
                </motion.button>
              </motion.div>
            </motion.div>

            <div className="space-y-16 sm:space-y-20 lg:space-y-24">
              {presentations.map((item, index) => {
                const reverse = index % 2 === 1;
                const imageVariant = reverse ? fadeRight : fadeLeft;
                const contentVariant = reverse ? fadeLeft : fadeRight;
                const isPreviewOpen = openedPreviewId === item.id;

                return (
                  <div
                    key={item.id}
                    className="grid items-center gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20"
                  >
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      variants={imageVariant}
                      className={reverse ? "lg:order-2" : ""}
                    >
                      <div className="relative mx-auto w-full max-w-[560px]">
                        <div
                          className="overflow-hidden rounded-[16px] shadow-[0px_18px_40px_rgba(0,0,0,0.10)]"
                          style={{
                            border: `1px solid ${THEME.border}`,
                            backgroundColor: THEME.white,
                          }}
                        >
                          <div className="relative h-[260px] sm:h-[320px] md:h-[360px] lg:h-[400px] xl:h-[420px]">
                            <AnimatePresence mode="wait">
                              {!isPreviewOpen ? (
                                <motion.div
                                  key={`image-${item.id}`}
                                  variants={previewSwapVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  className="relative h-full w-full cursor-pointer"
                                  onClick={() => setOpenedPreviewId(item.id)}
                                >
                                  <img
                                    src={item.image}
                                    alt={item.imageAlt}
                                    className="h-full w-full object-cover object-center"
                                  />

                                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-4 py-4 sm:px-5 sm:py-5">
                                    <div className="min-w-0">
                                      <h4 className="mt-1 text-sm font-semibold text-white sm:text-base">
                                        {item.title}
                                      </h4>
                                    </div>

                                    <motion.button
                                      whileHover={{ y: -2, scale: 1.03 }}
                                      whileTap={{ scale: 0.96 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenedPreviewId(item.id);
                                      }}
                                      className="inline-flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-sm sm:text-sm"
                                      style={{
                                        backgroundColor: THEME.purple,
                                        color: THEME.white,
                                      }}
                                    >
                                      Open Preview
                                      <ExternalLink size={15} />
                                    </motion.button>
                                  </div>
                                </motion.div>
                              ) : (
                                <motion.div
                                  key={`pdf-${item.id}`}
                                  variants={previewSwapVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  className="relative h-full w-full"
                                  style={{ backgroundColor: THEME.lightBg }}
                                >
                                  <iframe
                                    src={item.embedLink}
                                    title={item.title}
                                    className="h-full w-full"
                                    allow="autoplay"
                                  />

                                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/75 via-black/25 to-transparent px-4 py-4 sm:px-5 sm:py-5">
                                    <div className="min-w-0">
                                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 sm:text-xs">
                                        Presentation Preview
                                      </p>
                                      <h4 className="mt-1 truncate text-sm font-semibold text-white sm:text-base">
                                        {item.title}
                                      </h4>
                                    </div>

                                    <div className="flex flex-shrink-0 items-center gap-2">
                                      <button
                                        onClick={() => setOpenedPreviewId(null)}
                                        className="rounded-full px-4 py-2 text-xs font-semibold sm:text-sm"
                                        style={{
                                          backgroundColor: THEME.white,
                                          color: THEME.black,
                                        }}
                                      >
                                        Back
                                      </button>

                                      <button
                                        onClick={() =>
                                          setSelectedPresentation(item)
                                        }
                                        className="rounded-full px-4 py-2 text-xs font-semibold sm:text-sm"
                                        style={{
                                          backgroundColor: THEME.purple,
                                          color: THEME.white,
                                        }}
                                      >
                                        Full View
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      variants={staggerContainer}
                      className={`${reverse ? "lg:order-1" : ""} px-1 sm:px-2 lg:px-0`}
                    >
                      <motion.div variants={contentVariant}>
                        <p
                          className="text-[11px] font-semibold uppercase tracking-[0.18em] sm:text-xs md:text-sm"
                          style={{ color: THEME.purple }}
                        >
                          {item.subtitle}
                        </p>
                      </motion.div>

                      <motion.div variants={contentVariant}>
                        <h3
                          className="mt-3 max-w-[560px] text-2xl font-bold leading-tight sm:text-3xl md:text-[34px] lg:text-4xl"
                          style={{ color: THEME.black }}
                        >
                          {item.title}
                        </h3>
                      </motion.div>

                      <motion.div variants={contentVariant}>
                        <p
                          className="mt-5 max-w-[560px] text-sm leading-7 sm:text-base"
                          style={{ color: THEME.textGray }}
                        >
                          {item.description}
                        </p>
                      </motion.div>

                      <motion.div
                        variants={staggerContainer}
                        className="mt-6 space-y-4 sm:mt-7 sm:space-y-5"
                      >
                        {item.points.map((point, i) => (
                          <motion.div
                            key={i}
                            variants={itemFade}
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-start gap-3"
                          >
                            <div
                              className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full"
                              style={{ backgroundColor: THEME.purple }}
                            />
                            <p
                              className="text-sm leading-6 sm:text-[15px]"
                              style={{ color: THEME.textGray }}
                            >
                              {point}
                            </p>
                          </motion.div>
                        ))}
                      </motion.div>

                      <motion.div
                        variants={itemFade}
                        className="mt-8 flex flex-wrap gap-3 sm:mt-9"
                      >
                        <motion.button
                          whileHover={{ y: -2, scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setSelectedPresentation(item)}
                          className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition duration-300"
                          style={{
                            backgroundColor: THEME.purple,
                            color: THEME.white,
                          }}
                        >
                          {item.buttonText}
                        </motion.button>

                        <motion.button
                          whileHover={{ y: -2, scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={handleOpenJobs}
                          className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition duration-300"
                          style={{
                            border: `1px solid ${THEME.purple}`,
                            color: THEME.purple,
                            backgroundColor: THEME.white,
                          }}
                        >
                          View Accenture Jobs
                          <ExternalLink size={16} />
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <AnimatePresence>
        {selectedPresentation && (
          <motion.div
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-3 py-4 sm:px-6 sm:py-6"
            onClick={() => setSelectedPresentation(null)}
          >
            <motion.div
              variants={modalContent}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="relative flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[18px] shadow-[0_20px_60px_rgba(0,0,0,0.28)]"
              style={{ backgroundColor: THEME.white }}
            >
              <div
                className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4"
                style={{ borderBottom: `1px solid ${THEME.border}` }}
              >
                <div className="min-w-0 pr-3">
                  <h3
                    className="truncate text-base font-semibold sm:text-lg"
                    style={{ color: THEME.black }}
                  >
                    {selectedPresentation.title}
                  </h3>
                  <p
                    className="mt-1 text-[12px] sm:text-[13px]"
                    style={{ color: THEME.softGray }}
                  >
                    Full presentation view
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={ACCENTURE_JOBS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden rounded-full px-4 py-2 text-sm font-medium transition sm:inline-flex"
                    style={{
                      border: `1px solid ${THEME.border}`,
                      color: THEME.purple,
                    }}
                  >
                    View Jobs
                  </a>

                  <a
                    href={selectedPresentation.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden rounded-full px-4 py-2 text-sm font-medium transition sm:inline-flex"
                    style={{
                      border: `1px solid ${THEME.border}`,
                      color: THEME.purple,
                    }}
                  >
                    Open in New Tab
                  </a>

                  <button
                    onClick={() => setSelectedPresentation(null)}
                    className="flex h-10 w-10 items-center justify-center rounded-full transition"
                    style={{
                      border: `1px solid ${THEME.border}`,
                      color: THEME.black,
                    }}
                    aria-label="Close modal"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div
                className="border-b px-4 py-2 sm:hidden"
                style={{ borderColor: THEME.border }}
              >
                <div className="flex flex-wrap gap-2">
                  <a
                    href={ACCENTURE_JOBS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full px-4 py-2 text-xs font-medium"
                    style={{
                      border: `1px solid ${THEME.border}`,
                      color: THEME.purple,
                    }}
                  >
                    View Jobs
                  </a>

                  <a
                    href={selectedPresentation.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full px-4 py-2 text-xs font-medium"
                    style={{
                      border: `1px solid ${THEME.border}`,
                      color: THEME.purple,
                    }}
                  >
                    Open in New Tab
                  </a>
                </div>
              </div>

              <div
                className="flex-1"
                style={{ backgroundColor: THEME.lightBg }}
              >
                <iframe
                  src={selectedPresentation.embedLink}
                  title={selectedPresentation.title}
                  className="h-full w-full"
                  allow="autoplay"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccenturePresentation;
