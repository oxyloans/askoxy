import React from "react";
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
    <div className="px-4 py-10 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
        
        <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
          {/* <span className="relative inline-block">
            <svg
              viewBox="0 0 52 24"
              fill="currentColor"
              className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
            >
              <defs>
                <pattern id="pattern-1" x="0" y="0" width=".135" height=".30">
                  <circle cx="1" cy="1" r=".7" />
                </pattern>
              </defs>
              <rect fill="url(#pattern-1)" width="52" height="24" />
            </svg>
            <span className="relative">Meet</span>
          </span>{" "} */}
          our leadership team
        </h2>
        <p className="text-base text-gray-700 md:text-lg">
          Passionate innovators driving AI-powered transformation with
          expertise, dedication, and a shared vision for the future.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {teamMembers.map((member) => (
          <div
            key={member.name}
            className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 bg-white"
          >
            <img
              className="object-cover w-full h-64 md:h-72 lg:h-80 transition-transform duration-500 group-hover:scale-110"
              src={member.img}
              alt={member.name}
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100 px-6 text-center">
              <div className="transform translate-y-8 transition-transform duration-500 group-hover:translate-y-0">
                <h3 className="text-2xl font-bold text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-teal-300 font-medium mb-3">{member.role}</p>
                <p className="text-sm text-gray-200 leading-relaxed max-w-xs mx-auto mb-6">
                  {member.bio}
                </p>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full hover:bg-teal-500 transition-all duration-300"
                >
                  <FaLinkedinIn className="w-6 h-6 text-white" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurPeople;
