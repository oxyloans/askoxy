// ProductOfferModals.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { message, Modal, Radio, Button, Tag, Space, Divider } from "antd";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  Gift, 
  Ticket, 
  Info, 
  CheckCircle, 
} from "lucide-react";
import BASE_URL from "../Config";


interface ProductItem {
  itemId?: string;
  title: string;
  weight?: string;
  units?: string;
  itemPrice?: number;
  image?: string;
  itemImage?: string | null;
}

interface CartItem {
  itemId: string;
  cartQuantity: number;
  cartId: string;
}

interface ProductOfferModalsProps {
  fetchCartData: (itemId?: string) => Promise<void>;
  cartData: CartItem[];
  cartItems: Record<string, number>;
}

// Change return type to match what the function actually returns
interface ProductOfferModalsReturn {
  handleItemAddedToCart: (item: ProductItem) => Promise<void>;
  freeItemsMap: { [key: string]: number };
  movieOfferMap: { [key: string]: boolean };
  setFreeItemsMap: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
  setMovieOfferMap: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}

// Instead of FC, define it as a function that returns an object
const ProductOfferModals = ({
  fetchCartData,
  cartData,
  cartItems
}: ProductOfferModalsProps): ProductOfferModalsReturn => {
  // State variables for 1kg offer (One Plus One)
  const [hasShownOnePlusOne, setHasShownOnePlusOne] = useState(
    localStorage.getItem("onePlusOneClaimed") === "true"
  );
  // Using a real state reference for modal shown flags, not just refs
  const [onePlusOneModalShown, setOnePlusOneModalShown] = useState(false);

  // Using a ref to track whether onePlus modal is currently open
  const onePlusOneModalOpenRef = useRef(false);
  const [freeItemsMap, setFreeItemsMap] = useState<{ [key: string]: number }>({});

  // State variables for 5kg offer (Movie Ticket)
  const [hasShownMovieOffer, setHasShownMovieOffer] = useState(
    localStorage.getItem("movieOfferClaimed") === "true"
  );
  // Using a real state reference for movie modal shown
  const [movieOfferModalShown, setMovieOfferModalShown] = useState(false);
  
  // Using a ref to track whether movie modal is currently open
  const movieOfferModalOpenRef = useRef(false);
  const [movieOfferMap, setMovieOfferMap] = useState<{
    [key: string]: boolean;
  }>({});

  // Reset modal shown flags when component mounts
  useEffect(() => {
    setOnePlusOneModalShown(false);
    setMovieOfferModalShown(false);
    onePlusOneModalOpenRef.current = false;
    movieOfferModalOpenRef.current = false;
  }, []);

  // 1Kg Rice Bag: One Plus One Offer
  const checkOnePlusOneStatus = async (): Promise<boolean> => {
    const customerId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");
    if (!customerId || !accessToken) return true;

    const claimed = localStorage.getItem("onePlusOneClaimed") === "true";
    if (claimed) return true;

    try {
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/oneKgOffer?customerId=${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const offeravail = response.data?.cartQuantity || 0;
      console.log("1+1 Offer available quantity:", offeravail);
      return offeravail >= 2;
    } catch (error) {
      console.error("Failed to fetch 1+1 offer availability:", error);
      return true; // Default to true to avoid showing modal on error
    }
  };

  const findOneKgBag = (item: ProductItem): ProductItem | null => {
    const weight = parseWeight(item.weight);
    if (weight === 1) {
      return item;
    }
    return null;
  };

  const showOnePlusOneModal = (item: ProductItem) => {
    if (onePlusOneModalOpenRef.current) return;
    
    const accessToken = localStorage.getItem("accessToken");
    const customerId = localStorage.getItem("userId");
    if (!accessToken || !customerId || !item.itemId) return;
    
    // Set modal open flag to true
    onePlusOneModalOpenRef.current = true;

    Modal.confirm({
      title: (
        <div className="flex items-center text-purple-700">
          <Gift className="mr-2 text-purple-600" size={22} />
          <span className="text-xl font-bold">Buy 1 Get 1 Free!</span>
        </div>
      ),
      icon: null,
      content: (
        <div className="py-3">
          <div className="bg-purple-50 p-3 rounded-lg mb-4 border-l-4 border-purple-500">
            <p className="text-purple-800 font-medium mb-2">
              Congratulations! You're eligible for our exclusive offer on 1kg rice bags!
            </p>
            <div className="flex items-center justify-center mb-2">
              <div className="flex items-center bg-white rounded-lg p-2 shadow-sm">
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ShoppingBag size={24} className="text-purple-600 mr-2" />
                </motion.div>
                <span className="font-bold text-purple-800 mx-2">+</span>
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Gift size={24} className="text-purple-600" />
                </motion.div>
              </div>
            </div>
          </div>
          
          <p>
            Get another <strong className="text-purple-700">{item.title}</strong> absolutely free with your purchase!
          </p>
          
          <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-700 flex items-center mb-2">
              <Info size={16} className="mr-1" /> Offer Terms
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Valid only once per user</li>
              <li>• Applies exclusively to 1kg rice bags</li>
              <li>• One offer per address</li>
              <li>• Valid on first successful delivery only</li>
            </ul>
          </div>
        </div>
      ),
      okText: (
        <div className="flex items-center">
          <Gift size={16} className="mr-1" />
          Add Free Bag
        </div>
      ),
      okButtonProps: { 
        style: { background: '#8B5CF6', borderColor: '#7C3AED' },
      },
      cancelText: "No Thanks",
      width: 480,
      className: "offer-modal",
      onOk: async () => {
        try {
          const currentQuantity = cartItems[item.itemId as string] || 1; // Use 1 as fallback since item is already added

          await axios.patch(
            `${BASE_URL}/cart-service/cart/incrementCartData`,
            {
              cartQuantity: currentQuantity + 1,
              customerId,
              itemId: item.itemId,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          setFreeItemsMap((prev) => ({
            ...prev,
            [item.itemId as string]: 1,
          }));

          localStorage.setItem("onePlusOneClaimed", "true");
          setHasShownOnePlusOne(true);
          setOnePlusOneModalShown(true);
          
          message.success({
            content: (
              <div className="flex items-center">
                <CheckCircle size={16} className="mr-2 text-green-500" />
                <span>1+1 offer applied! 1 free {item.title} added.</span>
              </div>
            ),
            icon: null,
          });
          
          await fetchCartData(item.itemId);
        } catch (err) {
          console.error("1+1 offer failed:", err);
          message.error("Unable to apply the 1+1 offer. Please try again.");
        } finally {
          // Reset the modal open flag
          onePlusOneModalOpenRef.current = false;
        }
      },
      onCancel: () => {
        // Reset modal flags when canceled
        onePlusOneModalOpenRef.current = false;
        setOnePlusOneModalShown(true);
      }
    });
  };

  const maybeShowOnePlusOneModal = async (item: ProductItem) => {
    // If modal is already shown in this session, don't show again
    if (onePlusOneModalShown || onePlusOneModalOpenRef.current) return;

    const eligibleBag = findOneKgBag(item);
    if (!eligibleBag) return;

    const isOfferClaimed = await checkOnePlusOneStatus();
    if (isOfferClaimed || hasShownOnePlusOne) return;

    // Show the modal
    showOnePlusOneModal(eligibleBag);
  };

  // // 5Kg Rice Bag: Movie Ticket Offer
  // const checkMovieOfferStatus = async (): Promise<boolean> => {
  //   const offerClaimed = localStorage.getItem("movieOfferClaimed") === "true";
  //   console.log("Movie ticket offer claimed (localStorage):", offerClaimed);
  //   return offerClaimed;
  // };

  // const findFiveKgBag = (item: ProductItem): ProductItem | null => {
  //   const weight = parseWeight(item.weight);
  //   if (weight === 5) {
  //     return item;
  //   }
  //   return null;
  // };

  // const showMovieOfferModal = (item: ProductItem) => {
  //   if (movieOfferModalOpenRef.current) return;
    
  //   // Set movie modal open flag to true
  //   movieOfferModalOpenRef.current = true;

  //   Modal.confirm({
  //     title: (
  //       <div className="flex items-center text-purple-700">
  //         <Ticket className="mr-2 text-purple-600" size={22} />
  //         <span className="text-xl font-bold">Free Movie Ticket!</span>
  //       </div>
  //     ),
  //     icon: null,
  //     content: (
  //       <div className="py-3">
  //         <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 rounded-lg mb-4 text-white relative overflow-hidden">
  //           <div className="absolute right-0 top-0 opacity-10">
  //             <Ticket size={100} />
  //           </div>
  //           <h3 className="text-xl font-bold mb-2">PVR Cinema Ticket</h3>
  //           <p className="text-white text-opacity-90 font-medium">
  //             HIT: The Third Case
  //           </p>
  //           <div className="mt-3 flex items-center">
  //             <Tag className="bg-white text-purple-700 border-0 font-bold mr-2">FREE</Tag>
  //             <span className="text-sm text-white text-opacity-80">with your 5KG rice purchase</span>
  //           </div>
  //         </div>
          
  //         <p className="mb-4">
  //           Enjoy a free PVR Movie Ticket to watch <strong>HIT: The Third Case</strong> on us!
  //         </p>
          
  //         <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
  //           <h4 className="font-semibold text-blue-700 flex items-center mb-2">
  //             <Info size={16} className="mr-1" /> Offer Details
  //           </h4>
  //           <ul className="text-sm text-gray-700 space-y-1">
  //             <li className="flex items-start">
  //               <CheckCircle size={14} className="text-green-500 mt-1 mr-1 flex-shrink-0" />
  //               <span>Valid only once per user</span>
  //             </li>
  //             <li className="flex items-start">
  //               <CheckCircle size={14} className="text-green-500 mt-1 mr-1 flex-shrink-0" />
  //               <span>Applicable exclusively on 5KG rice bags</span>
  //             </li>
  //             <li className="flex items-start">
  //               <CheckCircle size={14} className="text-green-500 mt-1 mr-1 flex-shrink-0" />
  //               <span>Redeemable on your first successful delivery</span>
  //             </li>
  //             <li className="flex items-start">
  //               <CheckCircle size={14} className="text-green-500 mt-1 mr-1 flex-shrink-0" />
  //               <span>Cannot be combined with other offers</span>
  //             </li>
  //           </ul>
  //         </div>
  //       </div>
  //     ),
  //     okText: (
  //       <div className="flex items-center">
  //         <Ticket size={16} className="mr-1" />
  //         Claim Movie Ticket
  //       </div>
  //     ),
  //     okButtonProps: { 
  //       style: { background: '#8B5CF6', borderColor: '#7C3AED' },
  //     },
  //     cancelText: "No Thanks",
  //     width: 480,
  //     className: "movie-offer-modal",
  //     onOk: async () => {
  //       try {
  //         // Simulate offer claim by updating localStorage
  //         localStorage.setItem("movieOfferClaimed", "true");
  //         setHasShownMovieOffer(true);
  //         setMovieOfferModalShown(true);

  //         if (item.itemId) {
  //           setMovieOfferMap((prev) => ({
  //             ...prev,
  //             [item.itemId as string]: true,
  //           }));
  //         }

  //         message.success({
  //           content: (
  //             <div className="flex items-center">
  //               <Ticket size={16} className="mr-2 text-green-500" />
  //               <span>Movie ticket offer claimed! Details will be shared upon delivery.</span>
  //             </div>
  //           ),
  //           icon: null,
  //           duration: 5,
  //         });
          
  //         if (item.itemId) {
  //           await fetchCartData(item.itemId);
  //         }
  //       } catch (err) {
  //         console.error("Movie ticket offer claim failed:", err);
  //         message.error("Unable to claim the movie ticket offer. Please try again.");
  //       } finally {
  //         // Reset the movie modal open flag
  //         movieOfferModalOpenRef.current = false;
  //       }
  //     },
  //     onCancel: () => {
  //       // Reset modal flags when canceled
  //       movieOfferModalOpenRef.current = false;
  //       setMovieOfferModalShown(true);
  //     }
  //   });
  // };

  // const maybeShowMovieOfferModal = async (item: ProductItem) => {
  //   // If modal is already shown in this session, don't show again
  //   if (movieOfferModalShown || movieOfferModalOpenRef.current) return;

  //   const eligibleBag = findFiveKgBag(item);
  //   if (!eligibleBag) return;

  //   const isOfferClaimed = await checkMovieOfferStatus();
  //   if (isOfferClaimed) return;

  //   // Show the modal
  //   showMovieOfferModal(eligibleBag);
  // };

  // Helper function to parse weight
  const parseWeight = (weight: unknown): number => {
    if (typeof weight === "number") {
      return weight;
    }
    if (typeof weight !== "string" || !weight) {
      return 0;
    }
    const match = weight.match(/(\d+(\.\d+)?)/);
    const result = match ? parseFloat(match[0]) : 0;
    return result;
  };

  // Main function that handles adding items to cart and showing appropriate offer modals
  const handleItemAddedToCart = useCallback(
    async (item: ProductItem): Promise<void> => {
      const weight = parseWeight(item.weight);
      
      // First check if we've already shown modals for this session
      if (onePlusOneModalShown && movieOfferModalShown) {
        return;
      }
      
      // Check if any modals are currently open - don't show new modals
      if (onePlusOneModalOpenRef.current || movieOfferModalOpenRef.current) {
        return;
      }
      
      // 1kg rice bag offer
      if (weight === 1 && !onePlusOneModalShown && !hasShownOnePlusOne) {
        await maybeShowOnePlusOneModal(item);
        return; // Exit early to not show other modals
      }

      // // 5kg movie ticket offer
      // if (weight === 5 && !movieOfferModalShown && !hasShownMovieOffer) {
      //   await maybeShowMovieOfferModal(item);
      //   return; // Exit early to not show other modals
      // }
    },
    [onePlusOneModalShown,  hasShownOnePlusOne]
  );

  return {
    handleItemAddedToCart,
    freeItemsMap,
    movieOfferMap,
    setFreeItemsMap,
    setMovieOfferMap,
  };
};

export default ProductOfferModals;