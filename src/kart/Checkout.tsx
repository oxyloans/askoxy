import React, { useEffect, useState ,useContext} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message,Alert, Modal } from 'antd';
// import Header from './Header3';
import Footer from '../components/Footer';
// import Sidebar from './Sidebarrice';
import { ArrowLeft, CreditCard, Truck, Tag, ShoppingBag } from 'lucide-react';
import { FaBars, FaTimes } from 'react-icons/fa';
import decryptEas from './decryptEas';
import encryptEas from './encryptEas';
import { Loader2, X } from "lucide-react";
import Checkbox from 'antd';
import { CartContext } from '../until/CartContext';
import { log } from 'console';
import  BASE_URL  from "../Config";

interface CartItem {
  itemId: string;
  itemName: string;
  itemPrice: string;
  cartQuantity: string;
  quantity: number;
}

interface CartData {
  deliveryBoyFee: number;

}

interface Address {
  flatNo: string;
  landMark: string;
  address: string;
  pincode: string;
  addressType: 'Home' | 'Work' | 'Others';
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  whatsappNumber: string;
}

const CheckoutPage: React.FC = () => {
  const { state } = useLocation();
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [useWallet,setUseWallet] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [coupenDetails,setCoupenDetails] = useState<any>(null);
  const [coupenLoading,setCoupenLoading] = useState(false);
  const [walletAmount, setWalletAmount] = useState<number>(0);
  const [walletTotal,setWalletTotal] = useState<number>(0);
  const [coupenApplied,setCoupenApplied] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<'ONLINE' | 'COD'>('ONLINE');
  const [selectedAddress,setSelectedAddress] = useState<Address>(state?.selectedAddress || null)
  const [grandTotalAmount, setGrandTotalAmount] = useState<number>(0);
  const [deliveryBoyFee, setDeliveryBoyFee] = useState<number>(0);
  const [subGst,setSubGst] = useState(0);
  const [totalAmount,setTotalAmount]=useState<number>(0);
  const [walletMessage,setWalletMessage]=useState();
  const [grandTotal,setGrandTotal]=useState<number>(0);
  const [afterWallet,setAfterWallet] = useState<number>(0);
  const [usedWalletAmount,setUsedWalletAmount] = useState<number>(0);
   const [orderId,setOrderId] = useState<string>();
  const [profileData,setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    whatsappNumber: '',
  })
  const [merchantTransactionId,setMerchantTransactionId] = useState()
  const [paymentStatus,setPaymentStatus] = useState(null)
  const navigate = useNavigate();

  const customerId = localStorage.getItem('userId');
  const token = localStorage.getItem('accessToken');
  const userData = localStorage.getItem('profileData')

  const context = useContext(CartContext);

  if (!context) {
    throw new Error("CartDisplay must be used within a CartProvider");
  }

  const { count,setCount } = context;


  useEffect(() => {
    fetchCartData();
    totalCart();
    getWalletAmount();
    const queryParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(queryParams.entries());
    const order = params.trans;
    setOrderId(order)
    if(userData){
      setProfileData(JSON.parse(userData))
    }
  }, []);

  useEffect(()=>{
    const trans = localStorage.getItem('merchantTransactionId')
    const paymentId = localStorage.getItem('paymentId')
    console.log(trans===orderId);
    if(trans===orderId){
      Requery(paymentId)
    }
  },[orderId])

    // Handle checkbox toggle
    const handleCheckboxToggle = () => {
      const newValue = !useWallet;
      console.log({ newValue });
      setUseWallet(newValue);
      getWalletAmount();
  
      if (newValue) {
        Modal.info({
          title: "Wallet Amount Used",
          content: `You are using ₹${walletAmount} from your wallet.`,
          onOk() {
            console.log("OK clicked");
            grandTotalfunc();
          },
        });
      } else {
        // Show alert when the checkbox is unchecked
        Modal.info({
          title : "Wallet Amount Deselected",
          content:`You have removed the usage of ${walletAmount} from your wallet.`,
          onOk() {
            console.log("OK clicked");
          },
      });
      }
    };

  const fetchCartData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/customersCartItems?customerId=${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.customerCartResponseList) {
        const cartItemsMap = response.data.customerCartResponseList.reduce(
          (acc: { [key: string]: number }, item: CartItem) => {
            acc[item.itemId] = parseInt(item.cartQuantity);
            return acc;
          },
          {}
        );
        // Fix: Use cartItemsMap and correct syntax
        const totalQuantity = Object.values(cartItemsMap as Record<string, number>).reduce(
          (sum, qty) => sum + qty, 
          0
        );
        setCartData(response.data?.customerCartResponseList || []);
        setCount(totalQuantity)
      } else {
        setCartData([]);
        setCount(0)
      }
     
    } catch (error) {
      console.error('Error fetching cart items:', error);
      message.error('Failed to fetch cart items');
    }
  };

  const totalCart = async() => {
    console.log("total cart");
    
    try {
      const response = await axios.post(
        `${BASE_URL}/cart-service/cart/cartItemData`,{
        customerId
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setGrandTotalAmount(parseFloat(response.data.totalSumWithGstSum));
      setSubGst(response.data.totalGstSum);
      const totalDeliveryFee = response.data?.cartResponseList.reduce((sum:number, item :CartData) => sum + item.deliveryBoyFee, 0);
       console.log({totalDeliveryFee});
       setDeliveryBoyFee(totalDeliveryFee)
       setTotalAmount(parseFloat(response.data.totalSumWithGstSum))
       setGrandTotal(parseFloat(response.data.totalSum))
      
    } catch (error) {
      console.error('Error fetching cart items:', error);
      message.error('Failed to fetch cart items');
    }

   
  };

  // const calculateSubTotal = () => {
  //  const totalCartAmount = cartData.reduce(
  //   (acc, item) => acc + parseFloat(item.itemPrice) * parseInt(item.cartQuantity),
  //   0
  // ).toFixed(2);
    // console.log("totalCartAmount",totalCartAmount);
     // };
  // function for applying coupon
  const handleApplyCoupon = () => {
    // if (!couponCode.trim()) {
    //   message.warning('Please enter a coupon code');
    //   return;
    // }
    // message.info('Coupon functionality to be implemented');

    const data ={
      couponCode:couponCode,
      customerId: customerId,
      subTotal:grandTotalAmount
    }
    console.log("data ",data);
    setCoupenLoading(true);

    const response = axios.post(
      BASE_URL+"/order-service/applycoupontocustomer",data,{
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((response) => {
         console.log("coupen applied",response.data);
         const { discount, grandTotal } = response.data;
          message.info(response.data.message);
          setCoupenDetails(discount)
          setCoupenApplied(response.data.couponApplied)
          console.log("coupenapplied state", response.data.couponApplied);
          setCoupenLoading(false);

      }).catch((error) => {
        console.error("Error in applying coupon:", error);
        message.error("Failed to apply coupon");
        setCoupenLoading(false);
      })
  };
  // for removing coupen code
  const deleteCoupen = () => {
    setCouponCode("");
    setCoupenApplied(false);
    console.log("coupen removed");
    message.info("coupen removed successfully");
  };

  // for getting wallet details
  const getWalletAmount =()=>{
    const data ={
      customerId: customerId
    }
    const response = axios.post(
      BASE_URL+"/order-service/applyWalletAmountToCustomer",data,{
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((response) => {
         console.log("wallet amount",response.data);
         setWalletAmount(response.data.usableWalletAmountForOrder);
        // setWalletAmount(500);
        //  message.info(response.data.message);
         setWalletMessage(response.data.message);
         setWalletTotal(
          response.data.totalSum - response.data.usableWalletAmountForOrder
        );
      }).catch((error) => {
        console.error("Error in getting wallet amount:", error.response?.data||error.message);
        message.error("Failed to get wallet amount");
      })
  }

  

  // const handlePayment = async () => {
    
  //   try {
  //     // Check if there are out-of-stock items or quantity exceeds available stock
  //   const hasStockIssues = cartData.some(
  //     (item) => parseInt(item.cartQuantity) > item.quantity || item.quantity === 0
  //   );

  //   if (hasStockIssues) {
  //     Modal.error({
  //       title: "Stock Issues",
  //       content: "Some items in your cart are out of stock or exceed available stock. Please adjust the quantity or remove them before proceeding.",
  //       okText: "OK",
  //       onOk() {
  //         navigate("/main/mycart");
  //       }
  //     });
  //     return;
  //   }
  //     // if (grandTotalAmount === 0) {
  //     //   message.error("Please add items to cart");
  //     //   navigate("/main/dashboard/product");
  //     //   return;
  //     // }
  
  //     setLoading(true); // Prevent multiple clicks
  
  //     console.log({ selectedPayment });
  //     let wallet;
  //     if (useWallet) {
  //       wallet = walletAmount;
  //     } else {
  //       wallet = null;
  //     }
  //     let coupon, coupenAmount;
  //     if (coupenApplied && coupenDetails > 0) {
  //       coupon = couponCode;
  //       coupenAmount = coupenDetails;
  //     } else {
  //       coupon = null;
  //       coupenAmount = 0;
  //     }
  //     const response = await axios.post(
  //       BASE_URL + "/order-service/orderPlacedPaymet",
  //       {
  //         address: selectedAddress.address,
  //         customerId: customerId,
  //         flatNo: selectedAddress.flatNo,
  //         landMark: selectedAddress.landMark,
  //         orderStatus: selectedPayment,
  //         pincode: selectedAddress.pincode,
  //         walletAmount: wallet,
  //         couponCodeUsed: coupon,
  //         couponCodeValue: coupenDetails,
  //         deliveryBoyFee: deliveryBoyFee,
  //         amount: grandTotalAmount,
  //         subTotal:grandTotal
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  
  //     console.log(response.data);
  
  //     if (response.status === 200 && response.data) {
  //       if(response.data.status!=null){
  //         Modal.error({
  //           title: "Error",
  //           content: response.data.status,
  //           okText: "Ok",
  //           // cancelText: "No",
  //           onOk() {
  //             navigate("/main/mycart");
  //           },
  //         })
  //         return;
  //       }
  //       if (selectedPayment === "COD" && response.data.paymentId === null) {
  //         fetchCartData();
  //         if(response.data.status === null){
  //           Modal.success({
  //                content: "Order placed Successfully",
  //                onOk: () => {
  //                  navigate("/main/myorders");
  //                  fetchCartData();
  //                },
  //              })
  //            }else{
  //              Modal.error({
  //                content: response.data.status,
  //                onOk: () => {
  //                  navigate("/main/mycart");
  //                  fetchCartData();
  //                },
  //              })
             
  //            }
  //       } else if (
  //         selectedPayment === "ONLINE" &&
  //         response.data.paymentId !== null
  //       ) {
  //         const number = localStorage.getItem('whatsappNumber')
  //     const withoutCountryCode = number?.replace("+91", "");
  //     console.log({withoutCountryCode});
  //     sessionStorage.setItem('address',JSON.stringify(selectedAddress))
  //         const data = {
  //           mid: "1152305",
  //           // amount: grandTotalAmount,
  //           amount: 1,
  //           merchantTransactionId: response.data.paymentId,
  //           transactionDate: new Date(),
  //           terminalId: "getepay.merchant128638@icici",
  //           udf1: withoutCountryCode,
  //           udf2: `${profileData.firstName}  ${profileData.lastName}`,
  //           udf3: profileData.email,
  //           udf4: "",
  //           udf5: "",
  //           udf6: "",
  //           udf7: "",
  //           udf8: "",
  //           udf9: "",
  //           udf10: "",
  //           ru: "https://sandbox.askoxy.ai/main/checkout?trans=" + response.data.paymentId,
  //           callbackUrl: `https://sandbox.askoxy.ai/main/checkout?trans=${response.data.paymentId}`,
  //           currency: "INR",
  //           paymentMode: "ALL",
  //           bankId: "",
  //           txnType: "single",
  //           productType: "IPG",
  //           txnNote: "Rice Order In Live",
  //           vpa: "getepay.merchant128638@icici",
  //         };
  //         console.log({ data });
  
  //         // You might need to call a payment function here (e.g., initiatePayment(data))
  //         getepayPortal(data);
  //       }
  //     } else {
  //       message.error("Order failed");
  //     }
  //   } catch (error: any) {
  //     console.error("Payment error:", error);
  //     message.error("Payment failed. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handlePayment = async () => {
    try {
        // Check for stock issues
        const hasStockIssues = cartData.some(
            (item) => parseInt(item.cartQuantity) > item.quantity || item.quantity === 0
        );

        if (hasStockIssues) {
            Modal.error({
                title: "Stock Issues",
                content: "Some items in your cart are out of stock or exceed available stock. Please adjust before proceeding.",
                okText: "OK",
                onOk: () => navigate("/main/mycart"),
            });
            return;
        }

        if (grandTotalAmount === 0) {
            setSelectedPayment("COD");
        }

        setLoading(true); // Prevent multiple clicks

        const response = await axios.post(
            `${BASE_URL}/order-service/orderPlacedPaymet`,
            {
                address: selectedAddress.address,
                customerId,
                flatNo: selectedAddress.flatNo,
                landMark: selectedAddress.landMark,
                orderStatus: selectedPayment,
                pincode: selectedAddress.pincode,
                walletAmount: usedWalletAmount,  // ✅ Send only the used wallet amount
                couponCode: coupenApplied ? couponCode.toUpperCase() : null,
                couponValue: coupenApplied ? coupenDetails : 0,
                deliveryBoyFee,
                amount: grandTotalAmount,
                subTotal: grandTotal,
                gstAmount:subGst,
                orderFrom: "WEB",
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        console.log(response.data);

        if (response.status === 200 && response.data) {
            if (response.data.status) {
                Modal.success({
                    title: "Success",
                    content: response.data.status,
                    okText: "Ok",
                    onOk: () => navigate("/main/myorders"),
                });
                return;
            }

            await fetchCartData(); // Ensure cart updates

            if (selectedPayment === "COD" && !response.data.paymentId) {
                Modal.success({
                    content: "Order placed Successfully",
                    onOk: () => navigate("/main/myorders"),
                });
            } else if (selectedPayment === "ONLINE" && response.data.paymentId) {
                const number = localStorage.getItem("whatsappNumber");
                const withoutCountryCode = number?.replace("+91", "");
                sessionStorage.setItem("address", JSON.stringify(selectedAddress));

                const paymentData = {
                    mid: "1152305",
                    amount: grandTotalAmount,
                    // amount: 1,
                    merchantTransactionId: response.data.paymentId,
                    transactionDate: new Date(),
                    terminalId: "getepay.merchant128638@icici",
                    udf1: withoutCountryCode,
                    udf2: `${profileData.firstName} ${profileData.lastName}`,
                    udf3: profileData.email,
                    ru: `https://www.askoxy.ai/main/checkout?trans=${response.data.paymentId}`,
                    callbackUrl: `https://www.askoxy.ai/main/checkout?trans=${response.data.paymentId}`,
                    currency: "INR",
                    paymentMode: "ALL",
                    txnType: "single",
                    productType: "IPG",
                    txnNote: "Rice Order In Live",
                    vpa: "getepay.merchant128638@icici",
                };

                console.log({ paymentData });
                getepayPortal(paymentData);
            } else {
                message.error("Order failed");
            }
        }
    } catch (error) {
        console.error("Payment error:", error);
        message.error("Payment failed. Please try again.");
    } finally {
        setLoading(false);
    }
};

  const getepayPortal = async (data:any) => {
    console.log("getepayPortal", data);
    const JsonData = JSON.stringify(data);
    const mer = data.merchantTransactionId

    var ciphertext = encryptEas(JsonData);
    var newCipher = ciphertext.toUpperCase();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      mid: data.mid,
      terminalId: data.terminalId,
      req: newCipher,
    });
    await fetch(
      "https://portal.getepay.in:8443/getepayPortal/pg/generateInvoice",
      {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      }
    )
      .then((response) => response.text())
      .then((result) => {
        var resultobj = JSON.parse(result);
        var responseurl = resultobj.response;
        console.log("===getepayPortal responseurl======",responseurl);
        var data = decryptEas(responseurl);
        console.log("===getepayPortal data======");
        console.log(data);
        data = JSON.parse(data);
        localStorage.setItem("paymentId", data.paymentId)
        localStorage.setItem("merchantTransactionId", mer)
        const paymentUrl = data.paymentUrl; // Assuming API returns a payment link

        Modal.confirm({
          title: "Proceed to Payment?",
          content: "Click on Yes to continue to the payment gateway.",
          okText: "Yes",
          cancelText: "No",
          onOk() {
            window.location.href = paymentUrl; // Open link in new tab
          },
        });
      })
      .catch((error) => console.log("getepayPortal", error.response));
    setLoading(false);
  };

  function Requery(paymentId:any) {
    setLoading(false);
    console.log("requery");
    if (
      paymentStatus === "PENDING" ||
      paymentStatus === "" ||
      paymentStatus === null
    ) {
      console.log("Before.....",paymentId)

      const Config = {
        "Getepay Mid": 1152305,
        "Getepay Terminal Id": "getepay.merchant128638@icici",
        "Getepay Key": "kNnyys8WnsuOXgBlB9/onBZQ0jiYNhh4Wmj2HsrV/wY=",
        "Getepay IV": "L8Q+DeKb+IL65ghKXP1spg==",
      };

      const JsonData = {
        mid: Config["Getepay Mid"],
        paymentId: parseInt(paymentId),
        referenceNo: "",
        status: "",
        terminalId: Config["Getepay Terminal Id"],
        vpa: "",
      };

      var ciphertext = encryptEas(
        JSON.stringify(JsonData),
        Config["Getepay Key"],
        Config["Getepay IV"]
      );

      var newCipher = ciphertext.toUpperCase();

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Cookie",
        "AWSALBAPP-0=remove; AWSALBAPP-1=remove; AWSALBAPP-2=remove; AWSALBAPP-3=remove"
      );

      var raw = JSON.stringify({
        mid: Config["Getepay Mid"],
        terminalId: Config["Getepay Terminal Id"],
        req: newCipher,
      });

      fetch(
        "https://portal.getepay.in:8443/getepayPortal/pg/invoiceStatus",
        {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
        }
      )
        .then((response) => response.text())
        .then((result) => {
          var resultobj = JSON.parse(result);
          if (resultobj.response != null) {
            console.log("Requery ID result", paymentId);
            var responseurl = resultobj.response;
            console.log({ responseurl });
            var data = decryptEas(responseurl);
            data = JSON.parse(data);
            console.log("Payment Result", data);
            setPaymentStatus(data.paymentStatus);
            console.log(data.paymentStatus);
            if (
              data.paymentStatus == "SUCCESS" ||
              data.paymentStatus == "FAILED"
            ) {
              // clearInterval(intervalId); 294182409
              if (data.paymentStatus === "FAILED") {
                const add = sessionStorage.getItem("address");
                
                if (add) {
                  setSelectedAddress(JSON.parse(add) as Address); // Ensure it's parsed as Address
                }
              }

              if(data.paymentStatus === "SUCCESS"){
                axios({
                  method: "get",
                  url: BASE_URL + `/order-service/api/download/invoice?paymentId=${localStorage.getItem('merchantTransactionId')}&&userId=${customerId}`,
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                })
                .then((response) => {
                  console.log(response.data);
                })
                .catch((error) => {
                  console.error("Error in payment confirmation:", error);
                });
              }
              
              axios({
                method: "POST",
                url: BASE_URL + "/order-service/orderPlacedPaymet",
                data: {
                  paymentId: localStorage.getItem('merchantTransactionId'),
                  paymentStatus: data.paymentStatus,
                },
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              })
                .then((secondResponse) => {
                                  console.log(
                                    "Order Placed with Payment API:",
                                    secondResponse.data
                                  );
                                  localStorage.removeItem('paymentId')
                                  localStorage.removeItem('merchantTransactionId')
                                  fetchCartData();
                                  if(secondResponse.data.status === null){
                                   Modal.success({
                                        content: "Order placed Successfully",
                                        onOk: () => {
                                          navigate("/main/myorders");
                                          fetchCartData();
                                        },
                                      })
                                    }else{
                                      Modal.success({
                                        content: secondResponse.data.status,
                                        onOk: () => {
                                          navigate("/main/myorders");
                                          fetchCartData();
                                        },
                                      })
                                    
                                    }
                                  // setLoading(false);
                                })
                .catch((error) => {
                  console.error("Error in payment confirmation:", error);
                });
            } else {
            }
          }
        })
        .catch((error) => console.log("Payment Status", error));
    }
    // else{
    //   clearInterval(intervalId)
    // }
  }


  function grandTotalfunc() {
    let total = totalAmount + deliveryBoyFee; // Start with total including delivery fee
    let usedWallet = 0; // Track how much wallet is actually used

    if (coupenApplied) {
        total -= coupenDetails;
    }

    if (useWallet && walletAmount > 0) {  // Process only if user has wallet balance
        if (walletAmount >= total) {
            usedWallet = total;  // Use only what's needed
            total = 0;  
        } else {
            usedWallet = walletAmount; // Use full wallet balance
            total -= walletAmount;
        }
    }

    // Ensure total is never negative
    total = Math.max(0, total);

    setAfterWallet(walletAmount ? walletAmount - usedWallet : 0); // Update remaining wallet balance
    setUsedWalletAmount(usedWallet);  // Store how much wallet is used
    setGrandTotalAmount(total);

    if(total === 0){
      console.log("Get all Values",{total});
      
      setSelectedPayment('COD');
    }

    console.log("Used Wallet:", usedWallet);
    console.log("Final Grand Total:", total);
}

  

  useEffect(() => {
    grandTotalfunc();
  }, [coupenApplied, useWallet, grandTotalAmount,deliveryBoyFee]);


  return (
    <div className="flex flex-col min-h-screen">

      <div className="flex-1 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">

          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-6">
                <button
                  onClick={() => navigate(-1)}
                  className="text-gray-600 hover:text-gray-800 mr-3"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center">
                  <ShoppingBag className="w-6 h-6 text-green-500 mr-2" />
                  <h2 className="text-xl font-bold text-purple-600">Checkout Details</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center">
                        <Tag className="w-5 h-5 text-orange-500 mr-2" />
                        <h2 className="text-lg font-semibold">Apply Coupon</h2>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={couponCode.toUpperCase()}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {coupenApplied!==true &&(
                          <>
                        <button
                          onClick={handleApplyCoupon}
                          disabled={coupenLoading}
                          className="bg-orange-500 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-orange-600 transition"
                        >
                          {coupenLoading ? "Applying..." : "Apply"}
                        </button>
                        </>)}
                        {coupenApplied==true &&(
                            <button
                            onClick={deleteCoupen}
                            className="bg-orange-500 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-orange-600 transition"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center text-sm text-gray-600">
                    {walletAmount > 0 ? (
                      <div className="walletContainer">
                       <div className="walletHeader">
                        <input
                           type="checkbox"
                          checked={useWallet}
                         onChange={handleCheckboxToggle}
                         className="checkbox"
                         />
                       <span className="checkboxLabel">Use Wallet Balance</span>
                     </div>
                 <p className="walletMessage">
                     You can use up to <span className="highlight">₹{walletAmount}</span> from your wallet for this order.
                   </p>
                 </div>
                ) : (
                   <div>
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                      Note: {walletMessage}
                   </div>
                    )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                      <h2 className="text-lg font-semibold">Payment Method</h2>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm transition ${selectedPayment === 'ONLINE'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-green-500'
                            }`}
                            disabled={grandTotalAmount === 0}
                          onClick={() => setSelectedPayment('ONLINE')}
                        >
                          <CreditCard className="w-4 h-4" />
                          <span className="font-medium">Online Payment</span>
                        </button>
                        <button
                          className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm transition ${selectedPayment === 'COD'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-green-500'
                            }`}
                          onClick={() => setSelectedPayment('COD')}
                        >
                          <Truck className="w-4 h-4" />
                          <span className="font-medium">Cash on Delivery</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-4">
                    <div className="p-4 border-b border-gray-100">
                      <h2 className="text-lg font-semibold">Order Summary</h2>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Items Total</span>
                        <span className="font-medium">₹{grandTotal}</span>
                      </div>
                      {coupenApplied==true &&(
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Coupon Applied</span>
                        <span className="font-medium text-green-600">- ₹{coupenDetails}</span>
                      </div>)}
                      {useWallet && (
                       <div className="flex justify-between text-sm">
                      <span className="text-gray-600">from Wallet</span>
                      <span className="font-medium text-green-600">- ₹{usedWalletAmount}</span>
                        </div>
                       )}
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="font-medium text-green-600">{deliveryBoyFee===0?"Free":"+ ₹"+deliveryBoyFee}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total GST </span>
                        <span className="font-medium text-green-600">+ ₹{subGst}</span>
                      </div>
                      <div className="border-t border-gray-100 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Grand Total</span>
                          <span className="text-lg font-bold text-green-600">₹{grandTotalAmount}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50">
                      <button
                        onClick={()=>handlePayment()}
                        disabled={loading}
                        className="w-full bg-green-500 text-white py-3 rounded-lg text-sm font-medium shadow-sm hover:bg-green-600 transition transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          'Processing...'
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <span>Proceed to Pay</span>
                            <span className="font-bold">₹{grandTotalAmount}</span>
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;