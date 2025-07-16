import React, { useState } from "react";
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
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  // Upload resume as soon as a file is selected
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
        { headers: { "Content-Type": "multipart/form-data" } }
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
    onClose(); // trigger parent close logic
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

    //   console.log("Final Payload to Submit:", payload);

      await axios.post(
        `${BASE_URL}/marketing-service/campgin/userapplyjob`,
        payload
      );

      message.success("Application submitted successfully!");
      resetForm(); 
      onClose();
    } catch (err) {
      message.error("Please fill all required fields.");
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
    >
      <Form layout="vertical" form={form} className="space-y-2">
        <Form.Item
          label="Cover Letter"
          name="coverLetter"
          rules={[{ required: true, message: "Please enter a cover letter" }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Write your cover letter here..."
          />
        </Form.Item>

        <Form.Item
          label="Notice Period"
          name="noticePeriod"
          rules={[{ required: false }]}
        >
          <Input placeholder="e.g. 30 days" />
        </Form.Item>

        {/* <Form.Item
          label="Application Status"
          name="applicationStatus"
          rules={[{ required: false }]}
        >
          <Input placeholder="e.g. applied" />
        </Form.Item> */}

        <Form.Item
          label="Mobile Number"
          name="mobileNumber"
          rules={[
            { required: true, message: "Please enter your mobile number" },
          ]}
        >
          <Input placeholder="e.g. 9876543210" />
        </Form.Item>

        <Form.Item
          label="Name"
          name="userName"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item label="Upload Resume" required>
          <Spin spinning={uploading}>
            <Upload
              customRequest={() => {}}
              beforeUpload={() => false}
              onChange={handleFileChange}
              onRemove={handleRemove}
              fileList={fileList}
              accept=".pdf,.doc,.docx"
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
