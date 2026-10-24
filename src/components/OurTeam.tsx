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
    role: "Co-Founder & CEO",
    img: Radha,
    linkedin: "https://www.linkedin.com/in/oxyradhakrishna/",
    bio: "Visionary leader driving innovation in AI and digital transformation with over 15 years of experience in technology and strategy.",
  },
  {
    name: "Ramadevi.T",
    role: "Co-Founder & CTO",
    img: Rama,
    linkedin: "https://www.linkedin.com/in/ramadevi-thatavarti/",
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
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-2xl mb-10 sm:mb-12 lg:mb-16 mx-auto text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-3 sm:mb-4">
            Our Leadership Team
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Passionate innovators driving AI-powered transformation with
            expertise, dedication, and a shared vision for the future.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 lg:gap-x-12 gap-y-12 sm:gap-y-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        >
          {teamMembers.map((member, index) => (
            <motion.a
              key={member.name}
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.1 + index * 0.05,
                ease: "easeOut",
              }}
              whileHover={{ y: -4 }}
              className="group flex flex-col items-center text-center cursor-pointer transition-transform duration-200"
              aria-label={`${member.name} - ${member.role}`}
            >
              {/* Circular Avatar with LinkedIn hover overlay */}
              <div className="relative w-40 h-40 sm:w-44 sm:h-44 lg:w-48 lg:h-48 rounded-full overflow-hidden bg-gradient-to-b from-slate-100 to-slate-200 shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
                <img
                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  src={member.img}
                  alt={member.name}
                  loading="lazy"
                />

                {/* LinkedIn Overlay on Hover */}
                <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-[#0A66C2] transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <FaLinkedinIn className="w-5 h-5" />
                  </span>
                </div>
              </div>

              {/* Member Details */}
              <div className="mt-5 sm:mt-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight transition-colors duration-200 group-hover:text-blue-600">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm sm:text-base font-medium text-[#4b6b94]">
                  {member.role}
                </p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default OurPeople;
