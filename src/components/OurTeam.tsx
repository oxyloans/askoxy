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
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.4, 
              delay: 0.3 + (index * 0.05), 
              ease: "easeOut" 
            }}
            whileHover={{ 
              y: -8, 
              transition: { duration: 0.2, ease: "easeOut" } 
            }}
            className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl bg-white"
          >
            <img
              className="object-cover w-full h-48 sm:h-56 md:h-64 lg:h-72 transition-transform duration-300 group-hover:scale-105"
              src={member.img}
              alt={member.name}
              loading="lazy"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100 px-4 sm:px-6 text-center">
              <motion.div 
                className="transform translate-y-6 transition-transform duration-300 group-hover:translate-y-0"
                initial={{ y: 20 }}
                whileHover={{ y: 0 }}
              >
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-1 sm:mb-2">
                  {member.name}
                </h3>
                <p className="text-teal-300 font-medium mb-2 sm:mb-3 text-xs sm:text-sm">
                  {member.role}
                </p>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-xs mx-auto mb-4 sm:mb-6 line-clamp-3">
                  {member.bio}
                </p>
                <motion.a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full hover:bg-teal-500 transition-all duration-300"
                >
                  <FaLinkedinIn className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default OurPeople;
