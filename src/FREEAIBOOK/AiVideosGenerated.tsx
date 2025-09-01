import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Play } from "lucide-react";

// Full list of videos with unique titles and descriptions
const videos = [
  {
    id: "NJ2IVNFmF3g",
    title: "Study Abroad 2025",
    description:
      "Secure scholarships, cashback, and quick offer letters for studying abroad from India. Expert guidance for visas, loans, and top destinations",
  },
  {
    id: "rtOQ0Tu4mYE",
    title: "Grow Your Money with OxyLoans",
    description:
      "Earn up to 1.75% monthly and 24% yearly ROI with OxyLoans P2P Lending. Register instantly and start growing wealth.",
  },
  {
    id: "9NK4jw3-Iqs",
    title: "Study & Work Abroad 2025",
    description:
      "Get scholarships, cashback, offer letters, and financial guidance for studying or working abroad with ASKOXY.AI’s expert support.",
  },
  {
    id: "m54i-Umtku4",
    title: "Top AI News & Insights",
    description:
      "Stay updated on AI trends, innovations, and breakthroughs worldwide. Discover tools, insights, and strategies with ASKOXY.AI",
  },
  {
    id: "weFSPylTdeI",
    title: "Study & Work Abroad 2025",
    description:
      "Get scholarships, cashback, fast offer letters, and complete financial guidance for studying or working abroad with ASKOXY.AI.",
  },
  {
    id: "TLIBduMpbRg",
    title: "CA & CS Professional Services",
    description:
      "ASKOXY.AI offers expert Chartered Accountancy and Company Secretary services to keep your business compliant, financially strong, and growth-ready",
  },
  {
    id: "dwA_t5wRL9k",
    title: "Free AI & GenAI Masterclass 2025",
    description:
      "Learn AI, Generative AI, Java, Microservices, and prompt engineering for future-ready tech skills. Join ASKOXY.AI’s free training.",
  },
  {
    id: "9Y0eeJr9FxM",
    title: "Buy 5kg ASKOXY Rice, Get 1kg FREE!",
    description:
      "Choose from HMT, Sonamasoori, Brown, JSR, or Low GI. Enjoy premium quality rice, free delivery, and easy online ordering",
  },
  {
    id: "Va-ZCN4yniQ",
    title: "Celebrate Festivities with AI",
    description:
      "Combine tradition and innovation this festive season. Simplify rituals, enjoy family time, and embrace joy, wisdom, and prosperity with AI.",
  },
  {
    id: "nrllljDzf0E",
    title: "5% Cashback & AI-Powered Services",
    description:
      "Explore ASKOXY.AI’s AI-Z Marketplace: cashback, financial guidance, career opportunities, and everyday services—all on one innovative platform",
  },
  {
    id: "nep-7FxUtFE",
    title: "ASKOXY.AI – Your AI-Z Marketplace",
    description:
      "One AI-powered platform for study abroad, loans, jobs, real estate, CA services, agriculture, and more. Trusted, smart, and seamless.",
  },
  {
    id: "0H6qkIlug24",
    title: "Lend & Earn with OxyLoans",
    description:
      "Earn up to 1.75% monthly and 24% yearly ROI with OxyLoans, an RBI-approved P2P NBFC. Register and start today.",
  },
  {
    id: "W2l3mpATxy4",
    title: "Study Abroad Smarter with AI",
    description:
      "Explore top universities, best-fit courses, scholarships, and visa guidance with ASKOXY.AI. No agents, just clear, AI-powered advice",
  },
  {
    id: "yfgqz7W9hGY",
    title: "Free AI & GenAI Masterclass",
    description:
      "Learn prompt engineering, real-world AI use cases, live tools, and career opportunities with ASKOXY.AI’s free Masterclass replay.",
  },
  {
    id: "ncf42m4YqLQ",
    title: "Free AI & Prompt Engineering Workshop",
    description:
      "Join ASKOXY.AI’s free workshop on prompt engineering, hands-on demos, industry use cases, and career growth insights. Register now!",
  },
  {
    id: "4O1Utr81LTE",
    title: "Amazon Prime Day vs Flipkart GOAT 2025",
    description:
      "See real-time smartphone deals with ASKOXY.AI’s Price GPT. Compare Amazon and Flipkart offers and shop smarter using AI insights.",
  },
  {
    id: "-aqH31YbSA0",
    title: "Happy Independence Day, India!",
    description:
      "Celebrate India’s freedom! Honor our heroes, unity, and spirit. Let’s carry forward their legacy with love, respect, and dedication.",
  },
  {
    id: "NMtJkmg10As",
    title: "Study Abroad Smarter with AI",
    description:
      "Use AI tools to explore top universities, personalized courses, and scholarships. Study abroad smarter, faster, and more efficiently with ASKOXY.AI.",
  },
  {
    id: "KBXF2TnGEWw",
    title: "Buy Rice Online in Hyderabad – Free Rice Offer",
    description:
      "Get 5KG rice + 2KG free or 2KG JSR rice + 1KG free. Free delivery and AI-powered savings on AskOxy.ai. Order now!",
  },
  {
    id: "G8nhYKQM7i0",
    title: "Study Abroad Made Easy with ASKOXY.AI",
    description:
      "Get cashback, student loans, admissions, and visa support for top destinations. Go global smarter, faster, and easier with ASKOXY.AI.",
  },
].map((v) => ({
  ...v,
  thumbnail: `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
  url: `https://www.youtube.com/embed/${v.id}`,
}));

export default function AiVideosGenerated() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <section className="flex flex-col items-center max-w-7xl mx-auto bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-16 px-6 sm:px-8 md:px-12">
      {/* Heading */}
      <div className="text-center mb-12 max-w-4xl">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-purple-900 leading-tight">
          Explore AI & Global Opportunities
        </h3>
        <div className="w-32 h-1.5 mt-3 mx-auto rounded-full bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400"></div>
        <p className="mt-4 text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed">
          Browse short, insightful AI videos covering study abroad,
          scholarships, investments, professional services, and more.
        </p>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.03 }}
          >
            {/* Video / Thumbnail */}
            <div className="relative aspect-video bg-black rounded-t-2xl overflow-hidden">
              {activeVideo === video.id ? (
                <>
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                      <Loader2 className="w-10 h-10 text-white animate-spin" />
                    </div>
                  )}
                  <iframe
                    src={video.url + "?autoplay=1"}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    onLoad={() => setLoading(false)}
                  ></iframe>
                </>
              ) : (
                <button
                  className="w-full h-full relative group"
                  onClick={() => {
                    setActiveVideo(video.id);
                    setLoading(true);
                  }}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:brightness-90 transition"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-200">
                      <Play className="w-8 h-8 text-purple-700" />
                    </div>
                  </div>
                </button>
              )}
            </div>

            {/* Video Info */}
            <div className="p-5 flex flex-col flex-grow">
              <h4 className="text-lg sm:text-xl font-semibold text-purple-800 mb-2 line-clamp-2">
                {video.title}
              </h4>
              <p className="text-gray-600 text-sm sm:text-base flex-grow line-clamp-3">
                {video.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
