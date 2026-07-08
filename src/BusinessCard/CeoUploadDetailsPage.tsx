import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Col, Form, Grid, Image, Row, Select, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import BusinessCardLayout from "./BusinessCardLayout";
import {
  PageHeader,
  PageCard,
  EmptyState,
  InfoBanner,
  LoadingState,
  StatChip,
  StatRow,
  OutlineSuccessButton,
  BC_FORM,
  BC_SELECT,
  BC_TABLE,
} from "./businessCardUi";
import {
  BusinessUploadDataDto,
  BusinessUploadDataGroup,
  fetchCeoDataUploadDetails,
  fetchCeoDetailsByUserId,
  getLoggedInUserId,
  formatEventTypeLabel,
  isBusinessEventType,
  pickActiveCeoRecord,
  processBusinessCard,
} from "./ceoBusinessCardApi";

const { useBreakpoint } = Grid;

const formatMultiValue = (value?: string) =>
  value
    ? value
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
        .join(", ")
    : "-";

const pickDefaultEventType = (groups: BusinessUploadDataGroup[]): string => {
  const withRecords = groups.find((group) => group.list.length > 0);
  return withRecords?.eventType || groups[0]?.eventType || "";
};

const CeoUploadDetailsPage: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [eventGroups, setEventGroups] = useState<BusinessUploadDataGroup[]>([]);
  const [selectedEventType, setSelectedEventType] = useState("");
  const [activeEventType, setActiveEventType] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [cardFile, setCardFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const loggedInUserId = getLoggedInUserId();

  const isBusinessEvent = isBusinessEventType(selectedEventType);
  const activeMatchesSelection =
    !selectedEventType ||
    !activeEventType ||
    activeEventType.toUpperCase() === selectedEventType.toUpperCase();

  const rows = useMemo(() => {
    const group = eventGroups.find((item) => item.eventType === selectedEventType);
    return group?.list || [];
  }, [eventGroups, selectedEventType]);

  const loadUploadDetails = useCallback(async () => {
    if (!loggedInUserId) {
      message.warning("Please login again to view your upload details.");
      return;
    }

    setLoading(true);
    setLoaded(true);
    try {
      const [groups, ceoRecords] = await Promise.all([
        fetchCeoDataUploadDetails(loggedInUserId),
        fetchCeoDetailsByUserId(loggedInUserId),
      ]);

      const active = pickActiveCeoRecord(ceoRecords, loggedInUserId);
      setActiveEventType(active?.eventType || "");

      const mergedTypes = new Map<string, BusinessUploadDataGroup>();
      groups.forEach((group) => mergedTypes.set(group.eventType, group));
      ceoRecords.forEach((record) => {
        const type = record.eventType?.trim();
        if (type && !mergedTypes.has(type)) {
          mergedTypes.set(type, { eventType: type, list: [] });
        }
      });

      const mergedGroups = Array.from(mergedTypes.values());
      setEventGroups(mergedGroups);
      setSelectedEventType((current) => {
        if (current && mergedGroups.some((group) => group.eventType === current)) {
          return current;
        }
        if (active?.eventType && mergedGroups.some((group) => group.eventType === active.eventType)) {
          return active.eventType;
        }
        return pickDefaultEventType(mergedGroups);
      });
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch upload details.");
    } finally {
      setLoading(false);
    }
  }, [loggedInUserId]);

  useEffect(() => {
    loadUploadDetails();
  }, [loadUploadDetails]);

  useEffect(() => {
    if (isBusinessEvent) {
      setMobileNumber("");
    } else {
      setCardFile(null);
    }
  }, [isBusinessEvent]);

  const resetUploadForm = () => {
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
    if (!selectedEventType) {
      message.warning("Please select an eventType.");
      return;
    }
    if (!activeMatchesSelection) {
      message.warning(
        `Your active user profile is ${formatEventTypeLabel(activeEventType)}. Set a ${formatEventTypeLabel(selectedEventType)} profile as Active in User Details List before uploading.`
      );
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
      resetUploadForm();
      await loadUploadDetails();
    } catch (error) {
      console.error(error);
      message.error("Failed to process upload.");
    } finally {
      setUploading(false);
    }
  };

  const getRowKey = (row: BusinessUploadDataDto, index: number) =>
    `${row.id || row.eventId || row.personName || "row"}-${row.image || row.originalImage || index}-${index}`;

  const columns: ColumnsType<BusinessUploadDataDto> = useMemo(() => {
    const base: ColumnsType<BusinessUploadDataDto> = [
      {
        title: "Mobile",
        dataIndex: "mobileNumber",
        key: "mobileNumber",
        render: (value) => formatMultiValue(value),
      },
      {
        title: "Photo",
        key: "profilePhoto",
        render: (_, row) => {
          const src = row.originalImage || row.image;
          return src ? (
            <Image src={src} width={64} height={64} style={{ objectFit: "cover" }} alt="Photo" />
          ) : (
            "-"
          );
        },
      },
    ];

    if (!isBusinessEvent) {
      return base;
    }

    return [
      {
        title: "Name",
        dataIndex: "personName",
        key: "personName",
        render: (value) => value || "-",
      },
      {
        title: "Company",
        dataIndex: "companyName",
        key: "companyName",
        render: (value) => value || "-",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        ellipsis: true,
        render: (value) => formatMultiValue(value),
      },
      ...base,
      {
        title: "Business Card",
        key: "businessCard",
        render: (_, row) => {
          const src = row.businessCard;
          return src ? (
            <Image src={src} width={64} height={64} style={{ objectFit: "cover" }} alt="Business card" />
          ) : (
            "-"
          );
        },
      },
    ];
  }, [isBusinessEvent]);

  return (
    <BusinessCardLayout>
      <PageHeader
        title="Upload Details"
        subtitle={
          isBusinessEvent
            ? "Upload business cards and review extracted contact details by eventType."
            : "Enter a mobile number, upload a photo, and review sent records by eventType."
        }
        actions={
          <OutlineSuccessButton onClick={loadUploadDetails} loading={loading} disabled={!loggedInUserId}>
            Refresh
          </OutlineSuccessButton>
        }
      />

      <StatRow>
        <StatChip label="Total records" value={rows.length} />
        <StatChip
          label="eventType"
          value={selectedEventType ? formatEventTypeLabel(selectedEventType) : "—"}
        />
        <StatChip
          label="Upload mode"
          value={selectedEventType ? (isBusinessEvent ? "Business card" : "Photo + mobile") : "—"}
        />
      </StatRow>

      <PageCard title="Filter by user details">
        <Form layout="vertical" className={BC_FORM}>
          <Row gutter={[12, 0]}>
            <Col xs={24} md={10} lg={8}>
              <Form.Item
                label="eventType"
                tooltip="Options and records update when you change the eventType."
                className="!mb-0"
              >
                <Select
                  value={selectedEventType || undefined}
                  onChange={setSelectedEventType}
                  disabled={loading || eventGroups.length === 0}
                  placeholder="Select eventType"
                  options={eventGroups.map((group) => ({
                    value: group.eventType,
                    label: `${formatEventTypeLabel(group.eventType)} (${group.list.length})`,
                  }))}
                  className={BC_SELECT}
                />
              </Form.Item>
            </Col>
            {/* <Col xs={24} md={12}>
              <Form.Item label="Logged-in User ID" style={{ marginBottom: 0 }}>
                <Typography.Text copyable={!!loggedInUserId} style={{ wordBreak: "break-all" }}>
                  {loggedInUserId || "Not available"}
                </Typography.Text>
              </Form.Item>
            </Col> */}
          </Row>
        </Form>

        {selectedEventType && !activeMatchesSelection && (
          <InfoBanner variant="warning">
            Active user profile is <strong>{formatEventTypeLabel(activeEventType)}</strong>. To upload
            for <strong>{formatEventTypeLabel(selectedEventType)}</strong>, set that profile as Active
            in User Details List.
          </InfoBanner>
        )}
      </PageCard>

    

      <PageCard
        title={isBusinessEvent ? "Business card records" : "Upload records"}
        description={
          selectedEventType
            ? `${formatEventTypeLabel(selectedEventType)} · ${rows.length} record(s) found`
            : `${rows.length} record(s) found`
        }
      >
        {loading ? (
          <LoadingState message="Loading your uploads..." />
        ) : !loaded ? (
          <EmptyState
            title="Loading uploads"
            description="Fetching your upload details using your login user ID."
          />
        ) : rows.length === 0 ? (
          <EmptyState
            title="No uploads found"
            description={
              selectedEventType
                ? `No uploads found for ${formatEventTypeLabel(selectedEventType)}. Use the form above to add one.`
                : "Select an eventType to view or add uploads."
            }
          />
        ) : (
          <Table
            rowKey={(row, index) => getRowKey(row, index ?? 0)}
            columns={columns}
            dataSource={rows}
            size={isMobile ? "small" : "middle"}
            pagination={{ pageSize: 10, showSizeChanger: !isMobile, responsive: true }}
            scroll={{ x: isBusinessEvent ? 960 : 480 }}
            className={BC_TABLE}
          />
        )}
      </PageCard>
    </BusinessCardLayout>
  );
};

export default CeoUploadDetailsPage;
