// ProductOfferModals.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { message, Modal, Radio, Button, Tag, Space, Divider } from "antd";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  Gift, 
  Ticket, 
  Package, 
  Award, 
  Users, 
  Calendar, 
  Info, 
  CheckCircle,
  AlertCircle,
  Box,
  Zap,
  Share, 
  UserPlus, 
  DollarSign
} from "lucide-react";
import BASE_URL from "../Config";

// Constants for container IDs
const CONTAINER_ITEM_IDS = {
  HEAVY_BAG: "9b5c671a-32bb-4d18-8b3c-4a7e4762cc61", // 26kg container
  LIGHT_BAG: "53d7f68c-f770-4a70-ad67-ee2726a1f8f3", // 10kg container
};

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

  // State variables for container offer (10kg and 26kg)
  const [containerPreference, setContainerPreference] = useState<string | null>(null);
  const modalDisplayedRef = useRef<boolean>(false);
  const containerModalCompletedRef = useRef<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<"planA" | "planB" | null>(null);
  const [isPlanDetailsModalOpen, setIsPlanDetailsModalOpen] = useState<boolean>(false);
  const [currentPlanDetails, setCurrentPlanDetails] = useState<"planA" | "planB" | null>(null);

  // Reset modal shown flags when component mounts
  useEffect(() => {
    setOnePlusOneModalShown(false);
    setMovieOfferModalShown(false);
    onePlusOneModalOpenRef.current = false;
    movieOfferModalOpenRef.current = false;
    modalDisplayedRef.current = false;
    containerModalCompletedRef.current = false;
  }, []);

  // Fetch container preference
  const fetchContainerPreference = useCallback(async (): Promise<string | null> => {
    const customerId = localStorage.getItem("userId");
    const token = localStorage.getItem("accessToken");
    if (!customerId || !token) return null;

    try {
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/ContainerInterested/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const status = response.data.freeContainerStatus
        ? response.data.freeContainerStatus.toLowerCase()
        : null;
      console.log("Fetched container preference:", status);
      return status;
    } catch (error) {
      console.error("Error fetching container preference:", error);
      return null;
    }
  }, []);

  // Initialize container preference
  useEffect(() => {
    const initContainerPreference = async () => {
      const preference = await fetchContainerPreference();
      setContainerPreference(preference);
    };
    
    initContainerPreference();
  }, [fetchContainerPreference]);

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

  // 5Kg Rice Bag: Movie Ticket Offer
  const checkMovieOfferStatus = async (): Promise<boolean> => {
    const offerClaimed = localStorage.getItem("movieOfferClaimed") === "true";
    console.log("Movie ticket offer claimed (localStorage):", offerClaimed);
    return offerClaimed;
  };

  const findFiveKgBag = (item: ProductItem): ProductItem | null => {
    const weight = parseWeight(item.weight);
    if (weight === 5) {
      return item;
    }
    return null;
  };

  const showMovieOfferModal = (item: ProductItem) => {
    if (movieOfferModalOpenRef.current) return;
    
    // Set movie modal open flag to true
    movieOfferModalOpenRef.current = true;

    Modal.confirm({
      title: (
        <div className="flex items-center text-purple-700">
          <Ticket className="mr-2 text-purple-600" size={22} />
          <span className="text-xl font-bold">Free Movie Ticket!</span>
        </div>
      ),
      icon: null,
      content: (
        <div className="py-3">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 rounded-lg mb-4 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10">
              <Ticket size={100} />
            </div>
            <h3 className="text-xl font-bold mb-2">PVR Cinema Ticket</h3>
            <p className="text-white text-opacity-90 font-medium">
              HIT: The Third Case
            </p>
            <div className="mt-3 flex items-center">
              <Tag className="bg-white text-purple-700 border-0 font-bold mr-2">FREE</Tag>
              <span className="text-sm text-white text-opacity-80">with your 5KG rice purchase</span>
            </div>
          </div>
          
          <p className="mb-4">
            Enjoy a free PVR Movie Ticket to watch <strong>HIT: The Third Case</strong> on us!
          </p>
          
          <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-700 flex items-center mb-2">
              <Info size={16} className="mr-1" /> Offer Details
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li className="flex items-start">
                <CheckCircle size={14} className="text-green-500 mt-1 mr-1 flex-shrink-0" />
                <span>Valid only once per user</span>
              </li>
              <li className="flex items-start">
                <CheckCircle size={14} className="text-green-500 mt-1 mr-1 flex-shrink-0" />
                <span>Applicable exclusively on 5KG rice bags</span>
              </li>
              <li className="flex items-start">
                <CheckCircle size={14} className="text-green-500 mt-1 mr-1 flex-shrink-0" />
                <span>Redeemable on your first successful delivery</span>
              </li>
              <li className="flex items-start">
                <CheckCircle size={14} className="text-green-500 mt-1 mr-1 flex-shrink-0" />
                <span>Cannot be combined with other offers</span>
              </li>
            </ul>
          </div>
        </div>
      ),
      okText: (
        <div className="flex items-center">
          <Ticket size={16} className="mr-1" />
          Claim Movie Ticket
        </div>
      ),
      okButtonProps: { 
        style: { background: '#8B5CF6', borderColor: '#7C3AED' },
      },
      cancelText: "No Thanks",
      width: 480,
      className: "movie-offer-modal",
      onOk: async () => {
        try {
          // Simulate offer claim by updating localStorage
          localStorage.setItem("movieOfferClaimed", "true");
          setHasShownMovieOffer(true);
          setMovieOfferModalShown(true);

          if (item.itemId) {
            setMovieOfferMap((prev) => ({
              ...prev,
              [item.itemId as string]: true,
            }));
          }

          message.success({
            content: (
              <div className="flex items-center">
                <Ticket size={16} className="mr-2 text-green-500" />
                <span>Movie ticket offer claimed! Details will be shared upon delivery.</span>
              </div>
            ),
            icon: null,
            duration: 5,
          });
          
          if (item.itemId) {
            await fetchCartData(item.itemId);
          }
        } catch (err) {
          console.error("Movie ticket offer claim failed:", err);
          message.error("Unable to claim the movie ticket offer. Please try again.");
        } finally {
          // Reset the movie modal open flag
          movieOfferModalOpenRef.current = false;
        }
      },
      onCancel: () => {
        // Reset modal flags when canceled
        movieOfferModalOpenRef.current = false;
        setMovieOfferModalShown(true);
      }
    });
  };

  const maybeShowMovieOfferModal = async (item: ProductItem) => {
    // If modal is already shown in this session, don't show again
    if (movieOfferModalShown || movieOfferModalOpenRef.current) return;

    const eligibleBag = findFiveKgBag(item);
    if (!eligibleBag) return;

    const isOfferClaimed = await checkMovieOfferStatus();
    if (isOfferClaimed) return;

    // Show the modal
    showMovieOfferModal(eligibleBag);
  };

  // Container Offer for 26kg and 10kg Rice
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

  const showContainerModal = (item: ProductItem) => {
    if (!item.itemId) return;

    // First check if we have already shown the modal or user already made a selection
    if (
      containerPreference?.toLowerCase() === "interested" ||
      containerModalCompletedRef.current ||
      modalDisplayedRef.current
    ) {
      return;
    }

    // Check if user already has a container in cart
    const hasContainer = cartData.some((cartItem) =>
      [CONTAINER_ITEM_IDS.HEAVY_BAG, CONTAINER_ITEM_IDS.LIGHT_BAG].includes(
        cartItem.itemId
      )
    );
    
    if (hasContainer) {
      modalDisplayedRef.current = true;
      return;
    }

    // Parse weight correctly, ensuring we get a numeric value
    const weight = parseWeight(item.weight);
    
    // Modified eligibility check for container offers
    // 10kg and 26kg are eligible for container
    const isEligibleWeight = weight === 10 || weight === 26;
    
    // If not an eligible weight, exit early
    if (!isEligibleWeight) {
      return;
    }

    // Mark that we've displayed the modal
    modalDisplayedRef.current = true;

    let selected: "planA" | "planB" | null = selectedPlan;

    const PlanModalContent = () => {
      const [tempPlan, setTempPlan] = useState<"planA" | "planB" | null>(
        selectedPlan
      );

      useEffect(() => {
        selected = tempPlan;
      }, [tempPlan]);

      const planDetails: Record<"planA" | "planB", JSX.Element> = {
        planA: (
          <ul className="list-disc pl-5 space-y-2 text-left">
            <li>Buy 9 bags of rice in 3 years to keep the container forever</li>
            <li>Refer 9 friends who make a purchase – keep the container</li>
            <li>Gap of 90 days = container is taken back</li>
            <li>
              Choose the plan that best suits your needs for long-term
              convenience
            </li>
          </ul>
        ),
        planB: (
          <ul className="list-disc pl-5 space-y-2 text-left">
            <li>Refer friends using your unique link</li>
            <li>They must sign up and buy rice</li>
            <li>You get a free container + ₹50 cashback</li>
            <li>
              Choose the plan that best suits your needs for long-term
              convenience
            </li>
          </ul>
        ),
      };

      return (
        <div className="text-center">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-4 rounded-lg mb-5 text-white relative">
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-10">
              <Package size={80} />
            </div>
            <h3 className="text-xl font-bold mb-2">FREE Steel Container</h3>
            <p className="text-white text-opacity-90">
              With your purchase of {weight}kg rice bag
            </p>
          </div>
          
          <p className="mb-4 text-gray-700">
            Get a premium quality steel container absolutely free with your rice purchase.
            Choose one of our special plans to keep the container forever!
          </p>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-stretch gap-3">
              <Radio.Group 
                onChange={(e) => setTempPlan(e.target.value)} 
                value={tempPlan}
                className="w-full"
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div className={`border rounded-lg p-4 transition-all ${tempPlan === "planA" ? "border-purple-500 bg-purple-50" : "border-gray-200"}`}>
                    <Radio value="planA" className="w-full">
                      <div className="ml-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-purple-700">Plan A: Loyalty Program</h4>
                          <Tag color="purple">Most Popular</Tag>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Buy 9 bags in 3 years or refer 9 friends</p>
                        <Button 
                          type="link" 
                          size="small" 
                          className="p-0 h-auto text-purple-600"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCurrentPlanDetails("planA");
                            setIsPlanDetailsModalOpen(true);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </Radio>
                  </div>
                  
                  <div className={`border rounded-lg p-4 transition-all ${tempPlan === "planB" ? "border-purple-500 bg-purple-50" : "border-gray-200"}`}>
                    <Radio value="planB" className="w-full">
                      <div className="ml-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-purple-700">Plan B: Referral Rewards</h4>
                          <Tag color="green">Extra Benefits</Tag>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Earn rewards for referring friends</p>
                        <Button 
                          type="link" 
                          size="small" 
                          className="p-0 h-auto text-purple-600"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCurrentPlanDetails("planB");
                            setIsPlanDetailsModalOpen(true);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </Radio>
                  </div>
                </Space>
              </Radio.Group>
            </div>
          </div>
          
          <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-left">
            <div className="flex items-center text-yellow-700 font-medium mb-1">
              <AlertCircle size={16} className="mr-1" />
              <span>Important Note</span>
            </div>
            <p className="text-sm text-gray-700">
              If there's a gap of 90 days between purchases, the container may be reclaimed.
              Select a plan above to secure permanent ownership.
            </p>
          </div>
        </div>
      );
    };

    Modal.confirm({
      title: (
        <div className="flex items-center text-purple-700">
          <Package className="mr-2 text-purple-600" size={24} />
          <span className="text-xl font-bold">Free Steel Container Offer!</span>
        </div>
      ),
      icon: null,
      content: <PlanModalContent />,
      okText: "Confirm Selection",
      okButtonProps: { 
        style: { background: '#8B5CF6', borderColor: '#7C3AED' },
      },
      cancelText: "No Thanks",
      width: 520,
      className: "container-modal",
      maskClosable: false,
      onOk: async () => {
        if (!selected) {
          message.info("Please select a plan before confirming.");
          return Promise.reject();
        }
        setSelectedPlan(selected);
        await handleInterested(item);
        containerModalCompletedRef.current = true;
        return Promise.resolve();
      },
      onCancel: async () => {
        setSelectedPlan(null);
        containerModalCompletedRef.current = true;
      },
    });
  };

  const handleInterested = async (item: ProductItem) => {
    const customerId = localStorage.getItem("userId");
    const token = localStorage.getItem("accessToken");
    if (!customerId || !token) return;

    try {
      const hasContainer = cartData.some((cartItem) =>
        [CONTAINER_ITEM_IDS.HEAVY_BAG, CONTAINER_ITEM_IDS.LIGHT_BAG].includes(
          cartItem.itemId
        )
      );
      
      if (hasContainer) {
        message.info("You have already opted for a container.");
        modalDisplayedRef.current = true;
        return;
      }

      let containerItemId: string;
      const weight = parseWeight(item.weight);

      // Determine which container to add based on the weight
      if (weight === 26) {
        containerItemId = CONTAINER_ITEM_IDS.HEAVY_BAG;
      } else if (weight === 10) {
        containerItemId = CONTAINER_ITEM_IDS.LIGHT_BAG;
      } else {
        message.info("No eligible items for a free container.");
        return;
      }

      const containerItemData = {
        itemId: containerItemId,
        customerId: customerId,
        cartQuantity: 1,
        itemPrice: 0,
      };

      await axios.post(
        `${BASE_URL}/cart-service/cart/add_Items_ToCart`,
        containerItemData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // GA4 Add to Cart Event Tracking for container
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "add_to_cart", {
          currency: "INR",
          value: 0,
          items: [
            {
              item_id: containerItemId,
              item_name: "Free Container",
              price: 0,
              quantity: 1,
              item_category: "Container",
              promotion_id: "free_container_promo",
              promotion_name: "Free Container with Rice Purchase"
            },
          ],
        });
      }

      modalDisplayedRef.current = true;
      message.success({
        content: (
          <div className="flex items-center">
            <Package size={16} className="mr-2 text-green-500" />
            <span>Free steel container added to your cart!</span>
          </div>
        ),
        icon: null,
      });
      
      await fetchCartData();
    } catch (error) {
      console.error("Error adding container to cart:", error);
      message.error("Failed to add free container. Please try again.");
    }
  };

  // Plan details modal
  useEffect(() => {
    if (isPlanDetailsModalOpen && currentPlanDetails) {
      Modal.info({
        title: (
          <div className="flex items-center text-purple-700">
            {currentPlanDetails === "planA" ? (
              <Award className="mr-2 text-purple-600" size={22} />
            ) : (
              <Users className="mr-2 text-purple-600" size={22} />
            )}
            <span className="text-lg font-bold">
              {currentPlanDetails === "planA" 
                ? "Free Steel Container Policy" 
                : "Referral Program Details"}
            </span>
          </div>
        ),
        icon: null,
        content: (
          <div className="py-2">
            {currentPlanDetails === "planA" ? (
              <div>
                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-lg mb-4">
                  <div className="flex items-center mb-3">
                    <Calendar className="text-purple-600 mr-2" size={20} />
                    <h4 className="font-bold text-purple-800">Loyalty Timeline</h4>
                  </div>
                  <div className="flex items-center justify-between relative mb-2">
                    <div className="w-full h-1 bg-purple-200 absolute"></div>
                    <div className="z-10 bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center">1</div>
                    <div className="z-10 bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center">5</div>
                    <div className="z-10 bg-purple-700 text-white w-8 h-8 rounded-full flex items-center justify-center">9</div>
                  </div>
                  <div className="text-sm text-purple-700 flex justify-between">
                    <div className="text-center">Start</div>
                    <div className="text-center">Progress</div>
                    <div className="text-center">Keep Forever</div>
                  </div>
                </div>
                
                <h4 className="font-semibold mb-2 text-gray-700">How the Program Works:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Box className="text-purple-500 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>Buy a 26kg/10kg bag of rice to get a free steel container with your order</span>
                  </li>
                  <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>Purchase 9 rice bags over 3 years to keep the container permanently</span>
                  </li>
                  <li className="flex items-start">
                    <UserPlus className="text-blue-500 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>OR refer 9 friends who make a purchase to keep the container</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="text-amber-500 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>If there's a gap of 90 days between purchases, the container may be reclaimed</span>
                  </li>
                </ul>
                
                <Divider />
                
                <h4 className="font-semibold mb-2 text-gray-700">Benefits:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Zap className="text-yellow-500 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>Premium quality steel container that keeps rice fresh longer</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="text-yellow-500 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>Pest-proof, moisture-resistant storage solution</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="text-yellow-500 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>Easy-to-clean and maintain for years of use</span>
                  </li>
                </ul>
              </div>
            ) : (
              <div>
                <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg mb-4">
                  <div className="flex items-center mb-3">
                    <Share className="text-blue-600 mr-2" size={20} />
                    <h4 className="font-bold text-blue-800">Referral Program</h4>
                  </div>
                  <div className="flex items-center justify-center space-x-3 mb-3">
                    <div className="text-center bg-white rounded-lg px-3 py-2 shadow-sm">
                      <UserPlus size={24} className="text-blue-500 mx-auto mb-1" />
                      <div className="text-sm font-medium text-gray-800">Refer Friends</div>
                    </div>
                    <div className="text-gray-400">→</div>
                    <div className="text-center bg-white rounded-lg px-3 py-2 shadow-sm">
                      <Package size={24} className="text-purple-500 mx-auto mb-1" />
                      <div className="text-sm font-medium text-gray-800">Free Container</div>
                    </div>
                    <div className="text-gray-400">+</div>
                    <div className="text-center bg-white rounded-lg px-3 py-2 shadow-sm">
                      <DollarSign size={24} className="text-green-500 mx-auto mb-1" />
                      <div className="text-sm font-medium text-gray-800">₹50 Cashback</div>
                    </div>
                  </div>
                </div>
                
                <h4 className="font-semibold mb-2 text-gray-700">How the Program Works:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Share className="text-blue-500 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>Share your unique referral link with friends and family</span>
                  </li>
                  <li className="flex items-start">
                    <UserPlus className="text-blue-500 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>When they sign up and make their first purchase, you earn rewards</span>
                  </li>
                  <li className="flex items-start">
                    <Package className="text-purple-500 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>Get a free steel container added to your next order</span>
                  </li>
                  <li className="flex items-start">
                    <DollarSign className="text-green-500 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>PLUS ₹50 cashback credited to your account for each successful referral</span>
                  </li>
                </ul>
                
                <Divider />
                
                <h4 className="font-semibold mb-2 text-gray-700">Additional Benefits:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Zap className="text-yellow-500 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>No upper limit on referrals - refer more friends for more rewards</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="text-yellow-500 mr-2 flex-shrink-0 mt-1" size={16} />
                    <span>Special seasonal bonuses during festival periods</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ),
        okText: "Got it",
        width: 500,
        className: "plan-details-modal",
        onOk: () => {
          setIsPlanDetailsModalOpen(false);
          setCurrentPlanDetails(null);
        },
      });
    }
  }, [isPlanDetailsModalOpen, currentPlanDetails]);

  // Main function that handles adding items to cart and showing appropriate offer modals
  const handleItemAddedToCart = useCallback(
    async (item: ProductItem): Promise<void> => {
      const weight = parseWeight(item.weight);
      
      // First check if we've already shown modals for this session
      if (onePlusOneModalShown && movieOfferModalShown && modalDisplayedRef.current) {
        return;
      }
      
      // Check if any modals are currently open - don't show new modals
      if (onePlusOneModalOpenRef.current || movieOfferModalOpenRef.current) {
        return;
      }
      
      // Check if this is a 10kg or 26kg rice bag (eligible for container)
      if ((weight === 10 || weight === 26) && 
          containerPreference === null &&
          !containerModalCompletedRef.current &&
          !modalDisplayedRef.current) {
        showContainerModal(item);
        return; // Exit early to not show other modals at the same time
      }

      // 1kg rice bag offer
      if (weight === 1 && !onePlusOneModalShown && !hasShownOnePlusOne) {
        await maybeShowOnePlusOneModal(item);
        return; // Exit early to not show other modals
      }

      // 5kg movie ticket offer
      if (weight === 5 && !movieOfferModalShown && !hasShownMovieOffer) {
        await maybeShowMovieOfferModal(item);
        return; // Exit early to not show other modals
      }
    },
    [containerPreference, onePlusOneModalShown, movieOfferModalShown, hasShownOnePlusOne, hasShownMovieOffer]
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