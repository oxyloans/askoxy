import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
import Categories from "./categories";
import rice1 from "../assets/img/ricecard1.png";
import offer1 from "../assets/img/off1.png";
import offer2 from "../assets/img/off2.png";
import offer3 from "../assets/img/off3.png";
import offer4 from "../assets/img/off4.png";
import offer5 from "../assets/img/off5.png";
import offer6 from "../assets/img/off6.png";
import offer7 from "../assets/img/off7.png";
import offer8 from "../assets/img/off8.png";
import RiceOfferFAQs from "../Dashboard/Faqs";
import { CartContext } from "../until/CartContext";
import VideoImage from "../assets/img/Videothumb.png";
import {
  FaSearch,
  FaUniversity,
  FaMoneyBillWave,
  FaTimes,
  FaQuestionCircle,
  FaExternalLinkAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import {
  GraduationCap,
  XIcon,
  Award,
  PlayCircle,
  FileText,
  Globe,
  ArrowRight,
  Gift,
  Sparkles,
  Package,
  ShoppingBag,
  Info,
} from "lucide-react";
import BASE_URL from "../Config";
import { Modal } from "antd";

interface Item {
  itemName: string;
  itemId: string;
  itemImage: null | string;
  weight: string;
  itemPrice: number;
  quantity: number;
  itemMrp: number;
  units: string;
  inStock?: boolean;
}

interface SubCategory {
  id: string;
  name: string;
  image?: string | null;
}

interface Category {
  categoryName: string;
  categoryImage: string | null;
  categoryLogo?: string;
  itemsResponseDtoList: Item[];
  subCategories?: SubCategory[];
}

// Skeleton Loader Components
const ProductSkeletonItem: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
    <div className="h-40 bg-gray-200"></div>
    <div className="p-3">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
      <div className="flex justify-between items-center">
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  </div>
);

const CategorySkeletonItem: React.FC = () => (
  <div className="px-2 py-1 rounded-full bg-gray-200 animate-pulse w-24 h-8 mx-1"></div>
);

// OxyLoans Modal Component
const OxyLoansModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-blue-700">OxyLoans Services</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Access OxyLoans services for all your financial needs via our app or
          website!
        </p>

        {/* App Store Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
          <a
            href="https://play.google.com/store/apps/details?id=com.oxyloans.lender"
            className="transition-transform hover:scale-105 w-full sm:w-auto flex justify-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png"
              alt="Google Play Store"
              className="h-12"
            />
          </a>
          <a
            href="https://apps.apple.com/in/app/oxyloans-lender/id6444208708"
            className="transition-transform hover:scale-105 w-full sm:w-auto flex justify-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="App Store"
              className="h-12"
            />
          </a>
        </div>

        {/* Website Button */}
        <div className="flex justify-center">
          <a
            href="https://oxyloans.com/signup"
            className="bg-white text-blue-600 font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-blue-600 flex items-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            Go To OxyLoans <FaExternalLinkAlt className="ml-2 w-4 h-4" />
          </a>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Lend and Earn Upto 1.75% Monthly ROI and 24% P.A.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SkeletonLoader: React.FC = () => (
  <>
    {/* Skeleton for products grid */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
      {Array(10)
        .fill(0)
        .map((_, index) => (
          <ProductSkeletonItem key={index} />
        ))}
    </div>
  </>
);

// FAQ Component
const FAQModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"container" | "referral">(
    "container"
  );
  const [scrolledToTop, setScrolledToTop] = useState(true);
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Scroll to top when tab changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
      setScrolledToTop(true);
    }
  }, [activeTab]);

  // Track scroll position
  const handleScroll = () => {
    if (contentRef.current) {
      setScrolledToTop(contentRef.current.scrollTop === 0);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-xl mx-auto h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-purple-800">
            Frequently Asked Questions
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 px-4 font-medium text-sm transition-colors ${
              activeTab === "container"
                ? "border-b-2 border-purple-600 text-purple-800"
                : "text-gray-600 hover:text-purple-600"
            }`}
            onClick={() => setActiveTab("container")}
          >
            Free Steel Container Policy
          </button>
          <button
            className={`flex-1 py-3 px-4 font-medium text-sm transition-colors ${
              activeTab === "referral"
                ? "border-b-2 border-purple-600 text-purple-800"
                : "text-gray-600 hover:text-purple-600"
            }`}
            onClick={() => setActiveTab("referral")}
          >
            Referral Program
          </button>
        </div>

        {/* Shadow when scrolled */}
        <div
          className={`h-2 bg-gradient-to-b from-gray-100 to-transparent transition-opacity ${
            scrolledToTop ? "opacity-0" : "opacity-100"
          }`}
        ></div>

        {/* Content */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto p-4 pb-6"
          onScroll={handleScroll}
        >
          {activeTab === "container" ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-purple-800 mb-2">
                  About ASKOXY.AI
                </h3>
                <p className="text-gray-700">
                  ASKOXY.AI is an AI-powered platform integrating{" "}
                  <em>34+ marketplaces</em>, designed to simplify lives with
                  innovative solutions, including{" "}
                  <strong>premium rice delivery</strong>.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-purple-800 mb-2">
                  Who is the founder of ASKOXY.AI?
                </h3>
                <p className="text-gray-700">
                  AskOxy.ai is led by <em>Radhakrishna Thatavarti</em> (
                  <a
                    href="https://www.linkedin.com/in/oxyradhakrishna/"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                  ), an entrepreneur with <em>over 24 years of experience</em>{" "}
                  in software technology and business leadership. His vision is
                  to <em>empower communities</em> through sustainable,
                  customer-centric solutions using{" "}
                  <em>AI, Blockchain, and Java technologies</em>.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-purple-800 mb-2">
                  Free Steel Container Policy
                </h3>
              </div>

              <div>
                <h4 className="font-medium text-purple-700 mb-1">
                  What is the Free Steel Container offer?
                </h4>
                <p className="text-gray-700">
                  Customers who purchase a <em>26kg rice bag</em> will receive a{" "}
                  <em>FREE steel rice container</em>. However, the container
                  remains the <strong>property of OXY Group</strong> until
                  ownership is earned.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-purple-700 mb-1">
                  How can I earn ownership of the steel container?
                </h4>
                <p className="text-gray-700">
                  You can <em>own</em> the container by meeting <em>either</em>{" "}
                  of the following criteria:
                </p>
                <ol className="list-decimal ml-5 mt-2 space-y-1">
                  <li className="text-gray-700">
                    <em>Refer 9 new users</em> to ASKOXY.AI.
                  </li>
                  <li className="text-gray-700">
                    <em>Purchase 9 rice bags</em> within <em>3 years</em>.
                  </li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium text-purple-700 mb-1">
                  What happens if I do not purchase regularly?
                </h4>
                <ul className="list-disc ml-5 space-y-1">
                  <li className="text-gray-700">
                    If you <em>do not make a purchase within 90 days</em>, or
                  </li>
                  <li className="text-gray-700">
                    If there is a <em>gap of 90 days between purchases</em>,
                  </li>
                </ul>
                <p className="text-gray-700 mt-2">
                  then the <em>container will be taken back</em>.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-purple-700 mb-1">
                  How long does delivery take for the rice bag and container?
                </h4>
                <ul className="list-disc ml-5 space-y-1">
                  <li className="text-gray-700">
                    The <em>rice bag</em> will be delivered{" "}
                    <em>within 24 hours</em>.
                  </li>
                  <li className="text-gray-700">
                    Due to high demand, <em>container delivery</em> may be
                    delayed.
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-purple-700 mb-1">
                  Who is eligible to be referred under this program?
                </h4>
                <p className="text-gray-700">
                  Only <em>new users</em> who are <em>not yet registered</em> on
                  ASKOXY.AI can be referred.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-purple-800 mb-2">
                  Referral Program – Earn a Free Container & ₹50 Cashback!
                </h3>
              </div>

              <div>
                <h4 className="font-medium text-purple-700 mb-1">
                  How do I refer someone?
                </h4>
                <ul className="list-disc ml-5 space-y-1">
                  <li className="text-gray-700">
                    Share your <em>unique referral link</em> with your friends.
                  </li>
                  <li className="text-gray-700">
                    Your friend must <em>sign up</em> using your referral link
                    during registration.
                  </li>
                  <li className="text-gray-700">
                    Once they{" "}
                    <em>place an order for rice and do not cancel it</em>,
                    you'll receive the reward.
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-purple-700 mb-1">
                  What rewards do I get for referring a friend?
                </h4>
                <p className="text-gray-700">
                  Apart from getting a <em>free steel container</em>, you will
                  also receive <strong>₹50 cashback</strong> in your{" "}
                  <em>ASKOXY.AI wallet</em> when you successfully refer someone.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-purple-700 mb-1">
                  When will I receive my referral reward?
                </h4>
                <p className="text-gray-700">
                  Referral rewards are credited{" "}
                  <em>
                    once your referred friend successfully places an order and
                    does not cancel it
                  </em>
                  .
                </p>
              </div>

              <div>
                <h4 className="font-medium text-purple-700 mb-1">
                  Where can I check my referral status?
                </h4>
                <p className="text-gray-700">
                  You can track your referrals in your{" "}
                  <em>ASKOXY.AI dashboard</em>.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-purple-700 mb-1">
                  Is there a limit to the number of people I can refer?
                </h4>
                <p className="text-gray-700">
                  No, you can refer <em>as many friends as you like</em>. You
                  will receive{" "}
                  <strong>₹50 cashback for each successful referral</strong>,
                  subject to promotional terms.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-purple-700 mb-1">
                  What happens if my friend forgets to use my referral link?
                </h4>
                <p className="text-gray-700">
                  Referrals must <em>use your link at the time of sign-up</em>.
                  If they forget, the referral may not be counted, and you will{" "}
                  <strong>not receive the reward</strong>.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-purple-700 mb-1">
                  Can I refer myself using another account?
                </h4>
                <p className="text-gray-700">
                  No, <em>self-referrals</em> are not allowed. Fraudulent
                  activity may lead to disqualification from the referral
                  program.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-purple-700 mb-1">
                  Who do I contact if I have issues with my referral reward?
                </h4>
                <p className="text-gray-700">
                  If you have any issues with your referral reward, please
                  contact <em>ASKOXY.AI support</em> at:
                </p>
                <p className="text-gray-700 mt-2">
                  📞 <em>Phone:</em> <strong>+91 81432 71103</strong>
                  <br />
                  📧 <em>Email:</em> <strong>SUPPORT@ASKOXY.AI</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Ricebags: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All Items");
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState("video");
  const [showScholarshipModal, setShowScholarshipModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [customerId, setCustomerId] = useState<string>("");
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [noResults, setNoResults] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [showOxyLoansModal, setShowOxyLoansModal] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();
  const minSwipeDistance = 50;
  const isSmallScreen = window.innerWidth < 768;
  const imagesPerView = isSmallScreen ? 1 : 2;
  const transitionDuration = 1000; // 1 sec smooth scroll
  const autoSlideDelay = 5000; // wait 5 seconds between scrolls
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);

  const bannerImages = [
    offer1,
    offer2,
    offer3,
    offer4,
    offer5,
    offer6,
    offer7,
    offer8,
  ].map((src, i) => ({ src, alt: `Offer ${i + 1}` }));

  const extendedImages = [
    ...bannerImages,
    ...bannerImages.slice(0, imagesPerView),
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev >= maxIndex ? 0 : prev + imagesPerView
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev <= 0 ? maxIndex : prev - imagesPerView
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(Math.min(index, maxIndex));
  };
  const maxIndex = Math.max(0, bannerImages.length - imagesPerView);

  useEffect(() => {
    if (location.state?.searchQuery) {
      setSearchTerm(location.state.searchQuery);
    }
  }, [location.state]);

  const handleItemClick = (item: Item) => {
    navigate(`/main/itemsdisplay/${item.itemId}`, {
      state: { item },
    });
  };

  useEffect(() => {
    if (!isAutoSliding) return;

    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prevIndex) => prevIndex + 1);
    }, 5000); // 5 seconds

    return () => clearInterval(intervalRef.current!);
  }, [isAutoSliding]);

  useEffect(() => {
    const maxIndex = bannerImages.length;

    if (currentImageIndex === maxIndex) {
      // Wait for the transition to finish before jumping
      const timeout = setTimeout(() => {
        setIsTransitioning(false); // turn off animation
        setCurrentImageIndex(0); // jump to real first slide
      }, 1500); // match transition duration

      return () => clearTimeout(timeout);
    } else {
      setIsTransitioning(true); // enable animation
    }
  }, [currentImageIndex, bannerImages.length]);

  const scrollToSection = (categoryName: string) => {
    const categorySection =
      document.querySelector(`[data-category="${categoryName}"]`) ||
      document.getElementById(categoryName) ||
      document.querySelector(".categories-section");

    if (categorySection) {
      const yOffset = -80;
      const y =
        categorySection.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    } else {
      window.scrollBy({
        top: window.innerHeight / 2,
        behavior: "smooth",
      });
    }
  };

  const context = useContext(CartContext);
  if (!context) {
    throw new Error("CartDisplay must be used within a CartProvider");
  }
  const { count, setCount } = context;

  const handleBannerClick = (index: number) => {
    switch (index) {
      case 0:
        setActiveCategory("Essentials Mart");
        scrollToSection("Essentials Mart");
        break;
      case 1:
        setActiveCategory("GOLD");
        scrollToSection("GOLD");
        break;
      case 2:
        setActiveCategory("Kitchen Elixirs");
        scrollToSection("Kitchen Elixirs");
        break;
      case 3:
        setActiveCategory("Snacking");
        scrollToSection("Snacking");
        break;
      case 4:
        setShowAppModal(true);
        break;
      case 5:
        setShowFAQModal(true);
        break;
      case 6:
        setActiveCategory("Kolam Rice");
        scrollToSection("Kolam Rice");
        break;
      case 7:
        setShowOxyLoansModal(true);
        break;
      default:
        break;
    }
  };

  const handleMouseEnter = () => {
    setIsAutoSliding(false);
  };

  const handleMouseLeave = () => {
    setIsAutoSliding(true);
  };

  const handleBannerTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleBannerTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleBannerTouchEnd = () => {
    const distance = touchEndX.current - touchStartX.current;
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        prevImage();
      } else {
        nextImage();
      }
    }
  };
  // Sort items function: in-stock items first, out-of-stock items last
  const sortItemsByStock = (items: Item[]): Item[] => {
    return [...items].sort((a, b) => {
      // Assume items with quantity > 0 are in stock
      const aInStock = a.quantity > 0;
      const bInStock = b.quantity > 0;

      // Set the inStock property for each item
      a.inStock = aInStock;
      b.inStock = bInStock;

      // Sort in-stock items first
      if (aInStock && !bInStock) return -1;
      if (!aInStock && bInStock) return 1;
      return 0;
    });
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          BASE_URL + "/product-service/showItemsForCustomrs"
        );
        const data: Category[] = response.data;

        const uniqueItemsMap = new Map<string, Item>();

        // Collect all items and ensure uniqueness only by itemId
        data.forEach((category) => {
          category.itemsResponseDtoList.forEach((item) => {
            if (!uniqueItemsMap.has(item.itemId)) {
              uniqueItemsMap.set(item.itemId, item);
            }
          });
        });

        // Convert map values to array for our "All Items" category
        const uniqueItemsList = Array.from(uniqueItemsMap.values());

        // Sort all items by stock status
        const sortedUniqueItems = sortItemsByStock(uniqueItemsList);

        // Create new categories with sorted "All Items", others remain unchanged
        const allCategories: Category[] = [
          {
            categoryName: "All Items",
            categoryImage: null,
            itemsResponseDtoList: sortedUniqueItems,
            subCategories: [],
          },
          ...data.map((category) => ({
            ...category,
            itemsResponseDtoList: sortItemsByStock(
              category.itemsResponseDtoList
            ),
            subCategories: category.subCategories || [],
          })),
        ];

        setCategories(allCategories);
        setFilteredCategories(allCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    setCustomerId(localStorage.getItem("userId") || "");
  }, []);

  // Filter items based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCategories(categories);
      setNoResults(false);
      return;
    }

    const term = searchTerm.toLowerCase().trim();

    // Create filtered categories with only matching items
    const filtered = categories.map((category) => {
      const filteredItems = category.itemsResponseDtoList.filter(
        (item) =>
          item.itemName.toLowerCase().includes(term) ||
          (item.weight && item.weight.toLowerCase().includes(term))
      );

      // Sort filtered items by stock status
      const sortedFilteredItems = sortItemsByStock(filteredItems);

      return {
        ...category,
        itemsResponseDtoList: sortedFilteredItems,
      };
    });

    // Count total matching items
    const totalMatchingItems = filtered.reduce(
      (count, category) => count + category.itemsResponseDtoList.length,
      0
    );

    setNoResults(totalMatchingItems === 0);
    setFilteredCategories(filtered);

    // If there are matching items, set the active category to show results
    if (totalMatchingItems > 0) {
      // Find the first category with matching items
      const firstCategoryWithItems = filtered.find(
        (cat) => cat.itemsResponseDtoList.length > 0
      );

      if (firstCategoryWithItems) {
        setActiveCategory(firstCategoryWithItems.categoryName);
      }
    }
  }, [searchTerm, categories]);

  // This function will be passed to the Header component to update search term
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Add to cart function
  const addToCart = async (item: Item) => {
    if (!customerId) {
      // Handle case when user is not logged in
      alert("Please login to add items to cart");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/cart-service/addItemsToCart`,
        {
          customerId: customerId,
          itemId: item.itemId,
          quantity: 1,
        }
      );

      if (response.status === 200) {
        setCart((prev) => ({
          ...prev,
          [item.itemId]: (prev[item.itemId] || 0) + 1,
        }));
        setCount(count + 1);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  // Filter active category items
  const activeItems =
    filteredCategories.find((cat) => cat.categoryName === activeCategory)
      ?.itemsResponseDtoList || [];

  // App Store Modal Component
  const AppStoreModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
    isOpen,
    onClose,
  }) => {
    if (!isOpen) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-purple-800">
              Download Our App
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <p className="text-gray-600 mb-6 text-center">
            Get the best shopping experience with our mobile app!
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href="https://play.google.com/store/apps/details?id=com.askoxy.customer"
              className="transition-transform hover:scale-105 w-full sm:w-auto flex justify-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png"
                alt="Google Play Store"
                className="h-12"
              />
            </a>
            <a
              href="https://apps.apple.com/app/askoxy-ai/id123456789"
              className="transition-transform hover:scale-105 w-full sm:w-auto flex justify-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="App Store"
                className="h-12"
              />
            </a>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-6xl mx-auto">
        <div
          className="relative w-full overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={`flex transition-transform ease-in-out duration-[1500ms]`}
            style={{
              transform: `translateX(-${
                (currentImageIndex * 100) / extendedImages.length
              }%)`,
              width: `${(extendedImages.length * 100) / imagesPerView}%`,
              transition: isTransitioning
                ? "transform 1.5s ease-in-out"
                : "none",
            }}
          >
            {extendedImages.map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0"
                style={{ width: `${100 / extendedImages.length}%` }}
                onClick={() => handleBannerClick(index % bannerImages.length)}
                onTouchStart={handleBannerTouchStart}
                onTouchMove={handleBannerTouchMove}
                onTouchEnd={handleBannerTouchEnd}
              >
                <img
                  src={image.src}
                  alt={image.alt || `Offer ${index + 1}`}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Component */}
      <Categories
        categories={filteredCategories}
        activeCategory={activeCategory}
        onCategoryClick={setActiveCategory}
        loading={loading}
        cart={cart}
        onItemClick={handleItemClick}
        updateCart={setCart}
        customerId={customerId}
        updateCartCount={setCount}
        setActiveCategory={setActiveCategory}
      />

      {/* Modals */}
      <AnimatePresence>
        {showAppModal && (
          <AppStoreModal
            isOpen={showAppModal}
            onClose={() => setShowAppModal(false)}
          />
        )}

        {showFAQModal && (
          <FAQModal
            isOpen={showFAQModal}
            onClose={() => setShowFAQModal(false)}
          />
        )}

        {showOxyLoansModal && (
          <OxyLoansModal
            isOpen={showOxyLoansModal}
            onClose={() => setShowOxyLoansModal(false)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Ricebags;
