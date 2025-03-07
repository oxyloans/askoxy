import React from "react";
import { motion } from "framer-motion";
import { FaLinkedinIn } from "react-icons/fa";

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
    linkedin: "https://www.linkedin.com/in/narendra-kumar-balijepalli-bb4a96129/",
  },
  {
    name: "Umamaheswara Rao",
    role: "Co-Founder",
    img: Umamaheswara,
    linkedin: "https://www.linkedin.com/in/umamaheswara",
  },
];

const OurPeople = () => {
  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for team cards
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Animation for the header underline
  const underlineVariants = {
    hidden: { width: 0 },
    visible: { 
      width: "120px",
      transition: { duration: 0.8, delay: 0.3 }
    },
  };

  return (
    <section className="bg-gradient-to-b from-purple-50 to-white shadow-lg py-12 px-4 md:px-8">
      {/* Header Section with improved styling */}
      <div className="text-center mb-20">
        <motion.div
          className="inline-block relative mb-2"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
         
        </motion.div>
        
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-purple-700 mb-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Meet Our Executive Team
        </motion.h2>
        
        <motion.div 
          className="h-1.5 bg-purple-400 mx-auto rounded-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={underlineVariants}
        ></motion.div>
        
        <motion.p
          className="text-gray-600 mt-6 max-w-3xl mx-auto text-lg md:text-xl font-normal"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          The visionary leaders who combine decades of expertise to drive innovation and excellence in everything we do.
        </motion.p>
      </div>

      {/* Team Members Section with improved card design */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl overflow-hidden shadow-lg group"
            variants={cardVariants}
            whileHover={{
              y: -10,
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
              transition: { duration: 0.3 }
            }}
          >
            {/* Profile Image with improved cropping */}
            <div className="relative overflow-hidden h-72">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
              <motion.div
                className="w-full h-full"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover object-center object-top"
                />
              </motion.div>
            </div>

            {/* Info Card with improved styling */}
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">
                {member.name}
              </h3>
              <p className="text-purple-600 font-medium text-sm mb-5">
                {member.role}
              </p>
              
              {/* LinkedIn Link with better styling */}
              <a
                href={member.linkedin}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 hover:text-white hover:bg-indigo-600 transition-all duration-300 transform group-hover:scale-110"
                aria-label={`${member.name} on LinkedIn`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn className="text-xl" />
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default OurPeople;