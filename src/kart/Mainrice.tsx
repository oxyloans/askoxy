import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
import Categories from "./categories";
import rice1 from "../assets/img/ricecard1.png";
import rice2 from "../assets/img/ricecard2.png";
import rice3 from "../assets/img/ricecard3.png";
import rice4 from "../assets/img/ricecard4.png";
import { CartContext } from "../until/CartContext";
import { FaSearch, FaTimes, FaQuestionCircle } from "react-icons/fa";
import BASE_URL from "../Config";

interface Item {
  itemName: string;
  itemId: string;
  itemImage: null;
  weight: string;
  itemPrice: number;
  quantity: number;
  itemMrp: number;
  units: string;
  inStock?: boolean; // Add inStock property
}

interface SubCategory {
  id: string;
  name: string;
  image?: string | null;
}

interface Category {
  categoryName: string;
  categoryImage: string | null;
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

const SkeletonLoader: React.FC = () => (
  <>
    {/* Skeleton for category tabs */}
    <div className="flex overflow-x-auto py-4 px-4 space-x-2 mb-4">
      {Array(6).fill(0).map((_, index) => (
        <CategorySkeletonItem key={index} />
      ))}
    </div>
    
    {/* Skeleton for products grid */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
      {Array(10).fill(0).map((_, index) => (
        <ProductSkeletonItem key={index} />
      ))}
    </div>
  </>
);

// New FAQ Component
const FAQModal: React.FC<{isOpen: boolean; onClose: () => void}> = ({isOpen, onClose}) => {
  const [activeTab, setActiveTab] = useState<'container' | 'referral'>('container');
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
          <h2 className="text-xl font-bold text-purple-800">Frequently Asked Questions</h2>
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
              activeTab === 'container' 
                ? 'border-b-2 border-purple-600 text-purple-800' 
                : 'text-gray-600 hover:text-purple-600'
            }`}
            onClick={() => setActiveTab('container')}
          >
            Free Steel Container Policy
          </button>
          <button
            className={`flex-1 py-3 px-4 font-medium text-sm transition-colors ${
              activeTab === 'referral' 
                ? 'border-b-2 border-purple-600 text-purple-800' 
                : 'text-gray-600 hover:text-purple-600'
            }`}
            onClick={() => setActiveTab('referral')}
          >
            Referral Program
          </button>
        </div>
        
        {/* Shadow when scrolled */}
        <div className={`h-2 bg-gradient-to-b from-gray-100 to-transparent transition-opacity ${scrolledToTop ? 'opacity-0' : 'opacity-100'}`}></div>
        
        {/* Content */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto p-4 pb-6"
          onScroll={handleScroll}
        >
          {activeTab === 'container' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-purple-800 mb-2">About ASKOXY.AI</h3>
                <p className="text-gray-700">
                ASKOXY.AI is an AI-powered platform integrating <em>34+ marketplaces</em>, designed to simplify lives with innovative solutions, including <strong>premium rice delivery</strong>.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-purple-800 mb-2">Who is the founder of ASKOXY.AI?</h3>
                <p className="text-gray-700">
                  AskOxy.ai is led by <em>Radhakrishna Thatavarti</em> (<a href="https://www.linkedin.com/in/oxyradhakrishna/" className="text-blue-600 hover:underline">LinkedIn</a>), an entrepreneur with <em>over 24 years of experience</em> in software technology and business leadership. His vision is to <em>empower communities</em> through sustainable, customer-centric solutions using <em>AI, Blockchain, and Java technologies</em>.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-purple-800 mb-2">Free Steel Container Policy</h3>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-700 mb-1">What is the Free Steel Container offer?</h4>
                <p className="text-gray-700">
                  Customers who purchase a <em>26kg rice bag</em> will receive a <em>FREE steel rice container</em>. However, the container remains the <strong>property of OXY Group</strong> until ownership is earned.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-700 mb-1">How can I earn ownership of the steel container?</h4>
                <p className="text-gray-700">
                  You can <em>own</em> the container by meeting <em>either</em> of the following criteria:
                </p>
                <ol className="list-decimal ml-5 mt-2 space-y-1">
                  <li className="text-gray-700"><em>Refer 9 new users</em> to ASKOXY.AI.</li>
                  <li className="text-gray-700"><em>Purchase 9 rice bags</em> within <em>1 year</em>.</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-700 mb-1">What happens if I do not purchase regularly?</h4>
                <ul className="list-disc ml-5 space-y-1">
                  <li className="text-gray-700">If you <em>do not make a purchase within 45 days</em>, or</li>
                  <li className="text-gray-700">If there is a <em>gap of 45 days between purchases</em>,</li>
                </ul>
                <p className="text-gray-700 mt-2">
                  then the <em>container will be taken back</em>.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-700 mb-1">How long does delivery take for the rice bag and container?</h4>
                <ul className="list-disc ml-5 space-y-1">
                  <li className="text-gray-700">The <em>rice bag</em> will be delivered <em>within 24 hours</em>.</li>
                  <li className="text-gray-700">Due to high demand, <em>container delivery</em> may be delayed.</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-700 mb-1">Who is eligible to be referred under this program?</h4>
                <p className="text-gray-700">
                  Only <em>new users</em> who are <em>not yet registered</em> on ASKOXY.AI can be referred.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-purple-800 mb-2">Referral Program – Earn a Free Container & ₹100 Cashback!</h3>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-700 mb-1">How do I refer someone?</h4>
                <ul className="list-disc ml-5 space-y-1">
                  <li className="text-gray-700">Share your <em>unique referral link</em> with your friends.</li>
                  <li className="text-gray-700">Your friend must <em>sign up</em> using your referral link during registration.</li>
                  <li className="text-gray-700">Once they <em>place an order for rice and do not cancel it</em>, you'll receive the reward.</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-700 mb-1">What rewards do I get for referring a friend?</h4>
                <p className="text-gray-700">
                  Apart from getting a <em>free steel container</em>, you will also receive <strong>₹100 cashback</strong> in your <em>ASKOXY.AI wallet</em> when you successfully refer someone.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-700 mb-1">When will I receive my referral reward?</h4>
                <p className="text-gray-700">
                  Referral rewards are credited <em>once your referred friend successfully places an order and does not cancel it</em>.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-700 mb-1">Where can I check my referral status?</h4>
                <p className="text-gray-700">
                  You can track your referrals in your <em>ASKOXY.AI dashboard</em>.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-700 mb-1">Is there a limit to the number of people I can refer?</h4>
                <p className="text-gray-700">
                  No, you can refer <em>as many friends as you like</em>. You will receive <strong>₹100 cashback for each successful referral</strong>, subject to promotional terms.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-700 mb-1">What happens if my friend forgets to use my referral link?</h4>
                <p className="text-gray-700">
                  Referrals must <em>use your link at the time of sign-up</em>. If they forget, the referral may not be counted, and you will <strong>not receive the reward</strong>.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-700 mb-1">Can I refer myself using another account?</h4>
                <p className="text-gray-700">
                  No, <em>self-referrals</em> are not allowed. Fraudulent activity may lead to disqualification from the referral program.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-700 mb-1">Who do I contact if I have issues with my referral reward?</h4>
                <p className="text-gray-700">
                  If you have any issues with your referral reward, please contact <em>ASKOXY.AI support</em> at:
                </p>
                <p className="text-gray-700 mt-2">
                  📞 <em>Phone:</em> <strong>+91 81432 71103</strong><br />
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
  const [activeCategory, setActiveCategory] = useState<string>("All Items");
  const [loading, setLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [customerId, setCustomerId] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [noResults, setNoResults] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);
  // New state for FAQ modal
  const [showFAQModal, setShowFAQModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const minSwipeDistance = 50;
  const bannerImages = [rice1, rice2, rice3,rice4];

  // Get search query from location state if available
  useEffect(() => {
    if (location.state?.searchQuery) {
      setSearchTerm(location.state.searchQuery);
    }
  }, [location.state]);

  const handleItemClick = (item: Item) => {
    navigate(`/main/itemsdisplay/${item.itemId}`, { 
      state: { item } 
    });
  };

  // Handle banner image click based on index
const handleBannerClick = (index: number) => {
    if (index === 0) {
      // Rice1 image - Navigate to combo offers
      setActiveCategory("Combo Offers");
      
      // Find the combo offers section
      const comboSection = document.querySelector('.combo-offers-section') || 
                           document.getElementById('combo-offers') ||
                           document.querySelector('[data-category="Combo Offers"]');
      
      if (comboSection) {
        // Scroll with offset to position it better in the viewport
        const yOffset = -80; // Adjust this value based on your header height
        const y = comboSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      } else {
        // More controlled scroll if section not found - scroll half a page
        window.scrollBy({
          top: window.innerHeight / 2,
          behavior: 'smooth'
        });
      }
    } else if (index === 2) {
      // Rice3 image - Show app download modal
      setShowAppModal(true);
    }
    // No special action for Rice2 (index 1)
    else if (index === 3) {
      // Rice3 image - Show app download modal
      setShowFAQModal(true);
    }
  };

  const sliderVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error("CartDisplay must be used within a CartProvider");
  }

  const { count, setCount } = context;

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay, bannerImages.length]);

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
          BASE_URL+"/product-service/showItemsForCustomrs"
        );
        const data: Category[] = response.data;
        
        // Create a map to deduplicate items based on both itemId and itemName
        const uniqueItemsMap = new Map<string, Item>();
        
        // Collect all items and ensure uniqueness by both itemId and itemName
        data.forEach(category => {
          category.itemsResponseDtoList.forEach(item => {
            // Create a combined key using both itemId and normalized itemName
            const normalizedName = item.itemName.trim().toLowerCase();
            
            // Check if we already have an item with this name
            let isDuplicate = false;
            uniqueItemsMap.forEach((existingItem) => {
              if (existingItem.itemName.trim().toLowerCase() === normalizedName) {
                isDuplicate = true;
              }
            });
            
            // Only add the item if it's not a duplicate by name
            if (!isDuplicate) {
              uniqueItemsMap.set(item.itemId, item);
            }
          });
        });
        
        // Convert map values to array for our "All Items" category
        const uniqueItemsList = Array.from(uniqueItemsMap.values());
        
        // Sort all items by stock status
        const sortedUniqueItems = sortItemsByStock(uniqueItemsList);
        
        // Create new categories with sorted items
        const allCategories: Category[] = [
          {
            categoryName: "All Items",
            categoryImage: null,
            itemsResponseDtoList: sortedUniqueItems,
            subCategories: []
          },
          ...data.map(category => ({
            ...category,
            // Sort items within each category
            itemsResponseDtoList: sortItemsByStock(category.itemsResponseDtoList),
            subCategories: category.subCategories || []
          }))
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
    const filtered = categories.map(category => {
      const filteredItems = category.itemsResponseDtoList.filter(item => 
        item.itemName.toLowerCase().includes(term) || 
        (item.weight && item.weight.toLowerCase().includes(term))
      );
      
      // Sort filtered items by stock status
      const sortedFilteredItems = sortItemsByStock(filteredItems);
      
      return {
        ...category,
        itemsResponseDtoList: sortedFilteredItems
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
        cat => cat.itemsResponseDtoList.length > 0
      );
      
      if (firstCategoryWithItems) {
        setActiveCategory(firstCategoryWithItems.categoryName);
      }
    }
  }, [searchTerm, categories]);

  // This function will be passed to the Header component to update search term
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setActiveCategory("All Items"); // Reset to all items when search is cleared
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsAutoPlay(false);
    setTouchEnd(null);
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
      const direction = isLeftSwipe ? 1 : -1;
      const newIndex = (currentImageIndex + direction + bannerImages.length) % bannerImages.length;
      setCurrentImageIndex(newIndex);
    }

    setTimeout(() => setIsAutoPlay(true), 5000);
  };

  // Function to detect mobile device
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Function to open the appropriate app store
  const openAppStore = () => {
    if (isMobile()) {
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.location.href = "https://apps.apple.com/in/app/oxyrice-rice-grocery-delivery/id6738732000";
      } else {
        window.location.href = "https://play.google.com/store/apps/details?id=com.oxyrice.oxyrice_customer";
      }
    }
    // On desktop, the modal will show both options
  };

  return (
    <div className="min-h-screen">
      
      {/* Image Slider */}
      <div 
        className="relative w-full overflow-hidden cursor-pointer"
        style={{
          height: 'min(30vw * 0.5625, 250px)',
          maxHeight: '250px'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => handleBannerClick(currentImageIndex)}
      >
        <AnimatePresence initial={false} custom={1}>
          <motion.div
            key={currentImageIndex}
            custom={1}
            variants={sliderVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={bannerImages[currentImageIndex]}
              className="w-full h-full object-cover md:object-contain"
              onLoad={() => setImageLoaded(true)}
              style={{ 
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out'
              }}
              alt={`Rice banner ${currentImageIndex + 1}`}
            />
          </motion.div>
        </AnimatePresence>

        {/* Slider Indicators */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2 z-10">
          {bannerImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the parent's onClick
                setCurrentImageIndex(index);
                setIsAutoPlay(false);
                setTimeout(() => setIsAutoPlay(true), 5000);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentImageIndex === index 
                  ? 'w-6 bg-purple-600' 
                  : 'w-1.5 bg-purple-300'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>

      {/* App Modal */}
      <AnimatePresence>
        {showAppModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAppModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-purple-800">Get Our Mobile App</h2>
                <button
                  onClick={() => setShowAppModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Close modal"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                Download ASKOXY.AI for a seamless shopping experience with exclusive app-only offers!
              </p>
              
              <div className="grid grid-cols-2 gap-2 justify-center">
                <a
                  href="https://apps.apple.com/in/app/oxyrice-rice-grocery-delivery/id6738732000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center"
                >
                  <img
                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                    alt="Download on the App Store"
                    className="h-10 w-auto object-contain"
                  />
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.oxyrice.oxyrice_customer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png"
                    alt="Get it on Google Play"
                    className="h-10 w-auto object-contain"
                  />
                </a>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                  Enjoy exclusive app-only discounts, faster checkout, and order tracking!
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ Modal */}
      <AnimatePresence>
        {showFAQModal && (
          <FAQModal 
            isOpen={showFAQModal} 
            onClose={() => setShowFAQModal(false)} 
          />
        )}
      </AnimatePresence>

      {/* Search results indicator (if searching) */}
      {searchTerm && (
        <div className="bg-purple-50 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <FaSearch className="text-purple-600 mr-2" />
            <span className="text-purple-800 font-medium">
              {noResults 
                ? "No results found for: " 
                : "Search results for: "}
              <span className="font-bold">{searchTerm}</span>
            </span>
          </div>
          <button
            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors text-sm"
            onClick={() => {
              setSearchTerm("");
              setActiveCategory("All Items");
            }}
          >
            View All Products
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="bg-white">
      <motion.div
  initial={{ y: -20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  className="text-center py-2 md:py-6 relative"
>
  {/* Container for the heading and FAQ button */}
  <div className="flex justify-between items-center mb-4">
    {/* Centered Heading */}
    <div className="flex-1 text-center">
      <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
        Premium Quality Rice
      </h1>
    </div>

    {/* FAQ Button (Right-aligned) */}
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 transition-all"
      onClick={() => setShowFAQModal(true)}
      aria-label="View FAQs"
    >
      <FaQuestionCircle className="w-5 h-5 inline-block" />
      <span className="ml-2">FAQs</span>
    </motion.button>
  </div>

  {/* Description Text */}
  <p className="text-m md:text-lg text-gray-600 px-4">
    Discover our exclusive collection of premium rice varieties
  </p>
</motion.div>

        {noResults ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-gray-100 rounded-full p-4 mb-4">
              <FaSearch className="text-gray-400 w-10 h-10" />
            </div>
            <h2 className="text-xl font-medium text-gray-700 mb-2">No items found</h2>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              We couldn't find any items matching your search. Try using different keywords or browse our categories.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("All Items");
              }}
              className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
            >
              View All Products
            </button>
          </div>
        ) : loading ? (
          <SkeletonLoader />
        ) : (
          <Categories
            categories={filteredCategories}
            activeCategory={activeCategory}
            onCategoryClick={setActiveCategory}
            setActiveCategory={setActiveCategory}
            loading={loading}
            cart={cart}
            onItemClick={handleItemClick}
            updateCart={setCart}
            customerId={customerId}
            updateCartCount={setCount}
          />
        )}
      </main>

      {/* Scroll to Top Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-4 p-3 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-purple-800 text-white z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg 
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </motion.button>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10">
        <div className="flex overflow-x-auto py-3 px-4 space-x-4 scrollbar-hide css-hide-scrollbar">
          {loading ? (
            // Skeleton navigation items for mobile
            Array(5).fill(0).map((_, index) => (
              <div key={index} className="flex-shrink-0 px-4 py-2 rounded-full bg-gray-200 animate-pulse w-24 h-8"></div>
            ))
          ) : (
            filteredCategories.map((category, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.categoryName
                    ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-md"
                    : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                }`}
                onClick={() => setActiveCategory(category.categoryName)}
              >
                {category.categoryName}
              </motion.button>
            ))
          )}
        </div>
      </nav>

      <Footer />
    </div>
  );
};

export default Ricebags;