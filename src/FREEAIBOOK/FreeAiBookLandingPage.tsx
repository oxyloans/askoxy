import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

const images = [
  "https://i.ibb.co/20wfNSqw/Book-0.jpg",
  "https://i.ibb.co/DDG2nfg5/1.jpg",
  "https://i.ibb.co/3y3QcLH3/2.jpg",
  "https://i.ibb.co/rfQc8HWy/3.jpg",
  "https://i.ibb.co/wZ1PPd1Q/4.jpg",
  "https://i.ibb.co/s9wq6T1k/5.jpg",
  "https://i.ibb.co/6RZN5sgv/6.jpg",
  "https://i.ibb.co/W4y4Mnr8/7.jpg",
  "https://i.ibb.co/7JHFY4rG/8.jpg",
  "https://i.ibb.co/sdcZLYCx/9.jpg",
  "https://i.ibb.co/XkD0KYWN/10.jpg",
  "https://i.ibb.co/FLChyCvS/11.jpg",
  "https://i.ibb.co/TBGb4r5J/12.jpg",
  "https://i.ibb.co/KcTWMNpj/13.jpg",
  "https://i.ibb.co/Jj02ssPt/14.jpg",
  "https://i.ibb.co/9HxmTbrZ/15.jpg",
  "https://i.ibb.co/Y7MNbf1h/16.jpg",
  "https://i.ibb.co/XPM945Y/17.jpg",
  "https://i.ibb.co/xtvnK1Vh/18.jpg",
  "https://i.ibb.co/LdTb5Z8r/19.jpg",
  "https://i.ibb.co/QFHfq9rC/20.jpg",
  "https://i.ibb.co/wFT2CT6m/21.jpg",
  "https://i.ibb.co/GQgcb4Wd/22.jpg",
  "https://i.ibb.co/RF7cTLR/23.jpg",
  "https://i.ibb.co/5X5mTwFq/24.jpg",
  "https://i.ibb.co/35jdLxcH/25.jpg",
  "https://i.ibb.co/vx0hyJ8Z/26.jpg",
  "https://i.ibb.co/FLm6FmVm/27.jpg",
  "https://i.ibb.co/8nMRfkM9/28.jpg",
  "https://i.ibb.co/7J4VVv89/29.jpg",
  "https://i.ibb.co/XfFj0jnF/30.jpg",
  "https://i.ibb.co/Q73jXzsc/31.jpg",
  "https://i.ibb.co/9mjJJwgG/32.jpg",
  "https://i.ibb.co/RTWbTgjY/33.jpg",
  "https://i.ibb.co/spkC4YmW/34.jpg",
  "https://i.ibb.co/gMDzFs6V/35.jpg",
  "https://i.ibb.co/VWD18zHR/36.jpg",
  "https://i.ibb.co/d0Xdc7m9/37.jpg",
  "https://i.ibb.co/3mMNKVqw/38.jpg",
  "https://i.ibb.co/JwS8hxtp/39.jpg",
  "https://i.ibb.co/bgG216bN/40.jpg",
  "https://i.ibb.co/szK1bTB/41.jpg",
  "https://i.ibb.co/LDTT229H/42.jpg",
  "https://i.ibb.co/F4Qw6G0W/43.jpg",
  "https://i.ibb.co/My9Wd1yd/44.jpg",
  "https://i.ibb.co/DHfSwMRM/45.jpg",
  "https://i.ibb.co/cKGBn5BM/46.jpg",
  "https://i.ibb.co/fzdw9kYZ/47.jpg",
  "https://i.ibb.co/hjwkvkf/48.jpg",
  "https://i.ibb.co/fzK9Sqvk/49.jpg",
  "https://i.ibb.co/tTDMpmNy/50.jpg",
  "https://i.ibb.co/QvSM0bqk/51.jpg",
  "https://i.ibb.co/RXp7Gqj/52.jpg",
  "https://i.ibb.co/cSj4x76V/53.jpg",
  "https://i.ibb.co/QvGmnhRL/54.jpg",
  "https://i.ibb.co/HpTSrncg/55.jpg",
  "https://i.ibb.co/R4GDByhf/56.jpg",
  "https://i.ibb.co/tpgKpnNK/57.jpg",
  "https://i.ibb.co/sp0vQ6cn/58.jpg",
  "https://i.ibb.co/pvwqfgbP/59.jpg",
  "https://i.ibb.co/Xxb2xvB1/60.jpg",
  "https://i.ibb.co/qFc4JhgC/61.jpg",
  "https://i.ibb.co/TM8xxrPB/62.jpg",
  "https://i.ibb.co/n85SQJQJ/63.jpg",
  "https://i.ibb.co/Z1BRxK8K/64.jpg",
  "https://i.ibb.co/v4gM8Lbt/65.jpg",
  "https://i.ibb.co/HLXp8ft0/66.jpg",
  "https://i.ibb.co/ny0t78N/67.jpg",
  "https://i.ibb.co/gcvmvmH/68.jpg",
  "https://i.ibb.co/Z1kb7x0N/69.jpg",
  "https://i.ibb.co/DPJhPv7H/70.jpg",
  "https://i.ibb.co/CK61BGzB/71.jpg",
  "https://i.ibb.co/RGGjcD91/72.jpg",
  "https://i.ibb.co/W4gbn4kr/73.jpg",
  "https://i.ibb.co/VpV46NXZ/74.jpg",
  "https://i.ibb.co/v42PnHcs/75.jpg",
  "https://i.ibb.co/KjKRpSNh/76.jpg",
  "https://i.ibb.co/Rk0hfKHy/77.jpg",
  "https://i.ibb.co/YFDDFN9Q/78.jpg",
  "https://i.ibb.co/Hfz0B9LD/79.jpg",
  "https://i.ibb.co/6cC18sJK/80.jpg",
  "https://i.ibb.co/nqzH4YDR/81.jpg",
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
