import {useState,useEffect,useRef} from 'react';

import { load } from "@cashfreepayments/cashfree-js";
import axios, { Axios } from 'axios';

function PaymentCashfree() {

  const [paymentSessionId, setPaymentSessionId] = useState(null);

let cashfree;
 var initializeSDK = async function () {
    cashfree = await load({
      mode: "sandbox",
    });
  };
  initializeSDK();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSessionId = urlParams.get("order_id");
    setPaymentSessionId(paymentSessionId);
    if (paymentSessionId) {
        axios.post("https://sandbox.cashfree.com/pg/orders/"+paymentSessionId, {
          paymentSessionId: paymentSessionId,
        },{
          "headers": {
           'x-api-version': '2025-01-01',
           'x-client-id': '314136d1b036c39636bdd6c6ef631413',
           'x-client-secret': '252fe8909bd29ad945e5b1a1a8e9e05f7819f9f8',
           'Content-Type': 'application/json'
         }})
          .then((response) => {
            console.log("Payment successful:", response.data);
          })
          .catch((error) => {
            console.error("Error processing payment:", error);
          });
    }
  
  }, []);

  const doPayment = async () => {

// const options = {
//   url : 'https://sandbox.cashfree.com/pg/orders',
//   method: 'POST',
//   headers: {
//     'x-client-id': '314136d1b036c39636bdd6c6ef631413',
//     'x-client-secret': '252fe8909bd29ad945e5b1a1a8e9e05f7819f9f8',
//     'x-api-version': '2025-01-01',
//     'Content-Type': 'application/json'
//   },
//   data: {
//     "order_currency":"INR",
//     "order_amount":500,
//     "customer_details":{
//       "customer_id":"order_0008",
//       "customer_phone":"8125861874"
//     },
//     "order_meta":{
//       "return_url":"https://www.askoxy.ai/paymentCashfree?order_id={paymentSessionId}"
//     }
//   }
// };

// try {
//   const response = await axios(options);
//   const data = await response.json();
//   console.log(data);
// } catch (error) {
//   console.error(error);
// }

    let checkoutOptions = {
      paymentSessionId: "session_AbP-Is5zzQjOGV369cxfwO6tlIpkYQNiR3YRyWS-b5D2yipOOGyHW0fOp7xwxtl7C5gF7IinJpnSxkz9M351ZY38bnQwVNdmuqMOhjfjPFv-WvIrlcEnBq4-dHMpayment",
      redirectTarget: "_self",
    };
    cashfree.checkout(checkoutOptions);
  };

  return (
    <div className="row">
      <p>Click below to open the checkout page in current tab</p>
      <button type="submit" className="btn btn-primary" id="renderBtn" onClick={doPayment}>
        Pay Now
      </button>
    </div>
  );
}
export default PaymentCashfree;