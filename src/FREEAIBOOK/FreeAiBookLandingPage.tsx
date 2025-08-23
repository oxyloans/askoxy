import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

const images = [
  "https://i.ibb.co/20wfNSqw/Book-0.jpg",
  "https://i.ibb.co/Z6WNjTDG/Book-1.jpg",
  "https://i.ibb.co/cKgqZ0fQ/Book-2.jpg",
  "https://i.ibb.co/7djCjVfR/Book-3.jpg",
  "https://i.ibb.co/VYGRb764/Book-4.jpg",
  "https://i.ibb.co/N2Rqt1VK/Book-5.jpg",
  "https://i.ibb.co/B2frc28Q/Book-6.jpg",
  "https://i.ibb.co/HptP8Dg5/Book-7.jpg",
  "https://i.ibb.co/PzZhYkHD/9.jpg",
  "https://i.ibb.co/YBN9HrhV/Book-9.jpg",
  "https://i.ibb.co/BVdcRqwh/Book-10.jpg",
  "https://i.ibb.co/ymFZpPFm/Book-11.jpg",
  "https://i.ibb.co/Gb6g50q/Book-12.jpg",
  "https://i.ibb.co/r2B6ckkh/Book-13.jpg",
  "https://i.ibb.co/1Y4DJFZ2/Book-14.jpg",
  "https://i.ibb.co/DPH8hLXs/Book-15.jpg",
  "https://i.ibb.co/JFshNMz1/Book-16.jpg",
  "https://i.ibb.co/KpxpNgyD/Book-17.jpg",
  "https://i.ibb.co/99Mj47p0/Book-18.jpg",
  "https://i.ibb.co/LzFVMGd8/Book-19.jpg",
  "https://i.ibb.co/kkWNdrq/Book-20.jpg",
  "https://i.ibb.co/4Rns7CS1/Book-21.jpg",
  "https://i.ibb.co/V0xFQNpX/Book-22.jpg",
  "https://i.ibb.co/svCPwX8H/Book-23.jpg",
  "https://i.ibb.co/Vc2LN0JX/Book-24.jpg",
  "https://i.ibb.co/mC6ch2Lb/Book-25.jpg",
  "https://i.ibb.co/YFLMbdB0/Book-26.jpg",
  "https://i.ibb.co/C567G3zZ/Book-27.jpg",
  "https://i.ibb.co/pBkwKNGJ/Book-28.jpg",
  "https://i.ibb.co/QFv2Vhxw/Book-29.jpg",
  "https://i.ibb.co/JjkTpph1/Book-30.jpg",
  "https://i.ibb.co/bMv8wt1W/Book-31.jpg",
  "https://i.ibb.co/dwTqHz9T/Book-32.jpg",
  "https://i.ibb.co/TMgFSG2j/Book-33.jpg",
  "https://i.ibb.co/n8wRm52j/Book-34.jpg",
  "https://i.ibb.co/P0HVQDM/Book-35.jpg",
  "https://i.ibb.co/20T9NC8L/Book-36.jpg",
  "https://i.ibb.co/WWq8tKd9/Book-37.jpg",
  "https://i.ibb.co/fGNgZ77n/Book-38.jpg",
  "https://i.ibb.co/qHkfm13/Book-39.jpg",
  "https://i.ibb.co/Gv1JsG1C/Book-40.jpg",
  "https://i.ibb.co/XkbWgGjC/Book-41.jpg",
  "https://i.ibb.co/bMfbqZTT/Book-42.jpg",
  "https://i.ibb.co/MxJScM8g/Book-43.jpg",
  "https://i.ibb.co/wr8drSjZ/Book-44.jpg",
  "https://i.ibb.co/NgrfRNbx/Book-45.jpg",
  "https://i.ibb.co/MDR47LLL/Book-46.jpg",
  "https://i.ibb.co/39Bbv8jy/Book-47.jpg",
  "https://i.ibb.co/bgcTzm8z/Book-48.jpg",
  "https://i.ibb.co/b5wN7gMm/Book-49.jpg",
  "https://i.ibb.co/Fb5wSMBX/Book-50.jpg",
  "https://i.ibb.co/ccp56PjT/Book-51.jpg",
  "https://i.ibb.co/HRYMg86/Book-52.jpg",
  "https://i.ibb.co/h1Bv1Fmf/Book-53.jpg",
  "https://i.ibb.co/fdt9dRgG/Book-54.jpg",
  "https://i.ibb.co/n8KLt2Z9/Book-55.jpg",
  "https://i.ibb.co/RGbqTxx4/Book-56.jpg",
  "https://i.ibb.co/5gv4r3Sd/Book-57.jpg",
  "https://i.ibb.co/RkYgFmj0/Book-58.jpg",
  "https://i.ibb.co/274pNcwx/Book-59.jpg",
  "https://i.ibb.co/4RqRrxx7/Book-60.jpg",
  "https://i.ibb.co/kgyNCKTt/Book-61.jpg",
  "https://i.ibb.co/fzFr7w7L/Book-62.jpg",
  "https://i.ibb.co/mrzn9SLy/Book-63.jpg",
  "https://i.ibb.co/84RVLNXg/Book-64.jpg",
  "https://i.ibb.co/wZtw6ZPP/Book-65.jpg",
  "https://i.ibb.co/JW7fCFbY/Book-66.jpg",
  "https://i.ibb.co/SDpnFrKw/Book-67.jpg",
  "https://i.ibb.co/2Ygxpjcc/Book-68.jpg",
  "https://i.ibb.co/v4tj75Pg/Book-69.jpg",
  "https://i.ibb.co/BHd4RDpN/Book-70.jpg",
  "https://i.ibb.co/842mMxhV/Book-71.jpg",
  "https://i.ibb.co/G4xDwRqY/Book-72.jpg",
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
  const headings = [
    "ENTER THE AI UNIVERSE",
    "Index-1",
    "Index-2",
    "Index-3",
    "Index-4",
    "What is AI?",
    "What is Generative AI?",
    "Why Learn AI Now?",
    "How to Use This Book?",
    "Mission Million AI Coders: The Journey Begins",
    "What is Prompt Engineering?",
    "Popular Generative AI Tools",
    "Writing Great AI Prompt Instructions",
    "Think in Prompts — Not Just in Tasks",
    "A Good AI Prompt Engineer...",
    "AI Prompt Engineering Tips",
    "AI Prompt Engineering Kit",
    "Prompt Templates — Reuse, Remix, Repeat",
    "Your First 5 Prompts — Get Started Today",
    "Daily Prompting Habits: Build Your AI Muscle",
    "Chain of Thought Prompts",
    "Types of Prompts — Zero, One, and Few-Shot",
    "Role-Based Prompts",
    "Agent-Style Prompts",
    "Meta-Prompts",
    "Loops in AI and GenAI",
    "AI Loops",
    "Debugging in AI vs GenAI",
    "Prompting Mistakes to Avoid",
    "Prompt vs Completion: Understand the Difference",
    "Tone Variations",
    "Length Control",
    "Language & Dialect Shift",
    "Logic Bugs in AI & GenAI Systems",
    "Testing Your AI Model",
    "Test Plan",
    "From Binary to Brain: How GenAI Thinks",
    "What Are Tokens and Embeddings?",
    "LLMs & Tokens",
    "What is Vector Embedding? (Made Simple)",
    "Vector Embeddings",
    "Storing Images, Texts, and Vectors",
    "Image Transformation Techniques",
    "Spotting Patterns",
    "From Commands to Creativity: How AI Paints a Picture",
    "Being Creative with AI & GenAI",
    "Inside a GPU",
    "Who Builds AI Tools — Team Roles and Skills",
    "Understanding Language Model Sizes",
    "Which Model Fits Which Task?",
    "Popular AI LLMs",
    "Popular Languages for LLM Development",
    "What is RAG?",
    "Retrieval Augmented Generation",
    "Metadata Filtering in LLMs",
    "FAISS vs Chroma DB",
    "What is Chunking?",
    "AI Agents in Action",
    "AI Agent vs Assistant vs Language Model",
    "Multi-Tool Agent in Action",
    "Re-ranking Logic in LLMs",
    "AI Decision-Making",
    "OpenAI API Request Structure",
    "Streamlit UI Components",
    "Ask Your PDF: How It Works",
    "How an AI Prompt Engineer Can Earn Lakhs of Money",
    "Jobs You Can Do as a Prompt Engineer",
    "Platforms & Niches",
    "Creating Prompt Products — Templates and Packs",
    "Can AI Get a Virus?",
    "AI Under Attack",
    "AI and Human Jobs — A Future Together",
    "Human vs AI Agent",
  ];

 

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
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 md:mb-4 text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent px-4">
        {headings[currentIndex]}
      </h2>

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
