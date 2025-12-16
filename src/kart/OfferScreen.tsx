import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OfferScreen.css';

interface Offer {
  itemId: string;
  itemName: string;
  weight: number;
  imageUrl: string;
  itemDescription: string;
}

const OfferScreen: React.FC = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch('https://meta.oxyloans.com/api/product-service/getComboActiveInfo');
      const data = await response.json();
      setOffers(data);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractSavings = (itemName: string) => {
    const saveMatch = itemName.match(/save ₹(\d+)/i);
    const offMatch = itemName.match(/₹(\d+) off/i);
    return saveMatch ? `Save ₹${saveMatch[1]}` : offMatch ? `Save ₹${offMatch[1]}` : 'OFFER';
  };

  const getOfferType = (itemName: string) => {
  const saveMatch = itemName.match(/save ₹(\d+)/i);
  const offMatch = itemName.match(/₹(\d+) off/i);

  const amount = saveMatch?.[1] || offMatch?.[1];
  console.log("amount.....  ",amount);
  
  if (amount === '110' || amount === '120') {
    return {
      type: 'SAVE_AMOUNT',
      amount: Number(amount),
    };
  }

  if (amount) {
    return {
      type: 'PRODUCT_OFFER',
      amount: Number(amount),
    };
  }

  return {
    type: 'DEFAULT',
    amount: 0,
  };
};


  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading offers...</p>
      </div>
    );
  }

 const handleItemClick = (item: Offer) => {
  const offerInfo = getOfferType(item.itemName);

  // Case 1: Save ₹110 / ₹120 → Navigate to combo/offer landing screen
  if (offerInfo.type === 'SAVE_AMOUNT') {
    navigate('/main/dashboard/products?type=RICE', {
      state: {
        saveAmount: offerInfo.amount,
        itemId: item.itemId,
        itemName: item.itemName,
      },
    });
    return;
  }

  // Case 2: Product-level offer → Navigate to item details screen
  if (offerInfo.type === 'PRODUCT_OFFER') {
    navigate(`/main/dashboard/products?type=RICE`, {
      state: {
        itemId: item.itemId,
        offerAmount: offerInfo.amount,
      },
    });
    return;
  }

  // Fallback (optional)
  navigate(`/main/itemsdisplay/${item.itemId}`);
};


  return (
    <div className="offer-screen">
      <div className="animated-bg">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
        <div className="floating-shape shape-5"></div>
        
        <div className="floating-rupee rupee-1">₹</div>
        <div className="floating-rupee rupee-2">₹</div>
        <div className="floating-rupee rupee-3">₹</div>
        <div className="floating-rupee rupee-4">₹</div>
        <div className="floating-rupee rupee-5">₹</div>
        <div className="floating-rupee rupee-6">₹</div>
        <div className="floating-rupee rupee-7">₹</div>
        <div className="floating-rupee rupee-8">₹</div>
        <div className="floating-rupee rupee-9">₹</div>
        <div className="floating-rupee rupee-10">₹</div>
        
        <div className="floating-tag tag-1">SAVE</div>
        <div className="floating-tag tag-2">OFFER</div>
        <div className="floating-tag tag-3">DEAL</div>
        <div className="floating-tag tag-4">50% OFF</div>
        <div className="floating-tag tag-5">HOT</div>
        <div className="floating-tag tag-6">NEW</div>
        <div className="floating-tag tag-7">SALE</div>
        <div className="floating-tag tag-8">30% OFF</div>
        <div className="floating-tag tag-9">LIMITED</div>
        <div className="floating-tag tag-10">COMBO</div>
      </div>
      
      <header className="header">
        <h1>🔥 Special Offers</h1>
        <p>Exclusive combo deals just for you</p>
      </header>

      <div className="offers-container">
        {offers.map((offer, index) => (
          <div 
            key={offer.itemId} 
            className="offer-card"
            style={{ animationDelay: `${index * 0.1}s` }}
            // onClick={() => setSelectedOffer(offer)}
            onClick={() => handleItemClick(offer)}
          >
            <div className="card-header">
              <div className="discount-badge">{extractSavings(offer.itemName)}</div>
              <div className="weight-badge">{offer.weight}kg</div>
            </div>
            
            <div className="image-section">
              <img 
                src={offer.imageUrl} 
                alt={offer.itemName}
                className="offer-image"
              />
            </div>

            <div className="card-content">
              <h3 className="title">{offer.itemName.length > 60 ? offer.itemName.substring(0, 60) + '...' : offer.itemName}</h3>
              <p className="description">{offer.itemDescription.substring(0, 80)}...</p>
              
              <button className="cta-button">
                <span>Get Offer</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedOffer && (
        <div className="modal-overlay" onClick={() => setSelectedOffer(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setSelectedOffer(null)}>×</button>
            <img src={selectedOffer.imageUrl} alt={selectedOffer.itemName} className="modal-image" />
            <div className="modal-body">
              <h2>{selectedOffer.itemName}</h2>
              <p>{selectedOffer.itemDescription}</p>
              <div className="modal-actions">
                <button className="secondary-btn">Add to Cart</button>
                <button className="primary-btn">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferScreen;