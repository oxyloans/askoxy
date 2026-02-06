import React, { useState } from "react";
import {
  Upload,
  Button,
  Modal,
  notification,
  Spin,
  Card,
  Steps,

  Input,

} from "antd";
// import drivingLicenseImage from "./Driving_License.jpeg";
import {
  UploadOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  FileTextOutlined,
  
  EyeOutlined,
  DeleteOutlined,
  
} from "@ant-design/icons";
import type { UploadFile, RcFile } from "antd/es/upload/interface";
import axios from "axios";
import BASE_URL from "../Config";

const { Step } = Steps;
const { TextArea } = Input;

interface ExtractedData {
  extractAiText: string;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  policyNumber?: string;
  vehicleNumber?: string;
  travelDestination?: string;
  businessName?: string;
  aadharNumber?: string;
  panNumber?: string;
  fatherName?: string;
  gender?: string;
  state?: string;
  vehicleType?: string;
  registrationNumber?: string;
  engineNumber?: string;
  chassisNo?: string;
  registrationDate?: string;
  color?: string;
  insurancePeriod?: string;
  termsAccepted?: boolean;
  licenseNumber?: string;
  licenseIssueDate?: string;
  licenseValidUpto?: string;
}

const DataReading: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [insuranceType, setInsuranceType] = useState<string>("");
  const [insuranceSubType, setInsuranceSubType] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [extractedTextData, setExtractedTextData] = useState<ExtractedData[]>(
    [],
  );
  const drivingLicenseImage = "/Driving_License.jpeg";
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [showStaticImage, setShowStaticImage] = useState(false);
  const [extractedTextModal, setExtractedTextModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
  });
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const userId = "4d5727dd-e73f-4e07-ab8c-6f06bfa0aaf0";

  const steps = [
    { title: "Insurance Type", description: "Select category" },
    { title: "Policy Type", description: "Choose policy" },
    { title: "Upload Docs", description: "Submit documents" },
    { title: "Review All", description: "Preview all files" },
    { title: "Process & Fill", description: "Auto-fill form" },
    { title: "Submit", description: "Complete application" },
  ];

  // Convert file to base64 for preview
  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
  };

  const handleInsuranceTypeSelect = (value: string) => {
    setInsuranceType(value);
    setShowStaticImage(value === "general"); // Add this line
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      if (!insuranceType) {
        notification.warning({
          message: "Selection Required",
          description: "Please select an insurance type to proceed.",
        });
        return;
      }
      setCurrentStep(1);
    } else if (currentStep === 1) {
      if (insuranceType === "life") {
        notification.info({
          message: "Testing Stage",
          description:
            "Life insurance options are not available yet. This is currently in testing stage.",
        });
        return;
      }
      if (!insuranceSubType) {
        notification.warning({
          message: "Selection Required",
          description: "Please select an insurance policy type to proceed.",
        });
        return;
      }
      setShowStaticImage(insuranceSubType === "motor");

      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (fileList.length === 0) {
        notification.warning({
          message: "Documents Required",
          description: "Please upload at least one document to proceed.",
        });
        return;
      }
      setConfirmationModal(true);
    } else if (currentStep === 3) {
      // Review all documents step - call API here
      setLoading(true);
      const taskId = "741d320a-aa83-4a6a-8358-6fdf6cf070c5";
      await uploadFileToTask(taskId);
      setLoading(false);
      setCurrentStep(4);
    } else if (currentStep === 4) {
      // Preview and edit form
      setCurrentStep(5);
    } else if (currentStep === 5) {
      // Submit application
      if (
        !formData.fullName ||
        !formData.email ||
        !formData.phone ||
        !formData.termsAccepted
      ) {
        notification.warning({
          message: "Required Fields",
          description:
            "Please fill in all required fields and accept terms & conditions.",
        });
        return;
      }

      setApplicationSubmitted(true);
      notification.success({
        message: "Application Submitted",
        description:
          "Your motor insurance application has been submitted successfully and is under review.",
        duration: 5,
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileChange = async ({ fileList: newFileList }: any) => {
    const updatedList = await Promise.all(
      newFileList.map(async (file: UploadFile) => {
        if (
          file.originFileObj &&
          file.type?.startsWith("image/") &&
          !file.thumbUrl
        ) {
          file.thumbUrl = await getBase64(file.originFileObj as RcFile);
        }
        return file;
      }),
    );

    setFileList(updatedList);
  };

  const handleRemoveFile = (file: UploadFile) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);
  };

  const uploadFileToTask = async (taskId: string) => {
    try {
      const token = sessionStorage.getItem("accessToken") || "";
      const formDataToSend = new FormData();

      // Add user uploaded files
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formDataToSend.append("file", file.originFileObj);
        }
      });

      // Add static driving license image for motor insurance
      if (showStaticImage && insuranceSubType === "motor") {
        const response = await fetch(drivingLicenseImage);

        if (!response.ok) {
          throw new Error("Failed to load static DL image");
        }

        const blob = await response.blob();

        const file = new File([blob], "Driving_License.jpeg", {
          type: "image/jpeg",
        });

        formDataToSend.append("file", file);
      }

      formDataToSend.append("userId", userId);
      formDataToSend.append("taskId", taskId);
      formDataToSend.append("fileType", "kyc");
      formDataToSend.append("kycFiles", "Yes");

      const response = await axios.post(
        `${BASE_URL}/user-service/write/multiUploadTaskFilesOcr`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data && response.data.length > 0) {
        // Filter items that have extractAiText
        const extractedData = response.data.filter(
          (item: any) => item.extractAiText && item.extractAiText.trim() !== "",
        );

        if (extractedData.length > 0) {
          // Store the original extracted data
          setExtractedTextData(extractedData);

          // Call group-by-person API with ALL extracted data
          await callGroupByPersonApi(extractedData);

          const randomPolicyNumber = Math.floor(
            10000 + Math.random() * 90000,
          ).toString();

          setFormData((prev) => ({
            ...prev,
            policyNumber: randomPolicyNumber,
          }));
        } else {
          notification.warning({
            message: "No Text Extracted",
            description: "Could not extract text from the uploaded documents.",
            placement: "topRight",
          });
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      notification.error({
        message: "File Upload Failed",
        description: "Could not process the documents. Please try again.",
        placement: "topRight",
      });
    }
  };

const callGroupByPersonApi = async (extractedData: any[]) => {
  try {
    const token = sessionStorage.getItem("accessToken") || "";

    const payload = extractedData.map((item) => ({
      extractAiText: item.extractAiText,
      id: item.id,
    }));

    const response = await axios.post(
      `${BASE_URL}/user-service/write/group-by-person`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.length > 0) {
      const extracted: Partial<FormData> = {};

      // Process each group to extract information
      for (const group of response.data) {
        for (const doc of group.documents || []) {
          const text = doc.extractAiText;
          
          // Extract Name
          const nameMatch = text.match(/(?:Name|Owner Name)(?:\sis)?\s*:?\s*([A-Za-z\s]+)/i);
          if (nameMatch?.[1] && !extracted.fullName) {
            extracted.fullName = nameMatch[1].trim();
          }

          // Extract Date of Birth
          const dobMatch = text.match(/Date of Birth(?:\sis)?\s*:?\s*([\d\/\-]+)/i);
          if (dobMatch?.[1] && !extracted.dateOfBirth) {
            extracted.dateOfBirth = dobMatch[1].trim();
          }

          // Extract Father Name
          const fatherMatch = text.match(/FatherName\s*:?\s*([A-Za-z\s]+)/i);
          if (fatherMatch?.[1] && !extracted.fatherName) {
            extracted.fatherName = fatherMatch[1].trim();
          }

          // Extract Gender
          const genderMatch = text.match(/Gender\s*:?\s*(Male|Female|Other)/i);
          if (genderMatch?.[1] && !extracted.gender) {
            extracted.gender = genderMatch[1].toLowerCase();
          }

          // Extract Aadhaar
          const aadharMatch = text.match(/Aadhaar\s*:?\s*(\d{12})/i);
          if (aadharMatch?.[1] && !extracted.aadharNumber) {
            extracted.aadharNumber = aadharMatch[1];
          }

          // Extract PAN
          const panMatch = text.match(/PAN\s*:?\s*([A-Z]{5}\d{4}[A-Z])/i);
          if (panMatch?.[1] && !extracted.panNumber) {
            extracted.panNumber = panMatch[1];
          }

          // Extract State
          const stateMatch = text.match(/State(?:\sis)?\s*:?\s*([A-Za-z\s]+)/i);
          if (stateMatch?.[1] && !extracted.state) {
            extracted.state = stateMatch[1].trim();
          }

          // Extract Vehicle Details
          const vehicleTypeMatch = text.match(/Vehicle Type(?:\sis)?\s*:?\s*([A-Za-z\s]+)/i);
          if (vehicleTypeMatch?.[1] && !extracted.vehicleType) {
            extracted.vehicleType = vehicleTypeMatch[1].trim();
          }

          const regNoMatch = text.match(/Registration No(?:\sis)?\s*:?\s*([A-Z0-9\s]+)/i);
          if (regNoMatch?.[1] && !extracted.registrationNumber) {
            extracted.registrationNumber = regNoMatch[1].trim();
          }

          const engineNoMatch = text.match(/Engine No(?:\sis)?\s*:?\s*([A-Z0-9]+)/i);
          if (engineNoMatch?.[1] && !extracted.engineNumber) {
            extracted.engineNumber = engineNoMatch[1].trim();
          }

          const chassisNoMatch = text.match(/Chassis No(?:\sis)?\s*:?\s*([A-Z0-9]+)/i);
          if (chassisNoMatch?.[1] && !extracted.chassisNo) {
            extracted.chassisNo = chassisNoMatch[1].trim();
          }

          const regDateMatch = text.match(/Registration Date(?:\sis)?\s*:?\s*([\d\/\-]+)/i);
          if (regDateMatch?.[1] && !extracted.registrationDate) {
            extracted.registrationDate = regDateMatch[1].trim();
          }

          const colorMatch = text.match(/Color(?:\sis)?\s*:?\s*([A-Za-z\s]+)/i);
          if (colorMatch?.[1] && !extracted.color) {
            extracted.color = colorMatch[1].trim();
          }

          // Extract License Details
          const licenseNoMatch = text.match(/license number(?:\sis)?\s*:?\s*([A-Z0-9\-]+)/i);
          if (licenseNoMatch?.[1] && !extracted.licenseNumber) {
            extracted.licenseNumber = licenseNoMatch[1].trim();
          }

          const issueDateMatch = text.match(/issue date(?:\sis)?\s*:?\s*([\d\/\-]+)/i);
          if (issueDateMatch?.[1] && !extracted.licenseIssueDate) {
            extracted.licenseIssueDate = issueDateMatch[1].trim();
          }

          const validTillMatch = text.match(/valid till\s*:?\s*([\d\/\-]+)/i);
          if (validTillMatch?.[1] && !extracted.licenseValidUpto) {
            extracted.licenseValidUpto = validTillMatch[1].trim();
          }
        }
      }

      // Generate random policy number
      const randomPolicyNumber = Math.floor(10000 + Math.random() * 90000).toString();
      extracted.policyNumber = randomPolicyNumber;

      // Apply extracted data to form
      setFormData((prev) => ({
        ...prev,
        ...extracted,
      }));

      // Count filled fields
      const filledCount = Object.values(extracted).filter(Boolean).length;
      
      notification.success({
        message: "Auto-fill Successful",
        description: `${filledCount} fields auto-filled from documents. Please review and complete remaining fields.`,
        placement: "topRight",
        duration: 6,
      });
    } else {
      notification.warning({
        message: "No Data Extracted",
        description: "Could not extract any useful information from documents.",
      });
    }
  } catch (error) {
    console.error("Group-by-person error:", error);
    notification.error({
      message: "Auto-fill Failed",
      description: "Document processing failed. Please enter details manually in Step 5.",
    });
  }
};


  const handleConfirmDocuments = () => {
    setConfirmationModal(false);
    setCurrentStep(3);
  };

  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="step-content px-4 py-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-purple-700 mb-3">
                Select Your Insurance Type
              </h2>
              <p className="text-gold-600 text-lg">
                Choose the insurance category that best fits your needs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <Card
                hoverable
                className={`cursor-pointer transition-all duration-300 border-2 rounded-xl overflow-hidden ${
                  insuranceType === "life"
                    ? "border-navy-500 shadow-xl bg-gradient-to-br from-blue-50 to-white transform scale-102"
                    : "border-slate-200 hover:border-navy-300 hover:shadow-lg hover:transform hover:scale-101"
                }`}
                onClick={() => handleInsuranceTypeSelect("life")}
              
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🛡️</div>
                  <h3 className="text-lg font-bold text-navy-800 mb-1">
                    Life Insurance
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Secure your family's future with comprehensive life coverage
                  </p>
                </div>
              </Card>
              <Card
                hoverable
                className={`cursor-pointer transition-all duration-300 border-2 rounded-xl overflow-hidden ${
                  insuranceType === "general"
                    ? "border-navy-500 shadow-xl bg-gradient-to-br from-blue-50 to-white transform scale-102"
                    : "border-slate-200 hover:border-navy-300 hover:shadow-lg hover:transform hover:scale-101"
                }`}
                onClick={() => handleInsuranceTypeSelect("general")}
                
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🏠</div>
                  <h3 className="text-lg font-bold text-navy-800 mb-1">
                    General Insurance
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Protect your valuable assets with tailored coverage
                  </p>
                </div>
              </Card>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="step-content px-4 py-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-900 via-violet-900 to-indigo-800 bg-clip-text text-transparent">
                Select Policy Type
              </h2>
              <p className="text-green-500 text-lg">
                Choose the specific policy that matches your requirements
              </p>
            </div>
            {insuranceType === "general" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
                <Card
                  hoverable
                  className={`cursor-pointer transition-all duration-300 border-2 rounded-xl ${
                    insuranceSubType === "motor"
                      ? "border-navy-500 shadow-xl bg-gradient-to-br from-blue-50 to-white transform scale-102"
                      : "border-slate-200 hover:border-navy-300 hover:shadow-lg hover:transform hover:scale-101"
                  }`}
                  onClick={() => setInsuranceSubType("motor")}
                
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">🚗</div>
                    <h3 className="text-base font-bold text-navy-800 mb-1">
                      Motor Insurance
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Complete protection for your vehicle
                    </p>
                  </div>
                </Card>
                <Card
                  hoverable
                  className={`cursor-pointer transition-all duration-300 border-2 rounded-xl ${
                    insuranceSubType === "travel"
                      ? "border-navy-500 shadow-xl bg-gradient-to-br from-blue-50 to-white transform scale-102"
                      : "border-slate-200 hover:border-navy-300 hover:shadow-lg hover:transform hover:scale-101"
                  }`}
                  onClick={() => setInsuranceSubType("travel")}
                 
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">✈️</div>
                    <h3 className="text-base font-bold text-navy-800 mb-1">
                      Travel Insurance
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Safe journeys across the globe
                    </p>
                  </div>
                </Card>
                <Card
                  hoverable
                  className={`cursor-pointer transition-all duration-300 border-2 rounded-xl ${
                    insuranceSubType === "commercial"
                      ? "border-navy-500 shadow-xl bg-gradient-to-br from-blue-50 to-white transform scale-102"
                      : "border-slate-200 hover:border-navy-300 hover:shadow-lg hover:transform hover:scale-101"
                  }`}
                  onClick={() => setInsuranceSubType("commercial")}
                 
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">🏭</div>
                    <h3 className="text-base font-bold text-navy-800 mb-1">
                      Commercial
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Comprehensive business protection
                    </p>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold text-purple-700 mb-3">
                  Coming Soon
                </h3>
                <p className="text-slate-600 text-lg mb-2">
                  Life insurance options are currently in testing stage.
                </p>
                <p className="text-slate-500">
                  We'll notify you when they become available.
                </p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="step-content px-4 py-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-purple-700 mb-3">
                Upload Required Documents
              </h2>
              <p className="text-gold-600 text-lg">
                Submit the necessary documents for your {insuranceSubType}{" "}
                insurance application
              </p>
            </div>

            <div className="max-w-3xl mx-auto mb-6">
              <div className="bg-gradient-to-r from-purple-50 to-gold-50 border-l-4 border-black rounded-xl p-4 shadow-md">
                <h3 className="font-bold text-lg mb-3 text-purple-700 flex items-center">
                  <FileTextOutlined className="mr-2 text-gold-600 text-xl" />
                  Required Documents
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start">
                    <span className="text-gold-600 mr-2 text-sm font-bold">
                      •
                    </span>
                    <span className="text-sm">
                      Government-issued ID (PAN, Driver's License, etc.)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-600 mr-2 text-sm font-bold">
                      •
                    </span>
                    <span className="text-sm">
                      Proof of Address (Utility Bill, Bank Statement)
                    </span>
                  </li>
                  {insuranceSubType === "motor" && (
                    <li className="flex items-start">
                      <span className="text-gold-600 mr-2 text-sm font-bold">
                        •
                      </span>
                      <span className="text-sm">
                        Vehicle Registration Certificate
                      </span>
                    </li>
                  )}
                  {insuranceSubType === "travel" && (
                    <li className="flex items-start">
                      <span className="text-gold-600 mr-2 text-sm font-bold">
                        •
                      </span>
                      <span className="text-sm">Passport Copy</span>
                    </li>
                  )}
                  {insuranceSubType === "commercial" && (
                    <li className="flex items-start">
                      <span className="text-gold-600 mr-2 text-sm font-bold">
                        •
                      </span>
                      <span className="text-sm">
                        Business Registration Documents
                      </span>
                    </li>
                  )}
                  <li className="flex items-start">
                    <span className="text-gold-600 mr-2 text-sm font-bold">
                      •
                    </span>
                    <span className="text-sm">Aadhar Documents</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Upload Button */}
              <div className="mb-4 text-center">
                <Upload
                  fileList={fileList}
                  onChange={handleFileChange}
                  beforeUpload={() => false}
                  multiple
                  showUploadList={false}
                >
                  <Button
                    icon={<UploadOutlined />}
                    size="large"
                    className="px-8 py-3 h-auto text-lg font-bold rounded-xl text-gray-900 border border-gray-400 transition-all duration-300"
                  >
                    Choose Files to Upload
                  </Button>
                </Upload>
              </div>

              {/* Uploaded Files (Simple Inline List) */}
              {fileList.length > 0 && (
                <div className="mt-4 space-y-2">
                  {fileList.map((file, index) => (
                    <div
                      key={index}
                      className="
          flex items-center justify-between
          text-base text-slate-700
          px-3 py-2
          rounded-md
          border border-slate-200
          hover:bg-slate-50
        "
                    >
                      {/* Left */}
                      <div className="flex items-center gap-3 min-w-0">
                        <FileTextOutlined className="text-slate-500 text-lg" />

                        <span className="truncate max-w-[320px] font-medium">
                          {file.name}
                        </span>

                        {file.size && (
                          <span className="text-sm text-slate-400">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        )}
                      </div>

                      {/* Right */}
                      <div className="flex items-center gap-2">
                        <Button
                          type="text"
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={() => handlePreview(file)}
                          className="text-slate-600 hover:text-slate-800"
                        />

                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveFile(file)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        if (loading) {
          return (
            <div className="step-content text-center py-12">
              <Spin
                size="large"
                indicator={
                  <LoadingOutlined
                    style={{ fontSize: 48, color: "#475569" }}
                    spin
                  />
                }
              />
              <h3 className="mt-6 text-2xl font-bold text-purple-700">
                Processing Your Documents
              </h3>
              <p className="mt-2 text-lg text-slate-600">
                Please wait while we analyze and verify your files...
              </p>
              <div className="mt-6 max-w-md mx-auto">
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-navy-500 to-navy-600 animate-pulse"
                    style={{ width: "70%" }}
                  ></div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="step-content px-4 py-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-purple-700 mb-2">
                Review All Your Documents
              </h2>
              <p className="text-slate-600 text-base">
                Verify all files before proceeding with processing
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="mb-5">
                <h3 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
                  <FileTextOutlined className="mr-2 text-navy-600 text-lg" />
                  All Documents (
                  {(showStaticImage && insuranceSubType === "motor" ? 1 : 0) +
                    fileList.length}
                  )
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {showStaticImage && insuranceSubType === "motor" && (
                    <div
                      onClick={() => {
                        setPreviewImage(drivingLicenseImage);
                        setPreviewVisible(true);
                      }}
                      className="border-2 border-slate-200 rounded-lg bg-white 
         hover:border-navy-400 hover:shadow-md 
         transition-all duration-200 cursor-pointer group relative"
                    >
                      <div className="absolute top-2 right-2 z-10">
                        <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Email
                        </span>
                      </div>
                      <div className="h-36 bg-slate-50 flex items-center justify-center overflow-hidden">
                        <img
                          src={drivingLicenseImage}
                          alt="Driving License Template"
                          className="max-h-full max-w-full object-contain 
             group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div className="px-3 py-2 border-t border-slate-200">
                        <p className="text-xs font-medium text-navy-800 truncate">
                          Driving_licence.jpeg
                        </p>
                      </div>
                    </div>
                  )}
                  {fileList.map((file, index) => (
                    <div
                      key={index}
                      onClick={() => handlePreview(file)}
                      className="border border-slate-200 rounded-lg bg-white 
                 hover:border-navy-400 hover:shadow-md 
                 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="h-36 bg-slate-50 flex items-center justify-center overflow-hidden">
                        {file.type?.startsWith("image/") ? (
                          <img
                            src={file.thumbUrl || file.url}
                            alt={file.name}
                            className="max-h-full max-w-full object-contain 
                       group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <FileTextOutlined className="text-4xl text-navy-500" />
                        )}
                      </div>
                      <div className="px-3 py-2 border-t border-slate-200">
                        <p className="text-xs font-medium text-navy-800 truncate">
                          {file.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-xl p-4 shadow-md">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">⚠️</span>
                  <div>
                    <p className="font-bold text-lg text-navy-800 mb-1">
                      Important Note
                    </p>
                    <p className="text-slate-700 text-base">
                      Please ensure all documents are clear, readable, and
                      contain accurate information before proceeding.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content px-4 py-10">
            <div className="text-center mb-8">
              <div className="bg-navy-600 text-white py-6 px-8 rounded-xl shadow-lg mb-6">
                <h1 className="text-3xl font-bold mb-2">
                  🚗 MOTOR INSURANCE APPLICATION FORM
                </h1>
                <p className="text-lg opacity-90">
                  ICICOXY Insurance Company Ltd.
                </p>
                <div className="mt-3 bg-white/20 rounded-lg px-4 py-2 inline-block">
                  <span className="text-sm font-medium">
                    Policy No: MI-
                    {formData.policyNumber ||
                      Math.floor(10000 + Math.random() * 90000)}
                  </span>
                </div>
              </div>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200">
                {/* Personal Details Section */}
                <div className="border-b border-slate-200 p-6">
                  <h3 className="text-xl font-bold text-navy-800 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      1
                    </span>
                    Personal Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        size="middle"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleFormChange("fullName", e.target.value)
                        }
                        placeholder="Enter your full name"
                        className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Father's Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        size="middle"
                        value={formData.fatherName || ""}
                        onChange={(e) =>
                          handleFormChange("fatherName", e.target.value)
                        }
                        placeholder="Enter father's name"
                        className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <Input
                        size="middle"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          handleFormChange("dateOfBirth", e.target.value)
                        }
                        className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.gender || ""}
                        onChange={(e) =>
                          handleFormChange("gender", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        size="middle"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleFormChange("phone", e.target.value)
                        }
                        placeholder="+91 XXXXX XXXXX"
                        className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <Input
                        size="middle"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleFormChange("email", e.target.value)
                        }
                        placeholder="your.email@example.com"
                        className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Aadhar Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        size="middle"
                        value={formData.aadharNumber || ""}
                        onChange={(e) =>
                          handleFormChange("aadharNumber", e.target.value)
                        }
                        placeholder="XXXX XXXX XXXX"
                        className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        PAN Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        size="middle"
                        value={formData.panNumber || ""}
                        onChange={(e) =>
                          handleFormChange("panNumber", e.target.value)
                        }
                        placeholder="ABCDE1234F"
                        className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <Input
                        size="middle"
                        value={formData.state || ""}
                        onChange={(e) =>
                          handleFormChange("state", e.target.value)
                        }
                        placeholder="Enter state"
                        className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        License Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        size="middle"
                        value={formData.licenseNumber || ""}
                        onChange={(e) =>
                          handleFormChange("licenseNumber", e.target.value)
                        }
                        placeholder="Enter driving license number"
                        className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        License Issue Date{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        size="middle"
                        type="date"
                        value={formData.licenseIssueDate || ""}
                        onChange={(e) =>
                          handleFormChange("licenseIssueDate", e.target.value)
                        }
                        className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        License Valid Up To{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        size="middle"
                        type="date"
                        value={formData.licenseValidUpto || ""}
                        onChange={(e) =>
                          handleFormChange("licenseValidUpto", e.target.value)
                        }
                        className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Complete Address <span className="text-red-500">*</span>
                      </label>
                      <TextArea
                        size="middle"
                        value={formData.address}
                        onChange={(e) =>
                          handleFormChange("address", e.target.value)
                        }
                        rows={2}
                        placeholder="Enter your complete address with pincode"
                        className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Vehicle Details Section */}
                <div className="border-b border-slate-200 p-6">
                  <h3 className="text-xl font-bold text-navy-800 mb-4 flex items-center">
                    <span className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      2
                    </span>
                    Vehicle Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Vehicle Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.vehicleType || ""}
                        onChange={(e) =>
                          handleFormChange("vehicleType", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                      >
                        <option value="">Select Vehicle Type</option>
                        <option value="car">Car</option>
                        <option value="bike">Motorcycle/Scooter</option>
                        <option value="truck">Truck</option>
                        <option value="bus">Bus</option>
                        <option value="auto">Auto Rickshaw</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Registration Number{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        size="middle"
                        value={formData.registrationNumber || ""}
                        onChange={(e) =>
                          handleFormChange("registrationNumber", e.target.value)
                        }
                        placeholder="MH 01 AB 1234"
                        className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Engine Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        size="middle"
                        value={formData.engineNumber || ""}
                        onChange={(e) =>
                          handleFormChange("engineNumber", e.target.value)
                        }
                        placeholder="Enter engine number"
                        className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Chassis Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        size="middle"
                        value={formData.chassisNo || ""}
                        onChange={(e) =>
                          handleFormChange("chassisNo", e.target.value)
                        }
                        placeholder="Enter chassis number"
                        className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Registration Date{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        size="middle"
                        type="date"
                        value={formData.registrationDate || ""}
                        onChange={(e) =>
                          handleFormChange("registrationDate", e.target.value)
                        }
                        className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Vehicle Color
                      </label>
                      <Input
                        size="middle"
                        value={formData.color || ""}
                        onChange={(e) =>
                          handleFormChange("color", e.target.value)
                        }
                        placeholder="Enter vehicle color"
                        className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Insurance Details Section */}
                <div className="border-b border-slate-200 p-6">
                  <h3 className="text-xl font-bold text-navy-800 mb-4 flex items-center">
                    <span className="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      3
                    </span>
                    Insurance Coverage Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Insurance Period <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.insurancePeriod || ""}
                        onChange={(e) =>
                          handleFormChange("insurancePeriod", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                      >
                        <option value="">Select Insurance Period</option>
                        <option value="monthly">Monthly (1 Month)</option>
                        <option value="quarterly">Quarterly (3 Months)</option>
                        <option value="half-yearly">
                          Half Yearly (6 Months)
                        </option>
                        <option value="yearly">Full Year (12 Months)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Policy Number
                      </label>
                      <Input
                        size="middle"
                        value={`MI-${formData.policyNumber || Math.floor(10000 + Math.random() * 90000)}`}
                        disabled
                        className="rounded-lg border border-slate-300 bg-slate-50 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-navy-800 mb-4 flex items-center">
                    <span className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      4
                    </span>
                    Terms & Conditions
                  </h3>
                  <div className="bg-slate-50 rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
                    <div className="text-sm text-slate-700 space-y-2">
                      <p>
                        <strong>1. Policy Coverage:</strong> This motor
                        insurance policy covers third-party liability, own
                        damage, and personal accident as per IRDAI guidelines.
                      </p>
                      <p>
                        <strong>2. Premium Payment:</strong> Premium must be
                        paid in full before policy activation. No coverage will
                        be provided until payment is confirmed.
                      </p>
                      <p>
                        <strong>3. Claim Process:</strong> All claims must be
                        reported within 24 hours of the incident. Required
                        documents must be submitted within 7 days.
                      </p>
                      <p>
                        <strong>4. Policy Validity:</strong> Policy is valid
                        only for the selected period and registered vehicle
                        mentioned in the application.
                      </p>
                      <p>
                        <strong>5. Exclusions:</strong> Damage due to war,
                        nuclear risks, driving under influence, and unlicensed
                        driving are not covered.
                      </p>
                      <p>
                        <strong>6. Renewal:</strong> Policy can be renewed
                        before expiry date. Late renewal may attract additional
                        charges.
                      </p>
                      <p>
                        <strong>7. Cancellation:</strong> Policy can be
                        cancelled as per IRDAI guidelines with applicable refund
                        terms.
                      </p>
                      <p>
                        <strong>8. Dispute Resolution:</strong> Any disputes
                        will be subject to jurisdiction of courts in Mumbai,
                        Maharashtra.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="termsAccepted"
                      checked={formData.termsAccepted || true}
                      onChange={(e) =>
                        handleFormChange(
                          "termsAccepted",
                          e.target.checked.toString(),
                        )
                      }
                      className="mt-1 w-4 h-4 text-navy-600 border-slate-300 rounded focus:ring-navy-500"
                    />
                    <label
                      htmlFor="termsAccepted"
                      className="text-sm text-slate-700"
                    >
                      <span className="text-red-500">*</span> I have read and
                      agree to the above terms and conditions. I declare that
                      all information provided is true and accurate to the best
                      of my knowledge.
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        if (applicationSubmitted) {
          return (
            <div className="step-content text-center py-16">
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-3 border-emerald-300 rounded-3xl p-16 shadow-2xl">
                  <CheckCircleOutlined className="text-9xl text-emerald-500 mb-8" />
                  <h2 className="text-5xl font-bold text-emerald-800 mb-6">
                    Application Submitted Successfully!
                  </h2>
                  <p className="text-2xl text-slate-700 mb-4">
                    Your insurance application has been received and is under
                    review.
                  </p>
                  <p className="text-xl text-slate-600 mb-10">
                    Our team will contact you within 24-48 hours.
                  </p>
                  <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                      <div>
                        <p className="text-sm text-slate-500 mb-2 font-medium">
                          Application ID
                        </p>
                        <p className="font-mono text-xl font-bold text-navy-700">
                          INS-{Date.now()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-2 font-medium">
                          Policy Type
                        </p>
                        <p className="text-xl font-bold text-navy-800">
                          {insuranceSubType.charAt(0).toUpperCase() +
                            insuranceSubType.slice(1)}{" "}
                          Insurance
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-2 font-medium">
                          Submitted On
                        </p>
                        <p className="text-xl font-bold text-navy-800">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-2 font-medium">
                          Status
                        </p>
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-base font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          Under Review
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="step-content px-4 py-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-purple-700 mb-2">
                Final Review
              </h2>
              <p className="text-slate-600 text-base">
                Please review all information before submitting your application
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-slate-500 mb-1 font-medium">
                        Full Name
                      </p>
                      <p className="font-medium text-navy-800 text-lg">
                        {formData.fullName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1 font-medium">
                        Email
                      </p>
                      <p className="font-medium text-navy-800 text-lg">
                        {formData.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1 font-medium">
                        Phone
                      </p>
                      <p className="font-medium text-navy-800 text-lg">
                        {formData.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1 font-medium">
                        Insurance Type
                      </p>
                      <p className="font-medium text-navy-800 text-lg">
                        {insuranceSubType.charAt(0).toUpperCase() +
                          insuranceSubType.slice(1)}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-slate-500 mb-1 font-medium">
                        Address
                      </p>
                      <p className="font-medium text-navy-800 text-lg">
                        {formData.address}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-slate-500 mb-1 font-medium">
                        Documents Uploaded
                      </p>
                      <p className="font-medium text-navy-800 text-lg">
                        {fileList.length} files
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-gradient-to-r from-blue-50 to-slate-50 border-l-4 border-navy-600 rounded-lg p-4">
                  <p className="text-slate-700 text-sm">
                    By submitting this application, you confirm that all
                    information provided is accurate and complete.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-4 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-navy-800 mb-2">
            Welcome ICICOXY Insurance
          </h1>
          <p className="text-teal-700 text-lg font-medium">
            Your Trusted Insurance Partner
          </p>
          <div className="w-16 h-1 bg-teal-500 mx-auto mt-2 rounded-full"></div>
        </div>

        {/* Steps Progress */}
        <div className="mb-6 bg-white rounded-2xl shadow-lg p-6">
          <Steps current={currentStep} className="px-2">
            {steps.map((step, index) => (
              <Step
                key={index}
                title={
                  <span className="text-sm font-bold text-navy-700">
                    {step.title}
                  </span>
                }
                description={
                  <span className="text-xs text-slate-500 hidden lg:block">
                    {step.description}
                  </span>
                }
              />
            ))}
          </Steps>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 min-h-[400px]">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        {!applicationSubmitted && (
          <div className="flex justify-between max-w-3xl mx-auto">
            <Button
              size="large"
              onClick={handlePrevious}
              disabled={currentStep === 0 || loading}
              className="px-6 py-2 rounded-xl font-bold text-base h-auto border-2 border-black text-navy-600 hover:border-teal-500 hover:text-teal-700 hover:bg-teal-50 transition-all duration-300"
            >
              ← Previous
            </Button>
            <Button
              type="primary"
              size="small"
              onClick={handleNext}
              loading={loading}
              className="px-6 py-2 rounded-xl font-bold text-base h-auto bg-navy-600 hover:bg-navy-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {currentStep === 6 ? "Submit Application" : "Next →"}
            </Button>
          </div>
        )}

        {/* Confirmation Modal */}
        <Modal
          title={
            <span className="text-xl font-bold text-navy-700">
              Confirm Document Upload
            </span>
          }
          open={confirmationModal}
          onOk={handleConfirmDocuments}
          onCancel={() => setConfirmationModal(false)}
          okText="Confirm & Submit"
          cancelText="Cancel"
          okButtonProps={{
            className:
              "bg-navy-600 hover:bg-navy-700 px-6 py-3 h-auto rounded-xl text-base font-bold border-0 shadow-lg",
          }}
          cancelButtonProps={{
            className:
              "px-6 py-3 h-auto rounded-xl text-base font-bold border-2 border-black hover:border-teal-500",
          }}
          width={500}
          className="custom-modal"
        >
          <div className="py-4">
            <p className="text-base mb-4 text-slate-700">
              Please confirm that you want to submit these documents for
              processing.
            </p>
            <div className="bg-gradient-to-br from-slate-50 to-teal-50 rounded-xl p-4 border border-black">
              <p className="font-bold text-navy-700 mb-3 text-base">
                Documents to Upload:
              </p>
              <ul className="space-y-2">
                {fileList.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center text-slate-700 bg-white rounded-lg p-2 shadow-sm border border-black"
                  >
                    <FileTextOutlined className="mr-2 text-teal-600 text-base" />
                    <span className="font-medium text-sm">{file.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Modal>

        {/* Image Preview Modal */}
        <Modal
          open={previewVisible}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
          width="90%"
          style={{ maxWidth: "1200px" }}
          centered
          className="image-preview-modal"
        >
          <div className="p-6">
            <img
              alt="Document Preview"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
              src={previewImage}
              className="rounded-2xl"
            />
          </div>
        </Modal>
      </div>

      <style>{`
        .text-navy-800 { color: #1e293b; }
        .text-navy-700 { color: #334155; }
        .text-navy-600 { color: #475569; }
        .text-teal-700 { color: #0f766e; }
        .text-teal-600 { color: #0d9488; }
        .text-teal-500 { color: #14b8a6; }
        .bg-navy-600 { background-color: #475569; }
        .bg-navy-700 { background-color: #334155; }
        .bg-navy-100 { background-color: #f1f5f9; }
        .bg-navy-50 { background-color: #f8fafc; }
        .bg-teal-500 { background-color: #14b8a6; }
        .bg-teal-50 { background-color: #f0fdfa; }
        .border-teal-500 { border-color: #14b8a6; }
        .border-black { border-color: #000000; }
        .text-navy-900 { color: #0f172a; }
        .text-navy-500 { color: #64748b; }
        .border-navy-300 { border-color: #cbd5e1; }
        .border-navy-400 { border-color: #94a3b8; }
        .border-navy-500 { border-color: #64748b; }
        .border-navy-600 { border-color: #475569; }
        .border-l-6 { border-left-width: 6px; }
        .border-3 { border-width: 3px; }
        
        .image-preview-modal .ant-modal-content {
          border-radius: 20px !important;
          overflow: hidden !important;
        }

        .ant-steps-item-process .ant-steps-item-icon {
          background-color: #475569 !important;
          border-color: #475569 !important;
        }

        .ant-steps-item-finish .ant-steps-item-icon {
          border-color: #14b8a6 !important;
        }

        .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon {
          color: #14b8a6 !important;
        }

        .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-tail::after {
          background-color: #14b8a6 !important;
        }

        .ant-modal-header {
          border-radius: 20px 20px 0 0 !important;
        }

        .ant-btn-primary {
          background: linear-gradient(135deg, #475569 0%, #334155 100%) !important;
          border: none !important;
          box-shadow: 0 10px 25px rgba(71, 85, 105, 0.3) !important;
        }

        .ant-btn-primary:hover {
          background: linear-gradient(135deg, #334155 0%, #1e293b 100%) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 15px 35px rgba(71, 85, 105, 0.4) !important;
        }

        .aspect-square {
          aspect-ratio: 1 / 1;
        }
      `}</style>
    </div>
  );
};

export default DataReading;
