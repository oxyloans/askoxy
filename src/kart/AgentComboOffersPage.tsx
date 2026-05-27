import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Gift, ShoppingBag, Sparkles } from "lucide-react";
import { message } from "antd";
import {
  addComboToCart,
  getActiveCombos,
  resolveProductImageUrl,
} from "../ChatScreen/agentApi";
import type {
  AgentComboCard,
  AgentComboComponent,
} from "../ChatScreen/agentApi";
import "./AgentComboOffersPage.css";

const CARD_VARIANTS = ["", "--sun", "--mint", "--berry"] as const;

const SEGMENT_LABELS: Record<string, string> = {
  FREQUENT_BUYER: "Frequent buyer",
  CHURNED: "Win-back",
  REGISTERED_NO_ORDER: "New member",
  CART_ABANDONED: "Cart reminder",
};

const formatPrice = (n?: number) =>
  n != null && !Number.isNaN(n)
    ? `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
    : "—";

type OfferCardProps = {
  offer: AgentComboCard;
  variant: string;
  addingId: string | null;
  onAdd: (id: string) => void;
};

const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  variant,
  addingId,
  onAdd,
}) => {
  const id = offer.comboOfferId || "";
  const savingsPct =
    offer.mrpTotal > 0 && offer.savings != null
      ? Math.round((offer.savings / offer.mrpTotal) * 100)
      : null;
  const productCount = offer.components?.length || 0;
  const segmentLabel = offer.campaignSegment
    ? SEGMENT_LABELS[offer.campaignSegment] || offer.campaignSegment
    : null;

  return (
    <article className={`agent-offer-card agent-offer-card${variant}`}>
      <div className="agent-offer-card-header">
        <div className="agent-offer-card-title-wrap">
          <h2>{offer.title || offer.comboCode || "Combo offer"}</h2>
          <div className="agent-offer-meta-row">
            {segmentLabel && (
              <div className="agent-offer-segment-tag">{segmentLabel}</div>
            )}
            {productCount > 0 && (
              <div className="agent-offer-count-tag">{productCount} items</div>
            )}
          </div>
        </div>
        <span className="agent-offer-badge">
          {savingsPct != null ? `SAVE ${savingsPct}%` : "HOT DEAL"}
        </span>
      </div>
      {offer.description && (
        <p className="agent-offer-desc">{offer.description}</p>
      )}
      <div className="agent-offer-products">
        {(offer.components || []).map((comp: AgentComboComponent) => {
          const img = resolveProductImageUrl(comp.imageUrl);
          const compKey = comp.itemId ? String(comp.itemId) : comp.itemName;
          return (
            <div key={`${id}-${compKey}`} className="agent-offer-product">
              <div className="agent-offer-product-img">
                {img ? (
                  <img
                    src={img}
                    alt={comp.itemName || "Product"}
                    loading="lazy"
                  />
                ) : (
                  <ShoppingBag size={30} color="#fde047" strokeWidth={2} />
                )}
              </div>
              <div className="agent-offer-product-name">
                {comp.itemName || "Product"}
              </div>
              <div className="agent-offer-qty">Qty {comp.quantity ?? 1}</div>
            </div>
          );
        })}
      </div>
      <footer className="agent-offer-footer">
        <div className="agent-offer-pricing">
          <div className="mrp">{formatPrice(offer.mrpTotal)}</div>
          <div className="bundle">{formatPrice(offer.bundlePrice)}</div>
          {offer.savings != null && offer.savings > 0 && (
            <div className="save">You save {formatPrice(offer.savings)}</div>
          )}
        </div>
        <button
          type="button"
          className="agent-offer-cta row"
          disabled={!id || addingId === id}
          onClick={() => onAdd(id)}
        >
          <ShoppingBag size={17} className="cta-icon" />
          {addingId === id ? "Adding…" : "Grab this combo"}
        </button>
      </footer>
    </article>
  );
};

const AgentComboOffersPage: React.FC = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [offers, setOffers] = useState<AgentComboCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const offerStats = useMemo(() => {
    const totalSavings = offers.reduce(
      (sum, offer) => sum + (Number(offer.savings) || 0),
      0,
    );
    const bestDiscount = offers.reduce((max, offer) => {
      if (!offer.mrpTotal || !offer.savings) return max;
      const pct = Math.round((offer.savings / offer.mrpTotal) * 100);
      return pct > max ? pct : max;
    }, 0);
    return {
      count: offers.length,
      totalSavings,
      bestDiscount,
    };
  }, [offers]);

  const loadOffers = useCallback(async () => {
    if (!userId) {
      setOffers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getActiveCombos(userId);
      setOffers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      message.error("Could not load your offers. Please try again.");
      setOffers([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  const handleAddToCart = async (comboOfferId: string) => {
    if (!comboOfferId) return;
    if (!userId) {
      message.warning("Please log in to add offers to cart");
      navigate("/userlogin");
      return;
    }
    setAddingId(comboOfferId);
    try {
      await addComboToCart(comboOfferId, userId);
      message.success("Combo added to cart!");
      navigate("/main/mycart");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to add combo to cart";
      message.error(msg);
    } finally {
      setAddingId(null);
    }
  };

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/main/dashboard/products");
    }
  };

  if (!userId) {
    return (
      <div className="agent-offers-page">
        <div className="agent-offers-inner">
          <button
            type="button"
            className="agent-offers-back"
            onClick={() => navigate("/userlogin")}
          >
            <ArrowLeft size={16} /> Log in
          </button>
          <div className="agent-offers-empty">
            <Gift className="gift-icon" />
            <h2>Sign in to see your offers</h2>
            <p>Exclusive combo deals are waiting for you after login.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="agent-offers-page">
      <div className="agent-offers-inner">
        <div className="agent-offers-topbar">
          <button type="button" className="agent-offers-back" onClick={goBack}>
            <ArrowLeft size={16} /> Back to shopping
          </button>
          <div className="agent-offers-chip">
            <Sparkles size={14} />
            Curated for you
          </div>
        </div>

        <header className="agent-offers-header">
          <div className="agent-offers-headline">
            <Gift size={34} strokeWidth={2} className="header-gift-icon" />
            <div>
              <h1>Exclusive combo offers</h1>
              <p>
                Handpicked bundles with better prices than individual products.
              </p>
            </div>
          </div>
          <div className="agent-offers-stats">
            <div className="agent-stat-card">
              <span>Live offers</span>
              <strong>{offerStats.count}</strong>
            </div>
            <div className="agent-stat-card">
              <span>Total savings</span>
              <strong>{formatPrice(offerStats.totalSavings)}</strong>
            </div>
            <div className="agent-stat-card">
              <span>Best discount</span>
              <strong>
                {offerStats.bestDiscount > 0 ? `${offerStats.bestDiscount}%` : "—"}
              </strong>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="agent-offers-loading">
            <div className="agent-offers-spinner" />
            <p>Loading your offers…</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="agent-offers-empty">
            <Gift className="gift-icon" />
            <h2>No offers right now</h2>
            <p>Check back soon for new bundles curated for you.</p>
          </div>
        ) : (
          <div className="agent-offers-grid">
            {offers.map((offer, index) => (
              <OfferCard
                key={offer.comboOfferId || index}
                offer={offer}
                variant={CARD_VARIANTS[index % CARD_VARIANTS.length]}
                addingId={addingId}
                onAdd={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentComboOffersPage;
