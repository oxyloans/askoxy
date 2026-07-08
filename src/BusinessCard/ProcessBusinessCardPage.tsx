import React, { useCallback, useEffect, useState } from "react";
import { Col, Form, Input, Row, message } from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import BusinessCardLayout from "./BusinessCardLayout";
import {
  PageHeader,
  PageCard,
  InfoBanner,
  LoadingState,
  StatChip,
  StatRow,
  UploadZone,
  StickyActions,
  OutlineSuccessButton,
  PrimaryButton,
  BC_FORM,
  BC_INPUT,
} from "./businessCardUi";
import { COLOR_PRIMARY } from "./businessCardTheme";
import {
  fetchCeoDetailsByUserId,
  formatEventTypeLabel,
  getLoggedInUserId,
  isBusinessEventType,
  pickActiveCeoRecord,
  processBusinessCard,
} from "./ceoBusinessCardApi";

const EVENT_TYPE_LABEL = "eventType";

const ProcessBusinessCardPage: React.FC = () => {
  const loggedInUserId = getLoggedInUserId();
  const [eventType, setEventType] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [cardFile, setCardFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [uploading, setUploading] = useState(false);

  const isBusinessEvent = isBusinessEventType(eventType);

  const loadEventType = useCallback(async () => {
    if (!loggedInUserId) {
      setEventType("");
      return;
    }

    setLoadingProfile(true);
    try {
      const records = await fetchCeoDetailsByUserId(loggedInUserId);
      const active = pickActiveCeoRecord(records, loggedInUserId);
      setEventType(active?.eventType || "");
    } catch (error) {
      console.error(error);
      message.error(`Failed to load your active ${EVENT_TYPE_LABEL}.`);
      setEventType("");
    } finally {
      setLoadingProfile(false);
    }
  }, [loggedInUserId]);

  useEffect(() => {
    loadEventType();
  }, [loadEventType]);

  useEffect(() => {
    if (isBusinessEvent) {
      setMobileNumber("");
    } else {
      setCardFile(null);
    }
  }, [isBusinessEvent]);

  const resetForm = () => {
    setCardFile(null);
    setPhotoFile(null);
    setMobileNumber("");
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loggedInUserId) {
      message.warning("Please login again to upload.");
      return;
    }
    if (!eventType) {
      message.warning("Please save user details with an eventType first.");
      return;
    }

    if (isBusinessEvent) {
      if (!cardFile) {
        message.warning("Please select a business card file.");
        return;
      }
    } else {
      if (!photoFile) {
        message.warning("Please select a photo.");
        return;
      }
      if (!mobileNumber.trim()) {
        message.warning("Please enter a mobile number.");
        return;
      }
    }

    setUploading(true);
    try {
      const result = await processBusinessCard({
        messageId: loggedInUserId,
        file: isBusinessEvent ? cardFile || undefined : undefined,
        photo: photoFile || undefined,
        mobileNumber: !isBusinessEvent ? mobileNumber.trim() : undefined,
      });
      message.success(result || "Upload processed successfully.");
      resetForm();
    } catch (error) {
      console.error(error);
      message.error("Failed to process upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <BusinessCardLayout>
      <PageHeader
        title="Process Business Card"
        subtitle={
          isBusinessEvent
            ? "Upload a business card image and optional profile photo for automated contact extraction."
            : "Upload a profile photo and enter the recipient mobile number for non-business events."
        }
      />

      <StatRow>
        <StatChip label="User ID" value={loggedInUserId ? "Connected" : "Not available"} />
        <StatChip
          label={EVENT_TYPE_LABEL}
          value={eventType ? formatEventTypeLabel(eventType) : "Not set"}
        />
        <StatChip label="Upload mode" value={isBusinessEvent ? "Business card" : "Photo + mobile"} />
      </StatRow>

      <PageCard
        title="Your profile"
        description="eventType is loaded from your active user profile."
        headerActions={
          <OutlineSuccessButton onClick={loadEventType} loading={loadingProfile} disabled={!loggedInUserId}>
            Refresh {EVENT_TYPE_LABEL}
          </OutlineSuccessButton>
        }
      >
        {/* <Form.Item label="Logged-in User ID" style={{ marginBottom: 0 }}>
          <Input.TextArea
            value={loggedInUserId || "Not available — please sign in again"}
            autoSize
            readOnly
          />
        </Form.Item> */}

        {loadingProfile ? (
          <LoadingState message={`Loading ${EVENT_TYPE_LABEL}...`} />
        ) : eventType ? (
          <InfoBanner variant="info">
            {EVENT_TYPE_LABEL}: <strong>{formatEventTypeLabel(eventType)}</strong>
          </InfoBanner>
        ) : (
          <InfoBanner variant="warning">
            No active user profile found. Save user details and set one profile as Active, then return here.
          </InfoBanner>
        )}
      </PageCard>

      {eventType && (
      <form onSubmit={handleUpload}>
        {isBusinessEvent ? (
          <PageCard
            title="Business card upload"
            description="Upload a business card file. Profile photo is optional."
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <UploadZone
                  label="Business card file"
                  required
                  hint="PNG, JPG, WEBP, or PDF"
                  fileName={cardFile?.name}
                  placeholder="Drag & drop or click to upload"
                  subtext="PNG, JPG, WEBP, or PDF"
                  accept="image/*,.pdf"
                  onChange={setCardFile}
                  icon={<InboxOutlined style={{ fontSize: 40, color: COLOR_PRIMARY }} />}
                />
              </Col>
              <Col xs={24} lg={12}>
                <UploadZone
                  label="Profile photo"
                  hint="Optional photo attached with the business card."
                  fileName={photoFile?.name}
                  placeholder="Tap to choose photo"
                  accept="image/*"
                  onChange={setPhotoFile}
                  icon={<UploadOutlined style={{ fontSize: 32, color: COLOR_PRIMARY }} />}
                />
              </Col>
            </Row>
          </PageCard>
        ) : (
          <PageCard
            title="Photo & mobile"
            description="For non-business events, upload a photo and enter the recipient mobile number. No business card file is required."
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <UploadZone
                  label="Photo"
                  required
                  hint="Image sent to the recipient via WhatsApp."
                  fileName={photoFile?.name}
                  placeholder="Tap to choose photo"
                  subtext="JPG, PNG, or WEBP"
                  accept="image/*"
                  onChange={setPhotoFile}
                  icon={<UploadOutlined style={{ fontSize: 40, color: COLOR_PRIMARY }} />}
                />
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Mobile number"
                  required
                  tooltip="Recipient WhatsApp number including country code."
                  className={`${BC_FORM} !mb-0`}
                >
                  <Input
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    inputMode="tel"
                    className={BC_INPUT}
                  />
                </Form.Item>
              </Col>
            </Row>
          </PageCard>
        )}

        <PageCard>
          <StickyActions>
            <PrimaryButton
              htmlType="submit"
              loading={uploading}
              disabled={loadingProfile || !loggedInUserId || !eventType}
              block
              className="lg:!w-auto lg:!min-w-[200px]"
            >
              {isBusinessEvent ? "Process Business Card" : "Send Photo & Mobile"}
            </PrimaryButton>
          </StickyActions>
        </PageCard>
      </form>
      )}
    </BusinessCardLayout>
  );
};

export default ProcessBusinessCardPage;
