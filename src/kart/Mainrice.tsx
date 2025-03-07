import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
import Categories from "./categories";
import rice1 from "../assets/img/ricecard1.png";
import rice2 from "../assets/img/ricecard2.png";
import rice3 from "../assets/img/ricecard3.png";
import { CartContext } from "../until/CartContext";
import { FaSearch } from "react-icons/fa";
import  BASE_URL  from "../Config";

interface Item {
  itemName: string;
  itemId: string;
  itemImage: null;
  weight: string;
  itemPrice: number;
  quantity: number;
  itemMrp: number;
  units: string;
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

  const navigate = useNavigate();
  const location = useLocation();
  const minSwipeDistance = 50;
  const bannerImages = [rice1, rice2, rice3];

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

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          BASE_URL+"/product-service/showItemsForCustomrs"
        );
        const data: Category[] = response.data;
        
        // Process the API response to include both all categories and individual categories
        const allItemsList = data.flatMap(cat => cat.itemsResponseDtoList);
        
        const allCategories: Category[] = [
          {
            categoryName: "All Items",
            categoryImage: null,
            itemsResponseDtoList: allItemsList,
            subCategories: [] // Initialize empty subcategories for "All Categories"
          },
          ...data.map(category => ({
            ...category,
            subCategories: category.subCategories || [] // Preserve existing subcategories
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
      
      return {
        ...category,
        itemsResponseDtoList: filteredItems
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

  return (
    <div className="min-h-screen">
      
      {/* Image Slider */}
      <div 
        className="relative w-full overflow-hidden"
        style={{
          height: 'min(30vw * 0.5625, 250px)',
          maxHeight: '250px'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
              onClick={() => {
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
          className="text-center py-2 md:py-6"
        >
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent px-4">
            Premium Quality Rice
          </h1>
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
        ) : (
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
          {filteredCategories.map((category, index) => (
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
          ))}
        </div>
      </nav>

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 md:w-16 md:h-16 border-4 border-purple-600 border-t-transparent rounded-full"
          />
        </div>
      )}
           
      <Footer />
    </div>
  );
};

export default Ricebags;