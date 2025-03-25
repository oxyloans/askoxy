import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import BASE_URL from "../Config";

interface BarcodeDetector {
  detect: (canvas: HTMLCanvasElement) => Promise<Array<{ rawValue: string }>>;
}

interface BarcodeScannerProps {
  onBarcodeScanned?: (barcode: string) => void;
}

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

const CONTAINER_TYPES = {
  SMALL: {
    BARCODE: "RICSTA10",
    WEIGHT: "10",
    NAME: "10kg Rice Container"
  },
  LARGE: {
    BARCODE: "RICPRE10",
    WEIGHT: "26",
    NAME: "26kg Rice Container"
  }
};

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onBarcodeScanned = () => {}
}) => {
  const [scannedItems, setScannedItems] = useState<Record<string, ScannedItem>>({});
  const [scanCount, setScanCount] = useState<number>(0);
  const [barcodeInput, setBarcodeInput] = useState<string>('');
  const [categoryInput, setCategoryInput] = useState<string>('');
  const [productNameInput, setProductNameInput] = useState<string>('');
  const [weightInput, setWeightInput] = useState<string>('');
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
  const [containerWeight, setContainerWeight] = useState<string>('');
  const [containerBarcode, setContainerBarcode] = useState<string>('');
  const [containerScanned, setContainerScanned] = useState<boolean>(false);
  const [containerPrice, setContainerPrice] = useState<number>(0);
  const [lastScannedBarcode, setLastScannedBarcode] = useState<string>('');
  const [lastScanTime, setLastScanTime] = useState<number>(0);
  const [has10kgRice, setHas10kgRice] = useState<boolean>(false);
  const [has26kgRice, setHas26kgRice] = useState<boolean>(false);
  const [userData, setUserData] = useState({ mobileNumber: "", whatsappNumber: "" });
  
  const SCAN_COOLDOWN_MS = 2000;
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectorRef = useRef<BarcodeDetector | null>(null);
  const token = localStorage.getItem("accessToken");
  const customerId = localStorage.getItem("userId");

  const barcodeTypes = [
    'CODE_128', 'EAN_13', 'EAN_8', 'QR_CODE', 'PDF_417', 'UPC_E', 
    'DATA_MATRIX', 'CODE_39', 'CODE_93', 'ITF', 'CODABAR', 'UPC_A', 'AZTEC'
  ];

  useEffect(() => {
    getAllCategories();
    checkProfileCompletion();
  }, []);

  useEffect(() => {
    const initBarcodeDetection = async () => {
      if ('BarcodeDetector' in window) {
        detectorRef.current = new (window as any).BarcodeDetector({
          formats: barcodeTypes
        });
      } else {
        detectorRef.current = {
          detect: async (canvas: HTMLCanvasElement) => {
            return Math.random() < 0.1 ? [{
              rawValue: ['RICE001', 'RICE002', 'RICSTA10', 'RICPRE10'][
                Math.floor(Math.random() * 4)
              ]
            }] : [];
          }
        };
      }
    };

    initBarcodeDetection();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      const allProducts: Product[] = [];
      categories.forEach(category => {
        if (category.itemsResponseDtoList) {
          category.itemsResponseDtoList.forEach(item => {
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
              quantity: 0
            });
          });
        }
      });
      setProducts(allProducts);
      setLoading(false);
    }
  }, [categories]);

  useEffect(() => {
    let has10kg = false;
    let has26kg = false;
    
    Object.values(scannedItems).forEach(item => {
      if (item.category.toLowerCase().includes('rice')) {
        if (item.weight === 10 || item.weight === '10') has10kg = true;
        else if (item.weight === 26 || item.weight === '26') has26kg = true;
      }
    });
    
    setHas10kgRice(has10kg);
    setHas26kgRice(has26kg);
    
    if (containerScanned) {
      const validContainer = isContainerValid(containerWeight);
      if (!validContainer) {
        alert('The selected container is not suitable for your current rice bag selection.');
        setContainerScanned(false);
        setContainerBarcode('');
        setContainerPrice(0);
        setContainerWeight('');
      }
    }
  }, [scannedItems]);

  useEffect(() => {
    let total = 0;
    Object.values(scannedItems).forEach(item => {
      total += item.price * item.quantity;
    });
    total += containerPrice;
    if (containerScanned) total -= containerPrice;
    setTotalPrice(Math.max(0, total));
  }, [scannedItems, containerScanned, containerPrice]);

  const checkProfileCompletion = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user-service/customerProfileDetails?customerId=${customerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) setUserData(response.data);
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  const isContainerValid = (containerSize: string): boolean => {
    if (has10kgRice && has26kgRice) return containerSize === CONTAINER_TYPES.LARGE.WEIGHT;
    else if (has26kgRice) return containerSize === CONTAINER_TYPES.LARGE.WEIGHT;
    else if (has10kgRice) return containerSize === CONTAINER_TYPES.SMALL.WEIGHT;
    return true;
  };

  const getAllCategories = () => {
    setLoading(true);
    const mockCategories: Category[] = [
      {
        categoryName: "Rice",
        itemsResponseDtoList: [
          { itemId: "1", barcodeValue: "RICE001", itemName: "Premium Basmati Rice", itemPrice: 120, weight: 10, units: "kg", itemImage: "https://via.placeholder.com/150", itemDescription: "High quality basmati rice" },
          { itemId: "2", barcodeValue: "RICE002", itemName: "Long Grain Rice", itemPrice: 220, weight: 26, units: "kg", itemImage: "https://via.placeholder.com/150", itemDescription: "Premium long grain rice" }
        ]
      },
      {
        categoryName: "Containers",
        itemsResponseDtoList: [
          { itemId: "3", barcodeValue: "RICSTA10", itemName: "10kg Rice Container", itemPrice: 50, weight: 10, units: "kg", itemImage: "https://via.placeholder.com/150", itemDescription: "Container for 10kg rice" },
          { itemId: "4", barcodeValue: "RICPRE10", itemName: "26kg Rice Container", itemPrice: 100, weight: 26, units: "kg", itemImage: "https://via.placeholder.com/150", itemDescription: "Container for 26kg rice" }
        ]
      }
    ];
    
    setCategories(mockCategories);
    
    axios.get(BASE_URL + "/product-service/showItemsForCustomrs")
      .then((response) => setCategories(response.data))
      .catch((error) => {
        console.log(error);
        alert("Failed to fetch product data");
        setLoading(false);
      });
  };

  const startCamera = async () => {
    try {
      setScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        requestAnimationFrame(detectBarcodes);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Failed to access camera. Please check permissions and ensure camera is available.");
      setScanning(false);
    }
  };

  const detectBarcodes = async () => {
    if (!scanning || !videoRef.current || !canvasRef.current || !detectorRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) {
      requestAnimationFrame(detectBarcodes);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const barcodes = await detectorRef.current.detect(canvas);
      if (barcodes.length > 0) {
        const barcode = barcodes[0].rawValue;
        if (barcode) {
          handleBarCodeScanned(barcode);
          return;
        }
      }
    } catch (error) {
      console.error('Barcode detection error:', error);
    }

    if (scanning) requestAnimationFrame(detectBarcodes);
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const handleManualBarcodeEntry = () => {
    if (barcodeInput.trim()) {
      handleBarCodeScanned(barcodeInput.trim());
    } else {
      alert('Please enter a valid barcode');
    }
  };

  const handleBarCodeScanned = (data: string) => {
    const currentTime = Date.now();
    
    if (data === lastScannedBarcode && currentTime - lastScanTime < SCAN_COOLDOWN_MS) {
      console.log("Ignoring duplicate scan within cooldown period");
      return;
    }
    
    setLastScannedBarcode(data);
    setLastScanTime(currentTime);
    stopCamera();
    const success = processBarcodeScan(data);
    if (success) {
      setBarcodeInput('');
      onBarcodeScanned(data);
    }
  };

  const processBarcodeScan = (barcode: string) => {
    if (!barcode) return false;
    
    const cleanBarcode = barcode.replace(/\s+/g, '').toUpperCase();
    console.log(`Processing cleaned barcode: ${cleanBarcode}`);
    
    if (cleanBarcode.startsWith(CONTAINER_TYPES.SMALL.BARCODE) || 
        cleanBarcode.startsWith(CONTAINER_TYPES.LARGE.BARCODE)) {
      return handleContainerScan(cleanBarcode);
    }
    
    const matchingProducts = products.filter(product => {
      if (!product.barcode) return false;
      const normalizedProductBarcode = product.barcode.replace(/\s+/g, '').toUpperCase();
      return cleanBarcode.startsWith(normalizedProductBarcode) || 
             normalizedProductBarcode.startsWith(cleanBarcode);
    });
    
    if (matchingProducts.length === 1) {
      const product = matchingProducts[0];
      setScanCount(scanCount + 1);
      
      setScannedItems(prevItems => {
        const updated = { ...prevItems };
        if (updated[product.barcode]) {
          updated[product.barcode].quantity++;
          if (!updated[product.barcode].scannedBarcodes) {
            updated[product.barcode].scannedBarcodes = [];
          }
          updated[product.barcode].scannedBarcodes!.push(barcode);
        } else {
          updated[product.barcode] = {
            ...product,
            quantity: 1,
            scannedBarcode: barcode,
            scannedBarcodes: [barcode]
          };
        }
        return updated;
      });
      return true;
    } else if (matchingProducts.length > 1) {
      setMatchedProducts(matchingProducts);
      setShowMatchesModal(true);
      return true;
    } else {
      alert(`Barcode ${barcode} not found in database.`);
      return false;
    }
  };

  const handleContainerScan = (cleanBarcode: string) => {
    if (containerScanned) {
      alert('Only one container can be added per transaction.');
      return false;
    }
    
    let containerType: ContainerType | null = null;
    
    if (cleanBarcode.startsWith(CONTAINER_TYPES.SMALL.BARCODE)) {
      containerType = CONTAINER_TYPES.SMALL;
    } else if (cleanBarcode.startsWith(CONTAINER_TYPES.LARGE.BARCODE)) {
      containerType = CONTAINER_TYPES.LARGE;
    }
    
    if (!containerType) {
      alert('The scanned container type is not recognized.');
      return false;
    }
    
    if (!isContainerValid(containerType.WEIGHT)) {
      let allowedContainer = '';
      if (has10kgRice && has26kgRice) allowedContainer = CONTAINER_TYPES.LARGE.NAME;
      else if (has26kgRice) allowedContainer = CONTAINER_TYPES.LARGE.NAME;
      else if (has10kgRice) allowedContainer = CONTAINER_TYPES.SMALL.NAME;
      alert(`Based on your rice bag selection, only ${allowedContainer} is allowed.`);
      return false;
    }
    
    const containerProduct = products.find(product => {
      if (!product.barcode) return false;
      return product.barcode.replace(/\s+/g, '').toUpperCase() === cleanBarcode;
    });

    if (!containerProduct) {
      alert(`Container barcode ${cleanBarcode} not found in database.`);
      return false;
    }

    setContainerWeight(containerType.WEIGHT);
    setContainerPrice(containerProduct.price || 0);
    setContainerBarcode(cleanBarcode);
    setContainerScanned(true);
    
    alert(`${containerType.NAME} has been added. Container price will be deducted from total.`);
    return true;
  };

  const calculateTotal = () => {
    let subtotal = 0;
    Object.values(scannedItems).forEach(item => {
      subtotal += item.price * item.quantity;
    });
    const containerDiscount = containerScanned ? containerPrice : 0;
    if (containerScanned) subtotal += containerDiscount;
    const total = Math.max(0, subtotal - containerDiscount);
    return { subtotal, containerDiscount, total };
  };

  const findProductByAttributes = () => {
    if (!categoryInput && !productNameInput) {
      alert('Please enter at least a category or product name to search.');
      return;
    }
    
    const categoryPrefix = categoryInput ? categoryInput.substring(0, 3).toLowerCase() : '';
    const namePrefix = productNameInput ? productNameInput.substring(0, 3).toLowerCase() : '';
    const weightNum = parseFloat(weightInput);
    
    const possibleMatches = products.filter(p => {
      const categoryMatch = categoryInput ? 
        p.category.toLowerCase().startsWith(categoryPrefix) : true;
      const nameMatch = productNameInput ? 
        p.name.toLowerCase().startsWith(namePrefix) : true;
      const weightMatch = weightNum ? 
        Math.abs(Number(p.weight) - weightNum) < 1 : true;
      return categoryMatch && nameMatch && weightMatch;
    });
    
    if (possibleMatches.length === 0) {
      alert('No matching products found.');
      return null;
    } else {
      setMatchedProducts(possibleMatches);
      setShowMatchesModal(true);
      return possibleMatches;
    }
  };

  const selectProduct = (product: Product) => {
    processBarcodeScan(product.barcode);
    setShowMatchesModal(false);
    clearManualInputs();
  };

  const clearManualInputs = () => {
    setCategoryInput('');
    setProductNameInput('');
    setWeightInput('');
  };

  const clearAllItems = () => {
    setScannedItems({});
    setScanCount(0);
    setContainerScanned(false);
    setContainerBarcode('');
    setContainerPrice(0);
    setContainerWeight('');
  };

  const processPayment = async () => {
    setProcessingPayment(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      let allBarcodes: string[] = [];
      Object.values(scannedItems).forEach(item => {
        if (item.scannedBarcodes && item.scannedBarcodes.length > 0) {
          allBarcodes = [...allBarcodes, ...item.scannedBarcodes];
        } else if (item.scannedBarcode) {
          allBarcodes.push(item.scannedBarcode);
        }
      });
      if (containerScanned && containerBarcode) allBarcodes.push(containerBarcode);
      
      const payload = {
        barCodeNumber: allBarcodes,
        containerWeight: parseFloat(containerWeight) || 0,
        registerContactNumber: userData.mobileNumber || userData.whatsappNumber,
        status: "DELIVERED"
      };
      
      const response = await axios.post(
        BASE_URL + "/product-service/individualBarcodeScanner",
        payload
      );
      
      if (response.status === 200) {
        setProcessingPayment(false);
        setShowPaymentModal(false);
        clearAllItems();
        alert("Your payment has been processed and items have been submitted successfully!");
      } else {
        throw new Error("Failed to submit barcodes");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setProcessingPayment(false);
      alert("There was a problem processing your payment or submitting your data.");
    }
  };

  const cancelPayment = () => setShowPaymentModal(false);
  const viewProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };
  const handleSubmit = () => {
    if (Object.keys(scannedItems).length === 0) return;
    setShowPaymentModal(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
        <p className="mt-6 text-xl font-medium text-purple-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6">
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
            
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
              <button
                className="px-6 py-3 bg-purple-600 text-white font-medium rounded-full shadow-lg hover:bg-purple-700"
                onClick={stopCamera}
              >
                Cancel Scan
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl">
            <div className="mb-5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter barcode manually or scan"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && barcodeInput.trim()) handleManualBarcodeEntry();
                  }}
                  className="w-full p-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleManualBarcodeEntry}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-purple-600 hover:text-purple-800"
                  disabled={!barcodeInput.trim()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 my-6">
              <button
                onClick={startCamera}
                className="flex items-center justify-center px-8 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Scan with Camera
              </button>
              <button
                onClick={handleManualBarcodeEntry}
                disabled={!barcodeInput.trim()}
                className={`flex items-center justify-center px-8 py-3 rounded-full ${
                  barcodeInput.trim()
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Process Manual Entry
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={clearAllItems}
                className="flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All
              </button>
              
              <button
                onClick={handleSubmit}
                className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Checkout ({Object.keys(scannedItems).length} items)
              </button>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-purple-800">Scanned Items ({Object.keys(scannedItems).length})</h2>
            <div className="text-lg font-bold">Total: ₹{totalPrice.toFixed(2)}</div>
          </div>
          
          {Object.keys(scannedItems).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>No items scanned yet. Start scanning products!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.values(scannedItems).map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="h-10 w-10 rounded-md object-cover" />
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.barcode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">{item.category}</div>
                        <div className="text-sm text-gray-500">{item.weight} {item.units || 'kg'}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</div>
                        <div className="text-xs text-gray-500">₹{item.price.toFixed(2)} each</div>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium">
                        <button onClick={() => viewProductDetail(item)} className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                        <button onClick={() => {
                          setScannedItems(prev => {
                            const updated = {...prev};
                            delete updated[item.barcode];
                            return updated;
                          });
                        }} className="text-red-600 hover:text-red-900">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {containerScanned && (
            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-purple-800">Container Added</h3>
                  <p className="text-sm text-purple-600">{containerWeight}kg Rice Container (Price: ₹{containerPrice.toFixed(2)})</p>
                </div>
                <button onClick={() => {
                  setContainerScanned(false);
                  setContainerBarcode('');
                  setContainerPrice(0);
                  setContainerWeight('');
                }} className="text-red-600 hover:text-red-900 font-medium text-sm">Remove</button>
              </div>
            </div>
          )}
        </div>
        
        {showProductDetail && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-full overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
                  <button onClick={() => setShowProductDetail(false)} className="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mt-4 flex flex-col sm:flex-row">
                  <div className="w-full sm:w-1/3 flex-shrink-0 bg-gray-100 rounded-lg mb-4 sm:mb-0 sm:mr-4 flex items-center justify-center p-4">
                    {selectedProduct.image ? (
                      <img src={selectedProduct.image} alt={selectedProduct.name} className="max-h-32 object-contain" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
                        <p className="font-medium">{selectedProduct.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Weight</p>
                        <p className="font-medium">{selectedProduct.weight} {selectedProduct.units || 'kg'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="font-medium">₹{selectedProduct.price.toFixed(2)}</p>
                      </div>
                      {selectedProduct.mrp && (
                        <div>
                          <p className="text-sm text-gray-500">MRP</p>
                          <p className="font-medium">₹{selectedProduct.mrp.toFixed(2)}</p>
                        </div>
                      )}
                      {selectedProduct.savePercentage && (
                        <div>
                          <p className="text-sm text-gray-500">Savings</p>
                          <p className="font-medium text-green-600">{selectedProduct.savePercentage}% off</p>
                        </div>
                      )}
                    </div>
                    {selectedProduct.description && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">Description</p>
                        <p className="text-sm mt-1">{selectedProduct.description}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={() => setShowProductDetail(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-3 hover:bg-gray-50">Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {showMatchesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-full overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-900">Select Product</h2>
                  <button onClick={() => setShowMatchesModal(false)} className="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-4">Multiple products found. Please select the correct one:</p>
                  <div className="space-y-2">
                    {matchedProducts.map((product, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-purple-50 cursor-pointer" onClick={() => selectProduct(product)}>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="h-8 w-8 rounded-md object-cover" />
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            <div className="flex text-xs text-gray-500 mt-1">
                              <span className="mr-3">{product.category}</span>
                              <span className="mr-3">{product.weight} {product.units || 'kg'}</span>
                              <span>₹{product.price.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={() => setShowMatchesModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-full overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                  <button onClick={cancelPayment} className="text-gray-500 hover:text-gray-700" disabled={processingPayment}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mt-4">
                  <div className="border-b border-gray-200 pb-4">
                    <p className="text-sm font-medium text-gray-500">Items ({Object.keys(scannedItems).length})</p>
                    <div className="mt-2 space-y-2">
                      {Object.values(scannedItems).map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="text-sm">{item.name}</div>
                            <div className="text-xs text-gray-500 ml-2">x{item.quantity}</div>
                          </div>
                          <div className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {containerScanned && (
                    <div className="border-b border-gray-200 py-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-purple-700">Container Discount</span>
                        <span className="font-medium text-purple-700">- ₹{containerPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                  <div className="py-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-medium">Total</span>
                      <span className="text-lg font-bold">₹{calculateTotal().total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <button
                    onClick={processPayment}
                    disabled={processingPayment}
                    className={`w-full py-3 rounded-lg font-medium text-white flex items-center justify-center ${processingPayment ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'}`}
                  >
                    {processingPayment ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : 'Process Payment'}
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