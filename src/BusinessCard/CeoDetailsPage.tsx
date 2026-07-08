import React, { useEffect, useState } from "react";
import { Col, Form, Input, Row, Select, message } from "antd";
import BusinessCardLayout from "./BusinessCardLayout";
import {
  PageHeader,
  PageCard,
  StickyActions,
  PrimaryButton,
  BC_FORM,
  BC_INPUT,
  BC_SELECT,
} from "./businessCardUi";
import {
  CeoDetailsRequest,
  saveCeoDetails,
  CEO_EVENT_TYPE_OPTIONS,
  isBusinessEventType,
  getLoggedInUserId,
  buildCeoDetailsSavePayload,
} from "./ceoBusinessCardApi";

const { TextArea } = Input;

const CEO_DETAILS_PAGE_LABELS = {
  sectionDescription: "Core identity and user details for your profile.",
  type: "Event Type",
  typePlaceholder: "Select event type",
  typeTooltip: "Choose the event type for this profile.",
  name: "Event Name",
  nameBusinessPlaceholder: "Enter event name",
  nameBusinessTooltip: "Name of the business meeting or occasion.",
  nameCampaignPlaceholder: "Enter event name",
} as const;

const emptyForm = (): CeoDetailsRequest => ({});

const CeoDetailsPage: React.FC = () => {
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(() =>
    getLoggedInUserId()
  );
  const [form, setForm] = useState<CeoDetailsRequest>(emptyForm());
  const [submitting, setSubmitting] = useState(false);
  const isBusinessEvent = isBusinessEventType(form.eventType);

  useEffect(() => {
    setLoggedInUserId(getLoggedInUserId());
  }, []);

  const clearBusinessFields = (next: CeoDetailsRequest): CeoDetailsRequest => ({
    ...next,
    companyName: "",
    designation: "",
    email: "",
    linkedin: "",
    emailSubjectName: "",
  });

  const updateField = (key: keyof CeoDetailsRequest, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "eventType") {
        if (isBusinessEventType(value)) {
          return next;
        }
        return clearBusinessFields(next);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = getLoggedInUserId();
    if (!userId) {
      message.warning("Please login again to save user details.");
      return;
    }

    if (!form.eventType?.trim()) {
      message.warning("Please select an event type.");
      return;
    }

    setSubmitting(true);
    try {
      await saveCeoDetails(buildCeoDetailsSavePayload(form));
      setForm(emptyForm());
      message.success("User details saved successfully.");
    } catch (error) {
      console.error(error);
      message.error("Failed to save user details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BusinessCardLayout>
      <PageHeader
        title="User Details"
        subtitle="Enter your details below and save."
      />

      <form onSubmit={handleSubmit}>
        <PageCard
          title="Basic information"
          description={CEO_DETAILS_PAGE_LABELS.sectionDescription}
        >
          <Form layout="vertical" className={BC_FORM}>
            <Row gutter={[12, 0]}>
              <Col xs={24} sm={12} lg={8}>
                <Form.Item label="Name">
                  <Input
                    value={form.ceoName || ""}
                    onChange={(e) => updateField("ceoName", e.target.value)}
                    placeholder="Full name"
                    className={BC_INPUT}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Form.Item
                  label={CEO_DETAILS_PAGE_LABELS.type}
                  tooltip={CEO_DETAILS_PAGE_LABELS.typeTooltip}
                  required
                >
                  <Select
                    value={form.eventType || undefined}
                    onChange={(value) => updateField("eventType", value)}
                    placeholder={CEO_DETAILS_PAGE_LABELS.typePlaceholder}
                    allowClear
                    className={BC_SELECT}
                    options={CEO_EVENT_TYPE_OPTIONS.map((o) => ({
                      label: o.label,
                      value: o.value,
                    }))}
                  />
                </Form.Item>
              </Col>
              {isBusinessEvent && (
                <>
                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item label="Company Name">
                      <Input
                        value={form.companyName || ""}
                        onChange={(e) => updateField("companyName", e.target.value)}
                        placeholder="Company name"
                        className={BC_INPUT}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item label="Designation">
                      <Input
                        value={form.designation || ""}
                        onChange={(e) => updateField("designation", e.target.value)}
                        placeholder="e.g. Chief Executive Officer"
                        className={BC_INPUT}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item
                      label={CEO_DETAILS_PAGE_LABELS.name}
                      tooltip={CEO_DETAILS_PAGE_LABELS.nameBusinessTooltip}
                    >
                      <Input
                        value={form.eventName || ""}
                        onChange={(e) => updateField("eventName", e.target.value)}
                        placeholder={CEO_DETAILS_PAGE_LABELS.nameBusinessPlaceholder}
                        className={BC_INPUT}
                      />
                    </Form.Item>
                  </Col>
                </>
              )}
              {!isBusinessEvent && form.eventType && (
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item label={CEO_DETAILS_PAGE_LABELS.name}>
                    <Input
                      value={form.eventName || ""}
                      onChange={(e) => updateField("eventName", e.target.value)}
                      placeholder={CEO_DETAILS_PAGE_LABELS.nameCampaignPlaceholder}
                      className={BC_INPUT}
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Form>
        </PageCard>

        <PageCard
          title="Contact details"
          description="How attendees and partners can reach you."
        >
          <Form layout="vertical" className={BC_FORM}>
            <Row gutter={[12, 0]}>
              <Col xs={24} sm={12} lg={8}>
                <Form.Item label="Mobile">
                  <Input
                    value={form.mobile || ""}
                    onChange={(e) => updateField("mobile", e.target.value)}
                    placeholder="+91 ..."
                    className={BC_INPUT}
                    inputMode="tel"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Form.Item label="WhatsApp">
                  <Input
                    value={form.whatsapp || ""}
                    onChange={(e) => updateField("whatsapp", e.target.value)}
                    placeholder="WhatsApp number"
                    className={BC_INPUT}
                    inputMode="tel"
                  />
                </Form.Item>
              </Col>
              {isBusinessEvent && (
                <>
                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item label="Email">
                      <Input
                        type="email"
                        value={form.email || ""}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="email@company.com"
                        className={BC_INPUT}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item label="LinkedIn">
                      <Input
                        value={form.linkedin || ""}
                        onChange={(e) => updateField("linkedin", e.target.value)}
                        placeholder="LinkedIn profile URL"
                        className={BC_INPUT}
                      />
                    </Form.Item>
                  </Col>
                </>
              )}
              <Col xs={24} sm={12} lg={8}>
                <Form.Item label="Location">
                  <Input
                    value={form.location || ""}
                    onChange={(e) => updateField("location", e.target.value)}
                    placeholder="City, country"
                    className={BC_INPUT}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </PageCard>

        <PageCard title="Message content">
          <Form layout="vertical" className={BC_FORM}>
            {isBusinessEvent && (
              <Form.Item
                label="Email Subject"
                tooltip="Subject line used when sending outreach emails."
              >
                <Input
                  value={form.emailSubjectName || ""}
                  onChange={(e) => updateField("emailSubjectName", e.target.value)}
                  placeholder="e.g. Great connecting at the summit"
                  className={BC_INPUT}
                />
              </Form.Item>
            )}
            <Form.Item
              label="Content / Email Body"
              tooltip="Used in outreach or follow-up communications."
            >
              <TextArea
                value={form.content || ""}
                onChange={(e) => updateField("content", e.target.value)}
                placeholder="Write the message or email body..."
                rows={5}
                className="!rounded-md !text-[13px]"
              />
            </Form.Item>
          </Form>

          <StickyActions>
            <PrimaryButton
              htmlType="submit"
              loading={submitting}
              disabled={!loggedInUserId}
              block
              className="lg:!w-auto lg:!min-w-[180px]"
            >
              Save User Details
            </PrimaryButton>
          </StickyActions>
        </PageCard>
      </form>
    </BusinessCardLayout>
  );
};

export default CeoDetailsPage;
