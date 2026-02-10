import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/img/askoxylogoblack.png";
import "./FreelancerList.css";
import Footer from "./Footer";
interface Freelancer {
  id: string;
  email: string;
  userId: string;
  perHour: number;
  perDay: number;
  perWeek: number;
  perMonth: number;
  perYear: number;
  openForFreeLancing: string;
  amountNegotiable: string;
  resumeUrl: string;
}

const FreelancerList: React.FC = () => {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    fetch("https://meta.oxyloans.com/api/ai-service/agent/getAllFreeLancers", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFreelancers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setFreelancers([]);
        setLoading(false);
      });
  }, []);

  const handleJoinNow = () => {
    window.location.href = "/main/freelanceform";
  };

  return (
    <>
      <div className="freelancer-page">
        <header className="freelancer-header">
          <div className="header-logo" onClick={() => navigate("/")}>
            <img src={Logo} alt="ASK OXY AI" />
          </div>
          <button className="join-btn" onClick={handleJoinNow}>
            Join Now
          </button>
        </header>

        <div className="freelancer-container">
          <h1>Find Top Freelancers</h1>
          <p className="freelancer-subtitle">Connect with skilled professionals ready to bring your projects to life</p>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="freelancer-grid">
              {freelancers.map((freelancer) => (
                <div key={freelancer.id} className="freelancer-card">
                  <div className="card-header">
                    <div className="freelancer-info">
                      <div className="freelancer-name">Freelancer</div>
                      <div className="freelancer-email">{freelancer.email}</div>
                    </div>
                    <span className={`badge ${freelancer.openForFreeLancing === "YES" ? "available" : ""}`}>
                      {freelancer.openForFreeLancing === "YES" ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <div className="pricing-section">
                    <div className="pricing-title">Pricing Options</div>
                    <div className="pricing">
                      <div className="price-item">
                        <span>Hourly</span>
                        <strong>₹{freelancer.perHour}</strong>
                      </div>
                      <div className="price-item">
                        <span>Daily</span>
                        <strong>₹{freelancer.perDay}</strong>
                      </div>
                      <div className="price-item">
                        <span>Weekly</span>
                        <strong>₹{freelancer.perWeek}</strong>
                      </div>
                      <div className="price-item">
                        <span>Monthly</span>
                        <strong>₹{freelancer.perMonth}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <span className="negotiable">
                      {freelancer.amountNegotiable === "YES" ? "💬 Negotiable" : "Fixed Rate"}
                    </span>
                    <button className="view-resume-btn" onClick={() => setSelectedResume(freelancer.resumeUrl)}>
                      View Resume
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedResume && (
          <div className="modal-overlay" onClick={() => setSelectedResume(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedResume(null)}>
                ✕
              </button>
              <iframe src={selectedResume} title="Resume" />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default FreelancerList;
