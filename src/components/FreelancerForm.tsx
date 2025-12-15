import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Button, Card, message } from "antd";
import axios from "axios";
import BASE_URL from "../Config";

const BASE_URL1 = `${BASE_URL}/ai-service/agent`;

interface FreelancerInfo {
  id?: string;
  userId: string;
  email: string;
  skills: string;
  experience: string;
  perHourCharge: number;
}

interface Props {
  editableData?: FreelancerInfo | null;
}

const FreelancerForm: React.FC<Props> = ({ editableData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // GET USER ID
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      message.error("User not logged in!");
    }
  }, []);

  // PREFILL FORM IF EDIT MODE
  useEffect(() => {
    if (editableData) {
      form.setFieldsValue(editableData);
    }
  }, [editableData]);

  // SAVE OR UPDATE
  const handleSubmit = async () => {
    try {
      if (!userId) {
        message.error("User ID missing. Please login again.");
        return;
      }

      const values = (await form.validateFields()) as FreelancerInfo;

      setLoading(true);

      const payload: FreelancerInfo = {
        ...values,
        userId,
        id: editableData?.id || undefined,
      };

      const isEdit = Boolean(editableData?.id);
      const url = `${BASE_URL1}/freeLancerInfo`;
        const method = isEdit ? "PATCH" : "PATCH";

      const response = await axios({ method, url, data: payload });

      message.success({
        content: isEdit
          ? "Freelancer details updated successfully!"
          : "Freelancer details saved!",
        style: { color: "#1ab394" },
      });

      console.log("Response:", response.data);
    } catch (err: any) {
      console.error(err);
      message.error(err?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center p-4"
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 550,
          borderRadius: 16,
          padding: 20,
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          border: "1px solid #e5e5e5",
        }}
      >
        <h2
          className="text-xl font-semibold mb-4"
          style={{ color: "#0089cba", fontSize: 22, textAlign: "center" }}
        >
          {editableData
            ? "Edit Freelancer Profile"
            : "Create Freelancer Profile"}
        </h2>

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            email: "",
            skills: "",
            experience: "",
            perHourCharge: 0,
          }}
        >
          {/* EMAIL */}
          <Form.Item
            label={
              <span style={{ fontWeight: 600, color: "#333" }}>Email</span>
            }
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter a valid email address" },
            ]}
          >
            <Input
              placeholder="Enter email"
              style={{
                height: 45,
                borderRadius: 8,
              }}
            />
          </Form.Item>

          {/* SKILLS */}
          <Form.Item
            label={
              <span style={{ fontWeight: 600, color: "#333" }}>Skills</span>
            }
            name="skills"
            rules={[{ required: true, message: "Enter your skills" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="e.g. React, Node, Java, ML, UI/UX"
              style={{
                borderRadius: 8,
              }}
            />
          </Form.Item>

          {/* EXPERIENCE */}
          <Form.Item
            label={
              <span style={{ fontWeight: 600, color: "#333" }}>Experience</span>
            }
            name="experience"
            rules={[{ required: true, message: "Enter your experience" }]}
          >
            <Input
              placeholder="e.g. 2 years, 6 months etc."
              style={{
                height: 45,
                borderRadius: 8,
              }}
            />
          </Form.Item>

          {/* PER HOUR PRICE */}
          <Form.Item
            label={
              <span style={{ fontWeight: 600, color: "#333" }}>
                Per Hour Charge (₹)
              </span>
            }
            name="perHourCharge"
            rules={[{ required: true, message: "Enter hourly price" }]}
          >
            <InputNumber
              min={0}
              className="w-full"
              placeholder="Enter hourly price"
              style={{
                height: 45,
                borderRadius: 8,
              }}
            />
          </Form.Item>

          {/* BUTTON */}
          <Form.Item>
            <Button
              type="primary"
              loading={loading}
              onClick={handleSubmit}
              block
              style={{
                backgroundColor: "#0089cba",
                borderColor: "#0089cba",
                color: "#fff",
                height: 48,
                fontSize: 17,
                borderRadius: 10,
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(0,137,202,0.3)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#007dab")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#0089cba")
              }
            >
              {editableData ? "Update Profile" : "Save Profile"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default FreelancerForm;
