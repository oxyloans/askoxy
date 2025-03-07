import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { 
  Share2, 
  Copy, 
  Link as LinkIcon, 
  X,
  Gift,
  Users,
  TrendingUp,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import PhoneInput, { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import Footer from '../components/Footer';
import axios from 'axios';
import 'react-phone-number-input/style.css';
import { Modal } from 'antd';
import { Navigate } from 'react-router-dom';

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
  const [shareAction, setShareAction] = useState<'whatsapp' | 'copy' | null>(null);
  const [refereeDetails, setRefereeDetails] = useState<RefereeDetail[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const [error, setError] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [userDetails, setUserDetails] = useState<UserDetail | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalReferrals: 0,
    activeReferrals: 0,
    conversionRate: 0
  });
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      question: "How does the referral program work?",
      answer: "Our referral program allows you to invite friends to join our platform. When your referral signs up using your unique link, places an order for rice, and does not cancel it, you (the referrer) will receive a ₹100 cashback reward.",
      isOpen: false
    },
    {
      question: "Who can I refer?",
      answer: "You can refer anyone who is not already a registered user on Askoxy.AI. To count as a referral, they must sign up using your referral link.",
      isOpen: false
    },
    {
      question: "How do I refer someone?",
      answer: "Share your unique referral link with your friends. Your friend must sign up using your referral link during registration. Once they place an order for rice and do not cancel it, you'll receive the reward.",
      isOpen: false
    },
    {
      question: "What rewards do I get for referring a friend?",
      answer: "The rewards vary based on ongoing promotions. Typically, you (the referrer) will receive ₹100 cashback once your referral (the referee) registers using your referral link, places an order for rice, and does not cancel the order.",
      isOpen: false
    },
    {
      question: "When will I receive my referral reward?",
      answer: "Referral rewards are credited once your referred friend successfully places an order for rice and does not cancel it.",
      isOpen: false
    },
    {
      question: "Where can I check my referral status?",
      answer: "You can track your referrals in your Askoxy.AI dashboard.",
      isOpen: false
    },
    {
      question: "Is there a limit to the number of people I can refer?",
      answer: "No, there is no limit to the number of people you can refer. You can refer as many friends as you like, and you will receive ₹100 cashback for each successful referral who meets the eligibility criteria. However, specific promotions may have restrictions, so please check the referral terms for details.",
      isOpen: false
    },
    {
      question: "What happens if my friend forgets to use my referral link?",
      answer: "Unfortunately, referrals must use your link at the time of sign-up. If they forget, the referral may not be counted, and you will not receive the reward.",
      isOpen: false
    },
    {
      question: "Can I refer myself using another account?",
      answer: "No, self-referrals are not allowed. Any fraudulent activity may result in disqualification from the referral program.",
      isOpen: false
    },
    {
      question: "Who do I contact if I have issues with my referral reward?",
      answer: "If you haven't received your reward or have any issues, please contact our support team at Askoxy.AI for assistance.",
      isOpen: false
    }
  ]);

  const customerId = localStorage.getItem("userId") || "";
  const token = localStorage.getItem("accessToken") || "";
  const referralLink = `https://www.sandbox.askoxy.ai/whatsappregister?ref=${customerId}`;

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
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        setUserDetails(response.data);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const formatDate = (dateArray: number[]): string => {
    if (Array.isArray(dateArray) && dateArray.length >= 3) {
      const [year, month, day] = dateArray;
      return new Date(year, month - 1, day).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    return 'N/A';
  };

  const fetchRefereeDetails = async () => {
    try {
      const response = await axios.get<RefereeDetail[]>(
        `https://meta.oxyglobal.tech/api/reference-service/getreferencedetails/${customerId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setRefereeDetails(response.data);
      
      const total = response.data.length;
      const active = response.data.filter(d => d.referenceStatus === "REGISTERED").length;
      setStats({
        totalReferrals: total,
        activeReferrals: active,
        conversionRate: total > 0 ? (active / total) * 100 : 0
      });
    } catch (error) {
      console.error('Error fetching referee details:', error);
    }
  };

  const handleShare = (action: 'whatsapp' | 'copy') => {
    setShareAction(action);
    setPhoneNumber(undefined);
    setError('');
    setIsModalOpen(true);
  };

  // Function to normalize phone numbers for comparison
  const normalizePhoneNumber = (number: string): string => {
    // Remove all non-digit characters
    return number.replace(/\D/g, '');
  };

  useEffect(() => {
    if (phoneNumber) {
      // Extract country code without the + sign
      const phoneNumberS = parsePhoneNumber(phoneNumber)
      console.log("phoneNumberS.country", phoneNumberS?.countryCallingCode);
      const countryCode = phoneNumberS?.countryCallingCode ? `+${phoneNumberS.countryCallingCode}` : "";
      setCountryCode(countryCode || ""); 
    }
  }, [phoneNumber]);

  const handleSubmit = async () => {
    // Reset error state
    setError('');
    
    // Validate phone number format
    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }

    // Check for self-referral
    if (localStorage.getItem("whatsappNumber") === phoneNumber) {
      setError('Self-referral is not allowed. Enter a different referral number.');
      return;
    }

    // Check if number has already been referred
    const normalizedInput = normalizePhoneNumber(phoneNumber);
    const alreadyReferred = refereeDetails.some(detail => {
      const normalizedRefNumber = normalizePhoneNumber(detail.whatsappnumber);
      const refSuffix = normalizedRefNumber.slice(-Math.min(10, normalizedRefNumber.length));
      const inputSuffix = normalizedInput.slice(-Math.min(10, normalizedInput.length));
      return refSuffix === inputSuffix;
    });

    if (alreadyReferred) {
      setError('This number has already been referred. Please enter a different number.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://meta.oxyglobal.tech/api/user-service/inviteaUser',
        {
          referealId: customerId,
          refereeMobileNumber: phoneNumber.replace(countryCode, ''), // Remove country code
          countryCode: countryCode
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setIsModalOpen(false);
      fetchRefereeDetails();
      Modal.success({
        content: response.data.message || 'Referral sent successfully!',
        onOk: () => {},
      });
    } catch (error: any) {
      console.error('Error inviting user:', error);
      
      // Handle different error scenarios
      let errorMessage = 'Failed to invite user. Please try again.';
      
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 409) {
          errorMessage = 'An invitation has already been sent to this user.';
        } else if (error.response.status === 400) {
          // Check if it's a self-referral error from backend
          if (error.response.data && error.response.data.error && 
              error.response.data.error.includes('self')) {
            errorMessage = 'Self-referral is not allowed. Enter a different referral number.';
          }
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFaq = (index: number) => {
    setFaqs(faqs.map((faq, i) => {
      if (i === index) {
        return { ...faq, isOpen: !faq.isOpen };
      }
      return faq;
    }));
  };

  const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; bgColor: string; iconColor: string }> = ({ 
    icon, 
    title, 
    value, 
    bgColor, 
    iconColor 
  }) => (
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

  // Function to handle WhatsApp sharing
  const handleWhatsAppShare = () => {
    const message = `Hey! Join Askoxy.AI using my referral link and get amazing benefits: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Function to copy referral link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    Modal.success({
      content: 'Referral link copied to clipboard!',
      onOk: () => {},
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-purple-600">Refer a Friend & Earn ₹100</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Invite a Friend</h3>
                <p className="text-gray-600 mb-4">
                  Invite your friends to join Askoxy.AI. When they register using your referral link and place an order for rice, you'll receive ₹100 cashback!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <button 
                    onClick={() => handleShare('whatsapp')}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <FaWhatsapp className="mr-2 text-xl" /> Share via WhatsApp
                  </button>
                 
                </div>
                
              </div>
              <div className="hidden md:block">
                <div className="h-full flex items-center justify-center bg-purple-50 rounded-xl p-6">
                  <div className="text-center">
                    <Gift className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-purple-600 mb-2">Earn ₹100 Cashback</h3>
                    <p className="text-gray-600">
                      For every successful referral who places an order for rice
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Referee Details Table */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Your Referee Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border-b p-4 text-left text-sm font-semibold text-gray-600">WhatsApp Number</th>
                    <th className="border-b p-4 text-left text-sm font-semibold text-gray-600">Referred Date</th>
                    <th className="border-b p-4 text-left text-sm font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {refereeDetails.map((referee) => (
                    <tr key={referee.id} className="hover:bg-gray-50">
                      <td className="border-b p-4 text-gray-600">{referee.whatsappnumber}</td>
                      <td className="border-b p-4 text-gray-600">{formatDate(referee.created_at)}</td>
                      <td className="border-b p-4">
                        <span 
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            referee.referenceStatus === "REGISTERED" 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {referee.referenceStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {refereeDetails.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center py-8">
                        <p className="text-gray-500">No referee details found.</p>
                        <p className="text-sm text-gray-400 mt-1">Start sharing your referral link to invite friends!</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-xl font-semibold mb-6">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b pb-4">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex justify-between items-center w-full text-left py-2 focus:outline-none"
                  >
                    <span className="font-medium text-gray-800">{faq.question}</span>
                    {faq.isOpen ? (
                      <ChevronUp className="h-5 w-5 text-purple-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-purple-600" />
                    )}
                  </button>
                  {faq.isOpen && (
                    <div className="mt-2 text-gray-600 text-sm">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div 
              className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
              onClick={() => setIsModalOpen(false)}
            />

            <div className="relative bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Enter Referee Details</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-4">
                  Please enter the phone number of the person you want to refer.
                </p>
                <div className="space-y-4">
                  <PhoneInput
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry="IN"
                    value={phoneNumber}
                    onChange={(value) => {
                      setPhoneNumber(value);
                      setError(''); // Clear error when user types
                    }}
                    className="w-full p-3 bg-white/30 backdrop-blur-md shadow-md rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-800 placeholder-transparent [&>*]:outline-none [&.PhoneInputInput]:outline-none [&.PhoneInputInput]:border-none"
                  />
                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Processing...' : 'Submit'}
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