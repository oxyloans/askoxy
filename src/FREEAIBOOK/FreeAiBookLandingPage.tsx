import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

const images = [
 "https://i.ibb.co/xtnc5Bjw/book-99.png",
  "https://i.ibb.co/tT3w0Bmn/6-8-9-7-ASKOXY-AI-BOOK-images-0.jpg",
  "https://i.ibb.co/5X33rWT0/6-8-9-7-ASKOXY-AI-BOOK-images-1.jpg",
  "https://i.ibb.co/bgPnT2mW/6-8-9-7-ASKOXY-AI-BOOK-images-2.jpg",
  "https://i.ibb.co/JFrTzh6f/6-8-9-7-ASKOXY-AI-BOOK-images-3.jpg",
  "https://i.ibb.co/7dS6QRHs/6-8-9-7-ASKOXY-AI-BOOK-images-4.jpg",
  "https://i.ibb.co/1GpPSrg2/6-8-9-7-ASKOXY-AI-BOOK-images-5.jpg",
  "https://i.ibb.co/6cbG4PDf/6-8-9-7-ASKOXY-AI-BOOK-images-6.jpg",
  "https://i.ibb.co/Pz5RSRWy/6-8-9-7-ASKOXY-AI-BOOK-images-7.jpg",
  "https://i.ibb.co/7xvJXrmv/6-8-9-7-ASKOXY-AI-BOOK-images-8.jpg",
  "https://i.ibb.co/Cprh5mfK/6-8-9-7-ASKOXY-AI-BOOK-images-9.jpg",
  "https://i.ibb.co/CK7D4QG1/6-8-9-7-ASKOXY-AI-BOOK-images-10.jpg",
  "https://i.ibb.co/LXvTMdQD/6-8-9-7-ASKOXY-AI-BOOK-images-11.jpg",
  "https://i.ibb.co/MyMcjH0h/6-8-9-7-ASKOXY-AI-BOOK-images-12.jpg",
  "https://i.ibb.co/XZ2VzFgQ/6-8-9-7-ASKOXY-AI-BOOK-images-13.jpg",
  "https://i.ibb.co/jkryC3x4/6-8-9-7-ASKOXY-AI-BOOK-images-14.jpg",
  "https://i.ibb.co/whR03KjG/6-8-9-7-ASKOXY-AI-BOOK-images-15.jpg",
  "https://i.ibb.co/Pv6cRyV6/6-8-9-7-ASKOXY-AI-BOOK-images-16.jpg",
  "https://i.ibb.co/7xDBzhwr/6-8-9-7-ASKOXY-AI-BOOK-images-17.jpg",
  "https://i.ibb.co/d46dwyzQ/6-8-9-7-ASKOXY-AI-BOOK-images-18.jpg",
  "https://i.ibb.co/BDbzQ1N/6-8-9-7-ASKOXY-AI-BOOK-images-19.jpg",
  "https://i.ibb.co/1fm2hDFf/6-8-9-7-ASKOXY-AI-BOOK-images-20.jpg",
  "https://i.ibb.co/MkSwpL7f/6-8-9-7-ASKOXY-AI-BOOK-images-21.jpg",
  "https://i.ibb.co/mCLqjGK1/6-8-9-7-ASKOXY-AI-BOOK-images-22.jpg",
  "https://i.ibb.co/sdNbZ0Vv/6-8-9-7-ASKOXY-AI-BOOK-images-23.jpg",
  "https://i.ibb.co/vxT6v2Ts/6-8-9-7-ASKOXY-AI-BOOK-images-24.jpg",
  "https://i.ibb.co/zTDby58w/6-8-9-7-ASKOXY-AI-BOOK-images-25.jpg",
  "https://i.ibb.co/v6xbs6j0/6-8-9-7-ASKOXY-AI-BOOK-images-26.jpg",
  "https://i.ibb.co/GQPkD5bH/6-8-9-7-ASKOXY-AI-BOOK-images-27.jpg",
  "https://i.ibb.co/JWFvSccb/6-8-9-7-ASKOXY-AI-BOOK-images-28.jpg",
  "https://i.ibb.co/Ng9drLyB/6-8-9-7-ASKOXY-AI-BOOK-images-29.jpg",
  "https://i.ibb.co/DfsmBYWD/6-8-9-7-ASKOXY-AI-BOOK-images-30.jpg",
  "https://i.ibb.co/x8hMtc8N/6-8-9-7-ASKOXY-AI-BOOK-images-31.jpg",
  "https://i.ibb.co/7xGnPRdK/6-8-9-7-ASKOXY-AI-BOOK-images-32.jpg",
  "https://i.ibb.co/8nsdmFNH/6-8-9-7-ASKOXY-AI-BOOK-images-33.jpg",
  "https://i.ibb.co/NgjkfDrC/6-8-9-7-ASKOXY-AI-BOOK-images-34.jpg",
  "https://i.ibb.co/39kzTV71/6-8-9-7-ASKOXY-AI-BOOK-images-35.jpg",
  "https://i.ibb.co/GQrx4mj0/6-8-9-7-ASKOXY-AI-BOOK-images-36.jpg",
  "https://i.ibb.co/sd7g2X61/6-8-9-7-ASKOXY-AI-BOOK-images-37.jpg",
  "https://i.ibb.co/TMScMmR0/6-8-9-7-ASKOXY-AI-BOOK-images-38.jpg",
  "https://i.ibb.co/FT3FKVb/6-8-9-7-ASKOXY-AI-BOOK-images-39.jpg",
  "https://i.ibb.co/YB903bL5/6-8-9-7-ASKOXY-AI-BOOK-images-40.jpg",
  "https://i.ibb.co/C5XcgBqL/6-8-9-7-ASKOXY-AI-BOOK-images-41.jpg",
  "https://i.ibb.co/xSwxLW28/6-8-9-7-ASKOXY-AI-BOOK-images-42.jpg",
  "https://i.ibb.co/6JpZnZz2/6-8-9-7-ASKOXY-AI-BOOK-images-43.jpg",
  "https://i.ibb.co/gZp1PNnr/6-8-9-7-ASKOXY-AI-BOOK-images-44.jpg",
  "https://i.ibb.co/VYfYh2L3/6-8-9-7-ASKOXY-AI-BOOK-images-45.jpg",
  "https://i.ibb.co/DHGFcQJ4/6-8-9-7-ASKOXY-AI-BOOK-images-46.jpg",
  "https://i.ibb.co/Nd4MQ5pG/6-8-9-7-ASKOXY-AI-BOOK-images-47.jpg",
  "https://i.ibb.co/9HtnGWnx/6-8-9-7-ASKOXY-AI-BOOK-images-48.jpg",
  "https://i.ibb.co/VYtz6GrY/6-8-9-7-ASKOXY-AI-BOOK-images-49.jpg",
  "https://i.ibb.co/4Z3qzt11/6-8-9-7-ASKOXY-AI-BOOK-images-50.jpg",
  "https://i.ibb.co/bgq164rq/6-8-9-7-ASKOXY-AI-BOOK-images-51.jpg",
  "https://i.ibb.co/NnLPjLPg/6-8-9-7-ASKOXY-AI-BOOK-images-52.jpg",
  "https://i.ibb.co/Dft2RwFH/6-8-9-7-ASKOXY-AI-BOOK-images-53.jpg",
  "https://i.ibb.co/5XVXXvSd/6-8-9-7-ASKOXY-AI-BOOK-images-54.jpg",
  "https://i.ibb.co/qPm27L0/6-8-9-7-ASKOXY-AI-BOOK-images-55.jpg",
  "https://i.ibb.co/sp6KnZHz/6-8-9-7-ASKOXY-AI-BOOK-images-56.jpg",
  "https://i.ibb.co/TDXkpLg1/6-8-9-7-ASKOXY-AI-BOOK-images-57.jpg",
  "https://i.ibb.co/Fksrxzgz/6-8-9-7-ASKOXY-AI-BOOK-images-58.jpg",
  "https://i.ibb.co/35XnzTyQ/6-8-9-7-ASKOXY-AI-BOOK-images-59.jpg",
  "https://i.ibb.co/gZNLQ94f/6-8-9-7-ASKOXY-AI-BOOK-images-60.jpg",
  "https://i.ibb.co/GqftNzP/6-8-9-7-ASKOXY-AI-BOOK-images-61.jpg",
  "https://i.ibb.co/d4YVvJkd/6-8-9-7-ASKOXY-AI-BOOK-images-62.jpg",
  "https://i.ibb.co/5gcSPZMJ/6-8-9-7-ASKOXY-AI-BOOK-images-63.jpg",
  "https://i.ibb.co/VW5bQ0Vq/6-8-9-7-ASKOXY-AI-BOOK-images-64.jpg",
  "https://i.ibb.co/7JYjCLxX/6-8-9-7-ASKOXY-AI-BOOK-images-65.jpg",
  "https://i.ibb.co/Tx37Vhk2/6-8-9-7-ASKOXY-AI-BOOK-images-66.jpg",
  "https://i.ibb.co/M5VrZGZx/6-8-9-7-ASKOXY-AI-BOOK-images-67.jpg",
  "https://i.ibb.co/m5F4RpDv/6-8-9-7-ASKOXY-AI-BOOK-images-68.jpg",
  "https://i.ibb.co/wFLSJJ2x/6-8-9-7-ASKOXY-AI-BOOK-images-69.jpg",
  "https://i.ibb.co/zVWyQnP2/6-8-9-7-ASKOXY-AI-BOOK-images-70.jpg",
  "https://i.ibb.co/8n5GQjRB/6-8-9-7-ASKOXY-AI-BOOK-images-71.jpg",
  "https://i.ibb.co/Qj3Trv8S/6-8-9-7-ASKOXY-AI-BOOK-images-72.jpg",
  "https://i.ibb.co/60mSkxL4/6-8-9-7-ASKOXY-AI-BOOK-images-73.jpg",
  "https://i.ibb.co/MxdDKptH/6-8-9-7-ASKOXY-AI-BOOK-images-74.jpg",
  "https://i.ibb.co/ksTMYZxp/6-8-9-7-ASKOXY-AI-BOOK-images-75.jpg",
  "https://i.ibb.co/RpLs69tW/6-8-9-7-ASKOXY-AI-BOOK-images-76.jpg",
  "https://i.ibb.co/tT65xjvs/6-8-9-7-ASKOXY-AI-BOOK-images-77.jpg",
  "https://i.ibb.co/VYZvKdrB/6-8-9-7-ASKOXY-AI-BOOK-images-78.jpg",
  "https://i.ibb.co/TMxY0Q6s/6-8-9-7-ASKOXY-AI-BOOK-images-79.jpg",
  "https://i.ibb.co/G3TKjtPW/6-8-9-7-ASKOXY-AI-BOOK-images-80.jpg",
  "https://i.ibb.co/nMQDJtWJ/6-8-9-7-ASKOXY-AI-BOOK-images-81.jpg",
  "https://i.ibb.co/wZ5w0fnq/6-8-9-7-ASKOXY-AI-BOOK-images-82.jpg",
  "https://i.ibb.co/JFvQqZvL/6-8-9-7-ASKOXY-AI-BOOK-images-83.jpg",
  "https://i.ibb.co/HL56f16t/6-8-9-7-ASKOXY-AI-BOOK-images-84.jpg",
  "https://i.ibb.co/m51mBXzy/6-8-9-7-ASKOXY-AI-BOOK-images-85.jpg",
  "https://i.ibb.co/Xf6dGrtg/6-8-9-7-ASKOXY-AI-BOOK-images-86.jpg",
  "https://i.ibb.co/7xwC465Z/6-8-9-7-ASKOXY-AI-BOOK-images-87.jpg",
  "https://i.ibb.co/TBxjx7mY/book-1.png"
];

const FreeAiBook: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const param = searchParams.get("image");
  const initialIndex = param ? parseInt(param, 10) - 1 : 0;
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(() =>
    initialIndex >= 0 && initialIndex < images.length ? initialIndex : 0
  );
  
  // Preload images for smoother transitions
  useEffect(() => {
    const preloadImages = () => {
      const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
      [images[currentIndex], images[nextIndex], images[prevIndex]].forEach(
        (src) => {
          const img = new Image();
          img.src = src;
        }
      );
    };
    preloadImages();
  }, [currentIndex]);

  // Handle index change with loading state
  const changeIndex = useCallback((newIndex: number) => {
    setLoading(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setLoading(false);
    }, 300);
  }, []);
  const goNext = useCallback(() => {
    if (currentIndex < images.length - 1) changeIndex(currentIndex + 1);
  }, [currentIndex, changeIndex]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) changeIndex(currentIndex - 1);
  }, [currentIndex, changeIndex]);
  // Corresponding headings for each image (length 73)
  // const headings = [
  //   "ENTER THE AI UNIVERSE",
  //   "Index-1",
  //   "Index-2",
  //   "Index-3",
  //   "Index-4",
  //   "What is AI?",
  //   "What is Generative AI?",
  //   "Why Learn AI Now?",
  //   "How to Use This Book?",
  //   "Mission Million AI Coders: The Journey Begins",
  //   "What is Prompt Engineering?",
  //   "Popular Generative AI Tools",
  //   "Writing Great AI Prompt Instructions",
  //   "Think in Prompts — Not Just in Tasks",
  //   "A Good AI Prompt Engineer...",
  //   "AI Prompt Engineering Tips",
  //   "AI Prompt Engineering Kit",
  //   "Prompt Templates — Reuse, Remix, Repeat",
  //   "Your First 5 Prompts — Get Started Today",
  //   "Daily Prompting Habits: Build Your AI Muscle",
  //   "Chain of Thought Prompts",
  //   "Types of Prompts — Zero, One, and Few-Shot",
  //   "Role-Based Prompts",
  //   "Agent-Style Prompts",
  //   "Meta-Prompts",
  //   "Loops in AI and GenAI",
  //   "AI Loops",
  //   "Debugging in AI vs GenAI",
  //   "Prompting Mistakes to Avoid",
  //   "Prompt vs Completion: Understand the Difference",
  //   "Tone Variations",
  //   "Length Control",
  //   "Language & Dialect Shift",
  //   "Logic Bugs in AI & GenAI Systems",
  //   "Testing Your AI Model",
  //   "Test Plan",
  //   "From Binary to Brain: How GenAI Thinks",
  //   "What Are Tokens and Embeddings?",
  //   "LLMs & Tokens",
  //   "What is Vector Embedding? (Made Simple)",
  //   "Vector Embeddings",
  //   "Storing Images, Texts, and Vectors",
  //   "Image Transformation Techniques",
  //   "Spotting Patterns",
  //   "From Commands to Creativity: How AI Paints a Picture",
  //   "Being Creative with AI & GenAI",
  //   "Inside a GPU",
  //   "Who Builds AI Tools — Team Roles and Skills",
  //   "Understanding Language Model Sizes",
  //   "Which Model Fits Which Task?",
  //   "Popular AI LLMs",
  //   "Popular Languages for LLM Development",
  //   "What is RAG?",
  //   "Retrieval Augmented Generation",
  //   "Metadata Filtering in LLMs",
  //   "FAISS vs Chroma DB",
  //   "What is Chunking?",
  //   "AI Agents in Action",
  //   "AI Agent vs Assistant vs Language Model",
  //   "Multi-Tool Agent in Action",
  //   "Re-ranking Logic in LLMs",
  //   "AI Decision-Making",
  //   "OpenAI API Request Structure",
  //   "Streamlit UI Components",
  //   "Ask Your PDF: How It Works",
  //   "How an AI Prompt Engineer Can Earn Lakhs of Money",
  //   "Jobs You Can Do as a Prompt Engineer",
  //   "Platforms & Niches",
  //   "Creating Prompt Products — Templates and Packs",
  //   "Can AI Get a Virus?",
  //   "AI Under Attack",
  //   "AI and Human Jobs — A Future Together",
  //   "Human vs AI Agent",
  // ];

 

  // Handle touch swipe
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 50) goNext();
    if (touchEndX - touchStartX > 50) goPrev();
  };
  return (
    <main className="flex flex-col items-center justify-center bg-gradient-to-br from-white via-gray-50 to-purple-50 pt-2 min-h-screen">
      {/* <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 md:mb-4 text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent px-4">
        {headings[currentIndex]}
      </h2> */}

      <div
        className="relative w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto flex justify-center items-center overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-full aspect-[4/5] max-h-[80vh] relative flex justify-center items-center bg-gray-50">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center z-10">
              <svg
                className="animate-spin h-8 w-8 sm:h-10 sm:w-10 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            </div>
          )}
          <img
            src={images[currentIndex]}
            alt={`AI Book Page ${currentIndex + 1}`}
            className={`w-full h-full object-contain transition-opacity duration-300 ${
              loading ? "opacity-30" : "opacity-100"
            }`}
            loading="lazy"
            onClick={goNext}
            draggable={false}
          />
        </div>

        {/* Prev button - hidden on mobile */}
        <button
          onClick={goPrev}
          aria-label="Previous Image"
          className={`absolute top-1/2 -translate-y-1/2 left-2 sm:left-3 md:left-4 bg-white/90 hover:bg-white p-1 sm:p-2 rounded-full shadow-md transition ${
            currentIndex === 0
              ? "opacity-50 cursor-not-allowed"
              : "opacity-100 hover:scale-105"
          } hidden sm:flex`}
          disabled={currentIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
        </button>

        {/* UPDATED: Improved Next button active state and styling */}
        <button
          onClick={goNext}
          aria-label="Next Image"
          className={`absolute top-1/2 -translate-y-1/2 right-2 sm:right-3 md:right-4 bg-white/90 hover:bg-white p-1 sm:p-2 rounded-full shadow-md transition ${
            currentIndex === images.length - 1
              ? "opacity-50 cursor-not-allowed"
              : "opacity-100 hover:scale-105"
          } hidden sm:flex`}
          disabled={currentIndex === images.length - 1}
        >
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
        </button>
      </div>
      <div className="text-sm sm:hidden  text-indigo-800 px-3 py-4 rounded-full mb-4 font-medium">
        Swipe left or right to view images
      </div>
    </main>
  );
};

export default FreeAiBook;
