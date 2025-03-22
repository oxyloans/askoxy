import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import {
  Share2,
  Copy,
  Link as LinkIcon,
  X,
  Gift,
  Users,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import PhoneInput, {
  isValidPhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";
import Footer from "../components/Footer";
import axios from "axios";
import "react-phone-number-input/style.css";
import { Modal } from "antd";
import { Navigate } from "react-router-dom";

interface RefereeDetail {
  id: string;
  whatsappnumber: string;
  firstName: string | null;
  lastName: string | null;
  referenceStatus: string;
  referee: string;
  referrer: string;
  created_at: number[];
}

interface Stats {
  totalReferrals: number;
  activeReferrals: number;
  conversionRate: number;
}

interface UserDetail {
  whatsappNumber: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  id: string;
}

interface FAQItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

const ReferralPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shareAction, setShareAction] = useState<"whatsapp" | "copy" | null>(
    null
  );
  const [refereeDetails, setRefereeDetails] = useState<RefereeDetail[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const [error, setError] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [userDetails, setUserDetails] = useState<UserDetail | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalReferrals: 0,
    activeReferrals: 0,
    conversionRate: 0,
  });
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      question: "How do I refer someone?",
      answer:
        "Share your unique referral link with your friends. Your friend must sign up using your referral link during registration. Once they place an order for rice and do not cancel it, you'll receive the reward.",
      isOpen: false,
    },
    {
      question: "What rewards do I get for referring a friend?",
      answer:
        "Apart from getting a free steel container, you will also receive ₹50 cashback in your ASKOXY.AI wallet when you successfully refer someone.",
      isOpen: false,
    },
    {
      question: "When will I receive my referral reward?",
      answer:
        "Referral rewards are credited once your referred friend successfully places an order and does not cancel it.",
      isOpen: false,
    },
    {
      question: "Where can I check my referral status?",
      answer: "You can track your referrals in your ASKOXY.AI dashboard.",
      isOpen: false,
    },
    {
      question: "Is there a limit to the number of people I can refer?",
      answer:
        "No, you can refer as many friends as you like. You will receive ₹50 cashback for each successful referral, subject to promotional terms.",
      isOpen: false,
    },
    {
      question: "What happens if my friend forgets to use my referral link?",
      answer:
        "Referrals must use your link at the time of sign-up. If they forget, the referral may not be counted, and you will not receive the reward.",
      isOpen: false,
    },
    {
      question: "Can I refer myself using another account?",
      answer:
        "No, self-referrals are not allowed. Fraudulent activity may lead to disqualification from the referral program.",
      isOpen: false,
    },
    {
      question: "Who do I contact if I have issues with my referral reward?",
      answer:
        "If you have any issues with your referral reward, please contact ASKOXY.AI support at: 📞 Phone: +91 81432 71103 📧 Email: SUPPORT@ASKOXY.AI",
      isOpen: false,
    },
  ]);
  const customerId = localStorage.getItem("userId") || "";
  const token = localStorage.getItem("accessToken") || "";
  const referralLink = `https://www.askoxy.ai/whatsappregister?ref=${customerId}`;

  useEffect(() => {
    if (token) {
      fetchRefereeDetails();
      fetchUserDetails();
    }
  }, [token]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        `https://meta.oxyglobal.tech/api/user-service/user/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setUserDetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const formatDate = (dateArray: number[]): string => {
    if (Array.isArray(dateArray) && dateArray.length >= 3) {
      const [year, month, day] = dateArray;
      return new Date(year, month - 1, day).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return "N/A";
  };

  const fetchRefereeDetails = async () => {
    try {
      const response = await axios.get<RefereeDetail[]>(
        `https://meta.oxyglobal.tech/api/reference-service/getreferencedetails/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setRefereeDetails(response.data);

      const total = response.data.length;
      const active = response.data.filter(
        (d) => d.referenceStatus === "REGISTERED"
      ).length;
      setStats({
        totalReferrals: total,
        activeReferrals: active,
        conversionRate: total > 0 ? (active / total) * 100 : 0,
      });
    } catch (error) {
      console.error("Error fetching referee details:", error);
    }
  };

  const handleShare = (action: "whatsapp" | "copy") => {
    setShareAction(action);

    if (action === "whatsapp") {
      setPhoneNumber(undefined);
      setError("");
      setIsModalOpen(true);
    } else if (action === "copy") {
      // Directly copy the referral link
      handleCopyLink();
    }
  };

  // Function to normalize phone numbers for comparison
  const normalizePhoneNumber = (number: string): string => {
    // Remove all non-digit characters
    return number.replace(/\D/g, "");
  };

  useEffect(() => {
    if (phoneNumber) {
      // Extract country code without the + sign
      const phoneNumberS = parsePhoneNumber(phoneNumber);
      const countryCode = phoneNumberS?.countryCallingCode
        ? `+${phoneNumberS.countryCallingCode}`
        : "";
      setCountryCode(countryCode || "");
    }
  }, [phoneNumber]);

  const handleSubmit = async () => {
    // Reset error state
    setError("");

    // Validate phone number format
    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      setError("Please enter a valid phone number");
      return;
    }

    // Check for self-referral
    if (localStorage.getItem("whatsappNumber") === phoneNumber) {
      setError(
        "Self-referral is not allowed. Enter a different referral number."
      );
      return;
    }

    // Check if number has already been referred
    const normalizedInput = normalizePhoneNumber(phoneNumber);
    const alreadyReferred = refereeDetails.some((detail) => {
      const normalizedRefNumber = normalizePhoneNumber(detail.whatsappnumber);
      const refSuffix = normalizedRefNumber.slice(
        -Math.min(10, normalizedRefNumber.length)
      );
      const inputSuffix = normalizedInput.slice(
        -Math.min(10, normalizedInput.length)
      );
      return refSuffix === inputSuffix;
    });

    if (alreadyReferred) {
      setError(
        "This number has already been referred. Please enter a different number."
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://meta.oxyglobal.tech/api/user-service/inviteaUser",
        {
          referealId: customerId,
          refereeMobileNumber: phoneNumber.replace(countryCode, ""), // Remove country code
          countryCode: countryCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setIsModalOpen(false);
      fetchRefereeDetails();

      Modal.success({
        content: response.data.message || "Referral sent successfully!",
        onOk: () => {},
      });
    } catch (error: any) {
      // Type error as 'any' to handle axios error
      console.error("Error inviting user:", error);

      // Handle different error scenarios
      let errorMessage = "Failed to invite user. Please try again.";

      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 409) {
          errorMessage = "An invitation has already been sent to this user.";
        } else if (error.response.status === 400) {
          // Check if it's a self-referral error from backend
          if (
            error.response.data &&
            error.response.data.error &&
            error.response.data.error.includes("self")
          ) {
            errorMessage =
              "Self-referral is not allowed. Enter a different referral number.";
          }
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFaq = (index: number) => {
    setFaqs(
      faqs.map((faq, i) => {
        if (i === index) {
          return { ...faq, isOpen: !faq.isOpen };
        }
        return faq;
      })
    );
  };

  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    bgColor: string;
    iconColor: string;
  }> = ({ icon, title, value, bgColor, iconColor }) => (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center gap-4">
        <div className={`p-3 ${bgColor} rounded-lg`}>
          <div className={`h-6 w-6 ${iconColor}`}>{icon}</div>
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );

  // Function to handle WhatsApp sharing without specific contact
  const handleWhatsAppShare = () => {
    const message = `ASKOXY.AI is an AI-powered platform integrating 34+ marketplaces, designed to
simplify lives with innovative solutions, including premium rice delivery. - ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  // Function to copy referral link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setLinkCopied(true);

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setLinkCopied(false);
    }, 2000);

    Modal.success({
      content: "Referral link copied to clipboard!",
      onOk: () => {},
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section - Mobile Optimized */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl shadow-sm p-6 mb-8 text-white">
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Refer Friends & Earn Rewards
              </h1>
              <p className="text-purple-100">
                Get ₹50 cashback for every friend who joins and orders
              </p>
            </div>

            <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="text-center text-sm font-medium mb-2 text-purple-100">
                Your Referral Link
              </p>
              <div className="flex items-center p-3 bg-white/20 rounded-lg mb-4">
                <div className="flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap text-sm">
                  {referralLink}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="ml-2 p-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors focus:outline-none"
                  aria-label="Copy referral link"
                >
                  {linkCopied ? (
                    <span className="text-green-300 text-sm font-medium">
                      Copied!
                    </span>
                  ) : (
                    <Copy className="h-5 w-5 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Stats Section - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            <StatCard
              icon={<Users />}
              title="Total Referrals"
              value={stats.totalReferrals}
              bgColor="bg-purple-100"
              iconColor="text-purple-600"
            />
            <StatCard
              icon={<Gift />}
              title="Active Referrals"
              value={stats.activeReferrals}
              bgColor="bg-green-100"
              iconColor="text-green-600"
            />
          </div>

          {/* Main Content - Responsive Layout */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-purple-600">
              Share & Earn
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Invite a Friend</h3>
                <p className="text-white-600 shadow-sm mb-4">
                  Invite your friends to join ASKOXY.AI. When they register
                  using your referral link and place an order for rice, you'll
                  receive ₹50 cashback!
                </p>

                <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-3 mb-4">
                  <button
                    onClick={() => handleShare("whatsapp")}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Users className="mr-2 h-5 w-5" /> Invite a Friend
                  </button>

                  <button
                    onClick={() => handleWhatsAppShare()}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <FaWhatsapp className="mr-2 text-xl" /> Share via WhatsApp
                  </button>
                </div>
              </div>

              {/* Mobile-friendly reward section */}
              <div className="md:hidden bg-purple-50 rounded-xl p-6 mb-6">
                <div className="text-center">
                  <Gift className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-purple-600 mb-2">
                    Earn ₹50 Cashback
                  </h3>
                  <p className="text-gray-600 text-sm">
                    For every successful referral who places an order for rice
                  </p>
                </div>
              </div>

              {/* Desktop reward section */}
              <div className="hidden md:block">
                <div className="h-full flex items-center justify-center bg-purple-50 rounded-xl p-6">
                  <div className="text-center">
                    <Gift className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-purple-600 mb-2">
                      Earn ₹50 Cashback
                    </h3>
                    <p className="text-gray-600">
                      For every successful referral who places an order for rice
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Referee Details Table - Responsive */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Your Referee Details</h3>
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600"
                        >
                          WhatsApp Number
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600 hidden sm:table-cell"
                        >
                          Referred Date
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {refereeDetails.map((referee) => (
                        <tr key={referee.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                            {referee.whatsappnumber}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600 hidden sm:table-cell">
                            {formatDate(referee.created_at)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                referee.referenceStatus === "REGISTERED"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {referee.referenceStatus}
                            </span>
                            {!referee.referenceStatus && (
                              <span className="sm:hidden text-xs text-gray-500 block mt-1">
                                {formatDate(referee.created_at)}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {refereeDetails.length === 0 && (
                        <tr>
                          <td colSpan={3} className="text-center py-8">
                            <div className="p-4">
                              <Users className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                              <p className="text-gray-500 font-medium">
                                No referee details found.
                              </p>
                              <p className="text-sm text-gray-400 mt-1">
                                Start sharing your referral link to invite
                                friends!
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section - Mobile Optimized */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex justify-between items-center w-full text-left p-4 focus:outline-none bg-gray-50"
                  >
                    <span className="font-medium text-gray-800 text-sm md:text-base">
                      {faq.question}
                    </span>
                    {faq.isOpen ? (
                      <ChevronUp className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    )}
                  </button>
                  {faq.isOpen && (
                    <div className="p-4 text-gray-600 text-sm border-t">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Mobile Optimized */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-6 sm:p-0">
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setIsModalOpen(false)}
            />

            <div className="relative bg-white rounded-xl w-full max-w-md mx-auto p-5 sm:p-6 shadow-2xl transform transition-all">
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="text-center mb-5">
                <Users className="h-10 w-10 text-purple-600 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Invite a Friend
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Please enter your friend's phone number to send them a
                  referral invitation.
                </p>
              </div>

              <div className="mb-6">
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry="IN"
                  value={phoneNumber}
                  onChange={(value) => {
                    setPhoneNumber(value);
                    setError(""); // Clear error when user types
                  }}
                  className="w-full p-3 bg-white/30 backdrop-blur-md shadow-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-800 placeholder-transparent [&>*]:outline-none [&.PhoneInputInput]:outline-none [&.PhoneInputInput]:border-none"
                />
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
                <button
                  onClick={handleSubmit}
                  className="w-full sm:flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Send Invitation"}
                </button>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium mt-2 sm:mt-0"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ReferralPage;
