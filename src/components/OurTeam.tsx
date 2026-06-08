import React from "react";
import { motion } from "framer-motion";
import { FaLinkedinIn } from "react-icons/fa";

// Images
import Radha from "../assets/img/radha sir.png";
import Rama from "../assets/img/rama mam.png";
import Sneha from "../assets/img/sneha.png";
import Subash from "../assets/img/subbu.png";
import Chakri from "../assets/img/jags.png";
import Srinivas from "../assets/img/yadavalli srinivas.png";
import Ramesh from "../assets/img/ramesh.png";
import Narendra from "../assets/img/narendra.png";

const teamMembers = [
  {
    name: "RadhaKrishna.T",
    role: "CEO & Co-Founder",
    img: Radha,
    linkedin: "https://www.linkedin.com/in/oxyradhakrishna/",
    bio: "Visionary leader driving innovation in AI and digital transformation with over 15 years of experience in technology and strategy.",
  },
  {
    name: "Ramadevi.T",
    role: "Co-Founder",
    img: Rama,
    linkedin: "https://www.linkedin.com/in/ramadevi-thatavarti-969828284/",
    bio: "Strategic thinker passionate about building sustainable business models and fostering growth through people-centric leadership.",
  },
  {
    name: "Subhash.S",
    role: "Co-Founder",
    img: Subash,
    linkedin: "https://www.linkedin.com/in/ssure/",
    bio: "Technology enthusiast focused on scalable architecture, cloud solutions, and delivering enterprise-grade AI systems.",
  },
  {
    name: "Jagadeesh Chinnam",
    role: "AI Transformation Leader",
    img: Chakri,
    linkedin: "https://www.linkedin.com/in/jc-cv/",
    bio: "Expert in AI strategy and implementation, helping organizations adopt machine learning and generative AI for competitive advantage.",
  },
  {
    name: "Snehalatha Reddy",
    role: "Co-Founder",
    img: Sneha,
    linkedin: "https://www.linkedin.com/in/sneha-soma-18681a19b/",
    bio: "Driving operational excellence and innovation with deep expertise in project management and team empowerment.",
  },
  {
    name: "Yadavalli Srinivas",
    role: "Co-Founder",
    img: Srinivas,
    linkedin: "https://www.linkedin.com/in/yadavallisrinivas/",
    bio: "Seasoned entrepreneur with a strong foundation in software engineering and a passion for solving real-world problems using AI.",
  },
  {
    name: "Ramesh.R",
    role: "Co-Founder",
    img: Ramesh,
    linkedin: "https://www.linkedin.com/in/k-ramesh-reddy-a2150b15/",
    bio: "Business strategist and technologist bridging the gap between cutting-edge AI research and practical business applications.",
  },
  {
    name: "Narendra Kumar",
    role: "Co-Founder",
    img: Narendra,
    linkedin:
      "https://www.linkedin.com/in/narendra-kumar-balijepalli-bb4a96129/",
    bio: "Full-stack innovator specializing in AI integration, automation, and building intelligent systems that scale.",
  },
];

const OurPeople: React.FC = () => {
  return (
    <section className="px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 lg:py-10 mx-auto bg-white">
      <motion.div
        className="max-w-xl mb-6 sm:mb-8 lg:mb-10 md:mx-auto sm:text-center lg:max-w-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h2 className="max-w-lg mb-4 sm:mb-6 font-sans text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight tracking-tight text-gray-900 md:mx-auto">
          Our Leadership Team
        </h2>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          Passionate innovators driving AI-powered transformation with
          expertise, dedication, and a shared vision for the future.
        </p>
      </motion.div>

      <motion.div
        className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      >
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: 0.3 + index * 0.05,
              ease: "easeOut",
            }}
            whileHover={{
              y: -6,
              transition: { duration: 0.2, ease: "easeOut" },
            }}
            className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
          >
            <div className="relative w-full overflow-hidden bg-slate-100">
              <img
                className="object-contain w-full h-56 sm:h-64 md:h-72 lg:h-72"
                src={member.img}
                alt={member.name}
                loading="lazy"
              />
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm sm:text-base font-medium text-teal-600">
                    {member.role}
                  </p>
                </div>
                <motion.a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-teal-400 hover:bg-teal-500 hover:text-white"
                >
                  <FaLinkedinIn className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.a>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                {member.bio}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default OurPeople;
