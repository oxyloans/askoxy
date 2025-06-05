import React from "react";

// Define the FAQ item type
interface FAQItem {
  id: number;
  question: string;
  answer: React.ReactNode;
}

const RiceOfferFAQs: React.FC = () => {
  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "What are the current promotional offers?",
      answer: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            🎁 <strong>Buy 2 KG Rice</strong> → Get <strong>1 KG Free</strong>{" "}
            (2+1 Offer)
          </li>
          {/* <li>🍿 <strong>Buy 5 KG Rice</strong> → Get <strong>1 FREE PVR Movie Ticket</strong></li> */}
          <li>
            🛢️ <strong>Buy 10 KG Rice</strong> → Get a{" "}
            <strong>FREE 20KG+ Steel Container</strong> (Worth ₹1800)
          </li>
          <li>
            🛢️ <strong>Buy 26 KG Rice</strong> → Get a{" "}
            <strong>FREE 20KG+ Steel Container</strong> (Worth ₹1800)
          </li>
        </ul>
      ),
    },
    {
      id: 2,
      question: "Which rice brands are eligible?",
      answer: (
        <ul className="list-disc pl-5 space-y-2">
          {/* <li>✅ <strong>OxyRice (5 KG)</strong> – Eligible for the <strong>movie ticket</strong> offer</li> */}
          <li>
            ✅ <strong>All rice brands</strong> – Eligible for the{" "}
            <strong>steel container</strong> offers (10 KG & 26 KG packs)
          </li>
        </ul>
      ),
    },
    {
      id: 4,
      question: "Do I need to sign any agreement or policy?",
      answer: (
        <p>
          ✅ <strong>Yes.</strong> To receive the steel container, you must sign
          the offer policy as part of the terms and conditions.
        </p>
      ),
    },
    {
      id: 5,
      question: "How much rice should I buy to own the steel container?",
      answer: (
        <div>
          <p>You have two options:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>
              🔵 <strong>Plan A – Purchase-Based</strong>: Buy{" "}
              <strong>9 rice bags</strong> (10 KG or 26 KG) within{" "}
              <strong>3 years</strong>
            </li>
            <li>
              🟠 <strong>Plan B – Referral-Based</strong>: Refer{" "}
              <strong>9 new users</strong> to the <strong>ASKOXY.ai</strong>{" "}
              platform
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 7,
      question: "Are the 2+1 and container offers applicable more than once?",
      answer: (
        <p>
          ❌ <strong>No.</strong> Both the <strong>2+1 KG offer</strong> and the{" "}
          <strong>steel container offer</strong> can be claimed{" "}
          <strong>only once per address</strong>.
        </p>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-purple-50">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-purple-800">
        Promotional Offers – Frequently Asked Questions
      </h1>
      <div className="space-y-6">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-purple-600"
          >
            <div className="p-4 bg-purple-100">
              <h3 className="font-bold text-lg text-purple-800">
                {faq.question}
              </h3>
            </div>
            <div className="p-4 bg-white">{faq.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiceOfferFAQs;
