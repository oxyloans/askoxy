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
      question: "Which rice brands are eligible?",
      answer: (
        <ul className="list-disc pl-5 space-y-2">
          <li>✅ <strong>OxyRice (5 KG)</strong> – Eligible for the <strong>movie ticket</strong> offer</li>
          <li>✅ <strong>All rice brands</strong> – Eligible for the <strong>steel container</strong> offers (10 KG & 26 KG packs)</li>
        </ul>
      )
    },
    {
      id: 3,
      question: "Can I choose any movie for the free ticket?",
      answer: (
        <div>
          <p>✅ <strong>Yes!</strong> You can pick from the available options:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><em>HIT</em></li>
            <li><em>RETRO</em></li>
          </ul>
        </div>
      )
    },
    {
      id: 4,
      question: "Do I need to sign any agreement or policy?",
      answer: (
        <p>✅ <strong>Yes.</strong> To receive the steel container, you must sign the offer policy as part of the terms and conditions.</p>
      )
    },
    {
      id: 5,
      question: "How much rice should I buy to own the steel container?",
      answer: (
        <div>
          <p>You have two options:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>🔵 <strong>Plan A – Purchase-Based</strong>: Buy <strong>9 rice bags</strong> (10 KG or 26 KG) within <strong>3 years</strong></li>
            <li>🟠 <strong>Plan B – Referral-Based</strong>: Refer <strong>9 new users</strong> to the <strong>ASKOXY.ai</strong> platform</li>
          </ul>
        </div>
      )
    },
    {
      id: 6,
      question: "If I buy a 10 KG rice bag, do I get 2 movie tickets?",
      answer: (
        <p>❌ <strong>No.</strong> The 10 KG purchase qualifies you for the <strong>steel container offer</strong>, not movie tickets. Movie tickets are awarded <strong>only</strong> for <strong>OxyRice 5 KG packs</strong> (1 ticket per pack).</p>
      )
    },
    {
      id: 7,
      question: "Are the 1+1 and container offers applicable more than once?",
      answer: (
        <p>❌ <strong>No.</strong> Both the <strong>1+1 KG offer</strong> and the <strong>steel container offer</strong> can be claimed <strong>only once per address</strong>.</p>
      )
    },
    {
      id: 8,
      question: "Where can I watch the free movie?",
      answer: (
        <div>
          <p>You're welcome to enjoy the movie at <strong>PVR Screens</strong> in:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Kukatpally</li>
            <li>Ashoka One Mall</li>
            <li>GSM Mall Madinaguda</li>
          </ul>
          <p className="mt-2">We'll arrange the best available show timing. If seats are not available, a <strong>full refund</strong> will be processed.</p>
          <p className="mt-2"><strong>తెలుగు:</strong> మీకు మా పీవీఆర్ స్క్రీన్లలో సినిమా చూడడానికి స్వాగతం! కూకట్‌పల్లి, అశోక వన్ మాల్, లేదా జీఎస్ఎం మాల్ మదీనాగూడలో స్క్రీన్లు అందుబాటులో ఉన్నాయి. మీకు సరిపడే షెడ్యూల్ ఏర్పాటు చేస్తాము. సీట్లు అందుబాటులో లేకపోతే, పూర్తి మొత్తాన్ని తిరిగి చెల్లిస్తాము.</p>
        </div>
      )
    },
    {
      id: 9,
      question: "Who is eligible for the free PVR movie ticket?",
      answer: (
        <div>
          <p>This offer is valid <strong>only for the first 100 users</strong> who buy <strong>OxyRice 5 KG packs</strong>. We will <strong>publish the names</strong> of these 100 users to ensure <strong>100% transparency</strong>.</p>
          <p className="mt-2"><strong>English:</strong> Offer valid only for the first 100 users. We will publish their names to ensure 100% transparency.</p>
          <p className="mt-2"><strong>తెలుగు:</strong> ఈ ఆఫర్ మొదటి 100 మందికే వర్తిస్తుంది. పూర్తి పారదర్శకత కోసం వారి పేర్లు ప్రచురిస్తాము.</p>
        </div>
      )
    },
    {
      id: 10,
      question: "How do I select my movie and showtime?",
      answer: (
        <div>
          <p>You can select your preferred date between <strong>May 1st and May 4th</strong>.</p>
          <p className="mt-2">Choose your preferred theatre and show timings (subject to availability) from:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>PVR Kukatpally</li>
            <li>Ashoka One Mall</li>
            <li>GSM Mall Madinaguda</li>
          </ul>
          <p className="mt-2">We'll block your seat and send a <strong>confirmation update</strong>. If the selected show is fully booked, we'll find the next best available option or issue a <strong>full refund</strong>.</p>
        </div>
      )
    }
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