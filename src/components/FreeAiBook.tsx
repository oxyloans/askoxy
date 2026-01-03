import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import aiImage from "../assets/img/book.png";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Config";
import { message, Modal } from "antd";

import axios from "axios";

const FreeAiBook: React.FC = () => {
  const navigate = useNavigate();
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [marketingLoading, setMarketingLoading] = useState(false);

  const userId = localStorage.getItem("userId");
  const mobileNumber = localStorage.getItem("mobileNumber");
  const whatsappNumber = localStorage.getItem("whatsappNumber");
  const LOGIN_URL = "/whatsappregister";

  const jobPlanImageUrl = "https://i.ibb.co/twj7WCX3/90-dayl.png";

  useEffect(() => {
    const sendMarketingRequest = async () => {
      if (!userId) return;

      try {
        setMarketingLoading(true);
        const response = await axios.post(
          `${BASE_URL}/marketing-service/campgin/askOxyOfferes`,
          {
            askOxyOfers: "FREEAIBOOK",
            mobileNumber: mobileNumber || whatsappNumber,
            userId,
            projectType: "ASKOXY",
          }
        );

        if (response.status === 200) {
          message.success("Welcome to Free AI Book");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setMarketingLoading(false);
      }
    };

    sendMarketingRequest();
  }, [userId, mobileNumber, whatsappNumber]);

  const handleViewMore = () => {
    setShowOfferModal(true);
  };

  const handleJobPlanViewMore = () => {
    navigate("/90dayjobplan");
  };

  return (
    <section className="flex flex-col items-center bg-purple-50 py-10 px-4 sm:px-6 md:px-12">
      {/* ===== Free AI Book Heading ===== */}
      <div className="text-center mb-6">
        <h3 className="text-3xl md:text-4xl font-extrabold text-purple-900">
          Free AI Book
        </h3>
        <div className="w-24 h-1.5 mt-4 mx-auto rounded-full bg-gradient-to-r from-purple-300 via-indigo-300 to-pink-300" />
      </div>

      {/* ===== Free AI Book Card (Image LEFT) ===== */}
      <motion.div
        className="flex flex-col md:flex-row bg-white border shadow-md w-full max-w-7xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="md:w-1/2 p-6 flex justify-center">
          <img
            src={aiImage}
            alt="AI Book"
            className="object-contain shadow-lg"
          />
        </div>

        <div className="md:w-1/2 p-6 flex flex-col justify-center">
          <p className="text-gray-700 mb-4 text-justify">
            Step into the AI Universe: Discover, learn, and create with today’s
            most powerful AI tools. From your very first prompt to shaping
            global impact, explore how AI is transforming industries, generating
            text, images, music, and code, and powering innovations like ChatGPT
            and MidJourney.
          </p>
          <p className="text-gray-700 mb-6 text-justify">
            Our Mission: To empower one million learners with AI skills and
            unlock career opportunities of the future. Join the revolution,
            master AI, and be part of the next wave of technological innovation.
          </p>

          <motion.button
            onClick={handleViewMore}
            className="self-start px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-400 to-purple-500 text-white font-semibold hover:from-indigo-500 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            View More
          </motion.button>
        </div>
      </motion.div>

      {/* ===== 90 Days Job Plan Heading ===== */}
      <div className="text-center mt-12 mb-6">
        <h3 className="text-3xl md:text-4xl font-extrabold text-purple-900">
          90 Days Job Plan
        </h3>
        <div className="w-24 h-1.5 mt-4 mx-auto rounded-full bg-gradient-to-r from-purple-300 via-indigo-300 to-pink-300" />
      </div>

      {/* ===== 90 Days Job Plan Card (Image RIGHT on Desktop) ===== */}
      <motion.div
        className="flex flex-col md:flex-row-reverse bg-white border shadow-md w-full max-w-7xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Image RIGHT */}
        <div className="md:w-1/2 p-6 flex justify-center">
          <img
            src={jobPlanImageUrl}
            alt="90 Days Job Plan"
            className="object-contain shadow-lg"
            loading="lazy"
          />
        </div>

        {/* Content LEFT */}
        <div className="md:w-1/2 p-6 flex flex-col justify-center">
          <p className="text-gray-800 mb-3 text-lg font-semibold">
            Become job-ready in 90 days — one use case per day, one step at a
            time.
          </p>

          <p className="text-gray-700 mb-4 text-justify">
            The 90-Day Job Plan is a structured, discipline-driven job readiness
            program designed to transform learners into confident, job-ready
            professionals in just 90 days.
          </p>

          <p className="text-gray-700 mb-4 text-justify">
            Unlike traditional courses that focus on theory or certificates,
            this program is built on daily execution, real-world use cases, and
            practical proof of skill.
          </p>

          <motion.button
            onClick={handleJobPlanViewMore}
            className="self-start px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-400 to-purple-500 text-white font-semibold"
          >
            View More
          </motion.button>
        </div>
      </motion.div>

      <Modal
        open={showOfferModal}
        onCancel={() => setShowOfferModal(false)}
        footer={null}
        centered
        destroyOnClose
        title="Offer Information"
        width={520}
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <div
          style={{
            padding: "16px",
          }}
        >
          <div
            style={{
              borderRadius: 12,
              border: "1px solid #f0f0f0",
              overflow: "hidden",
              background: "#fff",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 16px 12px",
                borderBottom: "1px solid #f0f0f0",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
                Offer Ended
              </div>
              <div style={{ marginTop: 6, fontSize: 13, color: "#6b7280" }}>
                The offer ended on <b>31st December 2025</b>.
              </div>
            </div>

            {/* Content */}
            <div
              style={{
                padding: "14px 16px 16px",
                display: "grid",
                gap: 12,
              }}
            >
              {/* Info card */}
              <div
                style={{
                  borderRadius: 10,
                  background: "#fafafa",
                  border: "1px solid #f0f0f0",
                  padding: 12,
                }}
              >
                <div
                  style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}
                >
                  The book will be available again soon in our store.
                </div>
              </div>

              {/* Bid card */}
              <div
                style={{
                  borderRadius: 10,
                  border: "1px solid #f0f0f0",
                  padding: 14,
                }}
              >
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: 6,
                    textAlign: "center",
                  }}
                >
                  Special Appreciation Bid
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    textAlign: "center",
                    lineHeight: 1.5,
                    marginBottom: 12,
                  }}
                >
                  To appreciate our first copy buyer, we are hosting a special
                  bid.
                </div>

                {/* Highlight */}
                <div
                  style={{
                    borderRadius: 10,
                    background: "#FFFBEB",
                    border: "1px solid #FDE68A",
                    padding: 12,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}
                  >
                    The highest bidder wins the first copy
                  </div>
                  <div style={{ marginTop: 4, fontSize: 13, color: "#374151" }}>
                    and an exclusive chit-chat session with our CEO.
                  </div>
                </div>

                {/* Note */}
                <div
                  style={{
                    marginTop: 12,
                    borderRadius: 10,
                    background: "#F9FAFB",
                    border: "1px solid #f0f0f0",
                    padding: 10,
                    textAlign: "center",
                    fontSize: 13,
                    color: "#374151",
                    fontWeight: 600,
                  }}
                >
                  Stay tuned for updates!
                </div>
              </div>
            </div>
          </div>

          {/* Responsive width helper */}
          <style>
            {`
        /* Make modal fit nicely on small screens */
        .ant-modal {
          max-width: calc(100vw - 24px) !important;
        }
        .ant-modal-content {
          border-radius: 14px !important;
          overflow: hidden;
        }
      `}
          </style>
        </div>
      </Modal>
    </section>
  );
};

export default FreeAiBook;
