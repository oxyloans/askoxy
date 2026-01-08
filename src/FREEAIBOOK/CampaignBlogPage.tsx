// CampaignBlogPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal, Spin, message, Input, Avatar, Tag } from "antd";
import {
  HeartFilled,
  HeartOutlined,
  DislikeFilled,
  DislikeOutlined,
  LoadingOutlined,
  UserOutlined,
  ShareAltOutlined,
  CommentOutlined,
  BellOutlined,
  TrophyOutlined,
  BookOutlined,
  CheckCircleOutlined,
  CrownOutlined,
  DownOutlined,
  UpOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import BASE_URL from "../Config";

import {
  fetchLikesAndComments,
  submitSubComment,
  submitUserInteraction,
} from "../components/servicesapi";

type ImageUrl = { imageId: string; imageUrl: string; status: boolean };

type CampaignData = {
  imageUrls: ImageUrl[];
  campaignType: string;
  message: string | null;
  campaignTypeAddBy: string;
  campaignDescription: string;
  campaignStatus: boolean;
  campaignId: string;
  createdAt: number;
  updatedAt: number;
};

type Comment = {
  mainComment: string;
  mainCommentId: string;
  subComments: { userId: string; comment: string }[];
};

const DEFAULT_CAMPAIGN_ID = "6972eb83-3bc4-4fa9-91a2-e1872b7c04bc";

// ✅ hero book image (no crop)
const HERO_IMG = "https://i.ibb.co/xt5tZN4K/book1.png";

// ✅ other images (no crop)
const AUTHOR_1_IMG = "https://i.ibb.co/W4PS3brm/radha.png";
const AUTHOR_2_IMG = "https://i.ibb.co/xSkwKSYm/rama.png";
const AUCTION_IMG = "https://i.ibb.co/wZNdq5ht/auction.png";

const STATIC = {
  title: "📘 Enter the AI & GenAI Universe",
  subtitle: "A Practical Guide to Build Your AI Future",
  intro: [
    "Enter the AI & GenAI Universe is a beginner-friendly yet powerful guide for anyone who wants to understand and use Artificial Intelligence in real life.",
    "With 65 practical, easy-to-follow chapters, the book simplifies AI, Generative AI, Prompt Engineering, LLMs, AI Agents, and future AI careers—no technical background required.",
  ],

  auctionTitle: "🎉 Exclusive First Copy Auction",
  auctionTop: [
    "✅ Minimum bid starts from ₹699",
    "🏆 Winner gets an exclusive 1-on-1 CEO session",
    "📅 Auction ends soon (limited window)",
    "📘 First signed copy + bonus rewards",
  ],
  rewards: [
    { title: "Signed Book", icon: "📘" },
    { title: "CEO Session", icon: "👑" },
    { title: "Certificate", icon: "🏅" },
    { title: "AI Tools Bundle", icon: "🧰" },
  ],

  // ✅ EXACT authors content you provided
  authorsText:
    "Radhakrishna Thatavarti – Founder & CEO, ASKOXY.AI | ET Excellence Award Winner\n" +
    "A visionary AI leader focused on turning AI learning into AI ownership.\n\n" +
    "Ramadevi Thatavarti – Co-Author | ET Excellence Award Winner\n" +
    "Brings a simple, human-centric approach to make AI accessible for everyone.\n\n" +
    "Together, they turn AI knowledge into real-world action.",

  authorsFaq: [
    {
      id: "who",
      q: "Who are the authors of the book?",
      a: "Radhakrishna Thatavarti (Founder & CEO, ASKOXY.AI) and Ramadevi Thatavarti (Co-Author). Both are ET Excellence Award Winners.",
    },
    {
      id: "why",
      q: "What makes this book different?",
      a: "It’s designed to be beginner-friendly and practical—focused on understanding, using, and applying AI in real life with a creator mindset.",
    },
    {
      id: "benefits",
      q: "What does the winner of the first copy auction get?",
      a: "A signed first copy and a premium 1-on-1 CEO session + bonus rewards as listed in the auction section.",
    },
    {
      id: "howbid",
      q: "How do I place my bid?",
      a: "Open Comments and post your details: Name, LinkedIn URL, and Bid Amount (Min ₹699).",
    },
  ],

  learnSections: [
    {
      title: "🌟 Why This Book Matters",
      bullets: [
        "AI is no longer optional—it's a core life and career skill",
        "Understand AI without technical jargon",
        "Use AI tools confidently in real-world scenarios",
        "Think like an AI creator, not just a user",
        "Prepare for AI-driven careers of the future",
      ],
    },
    {
      title: "📚 What You'll Learn",
      bullets: [
        "AI & Generative AI fundamentals made simple",
        "Prompt Engineering (Zero-shot, Few-shot, Role-based)",
        "LLMs, Tokens, Embeddings & Vector Databases",
        "AI Tools, Platforms & real-world use cases",
        "AI Agents, Multi-Agent Systems",
        "Practical implementation mindset",
      ],
    },
    {
      title: "🚀 Bonus Benefits",
      bullets: [
        "90-Day AI Job Ready roadmap",
        "Mission AI Co-Founders community access",
        "AI product + monetization mindset",
        "Lifetime updates (as available)",
      ],
    },
    {
      title: "👥 Who Should Read This?",
      bullets: [
        "Students & fresh graduates",
        "Working professionals seeking AI skills",
        "Entrepreneurs & business owners",
        "Non-IT backgrounds starting AI",
        "Anyone curious about AI careers",
      ],
    },
  ],
};

function slugify(text: string) {
  return (text || "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

export default function CampaignBlogPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

  const [scrollY, setScrollY] = useState(0);

  const campaignId = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return sp.get("campaignId") || DEFAULT_CAMPAIGN_ID;
  }, [location.search]);

  const [loading, setLoading] = useState(true);
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);

  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeReplyCommentId, setActiveReplyCommentId] = useState<string | null>(
    null
  );
  const [commentText, setCommentText] = useState("");

  const [actionLoading, setActionLoading] = useState<{
    like?: boolean;
    dislike?: boolean;
    subscribe?: boolean;
    comment?: boolean;
  }>({});

  const [openAuthorFaqId, setOpenAuthorFaqId] = useState<string>("who");

  const auctionImage = useMemo(() => {
    const actives = (campaignData?.imageUrls || []).filter(
      (x) => x.status && x.imageUrl
    );
    return actives[0]?.imageUrl || AUCTION_IMG;
  }, [campaignData]);

  const shareUrl = useMemo(() => {
    const title = campaignData?.campaignType || STATIC.title;
    return `${window.location.origin}/blog/${campaignId.slice(-4)}/${slugify(
      title
    )}`;
  }, [campaignData?.campaignType, campaignId]);

  const requireLogin = (msgText: string) => {
    message.warning(msgText);
    sessionStorage.setItem("redirectPath", shareUrl);
    navigate("/whatsappregister");
  };

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${BASE_URL}/marketing-service/campgin/getCampaignDatadetailsById/${campaignId}`
        );
        const data: CampaignData = await res.json();
        setCampaignData(data);

        const details = await fetchLikesAndComments(campaignId, userId || null);
        setLikeCount(details.likesTotalCount || 0);
        setDislikeCount(details.dislikesTotalCount || 0);
        setComments(details.subComments || []);
        setLiked(!!details.isLiked);
        setDisliked(!!details.isDisliked);
        setSubscribed(!!details.isSubscribed);
      } catch (e) {
        console.error(e);
        message.error("Failed to load blog.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [campaignId, userId]);

  const refreshComments = async () => {
    try {
      const details = await fetchLikesAndComments(campaignId, userId || null);
      setComments(details.subComments || []);
    } catch {
      // ignore
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: campaignData?.campaignType || STATIC.title,
          text: STATIC.subtitle,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        message.success("Link copied!");
      }
    } catch {
      // ignore cancel
    }
  };

  const handleLike = async () => {
    if (!accessToken) return requireLogin("Please login to like this post.");
    setActionLoading((p) => ({ ...p, like: true }));
    try {
      const newLikeStatus = liked ? "no" : "yes";
      const ok = await submitUserInteraction({
        campaignId,
        interavtionType: "LIKEORDISLIKE",
        likeStatus: newLikeStatus,
        userId,
      });
      if (ok) {
        setLikeCount((c) => (liked ? Math.max(0, c - 1) : c + 1));
        setLiked((v) => !v);
        if (disliked) {
          setDisliked(false);
          setDislikeCount((c) => Math.max(0, c - 1));
        }
      }
    } finally {
      setActionLoading((p) => ({ ...p, like: false }));
    }
  };

  const handleDislike = async () => {
    if (!accessToken) return requireLogin("Please login to dislike this post.");
    setActionLoading((p) => ({ ...p, dislike: true }));
    try {
      const newLikeStatus = disliked ? "yes" : "no";
      const ok = await submitUserInteraction({
        campaignId,
        interavtionType: "LIKEORDISLIKE",
        likeStatus: newLikeStatus,
        userId,
      });
      if (ok) {
        setDislikeCount((c) => (disliked ? Math.max(0, c - 1) : c + 1));
        setDisliked((v) => !v);
        if (liked) {
          setLiked(false);
          setLikeCount((c) => Math.max(0, c - 1));
        }
      }
    } finally {
      setActionLoading((p) => ({ ...p, dislike: false }));
    }
  };

  const handleSubscribe = async () => {
    if (!accessToken || !userId) return requireLogin("Please login to subscribe.");
    setActionLoading((p) => ({ ...p, subscribe: true }));
    try {
      const newSubscribedStatus = subscribed ? "no" : "yes";
      const ok = await submitUserInteraction({
        campaignId,
        interavtionType: "SUBSCRIBE",
        subscribed: newSubscribedStatus,
        userId,
      });
      if (ok) setSubscribed((v) => !v);
    } finally {
      setActionLoading((p) => ({ ...p, subscribe: false }));
    }
  };

  const openComments = async () => {
    setCommentsOpen(true);
    await refreshComments();
  };

  const submitComment = async () => {
    if (!accessToken || !userId) return requireLogin("Please login to comment.");
    if (!commentText.trim()) return message.error("Please enter a comment.");

    setActionLoading((p) => ({ ...p, comment: true }));
    try {
      if (activeReplyCommentId) {
        const ok = await submitSubComment(activeReplyCommentId, commentText, userId);
        if (!ok) return message.error("Failed to submit reply.");
      } else {
        const ok = await submitUserInteraction({
          campaignId,
          interavtionType: "COMMENTS",
          userComments: commentText,
          userId,
        });
        if (!ok) return message.error("Failed to submit comment.");
      }
      await refreshComments();
      setCommentText("");
      setActiveReplyCommentId(null);
      message.success("Posted successfully!");
    } catch {
      message.error("Failed to post.");
    } finally {
      setActionLoading((p) => ({ ...p, comment: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          <div className="mt-4 text-purple-700 font-semibold">Loading Campaign...</div>
        </div>
      </div>
    );
  }

  if (!campaignData) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-purple-200 rounded-2xl p-6 text-center shadow-sm">
          <div className="text-2xl font-bold text-purple-800 mb-2">Blog Not Found</div>
          <div className="text-slate-600 mb-5">The requested campaign blog could not be loaded.</div>
          <button
            className="px-5 py-3 rounded-xl bg-purple-700 text-white font-bold hover:opacity-95 transition"
            onClick={() => navigate("/")}
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 relative overflow-hidden">
      {/* ✅ LIGHT BACKGROUND (white + light purple lines) */}
      <div className="fixed inset-0 pointer-events-none">
        <svg className="w-full h-full opacity-70" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M60 0H0V60" fill="none" stroke="#c4b5fd" strokeWidth="1" opacity="0.25" />
            </pattern>

            <pattern id="diag" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M0 120 L120 0" stroke="#a78bfa" strokeWidth="1" opacity="0.18" />
              <path d="M-20 100 L100 -20" stroke="#a78bfa" strokeWidth="1" opacity="0.12" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#diag)" />
        </svg>
      </div>

      {/* soft blobs */}
      <div className="fixed -top-24 -left-24 w-[420px] h-[420px] bg-purple-200 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="fixed -bottom-28 -right-28 w-[520px] h-[520px] bg-violet-200 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="relative z-10">
        {/* top action bar */}
        <div className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl border-b border-purple-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-6 py-3 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="text-sm text-purple-800 font-extrabold truncate">
                {campaignData?.campaignType || STATIC.title}
              </div>
              <div className="text-xs text-slate-600 truncate">{STATIC.subtitle}</div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={openComments}
                className="px-4 py-2 rounded-full bg-white border border-purple-200 hover:border-purple-300 transition font-bold text-sm"
              >
                <CommentOutlined /> Comments ({comments.length})
              </button>

              <button
                onClick={handleShare}
                className="px-4 py-2 rounded-full bg-purple-700 text-white font-bold hover:opacity-95 transition text-sm"
              >
                <ShareAltOutlined /> Share
              </button>
            </div>
          </div>
        </div>

        {/* HERO */}
        <header className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-6 pt-8 sm:pt-12 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left content */}
            <div style={{ transform: `translateY(${scrollY * 0.04}px)` }}>
              <div className="inline-flex items-center gap-3 mb-6 bg-white px-6 py-3 rounded-full border border-purple-200 shadow-sm">
                <div className="text-sm sm:text-base font-extrabold text-purple-800">
                  {STATIC.title}
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-slate-900">
                {STATIC.subtitle}
                <br />
                <span className="text-purple-800">Bid the first signed copy (Min ₹699)</span>
              </h1>

              <div className="mt-4 space-y-2 text-slate-700 leading-relaxed">
                {STATIC.intro.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <button
                  onClick={handleSubscribe}
                  disabled={actionLoading.subscribe}
                  className={`px-5 py-3 rounded-2xl font-extrabold border transition ${
                    subscribed
                      ? "bg-slate-100 border-slate-200 text-slate-900"
                      : "bg-white border-purple-200 text-purple-800 hover:border-purple-300"
                  }`}
                >
                  <BellOutlined /> {subscribed ? "Subscribed ✓" : "Subscribe"}
                </button>

                <div className="sm:ml-auto flex gap-2 flex-wrap">
                  <button
                    onClick={handleLike}
                    disabled={actionLoading.like}
                    className={`px-4 py-3 rounded-2xl border font-bold transition bg-white ${
                      liked ? "border-purple-500" : "border-purple-200"
                    }`}
                  >
                    {liked ? <HeartFilled style={{ color: "#ef4444" }} /> : <HeartOutlined />}{" "}
                    Like ({likeCount})
                  </button>

                  <button
                    onClick={handleDislike}
                    disabled={actionLoading.dislike}
                    className={`px-4 py-3 rounded-2xl border font-bold transition bg-white ${
                      disliked ? "border-purple-500" : "border-purple-200"
                    }`}
                  >
                    {disliked ? <DislikeFilled /> : <DislikeOutlined />} Dislike ({dislikeCount})
                  </button>

                  <button
                    onClick={openComments}
                    className="px-4 py-3 rounded-2xl border font-bold transition bg-white border-purple-200"
                  >
                    <CommentOutlined /> Comments ({comments.length})
                  </button>
                </div>
              </div>

            </div>

            {/* Right hero image (NO CROP) */}
            <div className="bg-white rounded-2xl border border-purple-200 shadow-sm p-4">
              <div className="relative w-full rounded-2xl bg-slate-50 border border-purple-100">
                <div className="absolute top-4 left-4 z-10 flex gap-2 flex-wrap">
                  <Tag color="purple" icon={<BookOutlined />}>
                    AI Guide
                  </Tag>
                  <Tag color="geekblue" icon={<CheckCircleOutlined />}>
                    65 Chapters
                  </Tag>
                  <Tag color="magenta">Min ₹699</Tag>
                </div>

                <img
                  src={HERO_IMG}
                  alt="Book"
                  className="w-full h-[360px] sm:h-[440px] object-contain p-6"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </header>

        {/* AUCTION SECTION */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-6 pb-10">
          <div className="bg-white rounded-3xl border border-purple-200 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="text-xl sm:text-2xl font-extrabold text-purple-800 flex items-center gap-2">
                <TrophyOutlined /> {STATIC.auctionTitle}
              </div>
              <button
                onClick={openComments}
                className="px-4 py-2 rounded-full bg-white border border-purple-200 text-purple-800 font-bold hover:border-purple-300 transition"
              >
                <CommentOutlined /> Place Bid
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-2xl border border-purple-100 p-4">
                <img
                  src={auctionImage || AUCTION_IMG}
                  alt="Auction"
                  className="w-full h-[260px] sm:h-[320px] object-contain"
                  loading="lazy"
                />
                <div className="mt-4 flex gap-2 flex-wrap">
                  <Tag color="magenta" icon={<CrownOutlined />}>
                    First Copy
                  </Tag>
                  <Tag color="purple">Min ₹699</Tag>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STATIC.auctionTop.map((pt, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-purple-200 p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center">
                        <CheckCircleOutlined style={{ color: "#6d28d9" }} />
                      </div>
                      <div className="font-semibold text-slate-800 leading-snug">{pt}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <div className="text-lg font-extrabold text-slate-900 mb-3">🏆 Rewards</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {STATIC.rewards.map((r, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-2xl border border-purple-100 p-4">
                    <div className="text-4xl">{r.icon}</div>
                    <div className="mt-3 font-bold text-slate-900">{r.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* AUTHORS SECTION (2 in same row + content) */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-6 pb-10">
          <div className="bg-white rounded-3xl border border-purple-200 shadow-sm p-6 sm:p-8">
            <div className="text-xl sm:text-2xl font-extrabold text-purple-800 flex items-center gap-2">
              <BookOutlined /> About the Authors
            </div>

            {/* ✅ content + two cards same row */}
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="bg-slate-50 border border-purple-100 rounded-2xl p-5">
                <div className="font-extrabold text-slate-900 mb-2">Author Summary</div>
                <pre className="m-0 whitespace-pre-wrap break-words text-slate-700 text-sm leading-relaxed">
                  {STATIC.authorsText}
                </pre>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-purple-200 rounded-2xl p-4">
                  <img
                    src={AUTHOR_1_IMG}
                    alt="Radhakrishna Thatavarti"
                    className="w-full h-[180px] object-contain"
                  />
                  <div className="mt-3 font-extrabold text-slate-900">
                    Radhakrishna Thatavarti
                  </div>
                  <div className="text-sm text-slate-600">
                    Founder & CEO, ASKOXY.AI | ET Excellence Award Winner
                  </div>
                </div>

                <div className="bg-white border border-purple-200 rounded-2xl p-4">
                  <img
                    src={AUTHOR_2_IMG}
                    alt="Ramadevi Thatavarti"
                    className="w-full h-[180px] object-contain"
                  />
                  <div className="mt-3 font-extrabold text-slate-900">Ramadevi Thatavarti</div>
                  <div className="text-sm text-slate-600">
                    Co-Author | ET Excellence Award Winner
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ Authors FAQ below */}
            <div className="mt-8">
              <div className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <QuestionCircleOutlined style={{ color: "#6d28d9" }} /> Authors FAQ
              </div>

              <div className="mt-4 space-y-3">
                {STATIC.authorsFaq.map((f) => {
                  const open = openAuthorFaqId === f.id;
                  return (
                    <div
                      key={f.id}
                      className="bg-slate-50 border border-purple-100 rounded-2xl p-5 cursor-pointer"
                      onClick={() => setOpenAuthorFaqId(open ? "" : f.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="font-extrabold text-slate-900">{f.q}</div>
                        <div className="w-9 h-9 rounded-full bg-white border border-purple-200 flex items-center justify-center">
                          {open ? <UpOutlined /> : <DownOutlined />}
                        </div>
                      </div>

                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          open ? "max-h-96 mt-3" : "max-h-0"
                        }`}
                      >
                        <div className="text-slate-700 leading-relaxed">{f.a}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Learn grid */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-6 pb-14">
          <div className="text-center mb-8">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              What You Get Inside
            </div>
            <div className="text-slate-600 mt-2">
              Clean learning path + practical understanding.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STATIC.learnSections.map((section, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-purple-200 p-6 shadow-sm"
              >
                <div className="font-extrabold text-purple-800 mb-3">{section.title}</div>
                <ul className="space-y-2 text-sm text-slate-700">
                  {section.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <CheckCircleOutlined style={{ color: "#6d28d9" }} className="mt-0.5" />
                      <span className="leading-snug">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* COMMENTS MODAL */}
      <Modal
        open={commentsOpen}
        onCancel={() => {
          setCommentsOpen(false);
          setActiveReplyCommentId(null);
          setCommentText("");
        }}
        footer={null}
        width="90%"
        className="comments-modal"
        style={{ maxWidth: 900 }}
      >
        <div className="p-4 sm:p-6 rounded-2xl bg-white border border-purple-200 text-slate-900 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="font-extrabold text-purple-800 flex items-center gap-2">
              <CommentOutlined /> Comments ({comments.length})
            </div>
          </div>

          <div className="space-y-3 max-h-[50vh] overflow-auto pr-1">
            {comments.length === 0 ? (
              <div className="text-center py-10 text-slate-600">
                <div className="text-4xl mb-2">💬</div>
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.mainCommentId}
                  className="bg-slate-50 border border-purple-100 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <Avatar icon={<UserOutlined />} />
                    <div className="font-bold text-slate-900">User</div>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-white border border-purple-100">
                    <pre className="m-0 whitespace-pre-wrap break-words text-slate-700 text-sm">
                      {comment.mainComment}
                    </pre>
                  </div>

                  <div className="mt-3">
                    <button
                      className="px-3 py-1 rounded-full bg-white border border-purple-200 font-bold text-purple-800 hover:border-purple-300 transition"
                      onClick={() => setActiveReplyCommentId(comment.mainCommentId)}
                    >
                      Reply
                    </button>
                  </div>

                  {comment.subComments?.length > 0 && (
                    <div className="mt-4 space-y-2 pl-2">
                      {comment.subComments.map((reply, i) => (
                        <div
                          key={i}
                          className="bg-white border border-purple-100 rounded-xl p-3"
                        >
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Avatar size="small" icon={<UserOutlined />} />
                            <span className="font-bold text-slate-900">
                              {reply.userId || "User"}
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-slate-700">{reply.comment}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="mt-5">
            {activeReplyCommentId && (
              <div className="mb-2 text-sm text-slate-600 flex items-center justify-between">
                <span>Replying to comment…</span>
                <button
                  className="text-purple-800 font-bold"
                  onClick={() => setActiveReplyCommentId(null)}
                >
                  Cancel
                </button>
              </div>
            )}

            <Input.TextArea
              rows={4}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={
                activeReplyCommentId
                  ? "Write your reply here..."
                  : "Write your comment (Name, LinkedIn URL, Bid Amount)..."
              }
              className="!bg-white !text-slate-900 !border-purple-200"
            />

            <button
              onClick={submitComment}
              disabled={actionLoading.comment}
              className="mt-3 w-full px-5 py-3 rounded-2xl bg-purple-700 text-white font-extrabold hover:opacity-95 transition disabled:opacity-60"
            >
              {actionLoading.comment ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>
      </Modal>

      <style>{`
        .comments-modal .ant-modal-content {
          background: transparent !important;
          box-shadow: none !important;
        }
        .comments-modal .ant-modal-close-x {
          color: #111827 !important;
        }
      `}</style>
    </div>
  );
}
