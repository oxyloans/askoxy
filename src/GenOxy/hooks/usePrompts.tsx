import { useState } from "react";
import {
  AcademicCapIcon,
  CodeBracketIcon,
  NewspaperIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

interface Prompt {
  text: string;
  icon: JSX.Element;
  gradient: string;
  related: string[];
}

export const usePrompts = (
  handleSend: (messageContent?: string) => void,
  setInput: React.Dispatch<React.SetStateAction<string>>
) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [relatedOptions, setRelatedOptions] = useState<string[]>([]);

  const suggestionPrompts: Prompt[] = [
    {
  text: "Image Generation",
  icon: <PhotoIcon className="w-5 h-5" />,
  gradient: "from-green-600 to-cyan-700",
  related: [
    "Generate a landscape image",
    "Generate a realistic product mockup image", 
    "Generate a corporate banner iamge", 
    "Generate an infographic image",  
  ],
},
    {
      text: "Learning",
      icon: <AcademicCapIcon className="w-5 h-5" />,
      gradient: "from-pink-600 to-red-600",
      related: [
        "Top skills for 2025",
        "Remote learning tips",
        "AI for professional growth",
        "Create a learning plan",
      ],
    },
    {
      text: "Development",
      icon: <CodeBracketIcon className="w-5 h-5" />,
      gradient: "from-indigo-600 to-purple-700",
      related: [
        "React authentication",
        "Optimize Node.js API",
        "Clean code practices",
        "Async JavaScript explained",
      ],
    },
    {
      text: "News",
      icon: <NewspaperIcon className="w-5 h-5" />,
      gradient: "from-yellow-600 to-orange-600",
      related: [
        "Latest AI research",
        "2025 market trends",
        "Technology policy updates",
        "Financial news summary",
      ],
    },
  ];

  const handlePromptSelect = (promptText: string, related: string[]) => {
    setSelectedPrompt(promptText);
    setRelatedOptions(related);
    setShowDropdown(true);
  };

  return {
    suggestionPrompts,
    showDropdown,
    relatedOptions,
    handlePromptSelect,
    setShowDropdown,
  };
};
