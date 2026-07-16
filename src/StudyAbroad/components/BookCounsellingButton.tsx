import React from "react";
import { Calendar } from "lucide-react";

interface BookCounsellingButtonProps {
  onClick?: () => void;
  isLoading?: boolean;
}

const BookCounsellingButton: React.FC<BookCounsellingButtonProps> = ({
  onClick,
  isLoading = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl hover:from-purple-700 hover:to-indigo-700 flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
      <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
      {isLoading ? "Loading..." : "Book Free Counselling"}
    </button>
  );
};

export default BookCounsellingButton;
