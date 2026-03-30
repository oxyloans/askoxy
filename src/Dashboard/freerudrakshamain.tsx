import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag, Coins, Bot, Settings, X, Mail, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Image1 from "../assets/img/WEBSITE (1).png";
import Image2 from "../assets/img/R2.png";
import { Modal, Button, Input, message, Form } from "antd";
import Footer from '../components/Footer';
import  BASE_URL  from "../Config";
import customerApi from '../utils/axiosInstances';

const FreeRudrakshaPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [modalType, setModalType] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('services');
  const [query, setQuery] = useState('');
  const [isWriteToUsOpen, setIsWriteToUsOpen] = useState(false);
  const [isOfficeConfirmationVisible, setIsOfficeConfirmationVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [writeToUsForm, setWriteToUsForm] = useState({
    mobilenumber: '',
    email: '',
    message: '',
  });
  const [interestedForm, setInterestedForm] = useState({
    name: '',
    email: '',
    phone: '',
    details: ''
  });


  const storedPhoneNumber = localStorage.getItem("whatsappNumber");
  const [savedAddress, setSavedAddress] = useState<string>("");
  const [delivery, setDelivery] = useState<string>("");
  const [firstRequestDate, setFirstRequestDate] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const userId = localStorage.getItem('userId');
  const email = localStorage.getItem('email');
  const whatsappNumber = localStorage.getItem('whatsappNumber');

  // Other services
  const otherServices = [
    "Free AI & CHATGPT Training",
    "Legal Knowledge Hub",
    "My Rotary",
    "Study Abroad",
    "Free Rice Samples",
    "Machines and Manufacturing Services"
  ];

  useEffect(() => {
    // Check if user has previously submitted
    const userHasSubmitted = localStorage.getItem(`${userId}_hasSubmitted`);
    const userFirstRequestDate = localStorage.getItem(`${userId}_firstRequestDate`);
    if (userHasSubmitted) {
      setHasSubmitted(true);
      setFirstRequestDate(userFirstRequestDate || '');
    }
  }, [userId]);

  const TabButton = ({ tab, icon, label }: { tab: string; icon: React.ReactNode; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab
          ? 'bg-purple-100 text-purple-700 shadow-sm'
          : 'hover:bg-gray-100 text-gray-600'
        }`}
    >
      {icon}
      {label}
    </button>
  );

  

  // Write To Us API Integration
  const handleWriteToUsSubmit = async () => {
    if (!writeToUsForm.mobilenumber || !writeToUsForm.email || !writeToUsForm.message ) {
      message.error('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      await customerApi.post(`${BASE_URL}/contact-service/contact/submit`, {
        userId,
        ...writeToUsForm,
      });

      message.success('Message sent successfully!');
      setIsWriteToUsOpen(false);
      setWriteToUsForm({ mobilenumber: '', email: '', message: '' });
    } catch (error) {
      console.error('Error:', error);
      message.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPhone = () => {
    setModalType("addressEntry");
  };

  const handleWhatsappClick = () => {
    if (storedPhoneNumber) {
      setPhoneNumber(storedPhoneNumber);
      setModalType("confirmation");
      setIsModalOpen(true);
    } else {
      message.error("Phone number is not available in local storage.");
    }
  };

  const officeDetails = {
    address: "CC-02, Ground Floor, Block-C, Indu Fortune Fields, The Annexe Phase-13, KPHB Colony, K P H B Phase 9, Kukatpally, Hyderabad, Telangana 500085",
    VisitTimings: "Monday to Friday, 10:00 AM to 6:00 PM",
    googleMapLink: "https://maps.app.goo.gl/MC1EmbY4DSdFcpke9",
    contact: "099668 88825",
  };

  const fetchUserAddress = async () => {
    try {
      setIsLoading(true);
      const response = await customerApi.get(`${BASE_URL}/auth-service/auth/getuserAddress?userId=${userId}`);
      if (response.data) {
        const data = response.data;
        setSavedAddress(data.address);
        setDelivery(data.delivery);
        setModalType("success");
      } else {
        message.error("Failed to fetch saved address. Please try again.");
      }
    } catch (error) {
      console.error("Failed to fetch address:", error);
      message.error("An error occurred while fetching the address.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveAddress = async () => {
    if (!address.trim()) {
      message.error("Please enter an address.");
      return;
    }
    if (hasSubmitted) {
      message.info(`We have received your first request on ${firstRequestDate}. Every user can participate only once!`);
      return;
    }

    try {
      setIsLoading(true);
      await customerApi.post(
        `${BASE_URL}/marketing-service/campgin/rudhrakshaDistribution`,
        { address, userId }
      );

      message.success("Address saved successfully!");
      fetchUserAddress();
    } catch (error) {
      console.error("Error saving address:", error);
      message.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFreeRudrakshaClick = () => {
    if (!whatsappNumber) {
      navigate('/dashboard/user-profile');
      return;
    }
    setModalType('confirmation');
    setIsModalOpen(true);
  };

  const submitRequest = async (deliveryType: string) => {
    if (hasSubmitted) {
      message.info(`We have received your first request on ${firstRequestDate}`);
      return;
    }

    try {
      setIsLoading(true);
      await customerApi.post(
        `${BASE_URL}/marketing-service/campgin/rudhrakshaDistribution`,
        { userId, deliveryType }
      );

      const date = new Date().toLocaleDateString();
      setFirstRequestDate(date);
      setHasSubmitted(true);
      localStorage.setItem(`${userId}_hasSubmitted`, "true");
      localStorage.setItem(`${userId}_firstRequestDate`, date);
      message.success("Request submitted successfully!");
      setIsPopupVisible(false);
    } catch (error) {
      console.error("Error submitting request:", error);
      message.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
      setAddress("");
      setIsPopupVisible(false);
      setIsModalOpen(false);
    }
  };

  const handleDeliverySelection = (deliveryType: string) => {
    if (deliveryType === "PickInOffice") {
      setIsOfficeConfirmationVisible(true);
    } else {
      submitRequest(deliveryType);
    }
  };

  const handleConfirmAddress = () => {
    setIsModalOpen(false);
    message.success("Address confirmed successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        <div className="bg-white rounded-xl shadow-sm">


          {/* Main Content */}
          <div className="max-w-7xl mx-auto p-4">

            <div className="flex items-center justify-between mb-8">
              {/* Back Button & Title */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold text-purple-600 flex items-center gap-2">
                  Free Rudraksha
                </h1>
              </div>

              {/* Right-Aligned Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <button
                  onClick={handleFreeRudrakshaClick}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <Heart size={20} />
                  <span>I Want Free Rudraksha</span>
                </button>
                <button
                  onClick={() => setIsWriteToUsOpen(true)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <Mail size={20} />
                  <span>Write To Us</span>
                </button>
              </div>
            </div>



            <div className="grid md:grid-cols-2 gap-6">
              {[
                { src: Image1, title: "Spiritual World" },
                { src: Image2, title: "AI & Generative AI World" }
              ].map((item, index) => (
                <div key={index} className="rounded-xl overflow-hidden shadow-md transform hover:scale-[1.02] transition-transform">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-purple-600 p-4 text-center">
                    {item.title}
                  </h3>
                </div>
              ))}
            </div>

            {/* Call to Action Section */}
            <div className="text-center pt-10space-y-4 sm:space-y-6 mb-4">
              <p className="text-lg mb-2 font-bold">
                The One Lakh Rudraksharchana on 19th November was a grand success! 🌟
              </p>
              <p className="text-base sm:text-lg px-2">
                Click on “I Want Free Rudraksha” now to receive the sacred Rudrakshas used in the Archana. They will be delivered to your doorstep at no cost. Inspired by this success, we aspire to host 99 more Rudraksharchana events to fulfill our vision of One Crore Rudraksharchanas! Join us on this divine journey. 🙏
              </p>
              <div className="flex justify-center">
                {/* <button
              onClick={handleFreeRudrakshaClick}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              I Want Free Rudraksha
            </button> */}
              </div>
            </div>

            {/* Telugu Content */}
            <div className="text-center mb-8">
              <p className="text-lg mb-2  font-bold">
                నవంబర్ 19న నిర్వహించిన లక్ష రుద్రాక్షార్చన ఘన విజయాన్ని సాధించింది!🌟
              </p>
              <p className="text-lg">
                ఆర్చనలో ఉపయోగించిన పవిత్ర రుద్రాక్షలను పొందడానికి ఇప్పుడు "I want Free Rudraksha" పై క్లిక్ చేయండి. అవి మీ ఇంటి వద్దకు ఉచితంగా పంపబడతాయి. ఈ విజయంతో ప్రేరణ పొందిన మేము, మా లక్ష్యం అయిన కోటి రుద్రాక్షార్చనల సాధన కోసం మరో 99 రుద్రాక్షార్చన కార్యక్రమాలను నిర్వహించేందుకు సంకల్పించాము! ఈ దివ్య ప్రయాణంలో భాగస్వామ్యం అవ్వండి. 🙏
              </p>
            </div>


            {/* Write To Us Modal */}
            <Modal
              visible={isWriteToUsOpen}
              onCancel={() => setIsWriteToUsOpen(false)}
              footer={null}
              title="Write To Us"
              className="modal-responsive"
            >
              <Form layout="vertical" className="mt-4">
                <Form.Item label="Mobile num" required>
                  <Input
                    value={writeToUsForm.mobilenumber}
                    onChange={(e) => setWriteToUsForm({ ...writeToUsForm, mobilenumber: e.target.value })}
                    placeholder="Enter your mobile number"
                  />
                </Form.Item>
                <Form.Item label="Email" required>
                  <Input
                    value={writeToUsForm.email}
                    onChange={(e) => setWriteToUsForm({ ...writeToUsForm, email: e.target.value })}
                    placeholder="Enter your email"
                    type="email"
                  />
                </Form.Item>
                <Form.Item label="Message" required>
                  <Input.TextArea
                    value={writeToUsForm.message}
                    onChange={(e) => setWriteToUsForm({ ...writeToUsForm, message: e.target.value })}
                    placeholder="Enter your query"
                    rows={4}
                  />
                </Form.Item>
                <Button
                  type="primary"
                  onClick={handleWriteToUsSubmit}
                  loading={isLoading}
                  className="w-full"
                >
                  Submit
                </Button>
              </Form>
            </Modal>

            {/* Main Rudraksha Modal */}
            <Modal
              visible={isModalOpen}
              onCancel={() => setIsModalOpen(false)}
              footer={null}
              title=""
              className="modal-responsive"
            >
              {modalType === "confirmation" && (
                <div className="p-4">
                  <p className="text-lg text-center text-black mb-4">
                    Please confirm your WhatsApp number:
                    <span className="font-bold block mt-2">{phoneNumber}</span>
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      type="primary"
                      onClick={handleConfirmPhone}
                      className="w-full sm:w-auto"
                    >
                      Yes
                    </Button>
                    <Button
                      danger
                      onClick={() => setIsModalOpen(false)}
                      className="w-full sm:w-auto"
                    >
                      No
                    </Button>
                  </div>
                </div>
              )}

              {modalType === "addressEntry" && (
                <div className="p-4">
                  <p className="text-lg text-center text-black mb-4">
                    Please enter your address below:
                  </p>
                  <Input.TextArea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your complete address"
                    className="w-full mb-4"
                    rows={4}
                  />
                  <Button
                    type="primary"
                    block
                    onClick={saveAddress}
                    loading={isLoading}
                  >
                    Save Address
                  </Button>
                </div>
              )}

              {modalType === "success" && (
                <div className="p-4">
                  {isLoading ? (
                    <div className="text-center">
                      <p>Loading address...</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-lg text-center text-black mb-4">
                        Your saved address is:
                        <span className="font-bold block mt-2">{savedAddress}</span>
                      </p>
                      <div className="flex gap-4 justify-center">
                        <Button
                          type="primary"
                          onClick={() => {
                            handleConfirmAddress();
                            setIsPopupVisible(true);
                          }}
                          className="w-full sm:w-auto"
                        >
                          Confirm
                        </Button>
                        <Button
                          danger
                          onClick={() => setModalType("addressEntry")}
                          className="w-full sm:w-auto"
                        >
                          Edit Address
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </Modal>

            {/* Delivery Method Popup */}
            {isPopupVisible && !isLoading && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-md w-11/12 max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Choose Delivery Method</h3>
                    <button
                      onClick={() => setIsPopupVisible(false)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <p className="text-base text-center text-gray-600 mb-6">
                    Please choose your preferred delivery method:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all w-full flex items-center justify-center gap-2"
                      onClick={() => submitRequest("HomeDelivery")}
                    >
                      <ShoppingBag size={20} />
                      Home Delivery
                    </button>
                    <button
                      className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all w-full flex items-center justify-center gap-2"
                      onClick={() => handleDeliverySelection("PickInOffice")}
                    >
                      <Settings size={20} />
                      Collect from Office
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Office Details Modal */}
            {isOfficeConfirmationVisible && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-md w-11/12 max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Office Details</h3>
                    <button
                      onClick={() => setIsOfficeConfirmationVisible(false)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4 mb-6">
                    <p className="text-sm">
                      <strong>Address:</strong> {officeDetails.address}
                    </p>
                    <p className="text-sm">
                      <strong>Visit Timings:</strong> {officeDetails.VisitTimings}
                    </p>
                    <p className="text-sm">
                      <strong>Contact:</strong> {officeDetails.contact}
                    </p>
                    <a
                      href={officeDetails.googleMapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline block"
                    >
                      View Location on Google Maps
                    </a>
                  </div>
                  <div className="flex gap-4">
                    <button
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                      onClick={() => {
                        setIsOfficeConfirmationVisible(false);
                        submitRequest("PickInOffice");
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                      onClick={() => setIsOfficeConfirmationVisible(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Footer />
        </div>
      </div>
    </div>

  );
};

export default FreeRudrakshaPage;
