// import React, { ChangeEvent, KeyboardEvent } from "react";
// import { ArrowUp, Loader2 } from "lucide-react";

// interface InputBarProps {
//   input: string;
//   setInput: React.Dispatch<React.SetStateAction<string>>;
//   handleSend: (messageContent?: string) => Promise<void>;
//   handleKeyPress: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
//   loading: boolean;
//   textareaRef: React.RefObject<HTMLTextAreaElement>;
// }

// const InputBar: React.FC<InputBarProps> = ({
//   input,
//   setInput,
//   handleSend,
//   handleKeyPress,
//   loading,
//   textareaRef,
// }) => {
//   return (
//     <div className="flex-shrink-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 sticky bottom-0 z-10 shadow-2xl">
//       <div className="max-w-4xl mx-auto p-4">
//         <div className="relative group">
//           <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
//           <div className="relative bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl shadow-xl focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-200 overflow-hidden">
//             <div className="flex items-end gap-3 p-4">
//               <div className="flex-1">
//                 <textarea
//                   ref={textareaRef}
//                   value={input}
//                   onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
//                     setInput(e.target.value)
//                   }
//                   onKeyDown={handleKeyPress}
//                   placeholder="Ask anything..."
//                   disabled={loading}
//                   rows={1}
//                   className="w-full text-base resize-none bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 min-h-[24px] max-h-[120px]"
//                 />
//               </div>
//               <button
//                 onClick={() => handleSend()}
//                 disabled={!input.trim() || loading}
//                 className={`w-10 h-10 rounded-xl transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
//                   input.trim() && !loading
//                     ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
//                     : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
//                 }`}
//               >
//                 {loading ? (
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                 ) : (
//                   <ArrowUp className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//             <div className="px-4 pb-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
//               <div className="flex items-center gap-2"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InputBar;
import React, { ChangeEvent, KeyboardEvent } from "react";
import { ArrowUp, Loader2 } from "lucide-react";

interface InputBarProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSend: (messageContent?: string) => Promise<void>;
  handleKeyPress: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  loading: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const InputBar: React.FC<InputBarProps> = ({
  input,
  setInput,
  handleSend,
  handleKeyPress,
  loading,
  textareaRef,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 z-10 shadow-2xl safe-area-pb">
      <div className="max-w-4xl mx-auto p-3 sm:p-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
          <div className="relative bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl shadow-xl focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-200 overflow-hidden">
            <div className="flex items-end gap-2 sm:gap-3 p-3 sm:p-4">
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setInput(e.target.value)
                  }
                  onKeyDown={handleKeyPress}
                  placeholder="Ask anything..."
                  disabled={loading}
                  rows={1}
                  className="w-full text-sm sm:text-base resize-none bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 min-h-[44px] sm:min-h-[24px] max-h-[100px] sm:max-h-[120px]"
                />
              </div>
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
                  input.trim() && !loading
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 sm:w-5 sm:h-5 animate-spin" />
                ) : (
                  <ArrowUp className="w-5 h-5 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputBar;