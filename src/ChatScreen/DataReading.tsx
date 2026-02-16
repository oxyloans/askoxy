import React, { useState } from "react";
import {
  Upload,
  Button,
  Modal,
  notification,
  Spin,
  Card,
  Steps,
  Image,
  Input,
  Form,
} from "antd";

import {
  UploadOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  FileTextOutlined,
  MailOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  CloseCircleOutlined,
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
  priorityTask: string;
  dateOfBirth: string;
  policyNumber?: string;
  vehicleNumber?: string;
  travelDestination?: string;
  businessName?: string;
  aadharNumber?: string;
  panNumber?: string;
  fatherName?: string;
  gender?: string;
  vehicleType?: string;
  state?: string;
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

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [extractedTextModal, setExtractedTextModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    priorityTask: "",
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
      // Add validation before processing
      if (fileList.length === 0) {
        notification.error({
          message: "No Documents Available",
          description:
            "Please go back and upload at least one document before proceeding to form filling.",
          placement: "topRight",
          duration: 5,
        });
        return;
      }

      setLoading(true);
      const taskId = "741d320a-aa83-4a6a-8358-6fdf6cf070c5";
      setCurrentStep(4);
      await uploadFileToTask(taskId);
      setLoading(false);
    } else if (currentStep === 4) {
      // Common required fields
      const commonFieldsValid =
        formData.fullName &&
        formData.dateOfBirth &&
        formData.phone &&
        formData.email &&
        formData.address &&
        formData.insurancePeriod &&
        formData.termsAccepted;

      // Motor-specific validation
      if (insuranceSubType === "motor") {
        if (
          !commonFieldsValid ||
          !formData.fatherName ||
          !formData.gender ||
          !formData.aadharNumber ||
          !formData.panNumber ||
          !formData.state ||
          !formData.licenseNumber ||
          !formData.licenseIssueDate ||
          !formData.licenseValidUpto ||
          !formData.vehicleType ||
          !formData.registrationNumber ||
          !formData.engineNumber ||
          !formData.chassisNo ||
          !formData.registrationDate
        ) {
          notification.warning({
            message: "Required Fields Missing",
            description:
              "Please fill in all required fields for motor insurance.",
            placement: "topRight",
          });
          return;
        }
      }

      // Travel-specific validation
      else if (insuranceSubType === "travel") {
        if (
          !commonFieldsValid ||
          !formData.panNumber ||
          !formData.travelDestination
          // Add other travel-specific required fields
        ) {
          notification.warning({
            message: "Required Fields Missing",
            description:
              "Please fill in all required fields for travel insurance.",
            placement: "topRight",
          });
          return;
        }
      }

      // Commercial-specific validation
      else if (insuranceSubType === "commercial") {
        if (
          !commonFieldsValid ||
          !formData.businessName ||
          !formData.panNumber
          // Add other commercial-specific required fields
        ) {
          notification.warning({
            message: "Required Fields Missing",
            description:
              "Please fill in all required fields for commercial insurance.",
            placement: "topRight",
          });
          return;
        }
      }

      setCurrentStep(5);
    } else if (currentStep === 5) {
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

          // Generate random policy number
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

      console.log("Sending to group-by-person API:", payload);

      const response = await axios.post(
        `${BASE_URL}/user-service/write/group-by-person`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data && response.data.length > 0) {
        console.log("Grouped response:", response.data);

        const firstGroup = response.data[0];
        const extractedText = firstGroup.documents?.[0]?.extractAiText || "";

        const parseField = (
          text: string,
          variations: string[],
          isAddress = false,
        ) => {
          for (const field of variations) {
            let regex;
            if (isAddress) {
              regex = new RegExp(
                `${field}:\\s*([^,]+(?:,\\s*[^,]+){0,5})(?=\\s*,(?:From Document|Name:|Date of Birth:|Gender:|Mobile Number:|Phone Number:|Email:|PAN|Aadhaar|License|Vehicle|Registration|Engine|Chassis|State:|Color:|Issue Date:|Valid Till:)|$)`,
                "i",
              );
            } else {
              regex = new RegExp(`${field}:\\s*([^,]+)`, "i");
            }
            const match = text.match(regex);
            if (match) return match[1].trim();
          }
          return "";
        };

        const convertDate = (dateStr: string) => {
          if (!dateStr) return "";
          const parts = dateStr.split("/");
          if (parts.length === 3) {
            const day = parts[0].padStart(2, "0");
            const month = parts[1].padStart(2, "0");
            const year = parts[2];
            return `${year}-${month}-${day}`;
          }
          return dateStr;
        };

        const mapVehicleType = (type: string) => {
          const typeMap: { [key: string]: string } = {
            motorcycle: "bike",
            scooter: "bike",
            bike: "bike",
          };
          return typeMap[type.toLowerCase()] || type.toLowerCase();
        };

        setFormData((prev) => ({
          ...prev,
          fullName: parseField(extractedText, ["Name"]),
          fatherName: parseField(extractedText, [
            "Father's Name",
            "Father Name",
            "FatherName",
          ]),
          dateOfBirth: convertDate(
            parseField(extractedText, ["Date of Birth", "DOB"]),
          ),
          gender: parseField(extractedText, ["Gender"]).toLowerCase(),
          phone: parseField(extractedText, [
            "Phone Number",
            "Phone No",
            "Mobile Number",
            "Mobile No",
          ]),
          email: parseField(extractedText, ["email", "email Address"]),
          aadharNumber: parseField(extractedText, [
            "Aadhaar Number",
            "Aadhar Card Number",
            "Aadhar Number",
            "Aadhaar No",
            "Aadhar No",
          ]),
          panNumber: parseField(extractedText, ["PAN Number", "PAN No", "PAN"]),
          address: parseField(
            extractedText,
            ["Address Detailed", "Address"],
            true,
          ),
          priorityTask: parseField(
            extractedText,
            ["priorityTask", "priority Task", "priority Text", "priority"],
            true,
          ),
          state: parseField(extractedText, ["State"]),
          vehicleType: mapVehicleType(
            parseField(extractedText, ["Vehicle Type"]),
          ),
          registrationNumber: parseField(extractedText, [
            "Registration Number",
            "Registration No",
            "Registration NO",
          ]),
          engineNumber: parseField(extractedText, [
            "Engine Number",
            "Engine No",
            "Engine NO",
          ]),
          chassisNo: parseField(extractedText, [
            "Chassis Number",
            "Chassis No",
            "Chassis NO",
          ]),
          registrationDate: convertDate(
            parseField(extractedText, ["Registration Date"]),
          ),
          color: parseField(extractedText, [
            "Color",
            "Colour",
            "Color of Vehicle",
            "Vehicle Color",
          ]),
          licenseNumber: parseField(extractedText, [
            "License Number",
            "License No",
            "Licence Number",
            "Licence No",
          ]),
          licenseIssueDate: convertDate(
            parseField(extractedText, ["Issue Date", "Issued Date"]),
          ),
          licenseValidUpto: convertDate(
            parseField(extractedText, [
              "License Valid Till",
              "Valid Till",
              "Valid Upto",
              "License Validity",
            ]),
          ),
        }));

        notification.success({
          message: "Data Extracted Successfully",
          description: `Information extracted from ${extractedData.length} document(s) and auto-filled in the form.`,
          placement: "topRight",
          duration: 4,
        });
      }
    } catch (error) {
      console.error("Error calling group-by-person API:", error);
      notification.error({
        message: "Data Processing Failed",
        description:
          "Could not process document data. Please fill the form manually.",
        placement: "topRight",
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
                bodyStyle={{ padding: "20px 16px" }}
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
                bodyStyle={{ padding: "20px 16px" }}
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
                  bodyStyle={{ padding: "16px 12px" }}
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
                  bodyStyle={{ padding: "16px 12px" }}
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
                  bodyStyle={{ padding: "16px 12px" }}
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
                  {insuranceSubType === "motor" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-gold-600 mr-2 text-sm font-bold">
                          •
                        </span>
                        <span className="text-sm">
                          Vehicle Registration Certificate
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gold-600 mr-2 text-sm font-bold">
                          •
                        </span>
                        <span className="text-sm">
                          Government-issued ID (Driver's License)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gold-600 mr-2 text-sm font-bold">
                          •
                        </span>
                        <span className="text-sm">Aadhar & PAN Card</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gold-600 mr-2 text-sm font-bold">
                          •
                        </span>
                        <span className="text-sm">Address Proof</span>
                      </li>
                    </>
                  )}

                  {insuranceSubType === "travel" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-gold-600 mr-2 text-sm font-bold">
                          •
                        </span>
                        <span className="text-sm">Passport Copy</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gold-600 mr-2 text-sm font-bold">
                          •
                        </span>
                        <span className="text-sm">
                          Government-issued ID (Aadhar/Driver's License)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gold-600 mr-2 text-sm font-bold">
                          •
                        </span>
                        <span className="text-sm">PAN Card</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gold-600 mr-2 text-sm font-bold">
                          •
                        </span>
                        <span className="text-sm">Address Proof</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gold-600 mr-2 text-sm font-bold">
                          •
                        </span>
                        <span className="text-sm">
                          Travel Itinerary/Booking Confirmation
                        </span>
                      </li>
                    </>
                  )}

                  {insuranceSubType === "commercial" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-gold-600 mr-2 text-sm font-bold">
                          •
                        </span>
                        <span className="text-sm">
                          Business Registration Documents
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gold-600 mr-2 text-sm font-bold">
                          •
                        </span>
                        <span className="text-sm">
                          GST Registration Certificate
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gold-600 mr-2 text-sm font-bold">
                          •
                        </span>
                        <span className="text-sm">
                          Government-issued ID of Business Owner
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gold-600 mr-2 text-sm font-bold">
                          •
                        </span>
                        <span className="text-sm">
                          PAN Card (Business & Owner)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gold-600 mr-2 text-sm font-bold">
                          •
                        </span>
                        <span className="text-sm">
                          Address Proof (Business Premises)
                        </span>
                      </li>
                    </>
                  )}
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
                  All Documents ({fileList.length})
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {fileList.map((file, index) => (
                    <div
                      key={index}
                      className="relative border border-slate-200 rounded-lg bg-white 
      hover:border-navy-400 hover:shadow-md 
      transition-all duration-200 group"
                    >
                      {/* Delete Button */}
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering preview
                          handleRemoveFile(file);
                        }}
                        className="absolute top-2 right-2 z-10 bg-white/90 shadow-md hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      />

                      {/* Clickable Preview Area */}
                      <div
                        onClick={() => handlePreview(file)}
                        className="cursor-pointer"
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
                  {insuranceSubType === "motor" &&
                    "🚗 MOTOR INSURANCE APPLICATION FORM"}
                  {insuranceSubType === "travel" &&
                    "✈️ TRAVEL INSURANCE APPLICATION FORM"}
                  {insuranceSubType === "commercial" &&
                    "🏭 COMMERCIAL INSURANCE APPLICATION FORM"}
                </h1>
                <p className="text-lg opacity-90">
                  BMVOXY Insurance Company Ltd.
                </p>
                <div className="mt-3 bg-white/20 rounded-lg px-4 py-2 inline-block">
                  <span className="text-sm font-medium">
                    Policy No: {insuranceSubType === "motor" && "MI-"}
                    {insuranceSubType === "travel" && "TI-"}
                    {insuranceSubType === "commercial" && "CI-"}
                    {formData.policyNumber ||
                      Math.floor(10000 + Math.random() * 90000)}
                  </span>
                </div>
              </div>
            </div>

            {loading && (
              <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-center">
                  <Spin
                    indicator={
                      <LoadingOutlined
                        style={{ fontSize: 24, color: "#475569" }}
                        spin
                      />
                    }
                  />
                  <span className="ml-3 text-lg font-semibold text-navy-700">
                    Analyzing documents to verify details…
                  </span>
                </div>
              </div>
            )}

            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200">
                {/* MOTOR INSURANCE FORM */}
                {insuranceSubType === "motor" && (
                  <>
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
                            Father's Name{" "}
                            <span className="text-red-500">*</span>
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
                            Date of Birth{" "}
                            <span className="text-red-500">*</span>
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
                            aria-label="gender"
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
                            Email Address{" "}
                            <span className="text-red-500">*</span>
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
                            Aadhar Number{" "}
                            <span className="text-red-500">*</span>
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
                            License Number{" "}
                            <span className="text-red-500">*</span>
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
                              handleFormChange(
                                "licenseIssueDate",
                                e.target.value,
                              )
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
                              handleFormChange(
                                "licenseValidUpto",
                                e.target.value,
                              )
                            }
                            className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label className="block text-sm font-medium text-navy-700 mb-2">
                            Complete Address{" "}
                            <span className="text-red-500">*</span>
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
                            aria-label="vehicle Type"
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
                              handleFormChange(
                                "registrationNumber",
                                e.target.value,
                              )
                            }
                            placeholder="MH 01 AB 1234"
                            className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy-700 mb-2">
                            Engine Number{" "}
                            <span className="text-red-500">*</span>
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
                            Chassis Number{" "}
                            <span className="text-red-500">*</span>
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
                              handleFormChange(
                                "registrationDate",
                                e.target.value,
                              )
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
                  </>
                )}

                {/* TRAVEL INSURANCE FORM */}
                {insuranceSubType === "travel" && (
                  <>
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
                            Date of Birth{" "}
                            <span className="text-red-500">*</span>
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
                            Email Address{" "}
                            <span className="text-red-500">*</span>
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
                        <div className="md:col-span-3">
                          <label className="block text-sm font-medium text-navy-700 mb-2">
                            Complete Address{" "}
                            <span className="text-red-500">*</span>
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

                    {/* Travel Details Section */}
                    <div className="border-b border-slate-200 p-6">
                      <h3 className="text-xl font-bold text-navy-800 mb-4 flex items-center">
                        <span className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                          2
                        </span>
                        Travel Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-navy-700 mb-2">
                            Travel Destination{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Input
                            size="middle"
                            value={formData.travelDestination || ""}
                            onChange={(e) =>
                              handleFormChange(
                                "travelDestination",
                                e.target.value,
                              )
                            }
                            placeholder="Enter destination country/countries"
                            className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy-700 mb-2">
                            Trip Duration
                          </label>
                          <Input
                            size="middle"
                            placeholder="e.g., 7 days, 2 weeks"
                            className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* COMMERCIAL INSURANCE FORM */}
                {insuranceSubType === "commercial" && (
                  <>
                    {/* Business Details Section */}
                    <div className="border-b border-slate-200 p-6">
                      <h3 className="text-xl font-bold text-navy-800 mb-4 flex items-center">
                        <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                          1
                        </span>
                        Business Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-navy-700 mb-2">
                            Business Name{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Input
                            size="middle"
                            value={formData.businessName || ""}
                            onChange={(e) =>
                              handleFormChange("businessName", e.target.value)
                            }
                            placeholder="Enter registered business name"
                            className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy-700 mb-2">
                            Business PAN <span className="text-red-500">*</span>
                          </label>
                          <Input
                            size="middle"
                            value={formData.panNumber || ""}
                            onChange={(e) =>
                              handleFormChange("panNumber", e.target.value)
                            }
                            placeholder="Business PAN Number"
                            className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy-700 mb-2">
                            Business Type
                          </label>
                          <select className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-navy-500 text-sm" 
                          aria-label="Business Type">
                            <option value="">Select Business Type</option>
                            <option value="retail">Retail</option>
                            <option value="manufacturing">Manufacturing</option>
                            <option value="services">Services</option>
                            <option value="wholesale">Wholesale</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="md:col-span-3">
                          <label className="block text-sm font-medium text-navy-700 mb-2">
                            Business Address{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <TextArea
                            size="middle"
                            value={formData.address}
                            onChange={(e) =>
                              handleFormChange("address", e.target.value)
                            }
                            rows={2}
                            placeholder="Enter business premises address"
                            className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Owner Details Section */}
                    <div className="border-b border-slate-200 p-6">
                      <h3 className="text-xl font-bold text-navy-800 mb-4 flex items-center">
                        <span className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                          2
                        </span>
                        Business Owner Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-navy-700 mb-2">
                            Owner Name <span className="text-red-500">*</span>
                          </label>
                          <Input
                            size="middle"
                            value={formData.fullName}
                            onChange={(e) =>
                              handleFormChange("fullName", e.target.value)
                            }
                            placeholder="Enter owner's full name"
                            className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy-700 mb-2">
                            Date of Birth{" "}
                            <span className="text-red-500">*</span>
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
                            Email Address{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Input
                            size="middle"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              handleFormChange("email", e.target.value)
                            }
                            placeholder="owner.email@example.com"
                            className="rounded-lg border border-slate-300 focus:border-navy-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Insurance Coverage Details - Common for all */}
                <div className="border-b border-slate-200 p-6">
                  <h3 className="text-xl font-bold text-navy-800 mb-4 flex items-center">
                    <span className="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      {insuranceSubType === "motor"
                        ? "3"
                        : insuranceSubType === "travel"
                          ? "3"
                          : "3"}
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
                        aria-label="Insurance Period"
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
                        value={`${insuranceSubType === "motor" ? "MI" : insuranceSubType === "travel" ? "TI" : "CI"}-${formData.policyNumber || Math.floor(10000 + Math.random() * 90000)}`}
                        disabled
                        className="rounded-lg border border-slate-300 bg-slate-50 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions - Common for all */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-navy-800 mb-4 flex items-center">
                    <span className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      {insuranceSubType === "motor" ? "4" : "4"}
                    </span>
                    Terms & Conditions
                  </h3>
                  <div className="bg-slate-50 rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
                    <div className="text-sm text-slate-700 space-y-2">
                      <p>
                        <strong>1. Policy Coverage:</strong> This{" "}
                        {insuranceSubType} insurance policy covers as per IRDAI
                        guidelines and terms mentioned in the policy document.
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
                        only for the selected period mentioned in the
                        application.
                      </p>
                      <p>
                        <strong>5. Renewal:</strong> Policy can be renewed
                        before expiry date. Late renewal may attract additional
                        charges.
                      </p>
                      <p>
                        <strong>6. Cancellation:</strong> Policy can be
                        cancelled as per IRDAI guidelines with applicable refund
                        terms.
                      </p>
                      <p>
                        <strong>7. Dispute Resolution:</strong> Any disputes
                        will be subject to jurisdiction of courts in Mumbai,
                        Maharashtra.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="termsAccepted"
                      checked={formData.termsAccepted || false}
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

            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-4">
                    <h3 className="text-lg font-bold text-navy-800 mb-3">
                      Personal Details
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-1 font-medium">
                          Full Name
                        </p>
                        <p className="font-medium text-navy-800">
                          {formData.fullName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1 font-medium">
                          Father's Name
                        </p>
                        <p className="font-medium text-navy-800">
                          {formData.fatherName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1 font-medium">
                          Date of Birth
                        </p>
                        <p className="font-medium text-navy-800">
                          {formData.dateOfBirth}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1 font-medium">
                          Gender
                        </p>
                        <p className="font-medium text-navy-800">
                          {formData.gender
                            ? formData.gender.charAt(0).toUpperCase() +
                              formData.gender.slice(1)
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1 font-medium">
                          Phone
                        </p>
                        <p className="font-medium text-navy-800">
                          {formData.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1 font-medium">
                          Email
                        </p>
                        <p className="font-medium text-navy-800">
                          {formData.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1 font-medium">
                          Aadhar Number
                        </p>
                        <p className="font-medium text-navy-800">
                          {formData.aadharNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1 font-medium">
                          PAN Number
                        </p>
                        <p className="font-medium text-navy-800">
                          {formData.panNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1 font-medium">
                          State
                        </p>
                        <p className="font-medium text-navy-800">
                          {formData.state}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1 font-medium">
                          License Number
                        </p>
                        <p className="font-medium text-navy-800">
                          {formData.licenseNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1 font-medium">
                          License Issue Date
                        </p>
                        <p className="font-medium text-navy-800">
                          {formData.licenseIssueDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1 font-medium">
                          License Valid Till
                        </p>
                        <p className="font-medium text-navy-800">
                          {formData.licenseValidUpto}
                        </p>
                      </div>
                      <div className="col-span-2 md:col-span-3">
                        <p className="text-sm text-slate-500 mb-1 font-medium">
                          Address
                        </p>
                        <p className="font-medium text-navy-800">
                          {formData.address}
                        </p>
                      </div>
                      {formData.priorityTask && (
                        <div className="col-span-2 md:col-span-3">
                          <p className="text-sm text-slate-500 mb-1 font-medium">
                            Priority Task
                          </p>
                          <p className="font-medium text-navy-800">
                            {formData.priorityTask}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-b border-slate-200 pb-4">
                    <h3 className="text-lg font-bold text-navy-800 mb-3">
                      Vehicle Details
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-1 font-medium">
                          Vehicle Type
                        </p>
                        <p className="font-medium text-navy-800">
                          {formData.vehicleType
                            ? formData.vehicleType.charAt(0).toUpperCase() +
                              formData.vehicleType.slice(1)
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1 font-medium">
                          Registration Number
                        </p>
                        <p className="font-medium text-navy-800">
                          {formData.registrationNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1 font-medium">
                          Engine Number
                        </p>
                        <p className="font-medium text-navy-800">
                          {formData.engineNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1 font-medium">
                          Chassis Number
                        </p>
                        <p className="font-medium text-navy-800">
                          {formData.chassisNo}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1 font-medium">
                          Registration Date
                        </p>
                        <p className="font-medium text-navy-800">
                          {formData.registrationDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1 font-medium">
                          Vehicle Color
                        </p>
                        <p className="font-medium text-navy-800">
                          {formData.color || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-slate-200 pb-4">
                    <h3 className="text-lg font-bold text-navy-800 mb-3">
                      Insurance Details
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-1 font-medium">
                          Insurance Type
                        </p>
                        <p className="font-medium text-navy-800">
                          {insuranceSubType.charAt(0).toUpperCase() +
                            insuranceSubType.slice(1)}{" "}
                          Insurance
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1 font-medium">
                          Insurance Period
                        </p>
                        <p className="font-medium text-navy-800">
                          {formData.insurancePeriod
                            ? formData.insurancePeriod.charAt(0).toUpperCase() +
                              formData.insurancePeriod.slice(1)
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1 font-medium">
                          Policy Number
                        </p>
                        <p className="font-medium text-navy-800">
                          MI-{formData.policyNumber}
                        </p>
                      </div>
                      <div className="col-span-2 md:col-span-3">
                        <p className="text-sm text-slate-500 mb-1 font-medium">
                          Documents Uploaded
                        </p>
                        <p className="font-medium text-navy-800">
                          {fileList.length} files
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-navy-800 mb-3">
                      Terms & Conditions
                    </h3>
                    <div className="flex items-center">
                      <CheckCircleOutlined className="text-green-500 text-xl mr-2" />
                      <p className="font-medium text-navy-800">
                        Terms and conditions accepted
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
            Welcome OXY Insurance
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
        )}``

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
