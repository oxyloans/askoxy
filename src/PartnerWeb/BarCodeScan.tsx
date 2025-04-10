import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import BASE_URL from "../Config";
// Define types for our data
interface Product {
  barcode: string;
  name: string;
  category: string;
  price: number;
  weight: number | string;
  image?: string;
  description?: string;
  mrp?: number;
  units?: string;
  saveAmount?: number;
  savePercentage?: number;
  quantity: number;
  scannedBarcode?: string;
  scannedBarcodes?: string[];
}

interface ScannedItem extends Product {
  quantity: number;
  scannedBarcode: string;
  scannedBarcodes?: string[];
}

interface Category {
  categoryName: string;
  itemsResponseDtoList: {
    itemId: string;
    barcodeValue: string;
    itemName: string;
    itemPrice: number;
    weight: number | string;
    itemImage?: string;
    itemDescription?: string;
    itemMrp?: number;
    units?: string;
    saveAmount?: number;
    savePercentage?: number;
  }[];
}

interface ContainerType {
  BARCODE: string;
  WEIGHT: string;
  NAME: string;
}

// Define container types
const CONTAINER_TYPES = {
  SMALL: {
    BARCODE: "RICSTA10",
    WEIGHT: "10",
    NAME: "10kg Rice Container",
  },
  LARGE: {
    BARCODE: "RICPRE10",
    WEIGHT: "26",
    NAME: "26kg Rice Container",
  },
};

// Create the BarcodeScanner component
const BarcodeScanner: React.FC = () => {
  // State management
  const [scanning, setScanning] = useState<boolean>(false);
  const [scannedItems, setScannedItems] = useState<Record<string, ScannedItem>>(
    {}
  );
  const [scanCount, setScanCount] = useState<number>(0);
  const [barcodeInput, setBarcodeInput] = useState<string>("");
  const [showManualMatch, setShowManualMatch] = useState<boolean>(false);
  const [categoryInput, setCategoryInput] = useState<string>("");
  const [productNameInput, setProductNameInput] = useState<string>("");
  const [weightInput, setWeightInput] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetail, setShowProductDetail] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [matchedProducts, setMatchedProducts] = useState<Product[]>([]);
  const [showMatchesModal, setShowMatchesModal] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [processingPayment, setProcessingPayment] = useState<boolean>(false);
  const [containerWeight, setContainerWeight] = useState<string>("");
  const [containerBarcode, setContainerBarcode] = useState<string>("");
  const [containerScanned, setContainerScanned] = useState<boolean>(false);
  const [containerPrice, setContainerPrice] = useState<number>(0);
  const [lastScannedBarcode, setLastScannedBarcode] = useState<string>("");
  const [lastScanTime, setLastScanTime] = useState<number>(0);
  const [has10kgRice, setHas10kgRice] = useState<boolean>(false);
  const [has26kgRice, setHas26kgRice] = useState<boolean>(false);
  const [userData, setUserData] = useState({
    mobileNumber: "",
    whatsappNumber: "",
  });
  const SCAN_COOLDOWN_MS = 2000; // 2 seconds cooldown

  // Reference for video element and barcode detection
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const token = localStorage.getItem("accessToken");
  const customerId = localStorage.getItem("userId");

  // Fetch all categories and products when component mounts
  useEffect(() => {
    getAllCategories();
    checkProfileCompletion();
  }, []);

  // Process products from API response
  useEffect(() => {
    if (categories.length > 0) {
      // Process all products from categories
      const allProducts: Product[] = [];
      categories.forEach((category) => {
        if (category.itemsResponseDtoList) {
          category.itemsResponseDtoList.forEach((item) => {
            // Create a product object
            allProducts.push({
              barcode: item.barcodeValue,
              name: item.itemName,
              category: category.categoryName,
              price: item.itemPrice,
              weight: item.weight,
              image: item.itemImage,
              description: item.itemDescription,
              mrp: item.itemMrp,
              units: item.units,
              saveAmount: item.saveAmount,
              savePercentage: item.savePercentage,
              quantity: 0,
            });
          });
        }
      });

      setProducts(allProducts);
      setLoading(false);
    }
  }, [categories]);

  // Check rice product scans to determine allowed container sizes
  useEffect(() => {
    // Reset rice bag flags
    let has10kg = false;
    let has26kg = false;

    // Check for rice products in scanned items
    Object.values(scannedItems).forEach((item) => {
      // Check if the item is rice
      if (item.category.toLowerCase().includes("rice")) {
        // Check the weight
        if (item.weight === 10 || item.weight === "10") {
          has10kg = true;
        } else if (item.weight === 26 || item.weight === "26") {
          has26kg = true;
        }
      }
    });

    setHas10kgRice(has10kg);
    setHas26kgRice(has26kg);

    // If container was already scanned, check if it's still valid based on the current rice bags
    if (containerScanned) {
      const validContainer = isContainerValid(containerWeight);
      if (!validContainer) {
        alert(
          "The selected container is not suitable for your current rice bag selection. Please select an appropriate container."
        );
        setContainerScanned(false);
        setContainerBarcode("");
        setContainerPrice(0);
        setContainerWeight("");
      }
    }
  }, [scannedItems]);

  const checkProfileCompletion = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user-service/customerProfileDetails?customerId=${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        const profileData = response.data;
        setUserData(profileData);
      }
    } catch (error) {
      console.error("ERROR", error);
    }
    return false;
  };

  // Calculate total price whenever scanned items or container price changes
  useEffect(() => {
    let total = 0;

    // Calculate total price of all scanned items
    Object.values(scannedItems).forEach((item) => {
      total += item.price * item.quantity;
    });

    // Add the container price first
    total += containerPrice;

    // Then subtract it if a container is scanned
    if (containerScanned) {
      total -= containerPrice;
    }

    // Ensure total doesn't go below zero
    setTotalPrice(Math.max(0, total));
  }, [scannedItems, containerScanned, containerPrice]);

  // Function to check if a container is valid for the current rice bags
  const isContainerValid = (containerSize: string): boolean => {
    // Both 10kg and 26kg bags - allow 26kg container
    if (has10kgRice && has26kgRice) {
      return containerSize === CONTAINER_TYPES.LARGE.WEIGHT;
    }
    // Only 26kg bags - allow 26kg container
    else if (has26kgRice) {
      return containerSize === CONTAINER_TYPES.LARGE.WEIGHT;
    }
    // Only 10kg bags - allow 10kg container
    else if (has10kgRice) {
      return containerSize === CONTAINER_TYPES.SMALL.WEIGHT;
    }
    // No rice bags - any container is fine
    return true;
  };

  // Function to fetch categories from API
  const getAllCategories = () => {
    setLoading(true);

    // For demo purposes - mock data
    const mockCategories: Category[] = [
      {
        categoryName: "Rice",
        itemsResponseDtoList: [
          {
            itemId: "1",
            barcodeValue: "RICE001",
            itemName: "Premium Basmati Rice",
            itemPrice: 120,
            weight: 10,
            units: "kg",
            itemImage: "https://via.placeholder.com/150",
            itemDescription: "High quality basmati rice",
          },
          {
            itemId: "2",
            barcodeValue: "RICE002",
            itemName: "Long Grain Rice",
            itemPrice: 220,
            weight: 26,
            units: "kg",
            itemImage: "https://via.placeholder.com/150",
            itemDescription: "Premium long grain rice",
          },
        ],
      },
      {
        categoryName: "Containers",
        itemsResponseDtoList: [
          {
            itemId: "3",
            barcodeValue: "RICSTA10",
            itemName: "10kg Rice Container",
            itemPrice: 50,
            weight: 10,
            units: "kg",
            itemImage: "https://via.placeholder.com/150",
            itemDescription: "Container for 10kg rice",
          },
          {
            itemId: "4",
            barcodeValue: "RICPRE10",
            itemName: "26kg Rice Container",
            itemPrice: 100,
            weight: 26,
            units: "kg",
            itemImage: "https://via.placeholder.com/150",
            itemDescription: "Container for 26kg rice",
          },
        ],
      },
    ];

    setCategories(mockCategories);

    axios
      .get(BASE_URL + "/product-service/showItemsForCustomrs")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.log(error);
        alert("Failed to fetch product data");
        setLoading(false);
      });
  };

  // Initialize camera handling
  const startCamera = async () => {
    try {
      setScanning(true);

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } else {
        alert("Your browser doesn't support camera access");
        setScanning(false);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Failed to access camera. Please check permissions.");
      setScanning(false);
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();

      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    setScanning(false);
  };

  // Simulate barcode detection
  const scanBarcode = () => {
    // In a real app, you would use a barcode scanning library
    // For this example, we'll simulate scanning after 2 seconds
    setTimeout(() => {
      const mockBarcodes = ["RICE001", "RICE002", "RICSTA10", "RICPRE10"];
      const randomBarcode =
        mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
      handleBarCodeScanned(randomBarcode);
    }, 2000);
  };

  // Handle barcode scanning result
  const handleBarCodeScanned = (data: string) => {
    const currentTime = Date.now();

    // Check if this is the same barcode scanned within the cooldown period
    if (
      data === lastScannedBarcode &&
      currentTime - lastScanTime < SCAN_COOLDOWN_MS
    ) {
      console.log("Ignoring duplicate scan within cooldown period");
      return;
    }

    // Update last scanned info
    setLastScannedBarcode(data);
    setLastScanTime(currentTime);

    stopCamera();
    processBarcodeScan(data);
  };

  // Process a barcode scan
  const processBarcodeScan = (barcode: string) => {
    if (!barcode) return false;

    // Clean up the scanned barcode (remove spaces, convert to uppercase)
    const cleanBarcode = barcode.replace(/\s+/g, "").toUpperCase();
    console.log(`Processing cleaned barcode: ${cleanBarcode}`);

    // Check for container barcodes
    if (
      cleanBarcode.startsWith(CONTAINER_TYPES.SMALL.BARCODE) ||
      cleanBarcode.startsWith(CONTAINER_TYPES.LARGE.BARCODE)
    ) {
      return handleContainerScan(cleanBarcode);
    }

    // Regular product handling
    const matchingProducts = products.filter((product) => {
      // Add null check before accessing barcode property
      if (!product.barcode) return false;

      const normalizedProductBarcode = product.barcode
        .replace(/\s+/g, "")
        .toUpperCase();
      return (
        cleanBarcode.startsWith(normalizedProductBarcode) ||
        normalizedProductBarcode.startsWith(cleanBarcode)
      );
    });

    if (matchingProducts.length === 1) {
      // Exact match found
      const product = matchingProducts[0];

      // Increment scan count
      setScanCount(scanCount + 1);

      setScannedItems((prevItems) => {
        const updated = { ...prevItems };

        if (updated[product.barcode]) {
          updated[product.barcode].quantity++;
          // Initialize scannedBarcodes if it doesn't exist
          if (!updated[product.barcode].scannedBarcodes) {
            updated[product.barcode].scannedBarcodes = [];
          }
          // Now TypeScript knows scannedBarcodes is definitely initialized
          updated[product.barcode].scannedBarcodes!.push(barcode);
        } else {
          updated[product.barcode] = {
            ...product,
            quantity: 1,
            scannedBarcode: barcode, // Maintain for backward compatibility
            scannedBarcodes: [barcode], // New array to store all scanned barcodes
          };
        }

        return updated;
      });

      // Clear the input field
      setBarcodeInput("");

      return true;
    } else if (matchingProducts.length > 1) {
      // Multiple matches found, let user select
      setMatchedProducts(matchingProducts);
      setShowMatchesModal(true);
      return true;
    } else {
      // No match found
      alert(`Barcode ${barcode} not found in database.`);
      return false;
    }
  };

  // Handle container scanning logic
  const handleContainerScan = (cleanBarcode: string) => {
    // Check if a container is already added
    if (containerScanned) {
      alert("Only one container can be added per transaction.");
      return false;
    }

    // Determine container type
    let containerType: ContainerType | null = null;

    if (cleanBarcode.startsWith(CONTAINER_TYPES.SMALL.BARCODE)) {
      containerType = CONTAINER_TYPES.SMALL;
    } else if (cleanBarcode.startsWith(CONTAINER_TYPES.LARGE.BARCODE)) {
      containerType = CONTAINER_TYPES.LARGE;
    }

    if (!containerType) {
      alert("The scanned container type is not recognized.");
      return false;
    }

    // Check if the container is valid for the current rice bags
    if (!isContainerValid(containerType.WEIGHT)) {
      // Determine what container is allowed
      let allowedContainer = "";

      if (has10kgRice && has26kgRice) {
        allowedContainer = CONTAINER_TYPES.LARGE.NAME;
      } else if (has26kgRice) {
        allowedContainer = CONTAINER_TYPES.LARGE.NAME;
      } else if (has10kgRice) {
        allowedContainer = CONTAINER_TYPES.SMALL.NAME;
      }

      alert(
        `Based on your rice bag selection, only ${allowedContainer} is allowed.`
      );
      return false;
    }

    // Find the exact container product to get its price
    const containerProduct = products.find((product) => {
      // Add null check before accessing barcode property
      if (!product.barcode) return false;

      const normalizedProductBarcode = product.barcode
        .replace(/\s+/g, "")
        .toUpperCase();
      return cleanBarcode.startsWith(normalizedProductBarcode);
    });

    if (!containerProduct) {
      alert(`Container barcode ${cleanBarcode} not found in database.`);
      return false;
    }

    // Set container details - STORE THE FULL SCANNED BARCODE HERE
    setContainerWeight(containerType.WEIGHT);
    setContainerPrice(containerProduct.price || 0);
    setContainerBarcode(cleanBarcode); // Store the full scanned barcode
    setContainerScanned(true);

    alert(
      `${containerType.NAME} has been added. Container price will be deducted from total.`
    );

    setBarcodeInput("");
    return true;
  };

  // Calculate totals for the order summary
  const calculateTotal = () => {
    // Calculate the subtotal of all scanned items
    let subtotal = 0;
    Object.values(scannedItems).forEach((item) => {
      subtotal += item.price * item.quantity;
    });

    // Get the container discount (if a container was scanned)
    const containerDiscount = containerScanned ? containerPrice : 0;

    // If container is scanned, add its price to subtotal first
    if (containerScanned) {
      subtotal += containerDiscount;
    }

    // Calculate final total by subtracting container discount
    const total = Math.max(0, subtotal - containerDiscount);

    return {
      subtotal,
      containerDiscount,
      total,
    };
  };

  // Find a product by category, name and weight
  const findProductByAttributes = () => {
    if (!categoryInput && !productNameInput) {
      alert("Please enter at least a category or product name to search.");
      return;
    }

    // Get the first 3 letters of category and product name if provided
    const categoryPrefix = categoryInput
      ? categoryInput.substring(0, 3).toLowerCase()
      : "";
    const namePrefix = productNameInput
      ? productNameInput.substring(0, 3).toLowerCase()
      : "";

    // Convert weight to number
    const weightNum = parseFloat(weightInput);

    // Find products that match the criteria
    const possibleMatches = products.filter((p) => {
      const categoryMatch = categoryInput
        ? p.category.toLowerCase().startsWith(categoryPrefix)
        : true;
      const nameMatch = productNameInput
        ? p.name.toLowerCase().startsWith(namePrefix)
        : true;
      const weightMatch = weightNum
        ? Math.abs(Number(p.weight) - weightNum) < 1
        : true; // Allow small difference in weight

      return categoryMatch && nameMatch && weightMatch;
    });

    if (possibleMatches.length === 0) {
      alert("No matching products found.");
      return null;
    } else {
      // Show all matches in a modal for user selection
      setMatchedProducts(possibleMatches);
      setShowMatchesModal(true);
      return possibleMatches;
    }
  };

  // Select a product from the matches modal
  const selectProduct = (product: Product) => {
    processBarcodeScan(product.barcode);
    setShowMatchesModal(false);
    setShowManualMatch(false);
    clearManualInputs();
  };

  // Clear all manual input fields
  const clearManualInputs = () => {
    setCategoryInput("");
    setProductNameInput("");
    setWeightInput("");
  };

  // Clear all scanned items
  const clearAllItems = () => {
    setScannedItems({});
    setScanCount(0);
    setContainerScanned(false);
    setContainerBarcode("");
    setContainerPrice(0);
    setContainerWeight("");
  };

  // Process payment and submit barcode data
  const processPayment = async () => {
    // Set processing state
    setProcessingPayment(true);

    try {
      // In a real app, you would handle payment processing here
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create an array to hold all the scanned barcodes
      let allBarcodes: string[] = [];

      // Get all individual barcodes from each scanned item
      Object.values(scannedItems).forEach((item) => {
        if (item.scannedBarcodes && item.scannedBarcodes.length > 0) {
          // If we have the new scannedBarcodes array, use all of those barcodes
          allBarcodes = [...allBarcodes, ...item.scannedBarcodes];
        } else if (item.scannedBarcode) {
          // Fallback to the old scannedBarcode property if needed
          allBarcodes.push(item.scannedBarcode);
        }
      });

      // If container is scanned, include its barcode
      if (containerScanned && containerBarcode) {
        allBarcodes.push(containerBarcode);
      }

      // Create the request payload
      const payload = {
        barCodeNumber: allBarcodes, // Now includes ALL scanned barcodes
        containerWeight: parseFloat(containerWeight) || 0,
        registerContactNumber: userData.mobileNumber || userData.whatsappNumber, // Use user's phone
        status: "DELIVERED",
      };

      console.log("payload", payload);
      console.log("Total barcodes being sent:", allBarcodes.length);

      const response = await axios.post(
        BASE_URL + "/product-service/individualBarcodeScanner",
        payload
      );

      // Handle the response
      if (response.status === 200) {
        setProcessingPayment(false);
        setShowPaymentModal(false);

        // Clear all data after successful submission
        clearAllItems();

        alert(
          "Your payment has been processed and items have been submitted successfully!"
        );
      } else {
        throw new Error("Failed to submit barcodes");
      }

      // For now, simulate successful submission
      setProcessingPayment(false);
      setShowPaymentModal(false);
      clearAllItems();
      alert(
        "Your payment has been processed and items have been submitted successfully!"
      );
    } catch (error) {
      console.error("Error submitting data:", error);
      setProcessingPayment(false);
      alert(
        "There was a problem processing your payment or submitting your data. Please try again."
      );
    }
  };

  // Cancel the payment process
  const cancelPayment = () => {
    setShowPaymentModal(false);
  };

  // View product detail
  const viewProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  // Handle submission of scanned items
  const handleSubmit = () => {
    if (Object.keys(scannedItems).length === 0) {
      return;
    }

    // Show the payment modal
    setShowPaymentModal(true);
  };

  // Loading indicator
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
        <p className="mt-6 text-xl font-medium text-purple-600">
          Loading products...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Scanner Section */}
        {scanning ? (
          <div className="relative w-full max-w-xl mx-auto aspect-video bg-black rounded-xl overflow-hidden shadow-lg border-4 border-purple-600">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-purple-400 border-dashed rounded-lg opacity-70"></div>
            </div>

            <button
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-purple-600 text-white font-medium rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-200"
              onClick={() => {
                stopCamera();
                scanBarcode(); // Simulate barcode detection
              }}
            >
              Cancel Scan
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl">
            <div className="mb-5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter barcode manually"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  className="w-full p-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  onKeyDown={(e) =>
                    e.key === "Enter" && processBarcodeScan(barcodeInput)
                  }
                />
                <button
                  onClick={() => processBarcodeScan(barcodeInput)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-purple-600 hover:text-purple-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex justify-center my-6">
              <button
                onClick={startCamera}
                className="flex items-center justify-center px-8 py-3 bg-purple-600 text-white font-medium rounded-full shadow-md hover:bg-purple-700 transition-colors duration-200 transform hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Scan Barcode
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={clearAllItems}
                className="flex items-center justify-center px-4 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Clear All
              </button>

              {/* <button 
                onClick={() => setShowManualMatch(!showManualMatch)}
                className="flex items-center justify-center px-4 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {showManualMatch ? 'Hide Manual Match' : 'Manual Match'}
              </button>
               */}
              <button
                onClick={handleSubmit}
                className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Checkout ({Object.keys(scannedItems).length} items)
              </button>
            </div>
          </div>
        )}

        {/* Manual Match Form */}
        {showManualMatch && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-purple-800">
              Manual Product Match
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="Rice, Pulses, etc."
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="Basmati, Sona Masoori, etc."
                  value={productNameInput}
                  onChange={(e) => setProductNameInput(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  placeholder="10, 26, etc."
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={clearManualInputs}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                Clear
              </button>

              <button
                onClick={findProductByAttributes}
                className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                Find Product
              </button>
            </div>
          </div>
        )}

        {/* Scanned Items */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-purple-800">
              Scanned Items ({Object.keys(scannedItems).length})
            </h2>
            <div className="text-lg font-bold">
              Total: ₹{totalPrice.toFixed(2)}
            </div>
          </div>

          {Object.keys(scannedItems).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto mb-3 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p>No items scanned yet. Start scanning products!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Details
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.values(scannedItems).map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.barcode}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">
                          {item.category}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.weight} {item.units || "kg"}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          ₹{item.price.toFixed(2)} each
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium">
                        <button
                          onClick={() => viewProductDetail(item)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setScannedItems((prev) => {
                              const updated = { ...prev };
                              delete updated[item.barcode];
                              return updated;
                            });
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Container Info */}
          {containerScanned && (
            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-purple-800">
                    Container Added
                  </h3>
                  <p className="text-sm text-purple-600">
                    {containerWeight}kg Rice Container (Price: ₹
                    {containerPrice.toFixed(2)})
                  </p>
                </div>
                <button
                  onClick={() => {
                    setContainerScanned(false);
                    setContainerBarcode("");
                    setContainerPrice(0);
                    setContainerWeight("");
                  }}
                  className="text-red-600 hover:text-red-900 font-medium text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Product Detail Modal */}
        {showProductDetail && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-full overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedProduct.name}
                  </h2>
                  <button
                    onClick={() => setShowProductDetail(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row">
                  <div className="w-full sm:w-1/3 flex-shrink-0 bg-gray-100 rounded-lg mb-4 sm:mb-0 sm:mr-4 flex items-center justify-center p-4">
                    {selectedProduct.image ? (
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="max-h-32 object-contain"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-20 w-20 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="flex-grow">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Barcode</p>
                        <p className="font-medium">{selectedProduct.barcode}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-medium">
                          {selectedProduct.category}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Weight</p>
                        <p className="font-medium">
                          {selectedProduct.weight}{" "}
                          {selectedProduct.units || "kg"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="font-medium">
                          ₹{selectedProduct.price.toFixed(2)}
                        </p>
                      </div>

                      {selectedProduct.mrp && (
                        <div>
                          <p className="text-sm text-gray-500">MRP</p>
                          <p className="font-medium">
                            ₹{selectedProduct.mrp.toFixed(2)}
                          </p>
                        </div>
                      )}

                      {selectedProduct.savePercentage && (
                        <div>
                          <p className="text-sm text-gray-500">Savings</p>
                          <p className="font-medium text-green-600">
                            {selectedProduct.savePercentage}% off
                          </p>
                        </div>
                      )}
                    </div>

                    {selectedProduct.description && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">Description</p>
                        <p className="text-sm mt-1">
                          {selectedProduct.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowProductDetail(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-3 hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Matches Modal */}
        {showMatchesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-full overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-900">
                    Select Product
                  </h2>
                  <button
                    onClick={() => setShowMatchesModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-4">
                    Multiple products found. Please select the correct one:
                  </p>

                  <div className="space-y-2">
                    {matchedProducts.map((product, index) => (
                      <div
                        key={index}
                        className="p-3 border border-gray-200 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors duration-200"
                        onClick={() => selectProduct(product)}
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-8 w-8 rounded-md object-cover"
                              />
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {product.name}
                            </p>
                            <div className="flex text-xs text-gray-500 mt-1">
                              <span className="mr-3">{product.category}</span>
                              <span className="mr-3">
                                {product.weight} {product.units || "kg"}
                              </span>
                              <span>₹{product.price.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowMatchesModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-full overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-900">
                    Order Summary
                  </h2>
                  <button
                    onClick={cancelPayment}
                    className="text-gray-500 hover:text-gray-700"
                    disabled={processingPayment}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mt-4">
                  <div className="border-b border-gray-200 pb-4">
                    <p className="text-sm font-medium text-gray-500">
                      Items ({Object.keys(scannedItems).length})
                    </p>

                    <div className="mt-2 space-y-2">
                      {Object.values(scannedItems).map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center">
                            <div className="text-sm">{item.name}</div>
                            <div className="text-xs text-gray-500 ml-2">
                              x{item.quantity}
                            </div>
                          </div>
                          <div className="text-sm font-medium">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Container section */}
                  {containerScanned && (
                    <div className="border-b border-gray-200 py-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-purple-700">
                          Container Discount
                        </span>
                        <span className="font-medium text-purple-700">
                          - ₹{containerPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Total section */}
                  <div className="py-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-medium">Total</span>
                      <span className="text-lg font-bold">
                        ₹{calculateTotal().total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={processPayment}
                    disabled={processingPayment}
                    className={`w-full py-3 rounded-lg font-medium text-white flex items-center justify-center ${
                      processingPayment
                        ? "bg-purple-400"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    {processingPayment ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      "Process Payment"
                    )}
                  </button>

                  <button
                    onClick={cancelPayment}
                    disabled={processingPayment}
                    className="w-full py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarcodeScanner;
