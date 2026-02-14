import React, { useEffect, useState } from "react";
import { Form, Button,  message,  Modal, } from "antd";
import { Briefcase, FileUp, CheckCircle2} from "lucide-react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import BASE_URL from "../Config";

type RatePeriod = 'hour' | 'day' | 'week' | 'month' | 'year';

const rateOptions = {
  hour: ['125-150', '150-175', '175-200', '200-225', '225-250', '250+'],
  day: ['1000-1200', '1200-1400', '1400-1600', '1600-1800', '1800-2000', '2000+'],
  week: ['5000-6000', '6000-7000', '7000-8000', '8000-9000', '9000-10000', '10000+'],
  month: ['20000-22000', '22000-24000', '24000-26000', '26000-28000', '28000-30000', '30000+'],
  year: ['240000-260000', '260000-280000', '280000-300000', '300000-320000', '320000+']
};

const FreelancerForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [freelancerData, setFreelancerData] = useState<any>(null);
  const [isOpenForFreelancing, setIsOpenForFreelancing] = useState<string>('');
  const [rateCard, setRateCard] = useState<Record<RatePeriod, string>>({
    hour: '',
    day: '',
    week: '',
    month: '',
    year: ''
  });
  const [isRateNegotiable, setIsRateNegotiable] = useState<string>('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [documentPath, setDocumentPath] = useState<string>("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    whatsappNumber: ""
  });

  const userId = localStorage.getItem("userId") || "";
  const userDetails = localStorage.getItem("profileData");

  const fetchFreelancerData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ai-service/agent/getFreeLancersData/${userId}`,{
        headers:{
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      const data = response.data;
      setFreelancerData(data);
      
      if (Array.isArray(data) && data.length === 0) {
        // Empty array - enable all fields
        setIsOpenForFreelancing('');
        setIsRateNegotiable('');
        setRateCard({ hour: '', day: '', week: '', month: '', year: '' });
        setDocumentPath('');
      } else if (data && data.length > 0) {
        // Data exists - populate fields
        const freelancer = data[0];
        setIsOpenForFreelancing(freelancer.openForFreeLancing?.toLowerCase() || '');
        setIsRateNegotiable(freelancer.amountNegotiable?.toLowerCase() || '');
        
        // Map numeric values back to dropdown options
        const mapValueToOption = (value: number, period: RatePeriod) => {
          if (!value || value === 0) return '';
          const options = rateOptions[period];
          return options.find(option => {
            const match = option.match(/^(\d+)/);
            return match && parseInt(match[1]) === value;
          }) || value.toString();
        };
        
        setRateCard({
          hour: mapValueToOption(freelancer.perHour, 'hour'),
          day: mapValueToOption(freelancer.perDay, 'day'),
          week: mapValueToOption(freelancer.perWeek, 'week'),
          month: mapValueToOption(freelancer.perMonth, 'month'),
          year: mapValueToOption(freelancer.perYear, 'year')
        });
        
        setDocumentPath(freelancer.resumeUrl || '');
        
        // Set resume file name for display if resumeUrl exists
        if (freelancer.resumeUrl) {
          const fileName = freelancer.resumeUrl.split('/').pop() || 'Resume.pdf';
          setResumeFile(new File([], fileName));
        }
      }
    } catch (error) {
      console.error('Error fetching freelancer data:', error);
      setIsEditing(true);
    }
  };

  useEffect(() => {
    const parsedUserDetails = userDetails ? JSON.parse(userDetails) : null;
    const firstName = parsedUserDetails?.userFirstName || "";
    const lastName = parsedUserDetails?.userLastName || "";
    const email = parsedUserDetails?.customerEmail || "";
    const mobileNumber = parsedUserDetails?.alterMobileNumber || "";
    const whatsappNumber = localStorage.getItem("whatsappNumber") || "";
    
    setProfileData({ firstName, lastName, email, mobileNumber, whatsappNumber });
    
    // if (!firstName || !mobileNumber) {
    //   setShowProfileModal(true);
    // }
    
    if (userId) {
      fetchFreelancerData();
    }
  }, [form, userId]);

  const handleRateChange = (period: RatePeriod, value: string) => {
    setRateCard(prev => ({
      ...prev,
      [period]: value
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setUploadLoading(true);
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await axios.post(
          `https://meta.oxyloans.com/api/upload-service/upload?id=45880e62-acaf-4645-a83e-d1c8498e923e&fileType=aadhar`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
          }
        );
        console.log('Upload response:', response.data);
        setDocumentPath(response.data.documentPath);
        message.success("Resume uploaded successfully!");
      } catch (error) {
        console.error('Upload error:', error);
        message.error("Failed to upload resume. Please try again.");
        setResumeFile(null);
      } finally {
        setUploadLoading(false);
      }
    }
  };

  const handleSubmitClick = () => {
    // Validate required fields first
    if (!userId) {
      message.error("User ID missing. Please login again.");
      return;
    }

   
    if (isOpenForFreelancing === 'yes') {
      const hasAtLeastOneRate = Object.values(rateCard).some(rate => rate && rate !== '');
      if (!hasAtLeastOneRate) {
        message.error("Please select at least one rate option.");
        return;
      }

      if (!isRateNegotiable) {
        message.error("Please select if your rate is negotiable.");
        return;
      }
       if (!documentPath) {
      message.error("Please upload your resume.");
      return;
    }

    }

    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      setLoading(true);
      setShowConfirmModal(false);

      // Extract numeric values from rate card
      const extractAmount = (rateString: string) => {
        if (!rateString) return 0;
        const match = rateString.match(/^(\d+)/);
        return match ? parseInt(match[1]) : 0;
      };

      const payload = {
        amountNegotiable: isRateNegotiable.toUpperCase() || "NO",
        email: profileData.email || "",
        id: (Array.isArray(freelancerData) && freelancerData.length > 0) ? freelancerData[0].id : "",
        openForFreeLancing: isOpenForFreelancing.toUpperCase() || "NO",
        perHour:extractAmount(rateCard.hour),
        perMonth:extractAmount(rateCard.month),
        perWeek:extractAmount(rateCard.week),
        perYear:extractAmount(rateCard.year),
        perDay:extractAmount(rateCard.day),
        resumeUrl: documentPath || "",
        userId
      };

      await axios.patch(`${BASE_URL}/ai-service/agent/freeLancerInfo`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      
      setShowSuccessModal(true);
       navigate("/main/freelanceappliedlist");
      fetchFreelancerData();
    } catch (err: any) {
      console.error(err);
      message.error(err?.response?.data?.message || err?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const periodLabels = {
    hour: 'Per Hour',
    day: 'Per Day',
    week: 'Per Week',
    month: 'Per Month',
    year: 'Per Year'
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #faf5ff 0%,  100%)", padding: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "768px" }}>
        <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", border: "1px solid #E5E7EB", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ background: "linear-gradient(90deg, #9333ea 0%, #7e22ce 100%)", padding: "16px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Briefcase style={{ width: "24px", height: "24px", color: "white" }} />
              <div>
                <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "white", margin: 0 }}>Freelance Resume</h1>
                <p style={{ color: "#e9d5ff", fontSize: "14px", margin: 0 }}>Complete your freelance profile</p>
              </div>
            </div>
          </div>

          <div style={{ padding: "24px" }}>
            {/* Welcome Message */}
            <div style={{ marginBottom: "24px", background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)", border: "1px solid #e9d5ff", borderRadius: "8px", padding: "12px" }}>
              <p style={{ fontSize: "12px", color: "#7e22ce", margin: 0 }}>
                <span style={{ fontWeight: "600" }}>Welcome to ASKOXY.AI. We help professionals showcase their skills, connect with opportunities, and receive fair payouts for their work.</span>
              </p>
            </div>

            {/* Freelancing Availability */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151", display: "block", marginBottom: "8px" }}>Are you open to freelance opportunities?</label>
              <div style={{ display: "flex", gap: "24px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <div style={{ 
                    width: "20px", 
                    height: "20px", 
                    borderRadius: "50%", 
                    border: `2px solid ${isOpenForFreelancing === 'yes' ? '#9333ea' : '#d1d5db'}`, 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center" 
                  }}>
                    {isOpenForFreelancing === 'yes' && <div style={{ width: "10px", height: "10px", background: "#9333ea", borderRadius: "50%" }}></div>}
                  </div>
                  <span style={{ color: "#374151" }}>Yes</span>
                  <input
                    type="radio"
                    name="freelancing"
                    value="yes"
                    checked={isOpenForFreelancing === 'yes'}
                    onChange={(e) => setIsOpenForFreelancing(e.target.value)}
                    style={{ display: "none" }}
                  />
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <div style={{ 
                    width: "20px", 
                    height: "20px", 
                    borderRadius: "50%", 
                    border: `2px solid ${isOpenForFreelancing === 'no' ? '#9333ea' : '#d1d5db'}`, 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center" 
                  }}>
                    {isOpenForFreelancing === 'no' && <div style={{ width: "10px", height: "10px", background: "#9333ea", borderRadius: "50%" }}></div>}
                  </div>
                  <span style={{ color: "#374151" }}>No</span>
                  <input
                    type="radio"
                    name="freelancing"
                    value="no"
                    checked={isOpenForFreelancing === 'no'}
                    onChange={(e) => setIsOpenForFreelancing(e.target.value)}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>

            {isOpenForFreelancing && isOpenForFreelancing === 'yes' ? (
              <>
                {/* Rate Card Section */}
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                    {/* <DollarSign style={{ width: "20px", height: "20px", color: "#9333ea" }} /> */}
                    <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#7e22ce", margin: 0 }}>How much would you like to charge (in INR)?</h3>
                  </div>

                  {/* Rate Inputs - All in one line */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" }}>
                    {(['hour', 'day', 'week', 'month', 'year'] as RatePeriod[]).map(period => (
                      <div key={period} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "12px", fontWeight: "500", color: "#6b7280" }}>
                          {periodLabels[period]}
                        </label>
                        <select
                          value={rateCard[period]}
                          onChange={(e) => handleRateChange(period, e.target.value)}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            fontSize: "14px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            background: "white",
                            outline: "none"
                          }}
                        >
                          <option value="">Select</option>
                          {rateOptions[period].map(option => (
                            <option key={option} value={option}>
                              ₹{option}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  {/* Rate Info Note */}
                  <div style={{ marginTop: "16px", background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: "8px", padding: "12px" }}>
                    <p style={{ fontSize: "12px", color: "#7e22ce", margin: 0 }}>
                      <span style={{ fontWeight: "500" }}>Rate Guidelines:</span> In India per hour ₹125-500, per day ₹1000-2000, per week ₹5000-10,000, per month ₹20,000-30,000
                    </p>
                  </div>

                  {/* Rate Negotiable */}
                  <div style={{ marginTop: "24px" }}>
                    <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151", display: "block", marginBottom: "8px" }}>Is Rate Card Negotiable?</label>
                    <div style={{ display: "flex", gap: "24px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                        <div style={{ 
                          width: "20px", 
                          height: "20px", 
                          borderRadius: "50%", 
                          border: `2px solid ${isRateNegotiable === 'yes' ? '#9333ea' : '#d1d5db'}`, 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center" 
                        }}>
                          {isRateNegotiable === 'yes' && <div style={{ width: "10px", height: "10px", background: "#9333ea", borderRadius: "50%" }}></div>}
                        </div>
                        <span style={{ color: "#374151" }}>Yes</span>
                        <input
                          type="radio"
                          name="negotiable"
                          value="yes"
                          checked={isRateNegotiable === 'yes'}
                          onChange={(e) => setIsRateNegotiable(e.target.value)}
                          style={{ display: "none" }}
                        />
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                        <div style={{ 
                          width: "20px", 
                          height: "20px", 
                          borderRadius: "50%", 
                          border: `2px solid ${isRateNegotiable === 'no' ? '#9333ea' : '#d1d5db'}`, 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center" 
                        }}>
                          {isRateNegotiable === 'no' && <div style={{ width: "10px", height: "10px", background: "#9333ea", borderRadius: "50%" }}></div>}
                        </div>
                        <span style={{ color: "#374151" }}>No</span>
                        <input
                          type="radio"
                          name="negotiable"
                          value="no"
                          checked={isRateNegotiable === 'no'}
                          onChange={(e) => setIsRateNegotiable(e.target.value)}
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Resume Upload for Freelancers */}
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <FileUp style={{ width: "20px", height: "20px", color: "#9333ea" }} />
                    <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#7e22ce", margin: 0 }}>Resume Upload</h3>
                  </div>
                  <div style={{ 
                    border: "2px dashed #d1d5db", 
                    borderRadius: "8px", 
                    padding: "24px", 
                    textAlign: "center", 
                    background: "#faf5ff" 
                  }}>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload" style={{ cursor: "pointer" }}>
                      {uploadLoading ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                          <div style={{ width: "20px", height: "20px", border: "2px solid #9333ea", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                          <span style={{ color: "#9333ea", fontWeight: "500" }}>Uploading...</span>
                        </div>
                      ) : resumeFile ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                          <CheckCircle2 style={{ width: "20px", height: "20px", color: "#10b981" }} />
                          <span style={{ color: "#10b981", fontWeight: "500" }}>{resumeFile.name}</span>
                        </div>
                      ) : (
                        <div>
                          <FileUp style={{ width: "32px", height: "32px", color: "#9333ea", margin: "0 auto 8px" }} />
                          <p style={{ color: "#7e22ce", margin: 0 }}>Click to upload your resume</p>
                          <p style={{ color: "#9ca3af", fontSize: "12px", margin: "4px 0 0 0" }}>PDF, DOC, DOCX up to 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </>
            ) : isOpenForFreelancing === 'no' ? (
              /* Full-time Job Resume Upload */
              <div style={{ marginBottom: "24px" }}>
                <div style={{ 
                  background: "linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)", 
                  borderRadius: "12px", 
                  padding: "32px", 
                  textAlign: "center", 
                  color: "white" 
                }}>
                  <Briefcase style={{ width: "48px", height: "48px", margin: "0 auto 16px", color: "white" }} />
                  <h3 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 8px 0", color: "white" }}>Full-Time Job Applications</h3>
                  <p style={{ color: "#e9d5ff", margin: "0 0 24px 0" }}>Upload your resume to apply for full-time positions</p>
                  
                  <div style={{ 
                    background: "rgba(255,255,255,0.1)", 
                    border: "2px dashed rgba(255,255,255,0.3)", 
                    borderRadius: "8px", 
                    padding: "24px" 
                  }}>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                      id="fulltime-resume-upload"
                    />
                    <label htmlFor="fulltime-resume-upload" style={{ cursor: "pointer" }}>
                      {uploadLoading ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                          <div style={{ width: "24px", height: "24px", border: "2px solid white", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                          <span style={{ color: "white", fontWeight: "500" }}>Uploading...</span>
                        </div>
                      ) : resumeFile ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                          <CheckCircle2 style={{ width: "24px", height: "24px", color: "#10f981" }} />
                          <span style={{ color: "white", fontWeight: "500" }}>{resumeFile.name}</span>
                        </div>
                      ) : (
                        <div>
                          <FileUp style={{ width: "40px", height: "40px", color: "white", margin: "0 auto 12px" }} />
                          <p style={{ color: "white", margin: "0 0 4px 0", fontWeight: "500" }}>Upload Your Professional Resume</p>
                          <p style={{ color: "#e9d5ff", fontSize: "14px", margin: 0 }}>PDF, DOC, DOCX up to 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Submit Button - Only show when freelancing option is selected */}
            {isOpenForFreelancing && (
            <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #e5e7eb" }}>
              <Button
                type="primary"
                loading={loading}
                onClick={handleSubmitClick}
                block
                style={{
                  height: 48,
                  fontSize: 16,
                  fontWeight: 600,
                  borderRadius: 8,
                  border: "none",
                  background: "linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)",
                  boxShadow: "0 4px 12px rgba(147,51,234,0.3)",
                }}
              >
                Save Freelance Profile
              </Button>
            </div>
            )}
          </div>
        </div>
      </div>
      
      <Modal
        title="Profile Incomplete"
        open={showProfileModal}
        onOk={() => {
          setShowProfileModal(false);
          window.location.href = "/main/profile";
        }}
        onCancel={() => setShowProfileModal(false)}
        okText="Go to Profile"
        cancelText="Cancel"
      >
        <p>Your profile is incomplete. Please complete your profile first to continue with freelancer registration.</p>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        title={null}
        open={showConfirmModal}
        onOk={handleConfirmSubmit}
        onCancel={() => setShowConfirmModal(false)}
        okText="Confirm & Save"
        cancelText="Cancel"
        confirmLoading={loading}
        width={500}
        okButtonProps={{
          style: {
            background: "linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)",
            border: "none",
            borderRadius: "6px",
            height: "40px",
            fontWeight: "600"
          }
        }}
        cancelButtonProps={{
          style: {
            borderRadius: "6px",
            height: "40px",
            fontWeight: "600"
          }
        }}
      >
        <div style={{ padding: "20px 0" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ 
              width: "60px", 
              height: "60px", 
              background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)", 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              margin: "0 auto 16px",
              border: "2px solid #e9d5ff"
            }}>
              <Briefcase style={{ width: "24px", height: "24px", color: "#9333ea" }} />
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", margin: "0 0 8px 0" }}>Confirm Your Details</h3>
            <p style={{ color: "#6b7280", margin: 0, fontSize: "14px" }}>Please review your information before saving</p>
          </div>

          {/* Details Card */}
          <div style={{ 
            background: "#f9fafb", 
            border: "1px solid #e5e7eb", 
            borderRadius: "12px", 
            padding: "20px",
            marginBottom: "20px"
          }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "16px", padding: "12px", background: "white", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <div style={{ width: "8px", height: "8px", background: isOpenForFreelancing === 'yes' ? '#10b981' : '#f59e0b', borderRadius: "50%", marginRight: "12px" }}></div>
              <span style={{ fontWeight: "500", color: "#374151", fontSize: "14px" }}>Open for Freelancing: </span>
              <span style={{ color: isOpenForFreelancing === 'yes' ? '#10b981' : '#f59e0b', fontWeight: "600", marginLeft: "8px" }}>
                {isOpenForFreelancing === 'yes' ? 'Yes' : 'No'}
              </span>
            </div>

            <div style={{ marginBottom: "16px", padding: "12px", background: "white", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <span style={{ fontWeight: "500", color: "#374151", fontSize: "14px" }}>Email: </span>
              <span style={{ color: "#6b7280" }}>{profileData.email}</span>
            </div>

            {isOpenForFreelancing === 'yes' && (
              <>
                <div style={{ marginBottom: "16px", padding: "12px", background: "white", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                  <div style={{ fontWeight: "500", color: "#374151", fontSize: "14px", marginBottom: "8px" }}>Rate Card:</div>
                  <div style={{ display: "grid", gap: "6px" }}>
                    {Object.entries(rateCard).map(([period, rate]) => 
                      rate && (
                        <div key={period} style={{ display: "flex", justifyContent: "space-between", padding: "6px 12px", background: "#f3e8ff", borderRadius: "6px" }}>
                          <span style={{ color: "#7e22ce", fontSize: "13px" }}>{periodLabels[period as RatePeriod]}</span>
                          <span style={{ color: "#9333ea", fontWeight: "600", fontSize: "13px" }}>₹{rate}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: "16px", padding: "12px", background: "white", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                  <span style={{ fontWeight: "500", color: "#374151", fontSize: "14px" }}>Rate Negotiable: </span>
                  <span style={{ color: isRateNegotiable === 'yes' ? '#10b981' : '#ef4444', fontWeight: "600" }}>
                    {isRateNegotiable === 'yes' ? 'Yes' : 'No'}
                  </span>
                </div>
              </>
            )}

            <div style={{ padding: "12px", background: "white", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <span style={{ fontWeight: "500", color: "#374151", fontSize: "14px" }}>Resume: </span>
              <span style={{ color: resumeFile?.name ? '#10b981' : '#ef4444', fontWeight: "500" }}>
                {resumeFile?.name || 'Not uploaded'}
              </span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        title={null}
        open={showSuccessModal}
        onOk={() => setShowSuccessModal(false)}
        cancelButtonProps={{ style: { display: 'none' } }}
        okText="Continue"
        width={400}
        okButtonProps={{
          style: {
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            border: "none",
            borderRadius: "6px",
            height: "40px",
            fontWeight: "600",
            width: "100%"
          }
        }}
      >
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          {/* Success Animation Container */}
          <div style={{ 
            width: "80px", 
            height: "80px", 
            background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)", 
            borderRadius: "50%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "0 auto 24px",
            border: "3px solid #10b981",
            animation: "pulse 2s infinite"
          }}>
            <CheckCircle2 style={{ width: "40px", height: "40px", color: "#10b981" }} />
          </div>
          
          <h3 style={{ fontSize: "24px", fontWeight: "600", color: "#1f2937", margin: "0 0 8px 0" }}>Success!</h3>
          <p style={{ fontSize: "16px", color: "#6b7280", margin: "0 0 24px 0", lineHeight: "1.5" }}>
            Your freelancer profile has been saved successfully!
          </p>
          
          <div style={{ 
            background: "#f0fdf4", 
            border: "1px solid #bbf7d0", 
            borderRadius: "8px", 
            padding: "12px",
            marginBottom: "20px"
          }}>
            <p style={{ color: "#15803d", fontSize: "14px", margin: 0, fontWeight: "500" }}>
              🎉 You're all set! Your profile is now live and ready for opportunities.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FreelancerForm;