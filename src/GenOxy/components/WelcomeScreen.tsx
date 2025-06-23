// import React, { ChangeEvent, KeyboardEvent } from "react";
// import { ArrowUp, Loader2, Sparkles } from "lucide-react";
// import {
//   AcademicCapIcon,
//   CodeBracketIcon,
//   NewspaperIcon,
//   PhotoIcon,
// } from "@heroicons/react/24/outline";
import { usePrompts } from "../hooks/usePrompts";

// interface WelcomeScreenProps {
//   input: string;
//   setInput: React.Dispatch<React.SetStateAction<string>>;
//   handleSend: (messageContent?: string) => Promise<void>;
//   handleKeyPress: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
//   loading: boolean;
//   textareaRef: React.RefObject<HTMLTextAreaElement>;
// }

// const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
//   input,
//   setInput,
//   handleSend,
//   handleKeyPress,
//   loading,
//   textareaRef,
// }) => {
//   const {
//     suggestionPrompts,
//     showDropdown,
//     relatedOptions,
//     handlePromptSelect,
//   } = usePrompts(handleSend, setInput);

//   return (
//     <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
//       <div className="absolute inset-0">
//         {[
//           { left: "10%", top: "20%" },
//           { right: "15%", top: "30%" },
//           { left: "50%", bottom: "10%" },
//         ].map((pos, i) => (
//           <div
//             key={`g1-${i}`}
//             className="absolute w-4 h-4 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full animate-float-bubble"
//             style={{
//               ...pos,
//               animationDelay: `${i * 1.5}s`,
//               animationDuration: `${8 + i}s`,
//             }}
//           >
//             <div
//               className="w-full h-full bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-full animate-ping"
//               style={{
//                 animationDelay: `${i * 1.5}s`,
//                 animationDuration: "3s",
//               }}
//             />
//           </div>
//         ))}
//         {[
//           { left: "70%", top: "15%" },
//           { right: "5%", top: "70%" },
//           { left: "25%", bottom: "30%" },
//         ].map((pos, i) => (
//           <div
//             key={`g2-${i}`}
//             className="absolute w-5 h-5 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full animate-float-bubble"
//             style={{
//               ...pos,
//               animationDelay: `${2 + i}s`,
//               animationDuration: `${7 + i}s`,
//             }}
//           >
//             <div
//               className="w-full h-full bg-gradient-to-r from-pink-400/30 to-rose-400/30 rounded-full animate-ping"
//               style={{
//                 animationDelay: `${2 + i}s`,
//                 animationDuration: "3.5s",
//               }}
//             />
//           </div>
//         ))}
//         {[
//           { right: "25%", top: "50%" },
//           { left: "5%", top: "60%" },
//           { left: "80%", bottom: "30%" },
//         ].map((pos, i) => (
//           <div
//             key={`g3-${i}`}
//             className="absolute w-6 h-6 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full animate-float-bubble"
//             style={{
//               ...pos,
//               animationDelay: `${3 + i}s`,
//               animationDuration: `${9 + i}s`,
//             }}
//           >
//             <div
//               className="w-full h-full bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full animate-ping"
//               style={{
//                 animationDelay: `${3 + i}s`,
//                 animationDuration: "4s",
//               }}
//             />
//           </div>
//         ))}
//       </div>
//       <div className="flex-1 flex flex-col items-center justify-center px-3 py-6 max-w-6xl mx-auto w-full pointer-events-auto">
//         <div className="text-center mb-12">
//           <div className="relative mb-6">
//             <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform hover:scale-105 transition-all duration-300">
//               <Sparkles className="w-8 h-8 text-white animate-pulse" />
//             </div>
//             <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-xl animate-pulse"></div>
//           </div>
//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 animate-fade-in">
//             GENOXY
//           </h1>
//           <p className="text-xl md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-delayed">
//             Your intelligent AI companion for creativity, learning, and
//             problem-solving
//           </p>
//         </div>
//         <div className="w-full max-w-3xl mb-10">
//           <div className="relative group">
//             <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
//             <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
//               <textarea
//                 ref={textareaRef}
//                 value={input}
//                 onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
//                   setInput(e.target.value)
//                 }
//                 onKeyDown={handleKeyPress}
//                 placeholder="Ask me anything..."
//                 disabled={loading}
//                 rows={1}
//                 className="w-full text-lg resize-none bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 p-6 pr-16 rounded-3xl"
//                 style={{ minHeight: "80px", maxHeight: "150px" }}
//               />
//               <button
//                 onClick={() => handleSend()}
//                 disabled={!input.trim() || loading}
//                 className={`absolute bottom-4 right-4 w-12 h-12 rounded-2xl transition-all duration-300 flex items-center justify-center ${
//                   input.trim() && !loading
//                     ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95"
//                     : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
//                 }`}
//               >
//                 {loading ? (
//                   <Loader2 className="w-6 h-6 animate-spin" />
//                 ) : (
//                   <ArrowUp className="w-6 h-6" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="w-full max-w-5xl mx-auto px-4 flex flex-col gap-6">
//           <div className="flex flex-wrap gap-3 justify-center">
//             {suggestionPrompts.map((prompt, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => handlePromptSelect(prompt.text, prompt.related)}
//                 className="flex items-center px-3 py-1 bg-gray-900 border border-gray-700 rounded-full text-white hover:bg-gray-800 transition-all duration-300"
//               >
//                 <div
//                   className={`flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-gradient-to-br ${prompt.gradient} text-white text-xs`}
//                 >
//                   {prompt.icon}
//                 </div>
//                 <span className="text-xs font-medium">{prompt.text}</span>
//               </button>
//             ))}
//           </div>
//           {showDropdown && relatedOptions.length > 0 && (
//             <div className="w-full mt-4">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 {relatedOptions.map((question, index) => (
//                   <button
//                     key={index}
//                     onClick={() => {
//                       setInput(question);
//                       handleSend(question);
//                     }}
//                     className="w-full px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-700 text-white text-sm transition-all text-center"
//                   >
//                     {question}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WelcomeScreen;





import React, { ChangeEvent, KeyboardEvent } from "react";
import { ArrowUp, Loader2, Sparkles } from "lucide-react";
import {
  AcademicCapIcon,
  CodeBracketIcon,
  NewspaperIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
// import { usePrompts } from "./hooks/usePrompts";

interface WelcomeScreenProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSend: (messageContent?: string) => Promise<void>;
  handleKeyPress: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  loading: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  input,
  setInput,
  handleSend,
//   handleKeyPress,
  loading,
  textareaRef,
}) => {
  const {
    suggestionPrompts,
    showDropdown,
    relatedOptions,
    handlePromptSelect,
    setShowDropdown,
  } = usePrompts(handleSend, setInput);
  const handleKeyPress = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSend();
      setShowDropdown(false); // <-- hide dropdown here
    }
  };
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0">
        {[
          { left: "10%", top: "20%" },
          { right: "15%", top: "30%" },
          { left: "50%", bottom: "10%" },
        ].map((pos, i) => (
          <div
            key={`g1-${i}`}
            className="absolute w-4 h-4 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full animate-float-bubble"
            style={{
              ...pos,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${8 + i}s`,
            }}
          >
            <div
              className="w-full h-full bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-full animate-ping"
              style={{
                animationDelay: `${i * 1.5}s`,
                animationDuration: "3s",
              }}
            />
          </div>
        ))}
        {/* White snowballs */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`snow-${i}`}
            className="absolute rounded-full bg-white opacity-20 blur-sm animate-snow-up"
            style={{
              width: `${8 + Math.random() * 8}px`, // small random size 8-16px
              height: `${8 + Math.random() * 8}px`,
              left: `${Math.random() * 100}%`,
              bottom: `-${Math.random() * 50}px`,
              animationDelay: `${i * 3}s`,
              animationDuration: `${20 + i * 10}s`, // slow long animation
            }}
          />
        ))}

        {[
          { left: "70%", top: "15%" },
          { right: "5%", top: "70%" },
          { left: "25%", bottom: "30%" },
        ].map((pos, i) => (
          <div
            key={`g2-${i}`}
            className="absolute w-5 h-5 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full animate-float-bubble"
            style={{
              ...pos,
              animationDelay: `${2 + i}s`,
              animationDuration: `${7 + i}s`,
            }}
          >
            <div
              className="w-full h-full bg-gradient-to-r from-pink-400/30 to-rose-400/30 rounded-full animate-ping"
              style={{
                animationDelay: `${2 + i}s`,
                animationDuration: "3.5s",
              }}
            />
          </div>
        ))}
        {[
          { right: "25%", top: "50%" },
          { left: "5%", top: "60%" },
          { left: "80%", bottom: "30%" },
        ].map((pos, i) => (
          <div
            key={`g3-${i}`}
            className="absolute w-6 h-6 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full animate-float-bubble"
            style={{
              ...pos,
              animationDelay: `${3 + i}s`,
              animationDuration: `${9 + i}s`,
            }}
          >
            <div
              className="w-full h-full bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full animate-ping"
              style={{
                animationDelay: `${3 + i}s`,
                animationDuration: "4s",
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-3 py-6 max-w-6xl mx-auto w-full pointer-events-auto">
        <div className="text-center mb-12">
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform hover:scale-105 transition-all duration-300">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-xl animate-pulse"></div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 animate-fade-in">
            GENOXY
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-delayed">
            Your intelligent AI companion for creativity, learning, and
            problem-solving
          </p>
        </div>
        <div className="w-full max-w-3xl mb-8 sm:mb-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  setInput(e.target.value);
                  setShowDropdown(false);
                }}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={loading}
                rows={1}
                className="w-full text-base sm:text-lg resize-none bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 p-4 sm:p-6 pr-12 sm:pr-16 rounded-3xl"
                style={{ minHeight: "60px", maxHeight: "120px" }}
              />
              <button
                onClick={async () => {
                  await handleSend();
                  setShowDropdown(false); // 🔁 ADD THIS LINE
                }}
                disabled={!input.trim() || loading}
                className={`absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl transition-all duration-300 flex items-center justify-center ${
                  input.trim() && !loading
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                ) : (
                  <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 flex flex-col gap-4 sm:gap-6">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:flex sm:flex-wrap sm:justify-center">
            {suggestionPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const isMobile = window.innerWidth < 640;
                  if (isMobile) {
                    setInput(prompt.text);
                    handleSend(prompt.text);
                    setShowDropdown(false); // Hide dropdown if shown
                  } else {
                    handlePromptSelect(prompt.text, prompt.related);
                  }
                }}
                className="flex items-center px-3 py-2 bg-gray-900 border border-gray-700 rounded-full text-white hover:bg-gray-800 transition-all duration-300 text-xs sm:text-sm min-h-[44px]"
              >
                <div
                  className={`flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-gradient-to-br ${prompt.gradient} text-white text-xs`}
                >
                  {prompt.icon}
                </div>
                <span className="font-medium">{prompt.text}</span>
              </button>
            ))}
          </div>
          {showDropdown && relatedOptions.length > 0 && (
            <div className="w-full px-3 sm:px-0 hidden sm:block">
              <div className="max-h-[200px] overflow-y-auto sm:overflow-visible">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3">
                  {relatedOptions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInput(question);
                        handleSend(question);
                        setShowDropdown(false);
                      }}
                      className="w-full px-3 py-2 rounded bg-cyan-600 hover:bg-cyan-700 text-white text-xs sm:text-sm transition-all text-center min-h-[44px]"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;