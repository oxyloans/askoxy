// import React from "react";
// import { ArrowRight, BookOpen, Briefcase, Compass } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import RadhakrishnaImg from "../assets/img/radha sir.png";
// import { FaLinkedin } from "react-icons/fa";

// function HeroSection() {
//   const navigate = useNavigate();

//   const handleClick = () => {
//     const usecases = document.getElementById("usecases");
//     if (usecases) {
//       usecases.scrollIntoView({ behavior: "smooth" });
//     } else {
//       navigate("/glmshome");
//     }
//   };

//   const handleExploreBlogs = () => navigate("/myblogs");
//   const handleApplyJobs = () => navigate("/jobdetails");

//   return (
//     <section className="relative bg-gradient-to-tr from-white via-blue-50 to-purple-100 py-16 lg:py-24 overflow-hidden">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//         {/* LEFT CONTENT */}
//         <div className="space-y-6 text-center md:text-left animate-fade-in">
//           <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-snug">
//             <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
//               Global Lending Management System
//             </span>
//           </h1>

//           <p className="text-gray-700 text-base sm:text-lg leading-relaxed max-w-xl mx-auto md:mx-0">
//             Welcome to an intelligent platform revolutionizing global lending.
//             <br />
//             Built with <strong>60+ BFSI use cases</strong>,{" "}
//             <strong>50+ expert roles</strong>, and{" "}
//             <strong>AI-driven accelerators</strong>, this solution draws on
//             insights from <strong>FinOne</strong>, <strong>Temenos</strong>,{" "}
//             <strong>Finastra</strong>, and <strong>TCS BaNCS</strong>.
//             <br className="hidden sm:block" />
//             <strong>Mission:</strong> Empower BFSI firms with scalable AI-led
//             solutions & job-ready talent.
//           </p>

//           <ul className="text-left text-gray-700 space-y-1 pl-5 list-disc">
//             <li>✅ Accelerate digital transformation</li>
//             <li>
//               ✅ Upskill <strong>1 million BFSI professionals</strong>
//             </li>
//           </ul>

//           {/* CTA BUTTONS */}
//           <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start mt-6">
//             <button
//               onClick={handleClick}
//               className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-5 rounded-full flex items-center gap-2 shadow-md transition duration-300 w-full sm:w-auto"
//             >
//               <Compass className="w-4 h-4" />
//               Get Started
//               <ArrowRight className="w-4 h-4" />
//             </button>

//             <button
//               onClick={handleExploreBlogs}
//               className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium py-2.5 px-5 rounded-full flex items-center gap-2 shadow-md transition duration-300 w-full sm:w-auto"
//             >
//               <BookOpen className="w-4 h-4" />
//               Explore Blogs
//               <ArrowRight className="w-4 h-4" />
//             </button>

//             <button
//               onClick={handleApplyJobs}
//               className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2.5 px-5 rounded-full flex items-center gap-2 shadow-md transition duration-300 w-full sm:w-auto"
//             >
//               <Briefcase className="w-4 h-4" />
//               Apply Jobs
//               <ArrowRight className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         {/* RIGHT CONTENT */}
//         <div className="relative flex justify-center animate-slide-in">
//           <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-sm p-6 text-center space-y-5 z-10">
//             <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-full overflow-hidden bg-gradient-to-r from-blue-100 to-purple-100 shadow-md">
//               <img
//                 src={RadhakrishnaImg}
//                 alt="RadhaKrishna, CEO of GenOxy"
//                 className="w-full h-full object-cover rounded-full"
//               />
//             </div>
//             <div>
//               <h3 className="text-2xl font-bold text-gray-900">
//                 RadhaKrishna.T
//               </h3>
//               <p className="text-gray-600 text-md">CEO & Co-Founder</p>
//             </div>
//             <div className="flex justify-center">
//               <a
//                 href="https://www.linkedin.com/in/oxyradhakrishna/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 hover:text-blue-800 text-2xl transition"
//                 aria-label="LinkedIn profile of RadhaKrishna"
//               >
//                 <FaLinkedin />
//               </a>
//             </div>

//             {/* Decorative Blobs */}
//             <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-200 opacity-20 rounded-full z-0 blur-xl" />
//             <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-200 opacity-20 rounded-full z-0 blur-xl" />
//           </div>

//           {/* Abstract Shapes */}
//           <div className="hidden md:block absolute -bottom-6 right-4 w-24 h-24 bg-yellow-100 rounded-xl rotate-12 shadow-lg z-0 blur-sm" />
//           <div className="hidden md:block absolute top-12 -left-4 w-16 h-16 bg-green-100 rounded-full shadow-md z-0 blur-sm" />
//         </div>
//       </div>
//     </section>
//   );
// }

// export default HeroSection;





import React from "react";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Compass,
  Building2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();

  const handleClick = () => {
    const usecases = document.getElementById("usecases");
    if (usecases) {
      usecases.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/glmshome");
    }
  };

  const handleExploreBlogs = () => navigate("/myblogs");
  const handleApplyJobs = () => navigate("/jobdetails");

  return (
    <section className="bg-gradient-to-tr from-white via-blue-50 to-purple-100 py-20 px-6 sm:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left: GLMS Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col justify-between text-center md:text-left hover:shadow-xl transition-all duration-300 hover:scale-[1.015]">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <Building2 className="text-purple-700 w-7 h-7" />
              <h2 className="text-2xl font-extrabold text-gray-800">
                Global Lending Management System
              </h2>
            </div>
            <p className="text-gray-700 text-[15px] leading-relaxed">
              A powerful, AI-enabled platform tailored for the BFSI sector.
              Features over <strong>60+ industry use cases</strong>,{" "}
              <strong>50+ expert roles</strong>, and inspired by{" "}
              <strong>Temenos</strong>, <strong>Finastra</strong>,{" "}
              <strong>FinOne</strong>, and <strong>TCS BaNCS</strong>.
              <br />
              <br />
              <strong>Mission:</strong> Empower organizations to accelerate
              digital transformation and prepare{" "}
              <strong>1M+ professionals</strong> for BFSI jobs.
            </p>
          </div>

          <button
            onClick={handleClick}
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-all duration-300"
          >
            <Compass className="w-4 h-4" />
            Get Started
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Blogs */}
        <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col justify-between text-center hover:shadow-xl transition-all duration-300 hover:scale-[1.015]">
          <div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="text-pink-600 w-6 h-6" />
              <h2 className="text-2xl font-bold text-gray-800">Latest Blogs</h2>
            </div>
            <p className="text-gray-700 text-[15px] leading-relaxed">
              Dive into curated articles that explore the future of banking,
              financial tech innovations, AI strategies in lending, and
              professional insights from industry experts.
            </p>
          </div>

          <button
            onClick={handleExploreBlogs}
            className="mt-8 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-all duration-300"
          >
            <BookOpen className="w-4 h-4" />
            Read Blogs
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Jobs */}
        <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col justify-between text-center hover:shadow-xl transition-all duration-300 hover:scale-[1.015]">
          <div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Briefcase className="text-green-600 w-6 h-6" />
              <h2 className="text-2xl font-bold text-gray-800">Explore Jobs</h2>
            </div>
            <p className="text-gray-700 text-[15px] leading-relaxed">
              Discover job opportunities designed for AI-savvy BFSI
              professionals. Access tailored roles, apply directly, and
              accelerate your career in the evolving fintech ecosystem.
            </p>
          </div>

          <button
            onClick={handleApplyJobs}
            className="mt-8 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-all duration-300"
          >
            <Briefcase className="w-4 h-4" />
            View Jobs
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

