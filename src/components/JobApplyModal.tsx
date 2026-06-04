import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Input, Button, message, Form, Spin, Steps } from "antd";
import { CheckCircleOutlined, FileDoneOutlined } from "@ant-design/icons";
import axios from "axios";
import BASE_URL from "../Config";

type Props = {
  open: boolean;
  onClose: () => void;
  jobDesignation: string;
  companyName: string;
  userId: string;
  jobId: string;
};

const JobApplicationModal: React.FC<Props> = ({
  open,
  onClose,
  jobDesignation,
  companyName,
  userId,
  jobId,
}) => {


  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loadingAts, setLoadingAts] = useState(false);
  const [atsReady, setAtsReady] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [statusText, setStatusText] = useState<string>("");

  const token = localStorage.getItem("token");
  const onlyLettersAndSpaces = /^[A-Za-z\s]+$/;
  const onlyNumbers = /^\d+$/;

  const resetAll = () => {
    form.resetFields();
    setLoadingAts(false);
    setAtsReady(false);
    setCurrentStep(-1);
    setStatusText("");
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const sessionResumeUrl = sessionStorage.getItem("resumeUrl");

      if (!sessionResumeUrl) {
        message.error("No resume found in session. Please upload your resume first.");
        return;
      }

      // Run ATS check using session resume before submitting
      setCurrentStep(0);
      setStatusText("Fetching your resume...");
      setLoadingAts(true);
      setCurrentStep(1);
      setStatusText("Analyzing your resume against the job requirements...");

      // try {
      //   const atsRes = await axios.get(
      //     `${BASE_URL}/marketing-service/campgin/ats-score-checker?jobId=${jobId}&ResumeUrl=${encodeURIComponent(sessionResumeUrl)}&type=ATS`
      //   );

      //   const isEligible = atsRes.data?.status === true;

      //   setAtsReady(true);
      //   setCurrentStep(2);

      //   if (isEligible) {
      //     setStatusText("You're eligible! Redirecting to your report...");
      //     message.success("Analysis complete! You are eligible for the exam.");
      //   } else {
      //     setStatusText("Not eligible. Redirecting to view skill gaps...");
      //     message.warning(
      //       atsRes.data?.message || "You are not eligible for the exam. Review your gaps below."
      //     );
      //   }

      //   await new Promise((resolve) => setTimeout(resolve, 2000));

      //   navigate("/job-analysis-result", {
      //     state: {
      //       atsData: atsRes.data,
      //       jobId,
      //       jobDesignation,
      //       companyName,
      //     },
      //   });
      // } catch {
      //   message.error("Failed to analyze resume. Please try again.");
      //   setCurrentStep(-1);
      //   setStatusText("");
      //   return;
      // } finally {
      //   setLoadingAts(false);
      // }

      const payload = {
        ...values,
        applicationStatus: "applied",
        resumeUrl: sessionResumeUrl,
        // jobDesignation,
        // companyName,
        userId,
        jobId,
      };

      await axios.post(
        `${BASE_URL}/marketing-service/campgin/userapplyjob`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      message.success("Application submitted successfully!");
      resetAll();
      onClose();
      navigate("/main/appliedjobs");
      sessionStorage.removeItem("resumeUrl");
    } catch (err: any) {
      if (err?.errorFields?.length) {
        message.error("Please correct the highlighted fields before submitting.");
        return;
      }
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Something went wrong while submitting the application.";
      message.error(errorMessage);
    }
  };

  const isProcessing = loadingAts;

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 py-1">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
          >
            <FileDoneOutlined />
          </div>
          <div>
            <div className="font-bold text-gray-800 text-base leading-tight">
              Apply for {jobDesignation}
            </div>
            <div className="text-xs text-gray-500 font-normal">{companyName}</div>
          </div>
        </div>
      }
      open={open}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText="Submit Application"
      confirmLoading={isProcessing}
      destroyOnClose
      okButtonProps={{
        style: {
          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          borderColor: "#4f46e5",
          borderRadius: "10px",
          fontWeight: "bold",
          height: "40px",
          padding: "0 24px",
        },
      }}
      cancelButtonProps={{
        style: { borderRadius: "10px", height: "40px" },
      }}
      width={520}
    >
      <Form layout="vertical" form={form} className="space-y-2 mt-4">
        {/* Cover Letter */}
        <Form.Item
          label={<span className="font-semibold text-gray-700">Cover Letter</span>}
          name="coverLetter"
          required
          rules={[{
            validator: (_, value) => {
              if (!value || !value.trim())
                return Promise.reject(new Error("Cover letter cannot be empty"));
              if (value.trim().length < 250)
                return Promise.reject(new Error("Cover letter must be at least 250 characters"));
              if (value.trim().length > 1000)
                return Promise.reject(new Error("Cover letter must not exceed 1000 characters"));
              return Promise.resolve();
            },
          }]}
        >
          <Input.TextArea
            rows={5}
            placeholder="Write your cover letter here (min 250 characters)..."
            maxLength={1000}
            showCount
          />
        </Form.Item>

        {/* Notice Period */}
        <Form.Item
          label={<span className="font-semibold text-gray-700">Notice Period</span>}
          name="noticePeriod"
          rules={[{
            validator: (_, value) => {
              if (!value) return Promise.resolve();
              if (!/^[A-Za-z0-9\s]+$/.test(value))
                return Promise.reject(new Error("Notice period can only contain letters, numbers, and spaces"));
              return Promise.resolve();
            },
          }]}
        >
          <Input placeholder="e.g. 30 days" maxLength={50} />
        </Form.Item>

        {/* Mobile */}
        <Form.Item
          label={<span className="font-semibold text-gray-700">Mobile Number</span>}
          name="mobileNumber"
          required
          rules={[{
            validator: (_, value) => {
              if (!value) return Promise.reject(new Error("Please enter your mobile number"));
              if (!onlyNumbers.test(value)) return Promise.reject(new Error("Mobile number must contain only numbers"));
              if (value.length !== 10) return Promise.reject(new Error("Mobile number must be exactly 10 digits"));
              return Promise.resolve();
            },
          }]}
        >
          <Input
            placeholder="e.g. 9876543210"
            maxLength={10}
            inputMode="numeric"
            onInput={(e: any) => { e.target.value = e.target.value.replace(/\D/g, ""); }}
          />
        </Form.Item>

        {/* Name */}
        <Form.Item
          label={<span className="font-semibold text-gray-700">Full Name</span>}
          name="userName"
          required
          rules={[{
            validator: (_, value) => {
              if (!value || !value.trim()) return Promise.reject(new Error("Name cannot be empty"));
              if (!onlyLettersAndSpaces.test(value)) return Promise.reject(new Error("Name must contain only letters and spaces"));
              if (value.trim().length < 2) return Promise.reject(new Error("Name must be at least 2 characters"));
              return Promise.resolve();
            },
          }]}
        >
          <Input
            placeholder="Enter your full name"
            maxLength={100}
            onInput={(e: any) => { e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ""); }}
          />
        </Form.Item>

        {/* ATS Progress Steps — shown during submit flow */}
        {currentStep >= 0 && (
          <div className="mt-4 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
            <Steps
              current={currentStep}
              size="small"
              items={[
                { title: "Resume", icon: <FileDoneOutlined /> },
                { title: "Analysis", icon: loadingAts ? <Spin size="small" /> : <FileDoneOutlined /> },
                { title: "Ready", icon: <CheckCircleOutlined /> },
              ]}
            />
            {isProcessing && (
              <div className="text-center mt-5">
                <Spin />
                <div className="mt-3 text-sm font-medium text-indigo-700">
                  {statusText}
                </div>
                <div className="text-xs text-indigo-400 mt-1">
                  {currentStep === 1 && "Matching your skills to the job requirements..."}
                </div>
              </div>
            )}
            {atsReady && !isProcessing && (
              <div className="text-center mt-5">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold text-sm">
                  <CheckCircleOutlined className="text-green-500" />
                  Analysis complete! Your report has opened in a new view.
                </div>
              </div>
            )}
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default JobApplicationModal;








































// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Modal, Input, Upload, Button, message, Form, Spin, Steps } from "antd";
// import { CheckCircleOutlined, FileDoneOutlined, UploadOutlined } from "@ant-design/icons";
// import axios from "axios";
// import BASE_URL from "../Config";

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   jobDesignation: string;
//   companyName: string;
//   userId: string;
//   jobId: string;
// };

// const JobApplicationModal: React.FC<Props> = ({
//   open,
//   onClose,
//   jobDesignation,
//   companyName,
//   userId,
//   jobId,
// }) => {


//   const resumeUrl1 = sessionStorage.getItem("resumeUrl");

//   const navigate = useNavigate();
//   const [form] = Form.useForm();
//   const [fileList, setFileList] = useState<any[]>([]);
//   const [uploading, setUploading] = useState(false);
//   const [resumeUrl, setResumeUrl] = useState<string | null>(null);
//   const [loadingAts, setLoadingAts] = useState(false);
//   const [atsReady, setAtsReady] = useState(false);
//   const [currentStep, setCurrentStep] = useState<number>(-1);
//   const [statusText, setStatusText] = useState<string>("");

//   const token = localStorage.getItem("token");
//   const onlyLettersAndSpaces = /^[A-Za-z\s]+$/;
//   const onlyNumbers = /^\d+$/;

//   const resetAll = () => {
//     form.resetFields();
//     setFileList([]);
//     setResumeUrl(null);
//     setLoadingAts(false);
//     setAtsReady(false);
//     setCurrentStep(-1);
//     setStatusText("");
//   };

//   const handleClose = () => {
//     resetAll();
//     onClose();
//   };

//   const handleRemove = () => {
//     setFileList([]);
//     setResumeUrl(null);
//     setAtsReady(false);
//     setCurrentStep(-1);
//     setStatusText("");
//   };

//   const handleFileChange = async (info: any) => {
//     const file = info.file;
//     if (!file) return;

//     setUploading(true);
//     setCurrentStep(0);
//     setStatusText("Uploading your resume...");

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("userId", userId);
//     formData.append("fileType", "resume");
//     formData.append("jobId", jobId);

//     try {
//       const res = await axios.post(
//         `${BASE_URL}/marketing-service/campgin/upload`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",

//           },
//         }
//       );
//       const fileUrl = res.data?.documentPath;
//       setResumeUrl(fileUrl);
//       setFileList([file]);
//       message.success("Resume uploaded! Analyzing your profile...");

//       if (fileUrl) {
//         setUploading(false);
//         setLoadingAts(true);
//         setCurrentStep(1);
//         setStatusText("Analyzing your resume against the job requirements...");

//         try {
//           const atsRes = await axios.get(
//             `${BASE_URL}/marketing-service/campgin/ats-score-checker?jobId=${jobId}&ResumeUrl=${encodeURIComponent(fileUrl)}&type=ATS`
//           );


//           const isEligible = atsRes.data?.status === true;

//         setAtsReady(true);
//         setCurrentStep(2);

//         if (isEligible) {

//           setStatusText("You're eligible! Redirecting to your report...");
//           message.success("Analysis complete! You are eligible for the exam.");
//         }

//         else {

//           setStatusText("Not eligible. Redirecting to view skill gaps...");
//           message.warning(atsRes.data?.message || "You are not eligible for the exam. Review your gaps below.");
//         }

//         // Wait 2 seconds so user can read the status before navigating
//         await new Promise((resolve) => setTimeout(resolve, 2000));


//           // Navigate to the separate result page with all data
//           navigate("/job-analysis-result", {
//             state: {
//               atsData: atsRes.data,
//               jobId,
//               jobDesignation,
//               companyName,

//             },
//           });

//         } catch {
//           message.error("Failed to analyze resume. Please try again.");
//           setCurrentStep(-1);
//           setStatusText("");
//         } finally {
//           setLoadingAts(false);
//         }
//       }
//     } catch {
//       message.error("Resume upload failed. Please try again.");
//       setFileList([]);
//       setCurrentStep(-1);
//       setStatusText("");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       const values = await form.validateFields();

//       if (!resumeUrl) {
//         message.error("Please upload your resume before submitting.");
//         return;
//       }

//       const payload = {
//         ...values,
//         applicationStatus: "applied",
//         resumeUrl: sessionStorage.getItem("resumeUrl")!=null? sessionStorage.getItem("resumeUrl"):"",
//         jobDesignation,
//         companyName,
//         userId,
//         jobId,
//       };

//       await axios.post(
//         `${BASE_URL}/marketing-service/campgin/userapplyjob`,
//         payload,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       message.success("Application submitted successfully!");
//       resetAll();
//       onClose();
//       navigate("/main/appliedjobs");
//       sessionStorage.removeItem("resumeUrl");
//     }
//     catch (err: any) {
//       if (err?.errorFields?.length) {
//         message.error("Please correct the highlighted fields before submitting.");
//         return;
//       }
//       const errorMessage =
//         err?.response?.data?.message ||
//         err?.response?.data?.error ||
//         "Something went wrong while submitting the application.";
//       message.error(errorMessage);
//     }
//   };

//   const isProcessing = uploading || loadingAts;

//   return (
//     <Modal
//       title={
//         <div className="flex items-center gap-3 py-1">
//           <div
//             className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
//             style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
//           >
//             <FileDoneOutlined />
//           </div>
//           <div>
//             <div className="font-bold text-gray-800 text-base leading-tight">
//               Apply for {jobDesignation}
//             </div>
//             <div className="text-xs text-gray-500 font-normal">{companyName}</div>
//           </div>
//         </div>
//       }
//       open={open}
//       onCancel={handleClose}
//       onOk={handleSubmit}
//       okText="Submit Application"
//       confirmLoading={isProcessing}
//       destroyOnClose
//       okButtonProps={{
//         style: {
//           display: atsReady ? "inline-block" : "none",
//           background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
//           borderColor: "#4f46e5",
//           borderRadius: "10px",
//           fontWeight: "bold",
//           height: "40px",
//           padding: "0 24px",
//         },
//       }}
//       cancelButtonProps={{
//         style: { borderRadius: "10px", height: "40px" },
//       }}
//       width={520}
//     >
//       <Form layout="vertical" form={form} className="space-y-2 mt-4">
//         {/* Cover Letter */}
//         <Form.Item
//           label={<span className="font-semibold text-gray-700">Cover Letter</span>}
//           name="coverLetter"
//           required
//           rules={[{
//             validator: (_, value) => {
//               if (!value || !value.trim())
//                 return Promise.reject(new Error("Cover letter cannot be empty"));
//               if (value.trim().length < 250)
//                 return Promise.reject(new Error("Cover letter must be at least 250 characters"));
//               if (value.trim().length > 2000)
//                 return Promise.reject(new Error("Cover letter must not exceed 2000 characters"));
//               return Promise.resolve();
//             },
//           }]}
//         >
//           <Input.TextArea
//             rows={5}
//             placeholder="Write your cover letter here (min 250 characters)..."
//             maxLength={2000}
//             showCount
//           />
//         </Form.Item>

//         {/* Notice Period */}
//         <Form.Item
//           label={<span className="font-semibold text-gray-700">Notice Period</span>}
//           name="noticePeriod"
//           rules={[{
//             validator: (_, value) => {
//               if (!value) return Promise.resolve();
//               if (!/^[A-Za-z0-9\s]+$/.test(value))
//                 return Promise.reject(new Error("Notice period can only contain letters, numbers, and spaces"));
//               return Promise.resolve();
//             },
//           }]}
//         >
//           <Input placeholder="e.g. 30 days" maxLength={50} />
//         </Form.Item>

//         {/* Mobile */}
//         <Form.Item
//           label={<span className="font-semibold text-gray-700">Mobile Number</span>}
//           name="mobileNumber"
//           required
//           rules={[{
//             validator: (_, value) => {
//               if (!value) return Promise.reject(new Error("Please enter your mobile number"));
//               if (!onlyNumbers.test(value)) return Promise.reject(new Error("Mobile number must contain only numbers"));
//               if (value.length !== 10) return Promise.reject(new Error("Mobile number must be exactly 10 digits"));
//               return Promise.resolve();
//             },
//           }]}
//         >
//           <Input
//             placeholder="e.g. 9876543210"
//             maxLength={10}
//             inputMode="numeric"
//             onInput={(e: any) => { e.target.value = e.target.value.replace(/\D/g, ""); }}
//           />
//         </Form.Item>

//         {/* Name */}
//         <Form.Item
//           label={<span className="font-semibold text-gray-700">Full Name</span>}
//           name="userName"
//           required
//           rules={[{
//             validator: (_, value) => {
//               if (!value || !value.trim()) return Promise.reject(new Error("Name cannot be empty"));
//               if (!onlyLettersAndSpaces.test(value)) return Promise.reject(new Error("Name must contain only letters and spaces"));
//               if (value.trim().length < 2) return Promise.reject(new Error("Name must be at least 2 characters"));
//               return Promise.resolve();
//             },
//           }]}
//         >
//           <Input
//             placeholder="Enter your full name"
//             maxLength={100}
//             onInput={(e: any) => { e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ""); }}
//           />
//         </Form.Item>

//         {/* Upload Resume */}
//         {/* <Form.Item
//           label={<span className="font-semibold text-gray-700">Upload Resume</span>}
//           required
//           help={!resumeUrl && fileList.length === 0 ? "Uploading your resume will automatically analyze it against the job." : ""}
//         >
//           <div className="bg-gray-50 border-2 border-dashed border-gray-200 hover:border-indigo-400 transition-colors rounded-2xl p-5">
//             <Upload
//               customRequest={() => {}}
//               beforeUpload={() => false}
//               onChange={handleFileChange}
//               onRemove={handleRemove}
//               fileList={fileList}
//               accept=".pdf,.doc,.docx"
//               maxCount={1}
//               showUploadList={{ showRemoveIcon: !isProcessing }}
//               disabled={isProcessing}
//             >
//               <Button
//                 icon={<UploadOutlined />}
//                 loading={uploading}
//                 disabled={isProcessing && !uploading}
//                 size="large"
//                 block
//                 className="rounded-xl font-semibold"
//                 style={{ height: "48px" }}
//               >
//                 {uploading ? "Uploading..." : "Click or Drag Resume Here"}
//               </Button>
//             </Upload>
//             <div className="text-center mt-2 text-xs text-gray-400">
//               PDF, DOC, DOCX supported
//             </div>
//           </div>
//         </Form.Item> */}


//         {currentStep >= 0 && (
//           <div className="mt-4 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
//             <Steps
//               current={currentStep}
//               size="small"
//               items={[
//                 { title: "Upload", icon: <UploadOutlined /> },
//                 { title: "Analysis", icon: loadingAts ? <Spin size="small" /> : <FileDoneOutlined /> },
//                 { title: "Ready", icon: <CheckCircleOutlined /> },
//               ]}
//             />
//             {isProcessing && (
//               <div className="text-center mt-5">
//                 <Spin />
//                 <div className="mt-3 text-sm font-medium text-indigo-700">
//                   {statusText}
//                 </div>
//                 <div className="text-xs text-indigo-400 mt-1">
//                   {currentStep === 1 && "Matching your skills to the job requirements..."}
//                 </div>
//               </div>
//             )}
//             {atsReady && !isProcessing && (
//               <div className="text-center mt-5">
//                 <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold text-sm">
//                   <CheckCircleOutlined className="text-green-500" />
//                   Analysis complete! Your report has opened in a new view.
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//       </Form>
//     </Modal>
//   );
// };

// export default JobApplicationModal;




