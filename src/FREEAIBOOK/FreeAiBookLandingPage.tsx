import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

const images = [
  "https://i.ibb.co/20wfNSqw/Book-0.jpg",
  "https://i.ibb.co/6RvC50Jg/1.jpg",
  "https://i.ibb.co/PZL0gf8L/2.jpg",
  "https://i.ibb.co/YTNynhrj/3.jpg",
  "https://i.ibb.co/kVFwwGFD/4.jpg",
  "https://i.ibb.co/m5q4Xny1/5.jpg",
  "https://i.ibb.co/ns0RSkz3/6.jpg",
  "https://i.ibb.co/v6P6T1Ny/7.jpg",
  "https://i.ibb.co/rGgJ7s5Z/8.jpg",
  "https://i.ibb.co/nN4FhJBd/9.jpg",
  "https://i.ibb.co/dJtCVmf1/10.jpg",
  "https://i.ibb.co/dwxfVx9d/11.jpg",
  "https://i.ibb.co/rGhcxvJq/12.jpg",
  "https://i.ibb.co/Psqg7TvZ/13.jpg",
  "https://i.ibb.co/KxR7rrHh/14.jpg",
  "https://i.ibb.co/v4NCP3jX/15.jpg",
  "https://i.ibb.co/svGgtsNq/16.jpg",
  "https://i.ibb.co/zgD1526/17.jpg",
  "https://i.ibb.co/dw9NsPnB/18.jpg",
  "https://i.ibb.co/9HxztrNh/19.jpg",
  "https://i.ibb.co/DDMt6458/20.jpg",
  "https://i.ibb.co/zT1tb1fv/21.jpg",
  "https://i.ibb.co/5hqBfgr1/22.jpg",
  "https://i.ibb.co/Mv97kqF/23.jpg",
  "https://i.ibb.co/NgL5xbSw/24.jpg",
  "https://i.ibb.co/dsVMzNDy/25.jpg",
  "https://i.ibb.co/nsxBdDSz/26.jpg",
  "https://i.ibb.co/bMQ1kQJQ/27.jpg",
  "https://i.ibb.co/V0Vhz6VT/28.jpg",
  "https://i.ibb.co/VWmDDVrK/29.jpg",
  "https://i.ibb.co/6cDr9rKD/30.jpg",
  "https://i.ibb.co/TDxqrpzT/31.jpg",
  "https://i.ibb.co/kVFpp3BM/32.jpg",
  "https://i.ibb.co/DfnWf1rz/33.jpg",
  "https://i.ibb.co/JW0qTJB3/34.jpg",
  "https://i.ibb.co/qMRkFbx5/35.jpg",
  "https://i.ibb.co/vxmF8Tsp/36.jpg",
  "https://i.ibb.co/6RG3ZNXh/37.jpg",
  "https://i.ibb.co/pjRzqN8g/38.jpg",
  "https://i.ibb.co/zTtCk8x2/39.jpg",
  "https://i.ibb.co/tM1xBHLY/40.jpg",
  "https://i.ibb.co/BFy6ch1/41.jpg",
  "https://i.ibb.co/6cKKffDL/42.jpg",
  "https://i.ibb.co/B2hZL8rP/43.jpg",
  "https://i.ibb.co/xK3PZgKZ/44.jpg",
  "https://i.ibb.co/Q3v1YHKH/45.jpg",
  "https://i.ibb.co/XfhQRBQN/46.jpg",
  "https://i.ibb.co/FL4TX5bc/47.jpg",
  "https://i.ibb.co/gphGCGV/48.jpg",
  "https://i.ibb.co/v6rhBVY3/49.jpg",
  "https://i.ibb.co/v6kx4wr2/50.jpg",
  "https://i.ibb.co/8gv9kKRb/51.jpg",
  "https://i.ibb.co/TQBrDsW/52.jpg",
  "https://i.ibb.co/Hfj5Xkt3/53.jpg",
  "https://i.ibb.co/F4t7JcM2/54.jpg",
  "https://i.ibb.co/sJ9fFyT3/55.jpg",
  "https://i.ibb.co/1JYmd6s1/56.jpg",
  "https://i.ibb.co/gZN9ZQX9/57.jpg",
  "https://i.ibb.co/35DyWMV2/58.jpg",
  "https://i.ibb.co/svR7KhbP/59.jpg",
  "https://i.ibb.co/9HN8HCX6/60.jpg",
  "https://i.ibb.co/cXZpYR8w/61.jpg",
  "https://i.ibb.co/zVRTTNPh/62.jpg",
  "https://i.ibb.co/fGP7rwrw/63.jpg",
  "https://i.ibb.co/rfxKHM6M/64.jpg",
  "https://i.ibb.co/WvqR1BQT/65.jpg",
  "https://i.ibb.co/wZYrmFST/66.jpg",
  "https://i.ibb.co/6SZLHJ7/67.jpg",
  "https://i.ibb.co/0zBmBm8/68.jpg",
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
