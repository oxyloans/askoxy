import React from "react";
import { motion } from "framer-motion";
import { FaLinkedinIn } from "react-icons/fa";

// Import images
import Radha from "../assets/img/radha sir.png";
import Rama from "../assets/img/rama mam.png";
import Sneha from "../assets/img/sneha.png";
import Subash from "../assets/img/subbu.png";
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

const OurPeople = () => {
  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      },
    },
  };

  // Animation variants for team cards
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Animation for the header underline
  const underlineVariants = {
    hidden: { width: 0 },
    visible: {
      width: "120px",
      transition: { duration: 0.8, delay: 0.4 },
    },
  };

  return (
    <section className="bg-gradient-to-b from-purple-50 to-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Header Section with improved styling */}
      <div className="text-center mb-16 md:mb-24">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-800 mb-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          Meet Our Executive Team
        </motion.h2>

        <div className="flex justify-center">
          <motion.div
            className="h-1.5 bg-purple-500 rounded-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={underlineVariants}
          ></motion.div>
        </div>

        <motion.p
          className="text-gray-600 mt-6 max-w-3xl mx-auto text-base sm:text-lg md:text-xl font-normal px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          The visionary leaders who combine decades of expertise to drive
          innovation and excellence in everything we do.
        </motion.p>
      </div>

      {/* Team Members Grid with improved responsiveness */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            variants={cardVariants}
            whileHover={{
              y: -8,
              transition: { duration: 0.3 },
            }}
          >
            {/* Profile Image with gradient overlay */}
            <div className="relative overflow-hidden h-64 sm:h-72">
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
              <motion.div
                className="w-full h-full"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover object-center object-top"
                  loading="lazy"
                />
              </motion.div>
            </div>

            {/* Info Card with improved styling */}
            <div className="p-5 sm:p-6 text-center">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">
                {member.name}
              </h3>
              <p className="text-purple-600 font-medium text-sm mb-4">
                {member.role}
              </p>

              {/* LinkedIn Link with better styling and accessibility */}
              <a
                href={member.linkedin}
                className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-50 text-indigo-600 hover:text-white hover:bg-indigo-600 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label={`${member.name}'s LinkedIn Profile`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn className="text-lg sm:text-xl" />
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default OurPeople;
