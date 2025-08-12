import React from "react";
import { motion } from "framer-motion";
import { FaLinkedinIn } from "react-icons/fa";

// Images
import Radha from "../assets/img/radha sir.png";
import Rama from "../assets/img/rama mam.png";
import Sneha from "../assets/img/sneha.png";
import Subash from "../assets/img/subbu.png";
import Chakri from "../assets/img/Chakri.jpg";
import Srinivas from "../assets/img/srinivas.png";
import Ramesh from "../assets/img/ramesh.png";
import Narendra from "../assets/img/narendra.png";
import Umamaheswara from "../assets/img/mahesh.png";

const teamMembers = [
  {
    name: "RadhaKrishna.T",
    role: "CEO & Co-Founder",
    img: Radha,
    linkedin: "https://www.linkedin.com/in/oxyradhakrishna/",
  },
  {
    name: "Ramadevi.T",
    role: "Co-Founder",
    img: Rama,
    linkedin: "https://www.linkedin.com/in/ramadevi-thatavarti-969828284/",
  },
  {
    name: "Subhash.S",
    role: "Co-Founder",
    img: Subash,
    linkedin: "https://www.linkedin.com/in/ssure/",
  },
  {
    name: "Jags (Chakravarthy) Chinnam ",
    role: "AI Transformation Leader",
    img: Chakri,
    linkedin: "https://www.linkedin.com/in/jc-cv/",
  },
  {
    name: "Snehalatha Reddy",
    role: "Co-Founder",
    img: Sneha,
    linkedin: "https://www.linkedin.com/in/sneha-soma-18681a19b/",
  },
  {
    name: "Yadavalli Srinivas",
    role: "Co-Founder",
    img: Srinivas,
    linkedin: "https://www.linkedin.com/in/yadavallisrinivas/",
  },
  {
    name: "Ramesh.R",
    role: "Co-Founder",
    img: Ramesh,
    linkedin: "https://www.linkedin.com/in/k-ramesh-reddy-a2150b15/",
  },
  {
    name: "Narendra Kumar",
    role: "Co-Founder",
    img: Narendra,
    linkedin:
      "https://www.linkedin.com/in/narendra-kumar-balijepalli-bb4a96129/",
  },
  {
    name: "Umamaheswara Rao",
    role: "Co-Founder",
    img: Umamaheswara,
    linkedin: "https://www.linkedin.com/in/umamaheswara",
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const OurPeople: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-purple-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <motion.div
        className="text-center max-w-3xl mx-auto mb-12"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-4xl font-extrabold text-purple-900 mb-3 select-none">
          Meet Our Executive Team
        </h2>
        <div className="mx-auto mb-5 w-32 h-1.5 rounded-full bg-gradient-to-r from-purple-700 via-indigo-700 to-pink-600"></div>
        <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
          The visionary leaders driving innovation and excellence at Oxy Group.
        </p>
      </motion.div>

      {/* Team Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {teamMembers.map(({ name, role, img, linkedin }, idx) => (
          <motion.article
            key={idx}
            className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 focus-within:ring-4 focus-within:ring-indigo-400 outline-none"
            tabIndex={0}
            aria-label={`${name}, ${role}`}
            variants={cardVariants}
          >
            {/* Image */}
            <div className="relative h-64 overflow-hidden rounded-t-3xl">
              <img
                src={img}
                alt={`${name} portrait`}
                loading="lazy"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none rounded-t-3xl"></div>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {name}
              </h3>
              <p className="text-indigo-700 text-sm mb-4">{role}</p>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`LinkedIn profile of ${name}`}
                className="inline-flex items-center justify-center mx-auto w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
};

export default OurPeople;
