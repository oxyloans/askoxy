import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Input, Upload, Button, message, Form, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
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
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const onlyLettersAndSpaces = /^[A-Za-z\s]+$/;
  const onlyNumbers = /^\d+$/;

 const handleFileChange = async (info: any) => {
   const file = info.file;
   if (!file) return;

   setUploading(true);
  const formData = new FormData();
   formData.append("file", file);
   formData.append("userId", userId);
   formData.append("fileType", "resume");
   formData.append("jobId", jobId);

   try {
     const res = await axios.post(
       `${BASE_URL}/marketing-service/campgin/upload`,
       formData,
       {
         headers: {
           "Content-Type": "multipart/form-data",
           Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
       },
     );
     const fileUrl = res.data?.documentPath;
     setResumeUrl(fileUrl);
     setFileList([file]);
     message.success("Resume uploaded successfully!");
   } catch (error) {
     message.error("Resume upload failed.");
     setFileList([]);
   } finally {
     setUploading(false);
   }
 };

  const handleRemove = () => {
    setFileList([]);
    setResumeUrl(null);
  };

  const resetForm = () => {
    form.resetFields();
    setFileList([]);
    setResumeUrl(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!resumeUrl) {
        message.error("Please upload your resume before submitting.");
        return;
      }

      const payload = {
        ...values,
        applicationStatus: "applied",
        resumeUrl,
        jobDesignation,
        companyName,
        userId,
        jobId,
      };

      await axios.post(
        `${BASE_URL}/marketing-service/campgin/userapplyjob`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      message.success("Application submitted successfully!");
      resetForm();
      onClose();
      navigate("/main/appliedjobs");
    } catch (err: any) {
      if (err?.errorFields?.length) {
        message.error(
          "Please correct the highlighted fields before submitting.",
        );
        return;
      }

      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Something went wrong while submitting the application.";
      message.error(errorMessage);
    }
  };

  return (
    <Modal
      title="Submit Your Job Application"
      open={open}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText="Submit"
      confirmLoading={uploading}
      destroyOnClose
    >
      <Form layout="vertical" form={form} className="space-y-2">
        <Form.Item
          label="Cover Letter"
          name="coverLetter"
          required
          rules={[
            // {
            //   required: true,
            //   message: "Please enter your cover letter",
            // },
            {
              validator: (_, value) => {
                if (!value || !value.trim()) {
                  return Promise.reject(
                    new Error("Cover letter cannot be empty"),
                  );
                }

                const trimmedValue = value.trim();

                if (trimmedValue.length < 250) {
                  return Promise.reject(
                    new Error("Cover letter must be at least 250 characters"),
                  );
                }

                if (trimmedValue.length > 5000) {
                  return Promise.reject(
                    new Error("Cover letter must not exceed 5000 characters"),
                  );
                }

                // if (!/^[A-Za-z0-9\s.,!?'"-()]+$/.test(value)) {
                //   return Promise.reject(
                //     new Error(
                //       "Cover letter must contain only letters, numbers, spaces, and common punctuation",
                //     ),
                //   );
                // }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.TextArea
            rows={6}
            placeholder="Write your cover letter here..."
            maxLength={5000}
            showCount
          />
        </Form.Item>

        <Form.Item
          label="Notice Period"
          name="noticePeriod"
          rules={[
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();

                if (!/^[A-Za-z0-9\s]+$/.test(value)) {
                  return Promise.reject(
                    new Error(
                      "Notice period can contain only letters, numbers, and spaces",
                    ),
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="e.g. 30 days" maxLength={50} />
        </Form.Item>

        <Form.Item
          label="Mobile Number"
          name="mobileNumber"
          required
          rules={[
            // {
            //   required: true,
            //   message: "Please enter your mobile number",
            // },
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject(
                    new Error("Please enter your mobile number"),
                  );
                }

                if (!onlyNumbers.test(value)) {
                  return Promise.reject(
                    new Error("Mobile number must contain only numbers"),
                  );
                }

                if (value.length !== 10) {
                  return Promise.reject(
                    new Error("Mobile number must be exactly 10 digits"),
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            placeholder="e.g. 9876543210"
            maxLength={10}
            inputMode="numeric"
            onInput={(e: any) => {
              e.target.value = e.target.value.replace(/\D/g, "");
            }}
          />
        </Form.Item>

        <Form.Item
          label="Name"
          name="userName"
          required
          rules={[
            // {
            //   required: true,
            //   message: "Please enter your name",
            // },
            {
              validator: (_, value) => {
                if (!value || !value.trim()) {
                  return Promise.reject(new Error("Name cannot be empty"));
                }

                if (!onlyLettersAndSpaces.test(value)) {
                  return Promise.reject(
                    new Error("Name must contain only letters and spaces"),
                  );
                }

                if (value.trim().length < 2) {
                  return Promise.reject(
                    new Error("Name must be at least 2 characters"),
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            placeholder="Enter your name"
            maxLength={100}
            onInput={(e: any) => {
              e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, "");
            }}
          />
        </Form.Item>

        <Form.Item
          label="Upload Resume"
          required
          validateStatus={!resumeUrl && fileList.length === 0 ? "" : ""}
          help={
            !resumeUrl && fileList.length === 0
              ? "Please upload your resume"
              : ""
          }
        >
          <Spin spinning={uploading}>
            <Upload
              customRequest={() => {}}
              beforeUpload={() => false}
              onChange={handleFileChange}
              onRemove={handleRemove}
              fileList={fileList}
              accept=".pdf,.doc,.docx"
              maxCount={1}
              showUploadList={{ showRemoveIcon: true }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Spin>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default JobApplicationModal;