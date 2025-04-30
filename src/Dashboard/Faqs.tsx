import React from 'react';

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
          <li>🎁 <strong>Buy 1 KG Rice</strong> → Get <strong>1 KG Free</strong> (1+1 Offer)</li>
          <li>🍿 <strong>Buy 5 KG Rice</strong> → Get <strong>1 FREE PVR Movie Ticket</strong></li>
          <li>🛢️ <strong>Buy 10 KG Rice</strong> → Get a <strong>FREE 18+ KG Steel Container</strong> (Worth ₹1800)</li>
          <li>🛢️ <strong>Buy 26 KG Rice</strong> → Get a <strong>FREE 35+ KG Steel Container</strong> (Worth ₹2300)</li>
        </ul>
      )
    },
    {
      id: 2,
      question: "Which rice brands are eligible for these offers?",
      answer: (
        <ul className="list-disc pl-5 space-y-2">
          <li>✅ <strong>OxyRice (5 KG)</strong> – Eligible for the <strong>movie ticket</strong> offer</li>
          <li>✅ <strong>Lalitha Minikit Sonamasoori</strong> & other select brands – Eligible for the <strong>steel container</strong> offers (10 KG & 26 KG)</li>
        </ul>
      )
    },
    {
      id: 3,
      question: "Can I choose any movie with the free ticket?",
      answer: (
        <p>✅ <strong>Yes</strong>, you can choose from available movie options like <strong>HIT</strong> or <strong>RETRO</strong></p>
      )
    },
    {
      id: 4,
      question: "Do I need to sign any agreement to claim offers?",
      answer: (
        <p>✅ <strong>Yes</strong>, you must <strong>sign the offer policy</strong> to receive the <strong>steel container</strong></p>
      )
    },
    {
      id: 5,
      question: "How can I own the steel container?",
      answer: (
        <div>
          <p>You can choose either of the following plans:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>🔵 <strong>Plan A – Purchase-Based</strong>: Buy <strong>9 rice bags</strong> (either 10 KG or 26 KG) <strong>within 3 years</strong></li>
            <li>🟠 <strong>Plan B – Referral-Based</strong>: <strong>Refer 9 new users</strong> to <strong>ASKOXY.ai</strong></li>
          </ul>
        </div>
      )
    },
    {
      id: 6,
      question: "Do I get 2 movie tickets if I buy a 10 KG rice bag?",
      answer: (
        <p>❌ <strong>No</strong>, the 10 KG rice bag qualifies for the <strong>steel container</strong>, not movie tickets</p>
      )
    },
    {
      id: 7,
      question: "Can I claim the 1+1 or container offers more than once?",
      answer: (
        <p>❌ <strong>No</strong>, these offers can only be <strong>claimed once per address</strong></p>
      )
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-purple-50">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-purple-800">
        Rice Purchase Offer – Frequently Asked Questions
      </h1>
      <div className="space-y-6">
        {faqs.map((faq) => (
          <div 
            key={faq.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-purple-600"
          >
            <div className="p-4 bg-purple-100">
              <h3 className="font-bold text-lg text-purple-800">{faq.question}</h3>
            </div>
            <div className="p-4 bg-white">
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiceOfferFAQs;