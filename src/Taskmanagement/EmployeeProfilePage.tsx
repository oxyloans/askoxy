import React, { useEffect, useMemo, useState } from "react";
import { employeeApi } from "../utils/axiosInstances";
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Grid,
  Input,
  Row,
  Select,
  Spin,
  Typography,
} from "antd";
import { EditOutlined, CloseOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import BASE_URL from "../Config";
import UserPanelLayout from "./UserPanelLayout";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const PRIMARY = "#008cba";
const SECONDARY = "#1ab394";

const PLATFORMS = [
  { value: "oxybricks", label: "Oxybricks" },
  { value: "oxyloans", label: "OxyLoans" },
  { value: "oxygold", label: "OxyGold" },
  { value: "oxyglobal", label: "OxyGlobal" },
  { value: "ai_agents", label: "AI Agents" },
  { value: "askoxy_ai", label: "Askoxy.ai" },
  { value: "study_abroad", label: "Study Abroad" },
];

const USAGE = [
  { value: "high", label: "High" },
  { value: "moderate", label: "Moderate" },
  { value: "low", label: "Low" },
];

const ROLE_OPTIONS = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "React Developer",
  "Angular Developer",
  "Node.js Developer",
  "Java Developer",
  "Python Developer",
  "Mobile App Developer",
  "Software Engineer",
  "Senior Software Engineer",
  "Technical Lead",
  "Team Lead",
  "Project Manager",
  "Product Manager",
  "Engineering Manager",

  "UI/UX Designer",
  "Graphic Designer",
  "Motion Graphic Designer",
  "Video Editor",
  "3D Designer",

  "QA Engineer",
  "QA Tester",
  "Automation Tester",
  "Manual Tester",
  "Test Engineer",

  "Business Analyst",
  "Senior Business Analyst",
  "Data Analyst",
  "AI Engineer",
  "Machine Learning Engineer",
  "Prompt Engineer",

  "HR Executive",
  "HR Recruiter",
  "Talent Acquisition Specialist",
  "HR Manager",
  "Human Resources Manager",

  "Sales Executive",
  "Sales Manager",
  "Business Development Executive",
  "Business Development Manager",
  "Marketing Executive",
  "Digital Marketing Executive",
  "Social Media Manager",
  "Operations Executive",
  "Operations Manager",

  "Customer Support Executive",
  "Telecalling Executive",
  "Accountant",
  "Finance Executive",

  "Consultant",
  "Trainer",
  "Mentor",
  "Freelancer",

  "Director",
  "Managing Director",
  "Chief Executive Officer (CEO)",
  "Chief Technology Officer (CTO)",
  "Chief Operating Officer (COO)",
  "Chief Marketing Officer (CMO)",
  "Chief Financial Officer (CFO)",
  "Founder",
  "Co-Founder",
];

const EmployeeProfilePage: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = useMemo(() => !screens.md, [screens.md]);

  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasProfileData, setHasProfileData] = useState(false);
  const [mobErr, setMobErr] = useState("");

  const userId = sessionStorage.getItem("userId") || "";
  const savedMobile = sessionStorage.getItem("mobileNumber") || "";

  const digits10 = (v: string) => (v || "").replace(/\D/g, "").slice(0, 10);

  const cleanText = (v: any) => String(v || "").trim();

  const splitCommaValues = (value?: string) =>
    value
      ? value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  const getEmployeeSkills = async () => {
    if (!userId) return;

    setPageLoading(true);

    try {
      const response = await employeeApi.get(
        `${BASE_URL}/user-service/write/getEmployeeSkills/${userId}`,
      );

      const data = response.data || {};

      const projectTypes = splitCommaValues(data.projectType);

      const hasData =
        !!cleanText(data.skills) ||
        !!cleanText(data.aiTools) ||
        !!cleanText(data.designation) ||
        !!cleanText(data.aiToolsUsage) ||
        projectTypes.length > 0;

      setHasProfileData(hasData);

      form.setFieldsValue({
        mobileNumber: digits10(
          sessionStorage.getItem("mobileNumber") || savedMobile,
        ),
        skills: cleanText(data.skills),
        aiTools: cleanText(data.aiTools),
        projectType: projectTypes,
        aiUsageLevel: cleanText(data.aiToolsUsage) || undefined,
        designation: cleanText(data.designation) || undefined,
      });

      setIsEditMode(!hasData);
    } catch (err) {
      setHasProfileData(false);

      form.setFieldsValue({
        mobileNumber: digits10(
          sessionStorage.getItem("mobileNumber") || savedMobile,
        ),
      });

      setIsEditMode(true);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    getEmployeeSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleSave = async () => {
    setMobErr("");

    try {
      await form.validateFields();
    } catch {
      return;
    }

    const vals = form.getFieldsValue();

    const mobile = digits10(vals.mobileNumber || "");
    const aiTools = cleanText(vals.aiTools);
    const skills = cleanText(vals.skills);
    const designation = cleanText(vals.designation);
    const aiUsageLevel = cleanText(vals.aiUsageLevel);
    const projectType = vals.projectType || [];

    if (!mobile || mobile.length !== 10) {
      setMobErr("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (/^(\d)\1{9}$/.test(mobile)) {
      setMobErr("Mobile number cannot contain the same digit repeatedly.");
      return;
    }

    if (!/^[6-9]/.test(mobile)) {
      setMobErr("Mobile number must start with 6, 7, 8, or 9.");
      return;
    }

    if (!userId) {
      setMobErr("User details not found. Please log in again.");
      return;
    }

    setSaving(true);

    try {
      await employeeApi.patch(
        `${BASE_URL}/user-service/users/${userId}/empMobile`,
        null,
        { params: { mobileNumber: mobile } },
      );

      sessionStorage.setItem("mobileNumber", mobile);

      const employeeSkillsPayload = {
        employeeId: userId,
        aiTools,
        aiToolsUsage: aiUsageLevel,
        projectType: projectType.join(", "),
        designation,
        skills,
      };

      await employeeApi.patch(
        `${BASE_URL}/user-service/write/updateEmployeeSkills`,
        employeeSkillsPayload,
      );

      setIsEditMode(false);
      setHasProfileData(true);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Employee profile updated successfully.",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });

      getEmployeeSkills();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Unable to update employee profile. Please try again.";

      setMobErr(msg);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: msg,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setMobErr("");
    form.setFields([]);
    getEmployeeSkills();

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "info",
      title: "Edit cancelled.",
      showConfirmButton: false,
      timer: 1800,
    });
  };

  const fieldDisabled =
    saving || pageLoading || (hasProfileData && !isEditMode);

  const pad = isMobile ? "16px 14px" : "36px 40px";
  const colSpan = { xs: 24, sm: 12, md: 8 };

  const dividerStyle = (color: string): React.CSSProperties => ({
    borderColor: color,
    marginBottom: 20,
    marginTop: 8,
  });

  const sectionLabelStyle = (color: string): React.CSSProperties => ({
    color,
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  });

  return (
    <UserPanelLayout>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: isMobile ? "16px 10px" : "32px 24px",
        }}
      >
        <div
          style={{
            marginBottom: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <Title
            level={isMobile ? 4 : 3}
            style={{ margin: 0, fontWeight: 700, color: "#1a1a2e" }}
          >
            Employee Profile Details
          </Title>

          {hasProfileData && !isEditMode ? (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setMobErr("");
                setIsEditMode(true);
              }}
              disabled={pageLoading || saving}
              style={{
                background: PRIMARY,
                borderColor: PRIMARY,
                borderRadius: 8,
                fontWeight: 600,
              }}
            >
              Edit Profile
            </Button>
          ) : isEditMode && hasProfileData ? (
            <Button
              icon={<CloseOutlined />}
              onClick={handleCancel}
              disabled={saving}
              style={{
                borderRadius: 8,
                fontWeight: 600,
                borderColor: "#ff4d4f",
                color: "#ff4d4f",
              }}
            >
              Cancel Edit
            </Button>
          ) : null}
        </div>

        <Card
          bordered={false}
          style={{
            borderRadius: 10,
            boxShadow: "0 2px 16px rgba(0,0,0,0.09)",
            border: "1.5px solid #e8e8e8",
          }}
          bodyStyle={{ padding: pad }}
        >
          <Spin
            spinning={saving || pageLoading}
            tip={
              pageLoading
                ? "Loading employee profile..."
                : "Updating employee profile..."
            }
            size="large"
          >
            <Form
              form={form}
              layout="vertical"
              requiredMark={true}
              validateTrigger={["onBlur", "onChange"]}
              onValuesChange={() => {
                if (mobErr) setMobErr("");
              }}
            >
              <div style={sectionLabelStyle(PRIMARY)}>
                Employee Contact & Work Information
              </div>

              <Divider style={dividerStyle(PRIMARY)} />

              <Row gutter={[24, 0]}>
                <Col {...colSpan}>
                  {mobErr && (
                    <Alert
                      type="error"
                      showIcon
                      message={mobErr}
                      style={{ borderRadius: 8, marginBottom: 12 }}
                    />
                  )}

                  <Form.Item
                    label={<Text strong>Employee Mobile Number</Text>}
                    name="mobileNumber"
                    required
                  >
                    <Input
                      size="large"
                      addonBefore="+91"
                      placeholder="Enter employee 10-digit mobile number"
                      maxLength={10}
                      inputMode="numeric"
                      disabled={fieldDisabled}
                      onChange={(e) =>
                        form.setFieldsValue({
                          mobileNumber: digits10(e.target.value),
                        })
                      }
                      style={{ borderRadius: 8 }}
                    />
                  </Form.Item>
                </Col>

                <Col {...colSpan}>
                  <Form.Item
                    label={
                      <Text strong>Employee AI Usage Level (Optional)</Text>
                    }
                    name="aiUsageLevel"
                  >
                    <Select
                      size="large"
                      placeholder="Select employee AI usage level"
                      disabled={fieldDisabled}
                      style={{ width: "100%" }}
                      allowClear
                    >
                      {USAGE.map((u) => (
                        <Select.Option key={u.value} value={u.value}>
                          {u.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col {...colSpan}>
                  <Form.Item
                    label={<Text strong>Employee Working Platforms</Text>}
                    name="projectType"
                    required
                    rules={[
                      {
                        required: true,
                        message: "Please select at least one working platform.",
                      },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      size="large"
                      placeholder="Select employee working platforms"
                      allowClear
                      maxTagCount="responsive"
                      disabled={fieldDisabled}
                      style={{ width: "100%" }}
                    >
                      {PLATFORMS.map((p) => (
                        <Select.Option key={p.value} value={p.value}>
                          {p.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <div style={sectionLabelStyle(SECONDARY)}>
                Employee Skills & AI Tool Details
              </div>

              <Divider style={dividerStyle(SECONDARY)} />

              <Row gutter={[24, 0]}>
                <Col {...colSpan}>
                  <Form.Item
                    label={
                      <Text strong>AI Tools Used by Employee (Optional)</Text>
                    }
                    name="aiTools"
                  >
                    <Input
                      size="large"
                      placeholder="Enter AI tools separated by commas"
                      disabled={fieldDisabled}
                      onBlur={(e) =>
                        form.setFieldsValue({
                          aiTools: cleanText(e.target.value),
                        })
                      }
                      style={{ borderRadius: 8 }}
                    />
                  </Form.Item>
                </Col>

                <Col {...colSpan}>
                  <Form.Item
                    label={<Text strong>Employee Skills (Optional)</Text>}
                    name="skills"
                  >
                    <Input
                      size="large"
                      placeholder="Enter employee skills"
                      disabled={fieldDisabled}
                      onBlur={(e) =>
                        form.setFieldsValue({
                          skills: cleanText(e.target.value),
                        })
                      }
                      style={{ borderRadius: 8 }}
                    />
                  </Form.Item>
                </Col>

                <Col {...colSpan}>
                  <Form.Item
                    label={<Text strong>Employee Role</Text>}
                    name="designation"
                    required
                    rules={[
                      {
                        required: true,
                        message: "Please select employee role.",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      placeholder="Select employee role"
                      disabled={fieldDisabled}
                      style={{ width: "100%" }}
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <Select.Option key={role} value={role}>
                          {role}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              {isEditMode && (
                <>
                  <Divider style={{ marginTop: 8, marginBottom: 24 }} />

                  <Row
                    gutter={[16, 12]}
                    justify={isMobile ? "center" : "start"}
                  >
                    <Col xs={24} sm={10} md={6} lg={5}>
                      <Button
                        type="primary"
                        size="large"
                        block
                        loading={saving}
                        onClick={handleSave}
                        style={{
                          borderRadius: 8,
                          fontWeight: 600,
                          height: 46,
                          background: PRIMARY,
                          borderColor: PRIMARY,
                          fontSize: 15,
                        }}
                      >
                        {hasProfileData ? "Update Profile" : "Save Profile"}
                      </Button>
                    </Col>

                    {hasProfileData && (
                      <Col xs={24} sm={10} md={5} lg={4}>
                        <Button
                          size="large"
                          block
                          disabled={saving}
                          onClick={handleCancel}
                          style={{
                            borderRadius: 8,
                            fontWeight: 600,
                            height: 46,
                            borderColor: SECONDARY,
                            color: SECONDARY,
                            fontSize: 15,
                          }}
                        >
                          Cancel
                        </Button>
                      </Col>
                    )}
                  </Row>
                </>
              )}
            </Form>
          </Spin>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

export default EmployeeProfilePage;
