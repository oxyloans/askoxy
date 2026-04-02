import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Tag,
  Spin,
  Empty,
  Input,
  Select,
  Space,
  Tooltip,
  message,
  Divider,
  Avatar,
  Modal,
  Form,
  Drawer,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  FileTextOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import axios from "axios";
import EmployeeLayout from "./EmployeeLayout";
import { getEmployeeAccessToken } from "../utils/cookieUtils";
import BASE_URL, { uploadurlwithId } from "../Config";
import { useNavigate, useParams } from "react-router-dom";
import { freelanceApi } from "../utils/axiosInstances";
import { decryptParam } from "../utils/urlEncryption";

const { Title, Text } = Typography;

interface Freelancer {
  id: string | null;
  email: string;
  userId: string | null;
  userId1: string;
  perHour: number;
  perDay: number;
  perWeek: number;
  perMonth: number;
  perYear: number;
  openForFreeLancing: string;
  amountNegotiable: string;
  resumeUrl: string;
}

const FreelancerProfiles: React.FC = () => {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">(
    window.innerWidth < 768 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop"
  );
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);
  const [assigning, setAssigning] = useState(false);
  const navigate = useNavigate();
  const { companyId: encryptedCompanyId, requirementId: encryptedRequirementId } = useParams();
  const companyId = decryptParam(encryptedCompanyId || '');
  const requirementId = decryptParam(encryptedRequirementId || '');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setScreenSize("mobile");
      else if (width < 1024) setScreenSize("tablet");
      else setScreenSize("desktop");
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchFreelancers = async () => {
    try {
      setLoading(true);

      const response = await freelanceApi.get<Freelancer[]>(
        `${BASE_URL}/ai-service/agent/getAllFreeLancers`
      );

      if (response.data && Array.isArray(response.data)) {
        setFreelancers(response.data);
      } else {
        setFreelancers([]);
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to load freelancers.";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const filteredFreelancers = freelancers.filter((freelancer) => {
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "budget" && freelancer.perHour <= 100) ||
      (priceFilter === "mid" &&
        freelancer.perHour > 100 &&
        freelancer.perHour <= 250) ||
      (priceFilter === "premium" && freelancer.perHour > 250);

    return matchesPrice;
  });

  const handleDownloadResume = (resumeUrl: string) => {
    if (!resumeUrl) {
      message.warning("Resume not available for this freelancer.");
      return;
    }
    const fullUrl = `${uploadurlwithId}${resumeUrl}`;
    window.open(fullUrl, "_blank");
  };

  const handleAssignFreelancer = async (freelancer: Freelancer) => {
    if (!companyId || !requirementId || !freelancer?.userId1) {
      message.error("Missing required information to assign freelancer.");
      return;
    }

    try {
      setAssigning(true);

      const payload = {
        companyId,
        id: requirementId,
        freelancerId: freelancer.userId1,
      };

      const response = await freelanceApi.post(
        `${BASE_URL}/user-service/partnerAssignedFreelancer`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        message.success("Freelancer assigned successfully!");
        setSelectedFreelancer(null);
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to assign freelancer.";
      message.error(errorMsg);
    } finally {
      setAssigning(false);
    }
  };

  const FreelancerCard = ({ freelancer }: { freelancer: Freelancer }) => (
    <Card
      hoverable
      style={{
        borderRadius: 16,
        border: "1px solid #f0f0f0",
        height: "100%",
      }}
      className="freelancer-card"
    >
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <Avatar
            size={48}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            {(freelancer.email || "F").charAt(0).toUpperCase()}
          </Avatar>
          <Tag
            icon={<CheckCircleOutlined />}
            color="success"
            style={{ borderRadius: 6 }}
          >
            Available
          </Tag>
        </div>
      </div>

      <Divider style={{ margin: "12px 0" }} />

      <div style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            color: "#999",
            letterSpacing: "0.5px",
            display: "block",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Pricing
        </Text>
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #e8ecff",
                textAlign: "center",
              }}
            >
              <Text style={{ fontSize: 11, color: "#999", display: "block" }}>Per Hour</Text>
              <Text
                strong
                style={{
                  fontSize: 14,
                  color: "#667eea",
                  display: "block",
                }}
              >
                ₹{freelancer.perHour.toLocaleString()}
              </Text>
            </div>
          </Col>
          <Col span={12}>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #e8ecff",
                textAlign: "center",
              }}
            >
              <Text style={{ fontSize: 11, color: "#999", display: "block" }}>Per Day</Text>
              <Text
                strong
                style={{
                  fontSize: 14,
                  color: "#667eea",
                  display: "block",
                }}
              >
                ₹{freelancer.perDay.toLocaleString()}
              </Text>
            </div>
          </Col>
          <Col span={12}>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #e8ecff",
                textAlign: "center",
              }}
            >
              <Text style={{ fontSize: 11, color: "#999", display: "block" }}>Per Week</Text>
              <Text
                strong
                style={{
                  fontSize: 14,
                  color: "#667eea",
                  display: "block",
                }}
              >
                ₹{freelancer.perWeek.toLocaleString()}
              </Text>
            </div>
          </Col>
          <Col span={12}>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #e8ecff",
                textAlign: "center",
              }}
            >
              <Text style={{ fontSize: 11, color: "#999", display: "block" }}>Per Month</Text>
              <Text
                strong
                style={{
                  fontSize: 14,
                  color: "#667eea",
                  display: "block",
                }}
              >
                ₹{freelancer.perMonth.toLocaleString()}
              </Text>
            </div>
          </Col>
        </Row>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <div
              style={{
                padding: "12px",
                borderRadius: 8,
                border: "1px solid #b3d9ff",
                textAlign: "center",
              }}
            >
              <Text style={{ fontSize: 11, color: "#0050b3", display: "block" }}>Per Year</Text>
              <Text
                strong
                style={{
                  fontSize: 14,
                  color: "#0050b3",
                  display: "block",
                }}
              >
                ₹{freelancer.perYear.toLocaleString()}
              </Text>
            </div>
          </Col>
          <Col span={12}>
            <div
              style={{
                padding: "12px",
                borderRadius: 8,
                border:
                  freelancer.amountNegotiable === "YES"
                    ? "1px solid #b7eb8f"
                    : "1px solid #ffccc7",
                textAlign: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color:
                    freelancer.amountNegotiable === "YES"
                      ? "#274e0b"
                      : "#cf1322",
                  display: "block",
                }}
              >
                Negotiable
              </Text>
              <Text
                strong
                style={{
                  fontSize: 14,
                  color:
                    freelancer.amountNegotiable === "YES"
                      ? "#52c41a"
                      : "#ff4d4f",
                  display: "block",
                }}
              >
                {freelancer.amountNegotiable}
              </Text>
            </div>
          </Col>
        </Row>
      </div>

      <div style={{ display: "flex", gap: 8, flexDirection: screenSize === "mobile" ? "column" : "row" }}>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={() => handleDownloadResume(freelancer.resumeUrl)}
          style={{
            borderRadius: 8,
            height: 40,
            fontWeight: 600,
            background: "#008cba",
            border: "none",
            boxShadow: "0 4px 12px rgba(0, 140, 186, 0.25)",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {screenSize === "mobile" ? null : screenSize === "tablet" ? (
            <>
              <DownloadOutlined />
              <span>Resume</span>
            </>
          ) : (
            "View Resume"
          )}
        </Button>
        {companyId && requirementId && (
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            loading={assigning && selectedFreelancer?.userId1 === freelancer.userId1}
            onClick={() => handleAssignFreelancer(freelancer)}
            style={{
              borderRadius: 8,
              height: 40,
              fontWeight: 600,
              background: "#1ab394",
              border: "none",
              boxShadow: "0 4px 12px rgba(26, 179, 148, 0.25)",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {screenSize === "mobile" ? null : screenSize === "tablet" ? (
              <>
                <CheckCircleOutlined />
                <span>Assign</span>
              </>
            ) : (
              "Assign Freelancer"
            )}
          </Button>
        )}
      </div>
    </Card>
  );

  if (loading) {
    return (
      <EmployeeLayout>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
          }}
        >
          <Spin size="large" tip="Loading freelancer profiles..." />
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <Title
            level={3}
            style={{ margin: 0, fontWeight: 700, color: "#1a1d2e" }}
          >
            Available Freelancers
          </Title>
          <Text style={{ color: "#888", fontSize: 13 }}>
            Browse and hire talented freelancers for your projects
          </Text>
        </div>
        <Text style={{ color: "#999", fontSize: 13 }}>
          Found {filteredFreelancers.length} freelancer
          {filteredFreelancers.length !== 1 ? "s" : ""}
        </Text>
      </div>

      {filteredFreelancers.length > 0 ? (
        <Row gutter={[20, 20]}>
          {filteredFreelancers.map((freelancer) => (
            <Col key={freelancer.userId1} xs={24} sm={12} md={8}>
              <FreelancerCard freelancer={freelancer} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No Freelancers Available"
          style={{ marginTop: 60, padding: "40px 20px" }}
        >
          <Text style={{ color: "#999", fontSize: 13, display: "block", marginBottom: 16 }}>
            {freelancers.length === 0 
              ? "No freelancers are currently available in the system."
              : "No freelancers match your selected filters."}
          </Text>
          {freelancers.length > 0 && (
            <Button
              type="primary"
              onClick={() => setPriceFilter("all")}
              style={{
                borderRadius: 10,
                height: 40,
                fontWeight: 600,
                background: "#008cba",
                border: "none",
              }}
            >
              Clear Filters
            </Button>
          )}
        </Empty>
      )}

      <style>
        {`
          .freelancer-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          .freelancer-card:hover {
            transform: translateY(-8px) !important;
            box-shadow: 0 12px 32px rgba(102, 126, 234, 0.15) !important;
          }
        `}
      </style>
    </EmployeeLayout>
  );
};

export default FreelancerProfiles;
