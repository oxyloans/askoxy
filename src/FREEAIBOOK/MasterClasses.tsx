import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Play } from "lucide-react";

// Full list of videos with unique titles and descriptions
const videos = [
  {
    id: "L4FEg97j0y4",
    title: "AI Prompt Engineer — No Coding",
    description:
      "Kickstart your GenAI journey with this free masterclass! Learn prompt engineering, explore AI’s future, and join 1M+ coders — no coding required. 🚀",
  },
  {
    id: "6KbsbrJWagk",
    title: "Generative AI Market — $1.5 Trillion",
    description:
      "Discover how the Generative AI market is projected to hit $1.5 Trillion by 2025 in this Free AI & GenAI Masterclass (Mission Million AI Coders).",
  },
  {
    id: "j5i8vdr0vUI",
    title: "How AI Understands Data Like the Human Brain",
    description:
      "In this Free AI & GenAI Masterclass, discover how machines transform simple 0s and 1s into powerful intelligence.",
  },
  {
    id: "VSkwxCaS0uw",
    title: "How AI Understands Text: Tokens & Embeddings",
    description:
      "Discover how AI understands language with tokens and embeddings, the core of ChatGPT and GenAI. Ideal for beginners, students, professionals.",
  },
  {
    id: "F_s-apltHsA",
    title: "potting Patterns in AI Output",
    description:
      "Learn to spot patterns in AI text, improve prompts, and boost GenAI skills. Perfect for beginners, students, and professionals.",
  },
  {
    id: "YpvvhhZzsfg",
    title: "Inside a GPU – Where AI Really Lives",
    description:
      "Discover how GPUs power ChatGPT and GenAI. Learn cloud AI, hardware basics, and unlock future skills with Mission Million AI Coders.",
  },
  {
    id: "YTxKHsTLpwM",
    title: "AI Careers Unlocked – Meet the Team Behind GenAI",
    description:
      "Explore AI project roles—engineers, designers, testers, and trainers. Discover where you fit in GenAI with Mission Million AI Coders.",
  },
  {
    id: "x9IP_p6Mpd4",
    title: "Master RAG: Retrieval-Augmented Generation for Smarter AI",
    description:
      "Learn how RAG blends search with generation, improving AI accuracy. Discover its power in compliance, legal, and enterprise workflows.",
  },
  {
    id: "4qmIPsy1jHs",
    title: "Inside AI Memory: How Vectors Power Instant Answers",
    description:
      "Explore how AI stores and retrieves data with vector databases—fueling RAG, chatbots, and image search with real-time intelligence.",
  },
  {
    id: "csv-rCOTlMY",
    title: "Top Generative AI Tools to Master in 2025",
    description:
      "Discover GPT, Claude, Midjourney, DALL·E, Whisper, Runway, and Sora—AI tools transforming text, art, speech, and video creation today.",
  },
  {
    id: "GW5CZgZwNyc",
    title: "What is an LLM? Masterclass on Large Language Models",
    description:
      "Learn how LLMs like GPT-4, Claude, and Gemini work. Understand training, prediction, and prompt power in this AI masterclass",
  },
  {
    id: "BcvaxM0cfF0",
    title: "Top Programming Languages for LLM Development in 2025",
    description:
      "Discover Python, JavaScript, Go, and Rust — the essential languages behind AI and LLMs. Perfect for developers, students, and prompt engineers.",
  },
  {
    id: "KfZAAG0fsFE",
    title: "What is Prompt Engineering & Why It Matters",
    description:
      "Learn to craft effective prompts that improve AI responses, boost accuracy, unlock creativity, and master communication with ChatGPT and GenAI tools.",
  },
  {
    id: "mwXB3YjyNBA",
    title: "Chain of Thought Prompting: Make AI Think Step by Step",
    description:
      "Discover how Chain of Thought prompting improves AI reasoning, solves complex tasks, ensures transparency, and enhances structured problem-solving with GenAI tools.",
  },
  {
    id: "43WiDqpD0qw",
    title: "Prompt Engineering Masterclass: Future-Proof Your AI Skills",
    description:
      "Learn why prompt engineering is the next 25-year AI skill—unlock jobs, boost productivity, spark innovation, and shape tomorrow’s tech revolution.",
  },
  {
    id: "D9B1YBhPh_k",
    title: "Why Prompt Engineering Matters in the AI Era",
    description:
      "Prompt engineering bridges humans and AI—unlocking creativity, jobs, and innovation without coding. Master it to thrive in tomorrow’s AI-driven world.",
  },
  {
    id: "7MZGyEQ_PcE",
    title: "Capabilities of Microservices in Modern AI Platforms",
    description:
      "Microservices boost scalability, flexibility, and innovation by splitting apps into independent services—ideal for AI, cloud-native, and future-ready systems.",
  },
  {
    id: "Cg3yTHimojo",
    title: "5 Traits That Make a Great AI Prompt Engineer",
    description:
      "Great prompt engineers think critically, simplify complex ideas, test patiently, stay curious, and communicate clearly—future-ready skills for AI success.",
  },
  {
    id: "KfaUURipNoo",
    title: "Unlock AI Mastery with the 3-Part Prompt Formula",
    description:
      "Master the System–User–Assistant structure to shape AI behavior, refine instructions, iterate responses, and solve complex problems effectively every time..",
  },
  {
    id: "h4Gy5zyHwRM",
    title: "The Rise of AI Prompt Engineers",
    description:
      "Discover how prompt engineering empowers coders, writers, designers, and analysts, creating hybrid roles that boost productivity and future careers.",
  },
  {
    id: "SG8zP3xtG1Q",
    title: "Prompt Templates: Reuse, Remix, Repeat",
    description:
      "Learn to create, scale, and monetize AI prompt templates—boost productivity with reusable frames, variables, automation, and workflow consistency.",
  },
  {
    id: "2RURIZBUXt8",
    title: "Prompt Engineering Kit – Must-Have Tools for 2025",
    description:
      "Discover the essential toolkit every prompt engineer needs—research, testing, visuals, and sharing tools to level up AI workflows.",
  },
  {
    id: "4mcec9IfTw4",
    title: "Zero-Shot, One-Shot & Few-Shot Prompts Explained",
    description:
      "Learn the 3 core prompt types—zero, one, and few-shot—to guide AI outputs, improve accuracy, tone, and real-world results..",
  },
  {
    id: "ogrmL91njEU",
    title: "Can AI Get a Virus? Securing Your Prompts",
    description:
      "Discover prompt injection risks, jailbreak attacks, and safety tips to secure GenAI workflows, ensuring smarter, safer, and controlled AI use.",
  },
  {
    id: "bw4FTsxMa_E",
    title: "Debugging Prompts Like a Pro",
    description:
      "Master prompt debugging with clarity, precision, and structure — fix broken prompts fast to get accurate, reliable AI results every time.",
  },
  {
    id: "Ym0ZYTpcPTg",
    title: "Prompting Mistakes to Avoid",
    description:
      "Avoid vague prompts, multi-questions, and weak roles — fix mistakes to unlock clear, powerful AI responses every time.",
  },
  {
    id: "yebcT_p_5H8",
    title: "Prompt vs Completion – Know the Difference",
    description:
      "Learn how clear prompts shape AI completions. Master prompt vs response basics to boost clarity, automation, and GenAI results.",
  },
  {
    id: "LP_IicZEHYs",
    title: "From Average to Awesome: Upgrading Your Prompts",
    description:
      "Discover how to refine prompts with roles, examples, and style. Transform vague instructions into powerful GenAI outputs that truly impress.",
  },
  {
    id: "iZqil5BK1Wo",
    title: "Your First 5 Prompts – Get Started Today",
    description:
      "Kickstart your GenAI journey with 5 beginner-friendly prompts for emails, resumes, brainstorming, and more. Start mastering AI today!",
  },
  {
    id: "hhTOxiKF1KY",
    title: "Platforms & Niches for Prompt Engineers",
    description:
      "Discover top freelancing platforms, explore profitable niches, and learn how to monetize your AI prompt skills in today’s booming economy.",
  },
  {
    id: "MYPZWzu2DJM",
    title: "How to Earn as a Prompt Engineer",
    description:
      "Learn practical ways to monetize prompt engineering — from freelancing and prompt libraries to AI workflows and automation opportunities.",
  },
  {
    id: "bnYzu5j7ohs",
    title: "Creating Prompt Products – Templates & Packs",
    description:
      "Learn to transform prompt skills into digital products — resume packs, email templates, classroom prompts, and micro-products for growing AI income.",
  },
  {
    id: "1Bs5YeezU_Y",
    title: "Teaching Prompting to Others – Become a Mentor",
    description:
      "Share prompts, tutorials, and workshops to mentor beginners, strengthen your skills, and grow visibility while inspiring future AI learners.",
  },
  {
    id: "wJT9P-3lTOM",
    title: "Graduation Session – Step Into Your Next AI Journey",
    description:
      "Apply AI skills in real life, mentor others, join communities, and begin building, earning, and teaching with purpose.",
  },
  {
    id: "ZnERBfMN8Vc",
    title: "Build Your Prompt Portfolio – Showcase Your AI Skills",
    description:
      "Create a professional portfolio with examples, results, and improvements to demonstrate your prompt engineering expertise and impact.",
  },
  {
    id: "eVti8ARpO98",
    title: "Explore Career Opportunities in Prompt Engineering",
    description:
      "Discover high-demand AI careers for prompt engineers, from content strategist to chatbot designer, even without coding experience.",
  },
  {
    id: "BNa1FDaERc4",
    title: "Level Up Your Prompting Skills into an AI Career",
    description:
      "Advance from basic prompts to AI consulting expertise: optimize workflows, build libraries, train teams, and become a Prompt Architect.",
  },
  {
    id: "3AaF0VepqT8",
    title: "Master Instructional Prompts – Level 2 AI & GenAI Masterclass",
    description:
      "Learn to give clear, structured AI instructions, automate tasks, and boost productivity with instructional prompts for smarter outputs",
  },
  {
    id: "8KG3eJWGauA",
    title: "Level 1: Ad Hoc Prompting – Start Your AI Journey",
    description:
      "Learn the basics of casual AI prompting, its limits, and how to transition to structured, scalable prompt engineering.",
  },
  {
    id: "6VqxOOk2IkE",
    title: "Evaluated Prompting – Improve AI Accuracy & Reliability",
    description:
      "Learn to assess AI outputs, score effectiveness, refine prompts, and build trust for professional-level AI prompt engineering.",
  },
  {
    id: "vzMwzErB3i0",
    title:
      "Level 4: Precision Prompting – Smarter, Faster, Reliable AI Outputs",
    description:
      "Master structured prompts, reduce AI errors, guide with context, and achieve consistent, optimized outputs for smarter AI results.",
  },
  {
    id: "fJpyURIUXs0",
    title: "Advanced AI Agents & Copilots – Automate, Decide, Execute",
    description:
      "Learn to create AI agents and copilots, orchestrate workflows, enable decision-making, and unlock enterprise-level automation with GenAI.",
  },
].map((v) => ({
  ...v,
  thumbnail: `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
  url: `https://www.youtube.com/embed/${v.id}`,
}));
export default function OurAIVideos() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <section className="flex flex-col items-center max-w-7xl mx-auto bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-16 px-6 sm:px-8 md:px-12">
      {/* Heading */}
      <div className="text-center mb-10 max-w-4xl">
        <h3 className="text-2xl sm:text-2xl md:text-3xl font-extrabold text-purple-900 leading-tight">
          Unlock Your AI Potential with Our Masterclasses
        </h3>
        <div className="w-32 h-1.5 mt-3 mx-auto rounded-full bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400"></div>
        <p className="mt-4 text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed">
          Dive into expertly crafted AI masterclasses that guide you through
          cutting-edge technologies, tools, and strategies. Gain insights into
          AI applications across healthcare, finance, education, robotics, and
          more, and prepare for the AI-driven world of tomorrow.
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