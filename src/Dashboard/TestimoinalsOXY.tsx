import React, { useState, useEffect } from "react";
import I1 from "../assets/img/testimonial1.png";
import I2 from "../assets/img/testimonial2.png";
import I3 from "../assets/img/testimonial3.png";
import I4 from "../assets/img/testimonial4.png";
import I5 from "../assets/img/testimonial5.png";
import I6 from "../assets/img/testimonial6.png";
import I7 from "../assets/img/testimonial7.png";
import I8 from "../assets/img/testimonial8.png";
import I9 from "../assets/img/testimonial9.png";
import I10 from "../assets/img/testimonial10.png";
import I11 from "../assets/img/testimonial11.png";
import I12 from "../assets/img/testimonial12.png";
import I13 from "../assets/img/testimonial13.png";
import I14 from "../assets/img/testimonial14.png";
import I15 from "../assets/img/testimonial15.png";
import I16 from "../assets/img/testimonial16.png";
import I17 from "../assets/img/testimonial17.png";
import I18 from "../assets/img/testimonial18.png";
import I19 from "../assets/img/testimonial19.png";

// Placeholder for site logo
import oxyloansLogo from "../assets/img/image1.png";

import PL1 from "../assets/img/proudlender1.png";
import PL2 from "../assets/img/proudlender2.png";
import PL3 from "../assets/img/proudlender3.png";
import PL4 from "../assets/img/proudlender4.png";
import PL5 from "../assets/img/proudlender5.png";
import PL6 from "../assets/img/proudlender6.png";
import PL7 from "../assets/img/proudlender7.png";
import PL8 from "../assets/img/proudlender8.png";
import PL9 from "../assets/img/proudlender9.png";
import PL10 from "../assets/img/proudlender10.png";
import PL11 from "../assets/img/proudlender11.png";
import PL12 from "../assets/img/proudlender12.png";
import PL13 from "../assets/img/proudlender13.png";
import PL14 from "../assets/img/proudlender14.png";
import PL15 from "../assets/img/proudlender15.png";

// Define TypeScript interfaces
interface Testimonial {
  id: string;
  author: string;
  quote: string;
  image?: string;
  video?: string;
  type: "photo" | "video" | "both";
}

interface VideoTestimonial {
  id: string;
  video: string;
  title?: string;
}

interface ProudLender {
  id: string;
  name: string;
  image: string;
}

const TestimonialsPage: React.FC = () => {
  // State variables
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [videoTestimonials, setVideoTestimonials] = useState<
    VideoTestimonial[]
  >([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"video" | "photo">("video");
  const [filteredTestimonials, setFilteredTestimonials] = useState<
    Testimonial[]
  >([]);
  const [proudLenders, setProudLenders] = useState<ProudLender[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sample testimonial data
  useEffect(() => {
    const sampleTestimonials: Testimonial[] = [
      {
        id: "testimonial1",
        author: "Aruna Videla",
        quote:
          "Oxyloans is best P2P lending platform in India. They are exceptionally proficient and genuine. I have been Investing in Oxyloans from past couple of years and getting great returns for my Investment best in the market. Radha garu has great insight in obtaining the borrowers and developing the organization bigger. The Oxyloans Team are very user friendly and approachable to resolve our queries quickly. Very good peer to peer lending services in Hyderabad. Much thanks to you Oxyloans for offering fantastic types of assistance.",
        image: I1,
        type: "photo",
      },
      {
        id: "testimonial2",
        author: "Praveen Rayapudi",
        quote:
          "I am with oxyloans from past 2 years, it was a wonderful journey had earned very good return for the investment. The team is wonderful and they keep launching innovative and new deals regularly, Variety of deals cater to different types of investors each one can choose the best based on their need and risk taking ability. Actually this should be rated as 10.",
        image: I2,
        type: "photo",
      },
      {
        id: "testimonial4",
        author: "Manoj Sharma",
        quote:
          "What I like about OXYLOANS is that customers profit is their main aim. And that too not small profit as seen on other P2P lending platforms. The OXYLOANS company try their best to make our investment safe. Its not a just a company its a community. Long way to go.",
        image: I3,
        type: "photo",
      },
      {
        id: "testimonial5",
        author: "Sudheer Kumar Vakkalagadda",
        quote:
          "Positive: Professionalism, Quality, Responsiveness, Value I am personally lending with Oxyloans from the last couple of years. Everyone from Oxyloans team are highly transparent, professional, very responsive. I have also referred my friends and they are lending to people who are in need and getting benefited. Thank you Radha garu for providing such a great platform for us. Highly satisfied. All the very best to the Oxyloans team.",
        image: I4,
        type: "photo",
      },
      {
        id: "testimonial7",
        author: "Vijaykanth Kothapalli",
        quote:
          "Positive: Professionalism. Student deals are awesome. Effective teamwork and coordination makes it easy to track.",
        image: I5,
        type: "photo",
      },
      {
        id: "testimonial10",
        author: "Venu Kuchipudi",
        quote:
          "OXYLOANS team is very professional and responsive and mainly transperent which is missing mostly in other businesses today. CEO Mr. Radha Krishna Garu is working very hard to take the company to next level with good partnership firms and he has a very good knowledge on economics. I admire leadership skills of Radha garu on P2P business.",
        image: I6,
        type: "photo",
      },
      {
        id: "testimonial11",
        author: "Ravi Rao",
        quote:
          "As a user of OxyLoans. I have been very satisfied and happy. It has been a very rewarding experience for me",
        image: I7,
        type: "photo",
      },
      {
        id: "testimonial12",
        author: "Krishna Velguri",
        quote:
          "Positive: Professionalism, Quality, Responsiveness, Value. I like OxyLoans because they provide the best interest rates in the current market and friendly customer services. Radha garu has deep knowledge in procuring the borrowers and growing the company bigger. I wish all the best to the team to grow much better and win win to everyone. This is my Third month experience and wish to buildup longer relationship.",
        image: I8,
        type: "photo",
      },
      {
        id: "testimonial13",
        author: "Sreenivasa Rao Yenduri",
        quote:
          "FinTech start-ups drive the future of World Economy. I am proud to Invest in OxyLoans",
        image: I9,
        type: "photo",
      },
      {
        id: "testimonial14",
        author: "Ganesh Rayapudi",
        quote:
          "FinTech start-ups drive the future of World Economy. I am happy to be part of OxyLoans Advisory Team",
        image: I10,
        type: "photo",
      },
      {
        id: "testimonial15",
        author: "Hansel Barboza",
        quote:
          "I am happy to be part of FinTech start-up, OxyLoans. P2P Loans are the future of Lending and Borrowing.",
        image: I11,
        type: "photo",
      },
      {
        id: "testimonial16",
        author: "Sreedhar Reddy",
        quote:
          "I am happy to be part of FinTech start-up, OxyLoans. P2P Loans are the Future of Lending and Borrowing.",
        image: I12,
        type: "photo",
      },
      {
        id: "testimonial17",
        author: "HS Teji",
        quote:
          "FinTech startups are enablers for a futuristic simplified World Economy. I am delighted to be a part of the OxyLoans Advisory Team",
        image: I13,
        type: "photo",
      },
      {
        id: "testimonial18",
        author: "Nalluri Subbarao",
        quote:
          "FinTech start-ups drive the future of World Economy. I am proud to Invest in OxyLoans.",
        image: I15,
        type: "photo",
      },
      {
        id: "testimonial19",
        author: "Sesha Soma",
        quote:
          "I am happy to be part of FinTech start-up, OxyLoans. P2P Loans are the Future of Lending and Borrowing.",
        image: I16,
        type: "photo",
      },
      {
        id: "testimonial20",
        author: "Pravallika Kadiveti",
        quote: "I invested in OxyLoans. I trust OxyLoans",
        image: I17,
        type: "photo",
      },
      {
        id: "testimonial21",
        author: "Sama Srinivas",
        quote: "I invested in OxyLoans. I trust OxyLoans",
        image: I18,
        type: "photo",
      },
      {
        id: "testimonial22",
        author: "Karthyic Subramanian",
        quote:
          "FinTech start-ups drive the future of World Economy. I am happy to be part of OxyLoans Advisory Team.",
        image: I19,
        type: "photo",
      },
    ];

    // Updated video testimonials with titles
    const sampleVideoTestimonials: VideoTestimonial[] = [
      {
        id: "video1",
        video:
          "https://drive.google.com/file/d/1NIu_P7fmWJIowW1tacrTJxfETsP2NYQy/view",
        title: "Investor Testimonial 1",
      },
      {
        id: "video2",
        video:
          "https://drive.google.com/file/d/11WZs1FvUf2fNxhxFuzsHeCPWH5BYv5J5/view",
        title: "Investor Testimonial 2",
      },
      {
        id: "video3",
        video:
          "https://drive.google.com/file/d/11GNSs2OzekLOatlo0iCzGUF_dP02D3YU/view",
        title: "Investor Success Story",
      },
      {
        id: "video4",
        video:
          "https://drive.google.com/file/d/12N3JhYOiSqgAJfHCvoKzPBG3Vq20PrI2/view",
        title: "Partner Experience",
      },
      {
        id: "video5",
        video:
          "https://drive.google.com/file/d/1upuoCQs32SqVfECMqOuWWgOomd3fUMxc/view",
        title: "Long-term Investor Review",
      },
      {
        id: "video6",
        video:
          "https://drive.google.com/file/d/1Tt44QRGt8qp-s04Hv09PsYN2eiWQXP4W/view",
        title: "Client Success Story",
      },
      {
        id: "video7",
        video:
          "https://drive.google.com/file/d/12Rz5W0kPmMJfTZqa4RCa0ByR_h7gvXu6/view",
        title: "New Investor Experience",
      },
    ];

    // Sample proud lenders data
    const sampleProudLenders: ProudLender[] = [
      { id: "pl1", name: "N V Srihari chandana Tatavarthi", image: PL1 },
      { id: "pl2", name: "Vijaya kumari Iyatha", image: PL2 },
      { id: "pl3", name: "Pavan kumar Ch", image: PL3 },
      { id: "pl4", name: "Naga Uday Kasu", image: PL4 },
      { id: "pl5", name: "Raman Kumar Kaja", image: PL5 },
      { id: "pl6", name: "Himabindu Vallamkondu", image: PL6 },
      { id: "pl7", name: "Kiran Kumar", image: PL7 },
      { id: "pl8", name: "Murali Krishna", image: PL8 },
      { id: "pl9", name: "Padma Grandhe", image: PL9 },
      { id: "pl10", name: "Pream Kumar", image: PL10 },
      { id: "pl11", name: "Raja Emmadi", image: PL11 },
      { id: "pl12", name: "Rajasekhar", image: PL12 },
      { id: "pl13", name: "Sreenivas Reddy", image: PL13 },
      { id: "pl14", name: "Srinkanth", image: PL14 },
      { id: "pl15", name: "Deepthi Javvaji", image: PL15 },
    ];

    setTestimonials(sampleTestimonials);
    setVideoTestimonials(sampleVideoTestimonials);
    setProudLenders(sampleProudLenders);
  }, []);

  // Filter testimonials based on active tab
  useEffect(() => {
    if (activeTab === "photo") {
      setFilteredTestimonials(testimonials);
    }
    setCurrentIndex(0);
  }, [activeTab, testimonials]);

  // Handle slide transitions with animation
  const changeSlide = (newIndex: number) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrentIndex(newIndex);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Navigation functions
  const showPreviousTestimonial = () => {
    if (currentIndex > 0) {
      changeSlide(currentIndex - 1);
    }
  };

  const showNextTestimonial = () => {
    if (
      activeTab === "photo" &&
      currentIndex < filteredTestimonials.length - 1
    ) {
      changeSlide(currentIndex + 1);
    } else if (
      activeTab === "video" &&
      currentIndex < videoTestimonials.length - 1
    ) {
      changeSlide(currentIndex + 1);
    }
  };

  const goToTestimonial = (index: number) => {
    changeSlide(index);
  };

  // Auto rotate only video testimonials
  useEffect(() => {
    if (activeTab === "video") {
      const interval = setInterval(() => {
        if (currentIndex < videoTestimonials.length - 1) {
          showNextTestimonial();
        } else {
          setCurrentIndex(0);
        }
      }, 7000); // Change every 7 seconds

      return () => clearInterval(interval);
    }
  }, [currentIndex, activeTab, videoTestimonials.length]);

  // Determine whether to show navigation buttons
  const canGoBack = currentIndex > 0;
  const canGoForward =
    activeTab === "photo"
      ? currentIndex < filteredTestimonials.length - 1
      : currentIndex < videoTestimonials.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with sticky option */}
        <header className="text-center mb-8 sticky top-0 z-10 py-4 bg-blue-50/80 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <a href="https://oxyloans.com/" className="inline-block">
              <img
                src={oxyloansLogo}
                alt="OxyLoans Logo"
                className="h-24 mx-auto transform transition-transform hover:scale-105"
              />
            </a>
            <div className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              Earn up to 1.75% Monthly ROI • 24% P.A.
            </div>
          </div>
        </header>

        {/* Page Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            What Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Investors
            </span>{" "}
            Say
          </h1>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto">
            Discover why thousands of investors trust OxyLoans for consistent
            returns and exceptional service
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1.5 shadow-lg">
            <button
              onClick={() => setActiveTab("video")}
              className={`px-8 py-3 rounded-full font-medium text-lg transition-all duration-300 ${
                activeTab === "video"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Videos
            </button>
            <button
              onClick={() => setActiveTab("photo")}
              className={`px-8 py-3 rounded-full font-medium text-lg transition-all duration-300 ${
                activeTab === "photo"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Photos
            </button>
          </div>
        </div>

        {/* Testimonials Container */}
        {activeTab === "photo" && filteredTestimonials.length > 0 ? (
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden mb-12">
            <div className="p-6 md:p-12">
              {/* Testimonial Content */}
              <div className="flex flex-col md:flex-row gap-10">
                {/* Media Section */}
                <div className="md:w-1/2">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                    <img
                      src={filteredTestimonials[currentIndex].image}
                      alt={filteredTestimonials[currentIndex].author}
                      className="relative w-full object-cover rounded-2xl shadow-lg transform transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </div>

                {/* Text Section */}
                <div className="md:w-1/2 flex flex-col justify-center">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-2 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-full mr-4"></div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                      {filteredTestimonials[currentIndex]?.author}
                    </h3>
                  </div>

                  <blockquote className="text-gray-700 text-lg md:text-xl mb-8 relative pl-8 border-l-4 border-blue-500">
                    <svg
                      className="absolute top-0 left-0 h-6 w-6 text-blue-400 transform -translate-x-3 -translate-y-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {/* Quote icon commented out */}
                    </svg>
                    <p className="italic font-light">
                      "{filteredTestimonials[currentIndex]?.quote}"
                    </p>
                  </blockquote>

                  {/* Rating Stars */}
                  <div className="flex items-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-6 w-6 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="bg-gray-100 h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2 transition-all duration-500 ease-in-out"
                style={{
                  width: `${
                    ((currentIndex + 1) / filteredTestimonials.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        ) : activeTab === "video" && videoTestimonials.length > 0 ? (
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden mb-12">
            <div className="p-6 md:p-12">
              {/* Video title */}
              <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {videoTestimonials[currentIndex].title ||
                  `Video Testimonial ${currentIndex + 1}`}
              </h3>

              {/* Video content */}
              <div className="relative group mb-4">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative rounded-2xl shadow-lg overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={videoTestimonials[currentIndex].video.replace(
                        "view",
                        "preview"
                      )}
                      title={`Video testimonial ${currentIndex + 1}`}
                      className="w-full h-96 border-0"
                      allowFullScreen
                      allow="autoplay"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="bg-gray-100 h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2 transition-all duration-500 ease-in-out"
                style={{
                  width: `${
                    ((currentIndex + 1) / videoTestimonials.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-2xl p-10 text-center mb-12">
            <p className="text-gray-600 text-xl">
              No testimonials available for this tab.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mb-20">
          <button
            onClick={showPreviousTestimonial}
            disabled={!canGoBack || isAnimating}
            className={`px-8 py-4 rounded-full font-bold shadow-md transition-all duration-300 ${
              canGoBack && !isAnimating
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-xl transform hover:-translate-y-1"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            aria-label="Previous testimonial"
          >
            <span className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
              Previous
            </span>
          </button>

          <div className="hidden md:flex gap-2 items-center">
            {activeTab === "photo"
              ? filteredTestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentIndex === index
                        ? "bg-blue-600 transform scale-150"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))
              : videoTestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentIndex === index
                        ? "bg-blue-600 transform scale-150"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to video testimonial ${index + 1}`}
                  />
                ))}
          </div>

          <button
            onClick={showNextTestimonial}
            disabled={!canGoForward || isAnimating}
            className={`px-8 py-4 rounded-full font-bold shadow-md transition-all duration-300 ${
              canGoForward && !isAnimating
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-xl transform hover:-translate-y-1"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            aria-label="Next testimonial"
          >
            <span className="flex items-center">
              Next
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </span>
          </button>
        </div>

        {/* Proud Lenders Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">
            Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Proud Lenders
            </span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {proudLenders.map((lender) => (
              <div
                key={lender.id}
                className="w-full bg-white rounded-xl shadow-lg p-4 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <img
                  src={lender.image}
                  alt={lender.name}
                  className="w-150 h-400 object-cover mb-4 rounded-lg"
                />
                <h4 className="text-gray-800 font-medium text-center truncate">
                  {lender.name}
                </h4>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl shadow-2xl p-8 md:p-12 mb-16">
          <div className="text-center">
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Earning Higher Returns?
            </h2>
            <p className="text-white text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of satisfied investors and start earning monthly
              returns up to 1.75% with OxyLoans today.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-8">
              <a
                href="https://play.google.com/store/apps/details?id=com.oxyloans.lender"
                className="transition-transform hover:scale-105"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png"
                  alt="Google Play Store"
                  className="h-12"
                />
              </a>
              <a
                href="https://apps.apple.com/in/app/oxyloans-lender/id6444208708"
                className="transition-transform hover:scale-105"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="App Store"
                  className="h-12"
                />
              </a>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://oxyloans.com/signup"
                className="bg-white text-blue-600 font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Go To OxyLoans
              </a>
              <a
                href="https://oxyloans.com/how-it-works"
                className="bg-transparent text-white border-2 border-white font-bold px-8 py-4 rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Learn How It Works
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;
