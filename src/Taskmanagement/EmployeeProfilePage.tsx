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
  Tag,
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
  { value: "high", label: "High", color: "green", field: "aiToolsHigh" },
  { value: "moderate", label: "Medium", color: "gold", field: "aiToolsModerate" },
  { value: "low", label: "Low", color: "blue", field: "aiToolsLow" },
] as const;

type UsageLevel = (typeof USAGE)[number]["value"];

type AiToolsByLevel = Record<UsageLevel, string>;

const buildToolUsageArray = (byLevel: Partial<AiToolsByLevel>) => {
  const result: Array<{ usageLevel: string; tools: string[] }> = [];

  if (byLevel.high?.trim()) {
    result.push({
      usageLevel: "HIGH",
      tools: byLevel.high.split(",").map((t) => t.trim()).filter(Boolean),
    });
  }
  if (byLevel.moderate?.trim()) {
    result.push({
      usageLevel: "MODERATE",
      tools: byLevel.moderate.split(",").map((t) => t.trim()).filter(Boolean),
    });
  }
  if (byLevel.low?.trim()) {
    result.push({
      usageLevel: "LOW",
      tools: byLevel.low.split(",").map((t) => t.trim()).filter(Boolean),
    });
  }

  return result;
};

const parseToolUsage = (
  toolUsage?: Array<{ usageLevel: string; tools: string[] }>,
): AiToolsByLevel => {
  const empty: AiToolsByLevel = { high: "", moderate: "", low: "" };

  if (!toolUsage || !Array.isArray(toolUsage)) return empty;

  const result = { ...empty };

  toolUsage.forEach((item) => {
    const level = item.usageLevel?.toUpperCase();
    const tools = item.tools?.join(", ") || "";

    if (level === "HIGH") result.high = tools;
    else if (level === "MODERATE") result.moderate = tools;
    else if (level === "LOW") result.low = tools;
  });

  return result;
};

const parseDesignations = (designation?: string): string[] => {
  const trimmed = (designation || "").trim();
  if (!trimmed) return [];

  return trimmed
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

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
      const aiToolsByLevel = parseToolUsage(data.toolUsage);
      const designations = parseDesignations(data.designation);

      console.log("API Response toolUsage:", data.toolUsage);
      console.log("Parsed aiToolsByLevel:", aiToolsByLevel);
      console.log("Form values being set:", {
        aiToolsHigh: aiToolsByLevel.high,
        aiToolsModerate: aiToolsByLevel.moderate,
        aiToolsLow: aiToolsByLevel.low,
        designation: designations,
      });

      const hasData =
        !!cleanText(data.skills) ||
        !!aiToolsByLevel.high ||
        !!aiToolsByLevel.moderate ||
        !!aiToolsByLevel.low ||
        designations.length > 0 ||
        projectTypes.length > 0;

      setHasProfileData(hasData);

      const formValues = {
        mobileNumber: digits10(
          sessionStorage.getItem("mobileNumber") || savedMobile,
        ),
        skills: cleanText(data.skills),
        aiToolsHigh: aiToolsByLevel.high,
        aiToolsModerate: aiToolsByLevel.moderate,
        aiToolsLow: aiToolsByLevel.low,
        projectType: projectTypes,
        designation: designations,
      };

      form.setFieldsValue(formValues);

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

    const vals = form.getFieldsValue(true);

    const mobile = digits10(vals.mobileNumber || "");
    const skills = cleanText(vals.skills);
    const projectType = vals.projectType || [];
    const designations: string[] = vals.designation || [];

    const aiToolsByLevel = {
      high: cleanText(vals.aiToolsHigh),
      moderate: cleanText(vals.aiToolsModerate),
      low: cleanText(vals.aiToolsLow),
    };

    const toolUsage = buildToolUsageArray(aiToolsByLevel);
    const designation = designations.join(", ");

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
        designation,
        employeeId: userId,
        projectType: projectType.join(", "),
        skills,
        toolUsage,
      };

      await employeeApi.patch(
        `${BASE_URL}/user-service/write/updateEmployeeSkills`,
        employeeSkillsPayload,
      );

      setIsEditMode(false);
      setHasProfileData(true);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Employee profile updated successfully.",
      });

      getEmployeeSkills();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Unable to update employee profile. Please try again.";

      setMobErr(msg);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: msg,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setMobErr("");
    setIsEditMode(false);
    form.resetFields();
    getEmployeeSkills();

    Swal.fire({
      icon: "info",
      title: "Info",
      text: "Edit cancelled.",
    });
  };

  const fieldDisabled =
    saving || pageLoading || (hasProfileData && !isEditMode);

  const aiToolsHigh = Form.useWatch("aiToolsHigh", form) as string | undefined;
  const aiToolsModerate = Form.useWatch("aiToolsModerate", form) as
    | string
    | undefined;
  const aiToolsLow = Form.useWatch("aiToolsLow", form) as string | undefined;
  const selectedRoles = Form.useWatch("designation", form) as
    | string[]
    | undefined;

  console.log("Current form watch values:", {
    aiToolsHigh,
    aiToolsModerate,
    aiToolsLow,
    selectedRoles,
    isEditMode,
    hasProfileData,
  });

  const getToolsForLevel = (level: UsageLevel) => {
    if (level === "high") return aiToolsHigh;
    if (level === "moderate") return aiToolsModerate;
    return aiToolsLow;
  };

  const pad = isMobile ? "16px 14px" : "36px 40px";
  const colSpan = { xs: 24, sm: 12, md: 8 };
  const halfSpan = { xs: 24, sm: 12, md: 12 };
  const toolsColSpan = { xs: 24, sm: 24, md: 8 };

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

                <Col {...halfSpan}>
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

              <Row gutter={[24, 16]}>
                <Col span={24}>
                  <div style={{ marginBottom: 16 }}>
                    <Text strong style={{ display: "block", marginBottom: 4 }}>
                      AI Tools Used by Employee (Optional)
                    </Text>
                    <Text
                      type="secondary"
                      style={{
                        display: "block",
                        marginBottom: 12,
                        fontSize: 13,
                      }}
                    >
                      Enter tools for High, Medium, and Low separately. All
                      three fields are always shown — fill only what you use,
                      then save.
                    </Text>

                    <Row gutter={[16, 16]}>
                      {USAGE.map((level) => (
                        <Col key={level.value} {...toolsColSpan}>
                          <Form.Item
                            label={
                              <Tag color={level.color} style={{ margin: 0 }}>
                                {level.label} usage tools
                              </Tag>
                            }
                            name={level.field}
                            style={{ marginBottom: 0 }}
                          >
                            <Input.TextArea
                              rows={3}
                              size="large"
                              disabled={fieldDisabled}
                              placeholder={`Tools for ${level.label} usage (comma separated)`}
                              style={{ borderRadius: 8 }}
                              onBlur={(e) =>
                                form.setFieldsValue({
                                  [level.field]: cleanText(e.target.value),
                                })
                              }
                            />
                          </Form.Item>
                        </Col>
                      ))}
                    </Row>
                  </div>
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

                <Col xs={24} sm={24} md={16}>
                  <Form.Item
                    label={<Text strong>Employee Roles</Text>}
                    name="designation"
                    required
                    rules={[
                      {
                        required: true,
                        message: "Please select at least one employee role.",
                      },
                    ]}
                    extra={
                      !isEditMode && (selectedRoles?.length ?? 0) > 0 ? (
                        <div style={{ marginTop: 8 }}>
                          {selectedRoles!.map((role) => (
                            <Tag key={role} color={PRIMARY} style={{ marginBottom: 4, marginRight: 4 }}>
                              {role}
                            </Tag>
                          ))}
                        </div>
                      ) : (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Select one or more roles that match your work.
                        </Text>
                      )
                    }
                  >
                    <Select
                      mode="multiple"
                      size="large"
                      placeholder="Search and select employee roles"
                      disabled={fieldDisabled}
                      allowClear
                      maxTagCount="responsive"
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        String(option?.children ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
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